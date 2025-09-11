'use client';
import { FiType, FiEdit3 } from 'react-icons/fi';

export default function ContentInput({
  selectedElement,
  updateElement,
  parentId,
  boxId,
  elementId,
}) {
  if (selectedElement.type !== 'text' && selectedElement.type !== 'button')
    return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          {selectedElement.type === 'text' ? (
            <FiType className="w-3.5 h-3.5 text-white" />
          ) : (
            <FiEdit3 className="w-3.5 h-3.5 text-white" />
          )}
        </div>
        <h4 className="text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          {selectedElement.type === 'text' ? 'Content' : 'Button Text'}
        </h4>
      </div>

      <div className="relative group">
        <input
          type="text"
          value={selectedElement.content}
          onChange={(e) =>
            updateElement(parentId, boxId, elementId, {
              content: e.target.value,
            })
          }
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none hover:border-gray-300 group-hover:shadow-md"
          placeholder={
            selectedElement.type === 'text'
              ? 'Enter your text content...'
              : 'Enter button text...'
          }
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
}
