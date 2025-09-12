'use client';
import useDivStore from '@/store/UseDivStore';
import PositionSize from '../ElementPropertiesPanelSection/PositionSize';

export default function BoxPropertiesPanel() {
  const { parents, selectedParentId, selectedBoxId, updateRnd } = useDivStore();

  const selectedParent = parents.find((p) => p.id === selectedParentId);
  const selectedBox = selectedParent?.rnds.find(
    (box) => box.id === selectedBoxId
  );

  if (!selectedBox) {
    return null;
  }

  const handleUpdate = (updates) => {
    updateRnd(selectedParentId, selectedBoxId, updates);
  };

  return (
    <div className="relative p-6 mb-4 rounded-2xl border border-purple-200 shadow-xl bg-white/80 backdrop-blur-sm overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar">
      <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
        Box Properties
      </h3>
      <PositionSize
        selectedElement={selectedBox}
        updateElement={(pId, bId, eId, updates) => handleUpdate(updates)}
        parentId={selectedParentId}
        boxId={selectedBoxId}
        elementId={null}
      />
    </div>
  );
}