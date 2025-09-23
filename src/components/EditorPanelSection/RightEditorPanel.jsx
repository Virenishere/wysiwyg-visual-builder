'use client';
import useDivStore from '@/store/UseDivStore';
import ElementPropertiesPanel from '../ElementPropertiesPanel';
import BoxPropertiesPanel from './BoxPropertiesPanel';
import SectionPropertiesPanel from '../SectionPropertiesPanel'; // Import the new component

export default function RightEditorPanel() {
  const { selectedElementId, selectedBoxId, selectedParentId } = useDivStore();

  return (
    <div>
      {(() => {
        if (selectedElementId) {
          return <ElementPropertiesPanel />;
        } else if (selectedBoxId) {
          return <BoxPropertiesPanel />;
        } else if (selectedParentId) {
          return <SectionPropertiesPanel />;
        } else {
          return null; // Or some default view
        }
      })()}
    </div>
  );
}
