"use client";
import React from "react";
import useDivStore from "@/store/UseDivStore";
import { FaTrashAlt, FaPlusSquare, FaParagraph } from "react-icons/fa";
import { IoText } from "react-icons/io5";
import { FaRectangleAd, FaRegImages } from "react-icons/fa6";

export default function DivBoxMaker() {
  const { 
    parents, 
    selectedParentId, 
    selectedBoxId,
    selectedElementId,
    addRnd, 
    updateRnd, 
    removeRnd,
    addElement,
    updateElement,
    removeElement
  } = useDivStore();

  // find the selected parent
  const selectedParent = parents.find((p) => p.id === selectedParentId);
  const selectedBox = selectedParent?.rnds.find((box) => box.id === selectedBoxId);
  const selectedElement = selectedBox?.elements?.find((el) => el.id === selectedElementId);

  if (!selectedParent) {
    return (
      <p className="text-xs text-gray-400 italic animate-pulse">
        Select a parent to manage its boxes
      </p>
    );
  }

  const handleAddElement = (elementType) => {
    if (selectedBoxId) {
      addElement(selectedParentId, selectedBoxId, elementType);
    } else {
      alert('Please select a div box first to add elements!');
    }
  };

  return (
    <div>
      {/* Add RND Box Button */}
      <button
        onClick={() => addRnd(selectedParent.id)}
        className="bg-green-500 text-white px-3 py-2 rounded-lg mb-4 w-full flex justify-center items-center gap-2 font-semibold transition-all duration-300 hover:bg-green-600 hover:scale-[1.02] active:scale-[0.98]"
      >
        <FaPlusSquare className="text-lg" /> Add Div Box
      </button>

      {/* Element Properties Panel */}
      {selectedElement && (
        <div className="p-4 mb-4 rounded-xl border border-purple-200 shadow-sm bg-gradient-to-br from-purple-50 to-white">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-purple-600">
              {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Element
            </h3>
            <button
              onClick={() => removeElement(selectedParentId, selectedBoxId, selectedElementId)}
              className="bg-red-500 text-white px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:bg-red-600"
            >
              <FaTrashAlt />
            </button>
          </div>

          {/* Position & Size */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Width</label>
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
              <label className="text-xs font-medium text-gray-600 mb-1 block">Height</label>
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
          </div>

          {/* Margin */}
          <div className="mb-3">
            <label className="text-xs font-medium text-gray-600 mb-2 block">Margin</label>
            <div className="grid grid-cols-4 gap-2">
              {['top', 'right', 'bottom', 'left'].map((side) => (
                <div key={side}>
                  <label className="text-xs text-gray-500">{side[0].toUpperCase()}</label>
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
                    className="border p-1 rounded text-xs w-full focus:ring-1 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Padding */}
          <div className="mb-3">
            <label className="text-xs font-medium text-gray-600 mb-2 block">Padding</label>
            <div className="grid grid-cols-4 gap-2">
              {['top', 'right', 'bottom', 'left'].map((side) => (
                <div key={side}>
                  <label className="text-xs text-gray-500">{side[0].toUpperCase()}</label>
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
                    className="border p-1 rounded text-xs w-full focus:ring-1 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Style Properties */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Font Size</label>
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
          </div>

          {/* Background Color & Border Radius */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Background</label>
              <input
                type="color"
                value={selectedElement.backgroundColor !== 'transparent' ? selectedElement.backgroundColor : '#ffffff'}
                onChange={(e) =>
                  updateElement(selectedParentId, selectedBoxId, selectedElementId, {
                    backgroundColor: e.target.value,
                  })
                }
                className="border p-1 rounded-lg w-full h-10 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Border Radius</label>
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
          </div>
        </div>
      )}

      {/* RND Boxes */}
      {selectedParent.rnds.map((box) => (
        <div
          key={box.id}
          className={`p-4 mb-4 rounded-xl border shadow-sm bg-gradient-to-br transition-all duration-300 hover:shadow-md ${
            selectedBoxId === box.id 
              ? 'border-blue-300 from-blue-50 to-white' 
              : 'border-gray-200 from-gray-50 to-white'
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-600">
              Div Box {box.id} {box.elements?.length > 0 && `(${box.elements.length} elements)`}
            </h3>
            <button
              onClick={() => removeRnd(selectedParent.id, box.id)}
              className="bg-red-500 text-white px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98]"
            >
              <FaTrashAlt />
            </button>
          </div>

          {/* Size Controls */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">Width</label>
              <input
                type="number"
                value={box.width}
                onChange={(e) =>
                  updateRnd(selectedParent.id, box.id, {
                    width: parseInt(e.target.value) || 0,
                  })
                }
                className="border p-2 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                placeholder="Width"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">Height</label>
              <input
                type="number"
                value={box.height}
                onChange={(e) =>
                  updateRnd(selectedParent.id, box.id, {
                    height: parseInt(e.target.value) || 0,
                  })
                }
                className="border p-2 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                placeholder="Height"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">X-Axis</label>
              <input
                type="number"
                value={box.x}
                onChange={(e) =>
                  updateRnd(selectedParent.id, box.id, {
                    x: parseInt(e.target.value) || 0,
                  })
                }
                className="border p-2 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                placeholder="X Position"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">Y-Axis</label>
              <input
                type="number"
                value={box.y}
                onChange={(e) =>
                  updateRnd(selectedParent.id, box.id, {
                    y: parseInt(e.target.value) || 0,
                  })
                }
                className="border p-2 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                placeholder="Y Position"
              />
            </div>
          </div>

          {/* Add Elements */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-600">
                Add Elements {selectedBoxId === box.id && '✓ Selected'}
              </span>
            </div>

            {/* Grid row of 4 buttons */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { Icon: IoText, label: "Add Text", type: "text" },
                { Icon: FaParagraph, label: "Add Paragraph", type: "paragraph" },
                { Icon: FaRectangleAd, label: "Add Button", type: "button" },
                { Icon: FaRegImages, label: "Add Image", type: "image" },
              ].map(({ Icon, label, type }, i) => (
                <div key={i} className="relative group">
                  <button
                    onClick={() => handleAddElement(type)}
                    className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 shadow-sm w-full h-full"
                  >
                    <Icon size={24} className="text-gray-600" />
                  </button>

                  {/* Tooltip */}
                  <span
                    className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none"
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Show Elements List */}
          {box.elements && box.elements.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <h4 className="text-xs font-semibold text-gray-500 mb-2">Elements in this box:</h4>
              <div className="space-y-1">
                {box.elements.map((element) => (
                  <div 
                    key={element.id}
                    className={`text-xs p-2 rounded flex justify-between items-center transition-colors cursor-pointer ${
                      selectedElementId === element.id 
                        ? 'bg-purple-100 border border-purple-300' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      // This will be handled by the store's setSelectedElement
                      useDivStore.getState().setSelectedElement(element.id);
                      useDivStore.getState().setSelectedBox(box.id);
                    }}
                  >
                    <span className="font-medium">
                      {element.type.charAt(0).toUpperCase() + element.type.slice(1)} #{element.id}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeElement(selectedParentId, box.id, element.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}