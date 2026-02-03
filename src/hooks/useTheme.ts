import { useEffect, useState } from 'react';
import { THEME_COLORS } from '../config/constants';

export function useTheme(
  initialTheme = 'indigo'
): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [theme, setTheme] = useState<string>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || initialTheme;
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, setTheme];
}

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
