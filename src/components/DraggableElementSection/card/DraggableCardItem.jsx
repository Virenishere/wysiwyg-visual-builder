'use client';
import React, { useState, useRef, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { getResponsiveValue } from '@/utils/screen';

export default function DraggableCardItem(props) {
  const {
    item,
    isSelected = false,
    containerBounds = {
      width: Number.POSITIVE_INFINITY,
      height: Number.POSITIVE_INFINITY,
    },
    screenSize,
    onSelect,
    onUpdate,
    onEditText,
    onDragStart,
    onDragEnd,
    onResizeStart,
    onResizeEnd,
    snapEnabled = false,
    gridSize = 8,
  } = props;

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const rndRef = useRef(null);

  const applySnap = useCallback(
    (value) => (snapEnabled ? Math.round(value / gridSize) * gridSize : value),
    [snapEnabled, gridSize]
  );

  const clampToBounds = useCallback(
    (x, y, width, height) => {
      const maxX = Math.max(0, (containerBounds?.width ?? Infinity) - width);
      const maxY = Math.max(0, (containerBounds?.height ?? Infinity) - height);
      return {
        x: Math.max(0, Math.min(x, maxX)),
        y: Math.max(0, Math.min(y, maxY)),
        width: Math.min(width, containerBounds?.width ?? width),
        height: Math.min(height, containerBounds?.height ?? height),
      };
    },
    [containerBounds]
  );

  const handleDragStart = useCallback(
    (e, data) => {
      setIsDragging(true);
      onSelect?.(item.id);
      onDragStart?.(item, e, data);
    },
    [item, onSelect, onDragStart]
  );

  const handleDrag = useCallback(
    (e, data) => {
      const snappedX = applySnap(data.x);
      const snappedY = applySnap(data.y);
      const clamped = clampToBounds(
        snappedX,
        snappedY,
        item.width,
        item.height
      );
      onUpdate?.(item.id, { x: clamped.x, y: clamped.y });
    },
    [item, applySnap, clampToBounds, onUpdate]
  );

  const handleDragStop = useCallback(
    (e, data) => {
      setIsDragging(false);
      const snappedX = applySnap(data.x);
      const snappedY = applySnap(data.y);
      const clamped = clampToBounds(
        snappedX,
        snappedY,
        item.width,
        item.height
      );
      onUpdate?.(item.id, { x: clamped.x, y: clamped.y });
      onDragEnd?.(item, e, data);
    },
    [item, applySnap, clampToBounds, onUpdate, onDragEnd]
  );

  const handleResizeStart = useCallback(
    (e, direction, ref) => {
      setIsResizing(true);
      onSelect?.(item.id);
      onResizeStart?.(item, e, direction, ref);
    },
    [item, onSelect, onResizeStart]
  );

  const handleResize = useCallback(
    (e, direction, ref, delta, position) => {
      const newWidth = applySnap(ref.offsetWidth);
      const newHeight = applySnap(ref.offsetHeight);
      const newX = applySnap(position.x);
      const newY = applySnap(position.y);
      const clamped = clampToBounds(newX, newY, newWidth, newHeight);
      onUpdate?.(item.id, {
        x: clamped.x,
        y: clamped.y,
        width: clamped.width,
        height: clamped.height,
      });
    },
    [item, applySnap, clampToBounds, onUpdate]
  );

  const handleResizeStop = useCallback(
    (e, direction, ref, delta, position) => {
      setIsResizing(false);
      const newWidth = applySnap(ref.offsetWidth);
      const newHeight = applySnap(ref.offsetHeight);
      const newX = applySnap(position.x);
      const newY = applySnap(position.y);
      const clamped = clampToBounds(newX, newY, newWidth, newHeight);
      onUpdate?.(item.id, {
        x: clamped.x,
        y: clamped.y,
        width: clamped.width,
        height: clamped.height,
      });
      onResizeEnd?.(item, e, direction, ref, delta, position);
    },
    [item, applySnap, clampToBounds, onUpdate, onResizeEnd]
  );

  const handleDoubleClick = useCallback(() => {
    if (item.type === 'text' && onEditText) onEditText(item);
  }, [item, onEditText]);

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      onSelect?.(item.id);
    },
    [item.id, onSelect]
  );

  const fontSize =
    getResponsiveValue(item.style?.fontSize, screenSize) ||
    item.style?.fontSize ||
    16;
  const fontFamily =
    getResponsiveValue(item.style?.fontFamily, screenSize) ||
    item.style?.fontFamily ||
    'Arial, sans-serif';
  const color =
    getResponsiveValue(item.style?.color, screenSize) ||
    item.style?.color ||
    '#222';
  const fontStyle =
    getResponsiveValue(item.style?.fontStyle, screenSize) ||
    item.style?.fontStyle ||
    'normal';
  const fontWeight =
    getResponsiveValue(item.style?.fontWeight, screenSize) ||
    item.style?.fontWeight ||
    'normal';
  const textAlign =
    getResponsiveValue(item.style?.textAlign, screenSize) ||
    item.style?.textAlign ||
    'left';
  const textDecoration =
    getResponsiveValue(item.style?.textDecoration, screenSize) ||
    item.style?.textDecoration ||
    'none';

  const zIndex = isSelected ? 1000 + (item.zIndex || 1) : item.zIndex || 1;

  return (
    <Rnd
      ref={rndRef}
      size={{ width: item.width, height: item.height }}
      position={{ x: item.x, y: item.y }}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onResizeStart={handleResizeStart}
      onResize={handleResize}
      onResizeStop={handleResizeStop}
      bounds="parent"
      dragGrid={snapEnabled ? [gridSize, gridSize] : [1, 1]}
      resizeGrid={snapEnabled ? [gridSize, gridSize] : [1, 1]}
      enableResizing={{
        top: isSelected,
        right: isSelected,
        bottom: isSelected,
        left: isSelected,
        topRight: isSelected,
        bottomRight: isSelected,
        bottomLeft: isSelected,
        topLeft: isSelected,
      }}
      disableDragging={false}
      style={{
        zIndex,
        transition: isDragging || isResizing ? 'none' : 'all 0.2s ease',
      }}
      className={`card-item ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
    >
      {/* Wrapper div must exist so attributes are applied to an element */}
      <div
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className={`w-full h-full relative ${
          isSelected
            ? 'ring-2 ring-blue-500 ring-opacity-75'
            : 'ring-1 ring-gray-300'
        } ${isDragging ? 'shadow-lg scale-105' : ''} ${isResizing ? 'shadow-md' : ''}`}
        style={{
          borderRadius: 4,
          backgroundColor: item.style?.backgroundColor ?? 'transparent',
          boxShadow: item.shadow ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          transition: isDragging || isResizing ? 'none' : 'all 0.2s ease',
        }}
      >
        {(isDragging || isResizing) && (
          <div
            className="absolute inset-0 bg-blue-500 bg-opacity-10 pointer-events-none"
            style={{ zIndex: 1 }}
          />
        )}

        {item.type === 'text' ? (
          <div
            className="w-full h-full p-2 overflow-hidden"
            style={{
              fontSize: `${fontSize}px`,
              fontFamily,
              color,
              fontStyle,
              fontWeight,
              textAlign,
              textDecoration,
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              display: 'flex',
              alignItems: textAlign === 'center' ? 'center' : 'flex-start',
              justifyContent:
                textAlign === 'center'
                  ? 'center'
                  : textAlign === 'right'
                    ? 'flex-end'
                    : 'flex-start',
            }}
          >
            {item.content || 'Double-click to edit'}
          </div>
        ) : (
          <div className="w-full h-full">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.content || 'Card Image'}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full object-cover"
                style={{ userSelect: 'none' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gray-50">
                No image
              </div>
            )}
          </div>
        )}

        {isSelected && (
          <>
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
          </>
        )}

        {isSelected && (
          <div
            className="absolute top-1 right-1 w-4 h-4 bg-blue-500 bg-opacity-20 rounded cursor-move"
            style={{ zIndex: 2 }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full opacity-60" />
            </div>
          </div>
        )}
      </div>
    </Rnd>
  );
}
