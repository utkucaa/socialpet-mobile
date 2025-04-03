import React, { createContext, useContext, useEffect, useState } from 'react';
import { MMKV } from 'react-native-mmkv';
import { Theme } from './types';
import { socialpetTheme } from './brands/socialpet';
import { darkTheme } from './brands/darkTheme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (themeId: string) => void;
  isLoading: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: socialpetTheme,
  setTheme: () => {},
  isLoading: true,
});

const THEME_STORAGE_KEY = '@app_theme';

const availableThemes: { [key: string]: Theme } = {
  socialpet: socialpetTheme,
  darkTheme: darkTheme
};

export const ThemeProvider: React.FC<{ children: React.ReactNode; storage: MMKV }> = ({ children, storage }) => {
  const [theme, setThemeState] = useState<Theme>(socialpetTheme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedThemeId = storage.getString(THEME_STORAGE_KEY);
      if (savedThemeId && availableThemes[savedThemeId]) {
        setThemeState(availableThemes[savedThemeId]);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = (themeId: string) => {
    try {
      if (!availableThemes[themeId]) {
        throw new Error(`Theme ${themeId} not found`);
      }
      storage.set(THEME_STORAGE_KEY, themeId);
      setThemeState(availableThemes[themeId]);
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

