import React, { useState, useRef, useEffect } from 'react';

export default function AlignIndicator({
  activeItem,
  allItems = [],
  containerBounds,
  tolerance = 2,
}) {
  const indicatorContainerRef = useRef(null);
  const [containerElement, setContainerElement] = useState(null);

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

    // Get active item bounds
    const activeLeft = activeItem.x;
    const activeRight = activeItem.x + activeItem.width;
    const activeCenterX = activeItem.x + activeItem.width / 2;
    const activeTop = activeItem.y;
    const activeBottom = activeItem.y + activeItem.height;
    const activeCenterY = activeItem.y + activeItem.height / 2;

    // Check alignment against other items
    allItems.forEach((item) => {
      if (item.id === activeItem.id) return;

      const itemLeft = item.x;
      const itemRight = item.x + item.width;
      const itemCenterX = item.x + item.width / 2;
      const itemTop = item.y;
      const itemBottom = item.y + item.height;
      const itemCenterY = item.y + item.height / 2;

      // Vertical alignment checks (left, right, center)
      if (Math.abs(activeLeft - itemLeft) < tolerance) {
        guides.vertical.push({
          x: activeLeft,
          type: 'left-left',
          minY: Math.min(activeTop, itemTop),
          maxY: Math.max(activeBottom, itemBottom),
        });
      }
      if (Math.abs(activeRight - itemRight) < tolerance) {
        guides.vertical.push({
          x: activeRight,
          type: 'right-right',
          minY: Math.min(activeTop, itemTop),
          maxY: Math.max(activeBottom, itemBottom),
        });
      }
      if (Math.abs(activeLeft - itemRight) < tolerance) {
        guides.vertical.push({
          x: activeLeft,
          type: 'left-right',
          minY: Math.min(activeTop, itemTop),
          maxY: Math.max(activeBottom, itemBottom),
        });
      }
      if (Math.abs(activeRight - itemLeft) < tolerance) {
        guides.vertical.push({
          x: activeRight,
          type: 'right-left',
          minY: Math.min(activeTop, itemTop),
          maxY: Math.max(activeBottom, itemBottom),
        });
      }
      if (Math.abs(activeCenterX - itemCenterX) < tolerance) {
        guides.vertical.push({
          x: activeCenterX,
          type: 'center-center',
          minY: Math.min(activeTop, itemTop),
          maxY: Math.max(activeBottom, itemBottom),
        });
      }

      // Horizontal alignment checks (top, bottom, center)
      if (Math.abs(activeTop - itemTop) < tolerance) {
        guides.horizontal.push({
          y: activeTop,
          type: 'top-top',
          minX: Math.min(activeLeft, itemLeft),
          maxX: Math.max(activeRight, itemRight),
        });
      }
      if (Math.abs(activeBottom - itemBottom) < tolerance) {
        guides.horizontal.push({
          y: activeBottom,
          type: 'bottom-bottom',
          minX: Math.min(activeLeft, itemLeft),
          maxX: Math.max(activeRight, itemRight),
        });
      }
      if (Math.abs(activeTop - itemBottom) < tolerance) {
        guides.horizontal.push({
          y: activeTop,
          type: 'top-bottom',
          minX: Math.min(activeLeft, itemLeft),
          maxX: Math.max(activeRight, itemRight),
        });
      }
      if (Math.abs(activeBottom - itemTop) < tolerance) {
        guides.horizontal.push({
          y: activeBottom,
          type: 'bottom-top',
          minX: Math.min(activeLeft, itemLeft),
          maxX: Math.max(activeRight, itemRight),
        });
      }
      if (Math.abs(activeCenterY - itemCenterY) < tolerance) {
        guides.horizontal.push({
          y: activeCenterY,
          type: 'center-center',
          minX: Math.min(activeLeft, itemLeft),
          maxX: Math.max(activeRight, itemRight),
        });
      }
    });

    // Remove duplicates and ensure guides stay within bounds
    guides.vertical = guides.vertical
      .filter(
        (guide, index, array) =>
          array.findIndex((g) => g.x === guide.x) === index &&
          guide.x >= bounds.x &&
          guide.x <= bounds.x + bounds.width
      )
      .map((guide) => ({
        ...guide,
        minY: Math.max(guide.minY, bounds.y),
        maxY: Math.min(guide.maxY, bounds.y + bounds.height),
      }));

    guides.horizontal = guides.horizontal
      .filter(
        (guide, index, array) =>
          array.findIndex((g) => g.y === guide.y) === index &&
          guide.y >= bounds.y &&
          guide.y <= bounds.y + bounds.height
      )
      .map((guide) => ({
        ...guide,
        minX: Math.max(guide.minX, bounds.x),
        maxX: Math.min(guide.maxX, bounds.x + bounds.width),
      }));

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
