"use client";
import React from "react";
import { FaPlusSquare, FaTrash, FaCopy } from "react-icons/fa";

export default function SectionsPanel({ 
  parents, 
  selectedParentId, 
  setSelectedParent, 
  addParent, 
  removeParent, 
  duplicateParent, 
  selectedParent, 
  updateParentSize 
}) {
  return (
    <div className="p-4 mb-4 rounded-xl border border-gray-200 shadow-sm bg-gradient-to-br from-gray-50 to-white transition-all duration-300 hover:shadow-md">
      <h3 className="text-sm font-semibold mb-3 text-gray-600">Page Sections</h3>

      {/* Add Section */}
      <button
        onClick={() => addParent()}
        className="bg-blue-500 text-white px-3 py-2 rounded-lg mb-4 w-full flex justify-center items-center gap-2 font-semibold transition-all duration-300 hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] text-sm"
      >
        <FaPlusSquare className="text-sm" /> Add Section
      </button>

      {/* Section List */}
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

              {/* Background */}
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
  );
}
