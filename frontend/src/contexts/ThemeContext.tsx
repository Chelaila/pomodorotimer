import * as React from 'react';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ColorPalette } from '../types/theme';
import { loadTheme, saveTheme, resetTheme as resetThemeService } from '../services/themeService';
import { ThemeContextType } from '../interfaces/contexts/ThemeContext.interface';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colors, setColors] = useState<ColorPalette>(loadTheme());
  const [isDark, setIsDark] = useState<boolean>(() => localStorage.getItem('pomodoro-dark') === 'true');

  useEffect(() => {
    saveTheme(colors);
  }, [colors]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('pomodoro-dark', String(isDark));
  }, [isDark]);

  const updateColors = (newColors: ColorPalette) => setColors(newColors);

  const resetColors = () => {
    resetThemeService();
    setColors(loadTheme());
  };

  const toggleDark = () => setIsDark(prev => !prev);

  const value = useMemo(
    () => ({ colors, updateColors, resetColors, isDark, toggleDark }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colors, isDark]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
