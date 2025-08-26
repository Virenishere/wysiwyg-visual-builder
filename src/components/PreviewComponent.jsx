"use client";
import React from "react";
import useDivStore from "@/store/UseDivStore";
import ParentPreview from "./PreviewComponentSection/ParentPreview";

export default function PreviewComponent() {
  const { parents } = useDivStore();

  if (parents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">
            No Content Yet
          </h1>
          <p className="text-gray-500">
            Add some parent divs and elements to get started, or load the
            landing page template!
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
