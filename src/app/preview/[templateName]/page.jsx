"use client";
import { useEffect, useState } from "react";
import * as templates from "@/templates";
import GlobalLoader from "@/components/GlobalLoader";

import PreviewComponent from "@/components/PreviewComponent";

const PreviewPage = ({ params }) => {
  const { templateName } = params;
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    const loadTemplate = () => {
      const templateKey = Object.keys(templates.templateRegistry).find(
        (key) =>
          templates.templateRegistry[key].name.toLowerCase().replace(/\s/g, "-") ===
          templateName
      );

      const templateData = templates.templateRegistry[templateKey];

      if (templateData) {
        setTemplate(templateData);
      }
    };
    loadTemplate();
  }, [templateName]);

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <GlobalLoader />
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          Loading template...
        </p>
      </div>
    );
  }

  return <PreviewComponent parents={template.parents} />;
};

export default PreviewPage;
