import React from 'react';
import {
  FaDesktop,
  FaLaptop,
  FaTabletAlt,
  FaMobileAlt,
  FaSave,
} from 'react-icons/fa';
import useDivStore from '@/store/UseDivStore';

const ResponsivenessSwitcher = ({
  screenSize: propScreenSize,
  setScreenSize: propSetScreenSize,
  showSaveButton = true, // Default to true for editor
}) => {
  const storeScreenSize = useDivStore((state) => state.screenSize);
  const storeSetScreenSize = useDivStore((state) => state.setScreenSize);
  const copyDesktopToAllScreens = useDivStore(
    (state) => state.copyDesktopToAllScreens
  );

  const screenSize =
    propScreenSize !== undefined ? propScreenSize : storeScreenSize;
  const setScreenSize = propSetScreenSize || storeSetScreenSize;

  const handleSaveToAllScreens = () => {
    copyDesktopToAllScreens();
  };

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

      {showSaveButton && (
        <div className="border-l border-gray-300 ml-1 md:ml-2 pl-1 md:pl-2">
          <button
            onClick={handleSaveToAllScreens}
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
