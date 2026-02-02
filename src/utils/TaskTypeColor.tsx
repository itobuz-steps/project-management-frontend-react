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
        <span className="rounded-xl bg-red-500 px-1.5 py-0.5 text-white">
          {children}
        </span>
      );
    case 'story':
      return (
        <span className="rounded-xl bg-green-600 px-1.5 py-0.5 text-white">
          {children}
        </span>
      );
    default:
      return (
        <span className="bg-primary-600 rounded-xl px-1.5 py-0.5 text-white">
          {children}
        </span>
      );
  }
}
