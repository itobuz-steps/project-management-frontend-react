export function Input({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="focus:border-primary-300 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-xs transition-all duration-300 outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
    />
  );
}
