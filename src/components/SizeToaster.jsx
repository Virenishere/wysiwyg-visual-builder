'use client';
import useDivStore from '@/store/UseDivStore';
import { getResponsiveValue } from '@/utils/screen';

export default function SizeToaster() {
  const { activeDragItem, isResizing, screenSize } = useDivStore();

  if (!isResizing || !activeDragItem) return null;

  const { x, y, width, height, isElement } = activeDragItem;

  const displayX = parseInt(getResponsiveValue(x, screenSize), 10);
  const displayY = parseInt(getResponsiveValue(y, screenSize), 10);
  const displayWidth = parseInt(getResponsiveValue(width, screenSize), 10);
  const displayHeight = parseInt(getResponsiveValue(height, screenSize), 10);

  return (
    <div
      className="absolute bg-slate-800 rounded-lg px-2 py-1 text-xs text-white font-semibold"
      style={{
        left: displayX + displayWidth + 8,
        top: displayY + displayHeight - 20,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <span className="mr-1">w:{Math.round(displayWidth)}</span>
      <span>h:{Math.round(displayHeight)}</span>
    </div>
  );
}
