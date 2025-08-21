"use client";
import { useEffect, useState, use } from "react";
import * as templates from "@/templates";
import GlobalLoader from "@/components/GlobalLoader";
import DivComponent from "@/components/DivComponent";
import useDivStore from "@/store/UseDivStore";
import LeftEditorPanel from "@/components/EditorPanelSection/LeftEditorPanel";
import RightEditorPanel from "@/components/EditorPanelSection/RightEditorPanel";

const TemplatePage = ({ params }) => {
  const messages = [
    "Loading template...",
    "Preparing the editor...",
    "Fetching components...",
    "Applying template styles...",
  ];

  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const { templateName } = resolvedParams;

  const { importData } = useDivStore();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);

  // Helper function to get template by ID - you'll need to implement this
  const getTemplateById = (templateId) => {
    // Convert template name back to ID format
    const templateIdMap = {
      "landing-page": "landing",
      "about-page": "about",
      "contact-page": "contact",
      "services-page": "services",
      testimonials: "testimonial",
      products: "products",
    };

    const actualId = templateIdMap[templateId] || templateId;
    return templates.getTemplateById(actualId);
  };

  useEffect(() => {
    const loadTemplate = () => {
      const template = getTemplateById(templateName);
      if (template) {
        importData(template);
      } else {
        console.error("Template not found:", templateName);
      }
    };

    if (templateName) {
      loadTemplate();
      // Reset loading state when template changes
      setLoading(true);
      setStep(0);
    }
  }, [templateName, importData]);

  useEffect(() => {
    let timer;
    if (loading) {
      if (step < messages.length) {
        timer = setTimeout(() => {
          setStep((prev) => prev + 1);
        }, 1000);
      } else {
        timer = setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    }
    return () => clearTimeout(timer);
  }, [step, loading, messages.length]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <GlobalLoader />
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          {messages[step] || messages[messages.length - 1]}
        </p>
      </div>
    );
  }

  return (
    <div className="flex ">
      <LeftEditorPanel />
      

      <DivComponent key={templateName} />
      
      <RightEditorPanel />
    </div>
  );
};

export default TemplatePage;
