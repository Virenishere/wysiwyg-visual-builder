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
      fontSize: `${element.fontSize}px`,
      fontFamily: element.fontFamily,
      color: element.color,
      backgroundColor: element.backgroundColor,
      borderRadius: `${element.borderRadius}px`,
      border: element.border,
      cursor: 'pointer',
      boxSizing: 'border-box',
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
              }}
              autoFocus
            />
          );
        }
        return (
          <div
            style={baseStyle}
            onDoubleClick={() => setIsEditingText(true)}
            className="flex items-center justify-center"
          >
            {element.content}
          </div>
        );

      case 'paragraph':
        return (
          <div style={{ ...baseStyle, padding: 0 }}>
            <RichTextEditor
              value={element.content}
              onChange={(content) => 
                updateElement(parentId, boxId, element.id, { content })
              }
              height={element.height - 20}
            />
          </div>
        );

      case 'button':
        return (
          <button
            style={baseStyle}
            className="hover:opacity-80 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              // Button click logic here
              console.log('Button clicked:', element.content);
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
                  borderRadius: `${element.borderRadius}px`,
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
                  gap: '8px'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <span>📷</span>
                <span style={{ fontSize: '12px' }}>Click to upload</span>
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
      }}
      className="element-rnd"
    >
      {renderElementContent()}
    </Rnd>
  );
}