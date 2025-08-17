import { create } from "zustand";

let nextParentId = 1;
let nextBoxId = 1;
let nextElementId = 1;

const useDivStore = create((set) => ({
  parents: [
    {
      id: nextParentId++,
      size: { height: 300, background: "#ffffff" },
      rnds: [{ 
        id: nextBoxId++, 
        width: 150, 
        height: 150, 
        x: 0, 
        y: 0,
        elements: [] // Array to store elements inside this RND
      }],
    },
  ],

  selectedParentId: null,
  selectedBoxId: null,
  selectedElementId: null,
  isResizing: false,

  // 📹 Parent actions
  addParent: () =>
    set((state) => ({
      parents: [
        ...state.parents,
        {
          id: nextParentId++,
          size: { height: 300, background: "#f8f8f8" },
          rnds: [],
        },
      ],
    })),

  updateParentSize: (parentId, size) =>
    set((state) => ({
      parents: state.parents.map((p) =>
        p.id === parentId ? { ...p, size: { ...p.size, ...size } } : p
      ),
    })),

  // 📹 RND actions inside a parent
  addRnd: (parentId) =>
    set((state) => ({
      parents: state.parents.map((p) =>
        p.id === parentId
          ? {
              ...p,
              rnds: [
                ...p.rnds,
                { 
                  id: nextBoxId++, 
                  width: 150, 
                  height: 150, 
                  x: 50, 
                  y: 50,
                  elements: []
                },
              ],
            }
          : p
      ),
    })),

  updateRnd: (parentId, boxId, updates) =>
    set((state) => ({
      parents: state.parents.map((p) =>
        p.id === parentId
          ? {
              ...p,
              rnds: p.rnds.map((box) =>
                box.id === boxId ? { ...box, ...updates } : box
              ),
            }
          : p
      ),
    })),

  removeRnd: (parentId, boxId) =>
    set((state) => ({
      parents: state.parents.map((p) =>
        p.id === parentId
          ? { ...p, rnds: p.rnds.filter((box) => box.id !== boxId) }
          : p
      ),
    })),

  // 📹 Element actions inside RND boxes
  addElement: (parentId, boxId, elementType) =>
    set((state) => ({
      parents: state.parents.map((p) =>
        p.id === parentId
          ? {
              ...p,
              rnds: p.rnds.map((box) =>
                box.id === boxId
                  ? {
                      ...box,
                      elements: [
                        ...box.elements,
                        {
                          id: nextElementId++,
                          type: elementType,
                          x: 10,
                          y: 10,
                          width: elementType === 'text' ? 100 : elementType === 'image' ? 80 : 120,
                          height: elementType === 'text' ? 30 : elementType === 'image' ? 80 : elementType === 'paragraph' ? 60 : 35,
                          content: elementType === 'text' ? 'Sample Text' : 
                                  elementType === 'paragraph' ? '<p>Sample paragraph content</p>' :
                                  elementType === 'button' ? 'Click Me' : '',
                          fontSize: elementType === 'text' ? 16 : 14,
                          fontFamily: 'Arial, sans-serif',
                          color: '#000000',
                          backgroundColor: elementType === 'button' ? '#007bff' : 'transparent',
                          margin: { top: 0, right: 0, bottom: 0, left: 0 },
                          padding: { top: 5, right: 10, bottom: 5, left: 10 },
                          borderRadius: elementType === 'button' ? 5 : 0,
                          border: 'none',
                          imageUrl: null,
                        },
                      ],
                    }
                  : box
              ),
            }
          : p
      ),
    })),

  updateElement: (parentId, boxId, elementId, updates) =>
    set((state) => ({
      parents: state.parents.map((p) =>
        p.id === parentId
          ? {
              ...p,
              rnds: p.rnds.map((box) =>
                box.id === boxId
                  ? {
                      ...box,
                      elements: box.elements.map((element) =>
                        element.id === elementId
                          ? { ...element, ...updates }
                          : element
                      ),
                    }
                  : box
              ),
            }
          : p
      ),
    })),

  removeElement: (parentId, boxId, elementId) =>
    set((state) => ({
      parents: state.parents.map((p) =>
        p.id === parentId
          ? {
              ...p,
              rnds: p.rnds.map((box) =>
                box.id === boxId
                  ? {
                      ...box,
                      elements: box.elements.filter((element) => element.id !== elementId),
                    }
                  : box
              ),
            }
          : p
      ),
    })),

  setSelectedParent: (id) => set({ selectedParentId: id }),
  setSelectedBox: (id) => set({ selectedBoxId: id }),
  setSelectedElement: (id) => set({ selectedElementId: id }),
  setIsResizing: (status) => set({ isResizing: status }),
}));

export default useDivStore;