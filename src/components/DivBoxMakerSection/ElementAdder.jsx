import React, { useState } from 'react';
import { IoText } from 'react-icons/io5';
import { MdOutlineHorizontalRule } from 'react-icons/md';
import { TbRectangleFilled } from 'react-icons/tb';
import {
  FaParagraph,
  FaRectangleAd,
  FaRegImages,
  FaCode,
} from 'react-icons/fa6';
import useDivStore from '@/store/UseDivStore';
import CustomCodePanel from '@/components/CustomCodePanel';

export default function ElementAdder({ parentId, boxId }) {
  const { addElement, selectedBoxId, parents } = useDivStore();
  const [showCodePanel, setShowCodePanel] = useState(false);

  const selectedParent = parents.find((p) => p.id === parentId);
  const selectedBox = selectedParent?.rnds.find((b) => b.id === boxId);

  const handleAdd = (type) => {
    if (boxId) addElement(parentId, boxId, type);
  };

  const buttons = [
    { Icon: IoText, label: 'Add Text', type: 'text' },
    { Icon: FaParagraph, label: 'Add Paragraph', type: 'paragraph' },
    { Icon: FaRectangleAd, label: 'Add Button', type: 'button' },
    { Icon: FaRegImages, label: 'Add Image', type: 'image' },
    { Icon: TbRectangleFilled, label: 'Add Card', type: 'card' },
    { Icon: MdOutlineHorizontalRule, label: 'Add Line', type: 'line' },
    { Icon: FaCode, label: 'Add Custom Code', type: 'code' },
  ];

  if (showCodePanel) {
    return (
      <CustomCodePanel
        box={selectedBox}
        parentId={parentId}
        onBack={() => setShowCodePanel(false)}
      />
    );
  }

  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
        Box {boxId}
        {selectedBoxId === boxId ? (
          <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-600 rounded-full border border-green-200">
            Selected
          </span>
        ) : (
          <span className="px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-500 rounded-full border border-gray-200">
            Not Selected
          </span>
        )}
      </span>

      <div className="grid grid-cols-4 gap-3">
        {buttons.map(({ Icon, label, type }, i) => (
          <div key={i} className="relative group">
            <button
              onClick={() =>
                type === 'code' ? setShowCodePanel(true) : handleAdd(type)
              }
              className="border-2 px-4 py-4 border-dashed border-gray-300 rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 shadow-sm"
            >
              <Icon size={24} className="text-gray-600" />
            </button>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
