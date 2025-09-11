'use client';
import { useEffect, useState } from 'react';
import GlobalLoader from '@/components/GlobalLoader';
import PreviewComponent from '@/components/PreviewComponent';
import useDivStore from '@/store/UseDivStore';

const PreviewPage = () => {
  const messages = [
    'Loading preview...',
    'Preparing components...',
    'Applying styles...',
  ];

  const { parents } = useDivStore();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timer;
    if (loading) {
      if (step < messages.length) {
        timer = setTimeout(() => {
          setStep((prev) => prev + 1);
        }, 1000);
      } else {
        // After all messages, wait a bit then stop loading
        timer = setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    }
    return () => clearTimeout(timer);
  }, [step, loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <GlobalLoader />
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          {messages[step] || messages[messages.length - 1]}
        </p>
      </div>
    );
  }

  return <PreviewComponent parents={parents} />;
};

export default PreviewPage;
