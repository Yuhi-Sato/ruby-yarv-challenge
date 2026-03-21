interface ErrorScreenProps {
  error: string;
}

export function ErrorScreen({ error }: ErrorScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Error Loading Ruby VM
      </h1>

      <div className="border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 rounded-lg px-6 py-4 max-w-lg w-full">
        <p className="text-red-800 dark:text-red-400 text-sm font-mono">
          {error}
        </p>
      </div>

      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Please refresh the page and try again.
      </p>
    </div>
  );
}
