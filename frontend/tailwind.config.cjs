/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#143642',    // Azul oscuro (20, 54, 66)
          light: '#0F8B8D',   // Verde azulado (15, 139, 141)
          dark: '#0A2732',    // Versión más oscura del azul principal
        },
        secondary: {
          main: '#DAD2D8',    // Gris claro (218, 210, 216)
          light: '#ECE8EB',   // Versión más clara del gris
          dark: '#A8201A',    // Rojo oscuro (168, 32, 26)
        },
        background: {
          default: '#F5F6FA', // Fondo principal (gris muy claro)
          paper: '#FFFFFF',   // Blanco para tarjetas
          dark: '#ECF0F1',    // Gris claro para fondos alternativos
        },
        text: {
          primary: '#143642', // Azul oscuro para texto principal
          secondary: '#666666', // Gris para texto secundario
          light: '#FFFFFF',   // Blanco para texto sobre fondos oscuros
        },
        status: {
          success: '#0F8B8D', // Verde azulado (15, 139, 141)
          error: '#A8201A',   // Rojo oscuro (168, 32, 26)
          warning: '#EC9A29', // Naranja (236, 154, 41)
          info: '#143642',    // Azul oscuro (20, 54, 66)
        },
        border: {
          light: '#DAD2D8',   // Gris claro (218, 210, 216)
          main: '#A8201A',    // Rojo oscuro (168, 32, 26)
          dark: '#143642',    // Azul oscuro (20, 54, 66)
        },
      },
    },
  },
  plugins: [],
} 