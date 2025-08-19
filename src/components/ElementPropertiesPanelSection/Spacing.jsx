import React from "react";

export default function Spacing({ selectedElement, updateElement, parentId, boxId, elementId }) {
  const sides = ["top", "right", "bottom", "left"];

  const handleChange = (type, side, value) => {
    updateElement(parentId, boxId, elementId, {
      [type]: { ...selectedElement[type], [side]: parseInt(value) || 0 },
    });
  };

  return (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-gray-600 mb-2">Spacing</h4>

      {/* Margin */}
      <div className="mb-3">
        <label className="text-xs font-medium text-gray-600 mb-2 block">Margin (px)</label>
        <div className="grid grid-cols-4 gap-2">
          {sides.map((side) => (
            <div key={side}>
              <label className="text-xs text-gray-500 block text-center mb-1">{side[0].toUpperCase()}</label>
              <input
                type="number"
                value={selectedElement.margin?.[side] || 0}
                onChange={(e) => handleChange("margin", side, e.target.value)}
                className="border p-1 rounded text-xs w-full text-center focus:ring-1 focus:ring-purple-400 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Padding */}
      <div>
        <label className="text-xs font-medium text-gray-600 mb-2 block">Padding (px)</label>
        <div className="grid grid-cols-4 gap-2">
          {sides.map((side) => (
            <div key={side}>
              <label className="text-xs text-gray-500 block text-center mb-1">{side[0].toUpperCase()}</label>
              <input
                type="number"
                value={selectedElement.padding?.[side] || 0}
                onChange={(e) => handleChange("padding", side, e.target.value)}
                className="border p-1 rounded text-xs w-full text-center focus:ring-1 focus:ring-purple-400 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
