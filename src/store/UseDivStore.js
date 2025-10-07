// store/UseDivStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getTemplateById } from '@/templates';
import {
  generateUniqueIds,
  deepClone,
  responsiveUpdater,
  mergeParents,
} from './storeUtils';
import { getResponsiveValue } from '@/utils/screen';
import toast from 'react-hot-toast';

let nextParentId = 1;
let nextBoxId = 1;
let nextElementId = 1;

const initialLayout = {
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
};

// Helper function to copy desktop layout to other screen sizes
const copyDesktopToAllScreens = (desktopLayout) => {
  const screenSizes = [
    '4k',
    'l-laptop',
    'laptop',
    'tablet',
    'mobile',
    'mobile-m',
    'mobile-s',
  ];
  const layouts = {};

  screenSizes.forEach((size) => {
    layouts[size] = deepClone(desktopLayout);
  });

  return layouts;
};

const useDivStore = create(
  persist(
    (set, get) => ({
      // State
      layouts: copyDesktopToAllScreens(initialLayout), // Initialize all screens with desktop layout
      parents: initialLayout.parents, // Current working layout
      selectedParentId: null,
      selectedBoxId: null,
      selectedElementId: null,
      isResizing: false,
      previewingImage: null,
      leftPanel: null,
      activeDragItem: null,
      screenSize: '4k', // Default to desktop (4k) first

      // Container dimensions tracking
      editorContainerWidth: null,
      previewContainerWidth: null,

      templateName: '',
      setTemplateName: (templateName) => set({ templateName }),

      // Container width setters
      setEditorContainerWidth: (width) => set({ editorContainerWidth: width }),
      setPreviewContainerWidth: (width) =>
        set({ previewContainerWidth: width }),

      // Action to set the screen size
      setScreenSize: (screenSize) => {
        const { layouts, parents, screenSize: oldScreenSize } = get();

        // Save current work to the old screen size layout
        const newLayouts = deepClone(layouts);
        newLayouts[oldScreenSize] = { parents: deepClone(parents) };

        // Load new screen size layout, fallback to desktop (4k) if not exists
        const newParents = deepClone(
          newLayouts[screenSize]?.parents ||
            newLayouts['4k']?.parents ||
            initialLayout.parents
        );

        set({
          screenSize,
          parents: newParents,
          layouts: newLayouts,
          selectedParentId: null,
          selectedBoxId: null,
          selectedElementId: null,
        });
      },

      // New action to copy current desktop layout to all screen sizes
      copyDesktopToAllScreens: () => {
        const { layouts, parents, screenSize } = get();
        const sourceLayout = { parents: deepClone(parents) };

        const screenSizes = [
          '4k',
          'l-laptop',
          'laptop',
          'tablet',
          'mobile',
          'mobile-m',
          'mobile-s',
        ];

        const nonResponsiveProperties = [
          'imageUrl',
          'content',
          'link',
          'type',
          'id',
          'customHtml',
          'customCss',
          'customClassName',
          'x',
          'y',
        ];

        const makePropertiesResponsive = (obj) => {
          if (typeof obj !== 'object' || obj === null) {
            return obj;
          }

          if (Array.isArray(obj)) {
            return obj.map(makePropertiesResponsive);
          }

          const newObj = {};
          for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              const value = obj[key];
              if (nonResponsiveProperties.includes(key)) {
                newObj[key] = value;
              } else if (typeof value !== 'object' || value === null) {
                newObj[key] = {
                  '4k': value,
                  'l-laptop': value,
                  laptop: value,
                  tablet: value,
                  mobile: value,
                  'mobile-m': value,
                  'mobile-s': value,
                };
              } else {
                newObj[key] = makePropertiesResponsive(value);
              }
            }
          }
          return newObj;
        };

        const responsiveLayout = makePropertiesResponsive(sourceLayout);

        const newLayouts = {};
        screenSizes.forEach((size) => {
          newLayouts[size] = deepClone(responsiveLayout);
        });

        set({
          layouts: newLayouts,
          parents: deepClone(responsiveLayout.parents),
        });

        toast.success('Current layout copied to all screen sizes!');
      },

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

        const { layouts } = get();
        const newLayouts = {};
        let maxParentId = 0;
        let maxBoxId = 0;
        let maxElementId = 0;

        Object.keys(layouts).forEach((screen) => {
          const templateCopy = deepClone(template);
          const { parents: processedParents, nextIds } = generateUniqueIds(
            templateCopy,
            {
              parentId: nextParentId,
              boxId: nextBoxId,
              elementId: nextElementId,
            }
          );
          newLayouts[screen] = { parents: processedParents };

          processedParents.forEach((parent) => {
            maxParentId = Math.max(maxParentId, parent.id);
            parent.rnds.forEach((rnd) => {
              maxBoxId = Math.max(maxBoxId, rnd.id);
              rnd.elements.forEach((element) => {
                maxElementId = Math.max(maxElementId, element.id);
              });
            });
          });
          nextParentId = nextIds.parentId;
          nextBoxId = nextIds.boxId;
          nextElementId = nextIds.elementId;
        });

        set({
          layouts: newLayouts,
          parents: newLayouts[get().screenSize].parents,
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
        const newLayouts = {};
        Object.keys(get().layouts).forEach((screen) => {
          newLayouts[screen] = deepClone(newTemplate);
        });

        set({
          layouts: newLayouts,
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
        const newLayouts = {};
        Object.keys(get().layouts).forEach((screen) => {
          newLayouts[screen] = deepClone(initialLayout);
        });

        set({
          layouts: newLayouts,
          parents: initialLayout.parents,
          selectedParentId: null,
          selectedBoxId: null,
          selectedElementId: null,
        });
        toast.success('Canvas has been reset to default!');
      },

      // Parent actions
      addParent: (height) => {
        set((state) => ({
          parents: [
            ...state.parents,
            {
              id: nextParentId++,
              size: { height: height || 300, background: '#f8f8f8' },
              rnds: [],
            },
          ],
        }));
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

      updateParentSize: (parentId, size) =>
        set((state) => ({
          parents: state.parents.map((p) => {
            if (p.id === parentId) {
              const newSize = { ...p.size };
              for (const [key, value] of Object.entries(size)) {
                if (typeof newSize[key] !== 'object' || newSize[key] === null) {
                  newSize[key] = {
                    '4k': newSize[key],
                    'l-laptop': newSize[key],
                    laptop: newSize[key],
                    tablet: newSize[key],
                    mobile: newSize[key],
                    'mobile-m': newSize[key],
                    'mobile-s': newSize[key],
                  };
                }
                newSize[key][state.screenSize] = value;
              }
              return {
                ...p,
                size: newSize,
              };
            }
            return p;
          }),
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
                      width: { laptop: 150 },
                      height: { laptop: 150 },
                      x: { laptop: 50 },
                      y: { laptop: 50 },
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
          const parent = state.parents.find((p) => p.id === parentId);
          const box = parent?.rnds.find((b) => b.id === boxId);

          if (!box) return state;

          const boxWidth =
            getResponsiveValue(box.width, state.screenSize) || 150;
          const boxHeight =
            getResponsiveValue(box.height, state.screenSize) || 150;

          const newElementId = nextElementId++;
          const newElement = {
            id: newElementId,
            type: elementType,
            zIndex: 0,
            customStyles: {},
            fontSize: 14,
            fontFamily: 'Arial, sans-serif',
            color: '#000000',
            backgroundColor: 'transparent',
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
            padding: { top: 5, right: 10, bottom: 5, left: 10 },
            borderRadius: 0,
            border: 'none',
            imageUrl: null,
          };

          // Type-specific properties
          switch (elementType) {
            case 'text':
              Object.assign(newElement, {
                width: { '4k': 100, laptop: 100 },
                height: { '4k': 30, laptop: 30 },
                content: 'Sample Text',
                fontSize: 16,
              });
              break;
            case 'paragraph':
              Object.assign(newElement, {
                width: { '4k': 200, laptop: 200 },
                height: { '4k': 60, laptop: 60 },
                content: '<p>Sample paragraph content</p>',
              });
              break;
            case 'button':
              Object.assign(newElement, {
                width: { '4k': 120, laptop: 120 },
                height: { '4k': 35, laptop: 35 },
                content: 'Click Me',
                backgroundColor: '#007bff',
                color: '#ffffff',
                borderRadius: 5,
                link: '',
              });
              break;
            case 'image':
              Object.assign(newElement, {
                width: { '4k': 80, laptop: 80 },
                height: { '4k': 80, laptop: 80 },
                content: '',
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
              });
              break;
            case 'card':
              Object.assign(newElement, {
                width: { '4k': 200, laptop: 200 },
                height: { '4k': 150, laptop: 150 },
                backgroundColor: '#f8f9fa',
                borderRadius: 8,
                padding: { top: 15, right: 15, bottom: 15, left: 15 },
              });
              break;
            case 'line':
              Object.assign(newElement, {
                width: { '4k': 200, laptop: 200 },
                height: { '4k': 2, laptop: 2 },
                content: '',
                backgroundColor: '#000000',
                padding: { top: 0, right: 0, bottom: 0, left: 0 },
                style: { backgroundColor: '#000000', minHeight: '2px' },
              });
              break;
            case 'div':
              Object.assign(newElement, {
                width: { laptop: 150 },
                height: { laptop: 100 },
                content: 'Div Element',
                border: '1px solid #ddd',
                style: {
                  backgroundColor: 'transparent',
                  border: '1px solid #ddd',
                },
              });
              break;
            default:
              Object.assign(newElement, {
                width: 120,
                height: 35,
                content: '',
              });
              break;
          }

          // Ensure element fits within box bounds
          const elementWidth = Math.min(
            getResponsiveValue(newElement.width, state.screenSize) || 100,
            boxWidth - 20
          );
          const elementHeight = Math.min(
            getResponsiveValue(newElement.height, state.screenSize) || 30,
            boxHeight - 20
          );

          // Set position ensuring element stays within box bounds
          const elementX = Math.max(
            10,
            Math.min(10, boxWidth - elementWidth - 10)
          );
          const elementY = Math.max(
            10,
            Math.min(10, boxHeight - elementHeight - 10)
          );

          // Update element with responsive position and size
          newElement.x = { [state.screenSize]: elementX };
          newElement.y = { [state.screenSize]: elementY };

          if (typeof newElement.width === 'object') {
            newElement.width[state.screenSize] = elementWidth;
          } else {
            newElement.width = { [state.screenSize]: elementWidth };
          }

          if (typeof newElement.height === 'object') {
            newElement.height[state.screenSize] = elementHeight;
          } else {
            newElement.height = { [state.screenSize]: elementHeight };
          }

          const newParents = state.parents.map((p) =>
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
          );

          // Auto-save to layouts
          const newLayouts = deepClone(state.layouts);
          newLayouts[state.screenSize] = { parents: deepClone(newParents) };

          return {
            parents: newParents,
            layouts: newLayouts,
            selectedElementId: newElementId,
          };
        });
        toast.success(`'${elementType}' element added!`);
      },

      updateElement: (parentId, boxId, elementId, updates) => {
        set((state) => {
          const newParents = state.parents.map((p) => {
            if (p.id === parentId) {
              return {
                ...p,
                rnds: p.rnds.map((rnd) => {
                  if (rnd.id === boxId) {
                    return {
                      ...rnd,
                      elements: rnd.elements.map((el) => {
                        if (el.id === elementId) {
                          return {
                            ...responsiveUpdater(el, updates, state.screenSize),
                            version: (el.version || 0) + 1,
                          };
                        }
                        return el;
                      }),
                    };
                  }
                  return rnd;
                }),
              };
            }
            return p;
          });

          return {
            parents: newParents,
          };
        });
      },

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

          const { parents: processedParents } = generateUniqueIds(
            { parents: [parentToDuplicate] },
            {
              parentId: nextParentId,
              boxId: nextBoxId,
              elementId: nextElementId,
            }
          );
          nextParentId += 1;
          nextBoxId += parentToDuplicate.rnds.length;
          parentToDuplicate.rnds.forEach(
            (rnd) => (nextElementId += rnd.elements.length)
          );

          return {
            parents: [...state.parents, ...processedParents],
          };
        });
        toast.success('Section duplicated!');
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

                // Handle responsive values properly for position
                const currentX = parseInt(
                  getResponsiveValue(rndToDuplicate.x, screenSize),
                  10
                );
                const currentY = parseInt(
                  getResponsiveValue(rndToDuplicate.y, screenSize),
                  10
                );

                // Update position for current screen size
                if (typeof newRnd.x === 'object') {
                  newRnd.x[screenSize] = currentX + 20;
                } else {
                  newRnd.x = currentX + 20;
                }

                if (typeof newRnd.y === 'object') {
                  newRnd.y[screenSize] = currentY + 20;
                } else {
                  newRnd.y = currentY + 20;
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

      duplicateElement: (parentId, boxId, elementId) => {
        set((state) => {
          const { screenSize } = state;
          const newElementId = nextElementId++;
          const parents = state.parents.map((p) => {
            if (p.id === parentId) {
              return {
                ...p,
                rnds: p.rnds.map((box) => {
                  if (box.id === boxId) {
                    const elementToDuplicate = box.elements.find(
                      (el) => el.id === elementId
                    );
                    if (elementToDuplicate) {
                      const newElement = deepClone(elementToDuplicate);
                      newElement.id = newElementId;

                      // Handle responsive values properly
                      if (typeof newElement.x === 'object') {
                        // If x is responsive object, update current screen size
                        newElement.x = {
                          ...newElement.x,
                          [screenSize]: (newElement.x[screenSize] || 0) + 20,
                        };
                      } else {
                        // If x is a number, convert to responsive and add offset
                        newElement.x = {
                          [screenSize]: (newElement.x || 0) + 20,
                        };
                      }

                      if (typeof newElement.y === 'object') {
                        // If y is responsive object, update current screen size
                        newElement.y = {
                          ...newElement.y,
                          [screenSize]: (newElement.y[screenSize] || 0) + 20,
                        };
                      } else {
                        // If y is a number, convert to responsive and add offset
                        newElement.y = {
                          [screenSize]: (newElement.y || 0) + 20,
                        };
                      }

                      return {
                        ...box,
                        elements: [...box.elements, newElement],
                      };
                    }
                  }
                  return box;
                }),
              };
            }
            return p;
          });
          return { parents };
        });
        toast.success('Element duplicated!');
      },

      // Save state action
      saveState: () => {
        set((state) => {
          const { screenSize, parents, layouts } = state;
          const newLayouts = { ...layouts };
          const currentLayout = newLayouts[screenSize] || { parents: [] };
          const mergedParents = mergeParents(currentLayout.parents, parents);
          newLayouts[screenSize] = { parents: mergedParents };

          return { layouts: newLayouts };
        });
        toast.success('Your work has been saved!');
      },

      // Selection actions
      setSelectedParent: (id) => set({ selectedParentId: id }),
      setSelectedBox: (id) => set({ selectedBoxId: id }),
      setSelectedElement: (id) => set({ selectedElementId: id }),

      updateElementContent: (elementId, content) => {
        set((state) => {
          const newParents = state.parents.map((p) => ({
            ...p,
            rnds: p.rnds.map((box) => ({
              ...box,
              elements: box.elements.map((element) =>
                element.id === elementId ? { ...element, content } : element
              ),
            })),
          }));

          // Auto-save to layouts when content is updated
          const newLayouts = deepClone(state.layouts);
          newLayouts[state.screenSize] = { parents: deepClone(newParents) };

          return {
            parents: newParents,
            layouts: newLayouts,
          };
        });
      },

      updateElementPosition: (elementId, x, y) => {
        set((state) => {
          const newParents = state.parents.map((p) => ({
            ...p,
            rnds: p.rnds.map((box) => ({
              ...box,
              elements: box.elements.map((element) =>
                element.id === elementId ? { ...element, x, y } : element
              ),
            })),
          }));

          // Auto-save to layouts when position is updated
          const newLayouts = deepClone(state.layouts);
          newLayouts[state.screenSize] = { parents: deepClone(newParents) };

          return {
            parents: newParents,
            layouts: newLayouts,
          };
        });
      },

      updateElementSize: (elementId, width, height) => {
        set((state) => {
          const newParents = state.parents.map((p) => ({
            ...p,
            rnds: p.rnds.map((box) => ({
              ...box,
              elements: box.elements.map((element) =>
                element.id === elementId
                  ? { ...element, width, height }
                  : element
              ),
            })),
          }));

          // Auto-save to layouts when size is updated
          const newLayouts = deepClone(state.layouts);
          newLayouts[state.screenSize] = { parents: deepClone(newParents) };

          return {
            parents: newParents,
            layouts: newLayouts,
          };
        });
      },

      setIsResizing: (status) => set({ isResizing: status }),
      setLeftPanel: (panel) => set({ leftPanel: panel }),
      setActiveDragItem: (item) => set({ activeDragItem: item }),

      // Center functionality
      centerBox: (parentId, boxId) => {
        set((state) => {
          const parent = state.parents.find((p) => p.id === parentId);
          const box = parent?.rnds.find((b) => b.id === boxId);
          if (!box || !parent) return state;

          // Get responsive section height for current screen
          const sectionHeight =
            parseInt(
              getResponsiveValue(parent.size?.height, state.screenSize),
              10
            ) || 300;

          // Get section element to calculate actual bounds
          const sectionElement = document.querySelector(
            `[data-id="${parentId}"]`
          );
          const sectionWidth = sectionElement
            ? sectionElement.clientWidth - 20
            : 800; // fallback width minus padding

          const boxWidth =
            getResponsiveValue(box.width, state.screenSize) || 150;
          const boxHeight =
            getResponsiveValue(box.height, state.screenSize) || 150;

          // Calculate center position: (containerSize - elementSize) / 2
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

      centerElement: (parentId, boxId, elementId) => {
        set((state) => {
          const parent = state.parents.find((p) => p.id === parentId);
          const box = parent?.rnds.find((b) => b.id === boxId);
          const element = box?.elements.find((e) => e.id === elementId);
          if (!element || !box) return state;

          const boxWidth = parseFloat(
            getResponsiveValue(box.width, state.screenSize)
          );
          const boxHeight = parseFloat(
            getResponsiveValue(box.height, state.screenSize)
          );
          const elementWidth = parseFloat(
            getResponsiveValue(element.width, state.screenSize)
          );
          const elementHeight = parseFloat(
            getResponsiveValue(element.height, state.screenSize)
          );

          if (
            !isFinite(boxWidth) ||
            !isFinite(boxHeight) ||
            !isFinite(elementWidth) ||
            !isFinite(elementHeight)
          ) {
            console.error('Cannot center element due to invalid dimensions.');
            toast.error('Cannot center element due to invalid dimensions.');
            return state;
          }

          const centerX = Math.max(0, (boxWidth - elementWidth) / 2);
          const centerY = Math.max(0, (boxHeight - elementHeight) / 2);

          const updates = {
            x: centerX,
            y: centerY,
          };

          const newParents = state.parents.map((p) =>
            p.id === parentId
              ? {
                  ...p,
                  rnds: p.rnds.map((rnd) =>
                    rnd.id === boxId
                      ? {
                          ...rnd,
                          elements: rnd.elements.map((el) =>
                            el.id === elementId
                              ? responsiveUpdater(el, updates, state.screenSize)
                              : el
                          ),
                        }
                      : rnd
                  ),
                }
              : p
          );

          return { parents: newParents };
        });
        toast.success('Element centered!');
      },

      // Utility actions
      exportData: () => {
        const { layouts } = get();
        const data = {
          layouts,
          version: '1.0.0',
          exportDate: new Date().toISOString(),
        };
        toast.success('Data exported successfully!');
        return data;
      },

      importData: (data) => {
        if (!data || !data.layouts) {
          console.error('Invalid import data');
          toast.error('Invalid import data!');
          return;
        }

        const newLayouts = {};
        let maxParentId = 0;
        let maxBoxId = 0;
        let maxElementId = 0;

        Object.keys(data.layouts).forEach((screen) => {
          const { parents: processedParents, nextIds } = generateUniqueIds(
            data.layouts[screen],
            {
              parentId: nextParentId,
              boxId: nextBoxId,
              elementId: nextElementId,
            }
          );
          newLayouts[screen] = { parents: processedParents };

          processedParents.forEach((parent) => {
            maxParentId = Math.max(maxParentId, parent.id);
            parent.rnds.forEach((rnd) => {
              maxBoxId = Math.max(maxBoxId, rnd.id);
              rnd.elements.forEach((element) => {
                maxElementId = Math.max(maxElementId, element.id);
              });
            });
          });
          nextParentId = nextIds.parentId;
          nextBoxId = nextIds.boxId;
          nextElementId = nextIds.elementId;
        });

        set({
          layouts: newLayouts,
          parents: newLayouts[get().screenSize].parents,
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
      partialize: (state) => ({
        layouts: state.layouts,
      }),
    }
  )
);

export default useDivStore;

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
