export const applySnap = (v, enabled, gridSize) =>
  enabled ? Math.round(v / gridSize) * gridSize : v;

export const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

export const getPoint = (e) => {
  const t = e.touches?.[0];
  return {
    x: (t ? t.clientX : e.clientX) ?? 0,
    y: (t ? t.clientY : e.clientY) ?? 0,
  };
};
