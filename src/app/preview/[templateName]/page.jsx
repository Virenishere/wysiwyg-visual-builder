'use client';
import { useEffect, useState } from 'react';
import useDivStore from '@/store/UseDivStore';
import GlobalLoader from '@/components/GlobalLoader';
import PreviewComponent from '@/components/PreviewComponent';
import ResponsivenessSwitcher from '@/components/EditorPanelSection/ResponsivenessSwitcher';
import { screenSizes } from '@/utils/screen';

const PreviewPage = ({ params }) => {
  const { templateName } = params;
  const { layouts, screenSize, setScreenSize } = useDivStore();

  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const messages = [
    'Loading template...',
    'Preparing the preview...',
    'Fetching components...',
    'Applying styles...',
  ];

  useEffect(() => {
    let timer;
    if (step < messages.length) {
      timer = setTimeout(() => {
        setStep((prev) => prev + 1);
      }, 1000);
    } else {
      timer = setTimeout(() => {
        setLoading(false);
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [step]);

  const currentLayout = layouts[screenSize] || { parents: [] };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <GlobalLoader />
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          {messages[step] || messages[messages.length - 1]}
        </p>
      </div>
    );
  }

  if (!currentLayout.parents || currentLayout.parents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <GlobalLoader />
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          Template not found or is empty...
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
        <PreviewComponent
          parents={currentLayout.parents}
          screenSize={screenSize}
        />
      </div>
      <ResponsivenessSwitcher
        setScreenSize={setScreenSize}
        screenSize={screenSize}
        showSaveButton={false}
      />
    </div>
  );
};

export default PreviewPage;
