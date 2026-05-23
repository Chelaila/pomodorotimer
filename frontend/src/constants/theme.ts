export const THEME = {
  LIGHT: 'light',
  DARK: 'dark'
} as const;

export const THEME_LABELS = {
  [THEME.LIGHT]: 'Claro',
  [THEME.DARK]: 'Oscuro'
} as const;

export const COLOR_VARIABLES = {
  PRIMARY: {
    LIGHT: 'var(--color-primary-100)',
    MAIN: 'var(--color-primary-500)',
    DARK: 'var(--color-primary-700)'
  },
  SECONDARY: {
    LIGHT: 'var(--color-secondary-100)',
    MAIN: 'var(--color-secondary-500)',
    DARK: 'var(--color-secondary-700)'
  },
  ACCENT: {
    LIGHT: 'var(--color-accent-100)',
    MAIN: 'var(--color-accent-500)',
    DARK: 'var(--color-accent-700)'
  },
  BACKGROUND: {
    PRIMARY: 'var(--bg-primary)',
    SECONDARY: 'var(--bg-secondary)',
    TERTIARY: 'var(--bg-tertiary)'
  },
  TEXT: {
    PRIMARY: 'var(--text-primary)',
    SECONDARY: 'var(--text-secondary)',
    TERTIARY: 'var(--text-tertiary)',
    INVERSE: 'var(--text-inverse)'
  }
} as const; 