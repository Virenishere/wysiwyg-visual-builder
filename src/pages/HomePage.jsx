"use client";
import React, { useState } from "react";
import DivComponent from "@/components/DivComponent";
import PropertiesTab from "@/components/PropertiesTab";

export default function HomePage() {
  const [isPropertiesTabVisible, setIsPropertiesTabVisible] = useState(false);

  return (
    <div className="bg-[#14171F] min-h-screen flex w-full justify-between gap-4 p-4 relative">
      <div className="bg-white flex-1">
        <DivComponent />
      </div>
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsPropertiesTabVisible(!isPropertiesTabVisible)}
          className="p-2 rounded-md bg-gray-800 text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      {isPropertiesTabVisible && (
        <div className="absolute top-16 right-4">
          <PropertiesTab />
        </div>
      )}
    </div>
  );
}
