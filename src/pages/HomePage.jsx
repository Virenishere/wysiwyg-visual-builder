"use client";
import React, { useState } from "react";
import DivComponent from "@/components/DivComponent";
import PropertiesTab from "@/components/PropertiesTab";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaTimes } from "react-icons/fa";

export default function HomePage() {
  const [isPropertiesTabVisible, setIsPropertiesTabVisible] = useState(false);

  return (
    <div className="bg-[#14171F] min-h-screen flex w-full justify-between gap-4 p-4 relative">
      <div className="bg-white flex-1">
        <DivComponent />
      </div>
      <div className="fixed top-4 right-4 z-50">
  <button
    onClick={() => setIsPropertiesTabVisible(!isPropertiesTabVisible)}
    className="p-2 rounded-md bg-gray-800 text-white shadow-lg"
  >
    {isPropertiesTabVisible ? (
      <FaTimes size={24} />
    ) : (<GiHamburgerMenu size={24} />)}       
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
