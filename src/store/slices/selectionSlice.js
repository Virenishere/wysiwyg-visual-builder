// store/slices/selectionSlice.js
export const createSelectionSlice = (set, get) => ({
  selectedParentId: null,
  selectedBoxId: null,
  selectedElementId: null,
  setSelectedParent: (id) => set({ selectedParentId: id }),
  setSelectedBox: (id) => set({ selectedBoxId: id }),
  setSelectedElement: (id) => set({ selectedElementId: id }),
  getSelectedParent: () => {
    const state = get();
    return state.parents.find((p) => p.id === state.selectedParentId) || null;
  },
  getSelectedBox: () => {
    const state = get();
    const parent = state.parents.find((p) => p.id === state.selectedParentId);
    return parent?.rnds.find((box) => box.id === state.selectedBoxId) || null;
  },
  getSelectedElement: () => {
    const state = get();
    const parent = state.parents.find((p) => p.id === state.selectedParentId);
    const box = parent?.rnds.find((box) => box.id === state.selectedBoxId);
    return (
      box?.elements?.find(
        (element) => element.id === state.selectedElementId
      ) || null
    );
  },
});
