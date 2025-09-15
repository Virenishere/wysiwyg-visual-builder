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

const TemplatePage = ({ params }) => {
  const messages = [
    'Loading template...',
    'Preparing the editor...',
    'Fetching components...',
    'Applying template styles...',
  ];

  const resolvedParams = use(params);
  const { templateName } = resolvedParams;

  const {
    loadTemplate,
    importData,
    previewingImage,
    setPreviewingImage,
    resetToDefault,
    activeDragItem,
    parents,
    selectedBoxId,
    selectedElementId,
  } = useDivStore();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const mainContainerRef = useRef(null);
  const [containerRect, setContainerRect] = useState(null);

  useEffect(() => {
    if (mainContainerRef.current) {
      const container =
        mainContainerRef.current.querySelector('.w-full.h-full');
      if (container) {
        setContainerRect(container.getBoundingClientRect());
      }
    }
  }, []);

  function getActiveItemAndParent(
    parents,
    selectedBoxId,
    selectedElementId,
    activeDragItem,
    mainContainerRef
  ) {
    let activeItem = activeDragItem;
    let parentDomNode = null;

    if (activeItem) {
      // Drag in progress
      const parentData = parents.find((p) =>
        p.rnds.some(
          (rnd) =>
            rnd.id === activeItem.id ||
            (rnd.elements && rnd.elements.some((el) => el.id === activeItem.id))
        )
      );
      if (parentData && mainContainerRef.current) {
        if (activeItem.type) {
          // Element
          const box = parentData.rnds.find((r) =>
            r.elements.some((el) => el.id === activeItem.id)
          );
          if (box)
            parentDomNode = mainContainerRef.current.querySelector(
              `.rnd-box[data-id="${box.id}"]`
            );
        } else {
          // Box
          parentDomNode = mainContainerRef.current.querySelector(
            `.parent-container[data-id="${parentData.id}"]`
          );
        }
      }
    } else {
      // No drag, check selection
      if (selectedElementId) {
        for (const p of parents) {
          for (const r of p.rnds) {
            const elem = r.elements.find((e) => e.id === selectedElementId);
            if (elem) {
              activeItem = elem;
              if (mainContainerRef.current)
                parentDomNode = mainContainerRef.current.querySelector(
                  `.rnd-box[data-id="${r.id}"]`
                );
              break;
            }
          }
          if (activeItem) break;
        }
      } else if (selectedBoxId) {
        for (const p of parents) {
          const box = p.rnds.find((r) => r.id === selectedBoxId);
          if (box) {
            activeItem = box;
            if (mainContainerRef.current)
              parentDomNode = mainContainerRef.current.querySelector(
                `.parent-container[data-id="${p.id}"]`
              );
            break;
          }
        }
      }
    }

    return { activeItem, parentDomNode };
  }

  const { activeItem, parentDomNode } = getActiveItemAndParent(
    parents,
    selectedBoxId,
    selectedElementId,
    activeDragItem,
    mainContainerRef
  );

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
    <div className="flex h-screen bg-gray-100">
      <LeftEditorPanel />

      <main
        className="flex-1 flex items-center justify-center p-4"
        ref={mainContainerRef}
      >
        <div className="w-full h-full shadow-2xl  overflow-hidden bg-white">
          <DivComponent key={templateName} />
          {parentDomNode && (
            <CenterDivIndicator
              activeBox={activeItem}
              parentElement={parentDomNode}
              containerRect={containerRect}
            />
          )}
        </div>
      </main>

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
