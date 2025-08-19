import React from "react";

export default function ImageElement({ element, parentId, boxId, updateElement, fileInputRef }) {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        updateElement(parentId, boxId, element.id, {
          imageUrl: ev.target.result,
          content: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      {element.imageUrl ? (
        <img
          src={element.imageUrl}
          alt={element.content}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        />
      ) : (
        <div
          style={{
            border: "2px dashed #ccc",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            backgroundColor: "#f9f9f9",
            height: "100%",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          <span style={{ fontSize: "24px" }}>📷</span>
          <span style={{ fontSize: "12px", color: "#666" }}>Click to upload</span>
        </div>
      )}
    </div>
  );
}
