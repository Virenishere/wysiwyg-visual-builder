'use client';
import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import useDivStore from '@/store/UseDivStore';

// Sub-components
import TextElement from './DraggableElementSection/TextElement';
import ParagraphElement from './DraggableElementSection/ParagraphElement';
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
        return (
          <TextElement
            element={element}
            parentId={parentId}
            boxId={boxId}
            isEditingText={isEditingText}
            setIsEditingText={setIsEditingText}
            updateElement={updateElement}
          />
        );
      case 'paragraph':
        return (
          <ParagraphElement
            element={element}
            parentId={parentId}
            boxId={boxId}
            updateElement={updateElement}
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

  return (
    <Rnd
      size={{ width: element.width, height: element.height }}
      position={{ x: element.x, y: element.y }}
      bounds="parent"
      onDragStart={(e) => e.stopPropagation()}
      onDrag={(e, d) => {
        setActiveDragItem({ ...element, ...d });
      }}
      onDragStop={(e, d) => {
        updateElement(parentId, boxId, element.id, { x: d.x, y: d.y });
        setActiveDragItem(null);
      }}
      onResizeStart={(e) => {
        e.stopPropagation();
        setIsResizing(true);
      }}
      onResize={(e, direction, ref, delta, pos) => {
        const newSize = { width: ref.offsetWidth, height: ref.offsetHeight };
        updateElement(parentId, boxId, element.id, { ...newSize, ...pos });
        setActiveDragItem({ ...element, ...newSize, ...pos });
      }}
      onResizeStop={(e, direction, ref, delta, pos) => {
        setIsResizing(false);
        const newSize = { width: ref.offsetWidth, height: ref.offsetHeight };
        updateElement(parentId, boxId, element.id, { ...newSize, ...pos });
        setActiveDragItem(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element.id);
      }}
      style={{
        border: isSelected ? '2px solid #007bff' : '1px solid transparent',
        borderRadius: '2px',
        zIndex: isSelected ? 10 : 1,
      }}
      className="element-rnd"
      minHeight={1}
      minWidth={1}
    >
      {renderElementContent()}
    </Rnd>
  );
}
