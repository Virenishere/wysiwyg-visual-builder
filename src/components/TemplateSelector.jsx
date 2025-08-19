// components/panels/TemplateSelector.jsx
"use client";
import React, { useState } from 'react';
import { getAllTemplates } from '@/templates';
import { FaTimes, FaDownload, FaEye } from 'react-icons/fa';
import useDivStore from '@/store/UseDivStore';

export default function TemplateSelector({ isOpen, onClose }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { loadTemplate } = useDivStore();
  const templates = getAllTemplates();

  const handleLoadTemplate = (templateId) => {
    loadTemplate(templateId);
    // Auto-select first parent after loading
    setTimeout(() => {
      const state = useDivStore.getState();
      if (state.parents.length > 0) {
        state.setSelectedParent(state.parents[0].id);
      }
    }, 100);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-4xl h-[80%] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Choose a Template</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Template Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedTemplate?.id === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  {/* Template Preview Image */}
                  <div className="mb-4">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop';
                      }}
                    />
                  </div>

                  {/* Template Info */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.description}
                    </p>
                    
                    {/* Template Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{template.parents?.length || 0} Sections</span>
                      <span>
                        {template.parents?.reduce((total, parent) => 
                          total + (parent.rnds?.length || 0), 0
                        ) || 0} Elements
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Here you could add a preview functionality
                        console.log('Preview template:', template.id);
                      }}
                      className="flex-1 py-2 px-3 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                    >
                      <FaEye size={12} />
                      Preview
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoadTemplate(template.id);
                      }}
                      className="flex-1 py-2 px-3 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <FaDownload size={12} />
                      Use This
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Template Details Sidebar */}
          {selectedTemplate && (
            <div className="w-80 border-l border-gray-200 p-6 overflow-y-auto bg-gray-50">
              <div className="mb-4">
                <img
                  src={selectedTemplate.thumbnail}
                  alt={selectedTemplate.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop';
                  }}
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {selectedTemplate.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedTemplate.description}
                </p>
              </div>

              {/* Template Structure */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Template Structure:</h4>
                <div className="space-y-2">
                  {selectedTemplate.parents?.map((parent, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        Section {index + 1}
                      </div>
                      <div className="text-xs text-gray-500">
                        Height: {parent.size?.height}px
                      </div>
                      <div className="text-xs text-gray-500">
                        Elements: {parent.rnds?.reduce((total, rnd) => 
                          total + (rnd.elements?.length || 0), 0
                        ) || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
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
                  <strong>Note:</strong> Loading a template will replace your current content. Make sure to save your work first!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}