import { useEffect, useState } from 'react';
import { THEME_COLORS } from '../config/constants';
import type { ColorMode } from './ThemeContext';
import { ThemeContext } from './ThemeContext';

const THEME_ALIASES: Record<string, string> = {
  teal: 'green',
  blue: 'digital-blue',
  black: 'jet-black',
  custom_2: 'jet-black',
};

function normalizeTheme(theme?: string | null): string | null {
  if (!theme) {
    return null;
  }

  if (THEME_COLORS[theme]) {
    return theme;
  }

  const aliased = THEME_ALIASES[theme];
  return aliased && THEME_COLORS[aliased] ? aliased : null;
}

function getThemeFromRoute(): string | null {
  const match = window.location.pathname.match(/\/project\/([^/]+)/);
  const projectId = match?.[1];

  if (!projectId) {
    return null;
  }

  return normalizeTheme(localStorage.getItem(`projectTheme:${projectId}`));
}

function applyTheme(theme: string) {
  const root = document.documentElement;
  let colors = THEME_COLORS[theme];

  if (!colors) {
    colors = THEME_COLORS['indigo'];
  }

  root.style.setProperty('--color-primary-50', colors[0]);
  root.style.setProperty('--color-primary-950', colors[10]);

  for (let i = 1; i <= 9; i++) {
    root.style.setProperty(`--color-primary-${i * 100}`, colors[i]);
  }
}

function applyColorMode(mode: ColorMode) {
  const root = document.documentElement;
  root.setAttribute('data-color-mode', mode);
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<string>(() => {
    const fromRoute = getThemeFromRoute();
    const fromLast = normalizeTheme(localStorage.getItem('lastProjectTheme'));
    return fromRoute ?? fromLast ?? 'indigo';
  });
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    const saved = localStorage.getItem('color-mode');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('lastProjectTheme', theme);
  }, [theme]);

  useEffect(() => {
    applyColorMode(colorMode);
    localStorage.setItem('color-mode', colorMode);
  }, [colorMode]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colorMode, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
