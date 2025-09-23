import { RxCross1 } from 'react-icons/rx';
import { GoPlus } from 'react-icons/go';
import SectionsPanel from '@/components/PropertiesTabSection/SectionsPanel';
import useDivStore from '@/store/UseDivStore';
import { useState } from 'react';

export default function AddSectionPanel({ onClose }) {
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

  const [height, setHeight] = useState(300);

  const selectedParent = parents.find((p) => p.id === selectedParentId);

  return (
    <div className="w-96 bg-white h-full shadow-lg p-4 border-t-6 border-blue-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Add Section</h2>
        <RxCross1 size={24} className="cursor-pointer" onClick={onClose} />
      </div>
      {/* Full-width divider */}
      <div className="-mx-4 border-b border-gray-300 mb-4"></div>
      <div>
        <div className="flex items-center gap-4 mb-4">
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            placeholder="Section Height (e.g., 300)"
          />
          <button
            onClick={() => addParent(height)}
            className="relative flex items-center justify-center gap-2 cursor-pointer group whitespace-nowrap bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            <GoPlus className="text-white" />
            <span className="text-white">Add Blank Section</span>
          </button>
        </div>

        <div className="my-4 w-full">
          <h2>Pick a section from the editor panel to start editing.</h2>
          <div className="">
            <div className="my-2">
              <label className="text-xs font-semibold block mb-3 text-gray-700 uppercase tracking-wide">
                Current Sections ({parents.length})
              </label>
            </div>
            <SectionsPanel
              parents={parents}
              selectedParentId={selectedParentId}
              setSelectedParent={setSelectedParent}
              addParent={addParent}
              removeParent={removeParent}
              duplicateParent={duplicateParent}
              selectedParent={selectedParent}
              updateParentSize={updateParentSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
