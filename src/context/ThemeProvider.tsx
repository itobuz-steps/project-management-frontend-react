import { useEffect, useState } from 'react';
import { THEME_COLORS } from '../config/constants';
import { ThemeContext } from './ThemeContext';

function applyTheme(theme: string) {
  const root = document.documentElement;
  let colors = THEME_COLORS[theme];

  if (!colors || !theme) {
    colors = THEME_COLORS['indigo'];
  }

  root.style.setProperty('--color-primary-50', colors[0]);
  root.style.setProperty('--color-primary-950', colors[10]);
  for (let i = 1; i <= 9; i++) {
    root.style.setProperty('--color-primary-' + i * 100, colors[i]);
  }
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('theme') || 'indigo';
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
