'use client';
import React from 'react';
import ElementRenderer from './ElementRenderer';

import { getResponsiveValue } from '@/utils/screen';
import useDivStore from '@/store/UseDivStore';

export default function BoxPreview({ box, screenSize }) {
  const { editorContainerWidth } = useDivStore();

  const scale = getEditorToPreviewScale(editorContainerWidth, screenSize);

  const rawTop = getResponsiveValue(box.y, screenSize) || 0;
  const rawLeft = getResponsiveValue(box.x, screenSize) || 0;
  const rawWidth = getResponsiveValue(box.width, screenSize) || 150;
  const rawHeight = getResponsiveValue(box.height, screenSize) || 150;

  return (
    <div
      key={box.id}
      style={{
        position: 'absolute',
        top: `${rawTop / scale}px`,
        left: `${rawLeft / scale}px`,
        width: `${rawWidth / scale}px`,
        height: `${rawHeight / scale}px`,
        overflow: 'hidden',
        boxSizing: 'border-box',
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
