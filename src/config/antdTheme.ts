import { theme as antdTheme } from 'antd';
import type { ThemeConfig } from 'antd';
import { THEME_COLORS } from './constants';
import { oklchToHex } from '../utils/oklchToHex';

export function getAntdTheme(
  themeName: string,
  colorMode: 'light' | 'dark' = 'light'
): ThemeConfig {
  const palette = THEME_COLORS[themeName] ?? THEME_COLORS.indigo;
  const primaryColor = oklchToHex(palette[5]);
  const isDark = colorMode === 'dark';

  return {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: primaryColor,
      colorInfo: primaryColor,
      colorLink: oklchToHex(palette[6]),
      colorSuccess: '#16a34a',
      colorWarning: '#d97706',
      colorError: '#dc2626',
      colorTextBase: isDark ? '#e5e7eb' : '#1f2937',
      colorBgBase: isDark ? '#0f172a' : '#ffffff',
      colorBorder: isDark ? '#334155' : '#e5e7eb',
      borderRadius: 6,
      borderRadiusLG: 8,
      controlHeight: 36,
      fontFamily: 'Montserrat, sans-serif',
      fontSize: 14,
      lineWidth: 1,
      wireframe: false,
      motion: true,
    },
    components: {
      Button: {
        borderRadius: 6,
        primaryShadow: 'none',
      },
      Input: {
        borderRadius: 6,
      },
      Select: {
        borderRadius: 6,
      },
      Card: {
        borderRadiusLG: 8,
      },
      Modal: {
        borderRadiusLG: 8,
      },
      Drawer: {
        paddingLG: 20,
      },
      Tabs: {
        itemColor: isDark ? '#e5e7eb' : '#000000',
        itemHoverColor: isDark ? '#ffffff' : '#000000',
        itemSelectedColor: primaryColor,
        itemActiveColor: primaryColor,
        inkBarColor: primaryColor,
        padding: 0,
        margin: 0,
      },
    },
  };
}
