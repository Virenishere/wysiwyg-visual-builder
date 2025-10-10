// store/storeUtils.js

/**
 * Generate unique IDs for template data
 * This ensures no ID conflicts when loading templates
 */
export const generateUniqueIds = (templateData, startIds = {}) => {
  let { parentId = 1, boxId = 1, elementId = 1 } = startIds;

  // Handle case where only elements are provided (for duplicateRnd)
  if (templateData.elements && !templateData.parents) {
    const processedElements = templateData.elements.map((element) => ({
      ...element,
      id: elementId++,
    }));

    return {
      elements: processedElements,
      nextIds: { parentId, boxId, elementId },
    };
  }

  // Handle full template data with parents
  if (!templateData.parents || !Array.isArray(templateData.parents)) {
    return {
      parents: [],
      nextIds: { parentId, boxId, elementId },
    };
  }

  const processedParents = templateData.parents.map((parent) => ({
    ...deepClone(parent), // ensure deep clone to avoid shared references
    id: parentId++,
    rnds: parent.rnds.map((rnd) => ({
      ...deepClone(rnd),
      id: boxId++,
      elements: rnd.elements.map((element) => ({
        ...deepClone(element),
        id: elementId++,
      })),
    })),
  }));

  return {
    parents: processedParents,
    nextIds: { parentId, boxId, elementId },
  };
};

export const responsiveUpdater = (obj, updates, screenSize) => {
  const newObj = deepClone(obj);

  const screenOrder = [
    '4k',
    'l-laptop',
    'laptop',
    'tablet',
    'mobile',
    'mobile-m',
    'mobile-s',
  ];
  const currentScreenIndex = screenOrder.indexOf(screenSize);

  const nonResponsiveProperties = [
    'imageUrl',
    'content',
    'link',
    'type',
    'id',
    'customHtml',
    'customCss',
    'customClassName',
    'inlineStyles',
    'margin',
    'padding',
  ];

  for (const [key, value] of Object.entries(updates)) {
    if (nonResponsiveProperties.includes(key)) {
      newObj[key] = value;
    } else {
      if (
        typeof newObj[key] !== 'object' ||
        newObj[key] === null ||
        Array.isArray(newObj[key])
      ) {
        newObj[key] = {};
      }
      // Set the value for the current screen
      newObj[key][screenSize] = value;

      // Clear the value for all smaller screens to ensure they inherit this change
      if (currentScreenIndex !== -1) {
        for (let i = currentScreenIndex + 1; i < screenOrder.length; i++) {
          const smallerScreen = screenOrder[i];
          if (newObj[key] && newObj[key][smallerScreen] !== undefined) {
            delete newObj[key][smallerScreen];
          }
        }
      }
    }
  }
  return newObj;
};

/**
 * Deep clone object to avoid reference issues
 */
export const deepClone = (obj) => {
  // Use JSON.parse and JSON.stringify for a robust deep clone of JSON-serializable objects.
  // This is generally safer and more performant for state objects than a recursive function.
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Validate template structure
 */
export const validateTemplate = (template) => {
  if (!template || typeof template !== 'object') {
    return { valid: false, error: 'Template is not a valid object' };
  }

  if (!template.parents || !Array.isArray(template.parents)) {
    return { valid: false, error: 'Template must have a parents array' };
  }

  for (let i = 0; i < template.parents.length; i++) {
    const parent = template.parents[i];

    if (!parent.size || typeof parent.size.height !== 'number') {
      return { valid: false, error: `Parent ${i} must have valid size.height` };
    }

    if (!parent.rnds || !Array.isArray(parent.rnds)) {
      return { valid: false, error: `Parent ${i} must have rnds array` };
    }

    for (let j = 0; j < parent.rnds.length; j++) {
      const rnd = parent.rnds[j];

      if (
        typeof rnd.width !== 'number' ||
        typeof rnd.height !== 'number' ||
        typeof rnd.x !== 'number' ||
        typeof rnd.y !== 'number'
      ) {
        return {
          valid: false,
          error: `RND ${j} in parent ${i} has invalid dimensions`,
        };
      }

      if (rnd.elements && Array.isArray(rnd.elements)) {
        for (let k = 0; k < rnd.elements.length; k++) {
          const element = rnd.elements[k];

          if (!element.type || typeof element.type !== 'string') {
            return {
              valid: false,
              error: `Element ${k} in RND ${j} of parent ${i} has invalid type`,
            };
          }

          if (
            typeof element.x !== 'number' ||
            typeof element.y !== 'number' ||
            typeof element.width !== 'number' ||
            typeof element.height !== 'number'
          ) {
            return {
              valid: false,
              error: `Element ${k} has invalid dimensions`,
            };
          }
        }
      }
    }
  }

  return { valid: true };
};

/**
 * Get default element properties based on type
 */
export const getDefaultElementProps = (type) => {
  const baseProps = {
    fontSize: 16,
    fontFamily: 'Arial, sans-serif',
    color: '#000000',
    backgroundColor: 'transparent',
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    padding: { top: 5, right: 10, bottom: 5, left: 10 },
    borderRadius: 0,
    border: 'none',
  };

  const typeSpecificProps = {
    text: {
      content: 'Sample Text',
      width: 100,
      height: 30,
    },
    paragraph: {
      content: '<p>Sample paragraph content</p>',
      width: 200,
      height: 60,
    },
    button: {
      content: 'Click Me',
      width: 120,
      height: 35,
      backgroundColor: '#007bff',
      color: '#ffffff',
      borderRadius: 5,
    },
    image: {
      content: '',
      width: 80,
      height: 80,
      imageUrl: null,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
    },
  };

  return {
    ...baseProps,
    ...typeSpecificProps[type],
    type,
    x: 10,
    y: 10,
  };
};

/**
 * Calculate total elements in template
 */
export const getTemplateStats = (template) => {
  if (!template || !template.parents) {
    return { sections: 0, boxes: 0, elements: 0 };
  }

  const sections = template.parents.length;
  let boxes = 0;
  let elements = 0;

  template.parents.forEach((parent) => {
    if (parent.rnds) {
      boxes += parent.rnds.length;
      parent.rnds.forEach((rnd) => {
        if (rnd.elements) {
          elements += rnd.elements.length;
        }
      });
    }
  });

  return { sections, boxes, elements };
};

/**
 * Search elements by content
 */
export const searchElements = (parents, searchTerm) => {
  const results = [];
  const term = searchTerm.toLowerCase();

  parents.forEach((parent, parentIndex) => {
    parent.rnds?.forEach((rnd, rndIndex) => {
      rnd.elements?.forEach((element, elementIndex) => {
        if (element.content && element.content.toLowerCase().includes(term)) {
          results.push({
            parentId: parent.id,
            boxId: rnd.id,
            elementId: element.id,
            parentIndex,
            rndIndex,
            elementIndex,
            element,
            match: element.content,
          });
        }
      });
    });
  });

  return results;
};

/**
 * Export data as JSON
 */
export const exportAsJSON = (data, filename = 'website-export') => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Import JSON data
 */
export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const validation = validateTemplate(data);

        if (!validation.valid) {
          reject(new Error(validation.error));
          return;
        }

        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };

    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

/**
 * Generate CSS from element properties
 */
export const generateElementCSS = (element) => {
  const styles = {
    position: 'absolute',
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    fontSize: `${element.fontSize || 16}px`,
    fontFamily: element.fontFamily || 'Arial, sans-serif',
    color: element.color || '#000000',
    backgroundColor: element.backgroundColor || 'transparent',
    borderRadius: `${element.borderRadius || 0}px`,
    border: element.border || 'none',
    margin: `${element.margin?.top || 0}px ${element.margin?.right || 0}px ${
      element.margin?.bottom || 0
    }px ${element.margin?.left || 0}px`,
    padding: `${element.padding?.top || 5}px ${
      element.padding?.right || 10
    }px ${element.padding?.bottom || 5}px ${element.padding?.left || 10}px`,
    boxSizing: 'border-box',
  };

  return styles;
};

export const mergeParents = (targetParents, sourceParents) => {
  const mergedParents = [...targetParents];

  sourceParents.forEach((sourceParent) => {
    const targetParentIndex = mergedParents.findIndex(
      (p) => p.id === sourceParent.id
    );

    if (targetParentIndex !== -1) {
      // Merge parent
      const targetParent = mergedParents[targetParentIndex];
      const mergedRnds = [...targetParent.rnds];

      sourceParent.rnds.forEach((sourceRnd) => {
        const targetRndIndex = mergedRnds.findIndex(
          (r) => r.id === sourceRnd.id
        );

        if (targetRndIndex !== -1) {
          // Merge RND
          const targetRnd = mergedRnds[targetRndIndex];
          const mergedElements = [...targetRnd.elements];

          sourceRnd.elements.forEach((sourceElement) => {
            const targetElementIndex = mergedElements.findIndex(
              (e) => e.id === sourceElement.id
            );

            if (targetElementIndex !== -1) {
              // Merge element
              mergedElements[targetElementIndex] = {
                ...mergedElements[targetElementIndex],
                ...sourceElement,
              };
            } else {
              // Add new element
              mergedElements.push(sourceElement);
            }
          });

          mergedRnds[targetRndIndex] = {
            ...targetRnd,
            ...sourceRnd,
            elements: mergedElements,
          };
        } else {
          // Add new RND
          mergedRnds.push(sourceRnd);
        }
      });

      mergedParents[targetParentIndex] = {
        ...targetParent,
        ...sourceParent,
        rnds: mergedRnds,
      };
    } else {
      // Add new parent
      mergedParents.push(sourceParent);
    }
  });

  return mergedParents;
};

/**
 * Generate unique filename
 */
export const generateFilename = (prefix = 'export', extension = 'json') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `${prefix}-${timestamp}.${extension}`;
};

/**
 * Debounce function for performance optimization
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if point is inside element bounds
 */
export const isPointInElement = (point, element) => {
  return (
    point.x >= element.x &&
    point.x <= element.x + element.width &&
    point.y >= element.y &&
    point.y <= element.y + element.height
  );
};

/**
 * Get element at position (for collision detection)
 */
export const getElementAtPosition = (position, elements) => {
  // Return elements in reverse order (top to bottom)
  for (let i = elements.length - 1; i >= 0; i--) {
    if (isPointInElement(position, elements[i])) {
      return elements[i];
    }
  }
  return null;
};
