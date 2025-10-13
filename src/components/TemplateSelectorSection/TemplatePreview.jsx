'use client';
import React, { useState, useEffect } from 'react';
import { getAllTemplates } from '@/templates';
import useDivStore from '@/store/UseDivStore';
import TemplateGrid from '@/components/TemplateSelectorSection/TemplateGrid';
import TemplateSidebar from '@/components/TemplateSelectorSection/TemplateSidebar';
import { useRouter } from 'next/navigation';

export default function TemplatePreview() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { loadTemplate, createNewTemplate } = useDivStore();
  const [templates, setTemplates] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const savedTemplates = JSON.parse(
      localStorage.getItem('savedTemplates') || '{}'
    );
    const customTemplates = Object.values(savedTemplates);
    const defaultTemplates = getAllTemplates();
    setTemplates([...defaultTemplates, ...customTemplates]);
  }, []);

  const handleLoadTemplate = (templateId) => {
    loadTemplate(templateId);
    router.push(`/edit/${templateId}`);
  };

  const handleCreateNew = () => {
    createNewTemplate();
    router.push('/edit/new-template');
  };

  return (
    <div
      className="flex flex-col w-full justify-center items-center"
      style={{ minHeight: '100vh' }}
    >
      <div className="w-full flex justify-end px-16 pt-4">
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Create New Template
        </button>
      </div>
      <div className="text-center space-y-4 my-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-3">
          Welcome, <span className="text-blue-600">Viren!</span>
        </h2>

        <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Let’s start building your website with modern tools, stunning
          templates, and content that truly matches your brand. You can also
          upload your own custom design.
        </p>
      </div>

      <div className="w-full px-16">
        <TemplateGrid
          templates={templates}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          handleLoadTemplate={handleLoadTemplate}
        />
        {/* {selectedTemplate && (
          <TemplateSidebar
            selectedTemplate={selectedTemplate}
            handleLoadTemplate={handleLoadTemplate}
          />
        )} */}
      </div>
    </div>
  );
}
