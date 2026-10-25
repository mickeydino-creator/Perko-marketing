import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useStoryFrame } from '../time';
import { C } from '../tokens';
import { impact, mono } from '../fonts';
import { accel, lin, snap } from '../motion';

// Bar 9 (f384-432, pale). VO 5 "וכל עסק שמצטרף מגדיל את הרשת השכונתית". The site's neighbourhood map, full frame:
// the café, a route to the bakery, then more businesses join one per half beat. Only the newest pin is cobalt.
// This is the vision and is labelled as such. Exit: the last pin (frame centre) grows into the cobalt field.
const blocks: number[][] = [];
[0, 210, 420, 650, 860, 1080, 1290, 1520, 1730].forEach((x, ci) => [0, 170, 350, 520, 700, 880].forEach((y, ri) => {
  blocks.push([x + 16, y + 16, [178, 178, 198, 178, 188, 178, 198, 178, 200][ci], [138, 148, 138, 148, 148, 180][ri]]);
}));
const pins = [
  { x: 520, y: 330, at: 2, label: 'קפה פינה' },
  { x: 1180, y: 250, at: 8, label: 'מאפיית הגפן' },
  { x: 760, y: 760, at: 16 },
  { x: 1480, y: 600, at: 20 },
  { x: 300, y: 820, at: 24 },
  { x: 1660, y: 300, at: 28 },
  { x: 1240, y: 900, at: 32 },
  { x: 960, y: 540, at: 36 },
];
const links = [[0, 1], [0, 2], [1, 3], [2, 4], [1, 5], [3, 6], [2, 7], [3, 7], [0, 7]];

export const MapScene: React.FC = () => {
  const g = useStoryFrame();
  const zoom = snap(g, 0, 1.08, 1, 9) + lin(g, 9, 0, 0.03, 39);
  const newest = pins.reduce((acc, p, i) => (g >= p.at ? i : acc), -1);
  const grow = accel(g, 40, 0, 1, 8);
  const label: React.CSSProperties = { position: 'absolute', fontFamily: mono, fontSize: 17, letterSpacing: '0.06em', color: C.muted, direction: 'rtl', padding: '6px 0' };

  return (
    <AbsoluteFill style={{ background: C.lime }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: '960px 540px' }}>
        <svg width="1920" height="1080" style={{ position: 'absolute' }}>
          {blocks.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx={22} fill="rgba(17,19,15,0.07)" />)}
          <path d="M-40 760 L1960 420" stroke={C.lime} strokeWidth={40} />
          {links.map(([a, b], i) => {
            const A = pins[a]; const B = pins[b];
            const p = lin(g, Math.max(A.at, B.at) - 2, 0, 1, 7);
            return <line key={i} x1={A.x} y1={A.y} x2={A.x + (B.x - A.x) * p} y2={A.y + (B.y - A.y) * p} stroke={C.ink} strokeOpacity={i === 0 ? 1 : 0.35} strokeWidth={i === 0 ? 9 : 4} strokeLinecap="round" />;
          })}
        </svg>
        {pins.map((p, i) => {
          if (g < p.at) return null;
          const s = snap(g, p.at, 0.3, 1, 7);
          const isNew = i === newest;
          const isLast = i === pins.length - 1;
          const size = 56 + (isLast ? grow * 2600 : 0);
          return (
            <React.Fragment key={i}>
              <div style={{ position: 'absolute', left: p.x - size / 2, top: p.y - size / 2, width: size, height: size, borderRadius: 9999, background: isNew ? C.ink : C.paper, transform: `scale(${s})`, display: 'grid', placeItems: 'center' }}>
                <div style={{ width: 18, height: 18, borderRadius: 99, background: isNew ? C.lime : C.ink, opacity: 1 - grow * 4 }} />
              </div>
              {isNew && <div style={{ position: 'absolute', left: p.x - 28, top: p.y - 28, width: 56, height: 56, borderRadius: 99, border: `4px solid ${C.ink}`, transform: `scale(${1 + lin(g, p.at, 0, 1.3, 12)})`, opacity: (1 - lin(g, p.at, 0, 1, 12)) * (1 - grow) }} />}
              {p.label && (
                <div style={{ position: 'absolute', left: p.x + 40, top: p.y - 26, background: C.ink, borderRadius: 999, padding: '8px 20px', fontFamily: impact, fontSize: 26, fontWeight: 700, color: C.lime, whiteSpace: 'nowrap', direction: 'rtl', opacity: snap(g, p.at + 2, 0, 1, 6) * (1 - grow), transform: `translateX(${snap(g, p.at + 2, 18, 0, 8)}px)` }}>
                  {p.label}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
      <div style={{ ...label, right: 180, top: 180, opacity: 1 - grow }}>חזון · מפה להמחשה</div>
      <div style={{ ...label, left: 180, bottom: 180, opacity: 1 - grow }}>שמות לדוגמה</div>
    </AbsoluteFill>
  );
};
