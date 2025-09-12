import AddDivButton from '@/components/DivBoxMakerSection/AddDivButton';
import ElementAdder from '@/components/DivBoxMakerSection/ElementAdder';
import ElementList from '@/components/DivBoxMakerSection/ElementList';
import useDivStore from '@/store/UseDivStore';
import { RxCross1 } from 'react-icons/rx';
import ElementPropertiesPanel from '@/components/ElementPropertiesPanel';
import { IoArrowBack } from 'react-icons/io5';

export default function AddElementPanel({ onClose }) {
  const {
    selectedBoxId,
    selectedParentId,
    parents,
    selectedElementId,
    setSelectedElement,
  } = useDivStore();

  const selectedParent = parents.find((p) => p.id === selectedParentId);
  const selectedBox = selectedParent?.rnds.find(
    (box) => box.id === selectedBoxId
  );

  if (selectedElementId) {
    return (
      <div className="w-96 bg-white h-full shadow-lg p-4 border-t-6 border-blue-700">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setSelectedElement(null)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-500 transition-colors cursor-pointer"
          >
            <IoArrowBack />
            Back
          </button>
          <RxCross1
            size={24}
            className="cursor-pointer hover:text-red-500"
            onClick={onClose}
          />
        </div>
        <ElementPropertiesPanel />
      </div>
    );
  }

  return (
    <div className="w-96 bg-white h-full shadow-lg p-4 border-t-6 border-blue-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Add Elements</h2>
        <RxCross1
          size={24}
          className="cursor-pointer hover:text-red-500"
          onClick={onClose}
        />
      </div>

      {/* Full-width divider */}
      <div className="-mx-4 border-b border-gray-300 mb-4 px-4 py-2"></div>

      <div className="flex flex-col gap-4">
        <AddDivButton parentId={selectedParentId} />
        {selectedBoxId && selectedParentId ? (
          <>
            <ElementAdder parentId={selectedParentId} boxId={selectedBoxId} />
            {selectedBox && (
              <ElementList parentId={selectedParentId} box={selectedBox} />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
            <p className="text-base text-gray-500 italic mt-3 text-center">
              Please select a section in the editor and click anywhere inside{' '}
              <b>dashed box </b>
              to add elements.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
