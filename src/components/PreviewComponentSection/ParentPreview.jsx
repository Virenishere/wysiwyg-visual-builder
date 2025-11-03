'use client';
import React from 'react';
import BoxPreview from './BoxPreview';

import { getResponsiveValue } from '@/utils/screen';
import useDivStore from '@/store/UseDivStore';

export default function ParentPreview({ parent, index, total, screenSize }) {
  const { editorContainerWidth } = useDivStore();
  const scale = getEditorToPreviewScale(editorContainerWidth, screenSize);
  const rawHeight = getResponsiveValue(parent.size.height, screenSize);
  const height = rawHeight ? rawHeight / scale : 'auto';

  return (
    <div
      key={parent.id}
      style={{
        width: '100%',
        height: height === 'auto' ? 'auto' : `${height}px`,
        background:
          getResponsiveValue(parent.size.background, screenSize) || '#fff',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {parent.rnds.map((box) => (
        <BoxPreview key={box.id} box={box} screenSize={screenSize} />
      ))}
    </div>
  );
}
