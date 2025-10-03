// utils/screen.js

export const screenSizes = {
  '4k': '100%', // Desktop - full width
  'l-laptop': '1920px', // Large laptop
  laptop: '1366px', // Standard laptop
  tablet: '768px', // Tablet
  mobile: '375px', // Mobile
  'mobile-m': '320px', // Mobile medium
  'mobile-s': '280px', // Mobile small
};

export const getResponsiveValue = (value, screenSize) => {
  if (typeof value === 'object' && value !== null) {
    // Fallback chain: current screen size -> 4k (desktop) -> laptop -> null
    return value[screenSize] ?? value['4k'] ?? value['laptop'] ?? null;
  }
  // Fallback for non-object values or null
  return value ?? null;
};
