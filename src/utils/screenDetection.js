// utils/screenDetection.js
import React from 'react';
import { SCREENS } from './screenConfig';

/**
 * Hook for detecting screen size changes using ResizeObserver
 * @param {React.RefObject} containerRef - Reference to the container element
 * @param {Function} onScreenSizeChange - Callback when screen size changes
 * @param {number} debounceMs - Debounce delay in milliseconds
 */
export const useScreenDetection = (
  containerRef,
  onScreenSizeChange,
  debounceMs = 300
) => {
  const [detectedScreenSize, setDetectedScreenSize] = React.useState(null);
  const [containerWidth, setContainerWidth] = React.useState(null);

  React.useEffect(() => {
    if (!containerRef?.current) return;

    let timeoutId;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;

        // Debounce the resize events
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setContainerWidth(width);

          // Determine the best matching screen size based on container width
          const screenSize = getBestMatchingScreenSize(width);

          if (screenSize !== detectedScreenSize) {
            setDetectedScreenSize(screenSize);
            onScreenSizeChange?.(screenSize, width);
          }
        }, debounceMs);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [containerRef, onScreenSizeChange, debounceMs, detectedScreenSize]);

  return { detectedScreenSize, containerWidth };
};

/**
 * Determines the best matching screen size based on container width
 * @param {number} width - Container width in pixels
 * @returns {string} - Screen size key
 */
export const getBestMatchingScreenSize = (width) => {
  const screenEntries = Object.entries(SCREENS);

  // Sort by width (descending) to find the largest screen that fits
  const sortedScreens = screenEntries.sort(([, a], [, b]) => b.width - a.width);

  for (const [screenKey, screenConfig] of sortedScreens) {
    if (width >= screenConfig.width * 0.8) {
      // 80% threshold for better matching
      return screenKey;
    }
  }

  // Fallback to smallest screen if no match
  return sortedScreens[sortedScreens.length - 1][0];
};

/**
 * Gets the appropriate screen size for the current viewport
 * @returns {string} - Screen size key
 */
export const getViewportScreenSize = () => {
  if (typeof window === 'undefined') return '4k';

  const width = window.innerWidth;
  return getBestMatchingScreenSize(width);
};

/**
 * Calculates scaling factor for responsive design
 * @param {number} containerWidth - Current container width
 * @param {string} targetScreenSize - Target screen size
 * @returns {number} - Scaling factor
 */
export const getScalingFactor = (containerWidth, targetScreenSize) => {
  const targetWidth = SCREENS[targetScreenSize]?.width;
  if (!targetWidth) return 1;

  return containerWidth / targetWidth;
};

/**
 * Scales coordinates from one screen size to another
 * @param {Object} coordinates - {x, y, width, height}
 * @param {string} fromScreenSize - Source screen size
 * @param {string} toScreenSize - Target screen size
 * @returns {Object} - Scaled coordinates
 */
export const scaleCoordinates = (coordinates, fromScreenSize, toScreenSize) => {
  const fromWidth = SCREENS[fromScreenSize]?.width;
  const toWidth = SCREENS[toScreenSize]?.width;

  if (!fromWidth || !toWidth) return coordinates;

  const scale = toWidth / fromWidth;

  return {
    x: coordinates.x * scale,
    y: coordinates.y * scale,
    width: coordinates.width * scale,
    height: coordinates.height * scale,
  };
};

/**
 * Auto-detects and suggests screen size based on current viewport
 * @param {Function} onSuggestion - Callback with suggested screen size
 */
export const suggestScreenSize = (onSuggestion) => {
  if (typeof window === 'undefined') return;

  const viewportSize = getViewportScreenSize();
  const containerWidth = window.innerWidth;
  const scalingFactor = getScalingFactor(containerWidth, viewportSize);

  onSuggestion({
    suggestedSize: viewportSize,
    containerWidth,
    scalingFactor,
    isOptimal: scalingFactor >= 0.8 && scalingFactor <= 1.2,
  });
};

/**
 * Creates responsive CSS media queries for all screen sizes
 * @returns {string} - CSS media queries
 */
export const generateResponsiveCSS = () => {
  const mediaQueries = [];

  Object.entries(SCREENS).forEach(([screenKey, config]) => {
    if (screenKey === '4k') return; // Skip 4k as it's the default

    const mediaQuery = `
@media (max-width: ${config.width}px) {
  .screen-${screenKey} {
    /* Styles for ${config.name} */
  }
}`;
    mediaQueries.push(mediaQuery);
  });

  return mediaQueries.join('\n');
};

/**
 * Validates if the current setup is optimal for the selected screen size
 * @param {string} selectedScreenSize - Currently selected screen size
 * @param {number} containerWidth - Container width
 * @returns {Object} - Validation result
 */
export const validateScreenSetup = (selectedScreenSize, containerWidth) => {
  const targetWidth = SCREENS[selectedScreenSize]?.width;
  if (!targetWidth) {
    return {
      isValid: false,
      message: 'Invalid screen size selected',
      recommendation: null,
    };
  }

  const scalingFactor = containerWidth / targetWidth;
  const isOptimal = scalingFactor >= 0.7 && scalingFactor <= 1.3;

  let recommendation = null;
  if (scalingFactor < 0.7) {
    const suggestedSize = getBestMatchingScreenSize(containerWidth);
    recommendation = {
      action: 'switch',
      screenSize: suggestedSize,
      message: `Consider switching to ${SCREENS[suggestedSize]?.name} for better editing experience`,
    };
  } else if (scalingFactor > 1.3) {
    recommendation = {
      action: 'zoom',
      message:
        'Consider zooming out your browser for better editing experience',
    };
  }

  return {
    isValid: true,
    isOptimal,
    scalingFactor,
    recommendation,
    message: isOptimal
      ? 'Screen setup is optimal'
      : 'Screen setup could be improved',
  };
};
