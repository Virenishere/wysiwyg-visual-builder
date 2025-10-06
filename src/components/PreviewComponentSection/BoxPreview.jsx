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
        overflow: 'hidden', // Ensure elements stay within bounds in preview too
      }}
    >
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
