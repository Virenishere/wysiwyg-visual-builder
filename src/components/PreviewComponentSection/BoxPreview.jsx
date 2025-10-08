'use client';
import React from 'react';
import ElementRenderer from './ElementRenderer';

import { getResponsiveValue } from '@/utils/screen';
import useDivStore from '@/store/UseDivStore';

export default function BoxPreview({ box, screenSize }) {
  const { editorContainerWidth } = useDivStore();

  const top = getResponsiveValue(box.y, screenSize, editorContainerWidth);
  const left = getResponsiveValue(box.x, screenSize, editorContainerWidth);
  const width = getResponsiveValue(box.width, screenSize, editorContainerWidth);
  const height = getResponsiveValue(
    box.height,
    screenSize,
    editorContainerWidth
  );

  return (
    <div
      key={box.id}
      style={{
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'hidden',
      }}
    >
      {/* Render custom CSS */}
      {box.customCss && <style>{box.customCss}</style>}

      {/* Render custom HTML */}
      {box.customHtml && (
        <div
          dangerouslySetInnerHTML={{ __html: box.customHtml }}
          style={{
            width: '100%',
            height: '100%',
            overflow: 'hidden', // Allow scrolling if content overflows
          }}
        />
      )}

      {/* Render standard elements */}
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
