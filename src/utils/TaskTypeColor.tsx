export function TaskTypeColor({
  type,
  children,
}: {
  type?: string;
  children: React.ReactNode;
}) {
  switch (type) {
    case 'bug':
      return (
        <span className="cursor-pointer rounded-xl bg-red-500 px-1.5 py-0.5 text-white hover:underline">
          {children}
        </span>
      );
    case 'story':
      return (
        <span className="cursor-pointer rounded-xl bg-green-600 px-1.5 py-0.5 text-white hover:underline">
          {children}
        </span>
      );
    default:
      return (
        <span className="cursor cursor-pointer rounded-xl bg-blue-600 px-1.5 py-0.5 text-white hover:underline">
          {children}
        </span>
      );
  }
}
