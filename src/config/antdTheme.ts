import type { ThemeConfig } from 'antd';
import { THEME_COLORS } from './constants';
import { oklchToHex } from '../utils/oklchToHex';

export function getAntdTheme(themeName: string): ThemeConfig {
  const palette = THEME_COLORS[themeName] ?? THEME_COLORS.indigo;
  const primaryColor = oklchToHex(palette[5]);

  return {
    token: {
      colorPrimary: primaryColor,
      colorInfo: primaryColor,
      colorLink: oklchToHex(palette[6]),
      colorSuccess: '#16a34a',
      colorWarning: '#d97706',
      colorError: '#dc2626',
      colorTextBase: '#1f2937',
      colorBgBase: '#ffffff',
      colorBorder: '#e5e7eb',
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
        itemColor: '#000000',
        itemHoverColor: '#000000',
        itemSelectedColor: primaryColor,
        itemActiveColor: primaryColor,
        inkBarColor: primaryColor,
        padding: 0,
        margin: 0,
      },
    },
  };
}
