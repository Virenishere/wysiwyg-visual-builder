"use client";
import React from "react";
import { FaTrash, FaCopy } from "react-icons/fa";

export default function SectionsPanel({ 
  parents, 
  selectedParentId, 
  setSelectedParent, 
  removeParent, 
  duplicateParent, 
  selectedParent, 
  updateParentSize 
}) {
  return (
    <div className="h-screen w-full flex flex-col ">
      {/* Section List */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        

        {parents.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {parents.map((parent, index) => (
              <div
                key={parent.id}
                className={`h-24 flex flex-col justify-between p-3 rounded-xl border shadow-sm cursor-pointer transition-all duration-200 ${
                  selectedParentId === parent.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow"
                }`}
                onClick={() => setSelectedParent(parent.id)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">
                    Section {index + 1}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateParent(parent.id);
                      }}
                      className="text-blue-500 hover:text-blue-700 p-1 rounded-md hover:bg-blue-100 transition"
                      title="Duplicate Section"
                    >
                      <FaCopy size={13} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete this section?")) {
                          removeParent(parent.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-100 transition"
                      title="Delete Section"
                    >
                      <FaTrash size={13} />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Height: {parent.size.height}px • {parent.rnds?.length || 0} boxes
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
            <p className="text-lg text-gray-400 italic mt-2">No sections added yet.</p>
          </div>
          
        )}
      </div>

      {/* Section Properties */}
      {selectedParent && (
        <div className="border-t border-gray-200 bg-white px-3 py-4 shadow-inner">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Section Properties
          </h4>

          <div className="space-y-4">
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
                className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm transition"
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
                className="w-full h-10 p-1 border border-gray-300 rounded-lg cursor-pointer hover:scale-[1.01] transition"
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
                className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-xs transition"
                placeholder="e.g. linear-gradient(45deg, red, blue)"
                rows={2}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
