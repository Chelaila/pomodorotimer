export interface ColorPalette {
  primary: {
    main: string;
    light: string;
    dark: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
  };
  accent: {
    main: string;
    light: string;
    dark: string;
  };
  background: {
    main: string;
    light: string;
    dark: string;
  };
  text: {
    primary: string;
    secondary: string;
    light: string;
  };
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface ThemeContextType {
  colors: ColorPalette;
  updateColors: (colors: ColorPalette) => void;
  resetColors: () => void;
} 