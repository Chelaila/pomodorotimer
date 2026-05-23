import * as React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ColorPalette } from '../../types/theme';

const ThemeSettings: React.FC = () => {
  const { colors, updateColors, resetColors } = useTheme();

  const handleColorChange = (key: keyof ColorPalette, value: string) => {
    updateColors({
      ...colors,
      [key]: value
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Configuración de Tema</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(colors).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-medium mb-1 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={value}
                onChange={(e) => handleColorChange(key as keyof ColorPalette, e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => handleColorChange(key as keyof ColorPalette, e.target.value)}
                className="flex-1 px-2 py-1 border rounded"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          onClick={resetColors}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          Restaurar Colores por Defecto
        </button>
      </div>
    </div>
  );
};

export default ThemeSettings; 