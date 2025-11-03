'use client';
import React from 'react';
import { getResponsiveValue } from '@/utils/screen';

export default function CardItemView({
  it,
  selectedId,
  setSelectedId,
  onStartDrag,
  onStartResize,
  onEditText,
  screenSize,
}) {
  const commonStyle = {
    position: 'absolute',
    left: it.x,
    top: it.y,
    width: it.width,
    height: it.height,
    zIndex: it.zIndex || 1,
    boxShadow: it.shadow ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
    outline:
      selectedId === it.id
        ? '2px solid rgba(99,102,241,0.9)'
        : '1px solid rgba(0,0,0,0.1)',
    borderRadius: 4,
    backgroundColor: it.type === 'text' ? '#ffffff80' : 'transparent',
    overflow: 'hidden',
    cursor: 'move',
    userSelect: 'none',
  };

  const handleDoubleClick = () => {
    if (it.type === 'text') onEditText(it);
  };

  const RenderResizeHandle = (pos) => (
    <div
      onMouseDown={(e) => onStartResize(it, pos, e)}
      onTouchStart={(e) => onStartResize(it, pos, e)}
      style={{
        position: 'absolute',
        width: 10,
        height: 10,
        background: '#6366f1',
        borderRadius: 2,
        ...(pos === 'tl' && { left: -5, top: -5 }),
        ...(pos === 'tr' && { right: -5, top: -5 }),
        ...(pos === 'bl' && { left: -5, bottom: -5 }),
        ...(pos === 'br' && { right: -5, bottom: -5 }),
        ...(pos === 'l' && {
          left: -5,
          top: '50%',
          transform: 'translateY(-50%)',
        }),
        ...(pos === 'r' && {
          right: -5,
          top: '50%',
          transform: 'translateY(-50%)',
        }),
        ...(pos === 't' && {
          top: -5,
          left: '50%',
          transform: 'translateX(-50%)',
        }),
        ...(pos === 'b' && {
          bottom: -5,
          left: '50%',
          transform: 'translateX(-50%)',
        }),
        display: selectedId === it.id ? 'block' : 'none',
      }}
    />
  );

  return (
    <div
      className="card-item"
      style={commonStyle}
      onMouseDown={(e) => onStartDrag(it, e)}
      onTouchStart={(e) => onStartDrag(it, e)}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedId(it.id);
      }}
    >
      {it.type === 'text' ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            fontSize: `${getResponsiveValue(it.style?.fontSize, screenSize) || it.style?.fontSize || 16}px`,
            fontFamily:
              getResponsiveValue(it.style?.fontFamily, screenSize) ||
              it.style?.fontFamily ||
              'Arial, sans-serif',
            color:
              getResponsiveValue(it.style?.color, screenSize) ||
              it.style?.color ||
              '#222',
            fontStyle:
              getResponsiveValue(it.style?.fontStyle, screenSize) ||
              it.style?.fontStyle ||
              'normal',
            textAlign:
              getResponsiveValue(it.style?.textAlign, screenSize) ||
              it.style?.textAlign ||
              'left',
            padding: 8,
            outline: 'none',
          }}
        >
          {it.content}
        </div>
      ) : (
        <>
          {it.imageUrl ? (
            <img
              src={it.imageUrl}
              alt={it.content || 'Card Image'}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                userSelect: 'none',
              }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-gray-400 text-xs"
              style={{ background: '#f8fafc' }}
            >
              No image
            </div>
          )}
        </>
      )}

      {RenderResizeHandle('tl')}
      {RenderResizeHandle('tr')}
      {RenderResizeHandle('bl')}
      {RenderResizeHandle('br')}
      {RenderResizeHandle('l')}
      {RenderResizeHandle('r')}
      {RenderResizeHandle('t')}
      {RenderResizeHandle('b')}
    </div>
  );
}
