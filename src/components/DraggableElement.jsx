"use client";
import React, { useState, useRef } from 'react';
import { Rnd } from "react-rnd";
import useDivStore from "@/store/UseDivStore";
import RichTextEditor from './RichTextEditor';

export default function DraggableElement({ 
  element, 
  parentId, 
  boxId, 
  isSelected, 
  onSelect 
}) {
  const { updateElement } = useDivStore();
  const [isEditingText, setIsEditingText] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateElement(parentId, boxId, element.id, {
          imageUrl: e.target.result,
          content: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderElementContent = () => {
    const baseStyle = {
      width: '100%',
      height: '100%',
      margin: `${element.margin?.top || 0}px ${element.margin?.right || 0}px ${element.margin?.bottom || 0}px ${element.margin?.left || 0}px`,
      padding: `${element.padding?.top || 5}px ${element.padding?.right || 10}px ${element.padding?.bottom || 5}px ${element.padding?.left || 10}px`,
      fontSize: `${element.fontSize || 16}px`,
      fontFamily: element.fontFamily || 'Arial, sans-serif',
      color: element.color || '#000000',
      backgroundColor: element.backgroundColor || 'transparent',
      borderRadius: `${element.borderRadius || 0}px`,
      border: element.border || 'none',
      cursor: 'pointer',
      boxSizing: 'border-box',
      overflow: 'hidden',
    };

    switch (element.type) {
      case 'text':
        if (isEditingText) {
          return (
            <input
              type="text"
              value={element.content}
              onChange={(e) => 
                updateElement(parentId, boxId, element.id, { content: e.target.value })
              }
              onBlur={() => setIsEditingText(false)}
              onKeyPress={(e) => e.key === 'Enter' && setIsEditingText(false)}
              style={{
                ...baseStyle,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                width: '100%',
                height: '100%',
              }}
              autoFocus
            />
          );
        }
        return (
          <div
            style={{
              ...baseStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              fontWeight: element.fontSize > 24 ? 'bold' : 'normal',
              textAlign: 'left',
            }}
            onDoubleClick={() => setIsEditingText(true)}
          >
            {element.content}
          </div>
        );

      case 'paragraph':
        return (
          <div style={{ ...baseStyle, padding: '5px' }}>
            <RichTextEditor
              value={element.content}
              onChange={(content) => 
                updateElement(parentId, boxId, element.id, { content })
              }
              height={Math.max(element.height - 20, 100)}
            />
          </div>
        );

      case 'button':
        return (
          <button
            style={{
              ...baseStyle,
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
            className="hover:opacity-80 hover:scale-105 active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Button clicked:', element.content);
            }}
            onDoubleClick={() => {
              const newContent = prompt('Edit button text:', element.content);
              if (newContent !== null) {
                updateElement(parentId, boxId, element.id, { content: newContent });
              }
            }}
          >
            {element.content}
          </button>
        );

      case 'image':
        return (
          <div style={{ ...baseStyle, padding: 0 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            {element.imageUrl ? (
              <img
                src={element.imageUrl}
                alt={element.content}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: `${element.borderRadius || 0}px`,
                  border: element.border || 'none',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              />
            ) : (
              <div
                style={{
                  ...baseStyle,
                  border: '2px dashed #ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '8px',
                  backgroundColor: '#f9f9f9',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <span style={{ fontSize: '24px' }}>📷</span>
                <span style={{ fontSize: '12px', color: '#666' }}>Click to upload</span>
              </div>
            )}
          </div>
        );

      default:
        return <div style={baseStyle}>Unknown Element</div>;
    }
  };

  return (
    <Rnd
      size={{ width: element.width, height: element.height }}
      position={{ x: element.x, y: element.y }}
      bounds="parent"
      onDragStop={(e, d) => {
        updateElement(parentId, boxId, element.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, pos) => {
        updateElement(parentId, boxId, element.id, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          ...pos,
        });
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
    >
      {renderElementContent()}
    </Rnd>
  );
}