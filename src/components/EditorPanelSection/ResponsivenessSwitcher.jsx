import React from 'react';
import { FaDesktop, FaLaptop, FaTabletAlt, FaMobileAlt } from 'react-icons/fa';
import useDivStore from '@/store/UseDivStore';

const screenSizes = {
  desktop: '100%',
  laptop: '1366px',
  tablet: '768px',
  mobile: '375px',
};

const ResponsivenessSwitcher = ({
  screenSize: propScreenSize,
  setScreenSize: propSetScreenSize,
}) => {
  const storeScreenSize = useDivStore((state) => state.screenSize);
  const storeSetScreenSize = useDivStore((state) => state.setScreenSize);

  const screenSize =
    propScreenSize !== undefined ? propScreenSize : storeScreenSize;
  const setScreenSize = propSetScreenSize || storeSetScreenSize;

  return (
    <div className="fixed bottom-4 right-1/2 translate-x-1/2 z-50 bg-white shadow-lg rounded-lg p-2 flex items-center gap-2">
      <button
        onClick={() => setScreenSize('desktop')}
        className={`p-2 rounded-md ${
          screenSize === 'desktop'
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-100'
        }`}
        title="Desktop"
      >
        <FaDesktop size={20} />
      </button>
      <button
        onClick={() => setScreenSize('laptop')}
        className={`p-2 rounded-md ${
          screenSize === 'laptop'
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-100'
        }`}
        title="Laptop"
      >
        <FaLaptop size={20} />
      </button>
      <button
        onClick={() => setScreenSize('tablet')}
        className={`p-2 rounded-md ${
          screenSize === 'tablet'
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-100'
        }`}
        title="Tablet"
      >
        <FaTabletAlt size={20} />
      </button>
      <button
        onClick={() => setScreenSize('mobile')}
        className={`p-2 rounded-md ${
          screenSize === 'mobile'
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-100'
        }`}
        title="Mobile"
      >
        <FaMobileAlt size={20} />
      </button>
    </div>
  );
};

export default ResponsivenessSwitcher;
