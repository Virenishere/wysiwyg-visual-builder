'use client';
import React from 'react';
import BoxPreview from './BoxPreview';

import { getResponsiveValue } from '@/utils/screen';

export default function ParentPreview({ parent, index, total, screenSize }) {
  const height = getResponsiveValue(parent.size.height, screenSize);

  return (
    <div
      key={parent.id}
      style={{
        width: '100%',
        height: `${height}px`,
        background: parent.size.background || '#fff',
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
