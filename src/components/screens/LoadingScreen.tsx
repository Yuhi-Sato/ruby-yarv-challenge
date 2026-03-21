const API_LINES = [
  '# VM (instruction implementation)',
  'vm.push(x)            # Push value onto stack',
  'vm.pop                # Pop and return top value',
  'vm.topn(n)            # Peek nth from top (1 = top)',
  'vm.env_read(-idx)     # Read local variable at idx',
  'vm.env_write(-idx, v) # Write local variable at idx',
  'vm.add_pc(offset)     # Adjust PC by offset (branches)',
  '',
  '# Iseq (compiler implementation)',
  'iseq.emit(Insn, *args)  # Append instruction',
  'iseq.size               # Current iseq size',
];

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Ruby YARV Challenge
      </h1>

      <div className="flex items-center gap-3">
        <svg
          className="animate-spin h-5 w-5 text-violet-600"
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
        <span className="text-gray-600 dark:text-gray-400">
          Loading ruby.wasm...
        </span>
      </div>

      <pre className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 font-mono max-w-lg w-full overflow-x-auto">
        {API_LINES.join('\n')}
      </pre>
    </div>
  );
}
