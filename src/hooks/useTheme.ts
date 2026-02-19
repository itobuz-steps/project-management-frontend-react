import { useThemeContext } from '../context/ThemeContext';

/**
 * Convenience wrapper around ThemeContext.
 * Returns [theme, setTheme] – same signature as before so existing
 * call‑sites keep working without changes.
 */
export function useTheme(): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
] {
  const { theme, setTheme } = useThemeContext();
  return [theme, setTheme];
}
