import type { ThemeConfig } from 'antd';
import { THEME_COLORS } from './constants';
import { oklchToHex } from '../utils/oklchToHex';

export function getAntdTheme(themeName: string): ThemeConfig {
  const palette = THEME_COLORS[themeName] ?? THEME_COLORS.indigo;

  return {
    token: {
      colorPrimary: oklchToHex(palette[5]),
      colorInfo: oklchToHex(palette[5]),
      colorLink: oklchToHex(palette[6]),
      colorSuccess: '#16a34a',
      colorWarning: '#d97706',
      colorError: '#dc2626',
      colorTextBase: '#1f2937',
      colorBgBase: '#ffffff',
      colorBorder: '#e5e7eb',
      borderRadius: 8,
      borderRadiusLG: 12,
      controlHeight: 36,
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 14,
      lineWidth: 1,
      wireframe: false,
      motion: true,
    },
    components: {
      Button: {
        borderRadius: 10,
        primaryShadow: 'none',
      },
      Input: {
        borderRadius: 10,
      },
      Select: {
        borderRadius: 10,
      },
      Card: {
        borderRadiusLG: 12,
      },
      Modal: {
        borderRadiusLG: 12,
      },
      Drawer: {
        paddingLG: 20,
      },
    },
  };
}
