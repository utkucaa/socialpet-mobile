import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useStyles } from '../theme/useStyles';
import { Theme } from '../theme/types';

interface ButtonProps {
  variant?: 'contained' | 'outlined';
  color?: 'primary' | 'secondary';
  onPress: () => void;
  children: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  color = 'primary',
  onPress,
  children,
}) => {
  const styles = useStyles((theme: Theme) => ({
    button: {
      padding: theme.spacing.m,
      borderRadius: theme.borderRadius.m,
      alignItems: 'center',
      justifyContent: 'center',
      ...(variant === 'contained' && {
        backgroundColor: theme.colors[color].main,
        ...StyleSheet.flatten(theme.elevation.low),
      }),
      ...(variant === 'outlined' && {
        borderWidth: 1,
        borderColor: theme.colors[color].main,
      }),
    },
    text: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.m,
      color: variant === 'contained' 
        ? theme.colors[color].contrast 
        : theme.colors[color].main,
    },
  }));

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};
