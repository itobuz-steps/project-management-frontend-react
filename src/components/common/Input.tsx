export function Input({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`focus:border-primary-300 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 shadow-xs transition-all duration-300 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 dark:disabled:bg-slate-800 ${className}`}
    />
  );
}
