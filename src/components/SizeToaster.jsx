'use client';
import useDivStore from '@/store/UseDivStore';

export default function SizeToaster() {
  const { parents, selectedParentId, selectedBoxId, selectedElementId, isResizing } =
    useDivStore();

  if (!isResizing || !selectedParentId) return null;

  const parent = parents.find((p) => p.id === selectedParentId);
  if (!parent) return null;

  // If an element is selected → show element size
  if (selectedElementId && selectedBoxId) {
    const box = parent.rnds.find((b) => b.id === selectedBoxId);
    if (!box) return null;

    const element = box.elements.find((e) => e.id === selectedElementId);
    if (!element) return null;

    return (
      <div
        className="absolute bg-slate-800 rounded-lg px-2 py-1 text-xs text-white font-semibold"
        style={{
          left: box.x + element.x + element.width + 8,
          top: box.y + element.y + element.height - 20,
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        <span className="mr-1">w:{Math.round(element.width)}</span>
        <span>h:{Math.round(element.height)}</span>
      </div>
    );
  }

  // Otherwise → show box size
  if (selectedBoxId) {
    const box = parent.rnds.find((b) => b.id === selectedBoxId);
    if (!box) return null;

    return (
      <div
        className="absolute bg-slate-800 rounded-lg px-2 py-1 text-xs text-white font-semibold"
        style={{
          left: box.x + box.width + 8,
          top: box.y + box.height - 20,
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        <span className="mr-1">w:{Math.round(box.width)}</span>
        <span>h:{Math.round(box.height)}</span>
      </div>
    );
  }

  return null;
}
