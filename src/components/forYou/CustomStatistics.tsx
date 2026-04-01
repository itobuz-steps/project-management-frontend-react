import { Statistic } from 'antd';
import { useColorMode } from '../../hooks/useColorMode';
import { THEME_COLORS } from '../../config/constants';

interface CustomStatisticProps {
  title: string;
  value: number;
}

export function CustomStatistic({ title, value }: CustomStatisticProps) {
  const [colorMode] = useColorMode();
  const isDark = colorMode === 'dark';
  const theme = localStorage.getItem('lastProjectTheme') || 'indigo';
  const themeColors = THEME_COLORS[theme] ?? THEME_COLORS['indigo'];
  const gradientStart = themeColors[4];
  const gradientEnd = themeColors[7];

  // Split title at "Last" to separate main text from time period
  const parts = title.split(' Last');
  const mainTitle = parts[0];
  const timeText = parts.length > 1 ? `Last${parts[1]}` : '';

  return (
    <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-600">
      {/* Subtle accent line */}
      <div
        className="absolute right-0 bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
        style={{
          background: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})`,
        }}
      />

      <Statistic
        title={
          <div className="flex flex-col items-center gap-0.5">
            <div className="text-primary-500 text-center text-sm font-semibold">
              {mainTitle}
            </div>
            {timeText && (
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {timeText}
              </div>
            )}
          </div>
        }
        value={value}
        styles={{
          content: {
            fontSize: '36px',
            fontWeight: 700,
            color: isDark ? '#f5f5f5' : '#111827',
            textAlign: 'center',
          },
        }}
        style={{
          border: 'none',
          padding: 0,
          width: '100%',
        }}
      />
    </div>
  );
}
