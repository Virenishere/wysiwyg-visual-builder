// store/UseDivStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getTemplateById } from '@/templates';
import { generateUniqueIds, deepClone } from './storeUtils';

let nextParentId = 1;
let nextBoxId = 1;
let nextElementId = 1;

const useDivStore = create(
  persist(
    (set, get) => ({
      // State
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
            elements: []
          }],
        },
      ],
      selectedParentId: null,
      selectedBoxId: null,
      selectedElementId: null,
      isResizing: false,

      // Template Actions
      loadTemplate: (templateId) =>
        set((state) => {
          const template = getTemplateById(templateId);
          if (!template) {
            console.error('Template not found:', templateId);
            return state;
          }

          // Deep clone to avoid reference issues
          const templateCopy = deepClone(template);

          // Generate unique IDs for the template
          const { parents: processedParents } = generateUniqueIds(templateCopy, {
            parentId: nextParentId,
            boxId: nextBoxId,
            elementId: nextElementId
          });

          // Update the next ID counters
          let maxParentId = 0;
          let maxBoxId = 0;
          let maxElementId = 0;

          processedParents.forEach(parent => {
            maxParentId = Math.max(maxParentId, parent.id);
            parent.rnds.forEach(rnd => {
              maxBoxId = Math.max(maxBoxId, rnd.id);
              rnd.elements.forEach(element => {
                maxElementId = Math.max(maxElementId, element.id);
              });
            });
          });

          nextParentId = maxParentId + 1;
          nextBoxId = maxBoxId + 1;
          nextElementId = maxElementId + 1;

          return {
            parents: processedParents,
            selectedParentId: null,
            selectedBoxId: null,
            selectedElementId: null,
          };
        }),

      // Reset to default
      resetToDefault: () =>
        set(() => {
          // Reset ID counters
          nextParentId = 1;
          nextBoxId = 1;
          nextElementId = 1;

          return {
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
                  elements: []
                }],
              },
            ],
            selectedParentId: null,
            selectedBoxId: null,
            selectedElementId: null,
          };
        }),

      // Parent actions
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

      removeParent: (parentId) =>
        set((state) => ({
          parents: state.parents.filter(p => p.id !== parentId),
          selectedParentId: state.selectedParentId === parentId ? null : state.selectedParentId,
          selectedBoxId: null,
          selectedElementId: null,
        })),

      updateParentSize: (parentId, size) =>
        set((state) => ({
          parents: state.parents.map((p) =>
            p.id === parentId ? { ...p, size: { ...p.size, ...size } } : p
          ),
        })),

      // RND actions inside a parent
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
          selectedBoxId: state.selectedBoxId === boxId ? null : state.selectedBoxId,
          selectedElementId: null,
        })),

      // Element actions inside RND boxes
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
                              color: elementType === 'button' ? '#ffffff' : '#000000',
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
          selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId,
        })),

      // Duplicate actions
      duplicateParent: (parentId) =>
        set((state) => {
          const parentToDuplicate = state.parents.find(p => p.id === parentId);
          if (!parentToDuplicate) return state;

          const duplicatedParent = {
            ...parentToDuplicate,
            id: nextParentId++,
            rnds: parentToDuplicate.rnds.map(rnd => ({
              ...rnd,
              id: nextBoxId++,
              elements: rnd.elements.map(element => ({
                ...element,
                id: nextElementId++
              }))
            }))
          };

          return {
            parents: [...state.parents, duplicatedParent]
          };
        }),

      duplicateRnd: (parentId, boxId) =>
        set((state) => ({
          parents: state.parents.map(p =>
            p.id === parentId
              ? {
                  ...p,
                  rnds: p.rnds.reduce((acc, box) => {
                    acc.push(box);
                    if (box.id === boxId) {
                      acc.push({
                        ...box,
                        id: nextBoxId++,
                        x: box.x + 20,
                        y: box.y + 20,
                        elements: box.elements.map(element => ({
                          ...element,
                          id: nextElementId++
                        }))
                      });
                    }
                    return acc;
                  }, [])
                }
              : p
          )
        })),

      duplicateElement: (parentId, boxId, elementId) =>
        set((state) => ({
          parents: state.parents.map(p =>
            p.id === parentId
              ? {
                  ...p,
                  rnds: p.rnds.map(box =>
                    box.id === boxId
                      ? {
                          ...box,
                          elements: box.elements.reduce((acc, element) => {
                            acc.push(element);
                            if (element.id === elementId) {
                              acc.push({
                                ...element,
                                id: nextElementId++,
                                x: element.x + 10,
                                y: element.y + 10
                              });
                            }
                            return acc;
                          }, [])
                        }
                      : box
                  )
                }
              : p
          )
        })),

      // Selection actions
      setSelectedParent: (id) => set({ selectedParentId: id }),
      setSelectedBox: (id) => set({ selectedBoxId: id }),
      setSelectedElement: (id) => set({ selectedElementId: id }),
      setIsResizing: (status) => set({ isResizing: status }),

      // Utility actions
      exportData: () => {
        const state = get();
        return {
          parents: state.parents,
          version: '1.0.0',
          exportDate: new Date().toISOString()
        };
      },

      importData: (data) => {
        if (!data || !data.parents) {
          console.error('Invalid import data');
          return;
        }

        // Deep clone and generate unique IDs
        const dataCopy = deepClone(data);
        const { parents: processedParents } = generateUniqueIds(dataCopy, {
          parentId: nextParentId,
          boxId: nextBoxId,
          elementId: nextElementId
        });

        // Update the next ID counters
        let maxParentId = 0;
        let maxBoxId = 0;
        let maxElementId = 0;

        processedParents.forEach(parent => {
          maxParentId = Math.max(maxParentId, parent.id);
          parent.rnds.forEach(rnd => {
            maxBoxId = Math.max(maxBoxId, rnd.id);
            rnd.elements.forEach(element => {
              maxElementId = Math.max(maxElementId, element.id);
            });
          });
        });

        nextParentId = maxParentId + 1;
        nextBoxId = maxBoxId + 1;
        nextElementId = maxElementId + 1;

        set({
          parents: processedParents,
          selectedParentId: null,
          selectedBoxId: null,
          selectedElementId: null,
        });
      },

      // Get computed values
      getSelectedParent: () => {
        const state = get();
        return state.parents.find(p => p.id === state.selectedParentId) || null;
      },

      getSelectedBox: () => {
        const state = get();
        const parent = state.parents.find(p => p.id === state.selectedParentId);
        return parent?.rnds.find(box => box.id === state.selectedBoxId) || null;
      },

      getSelectedElement: () => {
        const state = get();
        const parent = state.parents.find(p => p.id === state.selectedParentId);
        const box = parent?.rnds.find(box => box.id === state.selectedBoxId);
        return box?.elements?.find(element => element.id === state.selectedElementId) || null;
      },
    }),
    {
      name: 'div-store',
      storage: createJSONStorage(() => localStorage),
      // Exclude some values from persistence for performance
      partialize: (state) => ({
        parents: state.parents,
        // Don't persist selection states as they should reset on reload
      }),
    }
  )
);

export default useDivStore;