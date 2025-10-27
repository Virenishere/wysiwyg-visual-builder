'use client';
import React from 'react';
import useDivStore from '@/store/UseDivStore';
import SectionsPanel from '@/components/PropertiesTabSection/SectionsPanel';
import { IoAdd } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';

export default function AddSectionPanel({ onClose }) {
  const {
    parents,
    selectedParentId,
    setSelectedParent,
    addParent,
    removeParent,
    duplicateParent,
    updateParentSize,
  } = useDivStore();

  const selectedParent = parents.find((p) => p.id === selectedParentId);

  return (
    <div className="w-96 bg-white h-full shadow-lg p-4 border-t-6 border-blue-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Add Section</h2>
        {onClose && (
          <RxCross1
            size={24}
            className="cursor-pointer hover:text-red-500"
            onClick={onClose}
          />
        )}
      </div>

      <div className="-mx-4 border-b border-gray-300 mb-4 px-4 py-2"></div>

      <div className="space-y-4">
        <button
          onClick={() => addParent()}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          <IoAdd />
          Add New Section
        </button>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-600">
            Manage Sections
          </h3>
          <div className="rounded-lg">
            <SectionsPanel
              parents={parents}
              selectedParentId={selectedParentId}
              setSelectedParent={setSelectedParent}
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
