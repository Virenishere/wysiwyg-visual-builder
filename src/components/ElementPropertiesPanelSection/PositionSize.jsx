'use client';
import useDivStore from '@/store/UseDivStore';
import { getResponsiveValue } from '@/utils/screen';
import {
  FiMaximize2,
  FiMaximize,
  FiArrowRight,
  FiArrowDown,
  FiTarget,
} from 'react-icons/fi';

export default function PositionSize({
  selectedElement,
  updateElement,
  parentId,
  boxId,
  elementId,
}) {
  const { screenSize, centerBox, centerElement } = useDivStore();

  const fields = [
    {
      label: 'Width',
      key: 'width',
      icon: <FiMaximize className="w-4 h-4" />,
      max: 1000,
    },
    {
      label: 'Height',
      key: 'height',
      icon: <FiMaximize2 className="w-4 h-4" />,
      max: 1000,
    },
    {
      label: 'X Position',
      key: 'x',
      icon: <FiArrowRight className="w-4 h-4" />,
      max: 500,
    },
    {
      label: 'Y Position',
      key: 'y',
      icon: <FiArrowDown className="w-4 h-4" />,
      max: 500,
    },
  ];

  const handleUpdate = (key, value) => {
    updateElement(parentId, boxId, elementId, { [key]: value });
  };

  const handleCenter = () => {
    if (elementId) {
      // Center element within box
      centerElement(parentId, boxId, elementId);
    } else {
      // Center box within section
      centerBox(parentId, boxId);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
          <FiMaximize2 className="w-3.5 h-3.5 text-white" />
        </div>
        <h4 className="text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          Position & Size
        </h4>
      </div>

      {/* Center Button */}
      <div className="mb-4">
        <button
          onClick={handleCenter}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <FiTarget className="w-4 h-4" />
          Center {elementId ? 'Element' : 'Box'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {fields.map(({ label, key, icon, max }) => {
          const value = getResponsiveValue(selectedElement[key], screenSize);
          const displayValue =
            value !== null && value !== undefined ? value : 0;

          return (
            <div
              key={key}
              className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100"
            >
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  {icon}
                  {label}
                </label>
                <span className="px-2 py-1 bg-white rounded-lg text-xs font-bold text-gray-600 border">
                  {Math.round(displayValue)}px
                </span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max={max}
                  value={displayValue}
                  onChange={(e) =>
                    handleUpdate(key, Number.parseInt(e.target.value) || 0)
                  }
                  className="w-full h-2 bg-gradient-to-r from-orange-200 to-red-300 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="number"
                  value={displayValue}
                  onChange={(e) =>
                    handleUpdate(key, Number.parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
