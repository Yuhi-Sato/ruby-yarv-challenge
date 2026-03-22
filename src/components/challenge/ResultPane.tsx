import type { RunResult } from '../../types'

interface ResultPaneProps {
  result: RunResult | null
  expectedBytecode?: string
  onNextStep?: () => void
  isLastStep?: boolean
}

function prettifyError(msg: string): string {
  const niMatch = msg.match(/(\w+(?:[.#]\w+)?)\s+not implemented/)
  if (niMatch || msg.includes('NotImplementedError')) {
    const name = niMatch ? niMatch[1] : null
    if (name)
      return `${name} is not yet implemented.\n\nWrite your implementation in the editor and click Run Tests.`
    return `A required method is not yet implemented.\n\nWrite your implementation in the editor and click Run Tests.`
  }
  const syntaxMatch = msg.match(/SyntaxError[^:]*:\s*(.+?)(?:\n|$)/)
  if (syntaxMatch) return `Syntax error: ${syntaxMatch[1]}`
  return msg
    .split('\n')
    .filter(
      (l) => !l.match(/^\s+(from\s+)?\(eval\):\d+/) && !l.match(/^\s+eval:\d+:in/)
    )
    .slice(0, 8)
    .join('\n')
    .trim()
}

export function ResultPane({ result, expectedBytecode, onNextStep, isLastStep }: ResultPaneProps) {
  return (
    <div className="overflow-y-auto h-full p-4 space-y-4">
      {/* Expected Bytecode */}
      {expectedBytecode && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Expected Bytecode
          </h3>
          <pre className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
            {expectedBytecode}
          </pre>
        </div>
      )}

      {/* Empty state */}
      {!result && (
        <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm text-center">
          Implement the code... then Run Tests
        </div>
      )}

      {/* Results */}
      {result && (
        <>
          {/* Status Badge */}
          <div
            className={`rounded-lg px-4 py-3 text-center font-bold text-sm ${
              result.allPassed
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}
          >
            {result.allPassed ? 'ALL PASSED' : 'SOME FAILED'}
          </div>

          {/* Actual Bytecode */}
          {result.bytecodeDisasm && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Actual Bytecode
              </h3>
              <pre className={`p-3 rounded font-mono text-xs overflow-x-auto ${
                result.allPassed
                  ? 'bg-gray-900 text-green-400'
                  : 'bg-gray-900 text-amber-400'
              }`}>
                {result.bytecodeDisasm}
              </pre>
            </div>
          )}

          {/* Test Results */}
          <div className="space-y-2">
            {result.testResults.map((tr, i) => (
              <div
                key={i}
                className={`border-l-4 ${
                  tr.passed
                    ? 'border-green-500'
                    : 'border-red-500'
                } bg-white dark:bg-gray-800 p-3 rounded`}
              >
                <div className="flex items-center gap-2">
                  {tr.passed ? (
                    <svg
                      className="w-4 h-4 text-green-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-red-500 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {tr.description}
                  </span>
                </div>
                {!tr.passed && (
                  <div className="mt-2 text-xs space-y-1">
                    {tr.error ? (
                      <pre className="whitespace-pre-wrap text-red-600 dark:text-red-400 font-mono">
                        {prettifyError(tr.error)}
                      </pre>
                    ) : (
                      <>
                        <div>
                          <span className="text-gray-500">Expected: </span>
                          <code className="text-green-600 dark:text-green-400">{tr.expected}</code>
                        </div>
                        <div>
                          <span className="text-gray-500">Got: </span>
                          <code className="text-red-600 dark:text-red-400">{tr.got}</code>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {result.errorMessage && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <pre className="text-xs text-red-700 dark:text-red-400 font-mono whitespace-pre-wrap">
                {prettifyError(result.errorMessage)}
              </pre>
            </div>
          )}

          {/* Next Step Button */}
          {result.allPassed && !isLastStep && onNextStep && (
            <button
              type="button"
              onClick={onNextStep}
              className="w-full bg-ruby-600 hover:bg-ruby-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Next Step
            </button>
          )}

          {/* Celebration */}
          {result.allPassed && isLastStep && (
            <div className="bg-gradient-to-r from-ruby-100 to-ruby-50 dark:from-ruby-900/30 dark:to-ruby-800/20 rounded-lg p-4 text-center space-y-2">
              <div className="text-lg font-bold text-ruby-700 dark:text-ruby-300">
                Congratulations!
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                You implemented a Ruby VM and compiler from scratch!
              </p>
              <p className="text-sm font-mono font-bold text-ruby-600 dark:text-ruby-400">
                fib(10) = 55
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
