'use client';
import { useEffect, useState } from 'react';
import * as templates from '@/templates';
import GlobalLoader from '@/components/GlobalLoader';
import PreviewComponent from '@/components/PreviewComponent';

import ResponsivenessSwitcher from '@/components/EditorPanelSection/ResponsivenessSwitcher';
import { screenSizes } from '@/utils/screen';

const PreviewPage = ({ params }) => {
  const messages = [
    'Loading template...',
    'Preparing the editor...',
    'Fetching components...',
    'Applying template styles...',
  ];

  const { templateName } = params;
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const loadTemplateData = () => {
      const templateKey = Object.keys(templates.templateRegistry).find(
        (key) => key === templateName
      );
      let templateData = templates.templateRegistry[templateKey];

      if (!templateData) {
        const savedTemplates = JSON.parse(
          localStorage.getItem('savedTemplates') || '{}'
        );
        if (savedTemplates[templateName]) {
          templateData = savedTemplates[templateName];
        }
      }

      if (templateData) {
        setTemplate(templateData);
      } else {
        // If template not found, stop loading to show an error or fallback
        setLoading(false);
      }
    };
    loadTemplateData();
  }, [templateName]);

  useEffect(() => {
    let timer;
    // Only start the animation if a template has been found
    if (template) {
      if (step < messages.length) {
        timer = setTimeout(() => {
          setStep((prev) => prev + 1);
        }, 1000);
      } else {
        // Animation finished, stop loading
        timer = setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    }
    return () => clearTimeout(timer);
  }, [step, template]);

  if (loading && template) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <GlobalLoader />
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          {messages[step] || messages[messages.length - 1]}
        </p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <GlobalLoader />
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          Template not found or still loading...
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="shadow-2xl overflow-hidden bg-white relative transition-all duration-300 ease-in-out"
        style={{ width: screenSizes[screenSize] }}
      >
        <PreviewComponent parents={template.parents} screenSize={screenSize} />
      </div>
      <ResponsivenessSwitcher
        setScreenSize={setScreenSize}
        screenSize={screenSize}
      />
    </div>
  );
};

export default PreviewPage;
