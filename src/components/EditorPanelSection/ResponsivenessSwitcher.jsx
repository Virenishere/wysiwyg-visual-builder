import React, { useEffect } from 'react';
import {
  FaDesktop,
  FaLaptop,
  FaTabletAlt,
  FaMobileAlt,
  FaSave,
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
} from 'react-icons/fa';
import useDivStore from '@/store/UseDivStore';

const ResponsivenessSwitcher = ({
  screenSize: propScreenSize,
  setScreenSize: propSetScreenSize,
  showSaveButton = true, // Default to true for editor
}) => {
  const storeScreenSize = useDivStore((state) => state.screenSize);
  const storeSetScreenSize = useDivStore((state) => state.setScreenSize);
  const copyCurrentScreenToAll = useDivStore(
    (state) => state.copyCurrentScreenToAll
  );

  const screenSize =
    propScreenSize !== undefined ? propScreenSize : storeScreenSize;
  const setScreenSize = propSetScreenSize || storeSetScreenSize;

  // Set default screen size to 4k when component mounts (for new projects)
  useEffect(() => {
    if (!screenSize || screenSize === '') {
      setScreenSize('4k');
    }
  }, []);

  const handleSave = () => {
    copyCurrentScreenToAll();
  };

  // Mobile screen zoom state
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [isZoomControlsVisible, setIsZoomControlsVisible] =
    React.useState(false);

  // Show zoom controls only on mobile screens
  React.useEffect(() => {
    const isMobileScreen = ['mobile', 'mobile-m', 'mobile-s'].includes(
      screenSize
    );
    setIsZoomControlsVisible(isMobileScreen);
    if (!isMobileScreen) {
      setZoomLevel(1); // Reset zoom when switching away from mobile
    }
  }, [screenSize]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Apply zoom to editor container
  React.useEffect(() => {
    if (isZoomControlsVisible) {
      // Find the main container that holds the DivComponent
      const mainContainer = document.querySelector('main.flex-1');
      // Find the inner container that holds the DivComponent (the white container with shadow)
      const editorContainer = document.querySelector(
        'div.h-full.max-h-full.shadow-2xl, div.bg-white.shadow-2xl, div[style*="width"][style*="min("]'
      );

      if (mainContainer && editorContainer) {
        // Apply scrolling to the main container when zoomed
        if (zoomLevel > 1) {
          // Get the original dimensions of the content
          const originalWidth =
            editorContainer.scrollWidth || editorContainer.offsetWidth;
          const originalHeight =
            editorContainer.scrollHeight || editorContainer.offsetHeight;

          // Calculate the zoomed dimensions
          const zoomedWidth = originalWidth * zoomLevel;
          const zoomedHeight = originalHeight * zoomLevel;

          // Set the main container to accommodate the zoomed content
          mainContainer.style.overflow = 'auto';
          mainContainer.style.scrollBehavior = 'smooth';
          mainContainer.style.position = 'relative';

          // Apply zoom to the inner container with top-left origin for better scrolling
          editorContainer.style.transform = `scale(${zoomLevel})`;
          editorContainer.style.transformOrigin = 'top left';
          editorContainer.style.transition = 'transform 0.3s ease';

          // Set minimum dimensions on the main container to ensure full scrollable area
          mainContainer.style.minWidth = `${zoomedWidth}px`;
          mainContainer.style.minHeight = `${zoomedHeight}px`;

          // Create padding to ensure we can scroll to see all content
          const paddingX = (zoomedWidth - originalWidth) / 2;
          const paddingY = (zoomedHeight - originalHeight) / 2;

          mainContainer.style.paddingRight = `${paddingX}px`;
          mainContainer.style.paddingBottom = `${paddingY}px`;

          // Add custom scrollbar styling for better UX
          const style = document.createElement('style');
          style.textContent = `
            main.flex-1::-webkit-scrollbar {
              width: 12px;
              height: 12px;
            }
            main.flex-1::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 6px;
            }
            main.flex-1::-webkit-scrollbar-thumb {
              background: #c1c1c1;
              border-radius: 6px;
              border: 2px solid #f1f1f1;
            }
            main.flex-1::-webkit-scrollbar-thumb:hover {
              background: #a8a8a8;
            }
            main.flex-1::-webkit-scrollbar-corner {
              background: #f1f1f1;
            }
          `;

          // Remove existing style if present
          const existingStyle = document.getElementById('zoom-scrollbar-style');
          if (existingStyle) {
            existingStyle.remove();
          }

          style.id = 'zoom-scrollbar-style';
          document.head.appendChild(style);
        } else {
          // Reset all styles when zoom is 100% or less
          mainContainer.style.overflow = 'hidden';
          mainContainer.style.position = '';
          mainContainer.style.minWidth = '';
          mainContainer.style.minHeight = '';
          mainContainer.style.paddingRight = '';
          mainContainer.style.paddingBottom = '';

          // Reset editor container transform
          editorContainer.style.transform = '';
          editorContainer.style.transformOrigin = '';
          editorContainer.style.transition = '';

          // Remove scrollbar styling when not zoomed
          const existingStyle = document.getElementById('zoom-scrollbar-style');
          if (existingStyle) {
            existingStyle.remove();
          }
        }
      } else {
        console.warn(
          'Editor containers not found for zoom functionality. Main:',
          !!mainContainer,
          'Editor:',
          !!editorContainer
        );
      }
    }
  }, [zoomLevel, isZoomControlsVisible]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-1 md:p-2 flex items-center gap-1 md:gap-2 max-w-[90vw] overflow-x-auto">
      <button
        onClick={() => setScreenSize('4k')}
        className={`p-1 md:p-2 rounded-md ${
          screenSize === '4k' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
        }`}
        title="Desktop (4K)"
      >
        <FaDesktop size={16} className="md:w-5 md:h-5" />
      </button>
      <button
        onClick={() => setScreenSize('l-laptop')}
        className={`p-1 md:p-2 rounded-md ${
          screenSize === 'l-laptop'
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-100'
        }`}
        title="Large Laptop"
      >
        <FaLaptop size={16} className="md:w-5 md:h-5" />
      </button>
      <button
        onClick={() => setScreenSize('laptop')}
        className={`p-1 md:p-2 rounded-md ${
          screenSize === 'laptop'
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-100'
        }`}
        title="Laptop"
      >
        <FaLaptop size={14} className="md:w-4 md:h-4" />
      </button>
      <button
        onClick={() => setScreenSize('tablet')}
        className={`p-1 md:p-2 rounded-md ${
          screenSize === 'tablet'
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-100'
        }`}
        title="Tablet"
      >
        <FaTabletAlt size={16} className="md:w-5 md:h-5" />
      </button>
      <button
        onClick={() => setScreenSize('mobile')}
        className={`p-1 md:p-2 rounded-md ${
          screenSize === 'mobile'
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-100'
        }`}
        title="Mobile"
      >
        <FaMobileAlt size={16} className="md:w-5 md:h-5" />
      </button>
      <button
        onClick={() => setScreenSize('mobile-m')}
        className={`p-1 md:p-2 rounded-md ${
          screenSize === 'mobile-m'
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-100'
        }`}
        title="Mobile Medium"
      >
        <FaMobileAlt size={14} className="md:w-4 md:h-4" />
      </button>
      <button
        onClick={() => setScreenSize('mobile-s')}
        className={`p-1 md:p-2 rounded-md ${
          screenSize === 'mobile-s'
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-100'
        }`}
        title="Mobile Small"
      >
        <FaMobileAlt size={12} className="md:w-3 md:h-3" />
      </button>

      {/* Zoom Controls - Only visible on mobile screens */}
      {isZoomControlsVisible && (
        <div className="border-l border-gray-300 ml-1 md:ml-2 pl-1 md:pl-2 flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            className="p-1 md:p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Zoom Out"
            disabled={zoomLevel <= 1}
          >
            <FaSearchMinus size={12} className="md:w-4 md:h-4" />
          </button>
          <span className="text-xs font-medium min-w-[3rem] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1 md:p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Zoom In"
            disabled={zoomLevel >= 2}
          >
            <FaSearchPlus size={12} className="md:w-4 md:h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1 md:p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Reset Zoom"
          >
            <FaExpand size={12} className="md:w-4 md:h-4" />
          </button>
        </div>
      )}

      {showSaveButton && (
        <div className="border-l border-gray-300 ml-1 md:ml-2 pl-1 md:pl-2">
          <button
            onClick={handleSave}
            className="p-1 md:p-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
            title="Copy current layout to all screen sizes"
          >
            <FaSave size={16} className="md:w-5 md:h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ResponsivenessSwitcher;
