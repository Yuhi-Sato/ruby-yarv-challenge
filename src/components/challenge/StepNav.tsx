import { STEPS } from '../../steps'

interface StepNavProps {
  currentStep: number
  completedSteps: number[]
  onStepChange: (stepId: number) => void
}

export function StepNav({ currentStep, completedSteps, onStepChange }: StepNavProps) {
  return (
    <div className="w-full">
      <div className="flex items-center overflow-x-auto pb-2">
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = completedSteps.includes(step.id) && !isActive

          return (
            <div key={step.id} className="flex items-center flex-shrink-0">
              {index > 0 && (
                <div
                  className={`h-0.5 flex-1 min-w-[1.5rem] ${
                    completedSteps.includes(STEPS[index - 1].id)
                      ? 'bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
              <button
                type="button"
                onClick={() => onStepChange(step.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isActive
                    ? 'ring-2 ring-ruby-500 bg-ruby-50 dark:bg-ruby-900/30 text-ruby-700 dark:text-ruby-300'
                    : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
                aria-label={step.title}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.id === 0 ? (
                  'I'
                ) : (
                  step.id
                )}
              </button>
            </div>
          )
        })}
      </div>
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
        {STEPS.find((s) => s.id === currentStep)?.title}
      </div>
    </div>
  )
}
