import { Tag } from 'antd';

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
        <Tag
          color="red"
          className="cursor-pointer rounded-xl bg-red-500 px-1.5 py-0.5 text-white hover:underline"
        >
          {children}
        </Tag>
      );
    case 'story':
      return (
        <Tag
          color="green"
          className="cursor-pointer rounded-xl bg-green-600 px-1.5 py-0.5 text-white hover:underline"
        >
          {children}
        </Tag>
      );
    default:
      return (
        <Tag
          color="blue"
          className="cursor cursor-pointer rounded-xl bg-blue-600 px-1.5 py-0.5 text-white hover:underline"
        >
          {children}
        </Tag>
      );
  }
}
