"use client";
import { Rnd } from "react-rnd";
import { parentBoundary, style } from "@/utils/styles";
import useDivStore from "@/store/UseDivStore";
import SizeToaster from "./SizeToaster";
import DraggableElement from "./DraggableElement";

export default function DivComponent() {
  const {
    parents,
    updateRnd,
    selectedBoxId,
    selectedElementId,
    setSelectedBox,
    setSelectedParent,
    setSelectedElement,
    setIsResizing,
  } = useDivStore();

  return (
    <div>
      {parents.map((parent) => (
        <div
          key={parent.id}
          style={{
            ...parentBoundary,
            height: parent.size.height,
            background: parent.size.background,
            position: "relative",
          }}
          onClick={() => {
            setSelectedParent(parent.id);
            setSelectedBox(null);
            setSelectedElement(null);
          }}
        >
          {parent.rnds.map((box) => (
            <Rnd
              key={box.id}
              style={{
                ...style,
                border: selectedBoxId === box.id ? "2px solid blue" : style.border,
                overflow: "visible", // Allow elements to show resize handles
              }}
              bounds="parent"
              size={{ width: box.width, height: box.height }}
              position={{ x: box.x, y: box.y }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBox(box.id);
                setSelectedElement(null);
              }}
              onDragStop={(e, d) => {
                updateRnd(parent.id, box.id, { x: d.x, y: d.y });
              }}
              onResizeStart={() => {
                setSelectedBox(box.id);
                setIsResizing(true);
              }}
              onResize={(e, direction, ref, delta, pos) => {
                updateRnd(parent.id, box.id, {
                  width: ref.offsetWidth,
                  height: ref.offsetHeight,
                  ...pos,
                });
              }}
              onResizeStop={() => setIsResizing(false)}
            >
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* Box Label */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: '2px',
                    fontSize: '10px',
                    color: '#666',
                    pointerEvents: 'none',
                    zIndex: 1000,
                  }}
                >
                  Box {box.id}
                </div>

                {/* Render all elements inside this RND box */}
                {box.elements?.map((element) => (
                  <DraggableElement
                    key={element.id}
                    element={element}
                    parentId={parent.id}
                    boxId={box.id}
                    isSelected={selectedElementId === element.id}
                    onSelect={(elementId) => {
                      setSelectedElement(elementId);
                      setSelectedBox(box.id); // Keep box selected too
                    }}
                  />
                ))}
              </div>
            </Rnd>
          ))}
        </div>
      ))}
      <SizeToaster />
    </div>
  );
}