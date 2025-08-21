"use client";
import React, { useState } from "react";
import DivComponent from "@/components/DivComponent";
import PropertiesTab from "@/components/PropertiesTab";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaTimes } from "react-icons/fa";
import TemplatePreview from "@/components/TemplateSelectorSection/TemplatePreview";

export default function HomePage() {
  const [isPropertiesTabVisible, setIsPropertiesTabVisible] = useState(false);

  return (
    <div className="bg-[#F5F7F7] min-h-screen flex w-full gap-4 p-4 relative">
      <TemplatePreview />
    </div>
  );
}
