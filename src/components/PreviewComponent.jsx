"use client";
import React from "react";
import useDivStore from "@/store/UseDivStore";

export default function PreviewComponent() {
  const { parents } = useDivStore();

  const renderElement = (element) => {
    const baseStyle = {
      position: "absolute",
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      margin: `${element.margin?.top || 0}px ${element.margin?.right || 0}px ${element.margin?.bottom || 0}px ${element.margin?.left || 0}px`,
      padding: `${element.padding?.top || 5}px ${element.padding?.right || 10}px ${element.padding?.bottom || 5}px ${element.padding?.left || 10}px`,
      fontSize: `${element.fontSize || 16}px`,
      fontFamily: element.fontFamily || 'Arial, sans-serif',
      color: element.color || '#000000',
      backgroundColor: element.backgroundColor || 'transparent',
      borderRadius: `${element.borderRadius || 0}px`,
      border: element.border || 'none',
      boxSizing: 'border-box',
    };

    switch (element.type) {
      case "text":
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              fontWeight: element.fontSize > 24 ? 'bold' : 'normal',
            }}
          >
            {element.content}
          </div>
        );

      case "paragraph":
        return (
          <div
            key={element.id}
            style={baseStyle}
            dangerouslySetInnerHTML={{ __html: element.content }}
          />
        );

      case "button":
        return (
          <button
            key={element.id}
            style={{
              ...baseStyle,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="hover:opacity-80 hover:scale-105 active:scale-95"
            onClick={() => {
              console.log('Button clicked:', element.content);
              // You can add custom button actions here
            }}
          >
            {element.content || "Click Me"}
          </button>
        );

      case "image":
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              padding: 0, // Images typically don't need padding
            }}
          >
            {element.imageUrl ? (
              <img
                src={element.imageUrl}
                alt={element.content || "Image"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: `${element.borderRadius || 0}px`,
                  border: element.border || 'none',
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#f0f0f0",
                  border: "2px dashed #ccc",
                  borderRadius: `${element.borderRadius || 0}px`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  color: "#999",
                  fontSize: "12px",
                }}
              >
                <span style={{ fontSize: "24px", marginBottom: "8px" }}>🖼️</span>
                <span>No Image</span>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div
            key={element.id}
            style={baseStyle}
          >
            Unknown Element
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {parents.map((parent, index) => (
        <div
          key={parent.id}
          style={{
            width: "100%",
            height: `${parent.size.height}px`,
            background: parent.size.background || "#fff",
            position: "relative",
            overflow: "hidden",
            borderBottom: index < parents.length - 1 ? "1px solid #e0e0e0" : "none",
          }}
        >
          {/* Render all RND boxes within this parent */}
          {parent.rnds.map((box) => (
            <div
              key={box.id}
              style={{
                position: "absolute",
                top: `${box.y}px`,
                left: `${box.x}px`,
                width: `${box.width}px`,
                height: `${box.height}px`,
                // Uncomment below for debugging box boundaries
                // border: "1px dashed rgba(0,0,0,0.2)",
                // backgroundColor: "rgba(255,255,255,0.05)",
              }}
            >
              {/* Render all elements inside this RND box */}
              {box.elements?.map((element) => renderElement(element))}
            </div>
          ))}
        </div>
      ))}
      
      {/* Footer-like section if no parents exist */}
      {parents.length === 0 && (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-600 mb-4">No Content Yet</h1>
            <p className="text-gray-500">Add some parent divs and elements to get started, or load the landing page template!</p>
          </div>
        </div>
      )}
    </div>
  );
}