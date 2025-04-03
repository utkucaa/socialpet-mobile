import { Theme } from './types';

// Apple-style color palette
export const lightColors: Theme['colors'] = {
  primary: {
    main: '#007AFF', // iOS blue
    light: '#4DA2FF',
    dark: '#0056B3',
    contrast: '#FFFFFF',
  },
  secondary: {
    main: '#5856D6', // iOS purple
    light: '#7A79E0',
    dark: '#3E3BA3',
    contrast: '#FFFFFF',
  },
  background: {
    default: '#F2F2F7', // iOS light gray
    paper: '#FFFFFF',
    variant: '#FFFFFF',
  },
  text: {
    primary: '#000000',
    secondary: '#6C6C70', // iOS secondary text
    disabled: '#AEAEB2', // iOS disabled text
  },
  error: '#FF3B30', // iOS red
  warning: '#FF9500', // iOS orange
  info: '#32ADE6', // iOS light blue
  success: '#34C759', // iOS green
  border: '#C6C6C8', // iOS border color
  divider: '#C6C6C8',
};

export const darkColors: Theme['colors'] = {
  primary: {
    main: '#0A84FF', // iOS dark mode blue
    light: '#4DA2FF',
    dark: '#0056B3',
    contrast: '#FFFFFF',
  },
  secondary: {
    main: '#5E5CE6', // iOS dark mode purple
    light: '#7A79E0',
    dark: '#3E3BA3',
    contrast: '#FFFFFF',
  },
  background: {
    default: '#000000',
    paper: '#1C1C1E', // iOS dark mode background
    variant: '#2C2C2E',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#98989D', // iOS dark mode secondary text
    disabled: '#636366', // iOS dark mode disabled text
  },
  error: '#FF453A', // iOS dark mode red
  warning: '#FF9F0A', // iOS dark mode orange
  info: '#64D2FF', // iOS dark mode light blue
  success: '#30D158', // iOS dark mode green
  border: '#38383A', // iOS dark mode border color
  divider: '#38383A',
};
