"use client";
import React from "react";
import { Rnd } from "react-rnd";
import useDivStore from "@/store/UseDivStore";
import DraggableElement from "./DraggableElement";

export default function RndBox({ box, parentId }) {
  const {
    updateRnd,
    setSelectedBox,
    setSelectedElement,
    selectedBoxId,
    selectedElementId,
  } = useDivStore();

  const isSelected = selectedBoxId === box.id;

  const handleElementSelect = (elementId) => {
    setSelectedElement(elementId);
    setSelectedBox(box.id);
  };

  return (
    <Rnd
      size={{ width: box.width, height: box.height }}
      position={{ x: box.x, y: box.y }}
      bounds="parent"
      onDragStart={(e) => e.stopPropagation()}
      onDragStop={(e, d) => {
        updateRnd(parentId, box.id, { x: d.x, y: d.y });
      }}
      onResizeStop={(e, direction, ref, delta, pos) => {
        updateRnd(parentId, box.id, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          ...pos,
        });
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedBox(box.id);
        setSelectedElement(null);
      }}
      style={{
        border: isSelected ? "3px solid #3b82f6" : "2px dashed #d1d5db",
        borderRadius: "4px",
        backgroundColor: isSelected ? "rgba(59, 130, 246, 0.05)" : "rgba(0, 0, 0, 0.02)",
        zIndex: isSelected ? 5 : 1,
      }}
      className="rnd-box"
    >
      {/* Box label */}
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium z-20">
          Box {box.id}
        </div>
      )}

      {/* Render elements inside this box */}
      {box.elements?.map((element) => (
        <DraggableElement
          key={`element-${element.id}`}
          element={element}
          parentId={parentId}
          boxId={box.id}
          isSelected={selectedElementId === element.id}
          onSelect={handleElementSelect}
        />
      ))}
    </Rnd>
  );
}