import React from 'react';
import { FaDownload } from 'react-icons/fa';

export default function TemplateSidebar({
  selectedTemplate,
  handleLoadTemplate,
  onClose,
}) {
  return (
    <div className="w-80 border-l border-gray-200 p-6 overflow-y-auto bg-gray-50">
      <div className="mb-4">
        <img
          src={selectedTemplate.thumbnail}
          alt={selectedTemplate.name}
          className="w-full h-40 object-cover rounded-lg mb-4"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop';
          }}
        />
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {selectedTemplate.name}
        </h3>
        <p className="text-gray-600 mb-4">{selectedTemplate.description}</p>
      </div>

      {/* Structure */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">
          Template Structure:
        </h4>
        <div className="space-y-2">
          {selectedTemplate.parents?.map((parent, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded-lg border border-gray-200"
            >
              <div className="text-sm font-medium text-gray-700 mb-1">
                Section {index + 1}
              </div>
              <div className="text-xs text-gray-500">
                Height: {parent.size?.height}px
              </div>
              <div className="text-xs text-gray-500">
                Elements:{' '}
                {parent.rnds?.reduce(
                  (total, rnd) => total + (rnd.elements?.length || 0),
                  0
                ) || 0}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => handleLoadTemplate(selectedTemplate.id)}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <FaDownload />
          Load Template
        </button>
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Warning */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          <strong>Note:</strong> Loading a template will replace your current
          content. Make sure to save your work first!
        </p>
      </div>
    </div>
  );
}
