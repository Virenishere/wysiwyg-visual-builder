// store/UseDivStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
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
          size: { height: 300, background: '#ffffff' },
          rnds: [
            {
              id: nextBoxId++,
              width: 150,
              height: 150,
              x: 0,
              y: 0,
              elements: [],
              customHtml: '',
              customCss: '',
            },
          ],
        },
      ],
      selectedParentId: null,
      selectedBoxId: null,
      selectedElementId: null,
      isResizing: false,
      previewingImage: null,
      leftPanel: null,
      activeDragItem: null,

      // Image actions
      setPreviewingImage: (imageUrl) => set({ previewingImage: imageUrl }),
      removeAllImageElements: () => {
        set((state) => ({
          parents: state.parents.map((parent) => ({
            ...parent,
            rnds: parent.rnds.map((rnd) => ({
              ...rnd,
              elements: rnd.elements.filter(
                (element) => element.type !== 'image'
              ),
            })),
          })),
        }));
        toast.success('All image elements have been removed.', { icon: '🗑️' });
      },

      // Template Actions
      loadTemplate: (templateId) => {
        let template = getTemplateById(templateId);

        if (!template) {
          // Try loading from localStorage
          const savedTemplates = JSON.parse(
            localStorage.getItem('savedTemplates') || '{}'
          );
          if (savedTemplates[templateId]) {
            template = savedTemplates[templateId];
          } else {
            console.error('Template not found:', templateId);
            toast.error('Template not found!');
            return;
          }
        }

        const templateCopy = deepClone(template);
        const { parents: processedParents } = generateUniqueIds(templateCopy, {
          parentId: nextParentId,
          boxId: nextBoxId,
          elementId: nextElementId,
        });

        let maxParentId = 0;
        let maxBoxId = 0;
        let maxElementId = 0;

        processedParents.forEach((parent) => {
          maxParentId = Math.max(maxParentId, parent.id);
          parent.rnds.forEach((rnd) => {
            maxBoxId = Math.max(maxBoxId, rnd.id);
            rnd.elements.forEach((element) => {
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

      createNewTemplate: () => {
        nextParentId = 1;
        nextBoxId = 1;
        nextElementId = 1;
        const newParentId = nextParentId++;
        const newTemplate = {
          parents: [
            {
              id: newParentId,
              size: { height: 400, background: '#ffffff' },
              rnds: [],
            },
          ],
        };
        set({
          parents: newTemplate.parents,
          selectedParentId: newParentId,
          selectedBoxId: null,
          selectedElementId: null,
        });
        toast.success('New empty template created!');
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
              size: { height: 300, background: '#ffffff' },
              rnds: [
                {
                  id: nextBoxId++,
                  width: 150,
                  height: 150,
                  x: 0,
                  y: 0,
                  elements: [],
                },
              ],
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
              size: { height: 300, background: '#f8f8f8' },
              rnds: [],
            },
          ],
        }));
        toast.success('New section added!');
      },

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
                      customHtml: '',
                      customCss: '',
                    },
                  ],
                }
              : p
          ),
          selectedBoxId: newBoxId,
          leftPanel: null,
        }));
        toast.success('New div box added!');
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
          selectedBoxId:
            state.selectedBoxId === boxId ? null : state.selectedBoxId,
          selectedElementId: null,
        }));
        toast.success('Div box removed.', { icon: '🗑️' });
      },

      updateRndCustomCode: (parentId, boxId, customCode) => {
        set((state) => ({
          parents: state.parents.map((p) =>
            p.id === parentId
              ? {
                  ...p,
                  rnds: p.rnds.map((box) =>
                    box.id === boxId ? { ...box, ...customCode } : box
                  ),
                }
              : p
          ),
        }));
        toast.success('Custom code updated!');
      },

      // Element actions inside RND boxes

      addElement: (parentId, boxId, elementType) => {
        set((state) => {
          const { selectedElementId } = get();

          let x = 10;
          let y = 10;

          const parent = state.parents.find((p) => p.id === parentId);
          const box = parent?.rnds.find((b) => b.id === boxId);

          if (selectedElementId) {
            if (box) {
              const selectedElement = box.elements.find(
                (el) => el.id === selectedElementId
              );
              if (
                selectedElement &&
                (selectedElement.type === 'card' ||
                  selectedElement.type === 'div')
              ) {
                x = selectedElement.x + 10;
                y = selectedElement.y + 10;
              }
            }
          }

          const maxWidth = box ? box.width * 0.9 : 150;
          const maxHeight = box ? box.height * 0.9 : 150;

          // Create element based on type with proper defaults
          let newElement = {
            id: nextElementId++,
            type: elementType,
            x,
            y,
            zIndex: 0,
            customStyles: {},
            fontSize: elementType === 'text' ? 16 : 14,
            fontFamily: 'Arial, sans-serif',
            color: elementType === 'button' ? '#ffffff' : '#000000',
            backgroundColor: 'transparent',
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
            padding: { top: 5, right: 10, bottom: 5, left: 10 },
            borderRadius: 0,
            border: 'none',
            imageUrl: null,
          };

          // Set type-specific properties
          switch (elementType) {
            case 'text':
              newElement = {
                ...newElement,
                width: Math.min(100, maxWidth),
                height: Math.min(30, maxHeight),
                content: 'Sample Text',
              };
              break;

            case 'paragraph':
              newElement = {
                ...newElement,
                width: Math.min(200, maxWidth),
                height: Math.min(60, maxHeight),
                content: '<p>Sample paragraph content</p>',
              };
              break;

            case 'button':
              newElement = {
                ...newElement,
                width: Math.min(120, maxWidth),
                height: Math.min(35, maxHeight),
                content: 'Click Me',
                backgroundColor: '#007bff',
                borderRadius: 5,
              };
              break;

            case 'image':
              newElement = {
                ...newElement,
                width: Math.min(80, maxWidth),
                height: Math.min(80, maxHeight),
                content: '',
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
              };
              break;

            case 'card':
              newElement = {
                ...newElement,
                width: Math.min(200, maxWidth),
                height: Math.min(150, maxHeight),
                // content: 'Card Content',
                backgroundColor: '#f8f9fa',
                // border: '1px solid #e9ecef',
                borderRadius: 8,
                padding: { top: 15, right: 15, bottom: 15, left: 15 },
                style: {
                  backgroundColor: '#f8f9fa',
                  // border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                },
              };
              break;

            case 'line':
              newElement = {
                ...newElement,
                width: Math.min(200, maxWidth),
                height: 2,
                content: '',
                backgroundColor: '#000000',
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
                style: {
                  backgroundColor: '#000000',
                  minHeight: '2px',
                },
              };
              break;

            case 'div':
              newElement = {
                ...newElement,
                width: Math.min(150, maxWidth),
                height: Math.min(100, maxHeight),
                content: 'Div Element',
                border: '1px solid #ddd',
                style: {
                  backgroundColor: 'transparent',
                  border: '1px solid #ddd',
                },
              };
              break;

            default:
              newElement = {
                ...newElement,
                width: Math.min(120, maxWidth),
                height: Math.min(35, maxHeight),
                content: '',
              };
              break;
          }

          return {
            parents: state.parents.map((p) =>
              p.id === parentId
                ? {
                    ...p,
                    rnds: p.rnds.map((box) =>
                      box.id === boxId
                        ? {
                            ...box,
                            elements: [...box.elements, newElement],
                          }
                        : box
                    ),
                  }
                : p
            ),
          };
        });
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
                          elements: box.elements.map((element) => {
                            if (element.id === elementId) {
                              const newElement = { ...element, ...updates };
                              if (newElement.type === 'card') {
                                newElement.style = {
                                  ...newElement.style,
                                  ...updates,
                                };
                              }
                              return newElement;
                            }
                            return element;
                          }),
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
                          elements: box.elements.filter(
                            (element) => element.id !== elementId
                          ),
                        }
                      : box
                  ),
                }
              : p
          ),
          selectedElementId:
            state.selectedElementId === elementId
              ? null
              : state.selectedElementId,
        }));
        toast.success('Element removed.', { icon: '🗑️' });
      },

      // Duplicate actions
      duplicateParent: (parentId) => {
        set((state) => {
          const parentToDuplicate = state.parents.find(
            (p) => p.id === parentId
          );
          if (!parentToDuplicate) return state;

          const duplicatedParent = {
            ...parentToDuplicate,
            id: nextParentId++,
            rnds: parentToDuplicate.rnds.map((rnd) => ({
              ...rnd,
              id: nextBoxId++,
              elements: rnd.elements.map((element) => ({
                ...element,
                id: nextElementId++,
              })),
            })),
          };

          return {
            parents: [...state.parents, duplicatedParent],
          };
        });
        toast.success('Section duplicated!');
      },

      duplicateRnd: (parentId, boxId) => {
        set((state) => ({
          parents: state.parents.map((p) =>
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
                        elements: box.elements.map((element) => ({
                          ...element,
                          id: nextElementId++,
                        })),
                      });
                    }
                    return acc;
                  }, []),
                }
              : p
          ),
        }));
        toast.success('Div box duplicated!');
      },

      duplicateElement: (parentId, boxId, elementId) => {
        set((state) => ({
          parents: state.parents.map((p) =>
            p.id === parentId
              ? {
                  ...p,
                  rnds: p.rnds.map((box) =>
                    box.id === boxId
                      ? {
                          ...box,
                          elements: box.elements.reduce((acc, element) => {
                            acc.push(element);
                            if (element.id === elementId) {
                              acc.push({
                                ...element,
                                id: nextElementId++,
                                x: element.x + 50,
                                y: element.y + 50,
                              });
                            }
                            return acc;
                          }, []),
                        }
                      : box
                  ),
                }
              : p
          ),
        }));
        toast.success('Element duplicated!');
      },

      // Selection actions
      setSelectedParent: (id) => set({ selectedParentId: id }),
      setSelectedBox: (id) => set({ selectedBoxId: id }),
      setSelectedElement: (id) => set({ selectedElementId: id }),
      setIsResizing: (status) => set({ isResizing: status }),
      setLeftPanel: (panel) => set({ leftPanel: panel }),
      setActiveDragItem: (item) => set({ activeDragItem: item }),

      // Utility actions
      exportData: () => {
        const state = get();
        const data = {
          parents: state.parents,
          version: '1.0.0',
          exportDate: new Date().toISOString(),
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
          elementId: nextElementId,
        });

        let maxParentId = 0;
        let maxBoxId = 0;
        let maxElementId = 0;

        processedParents.forEach((parent) => {
          maxParentId = Math.max(maxParentId, parent.id);
          parent.rnds.forEach((rnd) => {
            maxBoxId = Math.max(maxBoxId, rnd.id);
            rnd.elements.forEach((element) => {
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
        return (
          state.parents.find((p) => p.id === state.selectedParentId) || null
        );
      },

      getSelectedBox: () => {
        const state = get();
        const parent = state.parents.find(
          (p) => p.id === state.selectedParentId
        );
        return (
          parent?.rnds.find((box) => box.id === state.selectedBoxId) || null
        );
      },

      getSelectedElement: () => {
        const state = get();
        const parent = state.parents.find(
          (p) => p.id === state.selectedParentId
        );
        const box = parent?.rnds.find((box) => box.id === state.selectedBoxId);
        return (
          box?.elements?.find(
            (element) => element.id === state.selectedElementId
          ) || null
        );
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
      if (box.elements.some((el) => el.id === elementId)) {
        return { parentId: parent.id, boxId: box.id };
      }
    }
  }
  return null;
};
