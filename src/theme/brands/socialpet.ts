import { Theme } from '../types';

export const socialpetTheme: Theme = {
  id: 'socialpet',
  name: 'socialpet Theme',
  colors: {
    primary: {
      light: '#3385FF',
      main: '#0066FF',
      dark: '#0047B3',
      contrast: '#FFFFFF',
    },
    secondary: {
      light: '#FF8533',
      main: '#FF6B00',
      dark: '#CC5500',
      contrast: '#FFFFFF',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
      inverse: '#1A1A1A',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#757575',
      disabled: '#BDBDBD',
      inverse: '#FFFFFF',
    },
    success: {
      light: '#4CAF50',
      main: '#2E7D32',
      dark: '#1B5E20',
    },
    warning: {
      light: '#FFA726',
      main: '#F57C00',
      dark: '#E65100',
    },
    error: {
      light: '#EF5350',
      main: '#D32F2F',
      dark: '#C62828',
    },
    info: {
      light: '#29B6F6',
      main: '#0288D1',
      dark: '#01579B',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.2)',
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
    low: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0px 4px 8px rgba(0, 0, 0, 0.12)',
    high: '0px 8px 16px rgba(0, 0, 0, 0.14)',
  },
};
