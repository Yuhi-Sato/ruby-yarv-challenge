export function Header() {
  return (
    <header className="flex flex-row items-center gap-3 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Ruby YARV Challenge
      </h1>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Implement a Ruby VM &amp; compiler — step by step
      </span>
    </header>
  );
}
