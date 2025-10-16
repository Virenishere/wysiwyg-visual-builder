import { useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { IoEyeSharp } from 'react-icons/io5';
import { MdSave } from 'react-icons/md';
import { FaDownload, FaGlobe } from 'react-icons/fa';
import Link from 'next/link';
import SaveTemplateModal from '../SaveTemplateModal';
import DownloadCodeModal from '../DownloadCodeModal';
import useDivStore from '@/store/UseDivStore';
import { generateHtmlCss, downloadFile } from '@/utils/export';

export default function SiteActionsPanel({ onClose }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const templateName = useDivStore((state) => state.templateName);
  const saveState = useDivStore((state) => state.saveState);
  const screenSize = useDivStore((state) => state.screenSize);

  const handleDownload = () => {
    const state = useDivStore.getState();
    const { parents, layouts, screenSize: currentScreenSize } = state;

    // Get the most up-to-date parents data
    const currentParents = parents || layouts[currentScreenSize]?.parents || [];

    console.log('Exporting data:', {
      parents: currentParents,
      screenSize: currentScreenSize,
      totalParents: currentParents.length,
      totalElements: currentParents.reduce(
        (acc, p) =>
          acc + p.rnds.reduce((acc2, r) => acc2 + r.elements.length, 0),
        0
      ),
    });

    const { html } = generateHtmlCss(currentParents, currentScreenSize);
    downloadFile('index.html', html);
    setIsDownloadModalOpen(false);
  };

  return (
    <>
      <div className="w-96 bg-white h-full shadow-lg p-4 border-t-6 border-blue-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Site Actions</h2>
          <RxCross1 size={24} className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Divider (fixed to not overflow) */}
        <div className="-mx-4 border-b border-gray-300 mb-4"></div>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          {/* Preview */}
          <Link href={`/preview/${templateName}`} target="_blank">
            <button className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer">
              <IoEyeSharp className="text-blue-500" size={20} />
              <span className="text-gray-800 font-medium">
                Preview This Site
              </span>
            </button>
          </Link>

          {/* Save Current Work */}
          <button
            onClick={saveState}
            className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
          >
            <MdSave className="text-blue-600" size={20} />
            <span className="text-gray-800 font-medium">Save Current Work</span>
          </button>

          {/* Save Template */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
          >
            <MdSave className="text-green-600" size={20} />
            <span className="text-gray-800 font-medium">Save as Template</span>
          </button>

          {/* Host Page */}
          <Link href="/host-site">
            <button className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer">
              <FaGlobe className="text-purple-600" size={20} />
              <span className="text-gray-800 font-medium">
                Host This Page on Site
              </span>
            </button>
          </Link>

          {/* Download Code */}
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
          >
            <FaDownload className="text-red-600" size={20} />
            <span className="text-gray-800 font-medium">Download Code</span>
          </button>
        </div>
      </div>
      {isModalOpen && (
        <SaveTemplateModal onClose={() => setIsModalOpen(false)} />
      )}
      {isDownloadModalOpen && (
        <DownloadCodeModal
          onClose={() => setIsDownloadModalOpen(false)}
          onDownload={handleDownload}
        />
      )}
    </>
  );
}
