"use client"
import { FiSquare, FiCircle } from "react-icons/fi"

export default function BorderEffects({ selectedElement, updateElement, parentId, boxId, elementId }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
          <FiSquare className="w-3.5 h-3.5 text-white" />
        </div>
        <h4 className="text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          Border & Effects
        </h4>
      </div>

      <div className="space-y-4">
        {/* Border Radius Slider */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiCircle className="w-4 h-4" />
              Border Radius
            </label>
            <span className="px-2 py-1 bg-white rounded-lg text-xs font-bold text-gray-600 border">
              {selectedElement.borderRadius}px
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="50"
              value={selectedElement.borderRadius}
              onChange={(e) =>
                updateElement(parentId, boxId, elementId, { borderRadius: Number.parseInt(e.target.value) || 0 })
              }
              className="w-full h-2 bg-gradient-to-r from-emerald-200 to-teal-300 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Border Style */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <label className="text-sm font-medium text-gray-700 mb-3 block">Border Style</label>
          <select
            value={selectedElement.border}
            onChange={(e) => updateElement(parentId, boxId, elementId, { border: e.target.value })}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:outline-none hover:border-gray-300 cursor-pointer"
          >
            <option value="none">✨ No Border</option>
            <option value="1px solid #000">━ 1px Solid</option>
            <option value="2px solid #000">━ 2px Solid</option>
            <option value="1px dashed #000">┅ 1px Dashed</option>
            <option value="2px dashed #000">┅ 2px Dashed</option>
            <option value="1px dotted #000">⋯ 1px Dotted</option>
          </select>
        </div>
      </div>
    </div>
  )
}
