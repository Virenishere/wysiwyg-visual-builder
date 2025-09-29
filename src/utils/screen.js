// utils/screen.js

export const screenSizes = {
  desktop: '100%',
  laptop: '1366px',
  tablet: '768px',
  mobile: '375px',
};

export const getResponsiveValue = (value, screenSize) => {
  if (typeof value === 'object' && value !== null) {
    return value[screenSize] || value['desktop'];
  }
  return value;
};
