"use client";
import { parentBoundary } from "@/utils/styles";
import useDivStore from "@/store/UseDivStore";
import SizeToaster from "./SizeToaster";
import React from "react";
import RndBox from "./RndBox";

export default function DivComponent() {
  const { parents, setSelectedBox, setSelectedParent, setSelectedElement } =
    useDivStore();

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
          onClick={(e) => {
            e.stopPropagation();
            setSelectedParent(parent.id);
            setSelectedBox(null);
            setSelectedElement(null);
          }}
        >
          {parent.rnds.map((box) => (
            <RndBox key={box.id} box={box} parentId={parent.id} />
          ))}
        </div>
      ))}
      <SizeToaster />
    </div>
  );
}