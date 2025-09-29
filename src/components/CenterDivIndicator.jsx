import React, { useState, useRef, useEffect } from 'react';
import useDivStore from '@/store/UseDivStore';
import { getResponsiveValue } from '@/utils/screen';

export default function CenterDivIndicator({ activeBox, containerBounds }) {
  const indicatorContainerRef = useRef(null);
  const [containerElement, setContainerElement] = useState(null);
  const screenSize = useDivStore((state) => state.screenSize);

  useEffect(() => {
    if (indicatorContainerRef.current) {
      setContainerElement(indicatorContainerRef.current.parentElement);
    }
  }, []);

  if (!activeBox || (!containerElement && !containerBounds)) {
    return null;
  }

  // use containerBounds if provide, otherwise use the container element
  const bounds = containerBounds || {
    width: containerElement.clientWidth,
    height: containerElement.clientHeight,
    x: 0,
    y: 0,
  };

  const boxRect = {
    width: getResponsiveValue(activeBox.width, screenSize),
    height: getResponsiveValue(activeBox.height, screenSize),
    x: getResponsiveValue(activeBox.x, screenSize),
    y: getResponsiveValue(activeBox.y, screenSize),
  };

  const containerCenter = {
    x: bounds.width / 2,
    y: bounds.height / 2,
  };

  const boxCenter = {
    x: boxRect.x + boxRect.width / 2,
    y: boxRect.y + boxRect.height / 2,
  };

  // tolerance for centering detection
  const tolerance = 3;
  const isCenteredHorizontally =
    Math.abs(boxCenter.x - containerCenter.x) < tolerance;
  const isCenteredVertically =
    Math.abs(boxCenter.y - containerCenter.y) < tolerance;

  return (
    <div
      ref={indicatorContainerRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 100 }}
    >
      {/* Vertical center line */}
      {isCenteredHorizontally && (
        <div
          className="absolute top-0 h-full border-l-2 border-dotted border-red-500"
          style={{
            left: `${containerCenter.x}px`,
            top: '0px',
            height: '100%',
          }}
        />
      )}

      {/* Horizontal center line */}
      {isCenteredVertically && (
        <div
          className="absolute left-0 w-full border-t-2 border-dotted border-red-500"
          style={{
            top: `${containerCenter.y}px`,
            left: '0px',
            width: '100%',
          }}
        />
      )}
    </div>
  );
}
