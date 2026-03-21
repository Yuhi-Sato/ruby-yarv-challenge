import { useState, useCallback, useEffect } from 'react'
import type { ChallengeState, RunResult } from '../types'
import { STEPS } from '../steps'
import { parseRunResult, rubyLiteral } from '../lib/parseRunResult'

import challengePatchRb from '../ruby/system/challenge_patch.rb?raw'
import challengeResetRb from '../ruby/system/challenge_reset.rb?raw'
import testRunnerRb from '../ruby/system/test_runner.rb?raw'

const STORAGE_KEY = 'ruby-yarv-challenge-v2'

function loadSavedState(): { currentStep?: number; userCode?: Record<number, string>; completedSteps?: number[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

interface UseChallengeOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vmRef: React.RefObject<any>
}

export function useChallenge({ vmRef }: UseChallengeOptions) {
  const [state, setState] = useState<ChallengeState>(() => {
    const saved = loadSavedState()
    return {
      currentStep: saved.currentStep ?? 0,
      userCode: saved.userCode ?? {},
      completedSteps: saved.completedSteps ?? [],
      lastResult: null,
      isRunning: false,
    }
  })

  const { currentStep, userCode, completedSteps } = state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentStep, userCode, completedSteps }))
    } catch {
      // Ignore storage errors
    }
  }, [currentStep, userCode, completedSteps])

  const goToStep = useCallback((stepId: number) => {
    const step = STEPS.find(s => s.id === stepId)
    if (step) {
      setState(s => ({
        ...s,
        currentStep: stepId,
        userCode: s.userCode[stepId] !== undefined
          ? s.userCode
          : { ...s.userCode, [stepId]: step.stub },
        lastResult: null,
      }))
    }
  }, [])

  const updateCode = useCallback((code: string) => {
    setState(s => ({
      ...s,
      userCode: { ...s.userCode, [s.currentStep]: code },
    }))
  }, [])

  const runTests = useCallback(async () => {
    if (!vmRef.current || state.isRunning) {
      return
    }

    setState(s => ({ ...s, isRunning: true }))

    try {
      const currentStep = STEPS.find(s => s.id === state.currentStep)
      if (!currentStep) throw new Error('Step not found')
      if (!vmRef.current) throw new Error('VM not initialized')

      if (currentStep.testCases.length === 0) {
        setState(s => ({ ...s, isRunning: false }))
        return
      }

      const stepsUpToCurrent = STEPS
        .filter(s => s.id >= 1 && s.id <= state.currentStep)
        .sort((a, b) => a.id - b.id)

      const accumulatedUserCode = stepsUpToCurrent
        .map(s => state.userCode[s.id] ?? s.stub)
        .join('\n\n')

      const testInvocations = currentStep.testCases
        .map(tc => {
          const expectedStr = rubyLiteral(tc.expected)
          return `runner.test(${JSON.stringify(tc.description)}, ${JSON.stringify(tc.source)}, ${expectedStr})`
        })
        .join('\n')

      const fullCode = [
        challengePatchRb,
        challengeResetRb,
        testRunnerRb,
        accumulatedUserCode,
        `
$challenge_output = ""
$test_output = []
_vm = YRuby.new
runner = ChallengeTestRunner.new(_vm)

${testInvocations}

$test_output << "---START_REPORT---"
$test_output << runner.report
$test_output << "---END_REPORT---"

if runner.all_passed?
  $test_output << "---DISASM_START---"
  begin
    ast = YRuby::Parser.new.parse(${JSON.stringify(currentStep.testCases[0]?.source || '')})
    iseq = YRuby::Iseq.iseq_new_main(ast)
    $test_output << iseq.disasm
  rescue => e
    $test_output << "Error: #{e.message}"
  end
  $test_output << "---DISASM_END---"
end

$test_output.join("\\n")
        `,
      ].join('\n\n')

      const result = vmRef.current.eval(fullCode)
      const output = result.toString()
      const parsedResult = parseRunResult(output)
      setState(s => ({
        ...s,
        lastResult: parsedResult,
        isRunning: false,
        completedSteps: parsedResult.allPassed
          ? s.completedSteps.includes(s.currentStep) ? s.completedSteps : [...s.completedSteps, s.currentStep]
          : s.completedSteps.filter(id => id !== s.currentStep),
      }))
    } catch (e) {
      console.error('Test execution error:', e)
      const errorMsg = e instanceof Error ? e.message : String(e)
      const errorResult: RunResult = {
        passed: false,
        allPassed: false,
        bytecodeDisasm: '',
        testResults: [],
        errorMessage: errorMsg,
      }
      setState(s => ({ ...s, lastResult: errorResult, isRunning: false }))
    }
  }, [vmRef, state.userCode, state.currentStep, state.isRunning])

  return {
    state,
    goToStep,
    updateCode,
    runTests,
  }
}
