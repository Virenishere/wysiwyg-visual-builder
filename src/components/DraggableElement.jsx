'use client';
import React, { useState, useRef, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import useDivStore from '@/store/UseDivStore';
import throttle from '@/utils/throttle';

// Sub-components (assuming these exist)
import EditableTextElement from './DraggableElementSection/EditableTextElement';
import ButtonElement from './DraggableElementSection/ButtonElement';
import ImageElement from './DraggableElementSection/ImageElement';
import UnknownElement from './DraggableElementSection/UnknownElement';
import CardElement from './DraggableElementSection/CardElement';
import LineElement from './DraggableElementSection/LineElement';
import DivElement from './DraggableElementSection/DivElement';

import { getResponsiveValue, getScreenPixelWidth } from '@/utils/screen';

export default function DraggableElement({
  element,
  parentId,
  boxId,
  isSelected,
  onSelect,
  duplicateElement,
  containerBounds,
}) {
  const {
    updateElement,
    setActiveDragItem,
    activeDragItem,
    screenSize,
    containerRect,
  } = useDivStore();
  const [isDragging, setIsDragging] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef(null);
  const dragDataRef = useRef(null);

  const throttledSetActiveDragItem = useCallback(
    throttle((data) => {
      setActiveDragItem(data);
    }, 16), // Throttle to 60fps
    [setActiveDragItem, throttle]
  );

  // Get the actual editor container width for scaling calculations
  const editorContainerWidth =
    containerRect?.width || getScreenPixelWidth(screenSize);

  const width = getResponsiveValue(element.width, screenSize) || 100;
  const height = getResponsiveValue(element.height, screenSize) || 30;
  const x = getResponsiveValue(element.x, screenSize) || 0;
  const y = getResponsiveValue(element.y, screenSize) || 0;

  // Custom bounds validation function
  const validateBounds = (newX, newY, newWidth, newHeight) => {
    if (!containerBounds)
      return { x: newX, y: newY, width: newWidth, height: newHeight };

    const maxX = containerBounds.width - newWidth;
    const maxY = containerBounds.height - newHeight;

    return {
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
      width: Math.min(newWidth, containerBounds.width),
      height: Math.min(newHeight, containerBounds.height),
    };
  };

  // Debug logging for text elements
  if (element.type === 'text') {
    console.log('Text element values:', {
      elementId: element.id,
      screenSize,
      editorContainerWidth,
      rawX: element.x,
      rawY: element.y,
      rawWidth: element.width,
      rawHeight: element.height,
      resolvedX: x,
      resolvedY: y,
      resolvedWidth: width,
      resolvedHeight: height,
    });
  }

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
      case 'custom-code':
        return (
          <div
            dangerouslySetInnerHTML={{ __html: element.customHtml }}
            style={{ width: '100%', height: '100%', overflow: 'auto' }}
          />
        );
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

  // Helper function to get default border for element types
  const getDefaultBorder = () => {
    if (
      element.type === 'text' ||
      element.type === 'paragraph' ||
      element.type === 'card'
    ) {
      return '1px solid rgba(0, 0, 0, 0.1)'; // Mild border for text and card elements
    }
    return '1px solid transparent'; // Transparent for other elements
  };

  const inlineStyles = buildInlineStyles();

  return (
    <Rnd
      size={{
        width: Math.max(width || 100, 10),
        height: Math.max(height || 30, 10),
      }}
      position={{
        x: Math.max(0, x || 0),
        y: Math.max(0, y || 0),
      }}
      // Add bounds to prevent visual dragging outside parent
      bounds="parent"
      enableResizing={{
        top: !isEditing,
        right: !isEditing,
        bottom: !isEditing,
        left: !isEditing,
        topRight: !isEditing,
        bottomRight: !isEditing,
        bottomLeft: !isEditing,
        topLeft: !isEditing,
      }}
      disableDragging={isEditing}
      dragAxis="both"
      onDragStart={(e) => {
        if (isEditing) {
          e.preventDefault();
          return;
        }
        e.stopPropagation();
        setIsDragging(true);
        const startData = { ...element, x, y, isElement: true };
        dragDataRef.current = startData;
        setActiveDragItem(startData);
      }}
      onDrag={(e, d) => {
        if (isEditing) return;

        // Validate bounds during drag to prevent going outside container
        const validatedX = containerBounds
          ? Math.max(0, Math.min(d.x, containerBounds.width - width))
          : d.x;
        const validatedY = containerBounds
          ? Math.max(0, Math.min(d.y, containerBounds.height - height))
          : d.y;

        const newDragData = {
          ...element,
          x: validatedX,
          y: validatedY,
          isElement: true,
        };
        dragDataRef.current = newDragData;
        throttledSetActiveDragItem(newDragData);
      }}
      onDragStop={(e, d) => {
        if (isEditing) return;

        setIsDragging(false);

        // Apply bounds validation before updating
        const validatedX = containerBounds
          ? Math.max(
              0,
              Math.min(parseFloat(d.x), containerBounds.width - width)
            )
          : parseFloat(d.x);
        const validatedY = containerBounds
          ? Math.max(
              0,
              Math.min(parseFloat(d.y), containerBounds.height - height)
            )
          : parseFloat(d.y);

        if (isNaN(validatedX) || isNaN(validatedY)) {
          console.error('NaN detected on drag stop. Aborting update.');
          setActiveDragItem(null);
          return;
        }

        // Update element position on drag stop
        updateElement(parentId, boxId, element.id, {
          x: validatedX,
          y: validatedY,
        });
        setActiveDragItem(null);
        dragDataRef.current = null;
      }}
      onResizeStart={(e) => {
        if (isEditing) {
          e.preventDefault();
          return;
        }
        setIsEditing(false);
        e.stopPropagation();
        setIsResizing(true);
        setActiveDragItem({
          ...element,
          x: x,
          y: y,
          isElement: true,
        });
      }}
      onResize={(e, direction, ref, delta, position) => {
        if (isEditing) return;
        // Only update the active drag item for visual feedback
        setActiveDragItem({
          ...element,
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: position.x,
          y: position.y,
          isElement: true,
        });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (isEditing) return;

        setIsResizing(false);

        const newWidth = parseFloat(ref.style.width);
        const newHeight = parseFloat(ref.style.height);

        if (isNaN(newWidth) || isNaN(newHeight)) {
          console.error('NaN detected on resize stop. Aborting update.');
          setActiveDragItem(null);
          return;
        }

        const validated = validateBounds(
          position.x,
          position.y,
          newWidth,
          newHeight
        );

        updateElement(parentId, boxId, element.id, {
          width: validated.width,
          height: validated.height,
          x: validated.x,
          y: validated.y,
        });

        setActiveDragItem(null);
      }}
      onDoubleClick={() => setIsEditing(true)}
      onClick={handleClick}
      style={{
        border:
          isSelected && !isEditing ? '2px solid #007bff' : getDefaultBorder(),
        borderRadius: '2px',
        zIndex:
          isDragging || isResizing || isSelected || isEditing
            ? 10
            : element.zIndex || 1,
        pointerEvents: 'auto',
        cursor: isEditing ? 'text' : 'move',
        touchAction: 'none',
        userSelect: isEditing ? 'text' : 'none',
        ...inlineStyles,
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
          user-select: text !important;
        }
        .element-rnd {
          user-select: none;
        }
        .element-rnd.editing-text {
          user-select: text !important;
        }
        .rich-text-editor {
          user-select: text !important;
        }
      `}</style>
    </Rnd>
  );
}
