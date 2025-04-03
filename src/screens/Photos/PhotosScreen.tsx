import React from 'react';
import { View, Text } from 'react-native';
import useTheme from '@/theme/hooks/useTheme';
import { useStyles } from '@/theme/useStyles';
import { Theme } from '@/theme/types';

export const PhotosScreen = () => {
  const { theme } = useTheme();
  
  const styles = useStyles((theme: Theme) => ({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background.default,
      padding: theme.spacing.m,
    },
    text: {
      color: theme.colors.text.primary,
      fontSize: theme.typography.fontSize.m,
      fontFamily: theme.typography.fontFamily.regular,
    },
  }));

  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Fotoğraflarım</Text>
    </View>
  );
};
