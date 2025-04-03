import { Theme } from './types';

export const createSpacing = (theme: Theme) => (...args: number[]) => {
  return args.map(factor => theme.spacing[factor] || factor).join('px ');
};

export const createTypography = (theme: Theme) => ({
  h1: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xxl,
    lineHeight: theme.typography.fontSize.xxl * theme.typography.lineHeight.normal,
  },
  h2: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    lineHeight: theme.typography.fontSize.xl * theme.typography.lineHeight.normal,
  },
  h3: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.l,
    lineHeight: theme.typography.fontSize.l * theme.typography.lineHeight.normal,
  },
  body1: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.m,
    lineHeight: theme.typography.fontSize.m * theme.typography.lineHeight.normal,
  },
  body2: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.s,
    lineHeight: theme.typography.fontSize.s * theme.typography.lineHeight.normal,
  },
  caption: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.xs,
    lineHeight: theme.typography.fontSize.xs * theme.typography.lineHeight.normal,
  },
  button: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.m,
    lineHeight: theme.typography.fontSize.m * theme.typography.lineHeight.tight,
  },
});

export const alpha = (color: string, opacity: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
