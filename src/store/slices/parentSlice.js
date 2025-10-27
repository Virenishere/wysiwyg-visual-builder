import { deepClone } from '../storeUtils';
import { SCREEN_ORDER, initialLayout } from '@/utils/constants';
import { generateUniqueIds } from '../storeUtils';
import toast from 'react-hot-toast';

let nextParentId = 1;
let nextBoxId = 1;
let nextElementId = 1;

export const createParentSlice = (set, get) => ({
  parents: initialLayout.parents,
  addParent: (height) => {
    set((state) => {
      let maxParentId = 0;
      state.parents.forEach((p) => {
        maxParentId = Math.max(maxParentId, p.id || 0);
      });
      nextParentId = maxParentId + 1;
      const { screenSize } = state;
      return {
        parents: [
          ...state.parents,
          {
            id: nextParentId++,
            size: {
              height: { [screenSize]: height || 300 },
              background: { [screenSize]: '#f8f8f8' },
            },
            rnds: [],
          },
        ],
      };
    });
    toast.success('New section added!');
  },
  updateParent: (parentId, updates) =>
    set((state) => ({
      parents: state.parents.map((p) =>
        p.id === parentId ? { ...p, ...updates } : p
      ),
    })),
  removeParent: (parentId) => {
    set((state) => ({
      parents: state.parents.filter((p) => p.id !== parentId),
      selectedParentId:
        state.selectedParentId === parentId ? null : state.selectedParentId,
      selectedBoxId: null,
      selectedElementId: null,
    }));
    toast.success('Section removed.', { icon: '🗑️' });
  },
  updateParentSize: (parentId, sizeUpdates) =>
    set((state) => {
      const { screenSize } = state;
      const updatedParents = state.parents.map((p) => {
        if (p.id === parentId) {
          const newParent = deepClone(p);
          if (!newParent.size) newParent.size = {};
          for (const [key, value] of Object.entries(sizeUpdates)) {
            if (
              typeof newParent.size[key] !== 'object' ||
              newParent.size[key] === null ||
              Array.isArray(newParent.size[key])
            ) {
              newParent.size[key] = {};
            }
            newParent.size[key][screenSize] = value;
            const currIdx = SCREEN_ORDER.indexOf(screenSize);
            if (currIdx !== -1) {
              for (let i = currIdx + 1; i < SCREEN_ORDER.length; i++) {
                const s = SCREEN_ORDER[i];
                if (newParent.size[key][s] !== undefined) {
                  delete newParent.size[key][s];
                }
              }
            }
          }
          return newParent;
        }
        return p;
      });
      return { parents: updatedParents };
    }),
  duplicateParent: (parentId) => {
    set((state) => {
      const parentToDuplicate = state.parents.find((p) => p.id === parentId);
      if (!parentToDuplicate) return state;
      let maxParentId = 0;
      let maxBoxId = 0;
      let maxElementId = 0;
      state.parents.forEach((p) => {
        maxParentId = Math.max(maxParentId, p.id || 0);
        p.rnds?.forEach((r) => {
          maxBoxId = Math.max(maxBoxId, r.id || 0);
          r.elements?.forEach((e) => {
            maxElementId = Math.max(maxElementId, e.id || 0);
          });
        });
      });
      nextParentId = maxParentId + 1;
      nextBoxId = maxBoxId + 1;
      nextElementId = maxElementId + 1;
      const clonedParent = deepClone(parentToDuplicate);
      const { parents: processedParents, nextIds } = generateUniqueIds(
        { parents: [clonedParent] },
        {
          parentId: nextParentId,
          boxId: nextBoxId,
          elementId: nextElementId,
        }
      );
      nextParentId = nextIds.parentId;
      nextBoxId = nextIds.boxId;
      nextElementId = nextIds.elementId;
      return {
        parents: [...state.parents, ...processedParents],
      };
    });
    toast.success('Section duplicated!');
  },
});
