'use client';
import React from 'react';
import ElementRenderer from './ElementRenderer';

export default function BoxPreview({ box }) {
  return (
    <div
      key={box.id}
      style={{
        position: 'absolute',
        top: `${box.y}px`,
        left: `${box.x}px`,
        width: `${box.width}px`,
        height: `${box.height}px`,
      }}
    >
      {box.customCss && <style>{box.customCss}</style>}
      {box.customHtml && (
        <div dangerouslySetInnerHTML={{ __html: box.customHtml }} />
      )}
      {box.elements?.map((element) => (
        <ElementRenderer key={element.id} element={element} />
      ))}
    </div>
  );
}
