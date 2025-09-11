import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import useDivStore from '@/store/UseDivStore';

export default function ElementProperties({ parentId }) {
  const {
    parents,
    selectedParentId,
    selectedBoxId,
    selectedElementId,
    updateElement,
    removeElement,
  } = useDivStore();

  const selectedParent = parents.find((p) => p.id === selectedParentId);
  const selectedBox = selectedParent?.rnds.find((b) => b.id === selectedBoxId);
  const el = selectedBox?.elements.find((e) => e.id === selectedElementId);

  if (!el) return null;

  return (
    <div className="p-4 mb-4 rounded-xl border border-purple-200 shadow-sm bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-purple-600">
          {el.type.charAt(0).toUpperCase() + el.type.slice(1)} Element
        </h3>
        <button
          onClick={() =>
            removeElement(parentId, selectedBoxId, selectedElementId)
          }
          className="bg-red-500 text-white px-2 py-2 rounded-lg text-xs font-medium hover:bg-red-600 transition"
        >
          <FaTrashAlt />
        </button>
      </div>

      {/* Example: Width & Height */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          type="number"
          value={el.width}
          onChange={(e) =>
            updateElement(parentId, selectedBoxId, selectedElementId, {
              width: +e.target.value || 0,
            })
          }
          className="border p-2 rounded-lg text-sm w-full"
          placeholder="Width"
        />
        <input
          type="number"
          value={el.height}
          onChange={(e) =>
            updateElement(parentId, selectedBoxId, selectedElementId, {
              height: +e.target.value || 0,
            })
          }
          className="border p-2 rounded-lg text-sm w-full"
          placeholder="Height"
        />
      </div>

      {/* Similar inputs for margin, padding, font size, color, bg, border radius (your original code logic) */}
    </div>
  );
}
