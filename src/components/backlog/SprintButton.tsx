export function SprintButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className="bg-primary-400 hover:bg-primary-500 cursor-pointer rounded-sm px-2 py-1 font-medium text-white shadow-xs focus:outline-none"
    >
      {props.children}
    </button>
  );
}
