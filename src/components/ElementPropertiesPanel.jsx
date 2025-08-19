"use client";
import React from "react";
import useDivStore from "@/store/UseDivStore";
import Header from "./ElementPropertiesPanelSection/Header";
import PositionSize from "./ElementPropertiesPanelSection/PositionSize";
import Spacing from "./ElementPropertiesPanelSection/Spacing";
import Typography from "./ElementPropertiesPanelSection/Typography";
import BorderEffects from "./ElementPropertiesPanelSection/BorderEffects";
import ContentInput from "./ElementPropertiesPanelSection/ContentInput";

export default function ElementPropertiesPanel() {
  const {
    parents,
    selectedParentId,
    selectedBoxId,
    selectedElementId,
    updateElement,
    removeElement,
  } = useDivStore();

  const selectedParent = parents.find((p) => p.id === selectedParentId);
  const selectedBox = selectedParent?.rnds.find((box) => box.id === selectedBoxId);
  const selectedElement = selectedBox?.elements?.find((el) => el.id === selectedElementId);

  if (!selectedElement) {
    return (
      <div className="p-4 mb-4 rounded-xl border border-gray-200 shadow-sm bg-gradient-to-br from-gray-50 to-white">
        <p className="text-xs text-gray-400 italic animate-pulse">
          Select an element to edit its properties
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 mb-4 rounded-xl border border-purple-200 shadow-sm bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <Header
        selectedElement={selectedElement}
        selectedParentId={selectedParentId}
        selectedBoxId={selectedBoxId}
        selectedElementId={selectedElementId}
        removeElement={removeElement}
      />

      {/* Sections */}
      <PositionSize
        selectedElement={selectedElement}
        updateElement={updateElement}
        parentId={selectedParentId}
        boxId={selectedBoxId}
        elementId={selectedElementId}
      />

      <Spacing
        selectedElement={selectedElement}
        updateElement={updateElement}
        parentId={selectedParentId}
        boxId={selectedBoxId}
        elementId={selectedElementId}
      />

      {(selectedElement.type === "text" ||
        selectedElement.type === "button" ||
        selectedElement.type === "paragraph") && (
        <Typography
          selectedElement={selectedElement}
          updateElement={updateElement}
          parentId={selectedParentId}
          boxId={selectedBoxId}
          elementId={selectedElementId}
        />
      )}

      <BorderEffects
        selectedElement={selectedElement}
        updateElement={updateElement}
        parentId={selectedParentId}
        boxId={selectedBoxId}
        elementId={selectedElementId}
      />

      <ContentInput
        selectedElement={selectedElement}
        updateElement={updateElement}
        parentId={selectedParentId}
        boxId={selectedBoxId}
        elementId={selectedElementId}
      />
    </div>
  );
}
