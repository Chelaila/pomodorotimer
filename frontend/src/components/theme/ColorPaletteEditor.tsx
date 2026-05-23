import * as React from 'react';
import { useState } from 'react';

interface ColorPaletteEditorProps {
  onSave: (colors: ColorPalette) => void;
}

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

const ColorPaletteEditor: React.FC<ColorPaletteEditorProps> = ({ onSave }) => {
  const [colors, setColors] = useState<ColorPalette>({
    primary: getComputedStyle(document.documentElement).getPropertyValue('--color-primary-500').trim(),
    secondary: getComputedStyle(document.documentElement).getPropertyValue('--color-secondary-500').trim(),
    accent: getComputedStyle(document.documentElement).getPropertyValue('--color-accent-500').trim(),
    neutral: getComputedStyle(document.documentElement).getPropertyValue('--color-neutral-500').trim(),
    success: getComputedStyle(document.documentElement).getPropertyValue('--color-success').trim(),
    warning: getComputedStyle(document.documentElement).getPropertyValue('--color-warning').trim(),
    error: getComputedStyle(document.documentElement).getPropertyValue('--color-error').trim(),
    info: getComputedStyle(document.documentElement).getPropertyValue('--color-info').trim(),
  });

  const handleColorChange = (key: keyof ColorPalette, value: string) => {
    setColors(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onSave(colors);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Editor de Paleta de Colores</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(colors).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-4">
            <div
              className="w-12 h-12 rounded-lg border border-gray-300"
              style={{ backgroundColor: value }}
            />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange(key as keyof ColorPalette, e.target.value)}
                  className="w-12 h-8 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleColorChange(key as keyof ColorPalette, e.target.value)}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default ColorPaletteEditor; 