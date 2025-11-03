'use client';
import React from 'react';

export default function CardToolbar({
  addText,
  onAddImageClick,
  snapEnabled,
  setSnapEnabled,
  lockAspect,
  setLockAspect,
  undo,
  redo,
  centerSelectedX,
  centerSelectedY,
  centerSelectedBoth,
  bringForward,
  sendBackward,
  fileInputRef,
  onFileChange,
}) {
  return (
    <div
      className="absolute top-2 left-2 flex flex-wrap gap-2 px-2 py-1 rounded bg-white/80 shadow"
      style={{ zIndex: 1000 }}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <button className="px-2 py-1 border rounded" onClick={addText}>
        Add Text
      </button>
      <button
        className="px-2 py-1 border rounded"
        onClick={(e) => {
          e.stopPropagation();
          onAddImageClick?.();
        }}
      >
        Add Image
      </button>

      <label className="px-2 py-1 border rounded cursor-pointer flex items-center gap-1">
        <input
          type="checkbox"
          checked={snapEnabled}
          onChange={(e) => setSnapEnabled(e.target.checked)}
        />
        <span>Snap</span>
      </label>

      <label className="px-2 py-1 border rounded cursor-pointer flex items-center gap-1">
        <input
          type="checkbox"
          checked={lockAspect}
          onChange={(e) => setLockAspect(e.target.checked)}
        />
        <span>Lock Aspect</span>
      </label>

      <button className="px-2 py-1 border rounded" onClick={undo}>
        Undo
      </button>
      <button className="px-2 py-1 border rounded" onClick={redo}>
        Redo
      </button>

      <button className="px-2 py-1 border rounded" onClick={centerSelectedX}>
        Center X
      </button>
      <button className="px-2 py-1 border rounded" onClick={centerSelectedY}>
        Center Y
      </button>
      <button className="px-2 py-1 border rounded" onClick={centerSelectedBoth}>
        Center Both
      </button>

      <button className="px-2 py-1 border rounded" onClick={bringForward}>
        Bring Forward
      </button>
      <button className="px-2 py-1 border rounded" onClick={sendBackward}>
        Send Back
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
