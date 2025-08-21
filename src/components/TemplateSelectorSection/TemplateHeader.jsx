import React from "react";
import { FaTimes } from "react-icons/fa";

export default function TemplateHeader({ onClose }) {
  return (
    <div className="flex justify-between items-center p-6 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800">Choose a Template</h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <FaTimes className="text-gray-600" />
      </button>
    </div>
  );
}
