'use client';
import { FaTrashAlt, FaCopy } from 'react-icons/fa';
import { FiSettings, FiZap } from 'react-icons/fi';

export default function Header({
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
