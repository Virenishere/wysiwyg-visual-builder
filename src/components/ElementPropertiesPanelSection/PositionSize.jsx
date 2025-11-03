'use client';
import useDivStore from '@/store/UseDivStore';
import { getResponsiveValue, measureContainer } from '@/utils/screen';
import {
  FiMaximize2,
  FiMaximize,
  FiArrowRight,
  FiArrowDown,
  FiTarget,
} from 'react-icons/fi';
import { useEffect, useMemo, useState } from 'react';

export default function PositionSize({
  selectedElement,
  updateElement,
  parentId,
  boxId,
  elementId,
}) {
  const { screenSize, centerBox, centerElement, parents } = useDivStore();

  const [values, setValues] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const selectedParent = useMemo(
    () => parents.find((p) => p.id === parentId),
    [parents, parentId]
  );
  const selectedBox = useMemo(
    () => selectedParent?.rnds.find((b) => b.id === boxId),
    [selectedParent, boxId]
  );

  const boxWidth =
    parseInt(getResponsiveValue(selectedBox?.width, screenSize), 10) || 0;
  const boxHeight =
    parseInt(getResponsiveValue(selectedBox?.height, screenSize), 10) || 0;

  useEffect(() => {
    const width =
      parseFloat(getResponsiveValue(selectedElement?.width, screenSize)) || 0;
    const height =
      parseFloat(getResponsiveValue(selectedElement?.height, screenSize)) || 0;
    const x =
      parseFloat(getResponsiveValue(selectedElement?.x, screenSize)) || 0;
    const y =
      parseFloat(getResponsiveValue(selectedElement?.y, screenSize)) || 0;
    setValues({ width, height, x, y });
  }, [selectedElement, screenSize]);

  const bounds = useMemo(() => {
    if (elementId) {
      return {
        widthMax: Math.max(0, boxWidth),
        heightMax: Math.max(0, boxHeight),
        xMax: Math.max(0, Math.max(0, boxWidth - values.width)),
        yMax: Math.max(0, Math.max(0, boxHeight - values.height)),
      };
    }
    // Box bounds: derive section width/height
    let sectionWidth = 800;
    let sectionHeight =
      parseInt(
        getResponsiveValue(selectedParent?.size?.height, screenSize),
        10
      ) || 300;
    const sectionEl =
      typeof document !== 'undefined'
        ? document.querySelector(`[data-id="${parentId}"]`)
        : null;
    if (sectionEl) {
      const m = measureContainer(sectionEl);
      sectionWidth = Math.max(0, Math.floor(m.contentWidth));
      sectionHeight = Math.max(0, Math.floor(m.contentHeight));
    }
    return {
      widthMax: Math.max(0, sectionWidth),
      heightMax: Math.max(0, sectionHeight),
      xMax: Math.max(0, Math.max(0, sectionWidth - values.width)),
      yMax: Math.max(0, Math.max(0, sectionHeight - values.height)),
    };
  }, [
    elementId,
    boxWidth,
    boxHeight,
    values.width,
    values.height,
    selectedParent,
    parentId,
    screenSize,
  ]);

  const clamp = (val, min, max) =>
    Math.max(min, Math.min(Number.isFinite(max) ? max : val, val));

  const handleUpdateSafe = (key, raw) => {
    const next = Number.parseFloat(raw) || 0;

    let nextWidth = values.width;
    let nextHeight = values.height;
    let nextX = values.x;
    let nextY = values.y;

    if (key === 'width') nextWidth = clamp(next, 0, bounds.widthMax);
    if (key === 'height') nextHeight = clamp(next, 0, bounds.heightMax);
    if (key === 'x') nextX = clamp(next, 0, bounds.xMax);
    if (key === 'y') nextY = clamp(next, 0, bounds.yMax);

    // Recompute dependent bounds when width/height change
    const xMax = elementId
      ? Math.max(0, Math.max(0, boxWidth - nextWidth))
      : Math.max(0, Math.max(0, (bounds.widthMax || 0) - nextWidth));
    const yMax = elementId
      ? Math.max(0, Math.max(0, boxHeight - nextHeight))
      : Math.max(0, Math.max(0, (bounds.heightMax || 0) - nextHeight));
    if (key === 'width') nextX = clamp(nextX, 0, xMax);
    if (key === 'height') nextY = clamp(nextY, 0, yMax);

    setValues({ width: nextWidth, height: nextHeight, x: nextX, y: nextY });

    const updates =
      key === 'width'
        ? { width: nextWidth, x: nextX }
        : key === 'height'
          ? { height: nextHeight, y: nextY }
          : key === 'x'
            ? { x: nextX }
            : { y: nextY };

    updateElement(parentId, boxId, elementId, updates);
  };

  const handleCenter = () => {
    if (elementId) {
      centerElement(parentId, boxId, elementId);
    } else {
      centerBox(parentId, boxId);
    }
  };

  const fields = [
    {
      label: 'Width',
      key: 'width',
      icon: <FiMaximize className="w-4 h-4" />,
      max: bounds.widthMax,
    },
    {
      label: 'Height',
      key: 'height',
      icon: <FiMaximize2 className="w-4 h-4" />,
      max: bounds.heightMax,
    },
    {
      label: 'X Position',
      key: 'x',
      icon: <FiArrowRight className="w-4 h-4" />,
      max: bounds.xMax,
    },
    {
      label: 'Y Position',
      key: 'y',
      icon: <FiArrowDown className="w-4 h-4" />,
      max: bounds.yMax,
    },
  ];

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
      <div className="mb-4">
        <button
          onClick={handleCenter}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium transition-all"
        >
          <FiTarget className="w-4 h-4" />
          Center {elementId ? 'Element' : 'Box'}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {fields.map(({ label, key, icon, max }) => (
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
                {Math.round(values[key])}px
              </span>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={Number.isFinite(max) ? Math.max(0, Math.floor(max)) : 1000}
                step="1"
                value={values[key]}
                onChange={(e) => handleUpdateSafe(key, e.target.value)}
                className="w-full h-2 bg-gradient-to-r from-orange-200 to-red-300 rounded-lg appearance-none cursor-pointer slider"
              />
              <input
                type="number"
                min={0}
                max={
                  Number.isFinite(max)
                    ? Math.max(0, Math.floor(max))
                    : undefined
                }
                step={1}
                value={values[key]}
                onChange={(e) => handleUpdateSafe(key, e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
