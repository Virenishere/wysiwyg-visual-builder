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
      <div className="flex items-center justify-center h-screen">
        <GlobalLoader
          message={messages[step] || messages[messages.length - 1]}
          fullScreen={false}
        />
      </div>
    );
  }

  return <PreviewComponent parents={parents} />;
};

export default PreviewPage;
