import { getResponsiveValue } from '@/utils/screen';
import { generateUniqueIds, responsiveUpdater, deepClone } from '../storeUtils';
import toast from 'react-hot-toast';

let nextBoxId = 1;
let nextElementId = 1;

export const createBoxSlice = (set, get) => ({
  addRnd: (parentId) => {
    const newBoxId = nextBoxId++;
    set((state) => {
      const { screenSize } = state;
      return {
        parents: state.parents.map((p) =>
          p.id === parentId
            ? {
                ...p,
                rnds: [
                  ...p.rnds,
                  {
                    id: newBoxId,
                    width: { [screenSize]: 150 },
                    height: { [screenSize]: 150 },
                    x: { [screenSize]: 50 },
                    y: { [screenSize]: 50 },
                    backgroundColor: { [screenSize]: 'transparent' },
                    elements: [],
                    customHTML: '',
                    customCss: '',
                  },
                ],
              }
            : p
        ),
        selectedBoxId: newBoxId,
        leftPanel: null,
      };
    });
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
      selectedBoxId: state.selectedBoxId === boxId ? null : state.selectedBoxId,
      selectedElementId: null,
    }));
    toast.success('Div box removed.', { icon: '🗑️' });
  },
  updateRndCustomCode: (parentId, boxId, customCode) => {
    set((state) => {
      const newParents = state.parents.map((p) =>
        p.id === parentId
          ? {
              ...p,
              rnds: p.rnds.map((box) =>
                box.id === boxId ? { ...box, ...customCode } : box
              ),
            }
          : p
      );
      return {
        parents: newParents,
      };
    });
    toast.success('Custom code updated!');
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
            console.log('Original RND data:', {
              id: rndToDuplicate.id,
              x: rndToDuplicate.x,
              y: rndToDuplicate.y,
              width: rndToDuplicate.width,
              height: rndToDuplicate.height,
              screenSize: screenSize,
            });

            const currentX = parseInt(
              getResponsiveValue(rndToDuplicate.x, screenSize),
              10
            );
            const currentY = parseInt(
              getResponsiveValue(rndToDuplicate.y, screenSize),
              10
            );

            console.log('Parsed current position:', { currentX, currentY });

            // Get box dimensions for boundary validation
            const boxWidth = parseInt(
              getResponsiveValue(rndToDuplicate.width, screenSize),
              10
            );
            const boxHeight = parseInt(
              getResponsiveValue(rndToDuplicate.height, screenSize),
              10
            );

            // Get section bounds - use actual section dimensions or expand to fit current div
            const sectionElement = document.querySelector(
              `[data-section-id="${parentId}"]`
            );
            let sectionWidth = 1200; // larger default fallback
            let sectionHeight = 800; // larger default fallback

            if (sectionElement) {
              const clientWidth = sectionElement.clientWidth;
              const clientHeight = sectionElement.clientHeight;
              // Ensure section bounds are large enough to contain the current div
              sectionWidth = Math.max(
                clientWidth - 20,
                currentX + boxWidth + 200
              ); // expand if needed
              sectionHeight = Math.max(
                clientHeight - 20,
                currentY + boxHeight + 200
              ); // expand if needed
            }

            console.log('Section element found:', !!sectionElement, 'Bounds:', {
              sectionWidth,
              sectionHeight,
            });

            // Smart positioning logic - check edges first, then place accordingly
            let newX = currentX;
            let newY = currentY;
            const spacing = 20; // Small spacing for adjacency
            const positionVariant = 5; // Very small position change for visibility

            // Define edge thresholds - more aggressive detection for right edge
            const rightEdgeThreshold = sectionWidth * 0.75; // 75% of section width
            const bottomEdgeThreshold = sectionHeight * 0.75; // 75% of section height

            // Check if we're near the right edge
            const isNearRightEdge = currentX >= rightEdgeThreshold;
            // Check if we're near the bottom edge
            const isNearBottomEdge = currentY >= bottomEdgeThreshold;

            console.log('Edge detection:', {
              currentX,
              currentY,
              rightEdgeThreshold,
              bottomEdgeThreshold,
              isNearRightEdge,
              isNearBottomEdge,
              sectionWidth,
              sectionHeight,
            });

            if (isNearRightEdge && isNearBottomEdge) {
              // Near both right and bottom edges - place to the left and slightly up
              newX = currentX - spacing - boxWidth;
              newY = currentY - positionVariant;
              console.log('Placing LEFT and UP (both edges)');
            } else if (isNearRightEdge) {
              // Near right edge only - place to the left with small vertical shift
              newX = currentX - spacing - boxWidth;
              newY = currentY + positionVariant;
              console.log('Placing LEFT (right edge detected)');
            } else if (isNearBottomEdge) {
              // Near bottom edge only - place above with small horizontal shift
              newX = currentX + positionVariant;
              newY = currentY - spacing - boxHeight;
              console.log('Placing ABOVE (bottom edge detected)');
            } else {
              // Default case - place to the right with small vertical shift
              newX = currentX + spacing + boxWidth;
              newY = currentY + positionVariant;
              console.log('Placing RIGHT (default)');
            }

            // Final boundary check to ensure the div stays within section limits
            newX = Math.max(0, Math.min(newX, sectionWidth - boxWidth));
            newY = Math.max(0, Math.min(newY, sectionHeight - boxHeight));

            console.log('Duplication Debug:', {
              originalPosition: { x: currentX, y: currentY },
              newPosition: { x: newX, y: newY },
              sectionBounds: { width: sectionWidth, height: sectionHeight },
              boxDimensions: { width: boxWidth, height: boxHeight },
              screenSize: screenSize,
            });

            if (typeof newRnd.x === 'object') {
              newRnd.x[screenSize] = newX;
            } else {
              newRnd.x = { [screenSize]: newX };
            }
            if (typeof newRnd.y === 'object') {
              newRnd.y[screenSize] = newY;
            } else {
              newRnd.y = { [screenSize]: newY };
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
      return {
        ...state,
        parents,
        selectedBoxId: newBoxId,
      };
    });
    toast.success('Div box duplicated!');
  },
  centerBox: (parentId, boxId) => {
    set((state) => {
      const parent = state.parents.find((p) => p.id === parentId);
      const box = parent?.rnds.find((b) => b.id === boxId);
      if (!box || !parent) return state;
      const sectionHeight =
        parseInt(
          getResponsiveValue(parent.size?.height, state.screenSize),
          10
        ) || 300;
      const sectionElement = document.querySelector(`[data-id="${parentId}"]`);
      const sectionWidth = sectionElement
        ? sectionElement.clientWidth - 20
        : 800;

      const boxWidth = getResponsiveValue(box.width, state.screenSize) || 150;

      const boxHeight = getResponsiveValue(box.height, state.screenSize) || 150;

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
});
