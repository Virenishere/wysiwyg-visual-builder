import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri';
import { FaCopy, FaGripVertical } from 'react-icons/fa';
import useDivStore from '@/store/UseDivStore';

export function SortableItem({ id, element, parentId, box }) {
  const {
    selectedElementId,
    removeElement,
    setSelectedElement,
    duplicateElement,
  } = useDivStore();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedElementId === element.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex justify-between items-center p-3 rounded-lg border shadow-sm cursor-pointer transition-colors
        ${
          isSelected
            ? 'bg-purple-50 border-purple-300'
            : 'bg-white border-gray-200 hover:bg-gray-50'
        }`}
      onClick={() => {
        setSelectedElement(element.id);
        useDivStore.getState().setSelectedBox(box.id);
      }}
    >
      <div className="flex items-center gap-2">
        <button {...listeners} className="cursor-grab p-1">
          <FaGripVertical />
        </button>
        <span className="text-sm font-medium text-gray-700">
          {element.type.charAt(0).toUpperCase() + element.type.slice(1)} #
          {element.id}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Copy element"
          title="Copy element"
          onClick={(e) => {
            e.stopPropagation();
            duplicateElement(parentId, box.id, element.id);
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
        >
          <FaCopy />
        </button>
        <button
          type="button"
          aria-label="Edit element"
          title="Edit element"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedElement(element.id);
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
        >
          <RiEdit2Line size={16} />
          <span className="text-xs font-medium">Edit</span>
        </button>
        <button
          type="button"
          aria-label="Delete element"
          title="Delete element"
          onClick={(e) => {
            e.stopPropagation();
            removeElement(parentId, box.id, element.id);
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <RiDeleteBin6Line size={16} />
          <span className="text-xs font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
}
