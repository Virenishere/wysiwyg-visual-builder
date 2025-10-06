'use client';
import {
  FiBox,
  FiArrowUp,
  FiArrowRight,
  FiArrowDown,
  FiArrowLeft,
  FiPackage,
  FiTarget,
} from 'react-icons/fi';
import useDivStore from '@/store/UseDivStore';
import { getResponsiveValue } from '@/utils/screen';

export default function Spacing({
  selectedElement,
  updateElement,
  parentId,
  boxId,
  elementId,
}) {
  const { screenSize } = useDivStore();

  const sides = [
    { key: 'top', label: 'T', icon: <FiArrowUp className="w-3 h-3" /> },
    { key: 'right', label: 'R', icon: <FiArrowRight className="w-3 h-3" /> },
    { key: 'bottom', label: 'B', icon: <FiArrowDown className="w-3 h-3" /> },
    { key: 'left', label: 'L', icon: <FiArrowLeft className="w-3 h-3" /> },
  ];

  const handleChange = (type, side, value) => {
    const currentTypeValue = selectedElement[type] || {};
    const responsiveSideValue =
      typeof currentTypeValue[side] === 'object' &&
      currentTypeValue[side] !== null
        ? currentTypeValue[side]
        : { '4k': currentTypeValue[side] };

    const newTypeValue = {
      ...currentTypeValue,
      [side]: {
        ...responsiveSideValue,
        [screenSize]: Number.parseInt(value) || 0,
      },
    };

    updateElement(parentId, boxId, elementId, { [type]: newTypeValue });
  };

  const SpacingSection = ({ type, title, icon, gradientFrom, gradientTo }) => {
    const spacingValues = getResponsiveValue(selectedElement[type], screenSize);

    return (
      <div
        className={`p-4 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl border border-gray-200`}
      >
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <label className="text-sm font-medium text-gray-700">{title}</label>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {sides.map(({ key, label, icon }) => {
            const value =
              getResponsiveValue(spacingValues?.[key], screenSize) || 0;
            return (
              <div key={key} className="text-center">
                <label className="text-xs text-gray-600 block mb-1 flex items-center justify-center gap-1">
                  {icon}
                  {label}
                </label>
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={value}
                    onChange={(e) => handleChange(type, key, e.target.value)}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-small"
                  />
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleChange(type, key, e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-center text-gray-700 transition-all duration-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 focus:outline-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
          <FiBox className="w-3.5 h-3.5 text-white" />
        </div>
        <h4 className="text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          Spacing Controls
        </h4>
      </div>

      <div className="space-y-4">
        <SpacingSection
          type="margin"
          title="Margin"
          icon={<FiPackage className="w-4 h-4" />}
          gradientFrom="from-blue-50"
          gradientTo="to-indigo-50"
        />
        <SpacingSection
          type="padding"
          title="Padding"
          icon={<FiTarget className="w-4 h-4" />}
          gradientFrom="from-indigo-50"
          gradientTo="to-purple-50"
        />
      </div>
    </div>
  );
}
