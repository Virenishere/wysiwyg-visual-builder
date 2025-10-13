'use client';
import React from 'react';
import { RxCross1 } from 'react-icons/rx';

const ScreenSizeWarning = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Check Element Positions
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <RxCross1 size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-6 leading-relaxed">
          You&apos;ve ve changed the screen size. Please check if all elements
          are placed correctly within the section panels.
        </p>
        <p className="text-gray-600 mb-6 leading-relaxed">
          If you see any elements outside the sections, simply drag them from
          the right edge back inside.
        </p>
        <div className="flex justify-center">
          <button
            onClick={onConfirm}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScreenSizeWarning;
