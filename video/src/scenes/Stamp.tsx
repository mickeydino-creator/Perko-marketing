import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../tokens';
import { impact, mono } from '../fonts';
import { accel, lin, snap } from '../motion';
import { WriteOn, accentStyle } from '../components/Kinetic';

// Bar 6 (f240-288, paper), under "...ויצברו חותמות". Built like the reference data scene: a mono label row,
// a big rolling counter on the reading side, and a grid of stamps that fill with a stagger; the ninth stamp is the
// one signal (cobalt) and lands on beat 2. Exit (radial burst): its ring explodes and a cobalt disc opens from it.
const GRID = { x: 200, y: 360, cell: 150, gap: 26 };
const pos = (i: number) => {
  const col = i % 5; // right to left, like the app
  const row = Math.floor(i / 5);
  const x = GRID.x + (4 - col) * (GRID.cell + GRID.gap);
  const y = GRID.y + row * (GRID.cell + GRID.gap);
  return { x, y, cx: x + GRID.cell / 2, cy: y + GRID.cell / 2 };
};
const NEW = pos(8);

export const Stamp: React.FC = () => {
  const g = useCurrentFrame();
  const land = 12;
  const count = g < land ? Math.round(snap(g, 0, 1, 8, 10)) : 9;
  const roll = g < 10 ? Math.abs(snap(g, 0, 1, 8, 10) - snap(g - 1, 0, 1, 8, 10)) * 10 : 0;
  const burst = accel(g, 38, 0, 1, 10);
  const disc = accel(g, 39, 0, 3600, 9);
  const label: React.CSSProperties = { fontFamily: mono, fontSize: 17, letterSpacing: '0.06em', color: C.muted, direction: 'rtl' };

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 70% 40%, #FFFFFB 0%, ${C.paper} 55%, #EFEFE8 100%)` }}>
      {/* reading side: counter */}
      <div style={{ position: 'absolute', right: 180, top: 300, width: 520, direction: 'rtl' }}>
        <div style={{ ...label, textAlign: 'right' }}>חותמות · קפה פינה · דוגמה</div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 18, marginTop: 10, direction: 'ltr' }}>
          <span style={{ fontFamily: impact, fontWeight: 900, fontSize: 330, letterSpacing: '-0.05em', lineHeight: 0.9, color: C.ink, fontVariantNumeric: 'tabular-nums', filter: roll ? `blur(${Math.min(roll, 6)}px)` : undefined }}>{count}</span>
          <span style={{ fontFamily: impact, fontWeight: 800, fontSize: 92, color: C.ink, opacity: 0.85 }}>/10</span>
        </div>
        <WriteOn g={g} at={14} style={accentStyle(84, C.ink)}>עוד ביקור אחד.</WriteOn>
      </div>

      {/* stamp grid */}
      <div style={{ position: 'absolute', left: GRID.x, top: GRID.y - 60, ...label }}>כרטיס · 10 חותמות = קפה חינם</div>
      {Array.from({ length: 10 }, (_, i) => {
        const p = pos(i);
        const at = 1 + i * 1.2;
        const on = i < 8 ? g >= at + 2 : i === 8 ? g >= land : false;
        const s = i === 8 ? snap(g, land, 0.3, 1, 7) : snap(g, at, 0.6, 1, 7);
        return (
          <div key={i} style={{
            position: 'absolute', left: p.x, top: p.y, width: GRID.cell, height: GRID.cell, borderRadius: 999,
            background: on ? (i === 8 ? C.lime : C.ink) : i === 9 ? C.paper : C.tint,
            boxShadow: i === 9 ? `inset 0 0 0 5px ${C.tintStrong}` : i === 8 && on ? `inset 0 0 0 6px ${C.ink}` : undefined,
            transform: `scale(${g < at && i !== 8 ? 0 : s})`, opacity: i === 8 && g < land - 4 ? 0.0 : 1,
          }} />
        );
      })}
      {/* empty 9th slot before the stamp lands */}
      {g < land && <div style={{ position: 'absolute', left: NEW.x, top: NEW.y, width: GRID.cell, height: GRID.cell, borderRadius: 999, background: C.tint }} />}
      <div style={{ position: 'absolute', left: GRID.x, top: GRID.y + GRID.cell * 2 + GRID.gap + 34, ...label }}>{g >= land ? '9 מתוך 10 · עוד חותמת' : '8 מתוך 10'}</div>

      {/* landing ring, then the burst */}
      {g >= land && (
        <div style={{
          position: 'absolute', left: NEW.cx - GRID.cell / 2, top: NEW.cy - GRID.cell / 2, width: GRID.cell, height: GRID.cell, borderRadius: 999,
          border: `5px solid ${C.ink}`, transform: `scale(${g < 38 ? snap(g, land, 1, 1.7, 12) : 1.7 + burst * 18})`,
          opacity: g < 38 ? 1 - lin(g, land + 3, 0, 0.8, 14) : 0.9 - burst * 0.5,
        }} />
      )}
      {g >= 38 && Array.from({ length: 16 }, (_, i) => (
        <div key={i} style={{ position: 'absolute', left: NEW.cx, top: NEW.cy, width: 40 + burst * 500, height: 6, borderRadius: 6, background: C.ink, transformOrigin: '0 50%', transform: `rotate(${(i / 16) * 360}deg) translateX(${burst * 700}px)` }} />
      ))}
      <div style={{ position: 'absolute', left: NEW.cx - disc / 2, top: NEW.cy - disc / 2, width: disc, height: disc, borderRadius: 9999, background: C.lime }} />
    </AbsoluteFill>
  );
};
