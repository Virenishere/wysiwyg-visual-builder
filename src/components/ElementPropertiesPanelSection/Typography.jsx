import React from "react";

export default function Typography({ selectedElement, updateElement, parentId, boxId, elementId }) {
  return (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-gray-600 mb-2">Typography</h4>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Font Size (px)</label>
          <input
            type="number"
            value={selectedElement.fontSize}
            onChange={(e) =>
              updateElement(parentId, boxId, elementId, { fontSize: parseInt(e.target.value) || 12 })
            }
            className="border p-2 rounded-lg text-sm w-full focus:ring-2 focus:ring-purple-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Font Family</label>
          <select
            value={selectedElement.fontFamily}
            onChange={(e) => updateElement(parentId, boxId, elementId, { fontFamily: e.target.value })}
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

      {/* Text & Background Color */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Text Color</label>
          <input
            type="color"
            value={selectedElement.color}
            onChange={(e) => updateElement(parentId, boxId, elementId, { color: e.target.value })}
            className="border p-1 rounded-lg w-full h-10 cursor-pointer"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Background Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={
                selectedElement.backgroundColor !== "transparent"
                  ? selectedElement.backgroundColor
                  : "#ffffff"
              }
              onChange={(e) => updateElement(parentId, boxId, elementId, { backgroundColor: e.target.value })}
              className="border p-1 rounded-lg flex-1 h-10 cursor-pointer"
            />
            <button
              onClick={() => updateElement(parentId, boxId, elementId, { backgroundColor: "transparent" })}
              className="border px-2 rounded-lg text-xs hover:bg-gray-100 transition"
              title="Make transparent"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
