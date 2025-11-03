'use client';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import useDivStore from '@/store/UseDivStore';
import { getResponsiveValue } from '@/utils/screen';
import throttle from '@/utils/throttle';
import CardToolbar from './card/CardToolbar';
import DraggableCardItem from './card/DraggableCardItem';
import { applySnap, clamp, getPoint } from './card/cardUtils';

export default function CardElement({
  element,
  parentId,
  boxId,
  updateElement,
}) {
  const { screenSize } = useDivStore();
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Card-wide options
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [gridSize, setGridSize] = useState(8);
  const [lockAspect, setLockAspect] = useState(true);

  // Items state (text/image overlays)
  const [items, setItems] = useState(() => {
    const init = Array.isArray(element.items) ? element.items : [];
    return init.map((it) => ({ ...it }));
  });

  // Selection state
  const [selectedId, setSelectedId] = useState(null);
  const selectedItem = useMemo(
    () => items.find((it) => it.id === selectedId),
    [items, selectedId]
  );

  // History stacks for undo/redo
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const pushHistory = useCallback((prevItems) => {
    undoStackRef.current.push(JSON.stringify(prevItems));
    if (undoStackRef.current.length > 100) undoStackRef.current.shift();
    redoStackRef.current.length = 0;
  }, []);
  const undo = () => {
    if (undoStackRef.current.length === 0) return;
    const prev = undoStackRef.current.pop();
    redoStackRef.current.push(JSON.stringify(items));
    const parsed = JSON.parse(prev);
    setItems(parsed);
    persist(parsed);
  };
  const redo = () => {
    if (redoStackRef.current.length === 0) return;
    const next = redoStackRef.current.pop();
    undoStackRef.current.push(JSON.stringify(items));
    const parsed = JSON.parse(next);
    setItems(parsed);
    persist(parsed);
  };

  // Normalize positions to percentages for responsive behavior
  const getContainerSize = () => {
    const el = containerRef.current;
    if (!el) return { w: 1, h: 1 };
    return { w: el.clientWidth || 1, h: el.clientHeight || 1 };
  };
  const pxToPct = (px, total) => (total ? Math.max(0, px) / total : 0);
  const pctToPx = (pct, total) => Math.round((pct || 0) * (total || 0));

  // Persist items to element (kept inside component)
  const persist = useCallback(
    (nextItems) => {
      const { w, h } = getContainerSize();
      const normalized = nextItems.map((it) => ({
        ...it,
        xPct: pxToPct(it.x, w),
        yPct: pxToPct(it.y, h),
        wPct: pxToPct(it.width, w),
        hPct: pxToPct(it.height, h),
      }));
      updateElement(parentId, boxId, element.id, { items: normalized });
    },
    [updateElement, parentId, boxId, element.id]
  );

  // Update a single item (used by DraggableCardItem)
  const updateItem = (id, patch) => {
    setItems((prev) => {
      const next = prev.map((it) =>
        it.id === id
          ? {
              ...it,
              ...patch,
              style: patch.style ? { ...it.style, ...patch.style } : it.style,
            }
          : it
      );
      persist(next);
      return next;
    });
  };

  // Load items from element on mount/update
  useEffect(() => {
    const { w, h } = getContainerSize();
    const source = Array.isArray(element.items) ? element.items : [];
    // element.items may already be normalized (percentages)
    const loaded = source.map((it) => {
      const x = it.xPct != null ? pctToPx(it.xPct, w) : it.x || 0;
      const y = it.yPct != null ? pctToPx(it.yPct, h) : it.y || 0;
      const width = it.wPct != null ? pctToPx(it.wPct, w) : it.width || 100;
      const height = it.hPct != null ? pctToPx(it.hPct, h) : it.height || 50;
      return {
        id: it.id || `item-${Math.random().toString(36).slice(2)}`,
        type: it.type || 'text', // 'text' | 'image'
        content: it.content || '',
        imageUrl: it.imageUrl || null,
        x,
        y,
        width,
        height,
        zIndex: it.zIndex ?? 1,
        shadow: it.shadow ?? true,
        lockAspect: it.lockAspect ?? true,
        style: it.style || {}, // font etc
      };
    });
    setItems(loaded);
  }, [element.items]);

  // Utility: snapping and clamping
  const applySnap = (v) =>
    snapEnabled ? Math.round(v / gridSize) * gridSize : v;
  const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

  // Add text area
  const addText = () => {
    const { w, h } = getContainerSize();
    const prev = items;
    pushHistory(prev);
    const newItem = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'Double-click to edit',
      x: Math.round(w * 0.1),
      y: Math.round(h * 0.1),
      width: Math.round(w * 0.3),
      height: Math.round(h * 0.2),
      zIndex: items.length + 1,
      shadow: true,
      lockAspect: false,
      style: {
        fontSize: 18,
        color: '#222',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'normal',
        textAlign: 'left',
      },
    };
    const next = [...items, newItem];
    setItems(next);
    persist(next);
    setSelectedId(newItem.id);
  };

  // Add image
  const addImage = (imageUrl, contentName = 'Image') => {
    const { w, h } = getContainerSize();
    const prev = items;
    pushHistory(prev);
    const newItem = {
      id: `image-${Date.now()}`,
      type: 'image',
      imageUrl,
      content: contentName,
      x: Math.round(w * 0.2),
      y: Math.round(h * 0.2),
      width: Math.round(w * 0.3),
      height: Math.round(h * 0.3),
      zIndex: items.length + 1,
      shadow: true,
      lockAspect: true,
      style: {},
    };
    const next = [...items, newItem];
    setItems(next);
    persist(next);
    setSelectedId(newItem.id);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      addImage(ev.target.result, file.name);
    };
    reader.readAsDataURL(file);
  };

  // Drag/resize interactions
  const dragStateRef = useRef(null);
  const resizeStateRef = useRef(null);

  const getPoint = (e) => {
    const t = e.touches?.[0];
    return {
      x: (t ? t.clientX : e.clientX) ?? 0,
      y: (t ? t.clientY : e.clientY) ?? 0,
    };
  };

  const startDrag = (item, e) => {
    e.stopPropagation();
    const pt = getPoint(e);
    const rect = containerRef.current.getBoundingClientRect();
    dragStateRef.current = {
      id: item.id,
      offsetX: pt.x - rect.left - item.x,
      offsetY: pt.y - rect.top - item.y,
    };
    setSelectedId(item.id);
    window.addEventListener('mousemove', onDragMove, { passive: false });
    window.addEventListener('touchmove', onDragMove, { passive: false });
    window.addEventListener('mouseup', endDrag, { passive: true });
    window.addEventListener('touchend', endDrag, { passive: true });
  };

  const throttledDragMove = useMemo(
    () =>
      throttle((pt, rect) => {
        const ds = dragStateRef.current;
        if (!ds) return;
        const { w, h } = { w: rect.width, h: rect.height };

        setItems((prev) => {
          const next = prev.map((it) => {
            if (it.id !== ds.id) return it;
            let nx = applySnap(pt.x - rect.left - ds.offsetX);
            let ny = applySnap(pt.y - rect.top - ds.offsetY);
            nx = clamp(nx, 0, w - it.width);
            ny = clamp(ny, 0, h - it.height);
            return { ...it, x: nx, y: ny };
          });
          return next;
        });
      }, 16),
    [snapEnabled, gridSize]
  );

  const onDragMove = (e) => {
    e.preventDefault();
    const pt = getPoint(e);
    const rect = containerRef.current.getBoundingClientRect();
    throttledDragMove(pt, rect);
  };

  const endDrag = () => {
    window.removeEventListener('mousemove', onDragMove);
    window.removeEventListener('touchmove', onDragMove);
    window.removeEventListener('mouseup', endDrag);
    window.removeEventListener('touchend', endDrag);
    dragStateRef.current = null;
    // persist after drag
    pushHistory(items);
    persist(items);
  };

  // Resize handles: 8-directional, but we will implement corner + edges minimally
  const startResize = (item, handle, e) => {
    e.stopPropagation();
    const pt = getPoint(e);
    const rect = containerRef.current.getBoundingClientRect();
    resizeStateRef.current = {
      id: item.id,
      handle, // 'tl','tr','bl','br','l','r','t','b'
      startX: pt.x,
      startY: pt.y,
      startW: item.width,
      startH: item.height,
      startItemX: item.x,
      startItemY: item.y,
      containerRect: rect,
      aspect: lockAspect || item.lockAspect ? item.width / item.height : null,
    };
    setSelectedId(item.id);
    window.addEventListener('mousemove', onResizeMove, { passive: false });
    window.addEventListener('touchmove', onResizeMove, { passive: false });
    window.addEventListener('mouseup', endResize, { passive: true });
    window.addEventListener('touchend', endResize, { passive: true });
  };

  const throttledResizeMove = useMemo(
    () =>
      throttle((pt) => {
        const rs = resizeStateRef.current;
        if (!rs) return;

        setItems((prev) => {
          return prev.map((it) => {
            if (it.id !== rs.id) return it;

            const dx = pt.x - rs.startX;
            const dy = pt.y - rs.startY;

            let newW = rs.startW;
            let newH = rs.startH;
            let newX = rs.startItemX;
            let newY = rs.startItemY;

            const applyAspect = (w, h, handle) => {
              if (!rs.aspect) return { w, h };
              // maintain aspect ratio
              if (handle === 'l' || handle === 'r') {
                return { w, h: Math.round(w / rs.aspect) };
              }
              if (handle === 't' || handle === 'b') {
                return { w: Math.round(h * rs.aspect), h };
              }
              // corners
              const candidateH = Math.round(w / rs.aspect);
              const candidateW = Math.round(h * rs.aspect);
              // prefer the one closer to drag delta
              if (Math.abs(candidateH - h) < Math.abs(candidateW - w)) {
                return { w, h: candidateH };
              }
              return { w: candidateW, h };
            };

            switch (rs.handle) {
              case 'r':
                newW = rs.startW + dx;
                break;
              case 'l':
                newW = rs.startW - dx;
                newX = rs.startItemX + dx;
                break;
              case 'b':
                newH = rs.startH + dy;
                break;
              case 't':
                newH = rs.startH - dy;
                newY = rs.startItemY + dy;
                break;
              case 'br':
                newW = rs.startW + dx;
                newH = rs.startH + dy;
                break;
              case 'bl':
                newW = rs.startW - dx;
                newH = rs.startH + dy;
                newX = rs.startItemX + dx;
                break;
              case 'tr':
                newW = rs.startW + dx;
                newH = rs.startH - dy;
                newY = rs.startItemY + dy;
                break;
              case 'tl':
                newW = rs.startW - dx;
                newH = rs.startH - dy;
                newX = rs.startItemX + dx;
                newY = rs.startItemY + dy;
                break;
              default:
                break;
            }

            // apply aspect ratio
            const aspectApplied = applyAspect(newW, newH, rs.handle);
            newW = aspectApplied.w;
            newH = aspectApplied.h;

            // snap sizes and positions
            newW = applySnap(newW);
            newH = applySnap(newH);
            newX = applySnap(newX);
            newY = applySnap(newY);

            // clamp to container
            const maxW = rs.containerRect.width;
            const maxH = rs.containerRect.height;
            newW = clamp(newW, 10, maxW);
            newH = clamp(newH, 10, maxH);
            newX = clamp(newX, 0, maxW - newW);
            newY = clamp(newY, 0, maxH - newH);

            return { ...it, width: newW, height: newH, x: newX, y: newY };
          });
        });
      }, 16),
    [lockAspect, snapEnabled, gridSize]
  );

  const onResizeMove = (e) => {
    e.preventDefault();
    const pt = getPoint(e);
    throttledResizeMove(pt);
  };
  const endResize = () => {
    window.removeEventListener('mousemove', onResizeMove);
    window.removeEventListener('touchmove', onResizeMove);
    window.removeEventListener('mouseup', endResize);
    window.removeEventListener('touchend', endResize);
    // persist after resize
    pushHistory(items);
    persist(items);
    resizeStateRef.current = null;
  };

  // Edit text
  const editText = (item) => {
    const newContent = prompt('Edit text content:', item.content ?? '');
    if (newContent == null) return;
    const prev = items;
    pushHistory(prev);
    const next = items.map((it) =>
      it.id === item.id ? { ...it, content: newContent } : it
    );
    setItems(next);
    persist(next);
  };

  // Layer management
  const bringForward = () => {
    if (!selectedItem) return;
    const prev = items;
    pushHistory(prev);
    const maxZ = Math.max(...items.map((it) => it.zIndex || 1), 1);
    const next = items.map((it) =>
      it.id === selectedItem.id ? { ...it, zIndex: (it.zIndex || 1) + 1 } : it
    );
    setItems(next);
    persist(next);
  };
  const sendBackward = () => {
    if (!selectedItem) return;
    const prev = items;
    pushHistory(prev);
    const next = items.map((it) =>
      it.id === selectedItem.id
        ? { ...it, zIndex: Math.max(1, (it.zIndex || 1) - 1) }
        : it
    );
    setItems(next);
    persist(next);
  };

  // Center alignment helpers
  const centerSelected = (axis = 'both') => {
    if (!selectedItem) return;
    const { w, h } = getContainerSize();
    const prev = items;
    pushHistory(prev);
    const next = items.map((it) => {
      if (it.id !== selectedItem.id) return it;
      const nx = axis === 'y' ? it.x : Math.round((w - it.width) / 2);
      const ny = axis === 'x' ? it.y : Math.round((h - it.height) / 2);
      return { ...it, x: nx, y: ny };
    });
    setItems(next);
    persist(next);
  };

  // Alignment guides on near center
  const guides = useMemo(() => {
    if (!selectedItem) return { v: false, h: false };
    const { w, h } = getContainerSize();
    const epsilon = gridSize; // snap range
    const isNearCenterX =
      Math.abs(selectedItem.x - (w - selectedItem.width) / 2) < epsilon;
    const isNearCenterY =
      Math.abs(selectedItem.y - (h - selectedItem.height) / 2) < epsilon;
    return { v: isNearCenterX, h: isNearCenterY };
  }, [selectedItem, gridSize]);

  // UI toolbar
  const Toolbar = () => (
    <div
      className="absolute top-2 left-2 flex gap-2 px-2 py-1 rounded bg-white/80 shadow"
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
          fileInputRef.current?.click();
        }}
      >
        Add Image
      </button>
      <label className="px-2 py-1 border rounded cursor-pointer">
        <input
          type="checkbox"
          checked={snapEnabled}
          onChange={(e) => setSnapEnabled(e.target.checked)}
        />
        <span className="ml-1">Snap</span>
      </label>
      <label className="px-2 py-1 border rounded cursor-pointer">
        <input
          type="checkbox"
          checked={lockAspect}
          onChange={(e) => setLockAspect(e.target.checked)}
        />
        <span className="ml-1">Lock Aspect</span>
      </label>
      <button className="px-2 py-1 border rounded" onClick={undo}>
        Undo
      </button>
      <button className="px-2 py-1 border rounded" onClick={redo}>
        Redo
      </button>
      <button
        className="px-2 py-1 border rounded"
        onClick={() => centerSelected('x')}
      >
        Center X
      </button>
      <button
        className="px-2 py-1 border rounded"
        onClick={() => centerSelected('y')}
      >
        Center Y
      </button>
      <button
        className="px-2 py-1 border rounded"
        onClick={() => centerSelected('both')}
      >
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
        onChange={handleImageUpload}
      />
    </div>
  );

  // Render a single overlay item
  const ItemView = ({ it }) => {
    const commonStyle = {
      position: 'absolute',
      left: it.x,
      top: it.y,
      width: it.width,
      height: it.height,
      zIndex: it.zIndex || 1,
      boxShadow: it.shadow ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
      outline:
        selectedId === it.id
          ? '2px solid rgba(99,102,241,0.9)'
          : '1px solid rgba(0,0,0,0.1)',
      borderRadius: 4,
      backgroundColor: it.type === 'text' ? '#ffffff80' : 'transparent',
      overflow: 'hidden',
      cursor: 'move',
      userSelect: 'none',
    };

    const handleDoubleClick = () => {
      if (it.type === 'text') editText(it);
    };

    const handleMouseDown = (e) => startDrag(it, e);
    const handleTouchStart = (e) => startDrag(it, e);

    const RenderResizeHandle = (pos) => (
      <div
        onMouseDown={(e) => startResize(it, pos, e)}
        onTouchStart={(e) => startResize(it, pos, e)}
        style={{
          position: 'absolute',
          width: 10,
          height: 10,
          background: '#6366f1',
          borderRadius: 2,
          ...(pos === 'tl' && { left: -5, top: -5 }),
          ...(pos === 'tr' && { right: -5, top: -5 }),
          ...(pos === 'bl' && { left: -5, bottom: -5 }),
          ...(pos === 'br' && { right: -5, bottom: -5 }),
          ...(pos === 'l' && {
            left: -5,
            top: '50%',
            transform: 'translateY(-50%)',
          }),
          ...(pos === 'r' && {
            right: -5,
            top: '50%',
            transform: 'translateY(-50%)',
          }),
          ...(pos === 't' && {
            top: -5,
            left: '50%',
            transform: 'translateX(-50%)',
          }),
          ...(pos === 'b' && {
            bottom: -5,
            left: '50%',
            transform: 'translateX(-50%)',
          }),
          display: selectedId === it.id ? 'block' : 'none',
        }}
      />
    );

    return (
      <div
        className="card-item"
        style={commonStyle}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={handleDoubleClick}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedId(it.id);
        }}
      >
        {it.type === 'text' ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              fontSize: `${getResponsiveValue(it.style?.fontSize, screenSize) || it.style?.fontSize || 16}px`,
              fontFamily:
                getResponsiveValue(it.style?.fontFamily, screenSize) ||
                it.style?.fontFamily ||
                'Arial, sans-serif',
              color:
                getResponsiveValue(it.style?.color, screenSize) ||
                it.style?.color ||
                '#222',
              fontStyle:
                getResponsiveValue(it.style?.fontStyle, screenSize) ||
                it.style?.fontStyle ||
                'normal',
              textAlign:
                getResponsiveValue(it.style?.textAlign, screenSize) ||
                it.style?.textAlign ||
                'left',
              padding: 8,
              outline: 'none',
            }}
          >
            {it.content}
          </div>
        ) : (
          <>
            {it.imageUrl ? (
              <img
                src={it.imageUrl}
                alt={it.content || 'Card Image'}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  userSelect: 'none',
                }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-gray-400 text-xs"
                style={{ background: '#f8fafc' }}
              >
                No image
              </div>
            )}
          </>
        )}

        {/* Resize handles */}
        {RenderResizeHandle('tl')}
        {RenderResizeHandle('tr')}
        {RenderResizeHandle('bl')}
        {RenderResizeHandle('br')}
        {RenderResizeHandle('l')}
        {RenderResizeHandle('r')}
        {RenderResizeHandle('t')}
        {RenderResizeHandle('b')}
      </div>
    );
  };

  // Container background and border from element props
  const borderRadius =
    getResponsiveValue(element.borderRadius, screenSize) || 8;
  const border =
    getResponsiveValue(element.border, screenSize) ||
    '1px solid rgba(0,0,0,0.1)';
  const backgroundColor =
    getResponsiveValue(element.backgroundColor, screenSize) || 'transparent';

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      style={{
        border,
        borderRadius,
        backgroundColor,
      }}
      onMouseDown={() => setSelectedId(null)}
      onTouchStart={() => setSelectedId(null)}
    >
      {/* Removed in-card toolbar; CardPropertiesPanel controls additions */}

      {/* Alignment guides */}
      {selectedItem && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: 0,
              borderTop: guides.h
                ? '2px dashed rgba(99,102,241,0.9)'
                : '1px dashed rgba(0,0,0,0.1)',
              zIndex: 999,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 0,
              borderLeft: guides.v
                ? '2px dashed rgba(99,102,241,0.9)'
                : '1px dashed rgba(0,0,0,0.1)',
              zIndex: 999,
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      {/* Items rendered via react-rnd component */}
      {items
        .slice()
        .sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1))
        .map((it) => (
          <DraggableCardItem
            key={it.id}
            item={it}
            isSelected={selectedId === it.id}
            onSelect={setSelectedId}
            onUpdate={updateItem}
            onEditText={(item) => setSelectedId(item.id)}
            screenSize={screenSize}
            containerBounds={{
              width: getContainerSize().w,
              height: getContainerSize().h,
            }}
            snapEnabled={snapEnabled}
            gridSize={gridSize}
            onDragStart={() => {}}
            onDragEnd={() => {
              pushHistory(items);
              persist(items);
            }}
            onResizeStart={() => {}}
            onResizeEnd={() => {
              pushHistory(items);
              persist(items);
            }}
          />
        ))}
    </div>
  );
}
