'use client';
import React from 'react';
import Image from 'next/image';

import {
  getResponsiveValue,
  getPanelScaleFromContainers,
} from '@/utils/screen';
import useDivStore from '@/store/UseDivStore';

export default function ElementRenderer({
  element,
  screenSize,
  previewContentWidth,
}) {
  const { editorContainerWidth } = useDivStore();
  const scale = getPanelScaleFromContainers(
    editorContainerWidth,
    previewContentWidth
  );

  const rawX = getResponsiveValue(element.x, screenSize) || 0;
  const rawY = getResponsiveValue(element.y, screenSize) || 0;
  const rawW = getResponsiveValue(element.width, screenSize) || 100;
  const rawH = getResponsiveValue(element.height, screenSize) || 30;
  const baseStyle = {
    position: 'absolute',
    left: `${rawX * scale}px`,
    top: `${rawY * scale}px`,
    width: `${rawW * scale}px`,
    height: `${rawH * scale}px`,
    margin: `${getResponsiveValue(element.margin?.top, screenSize) || 0}px ${getResponsiveValue(element.margin?.right, screenSize) || 0}px ${getResponsiveValue(element.margin?.bottom, screenSize) || 0}px ${getResponsiveValue(element.margin?.left, screenSize) || 0}px`,
    padding: `${getResponsiveValue(element.padding?.top, screenSize) || 5}px ${getResponsiveValue(element.padding?.right, screenSize) || 10}px ${getResponsiveValue(element.padding?.bottom, screenSize) || 5}px ${getResponsiveValue(element.padding?.left, screenSize) || 10}px`,
    fontSize: `${getResponsiveValue(element.fontSize, screenSize) || 16}px`,
    fontFamily:
      getResponsiveValue(element.fontFamily, screenSize) || 'Arial, sans-serif',
    fontWeight: getResponsiveValue(element.fontWeight, screenSize) || 'normal',
    color: getResponsiveValue(element.color, screenSize) || '#000000',
    backgroundColor:
      getResponsiveValue(element.backgroundColor, screenSize) || 'transparent',
    borderRadius: `${getResponsiveValue(element.borderRadius, screenSize) || 0}px`,
    border: getResponsiveValue(element.border, screenSize) || 'none',
    boxSizing: 'border-box',
    zIndex: getResponsiveValue(element.zIndex, screenSize) || 0,
    outline: 'none',
    // Merge and normalize element style sources
    ...(() => {
      const inline = element.inlineStyles || {};
      const extra = element.style || {};
      const custom = element.customStyles || {};
      const merged = { ...extra, ...inline, ...custom };
      // Vendor-prefixed normalization
      return {
        ...merged,
        WebkitTransform: merged.transform,
        msTransform: merged.transform,
        WebkitFilter: merged.filter,
        WebkitTransition: merged.transition,
      };
    })(),
  };

  switch (element.type) {
    case 'text':
      return (
        <div
          key={element.id}
          style={{
            ...baseStyle,
            backgroundColor:
              getResponsiveValue(element.backgroundColor, screenSize) ||
              'transparent',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            lineHeight: '1.5',
            textAlign: 'left',
            direction: 'ltr',
          }}
          dangerouslySetInnerHTML={{ __html: element.content }}
        />
      );

    case 'paragraph':
      return (
        <div
          key={element.id}
          style={{
            ...baseStyle,
            backgroundColor:
              getResponsiveValue(element.backgroundColor, screenSize) ||
              'transparent',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            lineHeight:
              getResponsiveValue(element.lineHeight, screenSize) || '1.5',
            textAlign:
              getResponsiveValue(element.textAlign, screenSize) || 'left',
            direction:
              getResponsiveValue(element.direction, screenSize) || 'ltr',
          }}
          dangerouslySetInnerHTML={{ __html: element.content }}
        />
      );

    case 'button':
      return (
        <button
          key={element.id}
          style={{
            ...baseStyle,
            backgroundColor:
              getResponsiveValue(element.backgroundColor, screenSize) ||
              '#007bff',
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

    case 'image': {
      const className = element.customClassName || `element-${element.id}`;
      const hasValidImage = Boolean(element.imageUrl);

      const border = getResponsiveValue(element.border, screenSize) || 'none';
      const borderRadius = `${getResponsiveValue(element.borderRadius, screenSize) || 0}px`;
      const boxShadow =
        getResponsiveValue(element.boxShadow, screenSize) || undefined;

      const objectFit = element.objectFit || 'cover';
      const objectPosition = element.objectPosition || 'center';
      const filter = getResponsiveValue(element.filter, screenSize) || 'none';
      const transform =
        getResponsiveValue(element.transform, screenSize) || 'none';
      const opacity = typeof element.opacity === 'number' ? element.opacity : 1;

      return (
        <div
          key={element.id}
          id={element.domId}
          className={className}
          style={{
            ...baseStyle,
            backgroundColor:
              getResponsiveValue(element.backgroundColor, screenSize) ||
              'transparent',
            padding: 0,
            position: 'relative',
            overflow: 'hidden',
            border,
            borderRadius,
            boxShadow,
          }}
        >
          {element.customCss && (
            <style
              dangerouslySetInnerHTML={{
                __html: element.customCss.includes(className)
                  ? element.customCss
                  : `.${className} { ${element.customCss} }`,
              }}
            />
          )}

          {hasValidImage ? (
            <img
              src={element.imageUrl}
              alt={element.content || 'Image'}
              className="w-full h-full select-none"
              style={{
                objectFit,
                objectPosition,
                filter,
                transform,
                opacity,
              }}
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const placeholder =
                  e.currentTarget.parentElement?.querySelector(
                    '.image-placeholder'
                  );
                if (placeholder) placeholder.style.display = 'flex';
              }}
              onLoad={(e) => {
                e.currentTarget.style.display = 'block';
              }}
            />
          ) : null}

          {!hasValidImage && (
            <div
              className="image-placeholder"
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f0f0f0',
                border: '2px dashed #ccc',
                borderRadius,
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
    }

    case 'card':
      return (
        <div
          key={element.id}
          style={{
            ...baseStyle,
            backgroundColor:
              getResponsiveValue(element.backgroundColor, screenSize) ||
              '#f8f9fa',
            border:
              getResponsiveValue(element.border, screenSize) ||
              '1px solid #e9ecef',
            borderRadius: `${getResponsiveValue(element.borderRadius, screenSize) || 8}px`,
            boxShadow:
              getResponsiveValue(element.boxShadow, screenSize) ||
              '0 2px 4px rgba(0,0,0,0.1)',
            ...element.style,
          }}
        >
          {/* Optional card label */}
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

          {/* Render card items without overlap (flow layout) */}
          <div
            className="card-flow-container"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              gap: 8,
              padding: 8,
              width: '100%',
              height: '100%',
              boxSizing: 'border-box',
              overflow: 'auto',
            }}
            aria-label="Card content container"
          >
            {(Array.isArray(element.items)
              ? element.items
              : Array.isArray(element.items?.[screenSize])
                ? element.items[screenSize]
                : []
            )
              .slice()
              .sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1))
              .map((it) => {
                const containerWidthPx = rawW * scale;
                const itemWidth =
                  it.wPct != null
                    ? Math.max(80, Math.round(it.wPct * containerWidthPx))
                    : Math.min(it.width || 200, containerWidthPx);
                const isText = it.type === 'text';

                return (
                  <div
                    key={it.id}
                    className={`card-flow-item ${isText ? 'card-text' : 'card-image'}`}
                    style={{
                      position: 'relative',
                      zIndex: it.zIndex || 1,
                      flex: '0 0 auto',
                      width: itemWidth,
                      maxWidth: '100%',
                      borderRadius: 4,
                      boxShadow: it.shadow
                        ? '0 4px 6px rgba(0,0,0,0.1)'
                        : 'none',
                      border: '1px solid rgba(0,0,0,0.1)',
                      backgroundColor: isText
                        ? 'rgba(255,255,255,0.9)'
                        : 'transparent',
                      overflow: 'hidden',
                    }}
                  >
                    {isText ? (
                      <p
                        aria-label="Card text"
                        className="w-full h-full p-2"
                        style={{
                          fontSize: `${
                            getResponsiveValue(
                              it.style?.fontSize,
                              screenSize
                            ) ||
                            it.style?.fontSize ||
                            16
                          }px`,
                          fontFamily:
                            getResponsiveValue(
                              it.style?.fontFamily,
                              screenSize
                            ) ||
                            it.style?.fontFamily ||
                            'Arial, sans-serif',
                          color:
                            getResponsiveValue(it.style?.color, screenSize) ||
                            it.style?.color ||
                            '#222',
                          fontStyle:
                            getResponsiveValue(
                              it.style?.fontStyle,
                              screenSize
                            ) ||
                            it.style?.fontStyle ||
                            'normal',
                          fontWeight:
                            getResponsiveValue(
                              it.style?.fontWeight,
                              screenSize
                            ) ||
                            it.style?.fontWeight ||
                            'normal',
                          textAlign:
                            getResponsiveValue(
                              it.style?.textAlign,
                              screenSize
                            ) ||
                            it.style?.textAlign ||
                            'left',
                          textDecoration:
                            getResponsiveValue(
                              it.style?.textDecoration,
                              screenSize
                            ) ||
                            it.style?.textDecoration ||
                            'none',
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-wrap',
                          margin: 0,
                        }}
                      >
                        {it.content || 'Text'}
                      </p>
                    ) : (
                      <figure
                        role="group"
                        aria-label="Card image"
                        className="w-full"
                        style={{ margin: 0 }}
                      >
                        {it.imageUrl ? (
                          <img
                            src={it.imageUrl}
                            alt={it.content || 'Card Image'}
                            className="w-full"
                            style={{
                              display: 'block',
                              width: '100%',
                              height: 'auto',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <div className="w-full h-24 flex items-center justify-center text-gray-400 text-xs bg-gray-50">
                            No image
                          </div>
                        )}
                        {it.content && (
                          <figcaption className="sr-only">
                            {it.content}
                          </figcaption>
                        )}
                      </figure>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Empty/small indicator */}
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
              getResponsiveValue(element.backgroundColor, screenSize) ||
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
            backgroundColor:
              getResponsiveValue(element.backgroundColor, screenSize) ||
              'transparent',
            border:
              getResponsiveValue(element.border, screenSize) ||
              '1px solid #ddd',
            // Apply any custom styles
            ...element.style,
          }}
        >
          {/* Add content if available */}
          {element.content && (
            <div
              style={{
                padding: '4px',
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
