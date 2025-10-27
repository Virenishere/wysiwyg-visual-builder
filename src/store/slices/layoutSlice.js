// store/slices/layoutSlice.js
import { deepClone } from '../storeUtils';
import { SCREEN_ORDER, initialLayout } from '@/utils/constants';
import { cascadeCopyParentsFromScreen } from '@/utils/responsiveUtils';
import toast from 'react-hot-toast';

export const createLayoutSlice = (set, get) => ({
  layouts: {
    '4k': initialLayout,
    'l-laptop': initialLayout,
    laptop: initialLayout,
    tablet: initialLayout,
    mobile: initialLayout,
    'mobile-m': initialLayout,
    'mobile-s': initialLayout,
  },
  screenSize: '4k',
  setScreenSize: (screenSize) => {
    const { layouts, parents, screenSize: oldScreenSize } = get();
    const newLayouts = deepClone(layouts);
    newLayouts[oldScreenSize] = { parents: deepClone(parents) };

    let newParents = newLayouts[screenSize]?.parents;

    if (!newParents) {
      const currentScreenIndex = SCREEN_ORDER.indexOf(screenSize);
      for (let i = currentScreenIndex - 1; i >= 0; i--) {
        const fallbackScreen = SCREEN_ORDER[i];
        if (newLayouts[fallbackScreen]?.parents) {
          newParents = newLayouts[fallbackScreen]?.parents;
          break;
        }
      }
    }

    if (!newParents) {
      newParents = deepClone(parents);
    }

    set({
      screenSize,
      parents: newParents,
      layouts: newLayouts,
      selectedParentId: null,
      selectedBoxId: null,
      selectedElementId: null,
    });
  },
  copyCurrentScreenToAll: () => {
    set((state) => {
      const { parents, screenSize } = state;
      const updatedParents = cascadeCopyParentsFromScreen(
        parents,
        screenSize,
        'cascade'
      );
      const newLayouts = {};
      SCREEN_ORDER.forEach((size) => {
        newLayouts[size] = { parents: deepClone(updatedParents) };
      });
      toast.success(
        `Copied ${screenSize} changes to all smaller screens (cascade).`
      );
      return {
        parents: updatedParents,
        layouts: newLayouts,
      };
    });
  },
  saveState: () => {
    set((state) => {
      const { layouts, parents, screenSize } = state;
      const newLayouts = deepClone(layouts);
      newLayouts[screenSize] = { parents: deepClone(parents) };
      toast.success(`Saved layout for ${screenSize} screen.`);
      return {
        layouts: newLayouts,
      };
    });
  },
});
