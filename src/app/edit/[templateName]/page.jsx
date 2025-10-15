'use client';
import { useEffect, useState, use, useRef } from 'react';
import * as templates from '@/templates';
import GlobalLoader from '@/components/GlobalLoader';
import DivComponent from '@/components/DivComponent';
import useDivStore from '@/store/UseDivStore';
import LeftEditorPanel from '@/components/EditorPanelSection/LeftEditorPanel';
import { RxCross1 } from 'react-icons/rx';
import Image from 'next/image';
import CenterDivIndicator from '@/components/CenterDivIndicator';
import AlignIndicator from '@/components/AlignIndicator';
import ResponsivenessSwitcher from '@/components/EditorPanelSection/ResponsivenessSwitcher';
import { screenSizes } from '@/utils/screen';
// Remove the FaBars import since we don't need it anymore

import ScreenSizeWarning from '@/components/ScreenSizeWarning';

const TemplatePage = ({ params }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showScreenSizeWarning, setShowScreenSizeWarning] = useState(false);
  const [disableAllWarnings, setDisableAllWarnings] = useState(false);

  const [acknowledgedScreenSizes, setAcknowledgedScreenSizes] = useState([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadTemplate = useDivStore((state) => state.loadTemplate);
  const previewingImage = useDivStore((state) => state.previewingImage);
  const setPreviewingImage = useDivStore((state) => state.setPreviewingImage);
  const activeDragItem = useDivStore((state) => state.activeDragItem);
  const parents = useDivStore((state) => state.parents);
  const screenSize = useDivStore((state) => state.screenSize);
  const setScreenSize = useDivStore((state) => state.setScreenSize);

  // const handleScreenSizeChange = (newSize) => {
  //   setScreenSize(newSize);
  //   setShowScreenSizeWarning(true);
  // };

  const handleScreenSizeChange = (newSize) => {
    setScreenSize(newSize);
    if (!disableAllWarnings && !acknowledgedScreenSizes.includes(newSize)) {
      setShowScreenSizeWarning(true);
    }
  };

  const handleScreenSizeWarningConfirm = () => {
    setShowScreenSizeWarning(false);
    setAcknowledgedScreenSizes((prev) => [...prev, screenSize]);
  };

  const messages = [
    'Loading template...',
    'Preparing the editor...',
    'Fetching components...',
    'Applying template styles...',
  ];

  const resolvedParams = use(params);
  const { templateName } = resolvedParams;

  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  // Remove the mobileMenuOpen state since we don't need it anymore
  const mainContainerRef = useRef(null);
  const [containerRect, setContainerRect] = useState(null);
  const [allBoxes, setAllBoxes] = useState([]);

  useEffect(() => {
    if (mainContainerRef.current) {
      // Look for the main content container instead of .w-full.h-full
      const container =
        mainContainerRef.current.querySelector('div[style*="width"]') ||
        mainContainerRef.current.firstElementChild;

      if (container) {
        const rect = container.getBoundingClientRect();
        // Calculate the actual available width for the canvas
        const availableWidth = mainContainerRef.current.clientWidth - 32; // Account for padding
        const targetWidth =
          screenSizes[screenSize] === '100%'
            ? availableWidth
            : Math.min(parseInt(screenSizes[screenSize], 10), availableWidth);

        const relativeRect = {
          width: targetWidth,
          height: container.clientHeight,
          x: 0,
          y: 0,
        };
        setContainerRect(relativeRect);
      } else {
        // Fallback: use the main container itself
        const availableWidth = mainContainerRef.current.clientWidth - 32;
        const targetWidth =
          screenSizes[screenSize] === '100%'
            ? availableWidth
            : Math.min(parseInt(screenSizes[screenSize], 10), availableWidth);

        const relativeRect = {
          width: targetWidth,
          height: mainContainerRef.current.clientHeight,
          x: 0,
          y: 0,
        };
        setContainerRect(relativeRect);
      }
    }
  }, [screenSize]); // Add screenSize as dependency to recalculate when screen size changes

  useEffect(() => {
    // get all boxes from all parents
    const boxes = parents.flatMap((p) => p.rnds);
    setAllBoxes(boxes);
  }, [parents]);

  const setTemplateName = useDivStore((state) => state.setTemplateName);

  useEffect(() => {
    if (templateName) {
      const decodedTemplateName = decodeURIComponent(templateName);
      setTemplateName(decodedTemplateName);
      if (decodedTemplateName && decodedTemplateName !== 'new-template') {
        loadTemplate(decodedTemplateName);
      }
    }
  }, [templateName, loadTemplate, setTemplateName]);

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

  if (!isMounted || loading) {
    return (
      <>
        {/* Mobile/Tablet Loading Screen */}
        <div className="md:hidden flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
          <div className="text-center max-w-md mx-auto">
            <GlobalLoader />
            <p className="text-lg font-medium text-gray-700 animate-pulse mt-6">
              {messages[step] || messages[messages.length - 1]}
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Please switch to desktop for full editor experience
            </p>
          </div>
        </div>

        {/* Desktop Loading Screen */}
        <div
          className="hidden md:flex flex-col items-center justify-center gap-6 bg-gray-100"
          style={{ height: '100vh' }}
        >
          <GlobalLoader />
          <p className="text-lg font-medium text-gray-700 animate-pulse">
            {messages[step] || messages[messages.length - 1]}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile/Tablet Warning Screen */}
      <div className="md:hidden flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <svg
              className="w-24 h-24 mx-auto text-blue-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Desktop Required
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            This visual website builder is optimized for desktop and laptop
            screens. Please open this page on a larger screen for the best
            editing experience.
          </p>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
            <p className="text-sm text-gray-500 mb-2">
              Minimum recommended resolution:
            </p>
            <p className="font-semibold text-blue-600">
              1024px × 768px or larger
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div
        className="md:hidden flex flex-col bg-gray-100"
        style={{ height: '100vh' }}
      >
        <div className="flex-1 p-2">
          <div
            className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden"
            style={{
              maxWidth:
                screenSizes[screenSize] === '100%'
                  ? '100%'
                  : screenSizes[screenSize],
            }}
          >
            <DivComponent key={templateName} />
          </div>
        </div>

        {/* Mobile Responsive Switcher */}
        <div className="p-2">
          <ResponsivenessSwitcher
            screenSize={screenSize}
            setScreenSize={handleScreenSizeChange}
            showSaveButton={true}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div
        className="hidden md:flex bg-gray-100 overflow-hidden"
        style={{ height: '100vh' }}
      >
        <LeftEditorPanel />

        <main
          className="flex-1 flex items-center justify-center px-4 py-4"
          ref={mainContainerRef}
        >
          <div
            className="h-full max-h-full shadow-2xl overflow-hidden bg-white relative transition-all duration-300 ease-in-out"
            style={{
              width:
                screenSizes[screenSize] === '100%'
                  ? '100%'
                  : `min(${screenSizes[screenSize]}, 100%)`,
              maxWidth: screenSize === '4k' ? '100%' : screenSizes[screenSize],
            }}
          >
            <DivComponent key={templateName} />
            {/* Show indicators only when dragging a box */}
            {activeDragItem && !activeDragItem.type && (
              <>
                <CenterDivIndicator
                  activeBox={activeDragItem}
                  containerBounds={containerRect}
                />
                <AlignIndicator
                  activeItem={activeDragItem}
                  allItems={allBoxes}
                  containerBounds={containerRect}
                  tolerance={2}
                />
              </>
            )}
          </div>
        </main>

        {/* Responsive Switcher - Only show on desktop */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <ResponsivenessSwitcher
            screenSize={screenSize}
            setScreenSize={handleScreenSizeChange}
            showSaveButton={true}
          />
        </div>

        {/* Preview Image Modal */}
        {previewingImage && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[2000]"
            onClick={() => setPreviewingImage(null)}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <Image
                src={previewingImage}
                alt="preview"
                width={800}
                height={600}
                className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-xl"
              />

              <button
                onClick={() => setPreviewingImage(null)}
                className="absolute -top-4 -right-4 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-200 transition-colors cursor-pointer hover:text-red-500"
              >
                <RxCross1 size={20} />
              </button>
            </div>
          </div>
        )}

        {showScreenSizeWarning && (
          <ScreenSizeWarning
            onClose={() => setShowScreenSizeWarning(false)}
            onConfirm={handleScreenSizeWarningConfirm}
            onDisableAll={() => {
              setDisableAllWarnings(true);
              setShowScreenSizeWarning(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default TemplatePage;
