'use client';
import { useState, useEffect } from 'react';
import { FiLayers, FiCode } from 'react-icons/fi';

export default function CustomizationPanel({
  selectedElement,
  updateElement,
  parentId,
  boxId,
  elementId,
}) {
  const [customCss, setCustomCss] = useState('');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (selectedElement.customStyles) {
      setCustomCss(JSON.stringify(selectedElement.customStyles, null, 2));
    } else {
      setCustomCss('');
    }
  }, [selectedElement.customStyles]);

  const handleZIndexChange = (e) => {
    updateElement(parentId, boxId, elementId, {
      zIndex: Number(e.target.value) || 0,
    });
  };

  const handleCustomCssChange = (e) => {
    const newCss = e.target.value;
    setCustomCss(newCss);
    try {
      const parsedCss = JSON.parse(newCss);
      updateElement(parentId, boxId, elementId, { customStyles: parsedCss });
      setIsValid(true);
    } catch (error) {
      if (newCss === '') {
        updateElement(parentId, boxId, elementId, { customStyles: {} });
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
          <FiLayers className="w-3.5 h-3.5 text-white" />
        </div>
        <h4 className="text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          Advanced
        </h4>
      </div>

      <div className="space-y-4">
        {/* Z-Index */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Z-Index
          </label>
          <input
            type="number"
            value={selectedElement.zIndex || 0}
            onChange={handleZIndexChange}
            className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm"
          />
        </div>

        {/* Custom CSS */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Custom Styles (JSON)
          </label>
          <textarea
            value={customCss}
            onChange={handleCustomCssChange}
            className={`w-full px-4 py-2 bg-white border-2 rounded-xl text-sm font-mono ${
              isValid ? 'border-gray-200' : 'border-red-500'
            }`}
            rows="5"
            placeholder={`{
  "transform": "rotate(10deg)",
  "boxShadow": "10px 10px 5px 0px rgba(0,0,0,0.75)"
}`}
          />
          {!isValid && (
            <p className="text-xs text-red-500 mt-1">Invalid JSON format.</p>
          )}
        </div>
      </div>
    </div>
  );
}
