'use client';
import React from 'react';
import useDivStore from '@/store/UseDivStore';
import AddDivButton from './DivBoxMakerSection/AddDivButton';
import BoxCard from './DivBoxMakerSection/BoxCard';
import ElementProperties from './DivBoxMakerSection/ElementProperties';

export default function DivBoxMaker() {
  const { parents, selectedParentId, selectedElementId } = useDivStore();

  const selectedParent = parents.find((p) => p.id === selectedParentId);

  if (!selectedParent) {
    return (
      <p className="text-xs text-gray-400 italic animate-pulse">
        Select a parent to manage its boxes
      </p>
    );
  }

  return (
    <div>
      <AddDivButton parentId={selectedParent.id} />

      {/* Element Properties Panel */}
      {selectedElementId && <ElementProperties parentId={selectedParent.id} />}

      {/* Render RND Boxes */}
      {selectedParent.rnds && Array.isArray(selectedParent.rnds) ? (
        selectedParent.rnds.map((box, boxIndex) => {
          // Ensure box has required properties
          if (!box || !box.id) {
            console.warn(`Invalid box at index ${boxIndex}:`, box);
            return null;
          }

          return (
            <BoxCard
              key={`boxcard-${box.id}-${boxIndex}`} // More unique key
              parentId={selectedParent.id}
              box={box}
            />
          );
        })
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No boxes in this section yet.</p>
          <p className="text-sm">Use the button above to add content boxes.</p>
        </div>
      )}
    </div>
  );
}
