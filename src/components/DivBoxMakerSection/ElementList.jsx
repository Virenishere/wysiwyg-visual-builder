import React from "react";
import useDivStore from "@/store/UseDivStore";

export default function ElementList({ parentId, box }) {
  const { selectedElementId, removeElement } = useDivStore();

  return (
    <div className="mt-4 pt-3 border-t border-gray-200">
      <h4 className="text-xs font-semibold text-gray-500 mb-2">Elements in this box:</h4>
      <div className="space-y-1">
        {box.elements.map((el) => (
          <div
            key={el.id}
            className={`text-xs p-2 rounded flex justify-between items-center cursor-pointer ${
              selectedElementId === el.id
                ? "bg-purple-100 border border-purple-300"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => {
              useDivStore.getState().setSelectedElement(el.id);
              useDivStore.getState().setSelectedBox(box.id);
            }}
          >
            <span className="font-medium">
              {el.type.charAt(0).toUpperCase() + el.type.slice(1)} #{el.id}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeElement(parentId, box.id, el.id);
              }}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
