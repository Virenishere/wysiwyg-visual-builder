import React from "react";

export default function ContentInput({ selectedElement, updateElement, parentId, boxId, elementId }) {
  if (selectedElement.type !== "text" && selectedElement.type !== "button") return null;

  return (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-gray-600 mb-2">
        {selectedElement.type === "text" ? "Content" : "Button Text"}
      </h4>
      <input
        type="text"
        value={selectedElement.content}
        onChange={(e) => updateElement(parentId, boxId, elementId, { content: e.target.value })}
        className="border p-2 rounded-lg text-sm w-full focus:ring-2 focus:ring-purple-400 focus:outline-none"
        placeholder={selectedElement.type === "text" ? "Enter text content..." : "Enter button text..."}
      />
    </div>
  );
}
