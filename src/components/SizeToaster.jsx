'use client';
import useDivStore from '@/store/UseDivStore';
import { getResponsiveValue } from '@/utils/screen';

export default function SizeToaster() {
  const {
    parents,
    selectedParentId,
    selectedBoxId,
    selectedElementId,
    isResizing,
    screenSize,
  } = useDivStore();

  if (!isResizing || !selectedParentId) return null;

  const parent = parents.find((p) => p.id === selectedParentId);
  if (!parent) return null;

  // If an element is selected → show element size
  if (selectedElementId && selectedBoxId) {
    const box = parent.rnds.find((b) => b.id === selectedBoxId);
    if (!box) return null;

    const element = box.elements.find((e) => e.id === selectedElementId);
    if (!element) return null;

    const boxX = parseInt(getResponsiveValue(box.x, screenSize), 10);
    const boxY = parseInt(getResponsiveValue(box.y, screenSize), 10);
    const elementX = parseInt(getResponsiveValue(element.x, screenSize), 10);
    const elementY = parseInt(getResponsiveValue(element.y, screenSize), 10);
    const elementWidth = parseInt(
      getResponsiveValue(element.width, screenSize),
      10
    );
    const elementHeight = parseInt(
      getResponsiveValue(element.height, screenSize),
      10
    );

    return (
      <div
        className="absolute bg-slate-800 rounded-lg px-2 py-1 text-xs text-white font-semibold"
        style={{
          left: boxX + elementX + elementWidth + 8,
          top: boxY + elementY + elementHeight - 20,
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        <span className="mr-1">w:{Math.round(elementWidth)}</span>
        <span>h:{Math.round(elementHeight)}</span>
      </div>
    );
  }

  // Otherwise → show box size
  if (selectedBoxId) {
    const box = parent.rnds.find((b) => b.id === selectedBoxId);
    if (!box) return null;

    const boxX = parseInt(getResponsiveValue(box.x, screenSize), 10);
    const boxY = parseInt(getResponsiveValue(box.y, screenSize), 10);
    const boxWidth = parseInt(getResponsiveValue(box.width, screenSize), 10);
    const boxHeight = parseInt(getResponsiveValue(box.height, screenSize), 10);

    return (
      <div
        className="absolute bg-slate-800 rounded-lg px-2 py-1 text-xs text-white font-semibold"
        style={{
          left: boxX + boxWidth + 8,
          top: boxY + boxHeight - 20,
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        <span className="mr-1">w:{Math.round(boxWidth)}</span>
        <span>h:{Math.round(boxHeight)}</span>
      </div>
    );
  }

  return null;
}
