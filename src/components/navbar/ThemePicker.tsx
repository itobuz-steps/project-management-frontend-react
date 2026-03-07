import { useTheme } from '../../hooks/useTheme';
import { THEME_COLORS } from '../../config/constants';

export function ThemePicker({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (theme: string) => void;
}) {
  const [, setTheme] = useTheme(); // we only need setTheme

  const handleSelect = (theme: string) => {
    onChange?.(theme); // update form
    setTheme(theme); // update UI theme
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
