'use client';
import useDivStore from '@/store/UseDivStore';

export default function SizeToaster() {
  const { parents, selectedParentId, selectedBoxId, isResizing } =
    useDivStore();

  if (!isResizing || !selectedBoxId || !selectedParentId) return null;

  const parent = parents.find((p) => p.id === selectedParentId);
  if (!parent) return null;

  const box = parent.rnds.find((b) => b.id === selectedBoxId);
  if (!box) return null;

  return (
    <div
      className="absolute bg-slate-800 rounded-lg px-2 py-1 text-xs text-white font-semibold"
      style={{
        left: box.x + box.width + 8,
        top: box.y + box.height - 20,
        pointerEvents: 'none',
      }}
    >
      <span className="mr-1">w:{box.width}</span>
      <span>h:{box.height}</span>
    </div>
  );
}
