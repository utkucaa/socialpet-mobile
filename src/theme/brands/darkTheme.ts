import { Theme } from '../types';

export const darkTheme: Theme = {
  id: 'darkTheme',
  name: 'Dark Theme',
  colors: {
    primary: {
      light: '#B591E5',
      main: '#9966CC',
      dark: '#7C4FB0',
      contrast: '#FFFFFF',
    },
    secondary: {
      light: '#A976F0',
      main: '#8A2BE2',
      dark: '#6A1FB3',
      contrast: '#FFFFFF',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
      inverse: '#FFFFFF',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
      disabled: '#888888',
      inverse: '#333333',
    },
    success: {
      light: '#98C379',
      main: '#8BC34A',
      dark: '#689F38',
    },
    warning: {
      light: '#E5B1E5',
      main: '#DDA0DD',
      dark: '#C07FC0',
    },
    error: {
      light: '#F07BA7',
      main: '#E06C9F',
      dark: '#C25585',
    },
    info: {
      light: '#C0B0E8',
      main: '#B39DDB',
      dark: '#9575CD',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    shadow: 'rgba(164, 111, 207, 0.3)',
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
    low: '0px 2px 4px rgba(153, 102, 204, 0.2)',
    medium: '0px 4px 8px rgba(153, 102, 204, 0.25)',
    high: '0px 8px 16px rgba(153, 102, 204, 0.3)',
  },
};
