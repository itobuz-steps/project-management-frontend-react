import { useEffect, useState } from 'react';

export const THEME_COLORS: Record<string, string[]> = {
  indigo: [
    'oklch(96.2% 0.018 272.314)',
    'oklch(93% 0.034 272.788)',
    'oklch(87% 0.065 274.039)',
    'oklch(78.5% 0.115 274.713)',
    'oklch(67.3% 0.182 276.935)',
    'oklch(58.5% 0.233 277.117)',
    'oklch(51.1% 0.262 276.966)',
    'oklch(45.7% 0.24 277.023)',
    'oklch(39.8% 0.195 277.366)',
    'oklch(35.9% 0.144 278.697)',
    'oklch(25.7% 0.09 281.288)',
  ],

  rose: [
    'oklch(0.969 0.015 12.422)',
    'oklch(0.941 0.03 12.58)',
    'oklch(0.892 0.058 10.001)',
    'oklch(0.81 0.117 11.638)',
    'oklch(0.712 0.194 13.428)',
    'oklch(0.645 0.246 16.439)',
    'oklch(0.586 0.253 17.585)',
    'oklch(0.514 0.222 16.935)',
    'oklch(0.455 0.188 13.697)',
    'oklch(0.41 0.159 10.272)',
    'oklch(0.271 0.105 12.094)',
  ],

  purple: [
    'oklch(0.977 0.014 308.299)',
    'oklch(0.946 0.033 307.174)',
    'oklch(0.902 0.063 306.703)',
    'oklch(0.827 0.119 306.383)',
    'oklch(0.714 0.203 305.504)',
    'oklch(0.627 0.265 303.9)',
    'oklch(0.558 0.288 302.321)',
    'oklch(0.496 0.265 301.924)',
    'oklch(0.438 0.218 303.724)',
    'oklch(0.381 0.176 304.987)',
    'oklch(0.291 0.149 302.717)',
  ],
  custom_1: [
    '#fbf5f5',
    '#f8ebec',
    '#f0dbdd',
    '#e4bdc2',
    '#d79da6',
    '#c27180',
    '#ab5368',
    '#8e4255',
    '#78394b',
    '#683344',
    '#381922',
  ],
  custom_2: [
    '#f6f6f6',
    '#e7e7e7',
    '#d1d1d1',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
  ],
  custom_3: [
    '#edfcf2',
    '#d4f7de',
    '#adedc3',
    '#77dea0',
    '#52cc87',
    '#1dac60',
    '#108b4c',
    '#0d6f3f',
    '#0d5834',
    '#0c482c',
    '#052919',
  ],
};

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
