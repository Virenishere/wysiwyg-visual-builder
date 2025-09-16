'use client';
import React from 'react';
import { Rnd } from 'react-rnd';
import useDivStore from '@/store/UseDivStore';
import DraggableElement from './DraggableElement';
import CenterDivIndicator from './CenterDivIndicator';
import AlignIndicator from './AlignIndicator';
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
    setActiveDragItem,
    activeDragItem,
  } = useDivStore();

  const isSelected = selectedBoxId === box.id;

  const handleElementSelect = (elementId) => {
    setSelectedElement(elementId);
    setSelectedBox(box.id);
  };

  //container bounds for this RND box (for element indicators)
  const boxBounds = {
    width: box.width,
    height: box.height,
    x: 0, //relative to the box
    y: 0,
  };

  // get all element in this box for alignment
  const boxElements = box.elements || [];

  // Check if the active drag item is an element within this box
  const isActiveDragElementInThisBox =
    activeDragItem &&
    activeDragItem.type && // elements have type, boxes don't
    boxElements.some((element) => element.id === activeDragItem.id);

  return (
    <Rnd
      size={{ width: box.width, height: box.height }}
      position={{ x: box.x, y: box.y }}
      bounds={`.parent-container[data-id="${parentId}"]`}
      onDragStart={(e) => e.stopPropagation()}
      onDrag={(e, d) => {
        setActiveDragItem({ ...box, ...d });
      }}
      onDragStop={(e, d) => {
        updateRnd(parentId, box.id, { x: d.x, y: d.y });
        setActiveDragItem(null);
      }}
      onResizeStart={(e) => {
        e.stopPropagation();
        setIsResizing(true);
      }}
      onResize={(e, direction, ref, delta, pos) => {
        const newSize = { width: ref.offsetWidth, height: ref.offsetHeight };
        updateRnd(parentId, box.id, { ...newSize, ...pos });
        setActiveDragItem({ ...box, ...newSize, ...pos });
      }}
      onResizeStop={(e, direction, ref, delta, pos) => {
        setIsResizing(false);
        const newSize = { width: ref.offsetWidth, height: ref.offsetHeight };
        updateRnd(parentId, box.id, { ...newSize, ...pos });
        setActiveDragItem(null);
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
      data-id={box.id}
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

      {/* Centering indicator for elements within this box */}
      {activeDragItem && isActiveDragElementInThisBox && (
        <CenterDivIndicator
          activeBox={activeDragItem}
          containerBounds={boxBounds}
        />
      )}

      {/* Alignment indicator for elements within this box */}
      {activeDragItem && isActiveDragElementInThisBox && (
        <AlignIndicator
          activeItem={activeDragItem}
          allItems={boxElements}
          containerBounds={boxBounds}
          tolerance={2}
        />
      )}

      {/* Render custom HTML and CSS */}
      {box.customCss && <style>{box.customCss}</style>}
      {box.customHtml && (
        <div dangerouslySetInnerHTML={{ __html: box.customHtml }} />
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
