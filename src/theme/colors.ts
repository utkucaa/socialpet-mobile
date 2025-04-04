import { Theme } from './types';

// Purple-focused color palette for light theme
export const lightColors: Theme['colors'] = {
  primary: {
    main: '#8A2BE2', // Vibrant purple
    light: '#A976F0', // Light purple
    dark: '#6A1FB3', // Dark purple
    contrast: '#FFFFFF', // White text on purple
  },
  secondary: {
    main: '#9966CC', // Medium purple
    light: '#B591E5', // Lighter purple
    dark: '#7C4FB0', // Darker purple
    contrast: '#FFFFFF', // White text on secondary
  },
  background: {
    default: '#F8F8F8', // Very light gray
    paper: '#FFFFFF', // White
    variant: '#F0F0F0', // Light gray
  },
  text: {
    primary: '#333333', // Dark gray for primary text
    secondary: '#666666', // Medium gray for secondary text
    disabled: '#AAAAAA', // Light gray for disabled text
  },
  error: '#D53F8C', // Pinkish purple for errors
  warning: '#DDA0DD', // Plum color for warnings
  info: '#9370DB', // Medium purple for info
  success: '#6B8E23', // Olivedrab for success (complementary to purple)
  border: '#E5E5E5', // Light gray border
  divider: '#E0E0E0', // Slightly darker gray for dividers
};

// Purple-focused color palette for dark theme
export const darkColors: Theme['colors'] = {
  primary: {
    main: '#9966CC', // Medium purple for dark theme
    light: '#B591E5', // Lighter purple
    dark: '#7C4FB0', // Darker purple
    contrast: '#FFFFFF', // White text on purple
  },
  secondary: {
    main: '#8A2BE2', // Vibrant purple for secondary
    light: '#A976F0', // Light purple
    dark: '#6A1FB3', // Dark purple
    contrast: '#FFFFFF', // White text on secondary
  },
  background: {
    default: '#121212', // Very dark gray
    paper: '#1E1E1E', // Dark gray for surface elements
    variant: '#2C2C2C', // Medium dark gray for variant surfaces
  },
  text: {
    primary: '#FFFFFF', // White for primary text
    secondary: '#CCCCCC', // Light gray for secondary text
    disabled: '#888888', // Medium gray for disabled text
  },
  error: '#E06C9F', // Lighter pinkish purple for errors
  warning: '#DDA0DD', // Plum color for warnings
  info: '#B39DDB', // Lighter purple for info
  success: '#8BC34A', // Light green for success
  border: '#444444', // Dark gray border
  divider: '#383838', // Slightly lighter gray for dividers
};
