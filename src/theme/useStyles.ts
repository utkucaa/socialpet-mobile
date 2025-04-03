import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import useTheme from './hooks/useTheme';
import { Theme } from './types';

export function useStyles<T extends StyleSheet.NamedStyles<T>>(
  styleCreator: (theme: Theme) => T
): T {
  const { theme } = useTheme();
  
  return useMemo(() => {
    const styles = styleCreator(theme);
    return StyleSheet.create(styles);
  }, [theme, styleCreator]);
}
