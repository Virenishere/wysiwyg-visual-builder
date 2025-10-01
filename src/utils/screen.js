// utils/screen.js

export const screenSizes = {
  desktop: '100%',
  laptop: '1366px',
  tablet: '768px',
  mobile: '375px',
};

export const getResponsiveValue = (value, screenSize) => {
  if (typeof value === 'object' && value !== null) {
    // Fallback chain: current screen size -> laptop -> 0
    return value[screenSize] ?? value['laptop'] ?? 0;
  }
  // Fallback for non-object values or null
  return value ?? 0;
};
