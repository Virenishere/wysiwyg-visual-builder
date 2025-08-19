import React from "react";
import { IoText } from "react-icons/io5";
import { FaParagraph, FaRectangleAd, FaRegImages } from "react-icons/fa6";
import useDivStore from "@/store/UseDivStore";

export default function ElementAdder({ parentId, boxId }) {
  const { addElement, selectedBoxId } = useDivStore();

  const handleAdd = (type) => {
    if (boxId) addElement(parentId, boxId, type);
  };

  const buttons = [
    { Icon: IoText, label: "Add Text", type: "text" },
    { Icon: FaParagraph, label: "Add Paragraph", type: "paragraph" },
    { Icon: FaRectangleAd, label: "Add Button", type: "button" },
    { Icon: FaRegImages, label: "Add Image", type: "image" },
  ];

  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-gray-600 mb-2">
        Add Elements {selectedBoxId === boxId && "✓ Selected"}
      </span>

      <div className="grid grid-cols-4 gap-3">
        {buttons.map(({ Icon, label, type }, i) => (
          <div key={i} className="relative group">
            <button
              onClick={() => handleAdd(type)}
              className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 shadow-sm"
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
