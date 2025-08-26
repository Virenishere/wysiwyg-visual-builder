"use client";
import React from "react";
import useDivStore from "@/store/UseDivStore";
import ParentPreview from "./PreviewComponentSection/ParentPreview";

export default function PreviewComponent({ parents: parentsProp }) {
  const { parents: parentsFromStore } = useDivStore();
  const parents = parentsProp || parentsFromStore;

  if (!parents || parents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">
            No Content to Display
          </h1>
          <p className="text-gray-500">
            The template is empty or could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {parents.map((parent, index) => (
        <ParentPreview
          key={parent.id}
          parent={parent}
          index={index}
          total={parents.length}
        />
      ))}
    </div>
  );
}
