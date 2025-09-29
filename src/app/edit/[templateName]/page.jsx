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

const TemplatePage = ({ params }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadTemplate = useDivStore((state) => state.loadTemplate);
  const previewingImage = useDivStore((state) => state.previewingImage);
  const setPreviewingImage = useDivStore((state) => state.setPreviewingImage);
  const activeDragItem = useDivStore((state) => state.activeDragItem);
  const parents = useDivStore((state) => state.parents);
  const screenSize = useDivStore((state) => state.screenSize);

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
  const mainContainerRef = useRef(null);
  const [containerRect, setContainerRect] = useState(null);
  const [allBoxes, setAllBoxes] = useState([]);

  useEffect(() => {
    if (mainContainerRef.current) {
      const container =
        mainContainerRef.current.querySelector('.w-full.h-full');
      if (container) {
        const rect = container.getBoundingClientRect();
        // Adjust for container's own position relative to viewport
        const relativeRect = {
          width: container.clientWidth,
          height: container.clientHeight,
          x: 0,
          y: 0,
        };
        setContainerRect(relativeRect);
      }
    }
  }, []);

  useEffect(() => {
    // get all boxes from all parents
    const boxes = parents.flatMap((p) => p.rnds);
    setAllBoxes(boxes);
  }, [parents]);

  useEffect(() => {
    if (templateName && templateName !== 'new-template') {
      loadTemplate(templateName);
    }
  }, [templateName, loadTemplate]);

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
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <GlobalLoader />
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          {messages[step] || messages[messages.length - 1]}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <LeftEditorPanel />

      <main
        className="flex-1 flex items-center justify-center"
        ref={mainContainerRef}
      >
        <div
          className="h-full shadow-2xl overflow-hidden bg-white relative transition-all duration-300 ease-in-out"
          style={{ width: screenSizes[screenSize] }}
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
              />
            </>
          )}
        </div>
      </main>

      <ResponsivenessSwitcher />

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
    </div>
  );
};

export default TemplatePage;
