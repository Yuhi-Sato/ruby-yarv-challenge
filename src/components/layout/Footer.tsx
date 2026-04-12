import type { RefObject } from 'react'

interface FooterProps {
  onRun: () => void
  isRunning: boolean
  runButtonRef: RefObject<HTMLButtonElement | null>
  onDownload: () => void
}

export function Footer({ onRun, isRunning, runButtonRef, onDownload }: FooterProps) {
  return (
    <footer className="sticky bottom-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-3">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          <button
            ref={runButtonRef}
            onClick={onRun}
            disabled={isRunning}
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:ring-offset-2 bg-ruby-600 hover:bg-ruby-700 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Running...
              </>
            ) : (
              'Run Tests'
            )}
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:ring-offset-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2"
            title="Download your YARV code as a Ruby file"
          >
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download .rb
          </button>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          Ctrl+Enter / Cmd+Enter
        </span>
      </div>
    </footer>
  )
}
