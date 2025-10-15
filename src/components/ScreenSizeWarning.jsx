'use client';
import React from 'react';
import { RxCross1 } from 'react-icons/rx';

const ScreenSizeWarning = ({ onClose, onConfirm, onDisableAll }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Check Element Positions
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer  "
          >
            <RxCross1 size={20} />
          </button>
        </div>

        {/* Body */}
        <p className="text-gray-600 mb-4 leading-relaxed">
          You&#39;ve changed the screen size. Please check if all elements are
          placed correctly within the section panels.
        </p>
        <p className="text-gray-600 mb-6 leading-relaxed">
          If you see any elements outside the sections, simply drag them back
          inside.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-row justify-center gap-3">
          <button
            onClick={onConfirm}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
          >
            Got it!
          </button>

          <button
            onClick={onDisableAll}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
          >
            Don&#39;t show again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScreenSizeWarning;
