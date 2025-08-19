import React from "react";

export default function PositionSize({ selectedElement, updateElement, parentId, boxId, elementId }) {
  const fields = [
    { label: "Width (px)", key: "width" },
    { label: "Height (px)", key: "height" },
    { label: "X Position", key: "x" },
    { label: "Y Position", key: "y" },
  ];

  return (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-gray-600 mb-2">Position & Size</h4>
      <div className="grid grid-cols-2 gap-3">
        {fields.map(({ label, key }) => (
          <div key={key}>
            <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
            <input
              type="number"
              value={selectedElement[key]}
              onChange={(e) =>
                updateElement(parentId, boxId, elementId, { [key]: parseInt(e.target.value) || 0 })
              }
              className="border p-2 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none transition w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
