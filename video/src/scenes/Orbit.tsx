import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../tokens';
import { impact, mono } from '../fonts';
import { accel, lin, snap } from '../motion';
import { WriteOn, accentStyle } from '../components/Kinetic';

// Bar 10 (f432-480, cobalt), under "...את הרשת השכונתית". The reference shape scene with Perko's subject:
// one ink dot splits (gooey) into six neighbourhood businesses that orbit inside a thin white ring, then they merge
// back into one dot, which opens into portal rings and the ink end card.
const CX = 960;
const CY = 470;
const names = ['בית קפה', 'מסעדה', 'מאפייה', 'חנות ספרים', 'פרחים', 'מעדנייה'];

export const Orbit: React.FC = () => {
  const g = useCurrentFrame();
  const split = snap(g, 1, 0, 1, 10) * (1 - accel(g, 32, 0, 1, 8));
  const spin = g * 0.022;
  const ring = snap(g, 4, 0, 1, 10);
  const portal = (k: number) => accel(g, 40 + k, 0, 1, 8 - k * 0.5);

  const blobs = names.map((n, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2 + spin;
    const r = 270 * split;
    return { n, x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r, a };
  });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, #22261C 0%, ${C.ink} 62%)` }}>
      <div style={{ position: 'absolute', bottom: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <WriteOn g={g} at={4} style={accentStyle(104, C.paper)}>רשת שכונתית אחת.</WriteOn>
      </div>

      <svg width="1920" height="1080" style={{ position: 'absolute' }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b" />
            <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -12" />
          </filter>
        </defs>
        <circle cx={CX} cy={CY} r={300} fill="none" stroke="rgba(248,248,244,0.6)" strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} opacity={1 - accel(g, 30, 0, 1, 8)} />
        <g filter="url(#goo)">
          <circle cx={CX} cy={CY} r={78 - split * 18} fill={C.lime} />
          {blobs.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={44} fill={C.lime} />)}
        </g>
      </svg>

      {blobs.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', left: CX + Math.cos(b.a) * 380, top: CY + Math.sin(b.a) * 380, transform: 'translate(-50%,-50%)',
          fontFamily: impact, fontWeight: 700, fontSize: 28, color: C.paper, whiteSpace: 'nowrap', direction: 'rtl',
          opacity: lin(g, 8 + i, 0, 1, 4) * (1 - lin(g, 30, 0, 1, 4)),
        }}>{b.n}</div>
      ))}
      <div style={{ position: 'absolute', left: 200, top: 200, fontFamily: mono, fontSize: 17, letterSpacing: '0.2em', color: C.onInk, direction: 'ltr', opacity: lin(g, 6, 0, 1, 4) * (1 - lin(g, 30, 0, 1, 4)) }}>
        n = 6 · ONE WALLET
      </div>

      {g >= 40 && [C.lime2, C.lime, C.lime2, C.lime].map((col, k) => {
        const d = 140 + portal(k) * 2700 * (1 - k * 0.1);
        return <div key={k} style={{ position: 'absolute', left: CX - d / 2, top: CY - d / 2, width: d, height: d, borderRadius: 9999, background: col }} />;
      })}
    </AbsoluteFill>
  );
};
