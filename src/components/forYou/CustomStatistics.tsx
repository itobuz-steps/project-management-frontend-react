import { Statistic } from 'antd';

export function CustomStatistic({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="flex-1 rounded-md border-2 border-gray-200 p-4 md:p-4 md:px-8">
      <Statistic
        title={title}
        value={value}
        styles={{
          title: {
            color: 'var(--color-primary-500)',
            fontWeight: 600,
          },
          content: { fontSize: '32px' },
        }}
        style={{
          border: 'none',
          padding: 0,
          minWidth: '200px',
        }}
      />
    </div>
  );
}
