import { useState } from 'react'
import type { StepConfig, RunResult } from '../../types'

interface TutorialPaneProps {
  step: StepConfig
  result: RunResult | null
}

function TutorialPaneInner({ step, result }: TutorialPaneProps) {
  const [hintsShown, setHintsShown] = useState(0)

  return (
    <div className="overflow-y-auto h-full p-4 space-y-4">
      {/* Description */}
      <div className="step-description">{step.description}</div>

      {/* Test Cases */}
      {step.testCases.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Test Cases</h3>
          {step.testCases.map((tc, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex items-center gap-2"
            >
              <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                {tc.source}
              </code>
              <span className="text-gray-400">&rarr;</span>
              <code className="text-sm font-mono font-semibold text-ruby-600 dark:text-ruby-400">
                {String(tc.expected)}
              </code>
            </div>
          ))}
        </div>
      )}

      {/* Hints */}
      {step.hints && step.hints.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Hints</h3>
          {step.hints.slice(0, hintsShown).map((hint, i) => (
            <div
              key={i}
              className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-3 text-sm whitespace-pre-wrap font-mono"
            >
              {hint}
            </div>
          ))}
          {hintsShown < step.hints.length && (
            <button
              type="button"
              onClick={() => setHintsShown((prev) => prev + 1)}
              className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium"
            >
              Show Hint {hintsShown + 1} of {step.hints.length}
            </button>
          )}
        </div>
      )}

      {/* API Reference */}
      {step.id !== 0 && (
        <details className="group" open>
          <summary className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer select-none">
            API Reference
          </summary>
          <div className="mt-2 space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                VM API
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-2 font-semibold text-gray-500 dark:text-gray-400">Method</th>
                      <th className="text-left p-2 font-semibold text-gray-500 dark:text-gray-400">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['vm.push(x)', 'Push value onto stack'],
                      ['vm.pop', 'Pop and return top value'],
                      ['vm.topn(n)', 'Peek nth from top (1 = top)'],
                      ['vm.env_read(offset)', 'Read local variable at offset from EP'],
                      ['vm.env_write(offset, v)', 'Write local variable at offset from EP'],
                      ['vm.add_pc(offset)', 'Adjust PC by relative offset'],
                      ['vm.define_method(m, i)', 'Register method iseq on current class'],
                      ['vm.sendish(cd)', 'Dispatch method call → returns result'],
                      ['vm.self_value', 'Current self object'],
                    ].map(([sig, desc]) => (
                      <tr key={sig} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="p-2">
                          <code className="font-mono text-ruby-600 dark:text-ruby-400 whitespace-nowrap">{sig}</code>
                        </td>
                        <td className="p-2 text-gray-600 dark:text-gray-400">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Iseq API
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-2 font-semibold text-gray-500 dark:text-gray-400">Method</th>
                      <th className="text-left p-2 font-semibold text-gray-500 dark:text-gray-400">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['iseq.emit(Insn, *args)', 'Append instruction (Insn is a class, e.g. Putobject)'],
                      ['iseq.emit_placeholder(len)', 'Reserve space for forward-reference patching'],
                      ['iseq.patch_at!(pc, Insn, offset)', 'Overwrite placeholder with actual instruction'],
                      ['iseq.size', 'Current iseq size'],
                      ['YRuby::Iseq.iseq_new_method(node)', 'Create method iseq from DefNode'],
                    ].map(([sig, desc]) => (
                      <tr key={sig} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="p-2">
                          <code className="font-mono text-ruby-600 dark:text-ruby-400 whitespace-nowrap">{sig}</code>
                        </td>
                        <td className="p-2 text-gray-600 dark:text-gray-400">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Compiler API
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-2 font-semibold text-gray-500 dark:text-gray-400">Method</th>
                      <th className="text-left p-2 font-semibold text-gray-500 dark:text-gray-400">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['compile_node(iseq, node)', 'Compile any AST node by dispatching to the right method (built-in)'],
                    ].map(([sig, desc]) => (
                      <tr key={sig} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="p-2">
                          <code className="font-mono text-ruby-600 dark:text-ruby-400 whitespace-nowrap">{sig}</code>
                        </td>
                        <td className="p-2 text-gray-600 dark:text-gray-400">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </details>
      )}

      {/* Status Message */}
      {result && (
        <div
          className={`rounded-lg p-3 text-sm font-medium ${
            result.allPassed
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}
        >
          {result.allPassed ? 'All tests passed!' : 'Some tests failed'}
        </div>
      )}
    </div>
  )
}

// Key on step.id to reset hints state when navigating between steps
export function TutorialPane({ step, result }: TutorialPaneProps) {
  return <TutorialPaneInner key={step.id} step={step} result={result} />
}
