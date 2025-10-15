// store/UseDivStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { deepClone } from './storeUtils';
import { createLayoutSlice } from './slices/layoutSlice';
import { createParentSlice } from './slices/parentSlice';
import { createBoxSlice } from './slices/boxSlice';
import { createElementSlice } from './slices/elementSlice';
import { createSelectionSlice } from './slices/selectionSlice';
import { createTemplateSlice } from './slices/templateSlice';
import { createUISlice } from './slices/uiSlice';
import { createContainerSlice } from './slices/containerSlice';
import { initialLayout } from '@/utils/constants';

const useDivStore = create(
  persist(
    (set, get) => ({
      ...createLayoutSlice(set, get),
      ...createParentSlice(set, get),
      ...createBoxSlice(set, get),
      ...createElementSlice(set, get),
      ...createSelectionSlice(set, get),
      ...createTemplateSlice(set, get),
      ...createUISlice(set, get),
      ...createContainerSlice(set, get),
    }),
    {
      name: 'div-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        layouts: state.layouts,
        parents: state.parents,
      }),
    }
  )
);

export default useDivStore;

export const findElementLocation = (parents, elementId) => {
  for (const parent of parents) {
    for (const box of parent.rnds) {
      if (box.elements.some((el) => el.id === elementId)) {
        return { parentId: parent.id, boxId: box.id };
      }
    }
  }
  return null;
};
