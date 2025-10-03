'use client';
import React, { useEffect } from 'react';
import { Rnd } from 'react-rnd';
import useDivStore from '@/store/UseDivStore';
import DraggableElement from './DraggableElement';
import CenterDivIndicator from './CenterDivIndicator';
import AlignIndicator from './AlignIndicator';
import { FaPlus, FaTrash, FaCopy } from 'react-icons/fa';

import { getResponsiveValue } from '@/utils/screen';

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
    duplicateRnd,
    setActiveDragItem,
    activeDragItem,
    screenSize,
  } = useDivStore();

  const isSelected = selectedBoxId === box.id;

  const handleElementSelect = (elementId) => {
    setSelectedElement(elementId);
    setSelectedBox(box.id);
  };

  // Get responsive values with fallbacks
  const width = getResponsiveValue(box.width, screenSize) || 150;
  const height = getResponsiveValue(box.height, screenSize) || 150;
  const x = getResponsiveValue(box.x, screenSize) || 0;
  const y = getResponsiveValue(box.y, screenSize) || 0;

  //container bounds for this RND box (for element indicators)
  const boxBounds = {
    width: width,
    height: height,
    x: 0, //relative to the box
    y: 0,
  };

  const boxElements = box.elements || [];

  const minConstraints = box.elements.reduce(
    (acc, el) => {
      const elWidth = getResponsiveValue(el.width, screenSize) || 100;
      const elHeight = getResponsiveValue(el.height, screenSize) || 50;
      const elX = getResponsiveValue(el.x, screenSize) || 0;
      const elY = getResponsiveValue(el.y, screenSize) || 0;

      const right = elX + elWidth;
      const bottom = elY + elHeight;

      return {
        minWidth: Math.max(acc.minWidth, right + 10), // Add padding
        minHeight: Math.max(acc.minHeight, bottom + 10), // Add padding
      };
    },
    { minWidth: 50, minHeight: 50 } // Minimum box size
  );

  // Check if the active drag item is an element within this box
  const isActiveDragElementInThisBox =
    activeDragItem &&
    activeDragItem.type && // elements have type, boxes don't
    boxElements.some((element) => element.id === activeDragItem.id);

  useEffect(() => {
    // This effect runs once after the component mounts.
    // It triggers a state update with the component's current dimensions and position.
    // This helps to resolve positioning glitches that can happen during the initial render,
    // especially when complex CSS like `top: -30px` is applied to child containers.
    // It essentially mimics the recalculation that happens on a resize.
    updateRnd(parentId, box.id, {
      width,
      height,
      x,
      y,
    });
  }, []); // The empty dependency array ensures this runs only once.

  return (
    <Rnd
      size={{ width: width, height: height }}
      position={{ x: x, y: y }}
      bounds="parent"
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      onDragStart={(e) => {
        e.stopPropagation();
      }}
      onDrag={(e, d) => {
        setActiveDragItem({ ...box, x: d.x, y: d.y, width, height });
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
        const newWidth = ref.offsetWidth;
        const newHeight = ref.offsetHeight;
        const newX = pos.x;
        const newY = pos.y;

        setActiveDragItem({
          ...box,
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
        });
      }}
      onResizeStop={(e, direction, ref, delta, pos) => {
        const newWidth = ref.offsetWidth;
        const newHeight = ref.offsetHeight;
        const newX = pos.x;
        const newY = pos.y;

        updateRnd(parentId, box.id, {
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
        });
        setActiveDragItem(null);
        setIsResizing(false);
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
      minWidth={minConstraints.minWidth}
      minHeight={minConstraints.minHeight}
      className="rnd-box"
      data-id={box.id}
    >
      {/* Drag handle area - positioned to not interfere with elements */}
      <div
        className="rnd-drag-handle absolute inset-0"
        style={{
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Box label */}
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium z-20">
          Box {box.id}
        </div>
      )}

      {/* Add element button */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLeftPanel('AddElementPanel');
          }}
          className="absolute -top-7 left-14 bg-green-500 text-white p-1 rounded-full hover:bg-green-600 transition-all duration-200 z-20 cursor-pointer group relative"
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
          className="absolute -top-7 left-24 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all duration-200 z-20 cursor-pointer group relative"
          aria-label="Delete box"
        >
          <FaTrash />

          {/* Tooltip */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Delete box
          </span>
        </button>
      )}

      {/* Copy box button */}
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            duplicateRnd(parentId, box.id);
          }}
          className="absolute -top-7 left-32 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition-all duration-200 z-20 cursor-pointer group relative"
          aria-label="Copy box"
        >
          <FaCopy />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Copy box
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
        <div
          dangerouslySetInnerHTML={{ __html: box.customHtml }}
          style={{ position: 'relative', zIndex: 2, pointerEvents: 'none' }}
        />
      )}

      {/* Render elements inside this box */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          height: '100%',
          top: '-30px',
        }}
      >
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
      </div>
    </Rnd>
  );
}
