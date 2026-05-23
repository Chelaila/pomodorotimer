import { ColorPalette } from '../types/theme';

const THEME_STORAGE_KEY = 'pomodoro-theme';

const defaultTheme: ColorPalette = {
  primary: {
    main: '#0F8B8D',
    light: '#0d7a7c',
    dark: '#074749'
  },
  secondary: {
    main: '#143642',
    light: '#12303a',
    dark: '#0c1e22'
  },
  accent: {
    main: '#EC9A29',
    light: '#d48b25',
    dark: '#8c5e19'
  },
  background: {
    main: '#f7f5f8',
    light: '#ffffff',
    dark: '#827e80'
  },
  text: {
    primary: '#143642',
    secondary: '#827e80',
    light: '#ffffff'
  },
  error: '#A8201A',
  success: '#0F8B8D',
  warning: '#EC9A29',
  info: '#143642'
};

export const loadTheme = (): ColorPalette => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme) {
    try {
      const parsedTheme = JSON.parse(savedTheme) as ColorPalette;
      return parsedTheme;
    } catch (error) {
      console.error('Error loading theme:', error);
      return defaultTheme;
    }
  }
  return defaultTheme;
};

export const saveTheme = (theme: ColorPalette): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    applyTheme(theme);
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

export const resetTheme = (): void => {
  localStorage.removeItem(THEME_STORAGE_KEY);
  applyTheme(defaultTheme);
};

const applyTheme = (theme: ColorPalette): void => {
  const root = document.documentElement;
  
  // Apply nested color properties
  Object.entries(theme).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      Object.entries(value as Record<string, string>).forEach(([shade, color]) => {
        root.style.setProperty(`--color-${key}-${shade}`, color);
      });
    } else if (typeof value === 'string') {
      root.style.setProperty(`--color-${key}`, value);
    }
  });
};

// Función auxiliar para ajustar el brillo de un color
export const adjustColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '');
  const r = Math.max(Math.min(parseInt(hex.substr(0, 2), 16) + amount, 255), 0);
  const g = Math.max(Math.min(parseInt(hex.substr(2, 2), 16) + amount, 255), 0);
  const b = Math.max(Math.min(parseInt(hex.substr(4, 2), 16) + amount, 255), 0);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}; 