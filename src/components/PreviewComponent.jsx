'use client';
import React from 'react';
import useDivStore from '@/store/UseDivStore';
import {
  getResponsiveValue,
  getPanelScaleFromContainers,
  measureContainer,
} from '@/utils/screen';
import ElementRenderer from './PreviewComponentSection/ElementRenderer';

const BoxPreview = ({ box, screenSize, previewContentWidth }) => {
  const { editorContainerWidth } = useDivStore();
  const scale = getPanelScaleFromContainers(
    editorContainerWidth,
    previewContentWidth
  );

  const width = (getResponsiveValue(box.width, screenSize) || 150) * scale;
  const height = (getResponsiveValue(box.height, screenSize) || 150) * scale;
  const x = (getResponsiveValue(box.x, screenSize) || 0) * scale;
  const y = (getResponsiveValue(box.y, screenSize) || 0) * scale;
  const zIndex = box.zIndex || 1;
  const backgroundColor =
    getResponsiveValue(box.backgroundColor, screenSize) || 'transparent';

  const boxStyles = {
    position: 'absolute',
    width: `${width}px`,
    height: `${height}px`,
    left: `${x}px`,
    top: `${y}px`,
    zIndex,
    backgroundColor,
    boxSizing: 'border-box',
  };

  return (
    <div style={boxStyles}>
      {box.customCss && <style>{box.customCss}</style>}
      {box.customHtml && (
        <div
          dangerouslySetInnerHTML={{ __html: box.customHtml }}
          style={{ width: '100%', height: '100%', overflow: 'hidden' }}
        />
      )}
      {box.elements?.map((element) => (
        <ElementRenderer
          key={element.id}
          element={element}
          screenSize={screenSize}
          previewContentWidth={previewContentWidth}
        />
      ))}
    </div>
  );
};

const ParentPreview = ({ parent, screenSize, previewContentWidth }) => {
  const { editorContainerWidth } = useDivStore();
  const scale = getPanelScaleFromContainers(
    editorContainerWidth,
    previewContentWidth
  );

  const rawHeight = getResponsiveValue(parent.size?.height, screenSize);
  const height = rawHeight ? rawHeight * scale : 'auto';
  const backgroundValue =
    getResponsiveValue(parent.size?.background, screenSize) || '#fff';

  const getBackgroundStyle = (bgValue) => {
    if (!bgValue || bgValue === 'transparent')
      return { backgroundColor: 'transparent' };
    const s = String(bgValue);
    if (s.startsWith('linear-gradient') || s.startsWith('radial-gradient'))
      return { background: s };
    return { backgroundColor: s };
  };
  const backgroundStyle = getBackgroundStyle(backgroundValue);

  const parentStyle = {
    position: 'relative',
    width: '100%',
    height: height === 'auto' ? 'auto' : `${height}px`,
    overflow: 'hidden',
    boxSizing: 'border-box',
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
        <BoxPreview
          key={box.id}
          box={box}
          screenSize={screenSize}
          previewContentWidth={previewContentWidth}
        />
      ))}
    </section>
  );
};

export default function PreviewComponent({ parents: parentsProp, screenSize }) {
  const { parents: parentsFromStore, layouts } = useDivStore();

  const parents =
    parentsProp || parentsFromStore || layouts[screenSize]?.parents || [];
  const previewRef = React.useRef(null);
  const [previewContentWidth, setPreviewContentWidth] = React.useState(0);

  React.useEffect(() => {
    const el = previewRef.current;
    if (!el) return;

    const update = () => {
      const m = measureContainer(el);
      setPreviewContentWidth(m.contentWidth || el.clientWidth);
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
    <div ref={previewRef} className="min-h-screen">
      {parents.map((parent, index) => (
        <ParentPreview
          key={parent.id}
          parent={parent}
          index={index}
          total={parents.length}
          screenSize={screenSize}
          previewContentWidth={previewContentWidth}
        />
      ))}
    </div>
  );
}
