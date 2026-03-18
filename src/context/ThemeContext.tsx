import { createContext, useContext } from 'react';

export type ColorMode = 'light' | 'dark';

type ThemeContextType = {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  colorMode: ColorMode;
  setColorMode: React.Dispatch<React.SetStateAction<ColorMode>>;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used inside ThemeProvider');
  }
  return ctx;
};
