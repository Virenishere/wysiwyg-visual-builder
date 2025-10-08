'use client';
import React, { useState } from 'react';
import useDivStore from '@/store/UseDivStore';
import { IoArrowBack } from 'react-icons/io5';

export default function CustomCodePanel({ box, parentId, onBack }) {
  const { updateRndCustomCode, saveState } = useDivStore();
  const [html, setHtml] = useState(box.customHtml || '');
  const [css, setCss] = useState(box.customCss || '');

  const handleSave = () => {
    updateRndCustomCode(parentId, box.id, { customHtml: html, customCss: css });
    saveState();
    onBack();
  };

  return (
    <div className="fixed top-0 left-0 w-96 bg-white h-full shadow-lg p-4 border-t-6 border-blue-700">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-500 transition-colors cursor-pointer"
        >
          <IoArrowBack />
          Back
        </button>
        <h2 className="text-lg font-bold">Custom Code</h2>
      </div>

      <div className="-mx-4 border-b border-gray-300 mb-4 px-4 py-2"></div>

      <div className="flex flex-col space-y-4">
        <div>
          <label
            htmlFor="html-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Custom HTML
          </label>
          <textarea
            id="html-input"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="w-full h-48 p-2 border rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="<div>...</div>"
          />
        </div>
        <div>
          <label
            htmlFor="css-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Custom CSS
          </label>
          <textarea
            id="css-input"
            value={css}
            onChange={(e) => setCss(e.target.value)}
            className="w-full h-48 p-2 border rounded-md bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder=".my-class { color: red; }"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
}
