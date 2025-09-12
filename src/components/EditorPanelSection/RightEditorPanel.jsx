'use client';
import useDivStore from '@/store/UseDivStore';
import ElementPropertiesPanel from '../ElementPropertiesPanel';
import BoxPropertiesPanel from './BoxPropertiesPanel';

export default function RightEditorPanel() {
  const { selectedElementId, selectedBoxId } = useDivStore();

  return (
    <div>
      {selectedBoxId && !selectedElementId ? <BoxPropertiesPanel /> : <ElementPropertiesPanel />}
    </div>
  );
}
