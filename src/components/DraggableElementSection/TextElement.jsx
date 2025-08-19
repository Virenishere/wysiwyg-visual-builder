import React from "react";

export default function TextElement({ 
  element, 
  parentId, 
  boxId, 
  isEditingText, 
  setIsEditingText, 
  updateElement 
}) {
  const baseStyle = {
    width: "100%",
    height: "100%",
    fontSize: `${element.fontSize || 16}px`,
    fontFamily: element.fontFamily || "Arial, sans-serif",
    color: element.color || "#000",
    backgroundColor: element.backgroundColor || "transparent",
    cursor: "pointer",
  };

  if (isEditingText) {
    return (
      <input
        type="text"
        value={element.content}
        onChange={(e) =>
          updateElement(parentId, boxId, element.id, { content: e.target.value })
        }
        onBlur={() => setIsEditingText(false)}
        onKeyPress={(e) => e.key === "Enter" && setIsEditingText(false)}
        style={{ ...baseStyle, border: "none", outline: "none" }}
        autoFocus
      />
    );
  }

  return (
    <div
      style={{
        ...baseStyle,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        fontWeight: element.fontSize > 24 ? "bold" : "normal",
      }}
      onDoubleClick={() => setIsEditingText(true)}
    >
      {element.content}
    </div>
  );
}
