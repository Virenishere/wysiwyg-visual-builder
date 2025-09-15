import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

export default function AlignIndicator() {
  const [box1, setBox1] = useState({ x: 50, y: 50, width: 100, height: 100 });
  const [box2, setBox2] = useState({ x: 250, y: 150, width: 100, height: 100 });

  const [guides, setGuides] = useState({ v: [], h: [] });

  const checkAlignment = (moving, other) => {
    const movingLeft = moving.x;
    const movingRight = moving.x + moving.width;
    const movingTop = moving.y;
    const movingBottom = moving.y + moving.height;

    const otherLeft = other.x;
    const otherRight = other.x + other.width;
    const otherTop = other.y;
    const otherBottom = other.y + other.height;

    let newGuides = { v: [], h: [] };

    // vertical alignment (left/right)
    if (Math.abs(movingLeft - otherLeft) < 1) {
      newGuides.v.push({ x: movingLeft, type: 'left' });
    }
    if (Math.abs(movingRight - otherRight) < 1) {
      newGuides.v.push({ x: movingRight, type: 'right' });
    }

    // horizontal alignment (top/bottom)
    if (Math.abs(movingTop - otherTop) < 1) {
      newGuides.h.push({ y: movingTop, type: 'top' });
    }
    if (Math.abs(movingBottom - otherBottom) < 1) {
      newGuides.h.push({ y: movingBottom, type: 'bottom' });
    }

    setGuides(newGuides);
  };

  return (
    <div className="relative w-full h-full bg-gray-100">
      {/* Vertical guides (left & right) */}
      {guides.v.map((g, i) => (
        <div
          key={`v-${i}`}
          className="absolute top-0 h-full border-l-2 border-dotted border-opacity-50 border-blue-500 pointer-events-none"
          style={{ left: g.x }}
        />
      ))}

      {/* Horizontal guides (top & bottom) */}
      {guides.h.map((g, i) => (
        <div
          key={`h-${i}`}
          className="absolute left-0 w-full border-t-2 border-dashed border-opacity-50 border-blue-500 pointer-events-none"
          style={{ top: g.y }}
        />
      ))}

      {/* Box 1 */}
      <Rnd
        size={{ width: box1.width, height: box1.height }}
        position={{ x: box1.x, y: box1.y }}
        onDragStop={(e, d) => setBox1((prev) => ({ ...prev, x: d.x, y: d.y }))}
        onDrag={(e, d) => checkAlignment({ ...box1, x: d.x, y: d.y }, box2)}
        onResizeStop={(e, dir, ref, delta, pos) => {
          setBox1({
            x: pos.x,
            y: pos.y,
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
          });
        }}
        className="bg-white border border-gray-400 shadow-md"
      />

      {/* Box 2 */}
      <Rnd
        size={{ width: box2.width, height: box2.height }}
        position={{ x: box2.x, y: box2.y }}
        onDragStop={(e, d) => setBox2((prev) => ({ ...prev, x: d.x, y: d.y }))}
        onDrag={(e, d) => checkAlignment({ ...box2, x: d.x, y: d.y }, box1)}
        onResizeStop={(e, dir, ref, delta, pos) => {
          setBox2({
            x: pos.x,
            y: pos.y,
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
          });
        }}
        className="bg-white border border-gray-400 shadow-md"
      />
    </div>
  );
}
