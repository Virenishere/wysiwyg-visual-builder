'use client';
import React from 'react';
import { Rnd } from 'react-rnd';
import useDivStore from '@/store/UseDivStore';
import DraggableElement from './DraggableElement';
import { FaPlus, FaTrash } from 'react-icons/fa';

export default function RndBox({ box, parentId }) {
  const {
    updateRnd,
    setSelectedBox,
    setSelectedElement,
    selectedBoxId,
    selectedElementId,
    removeRnd,
    setLeftPanel,
    setIsResizing,
    duplicateElement,
  } = useDivStore();

  const isSelected = selectedBoxId === box.id;

  const handleElementSelect = (elementId) => {
    setSelectedElement(elementId);
    setSelectedBox(box.id);
  };

  return (
    <Rnd
      size={{ width: box.width, height: box.height }}
      position={{ x: box.x, y: box.y }}
      bounds="parent"
      onDragStart={(e) => e.stopPropagation()}
      onDragStop={(e, d) => {
        updateRnd(parentId, box.id, { x: d.x, y: d.y });
      }}
      onResizeStart={(e) => {
        e.stopPropagation();
        setIsResizing(true);
      }}
      onResizeStop={(e, direction, ref, delta, pos) => {
        setIsResizing(false);
        updateRnd(parentId, box.id, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          ...pos,
        });
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedBox(box.id);
        setSelectedElement(null);
      }}
      style={{
        border: isSelected ? '3px solid #3b82f6' : '2px dashed #d1d5db',
        borderRadius: '4px',
        backgroundColor: isSelected
          ? 'rgba(59, 130, 246, 0.05)'
          : 'rgba(0, 0, 0, 0.02)',
        zIndex: isSelected ? 5 : 1,
      }}
      className="rnd-box"
    >
      {/* Box label */}
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium z-20">
          Box {box.id}
        </div>
      )}

      {/* Add element button */}
      {isSelected && (
        <button
          onClick={() => setLeftPanel('AddElementPanel')}
          className="absolute -top-6 left-14 bg-green-500 text-white p-1 rounded-full hover:bg-green-600 transition-all duration-200 z-20 cursor-pointer group relative"
          aria-label="Add element"
        >
          <FaPlus />

          {/* Tooltip */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Add element
          </span>
        </button>
      )}

      {/* Delete box button */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Are you sure you want to delete this box?')) {
              removeRnd(parentId, box.id);
            }
          }}
          className="absolute -top-6 left-16 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all duration-200 z-20 cursor-pointer group relative"
          aria-label="Delete box"
        >
          <FaTrash />

          {/* Tooltip */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Delete box
          </span>
        </button>
      )}

      {/* Render elements inside this box */}
      {box.elements?.map((element) => (
        <DraggableElement
          key={`element-${element.id}`}
          element={element}
          parentId={parentId}
          boxId={box.id}
          isSelected={selectedElementId === element.id}
          onSelect={() => handleElementSelect(element.id)}
          duplicateElement={duplicateElement}
        />
      ))}
    </Rnd>
  );
}
