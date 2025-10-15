import { getResponsiveValue } from '@/utils/screen';
import { generateUniqueIds, responsiveUpdater, deepClone } from '../storeUtils';
import toast from 'react-hot-toast';

let nextBoxId = 1;
let nextElementId = 1;

export const createBoxSlice = (set, get) => ({
  addRnd: (parentId) => {
    const newBoxId = nextBoxId++;
    set((state) => {
      const { screenSize } = state;
      return {
        parents: state.parents.map((p) =>
          p.id === parentId
            ? {
                ...p,
                rnds: [
                  ...p.rnds,
                  {
                    id: newBoxId,
                    width: { [screenSize]: 150 },
                    height: { [screenSize]: 150 },
                    x: { [screenSize]: 50 },
                    y: { [screenSize]: 50 },
                    elements: [],
                    customHTML: '',
                    customCss: '',
                  },
                ],
              }
            : p
        ),
        selectedBoxId: newBoxId,
        leftPanel: null,
      };
    });
    toast.success('New div box added!');
  },
  updateRnd: (parentId, boxId, updates) => {
    set((state) => {
      const newParents = state.parents.map((p) =>
        p.id === parentId
          ? {
              ...p,
              rnds: p.rnds.map((box) =>
                box.id === boxId
                  ? responsiveUpdater(box, updates, state.screenSize)
                  : box
              ),
            }
          : p
      );
      return {
        parents: newParents,
      };
    });
  },
  removeRnd: (parentId, boxId) => {
    set((state) => ({
      parents: state.parents.map((p) =>
        p.id === parentId
          ? { ...p, rnds: p.rnds.filter((box) => box.id !== boxId) }
          : p
      ),
      selectedBoxId: state.selectedBoxId === boxId ? null : state.selectedBoxId,
      selectedElementId: null,
    }));
    toast.success('Div box removed.', { icon: '🗑️' });
  },
  updateRndCustomCode: (parentId, boxId, customCode) => {
    set((state) => {
      const newParents = state.parents.map((p) =>
        p.id === parentId
          ? {
              ...p,
              rnds: p.rnds.map((box) =>
                box.id === boxId ? { ...box, ...customCode } : box
              ),
            }
          : p
      );
      return {
        parents: newParents,
      };
    });
    toast.success('Custom code updated!');
  },
  duplicateRnd: (parentId, boxId) => {
    set((state) => {
      const newBoxId = nextBoxId++;
      const { screenSize } = state;
      const parents = state.parents.map((p) => {
        if (p.id === parentId) {
          const rndToDuplicate = p.rnds.find((rnd) => rnd.id === boxId);
          if (rndToDuplicate) {
            const newRnd = deepClone(rndToDuplicate);
            newRnd.id = newBoxId;
            const currentX = parseInt(
              getResponsiveValue(rndToDuplicate.x, screenSize),
              10
            );
            const currentY = parseInt(
              getResponsiveValue(rndToDuplicate.y, screenSize),
              10
            );
            if (typeof newRnd.x === 'object') {
              newRnd.x[screenSize] = currentX + 20;
            } else {
              newRnd.x = { [screenSize]: currentX + 20 };
            }
            if (typeof newRnd.y === 'object') {
              newRnd.y[screenSize] = currentY + 20;
            } else {
              newRnd.y = { [screenSize]: currentY + 20 };
            }
            const { elements, nextIds } = generateUniqueIds(
              { elements: newRnd.elements },
              { elementId: nextElementId }
            );
            newRnd.elements = elements;
            nextElementId = nextIds.elementId;
            return { ...p, rnds: [...p.rnds, newRnd] };
          }
        }
        return p;
      });
      return { parents };
    });
    toast.success('Div box duplicated!');
  },
  centerBox: (parentId, boxId) => {
    set((state) => {
      const parent = state.parents.find((p) => p.id === parentId);
      const box = parent?.rnds.find((b) => b.id === boxId);
      if (!box || !parent) return state;
      const sectionHeight =
        parseInt(
          getResponsiveValue(parent.size?.height, state.screenSize),
          10
        ) || 300;
      const sectionElement = document.querySelector(`[data-id="${parentId}"]`);
      const sectionWidth = sectionElement
        ? sectionElement.clientWidth - 20
        : 800;
      const boxWidth = getResponsiveValue(box.width, state.screenSize) || 150;
      const centerX = Math.max(0, (sectionWidth - boxWidth) / 2);
      const centerY = Math.max(0, (sectionHeight - boxHeight) / 2);
      const updates = {
        x: centerX,
        y: centerY,
      };
      return {
        parents: state.parents.map((p) =>
          p.id === parentId
            ? {
                ...p,
                rnds: p.rnds.map((rnd) =>
                  rnd.id === boxId
                    ? responsiveUpdater(rnd, updates, state.screenSize)
                    : rnd
                ),
              }
            : p
        ),
      };
    });
    toast.success('Box centered!');
  },
});
