"use client";
import React from "react";
import useDivStore from "@/store/UseDivStore";
import DivBoxMaker from "./DivBoxMaker";
import ElementPropertiesPanel from "./ElementPropertiesPanel";
import { FaPlusSquare } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";

export default function PropertiesTab() {
  const {
    parents,
    selectedParentId,
    selectedElementId,
    addParent,
    updateParentSize,
    setSelectedParent,
  } = useDivStore();

  const selectedParent = parents.find((p) => p.id === selectedParentId);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md w-80 max-h-screen overflow-auto border border-gray-200 transition-all duration-300 hover:shadow-xl">
      <h2 className="font-bold mb-4 text-xl text-gray-800">
        <div className="flex items-center gap-2">
          <FaGear /> Settings
        </div>
      </h2>

      {/* Parent Settings (Card Box) */}
      <div className="p-4 mb-4 rounded-xl border border-gray-200 shadow-sm bg-gradient-to-br from-gray-50 to-white transition-all duration-300 hover:shadow-md">
        <h3 className="text-sm font-semibold mb-3 text-gray-600">
          Parent Div
        </h3>

        {/* Add Parent Button */}
        <button
          onClick={() => addParent()}
          className="bg-blue-500 text-white px-3 py-2 rounded-lg mb-4 w-full flex justify-center items-center gap-2 font-semibold transition-all duration-300 hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98]"
        >
          <FaPlusSquare className="text-lg" /> Add Parent Div
        </button>

        {/* Select Parent + Height */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label
              htmlFor=""
              className="text-xs font-medium block mb-1 text-gray-600"
            >
              Select Parent Div:
            </label>
            {parents.length > 0 && (
              <select
                value={selectedParentId || ""}
                onChange={(e) => setSelectedParent(Number(e.target.value))}
                className="border p-2 w-full rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              >
                <option value="">Select Parent</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    Parent {p.id}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Height */}
          <div className="flex-1">
            <label className="text-xs font-medium block mb-1 text-gray-600">
              Div Height (px)
            </label>
            <input
              type="number"
              value={selectedParent?.size.height || ""}
              onChange={(e) =>
                selectedParent && updateParentSize(selectedParent.id, {
                  height: parseInt(e.target.value) || 0,
                })
              }
              className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              placeholder="Height"
              disabled={!selectedParent}
            />
          </div>
        </div>

        {/* Background Options (moved inside same card) */}
        {selectedParent ? (
          <div className="flex gap-3">
            {/* Quick Color */}
            <div className="flex-1">
              <label className="text-xs font-medium block mb-1 text-gray-600">
                Background (Quick Color)
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
                className="w-full h-12 p-1 border rounded-lg cursor-pointer hover:scale-[1.01] transition"
              />
            </div>

            {/* Custom Background */}
            <div className="flex-1">
              <label className="text-xs font-medium block mb-1 text-gray-600">
                Custom Background (hex, rgb, gradient)
              </label>
              <input
                type="text"
                value={selectedParent.size.background}
                onChange={(e) =>
                  updateParentSize(selectedParent.id, {
                    background: e.target.value,
                  })
                }
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                placeholder="e.g. #ff0000 or linear-gradient(45deg, red, blue)"
              />
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic animate-pulse">
            Select a parent to edit its properties
          </p>
        )}
      </div>

      {/* Element Properties Panel - Show when element is selected */}
      {selectedElementId && <ElementPropertiesPanel />}

      {/* Boxes */}
      <DivBoxMaker />

      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-xs font-semibold text-blue-700 mb-2">Instructions:</h4>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>• Click on any element to select and edit its properties</li>
          <li>• Double-click text elements to edit inline</li>
          <li>• Drag elements around inside boxes</li>
          <li>• Use resize handles to adjust size</li>
          <li>• Click image placeholders to upload images</li>
        </ul>
      </div>
    </div>
  );
}