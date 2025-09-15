'use client';
import React, { useState } from 'react';
import useDivStore from '@/store/UseDivStore';

export default function CustomCodeModal({ box, parentId, onClose }) {
  const { updateRndCustomCode } = useDivStore();
  const [html, setHtml] = useState(box.customHtml || '');
  const [css, setCss] = useState(box.customCss || '');

  const handleSave = () => {
    updateRndCustomCode(parentId, box.id, { customHtml: html, customCss: css });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Add Custom Code</h2>
        <div className="grid grid-cols-2 gap-4">
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
              className="w-full h-80 p-2 border rounded-md"
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
              className="w-full h-80 p-2 border rounded-md"
              placeholder=".my-class { color: red; }"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
