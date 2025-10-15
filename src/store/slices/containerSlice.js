// store/slices/containerSlice.js
export const createContainerSlice = (set, get) => ({
  editorContainerWidth: null,
  previewContainerWidth: null,
  setEditorContainerWidth: (width) => set({ editorContainerWidth: width }),
  setPreviewContainerWidth: (width) => set({ previewContainerWidth: width }),
});
