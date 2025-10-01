'use client';
import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import useDivStore from '@/store/UseDivStore';

// Sub-components (assuming these exist)
import EditableTextElement from './DraggableElementSection/EditableTextElement';
import ButtonElement from './DraggableElementSection/ButtonElement';
import ImageElement from './DraggableElementSection/ImageElement';
import UnknownElement from './DraggableElementSection/UnknownElement';
import CardElement from './DraggableElementSection/CardElement';
import LineElement from './DraggableElementSection/LineElement';
import DivElement from './DraggableElementSection/DivElement';

import { getResponsiveValue } from '@/utils/screen';

export default function DraggableElement({
  element,
  parentId,
  boxId,
  isSelected,
  onSelect,
}) {
  const { updateElement, setIsResizing, setActiveDragItem, screenSize } =
    useDivStore();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const width = getResponsiveValue(element.width, screenSize);
  const height = getResponsiveValue(element.height, screenSize);
  const x = getResponsiveValue(element.x, screenSize);
  const y = getResponsiveValue(element.y, screenSize);

  const renderElementContent = () => {
    switch (element.type) {
      case 'text':
      case 'paragraph':
        return (
          <EditableTextElement
            element={element}
            onSelect={onSelect}
            isSelected={isSelected}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        );
      case 'button':
        return (
          <ButtonElement
            element={element}
            parentId={parentId}
            boxId={boxId}
            updateElement={updateElement}
          />
        );
      case 'image':
        return (
          <ImageElement
            element={element}
            parentId={parentId}
            boxId={boxId}
            updateElement={updateElement}
            fileInputRef={fileInputRef}
          />
        );
      case 'card':
        return (
          <CardElement id={element.id} style={element.style}>
            {element.children}
          </CardElement>
        );
      case 'line':
        return <LineElement element={element} />; // Pass the whole element
      case 'div':
        return <DivElement id={element.id} style={element.style} />;
      default:
        return <UnknownElement element={element} />;
    }
  };

  // Handle click to prevent interference with text editing
  const handleClick = (e) => {
    if (isEditing) {
      // Don't interfere with text editing
      return;
    }
    e.stopPropagation();
    onSelect(element.id);
  };

  return (
    <Rnd
      size={{ width: width, height: height }}
      position={{ x: x, y: y }}
      bounds={`.rnd-box[data-id="${boxId}"]`}
      disableDragging={isEditing} // Disable dragging when editing text
      enableResizing={!isEditing} // Disable resizing when editing text
      onDragStart={(e) => {
        if (isEditing) {
          e.preventDefault();
          return;
        }
        e.stopPropagation();
      }}
      onDrag={(e, d) => {
        if (isEditing) return;

        // Set active drag item with element data for indicators
        setActiveDragItem({
          ...element,
          x: d.x,
          y: d.y,
          // Add a flag to identify this as an element
          isElement: true,
        });
      }}
      onDragStop={(e, d) => {
        if (isEditing) return;

        const newX = { ...element.x, [screenSize]: d.x };
        const newY = { ...element.y, [screenSize]: d.y };
        updateElement(parentId, boxId, element.id, { x: newX, y: newY });
        setActiveDragItem(null);
      }}
      onResizeStart={(e) => {
        if (isEditing) {
          e.preventDefault();
          return;
        }
        setIsEditing(false); // Ensure not in editing mode
        e.stopPropagation();
        setIsResizing(true);
      }}
      onResize={(e, direction, ref, delta, pos) => {
        if (isEditing) return;

        const newSize = { width: ref.offsetWidth, height: ref.offsetHeight };
        const newWidth = { ...element.width, [screenSize]: newSize.width };
        const newHeight = { ...element.height, [screenSize]: newSize.height };
        updateElement(parentId, boxId, element.id, {
          width: newWidth,
          height: newHeight,
          ...pos,
        });
        // Set active drag item for resizing indicators
        setActiveDragItem({
          ...element,
          ...newSize,
          ...pos,
          isElement: true,
        });
      }}
      onResizeStop={(e, direction, ref, delta, pos) => {
        if (isEditing) return;

        setIsResizing(false);
        const newSize = { width: ref.offsetWidth, height: ref.offsetHeight };
        const newWidth = { ...element.width, [screenSize]: newSize.width };
        const newHeight = { ...element.height, [screenSize]: newSize.height };
        updateElement(parentId, boxId, element.id, {
          width: newWidth,
          height: newHeight,
          ...pos,
        });
        setActiveDragItem(null);
      }}
      onClick={handleClick}
      style={{
        border:
          isSelected && !isEditing
            ? '2px solid #007bff'
            : '1px solid transparent',
        borderRadius: '2px',
        zIndex: isSelected || isEditing ? 10 : element.zIndex || 1,
        pointerEvents: isEditing ? 'auto' : 'auto',
      }}
      className={`element-rnd ${element.customClassName || ''} ${isEditing ? 'editing-text' : ''}`}
    >
      {element.customCss && <style>{element.customCss}</style>}
      {renderElementContent()}

      {/* Add a style tag to handle text editing mode */}
      <style jsx>{`
        .editing-text .react-resizable-handle {
          display: none !important;
        }
        .editing-text {
          cursor: text !important;
        }
      `}</style>
    </Rnd>
  );
}
