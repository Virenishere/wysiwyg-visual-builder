// Fixed DivComponent.jsx with better parent handling
'use client';
import { parentBoundary } from '@/utils/styles';
import useDivStore from '@/store/UseDivStore';
import SizeToaster from './SizeToaster';
import React from 'react';
import RndBox from './RndBox';
import CenterDivIndicator from './CenterDivIndicator';
import AlignIndicator from './AlignIndicator';

export default function DivComponent() {
  const {
    parents,
    setSelectedBox,
    setSelectedParent,
    setSelectedElement,
    selectedParentId,
    activeDragItem,
  } = useDivStore();

  // Handle empty parents array
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
    <div className="w-full h-screen overflow-y-auto ">
      {parents.map((parent, parentIndex) => {
        // Ensure parent has required properties
        if (!parent || !parent.id) {
          console.warn(`Invalid parent at index ${parentIndex}:`, parent);
          return null;
        }

        //calculate container bounds for this section
        const sectionBounds = {
          width: parentBoundary.width || 800,
          height: parent.size?.height || 300,
          x: 10, //accounting for padding
          y: 0,
        };

        // get all RND boces in this section for alignment
        const sectionRnds = parent.rnds || [];

        // check if the active drag item belong to this section
        const isActiveDragInThisSection =
          activeDragItem &&
          sectionRnds.some((rnd) => rnd.id === activeDragItem.id);
        return (
          <div
            key={`parent-${parent.id}-${parentIndex}`}
            data-id={parent.id}
            style={{
              ...parentBoundary,
              height: parent.size?.height || 300,
              background: parent.size?.background || '#ffffff',
              position: 'relative',
              border: selectedParentId === parent.id ? '3px solid #6f56f9' : '',
              padding: '10px',
            }}
            onClick={(e) => {
              // Only select parent if clicking on empty space
              if (e.target === e.currentTarget) {
                e.stopPropagation();
                setSelectedParent(parent.id);
                setSelectedBox(null);
                setSelectedElement(null);
              }
            }}
            className="parent-container"
          >
            {/* Parent label */}
            <div
              className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium z-20"
              style={{
                display: selectedParentId === parent.id ? 'block' : 'none',
              }}
            >
              Section {parent.id}
            </div>

            {/* Centering indicator for RND boxes within this section */}
            {activeDragItem && isActiveDragInThisSection && (
              <CenterDivIndicator
                activeBox={activeDragItem}
                containerBounds={sectionBounds}
              />
            )}

            {/* Alignment indicator for RND boxes within this section */}
            {activeDragItem && isActiveDragInThisSection && (
              <AlignIndicator
                activeItem={activeDragItem}
                allItems={sectionRnds}
                containerBounds={sectionBounds}
                tolerance={3}
              />
            )}

            {/* Render RND boxes */}
            {parent.rnds && Array.isArray(parent.rnds) ? (
              parent.rnds.map((box, boxIndex) => {
                // Ensure box has required properties
                if (!box || !box.id) {
                  console.warn(
                    `Invalid box at index ${boxIndex} in parent ${parent.id}:`,
                    box
                  );
                  return null;
                }

                return (
                  <RndBox
                    key={`box-${box.id}-${boxIndex}`}
                    box={box}
                    parentId={parent.id}
                  />
                );
              })
            ) : (
              // Show placeholder when no boxes exist
              <div className="absolute inset-4 flex items-center justify-center border-2 border-dashed border-gray-300 rounded bg-gray-50">
                <p className="text-gray-400 text-sm">
                  Click to add content boxes
                </p>
              </div>
            )}
          </div>
        );
      })}
      <SizeToaster />
    </div>
  );
}
