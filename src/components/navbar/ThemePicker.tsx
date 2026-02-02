import { THEME_COLORS, useTheme } from '../../hooks/useTheme';

export function ThemePicker() {
  const [currentTheme, setCurrentTheme] = useTheme();
  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold">Select a theme:</p>

      <div className="theme-picker flex w-full justify-between gap-0.5">
        {Object.entries(THEME_COLORS).map(([theme, values]) => (
          <ThemeCircle
            key={theme}
            theme={theme}
            value={values[5]}
            selected={currentTheme === theme}
            onSelect={() => setCurrentTheme(theme)}
          />
        ))}
      </div>
    </div>
  );
}

function ThemeCircle({
  theme,
  onSelect,
  value,
  selected,
}: {
  theme: string;
  onSelect: (theme: string) => void;
  value: string;
  selected: boolean;
}) {
  console.log({ theme, value, selected });
  return (
    <div
      onClick={() => onSelect(theme)}
      className={`aspect-square size-4 rounded-full transition-all hover:scale-110 hover:shadow-md ${selected ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
      style={{ backgroundColor: value }}
    />
  );
}
