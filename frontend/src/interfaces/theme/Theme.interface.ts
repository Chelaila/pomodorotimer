export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

export interface ThemeContextType {
  theme: ColorPalette;
  setTheme: (theme: ColorPalette) => void;
}

export interface ColorPaletteEditorProps {
  palette: ColorPalette;
  onPaletteChange: (palette: ColorPalette) => void;
} 