import { Statistic } from 'antd';

export function CustomStatistic({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
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
        border: '2px dashed #ccc',
        padding: '16px',
        borderRadius: '8px',
        width: '300px',
      }}
    />
  );
}
