import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import useDivStore from '@/store/UseDivStore';
import BoxControls from './BoxControls';
import ElementAdder from './ElementAdder';
import ElementList from './ElementList';

export default function BoxCard({ parentId, box }) {
  const { selectedBoxId, removeRnd } = useDivStore();

  return (
    <div
      className={`p-4 mb-4 rounded-xl border shadow-sm bg-gradient-to-br transition-all duration-300 hover:shadow-md ${
        selectedBoxId === box.id
          ? 'border-blue-300 from-blue-50 to-white'
          : 'border-gray-200 from-gray-50 to-white'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-600">
          Div Box {box.id}{' '}
          {box.elements?.length > 0 && `(${box.elements.length} elements)`}
        </h3>
        <button
          onClick={() => removeRnd(parentId, box.id)}
          className="bg-red-500 text-white px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98]"
        >
          <FaTrashAlt />
        </button>
      </div>

      {/* Box Size Controls */}
      <BoxControls parentId={parentId} box={box} />

      {/* Add Elements */}
      <ElementAdder parentId={parentId} boxId={box.id} />

      {/* List Elements */}
      {box.elements?.length > 0 && (
        <ElementList parentId={parentId} box={box} />
      )}
    </div>
  );
}
