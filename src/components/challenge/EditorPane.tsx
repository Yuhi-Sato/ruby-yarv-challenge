import Editor from '@monaco-editor/react'
import { useIsMobile } from '../../hooks/useIsMobile'

interface EditorPaneProps {
  code: string
  onChange: (code: string) => void
  onReset: () => void
  isRunning: boolean
}

export function EditorPane({ code, onChange, onReset, isRunning }: EditorPaneProps) {
  const isMobile = useIsMobile()

  const handleReset = () => {
    if (window.confirm('Reset code to the original stub? Your changes will be lost.')) {
      onReset()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-end px-3 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        {isMobile ? (
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className="w-full h-full p-3 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm leading-relaxed resize-none outline-none"
          />
        ) : (
          <Editor
            height="100%"
            language="ruby"
            theme="vs-dark"
            value={code}
            onChange={(value) => onChange(value ?? '')}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              wordWrap: 'on',
              lineNumbers: 'on',
              tabSize: 2,
              insertSpaces: true,
              automaticLayout: true,
            }}
          />
        )}

        {/* Running overlay */}
        {isRunning && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
            <div className="flex items-center gap-2 bg-gray-900/90 text-white px-4 py-2 rounded-lg">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="text-sm">Running tests...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
