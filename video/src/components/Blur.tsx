import React from 'react';

/**
 * Directional motion blur: an SVG gaussian blur stretched along the motion axis.
 * `x`/`y` are the smear lengths in px (per-frame displacement); 0 renders the child untouched.
 */
let n = 0;
export const Blur: React.FC<{ x?: number; y?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ x = 0, y = 0, style, children }) => {
  const id = React.useMemo(() => `mb${n++}`, []);
  const sx = Math.min(x, 120) / 2.2;
  const sy = Math.min(y, 120) / 2.2;
  const on = sx > 0.35 || sy > 0.35;
  return (
    <div style={{ ...style, filter: on ? `url(#${id})` : undefined }}>
      {on && (
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={`${sx.toFixed(2)} ${sy.toFixed(2)}`} />
          </filter>
        </svg>
      )}
      {children}
    </div>
  );
};
