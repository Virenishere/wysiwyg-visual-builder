import React from "react";

export default function BorderEffects({ selectedElement, updateElement, parentId, boxId, elementId }) {
  return (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-gray-600 mb-2">Border & Effects</h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Border Radius (px)</label>
          <input
            type="number"
            value={selectedElement.borderRadius}
            onChange={(e) => updateElement(parentId, boxId, elementId, { borderRadius: parseInt(e.target.value) || 0 })}
            className="border p-2 rounded-lg text-sm w-full focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Border</label>
          <select
            value={selectedElement.border}
            onChange={(e) => updateElement(parentId, boxId, elementId, { border: e.target.value })}
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
  );
}
