const deepClone = (obj) => {
  // Use JSON.parse and JSON.stringify for a robust deep clone of JSON-serializable objects.
  return JSON.parse(JSON.stringify(obj));
};

export const SCREENS = {
  '4k': {
    name: 'Desktop',
    width: '100%',
    fallbackChain: [],
  },
  'l-laptop': {
    name: 'Large Laptop',
    width: 1920,
    fallbackChain: ['4k'],
  },
  laptop: {
    name: 'Laptop',
    width: 1366,
    fallbackChain: ['l-laptop', '4k'],
  },
  tablet: {
    name: 'Tablet',
    width: 1024,
    fallbackChain: ['laptop', 'l-laptop', '4k'],
  },
  mobile: {
    name: 'Mobile',
    width: 768,
    fallbackChain: ['tablet', 'laptop', 'l-laptop', '4k'],
  },
  'mobile-m': {
    name: 'Mobile Medium',
    width: 480,
    fallbackChain: ['mobile', 'tablet', 'laptop', 'l-laptop', '4k'],
  },
  'mobile-s': {
    name: 'Mobile Small',
    width: 320,
    fallbackChain: ['mobile-m', 'mobile', 'tablet', 'laptop', 'l-laptop', '4k'],
  },
};

export const getFallbackChain = (screenSize) => {
  return SCREENS[screenSize]?.fallbackChain || [];
};

/**
 * Finds the effective screen to inherit a layout from, based on which screens have been edited.
 * If the current screen has a layout, it is returned.
 * Otherwise, it searches the fallback chain for the first (closest) larger screen that has a layout.
 * @param {string} screenSize - The screen size to find the layout for (e.g., 'mobile').
 * @param {string[]} editedScreens - An array of screen sizes that have defined layouts.
 * @returns {string|null} The key of the screen to inherit from, or null if no suitable layout is found.
 */
export const getEffectiveScreen = (screenSize, editedScreens) => {
  if (editedScreens.includes(screenSize)) {
    return screenSize;
  }

  const fallbackChain = getFallbackChain(screenSize);
  for (const fallbackScreen of fallbackChain) {
    if (editedScreens.includes(fallbackScreen)) {
      return fallbackScreen;
    }
  }

  return null;
};

/**
 * Retrieves the effective layout for a given screen size, applying fallback logic.
 * It finds the correct screen to inherit from and returns a deep clone of its layout.
 * @param {string} screenSize - The screen size for which to get the layout.
 * @param {Object.<string, Object>} allLayouts - An object where keys are screen sizes and values are their layout objects.
 * @returns {Object|null} A deep-cloned layout object, or null if no layout is available.
 */
export const getEffectiveLayout = (screenSize, allLayouts) => {
  const editedScreens = Object.keys(allLayouts);
  const effectiveScreenKey = getEffectiveScreen(screenSize, editedScreens);

  if (effectiveScreenKey && allLayouts[effectiveScreenKey]) {
    return deepClone(allLayouts[effectiveScreenKey]);
  }

  return null;
};
