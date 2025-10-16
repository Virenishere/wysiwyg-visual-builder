// store/slices/elementSlice.js
import { getResponsiveValue } from '../../utils/screen';
import { deepClone, responsiveUpdater, generateUniqueIds } from '../storeUtils';
import toast from 'react-hot-toast';

let nextElementId = 1;

export const createElementSlice = (set, get) => ({
  addElement: (parentId, boxId, elementType) => {
    set((state) => {
      const { screenSize } = state;
      const parent = state.parents.find((p) => p.id === parentId);
      const box = parent?.rnds.find((b) => b.id === boxId);
      if (!box) return state;
      const boxWidth = getResponsiveValue(box.width, screenSize) || 150;
      const boxHeight = getResponsiveValue(box.height, screenSize) || 150;
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
            width: { [screenSize]: 100 },
            height: { [screenSize]: 30 },
            content: 'Sample Text',
            fontSize: 16,
          });
          break;
        case 'paragraph':
          Object.assign(newElement, {
            width: { [screenSize]: 200 },
            height: { [screenSize]: 60 },
            content: '<p>Sample paragraph content</p>',
          });
          break;
        case 'button':
          Object.assign(newElement, {
            width: { [screenSize]: 120 },
            height: { [screenSize]: 35 },
            content: 'Click Me',
            backgroundColor: '#007bff',
            color: '#ffffff',
            borderRadius: 5,
            link: '',
          });
          break;
        case 'image':
          Object.assign(newElement, {
            width: { [screenSize]: 80 },
            height: { [screenSize]: 80 },
            content: '',
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
          });
          break;
        case 'card':
          Object.assign(newElement, {
            width: { [screenSize]: 200 },
            height: { [screenSize]: 150 },
            backgroundColor: '#f8f9fa',
            borderRadius: 8,
            padding: { top: 15, right: 15, bottom: 15, left: 15 },
          });
          break;
        case 'line':
          Object.assign(newElement, {
            width: { [screenSize]: 200 },
            height: { [screenSize]: 2 },
            content: '',
            backgroundColor: '#000000',
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            style: { backgroundColor: '#000000', minHeight: '2px' },
          });
          break;
        case 'div':
          Object.assign(newElement, {
            width: { [screenSize]: 150 },
            height: { [screenSize]: 100 },
            content: 'Div Element',
            border: '1px solid #ddd',
            style: {
              backgroundColor: 'transparent',
              border: '1px solid #ddd',
            },
          });
          break;
        case 'custom-code':
          Object.assign(newElement, {
            width: { [screenSize]: 200 },
            height: { [screenSize]: 150 },
            customHtml: '<p>Your custom HTML here</p>',
            customCss: 'p { color: blue; }',
            padding: { top: 10, right: 10, bottom: 10, left: 10 },
            overflow: 'auto',
          });
          break;
        default:
          Object.assign(newElement, {
            width: { [screenSize]: 120 },
            height: { [screenSize]: 35 },
            content: '',
          });
          break;
      }
      const elementWidth = Math.min(
        getResponsiveValue(newElement.width, screenSize) || 100,
        boxWidth - 20
      );
      const elementHeight = Math.min(
        getResponsiveValue(newElement.height, screenSize) || 30,
        boxHeight - 20
      );
      const elementX = Math.max(10, Math.min(10, boxWidth - elementWidth - 10));
      const elementY = Math.max(
        10,
        Math.min(10, boxHeight - elementHeight - 10)
      );
      newElement.x = { [screenSize]: elementX };
      newElement.y = { [screenSize]: elementY };
      if (typeof newElement.width === 'object') {
        newElement.width[screenSize] = elementWidth;
      } else {
        newElement.width = { [screenSize]: elementWidth };
      }
      if (typeof newElement.height === 'object') {
        newElement.height[screenSize] = elementHeight;
      } else {
        newElement.height = { [screenSize]: elementHeight };
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
      return {
        parents: newParents,
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
        state.selectedElementId === elementId ? null : state.selectedElementId,
    }));
    toast.success('Element removed.', { icon: '🗑️' });
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

                  // Get element dimensions for boundary validation
                  const elementWidth =
                    parseInt(
                      getResponsiveValue(elementToDuplicate.width, screenSize),
                      10
                    ) || 100; // default fallback
                  const elementHeight =
                    parseInt(
                      getResponsiveValue(elementToDuplicate.height, screenSize),
                      10
                    ) || 50; // default fallback

                  // Get box dimensions for boundary validation
                  const boxWidth = parseInt(
                    getResponsiveValue(box.width, screenSize),
                    10
                  );
                  const boxHeight = parseInt(
                    getResponsiveValue(box.height, screenSize),
                    10
                  );

                  // Calculate current position
                  const currentX =
                    typeof elementToDuplicate.x === 'object'
                      ? elementToDuplicate.x[screenSize] || 0
                      : elementToDuplicate.x || 0;
                  const currentY =
                    typeof elementToDuplicate.y === 'object'
                      ? elementToDuplicate.y[screenSize] || 0
                      : elementToDuplicate.y || 0;

                  // Smart positioning logic - always try to place adjacent with small position changes
                  let newX = currentX;
                  let newY = currentY;
                  const spacing = 10; // Smaller spacing for elements
                  const positionVariant = 8; // Small position change for visibility

                  // Check available space in each direction
                  const canPlaceRight =
                    currentX + elementWidth + spacing + elementWidth <=
                    boxWidth;
                  const canPlaceLeft = currentX - elementWidth - spacing >= 0;
                  const canPlaceBelow =
                    currentY + elementHeight + spacing + elementHeight <=
                    boxHeight;
                  const canPlaceAbove = currentY - elementHeight - spacing >= 0;

                  // Determine current position relative to box boundaries
                  const distanceFromRight =
                    boxWidth - (currentX + elementWidth);
                  const distanceFromLeft = currentX;
                  const distanceFromBottom =
                    boxHeight - (currentY + elementHeight);
                  const distanceFromTop = currentY;

                  // Primary logic: Try to place to the right with position variant
                  if (canPlaceRight) {
                    newX = currentX + elementWidth + spacing;
                    newY = Math.max(
                      0,
                      Math.min(
                        currentY + positionVariant,
                        boxHeight - elementHeight
                      )
                    );
                  }
                  // If at right extreme, place to the left
                  else if (
                    canPlaceLeft &&
                    distanceFromRight < elementWidth + spacing
                  ) {
                    newX = currentX - elementWidth - spacing;
                    newY = Math.max(
                      0,
                      Math.min(
                        currentY + positionVariant,
                        boxHeight - elementHeight
                      )
                    );
                  }
                  // If can't place horizontally, try vertically
                  else if (canPlaceBelow) {
                    newX = Math.max(
                      0,
                      Math.min(
                        currentX + positionVariant,
                        boxWidth - elementWidth
                      )
                    );
                    newY = currentY + elementHeight + spacing;
                  }
                  // If at bottom extreme, place above
                  else if (
                    canPlaceAbove &&
                    distanceFromBottom < elementHeight + spacing
                  ) {
                    newX = Math.max(
                      0,
                      Math.min(
                        currentX + positionVariant,
                        boxWidth - elementWidth
                      )
                    );
                    newY = currentY - elementHeight - spacing;
                  }
                  // Corner and edge cases with intelligent positioning
                  else {
                    // Determine which edge/corner we're closest to
                    const isAtRightEdge = distanceFromRight <= spacing * 2;
                    const isAtLeftEdge = distanceFromLeft <= spacing * 2;
                    const isAtBottomEdge = distanceFromBottom <= spacing * 2;
                    const isAtTopEdge = distanceFromTop <= spacing * 2;

                    if (isAtRightEdge && isAtBottomEdge) {
                      // Bottom-right corner: place to the left with upward shift
                      newX = Math.max(
                        spacing,
                        currentX - elementWidth - spacing
                      );
                      newY = Math.max(spacing, currentY - positionVariant * 2);
                    } else if (isAtRightEdge && isAtTopEdge) {
                      // Top-right corner: place to the left with downward shift
                      newX = Math.max(
                        spacing,
                        currentX - elementWidth - spacing
                      );
                      newY = Math.min(
                        boxHeight - elementHeight - spacing,
                        currentY + positionVariant * 2
                      );
                    } else if (isAtLeftEdge && isAtBottomEdge) {
                      // Bottom-left corner: place to the right with upward shift
                      newX = Math.min(
                        boxWidth - elementWidth - spacing,
                        currentX + elementWidth + spacing
                      );
                      newY = Math.max(spacing, currentY - positionVariant * 2);
                    } else if (isAtLeftEdge && isAtTopEdge) {
                      // Top-left corner: place to the right with downward shift
                      newX = Math.min(
                        boxWidth - elementWidth - spacing,
                        currentX + elementWidth + spacing
                      );
                      newY = Math.min(
                        boxHeight - elementHeight - spacing,
                        currentY + positionVariant * 2
                      );
                    } else if (isAtRightEdge) {
                      // Right edge: place to the left with slight position change
                      newX = Math.max(
                        spacing,
                        currentX - elementWidth - spacing
                      );
                      newY = Math.max(
                        spacing,
                        Math.min(
                          currentY + positionVariant,
                          boxHeight - elementHeight - spacing
                        )
                      );
                    } else if (isAtLeftEdge) {
                      // Left edge: place to the right with slight position change
                      newX = Math.min(
                        boxWidth - elementWidth - spacing,
                        currentX + elementWidth + spacing
                      );
                      newY = Math.max(
                        spacing,
                        Math.min(
                          currentY + positionVariant,
                          boxHeight - elementHeight - spacing
                        )
                      );
                    } else if (isAtBottomEdge) {
                      // Bottom edge: place above with slight position change
                      newX = Math.max(
                        spacing,
                        Math.min(
                          currentX + positionVariant,
                          boxWidth - elementWidth - spacing
                        )
                      );
                      newY = Math.max(
                        spacing,
                        currentY - elementHeight - spacing
                      );
                    } else if (isAtTopEdge) {
                      // Top edge: place below with slight position change
                      newX = Math.max(
                        spacing,
                        Math.min(
                          currentX + positionVariant,
                          boxWidth - elementWidth - spacing
                        )
                      );
                      newY = Math.min(
                        boxHeight - elementHeight - spacing,
                        currentY + elementHeight + spacing
                      );
                    } else {
                      // Default: small offset from original position
                      newX = Math.max(
                        spacing,
                        Math.min(
                          currentX + positionVariant,
                          boxWidth - elementWidth - spacing
                        )
                      );
                      newY = Math.max(
                        spacing,
                        Math.min(
                          currentY + positionVariant,
                          boxHeight - elementHeight - spacing
                        )
                      );
                    }
                  }

                  // Ensure final position is within bounds
                  newX = Math.max(0, Math.min(newX, boxWidth - elementWidth));
                  newY = Math.max(0, Math.min(newY, boxHeight - elementHeight));

                  if (typeof newElement.x === 'object') {
                    newElement.x = {
                      ...newElement.x,
                      [screenSize]: newX,
                    };
                  } else {
                    newElement.x = {
                      [screenSize]: newX,
                    };
                  }
                  if (typeof newElement.y === 'object') {
                    newElement.y = {
                      ...newElement.y,
                      [screenSize]: newY,
                    };
                  } else {
                    newElement.y = {
                      [screenSize]: newY,
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
      return {
        parents: newParents,
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
      return {
        parents: newParents,
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
            element.id === elementId ? { ...element, width, height } : element
          ),
        })),
      }));
      return {
        parents: newParents,
      };
    });
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
        console.error('Cannot center element due to invalid dimensions.', {
          boxWidth,
          boxHeight,
          elementWidth,
          elementHeight,
        });
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
});
