import { RxCross1 } from 'react-icons/rx';
import { GoPlus } from 'react-icons/go';
import SectionsPanel from '@/components/PropertiesTabSection/SectionsPanel';
import useDivStore from '@/store/UseDivStore';

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
        <button
          onClick={() => addParent()}
          className="relative flex items-center justify-center gap-2 cursor-pointer group"
        >
          {/* ✅ Icon with hover color */}
          <GoPlus className="text-blue-800 group-hover:text-blue-500" />

          {/* ✅ Label text */}
          <span className="text-blue-800">Blank Section</span>

          {/* ✅ Tooltip */}
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
            Adds a new blank section to create page
          </span>
        </button>

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
