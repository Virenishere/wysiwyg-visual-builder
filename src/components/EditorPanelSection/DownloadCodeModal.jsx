'use client';
import React from 'react';
import { RxCross1 } from 'react-icons/rx';

export default function DownloadCodeModal({ onClose, onDownload }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Download Code</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <RxCross1 size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={onDownload}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Download HTML/CSS
          </button>
        </div>
      </div>
    </div>
  );
}
