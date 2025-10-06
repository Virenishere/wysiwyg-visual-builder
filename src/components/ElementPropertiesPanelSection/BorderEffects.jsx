'use client';
import { FiSquare, FiCircle } from 'react-icons/fi';
import useDivStore from '@/store/UseDivStore';
import { getResponsiveValue } from '@/utils/screen';

export default function BorderEffects({
  selectedElement,
  updateElement,
  parentId,
  boxId,
  elementId,
}) {
  const { screenSize } = useDivStore();

  const handleUpdate = (key, value) => {
    updateElement(parentId, boxId, elementId, { [key]: value });
  };

  const borderRadius = getResponsiveValue(
    selectedElement.borderRadius,
    screenSize
  );
  const border = getResponsiveValue(selectedElement.border, screenSize);
  const backgroundColor = getResponsiveValue(
    selectedElement.backgroundColor,
    screenSize
  );
  const boxShadow = getResponsiveValue(selectedElement.boxShadow, screenSize);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
          <FiSquare className="w-3.5 h-3.5 text-white" />
        </div>
        <h4 className="text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          Border & Effects
        </h4>
      </div>

      <div className="space-y-4">
        {/* Border Radius Slider */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiCircle className="w-4 h-4" />
              Border Radius
            </label>
            <span className="px-2 py-1 bg-white rounded-lg text-xs font-bold text-gray-600 border">
              {borderRadius}px
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="50"
              value={borderRadius || 0}
              onChange={(e) =>
                handleUpdate(
                  'borderRadius',
                  Number.parseInt(e.target.value) || 0
                )
              }
              className="w-full h-2 bg-gradient-to-r from-emerald-200 to-teal-300 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Border Style */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Border Style
          </label>
          <select
            value={border || 'none'}
            onChange={(e) => handleUpdate('border', e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none hover:border-gray-300 cursor-pointer"
          >
            <option value="none">✨ No Border</option>
            <option value="1px solid #000">━ 1px Solid</option>
            <option value="2px solid #000">━ 2px Solid</option>
            <option value="1px dashed #000">┅ 1px Dashed</option>
            <option value="2px dashed #000">┅ 2px Dashed</option>
            <option value="1px dotted #000">⋯ 1px Dotted</option>
          </select>
        </div>

        {/* Background Color */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Background Color
          </label>
          <input
            type="color"
            value={
              backgroundColor !== 'transparent' ? backgroundColor : '#ffffff'
            }
            onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
            className="w-full h-10 px-1 py-1 bg-white border-2 border-gray-200 rounded-xl cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        {/* Custom Border */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Custom Border
          </label>
          <textarea
            value={border || ''}
            onChange={(e) => handleUpdate('border', e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none hover:border-gray-300"
            rows="2"
            placeholder="e.g., 2px solid #ccc"
          />
        </div>

        {/* Custom Background */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Custom Background
          </label>
          <textarea
            value={backgroundColor || ''}
            onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none hover:border-gray-300"
            rows="2"
            placeholder="e.g., linear-gradient(to right, #ff0000, #0000ff)"
          />
        </div>

        {/* Box Shadow */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Box Shadow
          </label>
          <select
            value={boxShadow || 'none'}
            onChange={(e) => handleUpdate('boxShadow', e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none hover:border-gray-300 cursor-pointer"
          >
            <option value="none">✨ None</option>
            <option value="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)">
              Small
            </option>
            <option value="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)">
              Medium
            </option>
            <option value="0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)">
              Large
            </option>
            <option value="0 25px 50px -12px rgba(0, 0, 0, 0.25)">
              Extra Large
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
