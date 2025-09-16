'use client';
import React from 'react';

export default function CustomCssPanel({
  selectedElement,
  updateElement,
  parentId,
  boxId,
  elementId,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateElement(parentId, boxId, elementId, { [name]: value });
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Customization</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Class Name
        </label>
        <input
          type="text"
          name="customClassName"
          value={selectedElement.customClassName || ''}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="e.g., my-custom-class"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom CSS
        </label>
        <textarea
          name="customCss"
          value={selectedElement.customCss || ''}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          rows="4"
          placeholder=".my-custom-class { color: red; }"
        ></textarea>
      </div>
      {selectedElement.type === 'button' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Route Link
          </label>
          <input
            type="text"
            name="link"
            value={selectedElement.link || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="e.g., /about"
          />
        </div>
      )}
    </div>
  );
}
