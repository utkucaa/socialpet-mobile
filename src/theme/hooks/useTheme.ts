import { useContext } from 'react';
import { Platform } from 'react-native';
import { ThemeContext } from '../ThemeProvider';
import { lightColors, darkColors } from '../colors';
import { Theme } from '../types';

const defaultTheme: Theme = {
  id: 'socialpet',
  colors: lightColors,
  typography: {
    fontSize: {
      xs: 12,
      s: 14,
      m: 16,
      l: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    fontFamily: {
      regular: Platform.select({
        ios: 'SF Pro Display',
        android: 'Roboto',
      }),
      medium: Platform.select({
        ios: 'SF Pro Display',
        android: 'Roboto-Medium',
      }),
      semibold: Platform.select({
        ios: 'SF Pro Display',
        android: 'Roboto-SemiBold',
      }),
      bold: Platform.select({
        ios: 'SF Pro Display',
        android: 'Roboto-Bold',
      }),
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
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: defaultTheme,
      setTheme: () => {},
      isLoading: false,
    };
  }
  return context;
};

export default useTheme;
