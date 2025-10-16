'use client';
import React, { useRef, useState, useEffect } from 'react';
import { parentBoundary } from '@/utils/styles';
import useDivStore from '@/store/UseDivStore';
import RndBox from './RndBox';
import CenterDivIndicator from './CenterDivIndicator';
import AlignIndicator from './AlignIndicator';
import { getResponsiveValue } from '@/utils/screen';

export default function SectionComponent({ parent, parentIndex }) {
  const {
    setSelectedBox,
    setSelectedParent,
    setSelectedElement,
    selectedParentId,
    activeDragItem,
    screenSize,
  } = useDivStore();

  const sectionRef = useRef(null);
  const [sectionBounds, setSectionBounds] = useState(null);

  const height = getResponsiveValue(parent.size?.height, screenSize) || 300;
  const background =
    getResponsiveValue(parent.size?.background, screenSize) || '#ffffff';

  //check if this selection is selected
  const isSectionSelected = selectedParentId === parent.id;

  useEffect(() => {
    if (sectionRef.current) {
      setSectionBounds({
        width: sectionRef.current.clientWidth - 20, // account for 10px padding on each side
        height: sectionRef.current.clientHeight - 20, // account for 10px padding on top and bottom
        x: 10, // account for 10px padding on the left
        y: 10, // account for 10px padding on the top
      });
    }
  }, [height]); // Recalculate if height changes

  // get all RND boxes in this section for alignment
  const sectionRnds = parent.rnds || [];

  // check if the active drag item is a box and belongs to this section
  const isActiveDragInThisSection =
    activeDragItem &&
    !activeDragItem.type &&
    sectionRnds.some((rnd) => rnd.id === activeDragItem.id);

  return (
    <div
      ref={sectionRef}
      data-id={parent.id}
      data-section-id={parent.id}
      style={{
        ...parentBoundary,
        height: height,
        background: background,
        position: 'relative',
        border: isSectionSelected ? '3px solid #6f56f9' : '2px solid #A9A9A9',
        boxSizing: 'border-box',
        overflow: 'visible',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.stopPropagation();
          setSelectedParent(parent.id);
          setSelectedBox(null);
          setSelectedElement(null);
        }
      }}
      className="parent-container"
    >
      <div
        className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium z-20"
        style={{
          display: selectedParentId === parent.id ? 'block' : 'none',
        }}
      >
        Section {parent.id}
      </div>

      {/* Indicators for RND boxes */}
      {isActiveDragInThisSection && sectionBounds && (
        <>
          <CenterDivIndicator
            activeBox={activeDragItem}
            containerBounds={sectionBounds}
          />
          <AlignIndicator
            activeItem={activeDragItem}
            allItems={sectionRnds}
            containerBounds={sectionBounds}
            tolerance={3}
          />
        </>
      )}

      {/* Container for RND boxes with proper bounds */}
      <div
        className="rnd-container"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'visible', // Allow elements to move freely within boxes
        }}
      >
        {/* Render RND boxes */}
        {parent.rnds && parent.rnds.length > 0 ? (
          parent.rnds.map((box) => (
            <RndBox
              key={box.id}
              box={box}
              parentId={parent.id}
              isSectionSelected={isSectionSelected}
              sectionWidth={sectionRef.current?.clientWidth}
            />
          ))
        ) : (
          <div
            className="flex items-center justify-center h-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedParent(parent.id);
              setSelectedBox(null);
              setSelectedElement(null);
            }}
          >
            <p className="text-gray-400">
              This section is empty. Add a box to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
