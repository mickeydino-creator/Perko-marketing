import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../tokens';
import { mono } from '../fonts';
import { accel, lin, snap } from '../motion';
import { Blur } from '../components/Blur';

// Bar 1 (f0-48, ink). As in the reference boot: a cobalt spark falls and settles as a dot, a terminal line types
// beside it and is rewritten, a line stretches across the frame, flexes, thickens into a band and blooms into a
// flash (line -> flash) that cools into the paper field of the next scene.
export const Boot: React.FC = () => {
  const f = useCurrentFrame();
  const y = (x: number) => accel(x, 0, -380, 0, 9);
  const v = Math.abs(y(f) - y(f - 1));

  const first = 'פרקו // נאמנות';
  const second = 'פרקו / לעסקים - 2026';
  const text = f < 22 ? first.slice(0, Math.floor(lin(f, 12, 0, first.length, 9))) : second.slice(0, Math.floor(lin(f, 22, 6, second.length, 9)));

  const lineW = snap(f, 22, 0, 1, 8);
  const flex = Math.sin(f / 2.2) * lin(f, 30, 0, 6, 6);
  const band = accel(f, 38, 3, 220, 6);
  const flash = lin(f, 42, 0, 1, 3);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, #1E2219 0%, ${C.ink} 65%)` }}>
      {/* faint grid with dot marks at the intersections */}
      <svg width="1920" height="1080" style={{ position: 'absolute', opacity: 0.5 }}>
        {Array.from({ length: 13 }, (_, i) => <line key={`v${i}`} x1={i * 160} y1={0} x2={i * 160} y2={1080} stroke="#22261D" strokeWidth={1} />)}
        {Array.from({ length: 8 }, (_, i) => <line key={`h${i}`} x1={0} y1={i * 160 + 60} x2={1920} y2={i * 160 + 60} stroke="#22261D" strokeWidth={1} />)}
        {Array.from({ length: 13 * 8 }, (_, i) => <circle key={i} cx={(i % 13) * 160} cy={Math.floor(i / 13) * 160 + 60} r={1.8} fill="#4C5243" />)}
      </svg>

      {/* the line, then the band */}
      {f >= 22 && (
        <div style={{
          position: 'absolute', left: 960 - 960 * lineW, width: 1920 * lineW, top: 540 - band / 2 + flex, height: band,
          background: f < 38 ? C.lime : '#EEFFB0', borderRadius: band,
          boxShadow: `0 0 ${24 + band * 0.6}px ${8 + band * 0.3}px rgba(215,255,53,0.6)`,
        }} />
      )}

      {/* spark -> dot */}
      <div style={{ position: 'absolute', left: 960, top: 540 + flex, width: 0, height: 0 }}>
        <Blur y={v}>
          <div style={{ width: 22, height: 22, marginLeft: -11, marginTop: -11, borderRadius: 22, background: C.lime, transform: `translateY(${y(f)}px)`, boxShadow: '0 0 26px 6px rgba(215,255,53,0.75)' }} />
        </Blur>
      </div>

      {/* terminal line */}
      {f >= 12 && (
        <div style={{ position: 'absolute', top: 574, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: 1 - lin(f, 38, 0, 1, 4) }}>
          <div style={{ fontFamily: mono, fontSize: 24, color: C.paper, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 4, direction: 'rtl' }}>
            {text}
            <span style={{ width: 13, height: 26, background: C.lime }} />
          </div>
        </div>
      )}

      {/* flash: white-hot, then cooling toward the paper field */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #FFFFF4 0%, #F1FFB8 40%, #D7FF35 100%)`, opacity: flash }} />
    </AbsoluteFill>
  );
};
