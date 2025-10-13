'use client';
import useDivStore from '@/store/UseDivStore';
import SizeToaster from './SizeToaster';
import React from 'react';
import SectionComponent from './SectionComponent';

export default function DivComponent() {
  const parents = useDivStore((state) => state.parents);

  if (!parents || parents.length === 0) {
    return (
      <div className="w-full flex items-center justify-center h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">
          No sections available. Add a section to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen" style={{ overflowY: 'auto' }}>
      {parents.map((parent, parentIndex) => {
        if (!parent || !parent.id) {
          console.warn(`Invalid parent at index ${parentIndex}:`, parent);
          return null;
        }
        return (
          <SectionComponent
            key={`parent-${parent.id}-${parentIndex}`}
            parent={parent}
            parentIndex={parentIndex}
          />
        );
      })}
      <SizeToaster />
    </div>
  );
}
