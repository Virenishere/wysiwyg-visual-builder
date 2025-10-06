'use client';
import { FiType, FiDroplet, FiEdit3 } from 'react-icons/fi';
import useDivStore from '@/store/UseDivStore';
import { getResponsiveValue } from '@/utils/screen';

export default function Typography({
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

  const fontSize = getResponsiveValue(selectedElement.fontSize, screenSize);
  const fontFamily = getResponsiveValue(selectedElement.fontFamily, screenSize);
  const color = getResponsiveValue(selectedElement.color, screenSize);
  const backgroundColor = getResponsiveValue(
    selectedElement.backgroundColor,
    screenSize
  );

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg">
          <FiType className="w-3.5 h-3.5 text-white" />
        </div>
        <h4 className="text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          Typography & Colors
        </h4>
      </div>

      <div className="space-y-4">
        {/* Font Size Slider */}
        <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-100">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiType className="w-4 h-4" />
              Font Size
            </label>
            <span className="px-2 py-1 bg-white rounded-lg text-xs font-bold text-gray-600 border">
              {fontSize}px
            </span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="8"
              max="72"
              value={fontSize || 12}
              onChange={(e) =>
                handleUpdate('fontSize', Number.parseInt(e.target.value) || 12)
              }
              className="w-full h-2 bg-gradient-to-r from-pink-200 to-rose-300 rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="number"
              value={fontSize || 12}
              onChange={(e) =>
                handleUpdate('fontSize', Number.parseInt(e.target.value) || 12)
              }
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all duration-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Font Family */}
        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
          <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
            <FiEdit3 className="w-4 h-4" />
            Font Family
          </label>
          <select
            value={fontFamily || 'Arial, sans-serif'}
            onChange={(e) => handleUpdate('fontFamily', e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none hover:border-gray-300 cursor-pointer"
          >
            <option value="Arial, sans-serif">Arial (Sans-serif)</option>
            <option value="Times, serif">Times New Roman (Serif)</option>
            <option value="Courier, monospace">Courier (Monospace)</option>
            <option value="Georgia, serif">Georgia (Serif)</option>
            <option value="Verdana, sans-serif">Verdana (Sans-serif)</option>
            <option value="Comic Sans MS, cursive">Comic Sans (Cursive)</option>
          </select>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
            <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
              <FiDroplet className="w-4 h-4" />
              Text Color
            </label>
            <div className="relative group">
              <input
                type="color"
                value={color !== 'transparent' ? color : '#000000'}
                onChange={(e) => handleUpdate('color', e.target.value)}
                className="w-full h-12 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-cyan-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100">
            <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
              <FiDroplet className="w-4 h-4" />
              Background
            </label>
            <div className="flex gap-2">
              <div className="relative group flex-1">
                <input
                  type="color"
                  value={
                    backgroundColor !== 'transparent'
                      ? backgroundColor
                      : '#ffffff'
                  }
                  onChange={(e) =>
                    handleUpdate('backgroundColor', e.target.value)
                  }
                  className="w-full h-12 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-violet-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <button
                onClick={() => handleUpdate('backgroundColor', 'transparent')}
                className="px-3 py-2 bg-white border-2 border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 active:scale-95"
                title="Make transparent"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
