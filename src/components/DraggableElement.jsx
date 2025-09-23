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

export default function DraggableElement({
  element,
  parentId,
  boxId,
  isSelected,
  onSelect,
}) {
  const { updateElement, setIsResizing, setActiveDragItem } = useDivStore();
  const [isEditingText, setIsEditingText] = useState(false);
  const fileInputRef = useRef(null);

  const renderElementContent = () => {
    switch (element.type) {
      case 'text':
      case 'paragraph':
        return (
          <EditableTextElement
            element={element}
            onSelect={onSelect}
            isSelected={isSelected}
            isEditing={isEditingText}
            setIsEditing={setIsEditingText}
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
        return <LineElement id={element.id} style={element.style} />;
      case 'div':
        return <DivElement id={element.id} style={element.style} />;
      default:
        return <UnknownElement element={element} />;
    }
  };

  // Handle click to prevent interference with text editing
  const handleClick = (e) => {
    if (isEditingText) {
      // Don't interfere with text editing
      return;
    }
    e.stopPropagation();
    onSelect(element.id);
  };

  return (
    <Rnd
      size={{ width: element.width, height: element.height }}
      position={{ x: element.x, y: element.y }}
      bounds={`.rnd-box[data-id="${boxId}"]`}
      disableDragging={isEditingText} // Disable dragging when editing text
      enableResizing={!isEditingText} // Disable resizing when editing text
      onDragStart={(e) => {
        if (isEditingText) {
          e.preventDefault();
          return;
        }
        e.stopPropagation();
      }}
      onDrag={(e, d) => {
        if (isEditingText) return;

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
        if (isEditingText) return;

        updateElement(parentId, boxId, element.id, { x: d.x, y: d.y });
        setActiveDragItem(null);
      }}
      onResizeStart={(e) => {
        if (isEditingText) {
          e.preventDefault();
          return;
        }
        e.stopPropagation();
        setIsResizing(true);
      }}
      onResize={(e, direction, ref, delta, pos) => {
        if (isEditingText) return;

        const newSize = { width: ref.offsetWidth, height: ref.offsetHeight };
        updateElement(parentId, boxId, element.id, { ...newSize, ...pos });
        // Set active drag item for resizing indicators
        setActiveDragItem({
          ...element,
          ...newSize,
          ...pos,
          isElement: true,
        });
      }}
      onResizeStop={(e, direction, ref, delta, pos) => {
        if (isEditingText) return;

        setIsResizing(false);
        const newSize = { width: ref.offsetWidth, height: ref.offsetHeight };
        updateElement(parentId, boxId, element.id, { ...newSize, ...pos });
        setActiveDragItem(null);
      }}
      onClick={handleClick}
      style={{
        border:
          isSelected && !isEditingText
            ? '2px solid #007bff'
            : '1px solid transparent',
        borderRadius: '2px',
        zIndex: isSelected || isEditingText ? 10 : element.zIndex || 1,
        pointerEvents: isEditingText ? 'auto' : 'auto',
      }}
      className={`element-rnd ${element.customClassName || ''} ${isEditingText ? 'editing-text' : ''}`}
      minHeight={element.type === 'line' ? 1 : 10}
      minWidth={10}
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
