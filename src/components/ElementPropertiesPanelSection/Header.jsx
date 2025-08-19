import React from "react";
import { FaTrashAlt, FaCog } from "react-icons/fa";

export default function Header({ selectedElement, selectedParentId, selectedBoxId, selectedElementId, removeElement }) {
  return (
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
  );
}
