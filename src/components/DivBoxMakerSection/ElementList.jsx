import React from 'react';
import { RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri';
import useDivStore from '@/store/UseDivStore';
import { FaCopy } from 'react-icons/fa';

export default function ElementList({ parentId, box }) {
  const {
    selectedElementId,
    removeElement,
    selectedParentId,
    selectedBoxId,
    setSelectedElement,
    duplicateElement,
  } = useDivStore();
  const elements = box?.elements ?? [];

  return (
    <div className="mt-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        Elements in this box
      </h4>

      {/* Empty state */}
      {elements.length === 0 ? (
        <div className="text-xs text-gray-400 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-3 text-center">
          No elements yet — add one to get started.
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {elements.map((el) => {
            const isSelected = selectedElementId === el.id;
            return (
              <div
                key={el.id}
                className={`flex justify-between items-center p-3 rounded-lg border shadow-sm cursor-pointer transition-colors
                  ${
                    isSelected
                      ? 'bg-purple-50 border-purple-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                onClick={() => {
                  setSelectedElement(el.id);
                  useDivStore.getState().setSelectedBox(box.id);
                }}
              >
                {/* Element Name */}
                <span className="text-sm font-medium text-gray-700">
                  {el.type.charAt(0).toUpperCase() + el.type.slice(1)} #{el.id}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* copy element  */}
                  <button
                    type="button"
                    aria-label="Copy element"
                    title="Copy element"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateElement(
                        selectedParentId,
                        selectedBoxId,
                        el.id 
                      );
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <FaCopy />
                  </button>
                  {/* Edit Button */}
                  <button
                    type="button"
                    aria-label="Edit element"
                    title="Edit element"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElement(el.id);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <RiEdit2Line size={16} />
                    <span className="text-xs font-medium">Edit</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    aria-label="Delete element"
                    title="Delete element"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeElement(parentId, box.id, el.id);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <RiDeleteBin6Line size={16} />
                    <span className="text-xs font-medium">Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
