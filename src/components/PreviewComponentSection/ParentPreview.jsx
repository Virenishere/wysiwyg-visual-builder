'use client';
import React from 'react';
import BoxPreview from './BoxPreview';

import { getResponsiveValue } from '@/utils/screen';
import useDivStore from '@/store/UseDivStore';

export default function ParentPreview({ parent, index, total, screenSize }) {
  const { editorContainerWidth } = useDivStore();

  const height = getResponsiveValue(
    parent.size.height,
    screenSize,
    editorContainerWidth
  );

  return (
    <div
      key={parent.id}
      style={{
        width: '100%',
        height: `${height}px`,
        background:
          getResponsiveValue(parent.size.background, screenSize) || '#fff',
        position: 'relative',
        overflow: 'hidden',
        // borderBottom: index < total - 1 ? "1px solid #e0e0e0" : "none",
      }}
    >
      {parent.rnds.map((box) => (
        <BoxPreview key={box.id} box={box} screenSize={screenSize} />
      ))}
    </div>
  );
}
