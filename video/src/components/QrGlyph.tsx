import React from 'react';

// Same drawn QR-like glyph as the site (src/components/ui/QrGlyph.astro). Not a readable code.
const inFinder = (x: number, y: number) => (x < 7 && y < 7) || (x > 7 && y < 7) || (x < 7 && y > 7);
const cells: number[][] = [];
for (let y = 0; y < 15; y++) for (let x = 0; x < 15; x++) {
  if (inFinder(x, y)) continue;
  if ((x * 7 + y * 13 + x * y * 3) % 5 < 2) cells.push([x, y]);
}

export const QrGlyph: React.FC<{ color: string; bg?: string }> = ({ color, bg = '#fff' }) => (
  <svg viewBox="0 0 15 15" width="100%" height="100%" shapeRendering="crispEdges">
    {[[0, 0], [9, 0], [0, 9]].map(([x, y]) => (
      <g key={`${x}${y}`}>
        <rect x={x} y={y} width="6" height="6" rx="1.2" fill={color} />
        <rect x={x + 1} y={y + 1} width="4" height="4" rx="0.7" fill={bg} />
        <rect x={x + 2} y={y + 2} width="2" height="2" rx="0.4" fill={color} />
      </g>
    ))}
    {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" rx="0.2" fill={color} />)}
  </svg>
);
