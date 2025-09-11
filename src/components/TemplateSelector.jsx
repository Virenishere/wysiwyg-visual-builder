'use client';
import React, { useState } from 'react';
import { getAllTemplates } from '@/templates';
import useDivStore from '@/store/UseDivStore';
import TemplateHeader from './TemplateSelectorSection/TemplateHeader';
import TemplateGrid from './TemplateSelectorSection/TemplateGrid';
import TemplateSidebar from './TemplateSelectorSection/TemplateSidebar';

export default function TemplateSelector({ isOpen, onClose }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { loadTemplate } = useDivStore();
  const templates = getAllTemplates();

  const handleLoadTemplate = (templateId) => {
    loadTemplate(templateId);
    setTimeout(() => {
      const state = useDivStore.getState();
      if (state.parents.length > 0) {
        state.setSelectedParent(state.parents[0].id);
      }
    }, 100);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-4xl h-[80%] flex flex-col">
        <TemplateHeader onClose={onClose} />
        <div className="flex flex-1 overflow-hidden">
          <TemplateGrid
            templates={templates}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            handleLoadTemplate={handleLoadTemplate}
          />
          {selectedTemplate && (
            <TemplateSidebar
              selectedTemplate={selectedTemplate}
              handleLoadTemplate={handleLoadTemplate}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
