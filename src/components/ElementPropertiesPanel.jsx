"use client";
import React from 'react';
import useDivStore from '@/store/UseDivStore';
import { FaTrashAlt, FaCog } from 'react-icons/fa';

export default function ElementPropertiesPanel() {
  const {
    parents,
    selectedParentId,
    selectedBoxId,
    selectedElementId,
    updateElement,
    removeElement,
  } = useDivStore();

  const selectedParent = parents.find((p) => p.id === selectedParentId);
  const selectedBox = selectedParent?.rnds.find((box) => box.id === selectedBoxId);
  const selectedElement = selectedBox?.elements?.find((el) => el.id === selectedElementId);

  if (!selectedElement) {
    return (
      <div className="p-4 mb-4 rounded-xl border border-gray-200 shadow-sm bg-gradient-to-br from-gray-50 to-white">
        <p className="text-xs text-gray-400 italic animate-pulse">
          Select an element to edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 mb-4 rounded-xl border border-purple-200 shadow-sm bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-purple-600 flex items-center gap-2">
          <FaCog />
          {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Properties
        </h3>
        <button
          onClick={() => removeElement(selectedParentId, selectedBoxId, selectedElementId)}
          className="bg-red-500 text-white px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:bg-red-600"
          title="Delete Element"
        >
          <FaTrashAlt />
        </button>
      </div>

      {/* Position & Size */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-600 mb-2">Position & Size</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Width (px)</label>
            <input
              type="number"
              value={selectedElement.width}
              onChange={(e) =>
                updateElement(selectedParentId, selectedBoxId, selectedElementId, {
                  width: parseInt(e.target.value) || 0,
                })
              }
              className="border p-2 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none transition w-full"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Height (px)</label>
            <input
              type="number"
              value={selectedElement.height}
              onChange={(e) =>
                updateElement(selectedParentId, selectedBoxId, selectedElementId, {
                  height: parseInt(e.target.value) || 0,
                })
              }
              className="border p-2 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none transition w-full"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">X Position</label>
            <input
              type="number"
              value={selectedElement.x}
              onChange={(e) =>
                updateElement(selectedParentId, selectedBoxId, selectedElementId, {
                  x: parseInt(e.target.value) || 0,
                })
              }
              className="border p-2 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none transition w-full"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Y Position</label>
            <input
              type="number"
              value={selectedElement.y}
              onChange={(e) =>
                updateElement(selectedParentId, selectedBoxId, selectedElementId, {
                  y: parseInt(e.target.value) || 0,
                })
              }
              className="border p-2 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none transition w-full"
            />
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-600 mb-2">Spacing</h4>
        
        {/* Margin */}
        <div className="mb-3">
          <label className="text-xs font-medium text-gray-600 mb-2 block">Margin (px)</label>
          <div className="grid grid-cols-4 gap-2">
            {['top', 'right', 'bottom', 'left'].map((side) => (
              <div key={side}>
                <label className="text-xs text-gray-500 block text-center mb-1">
                  {side[0].toUpperCase()}
                </label>
                <input
                  type="number"
                  value={selectedElement.margin?.[side] || 0}
                  onChange={(e) =>
                    updateElement(selectedParentId, selectedBoxId, selectedElementId, {
                      margin: {
                        ...selectedElement.margin,
                        [side]: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="border p-1 rounded text-xs w-full text-center focus:ring-1 focus:ring-purple-400 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Padding */}
        <div className="mb-3">
          <label className="text-xs font-medium text-gray-600 mb-2 block">Padding (px)</label>
          <div className="grid grid-cols-4 gap-2">
            {['top', 'right', 'bottom', 'left'].map((side) => (
              <div key={side}>
                <label className="text-xs text-gray-500 block text-center mb-1">
                  {side[0].toUpperCase()}
                </label>
                <input
                  type="number"
                  value={selectedElement.padding?.[side] || 0}
                  onChange={(e) =>
                    updateElement(selectedParentId, selectedBoxId, selectedElementId, {
                      padding: {
                        ...selectedElement.padding,
                        [side]: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="border p-1 rounded text-xs w-full text-center focus:ring-1 focus:ring-purple-400 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Typography & Appearance */}
      {(selectedElement.type === 'text' || selectedElement.type === 'button' || selectedElement.type === 'paragraph') && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-600 mb-2">Typography</h4>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Font Size (px)</label>
              <input
                type="number"
                value={selectedElement.fontSize}
                onChange={(e) =>
                  updateElement(selectedParentId, selectedBoxId, selectedElementId, {
                    fontSize: parseInt(e.target.value) || 12,
                  })
                }
                className="border p-2 rounded-lg text-sm w-full focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Font Family</label>
              <select
                value={selectedElement.fontFamily}
                onChange={(e) =>
                  updateElement(selectedParentId, selectedBoxId, selectedElementId, {
                    fontFamily: e.target.value,
                  })
                }
                className="border p-2 rounded-lg text-sm w-full focus:ring-2 focus:ring-purple-400 focus:outline-none"
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="Times, serif">Times New Roman</option>
                <option value="Courier, monospace">Courier</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Verdana, sans-serif">Verdana</option>
                <option value="Comic Sans MS, cursive">Comic Sans</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Text Color</label>
              <input
                type="color"
                value={selectedElement.color}
                onChange={(e) =>
                  updateElement(selectedParentId, selectedBoxId, selectedElementId, {
                    color: e.target.value,
                  })
                }
                className="border p-1 rounded-lg w-full h-10 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selectedElement.backgroundColor !== 'transparent' ? selectedElement.backgroundColor : '#ffffff'}
                  onChange={(e) =>
                    updateElement(selectedParentId, selectedBoxId, selectedElementId, {
                      backgroundColor: e.target.value,
                    })
                  }
                  className="border p-1 rounded-lg flex-1 h-10 cursor-pointer"
                />
                <button
                  onClick={() =>
                    updateElement(selectedParentId, selectedBoxId, selectedElementId, {
                      backgroundColor: 'transparent',
                    })
                  }
                  className="border px-2 rounded-lg text-xs hover:bg-gray-100 transition"
                  title="Make transparent"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Border & Effects */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-600 mb-2">Border & Effects</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Border Radius (px)</label>
            <input
              type="number"
              value={selectedElement.borderRadius}
              onChange={(e) =>
                updateElement(selectedParentId, selectedBoxId, selectedElementId, {
                  borderRadius: parseInt(e.target.value) || 0,
                })
              }
              className="border p-2 rounded-lg text-sm w-full focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Border</label>
            <select
              value={selectedElement.border}
              onChange={(e) =>
                updateElement(selectedParentId, selectedBoxId, selectedElementId, {
                  border: e.target.value,
                })
              }
              className="border p-2 rounded-lg text-sm w-full focus:ring-2 focus:ring-purple-400 focus:outline-none"
            >
              <option value="none">None</option>
              <option value="1px solid #000">1px Solid Black</option>
              <option value="2px solid #000">2px Solid Black</option>
              <option value="1px dashed #000">1px Dashed</option>
              <option value="2px dashed #000">2px Dashed</option>
              <option value="1px dotted #000">1px Dotted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Element-specific content */}
      {selectedElement.type === 'text' && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-600 mb-2">Content</h4>
          <input
            type="text"
            value={selectedElement.content}
            onChange={(e) =>
              updateElement(selectedParentId, selectedBoxId, selectedElementId, {
                content: e.target.value,
              })
            }
            className="border p-2 rounded-lg text-sm w-full focus:ring-2 focus:ring-purple-400 focus:outline-none"
            placeholder="Enter text content..."
          />
        </div>
      )}

      {selectedElement.type === 'button' && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-600 mb-2">Button Text</h4>
          <input
            type="text"
            value={selectedElement.content}
            onChange={(e) =>
              updateElement(selectedParentId, selectedBoxId, selectedElementId, {
                content: e.target.value,
              })
            }
            className="border p-2 rounded-lg text-sm w-full focus:ring-2 focus:ring-purple-400 focus:outline-none"
            placeholder="Enter button text..."
          />
        </div>
      )}
    </div>
  );
}