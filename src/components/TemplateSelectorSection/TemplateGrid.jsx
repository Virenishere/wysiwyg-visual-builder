import React from 'react';
import TemplateCard from './TemplateCard';

export default function TemplateGrid({
  templates,
  selectedTemplate,
  setSelectedTemplate,
  handleLoadTemplate,
}) {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate?.id === template.id}
            onSelect={setSelectedTemplate}
            onLoad={handleLoadTemplate}
          />
        ))}
      </div>
    </div>
  );
}
