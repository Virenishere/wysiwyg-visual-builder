// utils/screen.js
import { getFallbackChain } from './screenConfig';

export const screenSizes = {
  '4k': '100%', // Desktop - full width
  'l-laptop': '1920px', // Large laptop
  laptop: '1366px', // Standard laptop
  tablet: '768px', // Tablet
  mobile: '375px', // Mobile
  'mobile-m': '320px', // Mobile medium
  'mobile-s': '280px', // Mobile small
};

export const getResponsiveValue = (responsiveProp, screenSize) => {
  if (
    typeof responsiveProp !== 'object' ||
    responsiveProp === null ||
    Array.isArray(responsiveProp)
  ) {
    return responsiveProp;
  }

  if (responsiveProp[screenSize] !== undefined) {
    return responsiveProp[screenSize];
  }

  const fallbackChain = getFallbackChain(screenSize);
  for (const fallbackScreen of fallbackChain) {
    if (responsiveProp[fallbackScreen] !== undefined) {
      return responsiveProp[fallbackScreen];
    }
  }

  return undefined;
};

// Get the target pixel width for a screen size
export const getTargetScreenWidth = (screenSize) => {
  const size = screenSizes[screenSize];
  if (size === '100%') {
    return null; // Will use container width
  }
  return parseInt(size, 10);
};

// Calculate the effective canvas width in the editor
export const getEditorCanvasWidth = (containerWidth, screenSize) => {
  const targetWidth = getTargetScreenWidth(screenSize);

  if (!targetWidth) {
    // For '4k' (100%), use the full container width
    return containerWidth;
  }

  // For fixed sizes, use the minimum of target width and available container width
  return Math.min(targetWidth, containerWidth);
};

// Calculate the effective canvas width in the preview
export const getPreviewCanvasWidth = (screenSize) => {
  const targetWidth = getTargetScreenWidth(screenSize);

  if (!targetWidth) {
    // For '4k' (100%), this will be handled by CSS
    return null;
  }

  return targetWidth;
};

// Get the actual pixel width for a screen size
export const getScreenPixelWidth = (screenSize) => {
  const size = screenSizes[screenSize];
  if (size === '100%') {
    // For 4k, we'll use a large default width
    return 1920; // Default large width for calculations
  }
  return parseInt(size, 10);
};

// Calculate scaling factor between editor and preview
export const getEditorToPreviewScale = (editorContainerWidth, screenSize) => {
  const targetWidth = getScreenPixelWidth(screenSize);

  // If screenSize is '4k' (100%), use the actual container width
  if (screenSizes[screenSize] === '100%') {
    return 1; // No scaling needed for 4k
  }

  // For fixed sizes, calculate the scale based on available space
  return editorContainerWidth / targetWidth;
};

// Scale coordinates from editor to preview
export const scaleCoordinatesForPreview = (
  coordinates,
  editorContainerWidth,
  screenSize
) => {
  const scale = getEditorToPreviewScale(editorContainerWidth, screenSize);

  return {
    x: coordinates.x / scale,
    y: coordinates.y / scale,
    width: coordinates.width / scale,
    height: coordinates.height / scale,
  };
};

// Scale coordinates from preview to editor
export const scaleCoordinatesForEditor = (
  coordinates,
  editorContainerWidth,
  screenSize
) => {
  const scale = getEditorToPreviewScale(editorContainerWidth, screenSize);

  return {
    x: coordinates.x * scale,
    y: coordinates.y * scale,
    width: coordinates.width * scale,
    height: coordinates.height * scale,
  };
};

// Calculate the effective canvas width in the preview
export const getEditorPreviewScale = (editorContainerWidth, screenSize) => {
  const editorCanvasWidth = getEditorCanvasWidth(
    editorContainerWidth,
    screenSize
  );
  const previewCanvasWidth = getPreviewCanvasWidth(screenSize);

  // If preview uses 100% width, no scaling needed
  if (!previewCanvasWidth) {
    return 1;
  }

  // Calculate scale factor
  return editorCanvasWidth / previewCanvasWidth;
};
