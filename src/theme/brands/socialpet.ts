import { Theme } from '../types';

export const socialpetTheme: Theme = {
  id: 'socialpet',
  name: 'socialpet Theme',
  colors: {
    primary: {
      light: '#A976F0',
      main: '#8A2BE2',
      dark: '#6A1FB3',
      contrast: '#FFFFFF',
    },
    secondary: {
      light: '#B591E5',
      main: '#9966CC',
      dark: '#7C4FB0',
      contrast: '#FFFFFF',
    },
    background: {
      default: '#F8F8F8',
      paper: '#FFFFFF',
      inverse: '#121212',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
      disabled: '#AAAAAA',
      inverse: '#FFFFFF',
    },
    success: {
      light: '#7DB95E',
      main: '#6B8E23',
      dark: '#556B2F',
    },
    warning: {
      light: '#E5B1E5',
      main: '#DDA0DD',
      dark: '#C07FC0',
    },
    error: {
      light: '#E06C9F',
      main: '#D53F8C',
      dark: '#B83280',
    },
    info: {
      light: '#A488E5',
      main: '#9370DB',
      dark: '#7857C7',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(128, 0, 128, 0.15)',
  },
  typography: {
    fontFamily: {
      regular: 'Inter-Regular',
      medium: 'Inter-Medium',
      semiBold: 'Inter-SemiBold',
      bold: 'Inter-Bold',
    },
    fontSize: {
      xs: 12,
      s: 14,
      m: 16,
      l: 18,
      xl: 20,
      xxl: 24,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    none: 0,
    xs: 2,
    s: 4,
    m: 8,
    l: 12,
    xl: 16,
    full: 9999,
  },
  elevation: {
    none: 'none',
    low: '0px 2px 4px rgba(138, 43, 226, 0.1)',
    medium: '0px 4px 8px rgba(138, 43, 226, 0.12)',
    high: '0px 8px 16px rgba(138, 43, 226, 0.14)',
  },
};
