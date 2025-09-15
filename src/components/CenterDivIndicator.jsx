import React, { useState, useRef, useEffect } from 'react';

export default function CenterDivIndicator({ activeBox }) {
  const indicatorContainerRef = useRef(null);
  const [parentElement, setParentElement] = useState(null);

  useEffect(() => {
    if (indicatorContainerRef.current) {
      setParentElement(indicatorContainerRef.current.parentElement);
    }
  }, []);

  if (!activeBox || !parentElement) {
    return null;
  }

  const boxRect = {
    width: activeBox.width,
    height: activeBox.height,
    x: activeBox.x,
    y: activeBox.y,
  };

  const parentCenter = {
    x: parentElement.clientWidth / 2,
    y: parentElement.clientHeight / 2,
  };

  const boxCenter = {
    x: boxRect.x + boxRect.width / 2,
    y: boxRect.y + boxRect.height / 2,
  };

  const isCenteredHorizontally = Math.abs(boxCenter.x - parentCenter.x) < 2;
  const isCenteredVertically = Math.abs(boxCenter.y - parentCenter.y) < 2;

  return (
    <div
      ref={indicatorContainerRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 100 }}
    >
      {isCenteredHorizontally && (
        <div
          className="absolute top-0 h-full border-l-2 border-dotted border-blue-500"
          style={{ left: `${parentCenter.x}px` }}
        />
      )}
      {isCenteredVertically && (
        <div
          className="absolute left-0 w-full border-t-2 border-dotted border-blue-500"
          style={{ top: `${parentCenter.y}px` }}
        />
      )}
    </div>
  );
}
