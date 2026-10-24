import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, BEAT } from '../tokens';
import { accent, impact, mono } from '../fonts';
import { accel, lin, snap } from '../motion';
import { Blur } from '../components/Blur';
import { Letters } from '../components/Letters';

// 1.5 bars (342-450, pale field). VO 5 at f342: "וכל עסק שמצטרף מגדיל את הרשת השכונתית."
// The site's neighbourhood map: a route from the café to the bakery, then the network grows pin by pin.
// Only the newest pin is cobalt (one signal); earlier pins settle to ink. This is the vision, labelled as such.
// Exit (portal rings): the last pin opens into concentric rings that zoom toward the camera and reveal the ink field.

const blocks: number[][] = [];
[0, 170, 340, 530, 700, 880].forEach((x, ci) => [0, 150, 310, 460, 620, 790, 950].forEach((y, ri) => {
  if (ci === 2 && ri === 3) return;
  blocks.push([x + 14, y + 14, [142, 142, 162, 142, 150, 200][ci], [122, 132, 122, 132, 142, 132, 140][ri]]);
}));

const pins = [
  { x: 330, y: 300, at: 4, label: 'קפה פינה' },
  { x: 690, y: 160, at: 22, label: 'מאפיית הגפן' },
  { x: 520, y: 600, at: 36 },
  { x: 860, y: 450, at: 42 },
  { x: 170, y: 760, at: 48 },
  { x: 990, y: 760, at: 54 },
  { x: 640, y: 880, at: 60 },
  { x: 760, y: 640, at: 66 },
];
const links = [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [2, 6], [3, 7], [6, 7]];
export const LAST_PIN = pins[pins.length - 1];

export const Network: React.FC = () => {
  const g = useCurrentFrame(); // 0 = f342
  const swap = BEAT * 2; // f378
  const mapS = snap(g, 0, 1.06, 1, 10) + g * 0.0003;
  const route = lin(g, 8, 0, 1, 14);
  const newest = pins.reduce((acc, p, i) => (g >= p.at ? i : acc), -1);

  const wX = (x: number) => snap(x, swap, -300, 0, 5);
  const wv = Math.abs(wX(g) - wX(g - 1));
  const impactStyle: React.CSSProperties = { fontFamily: impact, fontWeight: 900, fontSize: 160, letterSpacing: '-0.035em', color: C.ink, lineHeight: 1 };

  const portal = (k: number) => accel(g, 94 + k * 1.5, 0, 1, 12 - k);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 75% 35%, #F3F5FF 0%, ${C.pale} 60%)` }}>
      {/* map, bleeding off the left, top and bottom edges */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1020, height: 1080, overflow: 'hidden', background: C.paleStrong }}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${mapS})`, transformOrigin: `${LAST_PIN.x}px ${LAST_PIN.y}px` }}>
          <svg width="1100" height="1080">
            {blocks.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} rx={18} fill={C.paper} />)}
            <rect x={354} y={474} width={162} height={132} rx={18} fill="#C9D3FF" />
            <path d="M-20 700 L1120 420" stroke={C.paper} strokeWidth={34} />
            {links.map(([a, b], i) => {
              const A = pins[a]; const B = pins[b];
              const start = Math.max(A.at, B.at) - 4;
              const p = i === 0 ? route : lin(g, start, 0, 1, 8);
              return <line key={i} x1={A.x} y1={A.y} x2={A.x + (B.x - A.x) * p} y2={A.y + (B.y - A.y) * p} stroke={i === 0 ? C.cobalt : C.ink} strokeOpacity={i === 0 ? 1 : 0.35} strokeWidth={i === 0 ? 8 : 4} strokeLinecap="round" />;
            })}
          </svg>
          {pins.map((p, i) => {
            if (g < p.at) return null;
            const s = snap(g, p.at, 0.3, 1, 8);
            const isNew = i === newest;
            return (
              <React.Fragment key={i}>
                <div style={{ position: 'absolute', left: p.x - 24, top: p.y - 24, width: 48, height: 48, borderRadius: 99, background: isNew ? C.cobalt : C.ink, transform: `scale(${s})`, display: 'grid', placeItems: 'center' }}>
                  <div style={{ width: 16, height: 16, borderRadius: 99, background: C.white }} />
                </div>
                {isNew && <div style={{ position: 'absolute', left: p.x - 24, top: p.y - 24, width: 48, height: 48, borderRadius: 99, border: `3px solid ${C.cobalt}`, transform: `scale(${1 + lin(g, p.at, 0, 1.2, 14)})`, opacity: 1 - lin(g, p.at, 0, 1, 14) }} />}
                {p.label && (
                  <div style={{ position: 'absolute', left: p.x + 34, top: p.y - 24, background: C.white, borderRadius: 16, padding: '8px 16px', fontFamily: impact, fontSize: 22, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap', direction: 'rtl', opacity: snap(g, p.at + 2, 0, 1, 6), transform: `translateX(${snap(g, p.at + 2, 16, 0, 8)}px)` }}>
                    {p.label}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* right column type */}
      <div style={{ position: 'absolute', right: 160, top: 340, width: 700, direction: 'rtl' }}>
        <div style={{ fontFamily: mono, fontSize: 19, letterSpacing: '0.2em', color: C.slate, direction: 'ltr', display: 'flex', justifyContent: 'flex-end', gap: 16, alignItems: 'center', opacity: lin(g, 3, 0, 1, 4) }}>
          <span>ILLUSTRATIVE</span>
          <span style={{ width: lin(g, 3, 0, 120, 10), height: 1.5, background: 'rgba(17,21,34,0.35)' }} />
          <span>THE VISION</span>
        </div>
        <div style={{ height: 200, marginTop: 18, whiteSpace: 'nowrap' }}>
          {g < swap ? (
            <Letters text="עוד עסק," f={g} at={2} style={impactStyle} />
          ) : (
            <Blur x={wv}><div style={{ ...impactStyle, transform: `translateX(${wX(g)}px)` }}>רשת אחת.</div></Blur>
          )}
        </div>
        <div style={{ height: 110, marginTop: -6 }}>
          {g < swap ? (
            <Letters text="ועוד שכן." f={g} at={9} stagger={1} dur={10} style={{ fontFamily: accent, fontSize: 72, color: C.ink }} />
          ) : (
            <Letters text="שגדלה עם כל עסק." f={g} at={swap + 5} stagger={1} dur={10} style={{ fontFamily: accent, fontSize: 72, color: C.ink }} />
          )}
        </div>
      </div>

      {/* exit: portal rings from the last pin */}
      {g >= 94 && [C.ink, C.inkRaised, C.ink, C.inkRaised, C.ink].map((col, k) => {
        const p = portal(k);
        const d = p * 3600 * (1 - k * 0.12) + 10;
        return <div key={k} style={{ position: 'absolute', left: LAST_PIN.x - d / 2, top: LAST_PIN.y - d / 2, width: d, height: d, borderRadius: 9999, background: col }} />;
      })}
      {g >= 104 && <AbsoluteFill style={{ background: C.ink, opacity: lin(g, 104, 0, 1, 4) }} />}
    </AbsoluteFill>
  );
};
