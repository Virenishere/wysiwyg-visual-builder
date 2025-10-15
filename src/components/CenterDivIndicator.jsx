import React, { useState, useRef, useEffect } from 'react';
import useDivStore from '@/store/UseDivStore';
import { getResponsiveValue } from '@/utils/screen';

export default function CenterDivIndicator({ activeBox, containerBounds }) {
  const indicatorContainerRef = useRef(null);
  const screenSize = useDivStore((state) => state.screenSize);

  if (!activeBox || !containerBounds) {
    return null;
  }

  const boxRect = {
    width: parseInt(getResponsiveValue(activeBox.width, screenSize), 10) || 150,
    height:
      parseInt(getResponsiveValue(activeBox.height, screenSize), 10) || 150,
    x: parseInt(getResponsiveValue(activeBox.x, screenSize), 10) || 0,
    y: parseInt(getResponsiveValue(activeBox.y, screenSize), 10) || 0,
  };

  const containerCenter = {
    x: containerBounds.width / 2,
    y: containerBounds.height / 2,
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
      style={{ zIndex: 100, ...containerBounds }}
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
