"use client";
import React from "react";
import useDivStore from "@/store/UseDivStore";
import AddDivButton from "./DivBoxMakerSection/AddDivButton";
import BoxCard from "./DivBoxMakerSection/BoxCard";
import ElementProperties from "./DivBoxMakerSection/ElementProperties";

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
      {selectedParent.rnds.map((box) => (
        <BoxCard key={box.id} parentId={selectedParent.id} box={box} />
      ))}
    </div>
  );
}
