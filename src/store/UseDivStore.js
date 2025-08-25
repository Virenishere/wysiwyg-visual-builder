// store/UseDivStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getTemplateById } from '@/templates';
import { generateUniqueIds, deepClone } from './storeUtils';
import toast from 'react-hot-toast';

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
      previewingImage: null,
      leftPanel: null,

      // Image actions
      setPreviewingImage: (imageUrl) => set({ previewingImage: imageUrl }),
      removeAllImageElements: () => {
        set((state) => ({
          parents: state.parents.map(parent => ({
            ...parent,
            rnds: parent.rnds.map(rnd => ({
              ...rnd,
              elements: rnd.elements.filter(element => element.type !== 'image'),
            })),
          })),
        }));
        toast.success('All image elements have been removed.', { icon: '🗑️' });
      },

      // Template Actions
      loadTemplate: (templateId) => {
        const template = getTemplateById(templateId);
        if (!template) {
          console.error('Template not found:', templateId);
          toast.error('Template not found!');
          return;
        }

        const templateCopy = deepClone(template);
        const { parents: processedParents } = generateUniqueIds(templateCopy, {
          parentId: nextParentId,
          boxId: nextBoxId,
          elementId: nextElementId
        });

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
        toast.success(`Template '${templateId}' loaded successfully!`);
      },

      // Reset to default
      resetToDefault: () => {
        nextParentId = 1;
        nextBoxId = 1;
        nextElementId = 1;

        set({
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
        });
        toast.success('Canvas has been reset to default!');
      },

      // Parent actions
      addParent: () => {
        set((state) => ({
          parents: [
            ...state.parents,
            {
              id: nextParentId++,
              size: { height: 300, background: "#f8f8f8" },
              rnds: [],
            },
          ],
        }));
        toast.success('New section added!');
      },

      removeParent: (parentId) => {
        set((state) => ({
          parents: state.parents.filter(p => p.id !== parentId),
          selectedParentId: state.selectedParentId === parentId ? null : state.selectedParentId,
          selectedBoxId: null,
          selectedElementId: null,
        }));
        toast.success('Section removed.', { icon: '🗑️' });
      },

      updateParentSize: (parentId, size) =>
        set((state) => ({
          parents: state.parents.map((p) =>
            p.id === parentId ? { ...p, size: { ...p.size, ...size } } : p
          ),
        })),

      // RND actions inside a parent
      addRnd: (parentId) => {
        const newBoxId = nextBoxId++;
        set((state) => ({
          parents: state.parents.map((p) =>
            p.id === parentId
              ? {
                  ...p,
                  rnds: [
                    ...p.rnds,
                    {
                      id: newBoxId,
                      width: 150,
                      height: 150,
                      x: 50,
                      y: 50,
                      elements: [],
                    },
                  ],
                }
              : p
          ),
          selectedBoxId: newBoxId,
          leftPanel: null,
        }));
        toast.success("New div box added!");
      },

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

      // Element actions inside RND boxes
      addElement: (parentId, boxId, elementType) => {
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
        }));
        toast.success(`'${elementType}' element added!`);
      },

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

      removeElement: (parentId, boxId, elementId) => {
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
        }));
        toast.success('Element removed.', { icon: '🗑️' });
      },

      // Duplicate actions
      duplicateParent: (parentId) => {
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
        });
        toast.success('Section duplicated!');
      },

      duplicateRnd: (parentId, boxId) => {
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
        }));
        toast.success('Div box duplicated!');
      },

      duplicateElement: (parentId, boxId, elementId) => {
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
        }));
        toast.success('Element duplicated!');
      },

      // Selection actions
      setSelectedParent: (id) => set({ selectedParentId: id }),
      setSelectedBox: (id) => set({ selectedBoxId: id }),
      setSelectedElement: (id) => set({ selectedElementId: id }),
      setIsResizing: (status) => set({ isResizing: status }),
      setLeftPanel: (panel) => set({ leftPanel: panel }),

      // Utility actions
      exportData: () => {
        const state = get();
        const data = {
          parents: state.parents,
          version: '1.0.0',
          exportDate: new Date().toISOString()
        };
        toast.success('Data exported successfully!');
        return data;
      },

      importData: (data) => {
        if (!data || !data.parents) {
          console.error('Invalid import data');
          toast.error('Invalid import data!');
          return;
        }

        const dataCopy = deepClone(data);
        const { parents: processedParents } = generateUniqueIds(dataCopy, {
          parentId: nextParentId,
          boxId: nextBoxId,
          elementId: nextElementId
        });

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
        toast.success('Data imported successfully!');
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
      }),
    }
  )
);

export default useDivStore;

// Utility to find parent and box of a selected element
export const findElementLocation = (parents, elementId) => {
  for (const parent of parents) {
    for (const box of parent.rnds) {
      if (box.elements.some(el => el.id === elementId)) {
        return { parentId: parent.id, boxId: box.id };
      }
    }
  }
  return null;
};
