// components/panels/PropertiesTab.jsx
"use client";
import React, { useState } from "react";
import useDivStore from "@/store/UseDivStore";
import DivBoxMaker from "./DivBoxMaker";
import ElementPropertiesPanel from "./ElementPropertiesPanel";
import TemplateSelector from "./TemplateSelector";
import { FaPlusSquare, FaDownload, FaTrash, FaUpload, FaFileExport, FaFileImport, FaCopy } from "react-icons/fa";
import { FaGear, FaGlobe } from "react-icons/fa6";
import { MdRemoveRedEye, MdTemplate } from "react-icons/md";
import Link from "next/link";

export default function PropertiesTab() {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  const {
    parents,
    selectedParentId,
    selectedElementId,
    addParent,
    removeParent,
    updateParentSize,
    setSelectedParent,
    resetToDefault,
    exportData,
    importData,
    duplicateParent,
  } = useDivStore();

  const selectedParent = parents.find((p) => p.id === selectedParentId);

  const handleExport = () => {
    const data = exportData();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `website-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        importData(data);
        alert('Import successful!');
      } catch (error) {
        alert('Error importing file. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md w-80 max-h-screen overflow-auto border border-gray-200 transition-all duration-300 hover:shadow-xl">
      <h2 className="font-bold mb-4 text-xl text-gray-800">
        <div className="flex items-center gap-2">
          <FaGear /> Settings
        </div>
      </h2>
      
      {/* Action Buttons Row */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Link 
          href='/test'
          className="flex items-center justify-center bg-purple-500 px-3 py-2 gap-2 rounded-lg text-white font-semibold hover:bg-purple-600 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-xs"
        >
          <MdRemoveRedEye />
          Preview
        </Link>
        
        <button className="bg-green-500 flex items-center justify-center px-3 py-2 gap-2 rounded-lg text-white font-semibold hover:bg-green-600 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-xs">
          <FaGlobe />
          Publish
        </button>
      </div>

      {/* Template & Import/Export Actions */}
      <div className="p-4 mb-4 rounded-xl border border-blue-200 shadow-sm bg-gradient-to-br from-blue-50 to-white">
        <h3 className="text-sm font-semibold mb-3 text-blue-600">Templates & Data</h3>
        
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
              if (confirm('Are you sure you want to reset? This will delete all current content.')) {
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

      {/* Parent Settings */}
      <div className="p-4 mb-4 rounded-xl border border-gray-200 shadow-sm bg-gradient-to-br from-gray-50 to-white transition-all duration-300 hover:shadow-md">
        <h3 className="text-sm font-semibold mb-3 text-gray-600">Page Sections</h3>

        {/* Add Parent Button */}
        <button
          onClick={() => addParent()}
          className="bg-blue-500 text-white px-3 py-2 rounded-lg mb-4 w-full flex justify-center items-center gap-2 font-semibold transition-all duration-300 hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] text-sm"
        >
          <FaPlusSquare className="text-sm" /> Add Section
        </button>

        {/* Parent List & Controls */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium block mb-2 text-gray-600">
              Current Sections ({parents.length}):
            </label>
            {parents.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {parents.map((parent, index) => (
                  <div
                    key={parent.id}
                    className={`p-2 rounded-lg border cursor-pointer transition-all ${
                      selectedParentId === parent.id
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedParent(parent.id)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Section {index + 1}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateParent(parent.id);
                          }}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          title="Duplicate Section"
                        >
                          <FaCopy size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Delete this section?')) {
                              removeParent(parent.id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete Section"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Height: {parent.size.height}px • {parent.rnds?.length || 0} boxes
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section Properties */}
          {selectedParent && (
            <div className="pt-3 border-t border-gray-200">
              <h4 className="text-xs font-semibold text-gray-600 mb-2">
                Section Properties:
              </h4>
              
              <div className="space-y-3">
                {/* Height */}
                <div>
                  <label className="text-xs font-medium block mb-1 text-gray-600">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={selectedParent.size.height}
                    onChange={(e) =>
                      updateParentSize(selectedParent.id, {
                        height: parseInt(e.target.value) || 0,
                      })
                    }
                    className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  />
                </div>

                {/* Background Color */}
                <div>
                  <label className="text-xs font-medium block mb-1 text-gray-600">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={
                      selectedParent.size.background.startsWith("linear")
                        ? "#000000"
                        : selectedParent.size.background
                    }
                    onChange={(e) =>
                      updateParentSize(selectedParent.id, {
                        background: e.target.value,
                      })
                    }
                    className="w-full h-10 p-1 border rounded-lg cursor-pointer hover:scale-[1.01] transition"
                  />
                </div>

                {/* Custom Background */}
                <div>
                  <label className="text-xs font-medium block mb-1 text-gray-600">
                    Custom Background (CSS)
                  </label>
                  <textarea
                    value={selectedParent.size.background}
                    onChange={(e) =>
                      updateParentSize(selectedParent.id, {
                        background: e.target.value,
                      })
                    }
                    className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-xs"
                    placeholder="e.g. linear-gradient(45deg, red, blue)"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Element Properties Panel - Show when element is selected */}
      {selectedElementId && <ElementPropertiesPanel />}

      {/* Boxes */}
      <DivBoxMaker />

      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-xs font-semibold text-blue-700 mb-2">
          Quick Guide:
        </h4>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>• Choose a template to get started quickly</li>
          <li>• Click on any element to select and edit</li>
          <li>• Double-click text elements to edit inline</li>
          <li>• Drag elements around inside boxes</li>
          <li>• Use resize handles to adjust sizes</li>
          <li>• Export your work to save progress</li>
        </ul>
      </div>

      {/* Template Selector Modal */}
      <TemplateSelector 
        isOpen={isTemplateModalOpen} 
        onClose={() => setIsTemplateModalOpen(false)} 
      />
    </div>
  );
}