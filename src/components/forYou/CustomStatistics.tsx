import { Statistic } from 'antd';
import { useColorMode } from '../../hooks/useColorMode';

interface CustomStatisticProps {
  title: string;
  value: number;
}

export function CustomStatistic({ title, value }: CustomStatisticProps) {
  const [colorMode] = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <div className="flex-1 rounded-md border border-gray-50 bg-white p-4 shadow-sm md:p-4 md:px-8 dark:border-slate-700 dark:bg-slate-800">
      <Statistic
        title={title}
        value={value}
        styles={{
          title: {
            color: 'var(--color-primary-500)',
            fontWeight: 600,
          },
          content: {
            fontSize: '32px',
            color: isDark ? '#f5f5f5' : '#111827',
          },
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
