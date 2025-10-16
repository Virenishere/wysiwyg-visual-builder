'use client';
import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import useDivStore from '@/store/UseDivStore';
import DraggableElement from './DraggableElement';
import CenterDivIndicator from './CenterDivIndicator';
import AlignIndicator from './AlignIndicator';
import { FaPlus, FaTrash, FaCopy } from 'react-icons/fa';

import { getResponsiveValue } from '@/utils/screen';

export default function RndBox({ box, parentId, isSectionSelected }) {
  const {
    updateRnd,
    setSelectedBox,
    setSelectedElement,
    screenSize,
    selectedBoxId,
    selectedElementId,
    removeRnd,
    setLeftPanel,
    setIsResizing,
    duplicateElement,
    duplicateRnd,
    setActiveDragItem,
    activeDragItem,
    setSelectedParent,
  } = useDivStore();

  const isBoxSelected = selectedBoxId === box.id;

  const handleElementSelect = (elementId) => {
    setSelectedElement(elementId);
    setSelectedBox(box.id);
  };

  const getBorderStyle = () => {
    if (isBoxSelected) {
      return '3px solid #6f56f9';
    } else if (isSectionSelected) {
      return '2px solid #a78bfa';
    } else {
      return '1px solid #e5e7eb';
    }
  };

  const getBoxShadow = () => {
    if (isBoxSelected) {
      return '0 0 0 3px rgba(111, 86, 249, 0.2)';
    } else if (isSectionSelected) {
      return '0 0 0 2px rgba(167, 139, 250, 0.15)';
    }
    return 'none';
  };

  const initialWidth =
    parseInt(getResponsiveValue(box.width, screenSize), 10) || 150;
  const initialHeight =
    parseInt(getResponsiveValue(box.height, screenSize), 10) || 150;
  const initialX = parseInt(getResponsiveValue(box.x, screenSize), 10) || 0;
  const initialY = parseInt(getResponsiveValue(box.y, screenSize), 10) || 0;

  const [size, setSize] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  const [position, setPosition] = useState({ x: initialX, y: initialY });

  useEffect(() => {
    setSize({
      width: parseInt(getResponsiveValue(box.width, screenSize), 10) || 150,
      height: parseInt(getResponsiveValue(box.height, screenSize), 10) || 150,
    });
    setPosition({
      x: parseInt(getResponsiveValue(box.x, screenSize), 10) || 0,
      y: parseInt(getResponsiveValue(box.y, screenSize), 10) || 0,
    });
  }, [box.width, box.height, box.x, box.y, screenSize]);

  const boxBounds = {
    width: size.width,
    height: size.height,
    x: 0,
    y: 0,
  };

  const boxElements = box.elements || [];

  const minConstraints = box.elements.reduce(
    (acc, el) => {
      const elWidth =
        parseInt(getResponsiveValue(el.width, screenSize), 10) || 100;
      const elHeight =
        parseInt(getResponsiveValue(el.height, screenSize), 10) || 50;
      const elX = parseInt(getResponsiveValue(el.x, screenSize), 10) || 0;
      const elY = parseInt(getResponsiveValue(el.y, screenSize), 10) || 0;

      const right = elX + elWidth;
      const bottom = elY + elHeight;

      return {
        minWidth: Math.max(acc.minWidth, right + 10),
        minHeight: Math.max(acc.minHeight, bottom + 10),
      };
    },
    { minWidth: 50, minHeight: 50 }
  );

  const isActiveDragElementInThisBox =
    activeDragItem &&
    activeDragItem.type &&
    boxElements.some((element) => element.id === activeDragItem.id);

  const hasSelectedElement =
    selectedElementId && boxElements.some((el) => el.id === selectedElementId);

  return (
    <Rnd
      size={size}
      position={position}
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
        setPosition({ x: d.x, y: d.y });
        setActiveDragItem({ ...box, x: d.x, y: d.y, ...size });
      }}
      onDragStop={(e, d) => {
        // Validate bounds to ensure box stays within section
        const validatedX = Math.max(0, d.x);
        const validatedY = Math.max(0, d.y);

        updateRnd(parentId, box.id, {
          x: validatedX,
          y: validatedY,
        });
        setActiveDragItem(null);
      }}
      onResizeStart={(e) => {
        e.stopPropagation();
        setIsResizing(true);
      }}
      onResize={(e, direction, ref, delta, pos) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
        setPosition({ x: pos.x, y: pos.y });
        setActiveDragItem({
          ...box,
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: pos.x,
          y: pos.y,
        });
      }}
      onResizeStop={(e, direction, ref, delta, pos) => {
        const newWidth = parseInt(ref.style.width) || ref.offsetWidth;
        const newHeight = parseInt(ref.style.height) || ref.offsetHeight;

        // Validate bounds to ensure box stays within section after resize
        const validatedX = Math.max(0, pos.x);
        const validatedY = Math.max(0, pos.y);

        updateRnd(parentId, box.id, {
          width: newWidth,
          height: newHeight,
          x: validatedX,
          y: validatedY,
        });
        setActiveDragItem(null);
        setIsResizing(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedBox(box.id);
        setSelectedParent(parentId);
      }}
      style={{
        border: getBorderStyle(),
        boxShadow: getBoxShadow(),
        transition: 'border 0.2s ease, box-shadow 0.2s ease',
        borderRadius: '4px',
        backgroundColor: isBoxSelected
          ? 'rgba(59, 130, 246, 0.05)'
          : 'rgba(0, 0, 0, 0.02)',
        zIndex: isBoxSelected ? 5 : 1,
        boxSizing: 'border-box',
      }}
      minWidth={minConstraints.minWidth}
      minHeight={minConstraints.minHeight}
      className="rnd-box"
      data-id={box.id}
    >
      {isBoxSelected && (
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: 2,
            right: 2,
            bottom: 2,
            border: '1px dashed rgba(59, 130, 246, 0.3)',
            borderRadius: '2px',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}
      <div
        className="rnd-drag-handle absolute inset-0"
        style={{
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {(isBoxSelected || isSectionSelected) && (
        <div
          className={`absolute -top-6 left-0 px-2 py-1 rounded text-xs font-medium z-50 ${
            isBoxSelected
              ? 'bg-purple-600 text-white'
              : 'bg-purple-300 text-purple-900'
          }`}
          style={{ pointerEvents: 'none' }}
        >
          Box {box.id}
        </div>
      )}

      {isBoxSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLeftPanel('AddElementPanel');
          }}
          className="absolute bg-green-500 text-white p-1 rounded-full hover:bg-green-600 transition-all duration-200 z-20 cursor-pointer group relative z-[-1]"
          style={{
            top: '-37px',
            left: '56px',
          }}
          aria-label="Add element"
        >
          <FaPlus />

          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Add element
          </span>
        </button>
      )}

      {isBoxSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Are you sure you want to delete this box?')) {
              removeRnd(parentId, box.id);
            }
          }}
          className="absolute bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all duration-200 z-20 cursor-pointer group relative"
          style={{
            top: '-37px',
            left: '88px',
          }}
          aria-label="Delete box"
        >
          <FaTrash />

          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Delete box
          </span>
        </button>
      )}

      {isBoxSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            duplicateRnd(parentId, box.id);
          }}
          className="absolute bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition-all duration-200 z-20 cursor-pointer group relative"
          style={{
            top: '-37px',
            left: '120px',
          }}
          aria-label="Copy box"
        >
          <FaCopy />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Copy box
          </span>
        </button>
      )}

      {activeDragItem && isActiveDragElementInThisBox && (
        <CenterDivIndicator
          activeBox={activeDragItem}
          containerBounds={boxBounds}
        />
      )}

      {activeDragItem && isActiveDragElementInThisBox && (
        <AlignIndicator
          activeItem={activeDragItem}
          allItems={boxElements}
          containerBounds={boxBounds}
          tolerance={2}
        />
      )}

      {box.customCss && <style>{box.customCss}</style>}
      {box.customHtml && (
        <div
          dangerouslySetInnerHTML={{ __html: box.customHtml }}
          style={{
            position: 'relative',
            zIndex: 2,
            pointerEvents: 'none',
            width: '100%',
            height: '100%',
            overflow: 'auto',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 3,
          pointerEvents: 'none',
        }}
        className="rnd-box-container"
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
            containerBounds={{
              width: size.width,
              height: size.height,
              x: 0,
              y: 0,
            }}
          />
        ))}
      </div>
    </Rnd>
  );
}
