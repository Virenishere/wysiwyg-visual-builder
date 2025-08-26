"use client";
import { useEffect, useState, use } from "react";
import * as templates from "@/templates";
import GlobalLoader from "@/components/GlobalLoader";
import DivComponent from "@/components/DivComponent";
import useDivStore from "@/store/UseDivStore";
import LeftEditorPanel from "@/components/EditorPanelSection/LeftEditorPanel";
import { RxCross1 } from "react-icons/rx";

const TemplatePage = ({ params }) => {
  const messages = [
    "Loading template...",
    "Preparing the editor...",
    "Fetching components...",
    "Applying template styles...",
  ];

  const resolvedParams = use(params);
  const { templateName } = resolvedParams;

  const { loadTemplate, importData, previewingImage, setPreviewingImage, resetToDefault } =
    useDivStore();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);

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

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full h-full shadow-2xl  overflow-hidden bg-white">
          <DivComponent key={templateName} />
        </div>
      </main>

      {previewingImage && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[2000]"
          onClick={() => setPreviewingImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewingImage}
              alt="preview"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-xl"
            />
            <button
              onClick={() => setPreviewingImage(null)}
              className="absolute -top-4 -right-4 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-200 transition-colors"
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
