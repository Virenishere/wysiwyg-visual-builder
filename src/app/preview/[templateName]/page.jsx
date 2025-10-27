'use client';
import { useEffect, useState, use } from 'react';
import useDivStore from '@/store/UseDivStore';
import GlobalLoader from '@/components/GlobalLoader';
import PreviewComponent from '@/components/PreviewComponent';
import ResponsivenessSwitcher from '@/components/EditorPanelSection/ResponsivenessSwitcher';
import { screenSizes } from '@/utils/screen';

const PreviewPage = ({ params }) => {
  // Use React.use() to unwrap the params promise
  const resolvedParams = use(params);
  const { templateName } = resolvedParams;

  const { layouts, parents, screenSize, setScreenSize, loadTemplate } =
    useDivStore();

  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const messages = [
    'Loading template...',
    'Preparing the preview...',
    'Fetching components...',
    'Applying styles...',
  ];

  // Load template data when component mounts
  useEffect(() => {
    if (templateName && templateName !== 'new-template') {
      loadTemplate(templateName);
    }

    const handleStorageChange = (e) => {
      if (e.key === 'div-store') {
        loadTemplate(templateName);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [templateName, loadTemplate]);

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
  }, [step, messages.length]);

  if (loading) {
    return <GlobalLoader message={messages[step]} />;
  }

  return (
    <div className="bg-gray-100" style={{ minHeight: '100vh' }}>
      {/* Header with responsive switcher */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Preview: {templateName}
            </h1>
            <p className="text-gray-600 mt-1">
              Current screen size: {screenSize}
            </p>
          </div>

          <ResponsivenessSwitcher
            screenSize={screenSize}
            setScreenSize={setScreenSize}
            showSaveButton={false}
          />
        </div>
      </div>

      {/* Preview container with proper width constraints */}
      <div className="flex justify-center p-4">
        <div
          className="shadow-lg overflow-hidden transition-all duration-300"
          style={{
            width: screenSizes[screenSize] || '100%',
            maxWidth: screenSize === '4k' ? '100%' : screenSizes[screenSize],
            minHeight: '600px',
          }}
        >
          <PreviewComponent parents={parents} screenSize={screenSize} />
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
