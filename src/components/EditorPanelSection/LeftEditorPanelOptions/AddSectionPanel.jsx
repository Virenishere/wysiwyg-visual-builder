'use client';
import React from 'react';
import useDivStore from '@/store/UseDivStore';
import SectionsPanel from '@/components/PropertiesTabSection/SectionsPanel';
import { IoAdd } from 'react-icons/io5';

export default function AddSectionPanel() {
  const {
    layouts,
    screenSize,
    selectedParentId,
    setSelectedParent,
    addParent,
  } = useDivStore();

  const parents = layouts[screenSize]?.parents || [];

  return (
    <div className="space-y-4 p-4">
      <button
        onClick={addParent}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        <IoAdd />
        Add New Section
      </button>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-600">
          Manage Sections
        </h3>
        <div className="rounded-lg border">
          <SectionsPanel
            parents={parents}
            selectedParentId={selectedParentId}
            setSelectedParent={setSelectedParent}
          />
        </div>
      </div>
    </div>
  );
}
