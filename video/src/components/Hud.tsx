import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FPS, S } from '../tokens';
import { mono } from '../fonts';

// Mirrored HUD for RTL (STYLE_GUIDE §4.6): label top-right, counter top-left, tag bottom-right, timecode bottom-left.
const scenes = [
  { ...S.collect, n: 1, tag: 'PRODUCT / COLLECT', tone: 'light' },
  { ...S.redeem, n: 2, tag: 'PRODUCT / REDEEM', tone: 'dark' },
  { ...S.network, n: 3, tag: 'VISION / NETWORK', tone: 'light' },
] as const;

const tc = (f: number) => {
  const s = Math.floor(f / FPS);
  const ff = f % FPS;
  const p = (v: number) => String(v).padStart(2, '0');
  return `00:00:${p(s)}:${p(ff)}`;
};

const Bracket: React.FC<{ corner: 'tl' | 'tr' | 'bl' | 'br'; color: string }> = ({ corner, color }) => {
  const size = 18;
  const b = `1.5px solid ${color}`;
  const st: React.CSSProperties = { width: size, height: size, position: 'absolute' };
  if (corner === 'tl') Object.assign(st, { top: -10, left: -10, borderTop: b, borderLeft: b });
  if (corner === 'tr') Object.assign(st, { top: -10, right: -10, borderTop: b, borderRight: b });
  if (corner === 'bl') Object.assign(st, { bottom: -10, left: -10, borderBottom: b, borderLeft: b });
  if (corner === 'br') Object.assign(st, { bottom: -10, right: -10, borderBottom: b, borderRight: b });
  return <span style={st} />;
};

export const Hud: React.FC = () => {
  const f = useCurrentFrame();
  const sc = scenes.find((s) => f >= s.from && f < s.to);
  if (!sc) return null;
  const color = sc.tone === 'dark' ? 'rgba(255,255,255,0.78)' : 'rgba(17,21,34,0.66)';
  const dot = sc.tone === 'dark' ? C.white : C.cobalt;
  const m = 80;
  const text: React.CSSProperties = { fontFamily: mono, fontSize: 17, letterSpacing: '0.18em', color, position: 'absolute', whiteSpace: 'nowrap', direction: 'ltr' };
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ ...text, top: m - 8, right: m, display: 'flex', alignItems: 'center', gap: 12 }}>
        PERKO - FOR BUSINESS 2026
        <span style={{ width: 9, height: 9, borderRadius: 9, background: dot }} />
        <Bracket corner="tr" color={color} />
      </div>
      <div style={{ ...text, top: m - 8, left: m }}>
        SCENE {String(sc.n).padStart(2, '0')} / 03
        <Bracket corner="tl" color={color} />
      </div>
      <div style={{ ...text, bottom: m - 8, right: m }}>
        {sc.tag}
        <Bracket corner="br" color={color} />
      </div>
      <div style={{ ...text, bottom: m - 8, left: m, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 8, height: 8, borderRadius: 8, background: dot, opacity: Math.floor(f / 9) % 2 ? 1 : 0.35 }} />
        {tc(f)}
        <Bracket corner="bl" color={color} />
      </div>
    </AbsoluteFill>
  );
};
