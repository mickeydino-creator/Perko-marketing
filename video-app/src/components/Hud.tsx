import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FPS, S, SLOW } from '../tokens';
import { mono } from '../fonts';

// Mirrored HUD for RTL (STYLE_GUIDE §4.6): label top-right, counter top-left, tag bottom-right, timecode bottom-left.
const scenes = [
  { ...S.wallet, n: 1, tag: 'מוצר / ארנק', tone: 'dark' },
  { ...S.swipe, n: 2, tag: 'מוצר / החלקה', tone: 'light' },
  { ...S.discover, n: 3, tag: 'מוצר / גילוי', tone: 'light' },
  { ...S.collect, n: 4, tag: 'טיפוגרפיה בתנועה', tone: 'mixed' },
  { ...S.scan, n: 5, tag: 'מוצר / סריקה', tone: 'dark' },
  { ...S.redeem, n: 6, tag: 'מוצר / מימוש', tone: 'light' },
  { ...S.business, n: 7, tag: 'לעסקים', tone: 'mixed' },
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
  const f = useCurrentFrame(); // real frames: the timecode and blink run in real time
  const story = f / SLOW;
  const sc = scenes.find((s) => story >= s.from && story < s.to);
  if (!sc) return null;
  // kinetic scenes change field per beat: "collect" opens on ink, "business" resolves on ink (beats 3-4)
  const local = story - sc.from;
  const dark = sc.tone === 'dark' || (sc.tone === 'mixed' && (sc.n === 4 ? local < 12 : local >= 24 && local < 40));
  const color = dark ? 'rgba(248,248,244,0.75)' : 'rgba(17,19,15,0.72)';
  const dot = dark ? C.lime : C.ink;
  const m = 64;
  const text: React.CSSProperties = { fontFamily: mono, fontSize: 15, letterSpacing: '0.06em', color, position: 'absolute', whiteSpace: 'nowrap', direction: 'rtl' };
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ ...text, top: m - 8, right: m, display: 'flex', alignItems: 'center', gap: 12 }}>
        פרקו - האפליקציה 2026
        <span style={{ width: 9, height: 9, borderRadius: 9, background: dot }} />
        <Bracket corner="tr" color={color} />
      </div>
      <div style={{ ...text, top: m - 8, left: m }}>
        סצנה {String(sc.n).padStart(2, '0')} / 07
        <Bracket corner="tl" color={color} />
      </div>
      <div style={{ ...text, bottom: m - 8, right: m }}>
        {sc.tag}
        <Bracket corner="br" color={color} />
      </div>
      <div style={{ ...text, direction: 'ltr', bottom: m - 8, left: m, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 8, height: 8, borderRadius: 8, background: dot, opacity: Math.floor(f / 9) % 2 ? 1 : 0.35 }} />
        {tc(f)}
        <Bracket corner="bl" color={color} />
      </div>
    </AbsoluteFill>
  );
};
