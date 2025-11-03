import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import useDivStore from '@/store/UseDivStore';
import { SortableItem } from './SortableItem';

export default function ElementList({ parentId, box }) {
  const { updateRnd } = useDivStore();
  const elements = Array.isArray(box?.elements) ? box.elements : [];
  const elementIds = elements.map((el) => el.id);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = elements.findIndex((el) => el.id === active.id);
      const newIndex = elements.findIndex((el) => el.id === over.id);

      const reorderedElements = arrayMove(elements, oldIndex, newIndex);

      const elementsWithUpdatedZIndex = reorderedElements.map((el, index) => ({
        ...el,
        zIndex: index + 1,
      }));

      updateRnd(parentId, box.id, { elements: elementsWithUpdatedZIndex });
    }
  }

  return (
    <div className="mt-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        Elements in this box (Drag to reorder)
      </h4>

      {elements.length === 0 ? (
        <div className="text-xs text-gray-400 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-3 text-center">
          No elements yet — add one to get started.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={elementIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {elements.map((el) => (
                <SortableItem
                  key={el.id}
                  id={el.id}
                  element={el}
                  parentId={parentId}
                  box={box}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
