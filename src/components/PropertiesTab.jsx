'use client';
import React, { useState } from 'react';
import useDivStore from '@/store/UseDivStore';
import DivBoxMaker from './DivBoxMaker';
import ElementPropertiesPanel from './ElementPropertiesPanel';
import TemplateSelector from './TemplateSelector';
import { FaGear } from 'react-icons/fa6';
import ActionButtons from './PropertiesTabSection/ActionButtons';
import TemplatesPanel from './PropertiesTabSection/TemplatesPanel';
import SectionsPanel from './PropertiesTabSection/SectionsPanel';
import QuickGuide from './PropertiesTabSection/QuickGuide';

export default function PropertiesTab() {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

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

  const handleExport = () => {
    const data = exportData();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `website-export-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        importData(data);
        alert('Import successful!');
      } catch (error) {
        alert('Error importing file. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md w-80 max-h-screen overflow-auto border border-gray-200 transition-all duration-300 hover:shadow-xl">
      <h2 className="font-bold mb-4 text-xl text-gray-800">
        <div className="flex items-center gap-2">
          <FaGear /> Settings
        </div>
      </h2>

      <ActionButtons />
      <TemplatesPanel
        setIsTemplateModalOpen={setIsTemplateModalOpen}
        handleExport={handleExport}
        handleImport={handleImport}
        resetToDefault={resetToDefault}
      />
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

      {selectedElementId && <ElementPropertiesPanel />}
      <DivBoxMaker />
      <QuickGuide />

      <TemplateSelector
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />
    </div>
  );
}
