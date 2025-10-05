'use client';
import React from 'react';
import ElementRenderer from './ElementRenderer';

import { getResponsiveValue } from '@/utils/screen';

export default function BoxPreview({ box, screenSize }) {
  const top = getResponsiveValue(box.y, screenSize);
  const left = getResponsiveValue(box.x, screenSize);
  const width = getResponsiveValue(box.width, screenSize);
  const height = getResponsiveValue(box.height, screenSize);

  return (
    <div
      key={box.id}
      style={{
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'hidden', // Ensure elements stay within bounds in preview too
      }}
    >
      {box.customCss && <style>{box.customCss}</style>}
      {box.customHtml && (
        <div dangerouslySetInnerHTML={{ __html: box.customHtml }} />
      )}
      {box.elements?.map((element) => (
        <ElementRenderer
          key={element.id}
          element={element}
          screenSize={screenSize}
        />
      ))}
    </div>
  );
}
