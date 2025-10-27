'use client';
import React from 'react';
import useDivStore from '@/store/UseDivStore';
import { getResponsiveValue } from '@/utils/screen';
import ElementRenderer from './PreviewComponentSection/ElementRenderer';

const BoxPreview = ({ box, screenSize }) => {
  const width = getResponsiveValue(box.width, screenSize);
  const height = getResponsiveValue(box.height, screenSize);
  const x = getResponsiveValue(box.x, screenSize);
  const y = getResponsiveValue(box.y, screenSize);
  const zIndex = box.zIndex || 1;
  const backgroundColor =
    getResponsiveValue(box.backgroundColor, screenSize) || 'transparent';

  const boxStyles = {
    position: 'absolute',
    width: `${width}px`,
    height: `${height}px`,
    left: `${x}px`,
    top: `${y}px`,
    zIndex: zIndex,
    backgroundColor: backgroundColor,
  };

  return (
    <div style={boxStyles}>
      {box.customCss && <style>{box.customCss}</style>}
      {box.customHtml && (
        <div
          dangerouslySetInnerHTML={{ __html: box.customHtml }}
          style={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
          }}
        />
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
};

const ParentPreview = ({ parent, screenSize }) => {
  const height = getResponsiveValue(parent.size?.height, screenSize) || 'auto';
  const backgroundValue =
    getResponsiveValue(parent.size?.background, screenSize) || '#fff';

  // Handle both solid colors and gradients properly
  const getBackgroundStyle = (bgValue) => {
    if (!bgValue || bgValue === 'transparent') {
      return { backgroundColor: 'transparent' };
    }

    const bgString = String(bgValue);

    // Check if it's a gradient
    if (
      bgString.startsWith('linear-gradient') ||
      bgString.startsWith('radial-gradient')
    ) {
      return { background: bgString };
    }

    // Otherwise treat as solid color
    return { backgroundColor: bgString };
  };

  const backgroundStyle = getBackgroundStyle(backgroundValue);

  const parentStyle = {
    position: 'relative',
    height: height === 'auto' ? 'auto' : `${height}px`,
  };

  if (backgroundStyle.background) {
    parentStyle.background = backgroundStyle.background;
  } else {
    parentStyle.backgroundColor = backgroundStyle.backgroundColor;
    parentStyle.backgroundImage = parent.backgroundImage
      ? `url(${parent.backgroundImage})`
      : 'none';
    parentStyle.backgroundSize = parent.backgroundSize || 'cover';
    parentStyle.backgroundPosition = parent.backgroundPosition || 'center';
    parentStyle.backgroundRepeat = parent.backgroundRepeat || 'no-repeat';
  }

  return (
    <section style={parentStyle}>
      {parent.rnds?.map((box) => (
        <BoxPreview key={box.id} box={box} screenSize={screenSize} />
      ))}
    </section>
  );
};

export default function PreviewComponent({ parents: parentsProp, screenSize }) {
  const { parents: parentsFromStore, layouts } = useDivStore();

  const parents =
    parentsProp || parentsFromStore || layouts[screenSize]?.parents || [];

  if (!parents || parents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">
            No Content to Display
          </h1>
          <p className="text-gray-500">
            The template is empty or could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {parents.map((parent, index) => (
        <ParentPreview
          key={parent.id}
          parent={parent}
          index={index}
          total={parents.length}
          screenSize={screenSize}
        />
      ))}
    </div>
  );
}
