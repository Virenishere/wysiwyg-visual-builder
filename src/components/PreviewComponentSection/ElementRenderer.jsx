'use client';
import React from 'react';

export default function ElementRenderer({ element }) {
  const baseStyle = {
    position: 'absolute',
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    margin: `${element.margin?.top || 0}px ${element.margin?.right || 0}px ${element.margin?.bottom || 0}px ${element.margin?.left || 0}px`,
    padding: `${element.padding?.top || 5}px ${element.padding?.right || 10}px ${element.padding?.bottom || 5}px ${element.padding?.left || 10}px`,
    fontSize: `${element.fontSize || 16}px`,
    fontFamily: element.fontFamily || 'Arial, sans-serif',
    color: element.color || '#000000',
    backgroundColor: element.backgroundColor || 'transparent',
    borderRadius: `${element.borderRadius || 0}px`,
    border: element.border || 'none',
    boxSizing: 'border-box',
    zIndex: element.zIndex || 0,
    ...element.customStyles,
  };

  switch (element.type) {
    case 'text':
      return (
        <div
          key={element.id}
          style={{
            ...baseStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            fontWeight: element.fontSize > 24 ? 'bold' : 'normal',
          }}
          dangerouslySetInnerHTML={{ __html: element.content }}
        />
      );

    case 'paragraph':
      return (
        <div
          key={element.id}
          style={baseStyle}
          dangerouslySetInnerHTML={{ __html: element.content }}
        />
      );

    case 'button':
      return (
        <button
          key={element.id}
          style={{
            ...baseStyle,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="hover:opacity-80 hover:scale-105 active:scale-95"
          onClick={() => console.log('Button clicked:', element.content)}
        >
          {element.content || 'Click Me'}
        </button>
      );

    case 'image':
      return (
        <div
          key={element.id}
          style={{
            ...baseStyle,
            padding: 0,
          }}
        >
          {element.imageUrl ? (
            <img
              src={element.imageUrl}
              alt={element.content || 'Image'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: `${element.borderRadius || 0}px`,
                border: element.border || 'none',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f0f0f0',
                border: '2px dashed #ccc',
                borderRadius: `${element.borderRadius || 0}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: '#999',
                fontSize: '12px',
              }}
            >
              <span style={{ fontSize: '24px', marginBottom: '8px' }}>🖼️</span>
              <span>No Image</span>
            </div>
          )}
        </div>
      );

    case 'card':
      return (
        <div
          key={element.id}
          style={{
            ...baseStyle,
            ...element.style, // Apply custom styles first
            backgroundColor:
              element.backgroundColor ||
              element.style?.backgroundColor ||
              '#f8f9fa',
            border:
              element.border || element.style?.border || '1px solid #e9ecef',
            borderRadius: `${
              element.borderRadius || element.style?.borderRadius || 8
            }px`,
            boxShadow:
              element.boxShadow ||
              element.style?.boxShadow ||
              '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {/* Add content indicator for cards */}
          {element.content && (
            <div
              style={{
                padding: '8px',
                fontSize: '12px',
                color: element.color || '#333',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {element.content}
            </div>
          )}
          {/* Visual indicator for empty/small cards */}
          {!element.content && element.height <= 30 && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '10px',
                color: '#999',
                pointerEvents: 'none',
              }}
            >
              Card
            </div>
          )}
        </div>
      );

    case 'line':
      return (
        <div
          key={element.id}
          style={{
            ...baseStyle,
            // Ensure line is always visible
            backgroundColor:
              element.backgroundColor ||
              element.style?.backgroundColor ||
              '#000000',
            // Set minimum height for visibility in editor
            minHeight: element.height < 2 ? '2px' : `${element.height}px`,
            // Remove padding for lines
            padding: 0,
            // Ensure proper line styling
            border: element.border || 'none',
            borderRadius: `${element.borderRadius || 0}px`,
            // Apply any custom styles
            ...element.style,
            // Override height to ensure minimum visibility
            height: element.height < 1 ? '1px' : `${element.height}px`,
          }}
        >
          {/* Add visual indicator for very thin lines in editor */}
          {element.height <= 2 && (
            <div
              style={{
                position: 'absolute',
                top: '-15px',
                left: '0',
                fontSize: '8px',
                color: '#999',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                background: 'rgba(255,255,255,0.8)',
                padding: '1px 3px',
                borderRadius: '2px',
                display: element.height < 2 ? 'block' : 'none',
              }}
            >
              Line ({element.height}px)
            </div>
          )}
        </div>
      );

    case 'div':
      return (
        <div
          key={element.id}
          style={{
            ...baseStyle,
            backgroundColor: element.backgroundColor || 'transparent',
            border: element.border || '1px solid #ddd',
            // Apply any custom styles
            ...element.style,
          }}
        >
          {/* Add content if available */}
          {element.content && (
            <div
              style={{
                padding: '4px',
                fontSize: element.fontSize || '12px',
                color: element.color || '#333',
              }}
            >
              {element.content}
            </div>
          )}
        </div>
      );

    default:
      return (
        <div key={element.id} style={baseStyle}>
          Unknown Element: {element.type}
        </div>
      );
  }
}
