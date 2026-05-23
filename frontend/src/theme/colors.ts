export const colors = {
  // Colores principales
  primary: {
    main: '#2C3E50',    // Azul oscuro elegante
    light: '#34495E',   // Versión más clara
    dark: '#1A252F',    // Versión más oscura
  },
  secondary: {
    main: '#E74C3C',    // Rojo para acentos
    light: '#FF6B6B',   // Versión más clara
    dark: '#C0392B',    // Versión más oscura
  },
  // Colores de fondo
  background: {
    default: '#F5F6FA', // Fondo principal
    paper: '#FFFFFF',   // Fondo de tarjetas
    dark: '#ECF0F1',   // Fondo alternativo
  },
  // Colores de texto
  text: {
    primary: '#2C3E50',   // Texto principal
    secondary: '#7F8C8D', // Texto secundario
    light: '#FFFFFF',     // Texto sobre fondos oscuros
  },
  // Estados
  status: {
    success: '#27AE60',   // Verde para éxito
    error: '#E74C3C',     // Rojo para error
    warning: '#F1C40F',   // Amarillo para advertencia
    info: '#3498DB',      // Azul para información
  },
  // Bordes y divisores
  border: {
    light: '#E0E0E0',
    main: '#BDC3C7',
    dark: '#95A5A6',
  }
} as const;

// Tipos para TypeScript
export type ColorKeys = keyof typeof colors;
export type ColorShades = keyof typeof colors.primary; 