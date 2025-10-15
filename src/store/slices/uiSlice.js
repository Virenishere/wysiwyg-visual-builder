// store/slices/uiSlice.js
import toast from 'react-hot-toast';

export const createUISlice = (set, get) => ({
  isResizing: false,
  previewingImage: null,
  leftPanel: null,
  activeDragItem: null,
  setIsResizing: (status) => set({ isResizing: status }),
  setPreviewingImage: (imageUrl) => set({ previewingImage: imageUrl }),
  setLeftPanel: (panel) => set({ leftPanel: panel }),
  setActiveDragItem: (item) => set({ activeDragItem: item }),
  removeAllImageElements: () => {
    set((state) => ({
      parents: state.parents.map((parent) => ({
        ...parent,
        rnds: parent.rnds.map((rnd) => ({
          ...rnd,
          elements: rnd.elements.filter((element) => element.type !== 'image'),
        })),
      })),
    }));
    toast.success('All image elements have been removed.', { icon: '🗑️' });
  },
});
