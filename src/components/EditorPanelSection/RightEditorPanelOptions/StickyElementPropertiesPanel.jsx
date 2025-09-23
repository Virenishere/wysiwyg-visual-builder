'use client';
import React, { useState, useRef } from 'react';
import { RxCross1 } from 'react-icons/rx';
import {
  FiMove,
  FiType,
  FiEdit3,
  FiDroplet,
  FiBox,
  FiSquare,
  FiCircle,
  FiLayers,
  FiCode,
  FiSettings,
  FiZap,
} from 'react-icons/fi';
import { FaTrashAlt, FaCopy } from 'react-icons/fa';
import {
  FiMaximize2,
  FiMaximize,
  FiArrowRight,
  FiArrowDown,
  FiArrowUp,
  FiArrowLeft,
  FiPackage,
  FiTarget,
} from 'react-icons/fi';
import useDivStore from '@/store/UseDivStore';

// Header Component
function Header({
  selectedElement,
  selectedParentId,
  selectedBoxId,
  selectedElementId,
  removeElement,
  duplicateElement,
}) {
  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-purple-100">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
          <FiSettings className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {selectedElement.type.charAt(0).toUpperCase() +
              selectedElement.type.slice(1)}{' '}
            Properties
          </h3>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <FiZap className="w-3 h-3" />
            Customize your element
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            duplicateElement(selectedParentId, selectedBoxId, selectedElementId)
          }
          className="group relative p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
          title="Duplicate Element"
        >
          <FaCopy className="w-4 h-4" />
          <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
        <button
          onClick={() =>
            removeElement(selectedParentId, selectedBoxId, selectedElementId)
          }
          className="group relative p-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
          title="Delete Element"
        >
          <FaTrashAlt className="w-4 h-4" />
          <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
}

// Content Input Component
function ContentInput({
  selectedElement,
  updateElement,
  parentId,
  boxId,
  elementId,
}) {
  if (selectedElement.type !== 'text' && selectedElement.type !== 'button')
    return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          {selectedElement.type === 'text' ? (
            <FiType className="w-3.5 h-3.5 text-white" />
          ) : (
            <FiEdit3 className="w-3.5 h-3.5 text-white" />
          )}
        </div>
        <h4 className="text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          {selectedElement.type === 'text' ? 'Content' : 'Button Text'}
        </h4>
      </div>

      <div className="relative group">
        <input
          type="text"
          value={selectedElement.content}
          onChange={(e) =>
            updateElement(parentId, boxId, elementId, {
              content: e.target.value,
            })
          }
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none hover:border-gray-300 group-hover:shadow-md"
          placeholder={
            selectedElement.type === 'text'
              ? 'Enter your text content...'
              : 'Enter button text...'
          }
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
}

// Position Size Component
function PositionSize({
  selectedElement,
  updateElement,
  parentId,
  boxId,
  elementId,
}) {
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
                {selectedElement[key]}px
              </span>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={max}
                value={selectedElement[key]}
                onChange={(e) =>
                  updateElement(parentId, boxId, elementId, {
                    [key]: Number.parseInt(e.target.value) || 0,
                  })
                }
                className="w-full h-2 bg-gradient-to-r from-orange-200 to-red-300 rounded-lg appearance-none cursor-pointer slider"
              />
              <input
                type="number"
                value={selectedElement[key]}
                onChange={(e) =>
                  updateElement(parentId, boxId, elementId, {
                    [key]: Number.parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all duration-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Typography Component
function Typography({
  selectedElement,
  updateElement,
  parentId,
  boxId,
  elementId,
}) {
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
              {selectedElement.fontSize}px
            </span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="8"
              max="72"
              value={selectedElement.fontSize}
              onChange={(e) =>
                updateElement(parentId, boxId, elementId, {
                  fontSize: Number.parseInt(e.target.value) || 12,
                })
              }
              className="w-full h-2 bg-gradient-to-r from-pink-200 to-rose-300 rounded-lg appearance-none cursor-pointer slider"
            />
            <input
              type="number"
              value={selectedElement.fontSize}
              onChange={(e) =>
                updateElement(parentId, boxId, elementId, {
                  fontSize: Number.parseInt(e.target.value) || 12,
                })
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
            value={selectedElement.fontFamily}
            onChange={(e) =>
              updateElement(parentId, boxId, elementId, {
                fontFamily: e.target.value,
              })
            }
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
                value={selectedElement.color}
                onChange={(e) =>
                  updateElement(parentId, boxId, elementId, {
                    color: e.target.value,
                  })
                }
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
                    selectedElement.backgroundColor !== 'transparent'
                      ? selectedElement.backgroundColor
                      : '#ffffff'
                  }
                  onChange={(e) =>
                    updateElement(parentId, boxId, elementId, {
                      backgroundColor: e.target.value,
                    })
                  }
                  className="w-full h-12 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-violet-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <button
                onClick={() =>
                  updateElement(parentId, boxId, elementId, {
                    backgroundColor: 'transparent',
                  })
                }
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

// Spacing Component
function Spacing({
  selectedElement,
  updateElement,
  parentId,
  boxId,
  elementId,
}) {
  const sides = [
    { key: 'top', label: 'T', icon: <FiArrowUp className="w-3 h-3" /> },
    { key: 'right', label: 'R', icon: <FiArrowRight className="w-3 h-3" /> },
    { key: 'bottom', label: 'B', icon: <FiArrowDown className="w-3 h-3" /> },
    { key: 'left', label: 'L', icon: <FiArrowLeft className="w-3 h-3" /> },
  ];

  const handleChange = (type, side, value) => {
    updateElement(parentId, boxId, elementId, {
      [type]: { ...selectedElement[type], [side]: Number.parseInt(value) || 0 },
    });
  };

  const SpacingSection = ({ type, title, icon, gradientFrom, gradientTo }) => (
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
                max="50"
                value={selectedElement[type]?.[key] || 0}
                onChange={(e) => handleChange(type, key, e.target.value)}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-small"
              />
              <input
                type="number"
                value={selectedElement[type]?.[key] || 0}
                onChange={(e) => handleChange(type, key, e.target.value)}
                className="w-full px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-center text-gray-700 transition-all duration-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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

// Border Effects Component
function BorderEffects({
  selectedElement,
  updateElement,
  parentId,
  boxId,
  elementId,
}) {
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
              {selectedElement.borderRadius}px
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="50"
              value={selectedElement.borderRadius}
              onChange={(e) =>
                updateElement(parentId, boxId, elementId, {
                  borderRadius: Number.parseInt(e.target.value) || 0,
                })
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
            value={selectedElement.border}
            onChange={(e) =>
              updateElement(parentId, boxId, elementId, {
                border: e.target.value,
              })
            }
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none hover:border-gray-300 cursor-pointer"
          >
            <option value="none">No Border</option>
            <option value="1px solid #000">1px Solid</option>
            <option value="2px solid #000">2px Solid</option>
            <option value="1px dashed #000">1px Dashed</option>
            <option value="2px dashed #000">2px Dashed</option>
            <option value="1px dotted #000">1px Dotted</option>
          </select>
        </div>

        {/* Background Color */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Background Color
          </label>
          <input
            type="color"
            value={selectedElement.backgroundColor}
            onChange={(e) =>
              updateElement(parentId, boxId, elementId, {
                backgroundColor: e.target.value,
              })
            }
            className="w-full h-10 px-1 py-1 bg-white border-2 border-gray-200 rounded-xl cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-100"
          />
        </div>

        {/* Box Shadow */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Box Shadow
          </label>
          <select
            value={
              selectedElement.boxShadow ||
              selectedElement.style?.boxShadow ||
              'none'
            }
            onChange={(e) =>
              updateElement(parentId, boxId, elementId, {
                boxShadow: e.target.value,
              })
            }
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none hover:border-gray-300 cursor-pointer"
          >
            <option value="none">None</option>
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

// Main Sticky Properties Panel Component
export default function StickyElementPropertiesPanel() {
  const {
    parents,
    selectedParentId,
    selectedBoxId,
    selectedElementId,
    updateElement,
    removeElement,
    duplicateElement,
    setSelectedElement,
    updateRnd,
  } = useDivStore();

  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.closest('.drag-handle')) {
      setIsDragging(true);
      const rect = panelRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = React.useCallback(
    (e) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Keep panel within viewport bounds
        const panelWidth = panelRef.current?.offsetWidth || 400;
        const panelHeight = panelRef.current?.offsetHeight || 600;
        const maxX = window.innerWidth - panelWidth;
        const maxY = window.innerHeight - panelHeight;

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    },
    [isDragging, dragOffset]
  );

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const selectedParent = parents.find((p) => p.id === selectedParentId);
  const selectedBox = selectedParent?.rnds.find(
    (box) => box.id === selectedBoxId
  );
  const selectedElement = selectedBox?.elements.find(
    (el) => el.id === selectedElementId
  );

  // Only show panel when a box or an element is selected
  if (!selectedBoxId) {
    return null;
  }

  const handleClose = () => {
    setSelectedElement(null);
  };

  const isEditingBox = selectedBoxId && !selectedElementId;
  const item = isEditingBox ? selectedBox : selectedElement;

  if (!item) return null;

  return (
    <div
      ref={panelRef}
      className="fixed bg-white shadow-2xl rounded-2xl border border-gray-200 z-[9999] w-96 max-h-[80vh] overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Drag Handle Header */}
      <div className="drag-handle flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 cursor-grab active:cursor-grabbing rounded-t-2xl">
        <div className="flex items-center gap-2">
          <FiMove className="text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700">
            {isEditingBox ? 'Box Properties' : 'Element Properties'}
          </h3>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <RxCross1 size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(80vh-60px)] custom-scrollbar">
        {isEditingBox ? (
          <>
            <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Box Properties
            </h3>
            <PositionSize
              selectedElement={item}
              updateElement={(pId, bId, eId, updates) =>
                updateRnd(pId, bId, updates)
              }
              parentId={selectedParentId}
              boxId={selectedBoxId}
              elementId={null}
            />
          </>
        ) : (
          <>
            {/* Header with Actions */}
            <Header
              selectedElement={item}
              selectedParentId={selectedParentId}
              selectedBoxId={selectedBoxId}
              selectedElementId={selectedElementId}
              removeElement={removeElement}
              duplicateElement={duplicateElement}
            />

            {/* Content Input */}
            <ContentInput
              selectedElement={item}
              updateElement={updateElement}
              parentId={selectedParentId}
              boxId={selectedBoxId}
              elementId={selectedElementId}
            />

            {/* Position & Size */}
            <PositionSize
              selectedElement={item}
              updateElement={updateElement}
              parentId={selectedParentId}
              boxId={selectedBoxId}
              elementId={selectedElementId}
            />

            {/* Typography */}
            {(item.type === 'text' ||
              item.type === 'button' ||
              item.type === 'paragraph') && (
              <Typography
                selectedElement={item}
                updateElement={updateElement}
                parentId={selectedParentId}
                boxId={selectedBoxId}
                elementId={selectedElementId}
              />
            )}

            {/* Spacing */}
            <Spacing
              selectedElement={item}
              updateElement={updateElement}
              parentId={selectedParentId}
              boxId={selectedBoxId}
              elementId={selectedElementId}
            />

            {/* Border Effects */}
            <BorderEffects
              selectedElement={item}
              updateElement={updateElement}
              parentId={selectedParentId}
              boxId={selectedBoxId}
              elementId={selectedElementId}
            />

            {/* Line Element Properties */}
            {item.type === 'line' && (
              <LineElementProperties
                selectedElement={item}
                updateElement={updateElement}
                parentId={selectedParentId}
                boxId={selectedBoxId}
                elementId={selectedElementId}
              />
            )}

            {/* Image Properties */}
            {item.type === 'image' && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                    <FiSquare className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h4 className="text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                    Image Properties
                  </h4>
                </div>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={item.imageUrl || ''}
                    onChange={(e) =>
                      updateElement(
                        selectedParentId,
                        selectedBoxId,
                        selectedElementId,
                        {
                          imageUrl: e.target.value,
                        }
                      )
                    }
                    className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-all duration-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none"
                    placeholder="Enter image URL..."
                  />
                </div>
              </div>
            )}

            {/* Advanced Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                  <FiLayers className="w-3.5 h-3.5 text-white" />
                </div>
                <h4 className="text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Advanced
                </h4>
              </div>

              <div className="space-y-4">
                {/* Z-Index */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Z-Index
                  </label>
                  <input
                    type="number"
                    value={item.zIndex || 0}
                    onChange={(e) =>
                      updateElement(
                        selectedParentId,
                        selectedBoxId,
                        selectedElementId,
                        {
                          zIndex: Number(e.target.value) || 0,
                        }
                      )
                    }
                    className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm"
                  />
                </div>

                {/* Custom Class Name */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Custom Class Name
                  </label>
                  <input
                    type="text"
                    value={item.customClassName || ''}
                    onChange={(e) =>
                      updateElement(
                        selectedParentId,
                        selectedBoxId,
                        selectedElementId,
                        {
                          customClassName: e.target.value,
                        }
                      )
                    }
                    className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm"
                    placeholder="e.g., my-custom-class"
                  />
                </div>

                {/* Custom CSS */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Custom CSS
                  </label>
                  <textarea
                    value={item.customCss || ''}
                    onChange={(e) =>
                      updateElement(
                        selectedParentId,
                        selectedBoxId,
                        selectedElementId,
                        {
                          customCss: e.target.value,
                        }
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md font-mono"
                    rows="4"
                    placeholder=".my-custom-class { color: red; }"
                  ></textarea>
                </div>

                {/* Button Link */}
                {item.type === 'button' && (
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Button Link
                    </label>
                    <input
                      type="text"
                      value={item.link || ''}
                      onChange={(e) =>
                        updateElement(
                          selectedParentId,
                          selectedBoxId,
                          selectedElementId,
                          {
                            link: e.target.value,
                          }
                        )
                      }
                      className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm"
                      placeholder="e.g., /about or https://example.com"
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #8b5cf6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #7c3aed);
        }
        .slider {
          -webkit-appearance: none;
          background: transparent;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        .slider-small::-webkit-slider-thumb {
          height: 14px;
          width: 14px;
        }
        .slider-small::-moz-range-thumb {
          height: 14px;
          width: 14px;
        }
      `}</style>
    </div>
  );
}

// Line Element Properties Component (for completeness)
function LineElementProperties({
  selectedElement,
  updateElement,
  parentId,
  boxId,
  elementId,
}) {
  const handleStyleChange = (property, value) => {
    updateElement(parentId, boxId, elementId, {
      style: { ...selectedElement.style, [property]: value },
    });
  };

  const handleSizeChange = (property, value) => {
    updateElement(parentId, boxId, elementId, {
      [property]: value,
    });
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg">
          <FiSquare className="w-3.5 h-3.5 text-white" />
        </div>
        <h4 className="text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          Line Properties
        </h4>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Thickness (height)
          </label>
          <input
            type="number"
            placeholder="e.g., 2"
            value={selectedElement.height}
            onChange={(e) =>
              handleSizeChange('height', parseInt(e.target.value, 10))
            }
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-sm"
          />
        </div>

        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Color
          </label>
          <input
            type="color"
            value={selectedElement.style?.backgroundColor}
            onChange={(e) =>
              handleStyleChange('backgroundColor', e.target.value)
            }
            className="w-full h-10 px-1 py-1 bg-white border border-gray-300 rounded-md cursor-pointer"
          />
        </div>

        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Shadow
          </label>
          <select
            value={selectedElement.style?.boxShadow}
            onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-sm"
          >
            <option value="none">None</option>
            <option value="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)">
              Small
            </option>
            <option value="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)">
              Medium
            </option>
            <option value="0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)">
              Large
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
