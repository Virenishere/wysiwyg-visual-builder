"use client";
import React, { useState } from "react";
import { getAllTemplates } from "@/templates";
import useDivStore from "@/store/UseDivStore";
import TemplateGrid from "@/components/TemplateSelectorSection/TemplateGrid";
import TemplateSidebar from "@/components/TemplateSelectorSection/TemplateSidebar";

export default function TemplatePreview() {
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
  };

  return (
    <div className="flex flex-col min-h-screen w-full justify-center items-center">
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
