'use client';
import { useState, useEffect, useRef } from 'react';
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

  const initialMargin = getResponsiveValue(
    selectedElement.margin,
    screenSize
  ) || { top: 0, right: 0, bottom: 0, left: 0 };
  const initialPadding = getResponsiveValue(
    selectedElement.padding,
    screenSize
  ) || { top: 5, right: 10, bottom: 5, left: 10 };

  const [localMargin, setLocalMargin] = useState(initialMargin);
  const [localPadding, setLocalPadding] = useState(initialPadding);

  // Declare these ONCE here; remove any duplicate declarations further below
  const marginDebounceRef = useRef(null);
  const paddingDebounceRef = useRef(null);
  const DEBOUNCE_MS = 120;

  useEffect(() => {
    setLocalMargin(
      getResponsiveValue(selectedElement.margin, screenSize) || {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }
    );
    setLocalPadding(
      getResponsiveValue(selectedElement.padding, screenSize) || {
        top: 5,
        right: 10,
        bottom: 5,
        left: 10,
      }
    );
  }, [selectedElement, screenSize]);

  const commitType = (type, values) => {
    updateElement(parentId, boxId, elementId, { [type]: values });
  };

  const scheduleCommit = (type) => {
    if (type === 'margin') {
      clearTimeout(marginDebounceRef.current);
      marginDebounceRef.current = setTimeout(
        () => commitType('margin', localMargin),
        DEBOUNCE_MS
      );
    } else {
      clearTimeout(paddingDebounceRef.current);
      paddingDebounceRef.current = setTimeout(
        () => commitType('padding', localPadding),
        DEBOUNCE_MS
      );
    }
  };

  const handleLocalChange = (type, side, rawValue) => {
    const value = Math.max(
      0,
      Math.min(100, Number.parseInt(rawValue, 10) || 0)
    );
    if (type === 'margin') {
      setLocalMargin((prev) => ({ ...prev, [side]: value }));
    } else {
      setLocalPadding((prev) => ({ ...prev, [side]: value }));
    }
    scheduleCommit(type);
  };

  const SpacingSection = ({ type, title, icon, gradientFrom, gradientTo }) => {
    const values = type === 'margin' ? localMargin : localPadding;

    return (
      <div
        className={`p-4 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl border border-gray-200`}
      >
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <label className="text-sm font-medium text-gray-700">{title}</label>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {sides.map(({ key, label, icon }) => (
            <div key={key} className="text-center">
              <label className="text-xs text-gray-600 block mb-1 flex items-center justify-center gap-1">
                {icon}
                {label}
              </label>
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={values?.[key] || 0}
                  onChange={(e) => handleLocalChange(type, key, e.target.value)}
                  onMouseUp={() =>
                    commitType(
                      type,
                      type === 'margin' ? localMargin : localPadding
                    )
                  }
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-small"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={values?.[key] || 0}
                  onChange={(e) => handleLocalChange(type, key, e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs"
                />
              </div>
            </div>
          ))}
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
