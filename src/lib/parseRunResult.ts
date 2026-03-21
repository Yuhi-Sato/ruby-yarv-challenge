import type { RunResult, TestResult } from '../types'

export function rubyLiteral(value: number | string | boolean | null): string {
  if (value === null) return 'nil'
  if (value === true) return 'true'
  if (value === false) return 'false'
  if (typeof value === 'string') return JSON.stringify(value)
  return String(value)
}

export function parseRunResult(output: string): RunResult {
  const lines = output.split('\n')

  let reportStart = -1
  let reportEnd = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('---START_REPORT---')) reportStart = i
    if (lines[i].includes('---END_REPORT---')) reportEnd = i
  }

  let report = ''
  if (reportStart >= 0 && reportEnd > reportStart) {
    report = lines.slice(reportStart + 1, reportEnd).join('\n')
  }

  let bytecodeDisasm = ''
  let disasmStart = -1
  let disasmEnd = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('---DISASM_START---')) disasmStart = i
    if (lines[i].includes('---DISASM_END---')) disasmEnd = i
  }

  if (disasmStart >= 0 && disasmEnd > disasmStart) {
    bytecodeDisasm = lines.slice(disasmStart + 1, disasmEnd).join('\n')
  }

  const testResults: TestResult[] = []
  let allPassed = true

  const reportLines = report.split('\n')
  for (let i = 0; i < reportLines.length; i++) {
    const line = reportLines[i]
    if (line.startsWith('[PASS]')) {
      testResults.push({
        description: line.substring(6).trim(),
        passed: true,
        expected: '',
        got: '',
      })
    } else if (line.startsWith('[FAIL]')) {
      allPassed = false
      const rest = line.substring(6).trim()
      const match = rest.match(/(.+): expected=(.+), got=(.+)/)
      const nextLine = reportLines[i + 1]
      const errorMsg = nextLine?.trimStart().startsWith('Error:')
        ? nextLine.trim().substring(7).trim()
        : undefined
      if (errorMsg) i++
      if (match) {
        testResults.push({
          description: match[1],
          passed: false,
          expected: match[2],
          got: match[3],
          error: errorMsg,
        })
      } else {
        testResults.push({
          description: rest,
          passed: false,
          expected: '',
          got: '',
          error: errorMsg,
        })
      }
    }
  }

  return {
    passed: allPassed,
    allPassed,
    bytecodeDisasm,
    testResults,
    errorMessage: null,
  }
}
