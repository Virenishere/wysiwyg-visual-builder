"use client";
import { Rnd } from "react-rnd";
import useDivStore from "@/store/UseDivStore";
import DraggableElement from "./DraggableElement";
import React, { useState } from "react";

export default function RndBox({ box, parentId }) {
  const {
    updateRnd,
    selectedBoxId,
    selectedElementId,
    setSelectedBox,
    setSelectedElement,
    setIsResizing,
  } = useDivStore();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Rnd
      key={box.id}
      style={{
        border:
          selectedBoxId === box.id
            ? "2px solid blue"
            : isHovered
            ? "1px dashed black"
            : "1px solid transparent",
        overflow: "visible",
        borderRadius: "2px",
      }}
      bounds="parent"
      size={{ width: box.width, height: box.height }}
      position={{ x: box.x, y: box.y }}
      onDragStart={(e) => {
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedBox(box.id);
        setSelectedElement(null);
      }}
      onDragStop={(e, d) => {
        updateRnd(parentId, box.id, { x: d.x, y: d.y });
      }}
      onResizeStart={() => {
        setSelectedBox(box.id);
        setIsResizing(true);
      }}
      onResize={(e, direction, ref, delta, pos) => {
        updateRnd(parentId, box.id, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          ...pos,
        });
      }}
      onResizeStop={() => setIsResizing(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {/* Render all elements inside this RND box */}
        {box.elements?.map((element) => (
          <DraggableElement
            key={element.id}
            element={element}
            parentId={parentId}
            boxId={box.id}
            isSelected={selectedElementId === element.id}
            onSelect={(elementId) => {
              setSelectedElement(elementId);
              setSelectedBox(box.id);
            }}
          />
        ))}
      </div>
    </Rnd>
  );
}
