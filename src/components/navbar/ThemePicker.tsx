import { useTheme } from '../../hooks/useTheme';
import { THEME_COLORS } from '../../config/constants';
import type {
  ThemeCircleProps,
  ThemePickerProps,
} from '../projectSettings/projectSettings.type';

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  const [, setTheme] = useTheme();

  const handleSelect = (theme: string) => {
    onChange?.(theme);
    setTheme(theme);
  };

  return (
    <div className="flex gap-2">
      {Object.entries(THEME_COLORS).map(([theme, values]) => (
        <ThemeCircle
          key={theme}
          theme={theme}
          value={values[5]}
          selected={value === theme}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}

function ThemeCircle({ theme, onSelect, value, selected }: ThemeCircleProps) {
  console.log({ theme, value, selected });
  return (
    <div
      onClick={() => onSelect(theme)}
      className={`aspect-square size-4 rounded-full transition-all hover:scale-110 hover:shadow-md ${selected ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
      style={{ backgroundColor: value }}
    />
  );
}
