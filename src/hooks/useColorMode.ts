import { useThemeContext } from '../context/ThemeContext';

/**
 * Convenience wrapper around ThemeContext color mode.
 * Returns [colorMode, setColorMode].
 */
export function useColorMode(): [
  'light' | 'dark',
  React.Dispatch<React.SetStateAction<'light' | 'dark'>>,
] {
  const { colorMode, setColorMode } = useThemeContext();
  return [colorMode, setColorMode];
}
