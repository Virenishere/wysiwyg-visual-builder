'use client';
import React from 'react';
import { FaFileExport, FaFileImport, FaTrash } from 'react-icons/fa';
import TemplateSelector from '../TemplateSelector';

export default function TemplatesPanel({
  setIsTemplateModalOpen,
  handleExport,
  handleImport,
  resetToDefault,
}) {
  return (
    <div className="p-4 mb-4 rounded-xl border border-blue-200 shadow-sm bg-gradient-to-br from-blue-50 to-white">
      <h3 className="text-sm font-semibold mb-3 text-blue-600">
        Templates & Data
      </h3>

      <div className="grid grid-cols-1 gap-2">
        <button
          onClick={() => setIsTemplateModalOpen(true)}
          className="bg-blue-500 text-white px-3 py-2 rounded-lg w-full flex justify-center items-center gap-2 font-semibold transition-all duration-300 hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] text-sm"
        >
          <TemplateSelector className="text-sm" /> Choose Template
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExport}
            className="bg-indigo-500 text-white px-2 py-2 rounded-lg flex justify-center items-center gap-1 font-semibold transition-all duration-300 hover:bg-indigo-600 hover:scale-[1.02] active:scale-[0.98] text-xs"
          >
            <FaFileExport className="text-xs" /> Export
          </button>

          <label className="bg-orange-500 text-white px-2 py-2 rounded-lg flex justify-center items-center gap-1 font-semibold transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] text-xs cursor-pointer">
            <FaFileImport className="text-xs" /> Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        <button
          onClick={() => {
            if (
              confirm(
                'Are you sure you want to reset? This will delete all current content.'
              )
            ) {
              resetToDefault();
            }
          }}
          className="bg-red-500 text-white px-3 py-2 rounded-lg w-full flex justify-center items-center gap-2 font-semibold transition-all duration-300 hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] text-sm"
        >
          <FaTrash className="text-sm" /> Reset All
        </button>
      </div>

      <p className="text-xs text-blue-600 mt-2 italic">
        Choose from professional templates or manage your data
      </p>
    </div>
  );
}
