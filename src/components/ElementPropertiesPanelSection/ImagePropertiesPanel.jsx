'use client';
import { useState } from 'react';
import { FiImage, FiSettings } from 'react-icons/fi';
import useDivStore from '@/store/UseDivStore';
import { getResponsiveValue } from '@/utils/screen';

export default function ImagePropertiesPanel({
  selectedElement,
  updateElement,
  parentId,
  boxId,
  elementId,
}) {
  const objectFitOptions = [
    { value: 'cover', label: 'Cover' },
    { value: 'contain', label: 'Contain' },
    { value: 'fill', label: 'Fill' },
    { value: 'scale-down', label: 'Scale Down' },
    { value: 'none', label: 'None' },
  ];

  const objectPositionOptions = [
    { value: 'center', label: 'Center' },
    { value: 'top', label: 'Top' },
    { value: 'bottom', label: 'Bottom' },
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
    { value: 'top left', label: 'Top Left' },
    { value: 'top right', label: 'Top Right' },
    { value: 'bottom left', label: 'Bottom Left' },
    { value: 'bottom right', label: 'Bottom Right' },
  ];

  const handlePropertyChange = (property, value) => {
    updateElement(parentId, boxId, elementId, { [property]: value });
  };

  // screen-aware values
  const { screenSize } = useDivStore();
  const currentObjectFit =
    getResponsiveValue(selectedElement.objectFit, screenSize) || 'cover';
  const currentObjectPosition =
    getResponsiveValue(selectedElement.objectPosition, screenSize) || 'center';
  const currentOpacity =
    getResponsiveValue(selectedElement.opacity, screenSize) ?? 1;
  const currentFilter =
    getResponsiveValue(selectedElement.filter, screenSize) || 'none';

  if (selectedElement.type !== 'image') return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
          <FiImage className="w-3.5 h-3.5 text-white" />
        </div>
        <h4 className="text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          Image Properties
        </h4>
      </div>

      <div className="space-y-4">
        {/* Object Fit */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Object Fit
          </label>
          <select
            value={currentObjectFit}
            onChange={(e) => handlePropertyChange('objectFit', e.target.value)}
            className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm"
          >
            {objectFitOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Object Position */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Object Position
          </label>
          <select
            value={currentObjectPosition}
            onChange={(e) =>
              handlePropertyChange('objectPosition', e.target.value)
            }
            className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm"
          >
            {objectPositionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Opacity */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Opacity: {Math.round((Number(currentOpacity) || 1) * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={Number(currentOpacity) || 1}
            onChange={(e) =>
              handlePropertyChange('opacity', parseFloat(e.target.value))
            }
            className="w-full"
          />
        </div>

        {/* Filter Effects */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Filter Effects
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handlePropertyChange('filter', 'grayscale(100%)')}
              className={`px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs hover:bg-gray-50 ${
                currentFilter === 'grayscale(100%)'
                  ? 'ring-2 ring-blue-400'
                  : ''
              }`}
            >
              Grayscale
            </button>
            <button
              onClick={() => handlePropertyChange('filter', 'sepia(100%)')}
              className={`px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs hover:bg-gray-50 ${
                currentFilter === 'sepia(100%)' ? 'ring-2 ring-blue-400' : ''
              }`}
            >
              Sepia
            </button>
            <button
              onClick={() => handlePropertyChange('filter', 'blur(5px)')}
              className={`px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs hover:bg-gray-50 ${
                currentFilter === 'blur(5px)' ? 'ring-2 ring-blue-400' : ''
              }`}
            >
              Blur
            </button>
            <button
              onClick={() => handlePropertyChange('filter', 'brightness(150%)')}
              className={`px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs hover:bg-gray-50 ${
                currentFilter === 'brightness(150%)'
                  ? 'ring-2 ring-blue-400'
                  : ''
              }`}
            >
              Bright
            </button>
            <button
              onClick={() => handlePropertyChange('filter', 'contrast(150%)')}
              className={`px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs hover:bg-gray-50 ${
                currentFilter === 'contrast(150%)' ? 'ring-2 ring-blue-400' : ''
              }`}
            >
              Contrast
            </button>
            <button
              onClick={() => handlePropertyChange('filter', 'none')}
              className={`px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs hover:bg-gray-50 ${
                currentFilter === 'none' ? 'ring-2 ring-blue-400' : ''
              }`}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Transform */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Transform (CSS)
            <span
              className="ml-2 inline-block px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-700"
              title="Use standard CSS transform functions. Examples: rotate(45deg), scale(1.2), translateX(10px). Multiple transforms can be space-separated."
            >
              i
            </span>
          </label>
          <input
            type="text"
            value={
              getResponsiveValue(selectedElement.transform, screenSize) || ''
            }
            onChange={(e) => handlePropertyChange('transform', e.target.value)}
            className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm font-mono"
            placeholder="e.g., rotate(45deg) scale(1.2)"
          />
        </div>
      </div>
    </div>
  );
}
