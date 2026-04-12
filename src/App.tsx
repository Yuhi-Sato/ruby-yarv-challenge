import { useEffect, useRef } from 'react'
import { useRubyVM } from './hooks/useRubyVM'
import { useChallenge } from './hooks/useChallenge'
import { Header } from './components/layout/Header'
import { Layout } from './components/layout/Layout'
import { Footer } from './components/layout/Footer'
import { StepNav } from './components/challenge/StepNav'
import { TutorialPane } from './components/challenge/TutorialPane'
import { EditorPane } from './components/challenge/EditorPane'
import { ResultPane } from './components/challenge/ResultPane'
import { LoadingScreen } from './components/screens/LoadingScreen'
import { ErrorScreen } from './components/screens/ErrorScreen'
import { STEPS } from './steps'

function App() {
  const { vmRef, status, error } = useRubyVM()
  const { state, goToStep, updateCode, runTests, downloadCode } = useChallenge({ vmRef })
  const currentStep = STEPS.find(s => s.id === state.currentStep)
  const runButtonRef = useRef<HTMLButtonElement>(null)

  // URL query parameter: ?step=N
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const stepParam = params.get('step')
    if (stepParam !== null) {
      const stepId = parseInt(stepParam, 10)
      if (!isNaN(stepId) && STEPS.some(s => s.id === stepId)) {
        goToStep(stepId)
      }
    }
  }, [goToStep])

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        runButtonRef.current?.click()
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (status === 'error') {
    return <ErrorScreen error={error ?? 'Unknown error'} />
  }

  if (!currentStep) return null

  // Step 0: Introduction (full-width, no 3-pane)
  if (state.currentStep === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <StepNav
          currentStep={state.currentStep}
          completedSteps={state.completedSteps}
          onStepChange={goToStep}
        />
        <div className="flex-1 max-w-3xl mx-auto px-6 py-8">
          <TutorialPane step={currentStep} result={null} />
          <div className="mt-6 text-center">
            <button
              className="px-8 py-3 bg-ruby-600 hover:bg-ruby-700 text-white font-medium rounded-lg transition-colors text-lg"
              onClick={() => goToStep(1)}
            >
              Start Challenge
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Steps 1-7: 3-pane layout
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <StepNav
        currentStep={state.currentStep}
        completedSteps={state.completedSteps}
        onStepChange={goToStep}
      />
      <Layout
        left={<TutorialPane step={currentStep} result={state.lastResult} />}
        center={
          <EditorPane
            code={state.userCode[state.currentStep] ?? currentStep.stub}
            onChange={updateCode}
            onReset={() => updateCode(currentStep.stub)}
            isRunning={state.isRunning}
          />
        }
        right={
          <ResultPane
            result={state.lastResult}
            expectedBytecode={currentStep.bytecodePreview}
            onNextStep={() => goToStep(state.currentStep + 1)}
            isLastStep={state.currentStep === STEPS[STEPS.length - 1].id}
          />
        }
      />
      <Footer
        onRun={runTests}
        isRunning={state.isRunning}
        runButtonRef={runButtonRef}
        onDownload={downloadCode}
      />
    </div>
  )
}

export default App
