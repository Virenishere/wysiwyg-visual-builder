'use client';
import React, { useEffect, useState } from 'react';
import {
  FaCopy,
  FaTrash,
  FaGripVertical,
  FaPalette,
  FaCode,
  FaExpand,
} from 'react-icons/fa';
import { MdModeEditOutline } from 'react-icons/md';
import useDivStore from '@/store/UseDivStore';
import { getResponsiveValue } from '@/utils/screen';

export default function SectionsPanel({
  parents,
  selectedParentId,
  setSelectedParent,
  removeParent,
  duplicateParent,
  selectedParent,
  updateParentSize,
}) {
  const { screenSize } = useDivStore();
  const [windowHeight, setWindowHeight] = useState(800);
  const [expandedSettings, setExpandedSettings] = useState({});
  const [customHeights, setCustomHeights] = useState({});

  useEffect(() => {
    const updateWindowHeight = () => {
      setWindowHeight(window.innerHeight);
    };

    updateWindowHeight();
    window.addEventListener('resize', updateWindowHeight);
    return () => window.removeEventListener('resize', updateWindowHeight);
  }, []);

  // Initialize custom heights when parents change
  useEffect(() => {
    if (parents) {
      const newCustomHeights = {};
      parents.forEach((parent) => {
        const heightValue =
          getResponsiveValue(parent.size.height, screenSize) || 300;
        newCustomHeights[parent.id] = heightValue;
      });
      setCustomHeights(newCustomHeights);
    }
  }, [parents, screenSize]);

  const toggleSettings = (parentId) => {
    setExpandedSettings((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  const handleCustomHeightChange = (parentId, value) => {
    setCustomHeights((prev) => ({
      ...prev,
      [parentId]: value,
    }));
  };

  const handleCustomHeightBlur = (parentId, value) => {
    const numValue = parseInt(value) || 0;
    const validatedValue = Math.max(100, Math.min(5000, numValue));

    setCustomHeights((prev) => ({
      ...prev,
      [parentId]: validatedValue,
    }));
    updateParentSize(parentId, { height: validatedValue });
  };

  const handleCustomHeightKeyDown = (parentId, e) => {
    if (e.key === 'Enter') {
      const value = e.target.value;
      const numValue = parseInt(value) || 0;
      const validatedValue = Math.max(100, Math.min(5000, numValue));

      setCustomHeights((prev) => ({
        ...prev,
        [parentId]: validatedValue,
      }));
      updateParentSize(parentId, { height: validatedValue });
    }
  };

  const getBackgroundValue = (background) => {
    return getResponsiveValue(background, screenSize) || '#ffffff';
  };

  const getBackgroundPreview = (background) => {
    const bgValue = getBackgroundValue(background);
    const bgString = String(bgValue);

    if (bgString.startsWith('linear') || bgString.startsWith('radial')) {
      return { background: bgString };
    }
    return { backgroundColor: bgString };
  };

  if (!parents || parents.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No sections available</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col ">
      {/* Section List */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        {parents.length > 0 ? (
          <div className="w-full space-y-3">
            {parents.map((parent, index) => {
              const isSelected = selectedParentId === parent.id;
              const isExpanded = expandedSettings[parent.id];
              const backgroundValue = getBackgroundValue(
                parent.size.background
              );
              const heightValue =
                getResponsiveValue(parent.size.height, screenSize) || 300;

              return (
                <div
                  key={parent.id}
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-gradient-to-br from-blue-50 to-indigo-50'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {/* Main Card Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => setSelectedParent(parent.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <FaGripVertical className="text-gray-400 text-sm" />
                        <div
                          className="w-6 h-6 rounded-lg border-2 border-white shadow-sm"
                          style={getBackgroundPreview(parent.size.background)}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Section {index + 1}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {heightValue}px • {parent.rnds?.length || 0} boxes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSettings(parent.id);
                        }}
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          isExpanded
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer'
                        }`}
                        title="Toggle Settings"
                      >
                        <MdModeEditOutline size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateParent(parent.id);
                        }}
                        className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200 cursor-pointer"
                        title="Duplicate Section"
                      >
                        <FaCopy size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this section?')) {
                            removeParent(parent.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200 cursor-pointer"
                        title="Delete Section"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Settings Panel */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50/50 p-4 space-y-4">
                      {/* Height Controls */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <FaExpand className="text-blue-500" size={12} />
                            Height Controls
                          </label>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            {heightValue}px
                          </span>
                        </div>

                        {/* Compact Height Input and Slider */}
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          {/* Custom Height Input - Primary Control */}
                          <div className="mb-3">
                            <label className="text-xs font-medium text-gray-600 mb-1 block">
                              Custom Height (px) - Range: 100-5000px
                            </label>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 relative">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={
                                    customHeights[parent.id] !== undefined
                                      ? customHeights[parent.id]
                                      : heightValue.toString()
                                  }
                                  onChange={(e) =>
                                    handleCustomHeightChange(
                                      parent.id,
                                      e.target.value
                                    )
                                  }
                                  onBlur={(e) =>
                                    handleCustomHeightBlur(
                                      parent.id,
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) =>
                                    handleCustomHeightKeyDown(parent.id, e)
                                  }
                                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition-all duration-200 text-sm ${(() => {
                                    const val = customHeights[parent.id];
                                    const numVal = parseInt(val);
                                    if (val === '' || val === undefined)
                                      return 'border-gray-300 focus:border-blue-400';
                                    if (
                                      isNaN(numVal) ||
                                      numVal < 100 ||
                                      numVal > 5000
                                    ) {
                                      return 'border-orange-300 bg-orange-50 focus:border-orange-400';
                                    }
                                    return 'border-gray-300 focus:border-blue-400';
                                  })()}`}
                                  placeholder="Enter height (100-5000)"
                                />
                                {/* Validation indicator */}
                                {(() => {
                                  const val = customHeights[parent.id];
                                  const numVal = parseInt(val);
                                  if (
                                    val &&
                                    !isNaN(numVal) &&
                                    (numVal < 100 || numVal > 5000)
                                  ) {
                                    return (
                                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                        <span className="text-orange-500 text-xs font-medium">
                                          {numVal < 100
                                            ? 'Min: 100'
                                            : 'Max: 5000'}
                                        </span>
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    const currentVal = customHeights[parent.id];
                                    const currentHeight =
                                      currentVal && !isNaN(parseInt(currentVal))
                                        ? parseInt(currentVal)
                                        : heightValue;
                                    const newHeight = Math.min(
                                      5000,
                                      currentHeight + 50
                                    );
                                    setCustomHeights((prev) => ({
                                      ...prev,
                                      [parent.id]: newHeight.toString(),
                                    }));
                                    updateParentSize(parent.id, {
                                      height: newHeight,
                                    });
                                  }}
                                  className="px-2 py-2 bg-blue-100 text-blue-600 rounded text-xs hover:bg-blue-200 transition-colors font-medium"
                                  title="Increase by 50px"
                                >
                                  +50
                                </button>
                                <button
                                  onClick={() => {
                                    const currentVal = customHeights[parent.id];
                                    const currentHeight =
                                      currentVal && !isNaN(parseInt(currentVal))
                                        ? parseInt(currentVal)
                                        : heightValue;
                                    const newHeight = Math.max(
                                      100,
                                      currentHeight - 50
                                    );
                                    setCustomHeights((prev) => ({
                                      ...prev,
                                      [parent.id]: newHeight.toString(),
                                    }));
                                    updateParentSize(parent.id, {
                                      height: newHeight,
                                    });
                                  }}
                                  className="px-2 py-2 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200 transition-colors font-medium"
                                  title="Decrease by 50px"
                                >
                                  -50
                                </button>
                              </div>
                            </div>
                            {/* Helper text */}
                            <div className="mt-1 text-xs text-gray-500">
                              {(() => {
                                const val = customHeights[parent.id];
                                const numVal = parseInt(val);
                                if (val === '' || val === undefined) {
                                  return (
                                    <span className="text-blue-600">
                                      Type your desired height...
                                    </span>
                                  );
                                } else if (isNaN(numVal)) {
                                  return (
                                    <span className="text-orange-600">
                                      Please enter numbers only
                                    </span>
                                  );
                                } else if (numVal < 100) {
                                  return (
                                    <span className="text-orange-600">
                                      Minimum height is 100px
                                    </span>
                                  );
                                } else if (numVal > 5000) {
                                  return (
                                    <span className="text-orange-600">
                                      Maximum height is 5000px
                                    </span>
                                  );
                                } else {
                                  return (
                                    <span>
                                      Current: {heightValue}px • Valid range:
                                      100-5000px
                                    </span>
                                  );
                                }
                              })()}
                            </div>
                          </div>

                          {/* Height Slider - Secondary Control */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-medium text-gray-600">
                                Quick Slider (up to {windowHeight}px)
                              </label>
                              <span className="text-xs text-gray-500">
                                {heightValue > windowHeight
                                  ? `${windowHeight}px (max)`
                                  : `${Math.min(heightValue, windowHeight)}px`}
                              </span>
                            </div>
                            <div className="relative">
                              <input
                                type="range"
                                min="100"
                                max={windowHeight}
                                value={Math.min(heightValue, windowHeight)}
                                onChange={(e) => {
                                  const newHeight = Number.parseInt(
                                    e.target.value
                                  );
                                  setCustomHeights((prev) => ({
                                    ...prev,
                                    [parent.id]: newHeight,
                                  }));
                                  updateParentSize(parent.id, {
                                    height: newHeight,
                                  });
                                }}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                                    ((Math.min(heightValue, windowHeight) -
                                      100) /
                                      (windowHeight - 100)) *
                                    100
                                  }%, #e5e7eb ${
                                    ((Math.min(heightValue, windowHeight) -
                                      100) /
                                      (windowHeight - 100)) *
                                    100
                                  }%, #e5e7eb 100%)`,
                                }}
                              />
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>100px</span>
                                <span>{windowHeight}px</span>
                              </div>
                            </div>
                          </div>

                          {/* Height Presets */}
                          <div className="mt-3">
                            <label className="text-xs font-medium text-gray-600 mb-2 block">
                              Quick Presets
                            </label>
                            <div className="flex flex-wrap gap-1">
                              {[300, 500, 800, 1000, 1200, 1500, 2000].map(
                                (preset) => (
                                  <button
                                    key={preset}
                                    onClick={() => {
                                      setCustomHeights((prev) => ({
                                        ...prev,
                                        [parent.id]: preset,
                                      }));
                                      updateParentSize(parent.id, {
                                        height: preset,
                                      });
                                    }}
                                    className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                                      heightValue === preset
                                        ? 'bg-blue-500 text-white shadow-sm'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                  >
                                    {preset}px
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Background Controls */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Color Picker */}
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <FaPalette className="text-purple-500" size={12} />
                            Background Color
                          </label>
                          <div className="relative">
                            <input
                              type="color"
                              value={
                                typeof backgroundValue === 'string' &&
                                (backgroundValue.startsWith('linear') ||
                                  backgroundValue.startsWith('radial'))
                                  ? '#3b82f6'
                                  : backgroundValue
                              }
                              onChange={(e) =>
                                updateParentSize(parent.id, {
                                  background: e.target.value,
                                })
                              }
                              className="w-full h-12 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-purple-300 transition-colors"
                            />
                            <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-white shadow-sm" />
                          </div>
                        </div>

                        {/* Quick Gradient Presets */}
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <FaCode className="text-green-500" size={12} />
                            Quick Gradients
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                              'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                              'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                              'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                              'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                            ].map((gradient, idx) => (
                              <button
                                key={idx}
                                onClick={() =>
                                  updateParentSize(parent.id, {
                                    background: gradient,
                                  })
                                }
                                className="h-8 rounded-lg border-2 border-white shadow-sm hover:scale-105 transition-transform"
                                style={{ background: gradient }}
                                title="Apply gradient"
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Custom CSS Background */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <FaCode className="text-orange-500" size={12} />
                          Custom CSS Background
                        </label>
                        <div className="relative">
                          <textarea
                            value={backgroundValue}
                            onChange={(e) =>
                              updateParentSize(parent.id, {
                                background: e.target.value,
                              })
                            }
                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all duration-200 text-sm font-mono resize-none"
                            placeholder="linear-gradient(45deg, #ff6b6b, #4ecdc4)"
                            rows={3}
                          />
                          <div className="absolute top-2 right-2">
                            <div
                              className="w-6 h-6 rounded-md border-2 border-white shadow-sm"
                              style={getBackgroundPreview(
                                parent.size.background
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600" />
                  )}
                </div>
              );
            })}

            <style jsx>{`
              .slider::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #3b82f6;
                cursor: pointer;
                border: 3px solid white;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                transition: all 0.2s ease;
              }

              .slider::-webkit-slider-thumb:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
              }

              .slider::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #3b82f6;
                cursor: pointer;
                border: 3px solid white;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
              }
            `}</style>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
            <p className="text-lg text-gray-400 italic mt-2">
              No sections added yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
