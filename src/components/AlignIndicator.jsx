import React, { useState, useRef, useEffect } from 'react';
import useDivStore from '@/store/UseDivStore';
import { getResponsiveValue } from '@/utils/screen';

export default function AlignIndicator({
  activeItem,
  allItems = [],
  containerBounds,
  tolerance = 0,
}) {
  const indicatorContainerRef = useRef(null);
  const [containerElement, setContainerElement] = useState(null);
  const screenSize = useDivStore((state) => state.screenSize);

  useEffect(() => {
    if (indicatorContainerRef.current) {
      setContainerElement(indicatorContainerRef.current.parentElement);
    }
  }, []);

  if (
    !activeItem ||
    (!containerElement && !containerBounds) ||
    allItems.length === 0
  ) {
    return null;
  }

  // Use containerBounds if provided, otherwise use the container element
  const bounds = containerBounds || {
    width: containerElement.clientWidth,
    height: containerElement.clientHeight,
    x: 0,
    y: 0,
  };

  const generateAlignmentGuides = () => {
    const guides = { vertical: [], horizontal: [] };

    const activeWidth =
      parseInt(getResponsiveValue(activeItem.width, screenSize), 10) || 150;
    const activeHeight =
      parseInt(getResponsiveValue(activeItem.height, screenSize), 10) || 150;
    const activeLeft =
      parseInt(getResponsiveValue(activeItem.x, screenSize), 10) || 0;
    const activeRight = activeLeft + activeWidth;
    const activeCenterX = activeLeft + activeWidth / 2;
    const activeTop =
      parseInt(getResponsiveValue(activeItem.y, screenSize), 10) || 0;
    const activeBottom = activeTop + activeHeight;
    const activeCenterY = activeTop + activeHeight / 2;

    const verticalGuides = new Map();
    const horizontalGuides = new Map();

    allItems.forEach((item) => {
      if (item.id === activeItem.id) return;

      const itemWidth =
        parseInt(getResponsiveValue(item.width, screenSize), 10) || 150;
      const itemHeight =
        parseInt(getResponsiveValue(item.height, screenSize), 10) || 150;
      const itemLeft =
        parseInt(getResponsiveValue(item.x, screenSize), 10) || 0;
      const itemRight = itemLeft + itemWidth;
      const itemCenterX = itemLeft + itemWidth / 2;
      const itemTop = parseInt(getResponsiveValue(item.y, screenSize), 10) || 0;
      const itemBottom = itemTop + itemHeight;
      const itemCenterY = itemTop + itemHeight / 2;

      // Vertical alignment
      if (Math.abs(activeLeft - itemLeft) <= tolerance) {
        verticalGuides.set(activeLeft, {
          x: activeLeft,
          minY: Math.min(activeTop, itemTop),
          maxY: Math.max(activeBottom, itemBottom),
        });
      }
      if (Math.abs(activeRight - itemRight) <= tolerance) {
        verticalGuides.set(activeRight, {
          x: activeRight,
          minY: Math.min(activeTop, itemTop),
          maxY: Math.max(activeBottom, itemBottom),
        });
      }
      if (Math.abs(activeCenterX - itemCenterX) <= tolerance) {
        verticalGuides.set(activeCenterX, {
          x: activeCenterX,
          minY: Math.min(activeTop, itemTop),
          maxY: Math.max(activeBottom, itemBottom),
        });
      }

      // Horizontal alignment
      if (Math.abs(activeTop - itemTop) <= tolerance) {
        horizontalGuides.set(activeTop, {
          y: activeTop,
          minX: Math.min(activeLeft, itemLeft),
          maxX: Math.max(activeRight, itemRight),
        });
      }
      if (Math.abs(activeBottom - itemBottom) <= tolerance) {
        horizontalGuides.set(activeBottom, {
          y: activeBottom,
          minX: Math.min(activeLeft, itemLeft),
          maxX: Math.max(activeRight, itemRight),
        });
      }
      if (Math.abs(activeCenterY - itemCenterY) <= tolerance) {
        horizontalGuides.set(activeCenterY, {
          y: activeCenterY,
          minX: Math.min(activeLeft, itemLeft),
          maxX: Math.max(activeRight, itemRight),
        });
      }
    });

    guides.vertical = Array.from(verticalGuides.values());
    guides.horizontal = Array.from(horizontalGuides.values());

    return guides;
  };

  const guides = generateAlignmentGuides();

  return (
    <div
      ref={indicatorContainerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 99 }}
    >
      {/* Vertical guides */}
      {guides.vertical.map((guide, index) => (
        <div
          key={`v-${index}`}
          className="absolute border-l-2 border-dotted border-red-500"
          style={{
            left: `${guide.x}px`,
            top: `${guide.minY}px`,
            height: `${guide.maxY - guide.minY}px`,
          }}
        />
      ))}

      {/* Horizontal guides */}
      {guides.horizontal.map((guide, index) => (
        <div
          key={`h-${index}`}
          className="absolute border-t-2 border-dotted border-red-500"
          style={{
            top: `${guide.y}px`,
            left: `${guide.minX}px`,
            width: `${guide.maxX - guide.minX}px`,
          }}
        />
      ))}
    </div>
  );
}
