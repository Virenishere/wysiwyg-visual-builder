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

  // Build inline styles from element properties
  const buildInlineStyles = () => {
    const styles = {};

    // Apply responsive values for common CSS properties
    const fontSize = getResponsiveValue(element.fontSize, screenSize);
    const color = getResponsiveValue(element.color, screenSize);
    const backgroundColor = getResponsiveValue(
      element.backgroundColor,
      screenSize
    );
    const borderRadius = getResponsiveValue(element.borderRadius, screenSize);
    const border = getResponsiveValue(element.border, screenSize);

    if (fontSize) styles.fontSize = `${fontSize}px`;
    if (color) styles.color = color;
    if (backgroundColor && backgroundColor !== 'transparent')
      styles.backgroundColor = backgroundColor;
    if (borderRadius) styles.borderRadius = `${borderRadius}px`;
    if (border && border !== 'none') styles.border = border;

    // Apply margin and padding
    if (element.margin) {
      const margin = getResponsiveValue(element.margin, screenSize);
      if (margin) {
        if (typeof margin === 'object') {
          styles.marginTop = `${margin.top || 0}px`;
          styles.marginRight = `${margin.right || 0}px`;
          styles.marginBottom = `${margin.bottom || 0}px`;
          styles.marginLeft = `${margin.left || 0}px`;
        }
      }
    }

    if (element.padding) {
      const padding = getResponsiveValue(element.padding, screenSize);
      if (padding) {
        if (typeof padding === 'object') {
          styles.paddingTop = `${padding.top || 0}px`;
          styles.paddingRight = `${padding.right || 0}px`;
          styles.paddingBottom = `${padding.bottom || 0}px`;
          styles.paddingLeft = `${padding.left || 0}px`;
        }
      }
    }

    // Apply custom styles from element.style object
    if (element.style) {
      Object.keys(element.style).forEach((key) => {
        const value = getResponsiveValue(element.style[key], screenSize);
        if (value !== undefined && value !== null) {
          styles[key] = value;
        }
      });
    }

    // Apply custom styles from customStyles
    if (element.customStyles) {
      Object.keys(element.customStyles).forEach((key) => {
        const value = getResponsiveValue(element.customStyles[key], screenSize);
        if (value !== undefined && value !== null) {
          styles[key] = value;
        }
      });
    }

    return styles;
  };

  const inlineStyles = buildInlineStyles();

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
        setActiveDragItem({
          ...element,
          x: x,
          y: y,
          isElement: true,
        });
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

        updateElement(parentId, boxId, element.id, { x: d.x, y: d.y });
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
        setActiveDragItem({
          ...element,
          x: x,
          y: y,
          isElement: true,
        });
      }}
      onResize={(e, direction, ref, delta, pos) => {
        if (isEditing) return;

        const newSize = { width: ref.offsetWidth, height: ref.offsetHeight };
        updateElement(parentId, boxId, element.id, {
          width: newSize.width,
          height: newSize.height,
          x: pos.x,
          y: pos.y,
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
        updateElement(parentId, boxId, element.id, {
          width: newSize.width,
          height: newSize.height,
          x: pos.x,
          y: pos.y,
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
        pointerEvents: 'auto',
        cursor: isEditing ? 'text' : 'default',
        ...inlineStyles, // Apply all computed styles
      }}
      className={`element-rnd ${element.customClassName || ''} ${isEditing ? 'editing-text' : ''}`}
    >
      {/* Apply custom CSS if provided */}
      {element.customCss && (
        <style
          dangerouslySetInnerHTML={{
            __html: element.customCss.includes(
              element.customClassName || `element-${element.id}`
            )
              ? element.customCss
              : `.${element.customClassName || `element-${element.id}`} { ${element.customCss} }`,
          }}
        />
      )}

      {renderElementContent()}

      {/* Add a style tag to handle text editing mode */}
      <style jsx>{`
        .editing-text .react-resizable-handle {
          display: none !important;
        }
        .editing-text {
          cursor: text !important;
          pointer-events: auto !important;
        }
        .editing-text * {
          pointer-events: auto !important;
        }
      `}</style>
    </Rnd>
  );
}
