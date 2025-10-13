'use client';
import React, { useState, useEffect } from 'react';
import TemplatePreview from '@/components/TemplateSelectorSection/TemplatePreview';
import GlobalLoader from '@/components/GlobalLoader';

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center bg-[#F5F7F7]"
        style={{ minHeight: '100vh' }}
      >
        <GlobalLoader />
      </div>
    );
  }

  return (
    <div
      className="bg-[#F5F7F7] flex w-full gap-4 p-4 relative"
      style={{ minHeight: '100vh' }}
    >
      <TemplatePreview />
    </div>
  );
}
