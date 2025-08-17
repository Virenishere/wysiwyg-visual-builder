"use client";
import React, { useRef } from "react";
import DivComponent from "@/components/DivComponent";
import PropertiesTab from "@/components/PropertiesTab";

export default function HomePage() {
  return (
    <div className="bg-[#14171F] min-h-screen flex w-full justify-between gap-4 p-4">
      <div className="bg-white flex-1">
        <DivComponent />
      </div>
      <div>
        <PropertiesTab />
      </div>
    </div>
  );
}
