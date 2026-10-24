import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, BEAT } from '../tokens';
import { impact, mono } from '../fonts';
import { accel, lin, rnd, snap } from '../motion';
import { Blur } from '../components/Blur';
import { Letters } from '../components/Letters';

// Bar 1 (0-72, ink). VO 1 at f18: "כל עסק עם כרטיס אחר."
// Four loyalty cards from four businesses snap in around the line; the cobalt spark lands as its period.
// Exit (collapse to a glowing shape): the cards are sucked into the dot, the dot opens to the cobalt field.

const cards = [
  { kind: 'punch', x: 1340, y: 205, r: -7, from: [260, -60] },
  { kind: 'club', x: 330, y: 190, r: 6, from: [-300, -40] },
  { kind: 'app', x: 1330, y: 735, r: 4, from: [280, 80] },
  { kind: 'slip', x: 380, y: 720, r: -6, from: [-260, 90] },
] as const;

const Card: React.FC<{ kind: (typeof cards)[number]['kind'] }> = ({ kind }) => {
  const base: React.CSSProperties = { borderRadius: 22, padding: '22px 26px', fontFamily: impact, direction: 'rtl', textAlign: 'right' };
  const label = (t: string, c = C.slate) => <div style={{ fontSize: 20, color: c, fontWeight: 500 }}>{t}</div>;
  const name = (t: string, c = C.ink) => <div style={{ fontSize: 30, fontWeight: 800, color: c, letterSpacing: '-0.01em' }}>{t}</div>;
  if (kind === 'punch')
    return (
      <div style={{ ...base, width: 330, background: C.cream }}>
        {label('כרטיס ניקוב')}
        {name('בית הקפה')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, marginTop: 14 }}>
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} style={{ aspectRatio: '1', borderRadius: 99, background: i < 6 ? '#2A3045' : '#F0E2C8' }} />
          ))}
        </div>
      </div>
    );
  if (kind === 'club')
    return (
      <div style={{ ...base, width: 340, height: 205, background: C.inkRaised, position: 'relative' }}>
        {name('המעדנייה', C.white)}
        {label('כרטיס מועדון · 004817', C.slateOnInk)}
        <div style={{ width: 44, height: 32, borderRadius: 7, background: '#C9B37A', marginTop: 16 }} />
        <div style={{ position: 'absolute', bottom: 22, left: 26, display: 'flex', gap: 3, height: 30 }}>
          {Array.from({ length: 24 }, (_, i) => <i key={i} style={{ width: ((i * 7) % 3) + 1.5, background: C.white, opacity: 0.85 }} />)}
        </div>
      </div>
    );
  if (kind === 'app')
    return (
      <div style={{ ...base, width: 360, background: C.white, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: C.coral, flex: 'none' }} />
        <div>
          {name('המסעדה')}
          {label('עוד אפליקציה, עוד סיסמה')}
        </div>
      </div>
    );
  return (
    <div style={{ ...base, width: 270, background: C.paper, borderRadius: 8 }}>
      {name('המאפייה')}
      {label('פתק חותמות')}
      <div style={{ display: 'flex', gap: 9, marginTop: 12 }}>
        {Array.from({ length: 8 }, (_, i) => <span key={i} style={{ width: 20, height: 20, borderRadius: 99, background: i < 5 ? C.green : C.pale }} />)}
      </div>
    </div>
  );
};

export const Boot: React.FC = () => {
  const f = useCurrentFrame();

  // The spark falls (f2-10) and lands as the period of the line.
  const sparkY = (x: number) => accel(x, 2, -560, 0, 8);
  const sparkV = Math.abs(sparkY(f) - sparkY(f - 1));

  // Terminal line types in, then is overwritten (f4-30).
  const term = f < 16 ? 'perko // loyalty' : 'perko / early access - 2026';
  const typed = f < 16 ? Math.floor(lin(f, 4, 0, 16, 10)) : Math.floor(lin(f, 16, 7, 27, 12));

  // Exit: collapse f58-66, dot opens f62-72.
  const collapse = accel(f, 56, 0, 1, 10);
  const open = accel(f, 62, 1, 130, 10);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 46%, #192036 0%, ${C.ink} 62%)` }}>
      {/* faint dot grid */}
      <AbsoluteFill style={{ opacity: 0.16 }}>
        <svg width="1920" height="1080">
          {Array.from({ length: 24 * 14 }, (_, i) => {
            const x = 40 + (i % 24) * 80;
            const y = 40 + Math.floor(i / 24) * 80;
            return <circle key={i} cx={x} cy={y} r={1.6} fill={C.slateOnInk} />;
          })}
        </svg>
      </AbsoluteFill>

      {/* cards: one per half beat from f24 */}
      {cards.map((c, i) => {
        const at = BEAT + 6 + i * (BEAT / 3);
        const fx = (x: number) => snap(x, at, c.from[0], 0, 9);
        const fy = (x: number) => snap(x, at, c.from[1], 0, 9);
        const v = Math.hypot(fx(f) - fx(f - 1), fy(f) - fy(f - 1));
        const dx = (960 - c.x) * collapse;
        const dy = (540 - c.y) * collapse;
        const hold = Math.sin((f + i * 20) / 22) * 1.2;
        const sc = 1 - collapse * 0.9;
        return (
          <div key={c.kind} style={{
            position: 'absolute', left: c.x, top: c.y, opacity: f < at ? 0 : 1 - lin(f, 62, 0, 1, 4),
            transform: `translate(-50%,-50%) translate(${fx(f) + dx}px, ${fy(f) + dy + hold}px) rotate(${c.r * (1 - collapse)}deg) scale(${sc})`,
          }}>
            <Blur x={v * 0.9 + collapse * 30} y={collapse * 10}>
              <Card kind={c.kind} />
            </Blur>
          </div>
        );
      })}

      {/* the line: "כרטיס אחר" + the spark as its period */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ transform: `scale(${1 - collapse * 0.85})`, opacity: 1 - lin(f, 60, 0, 1, 3), position: 'absolute' }}>
          <Letters text="כרטיס אחר" f={f} at={BEAT + 2} stagger={1.5} style={{ fontFamily: impact, fontWeight: 900, fontSize: 190, letterSpacing: '-0.03em', color: C.white, lineHeight: 1 }} />
        </div>
        <div style={{ position: 'absolute', left: 960 - 455, top: 540 + 52, width: 0, height: 0 }}>
          <Blur y={sparkV * 0.9}>
            <div style={{
              width: 38, height: 38, borderRadius: 99, background: C.cobalt, marginLeft: -19, marginTop: -19,
              transform: `translate(${455 * collapse}px, ${-52 * collapse}px) translateY(${sparkY(f)}px) scale(${open})`,
              boxShadow: `0 0 ${24 + 16 * Math.sin(f / 5)}px ${C.cobalt}`,
            }} />
          </Blur>
        </div>
      </AbsoluteFill>

      {/* terminal line */}
      <div style={{ position: 'absolute', bottom: 120, width: '100%', display: 'flex', justifyContent: 'center', opacity: 1 - lin(f, 56, 0, 1, 4) }}>
        <div style={{ fontFamily: mono, fontSize: 22, color: C.slateOnInk, letterSpacing: '0.08em', direction: 'ltr', display: 'flex', alignItems: 'center', gap: 4 }}>
          {term.slice(0, typed)}
          <span style={{ width: 12, height: 24, background: C.cobalt, opacity: Math.floor(f / 6) % 2 ? 1 : 0.2 }} />
        </div>
      </div>

      {/* tiny seeded sparks around the landing */}
      {f >= 10 && f < 22 && Array.from({ length: 10 }, (_, i) => {
        const a = rnd(i + 3) * Math.PI * 2;
        const d = lin(f, 10, 0, 80 + rnd(i) * 60, 12);
        return <span key={i} style={{ position: 'absolute', left: 515 + Math.cos(a) * d, top: 592 + Math.sin(a) * d, width: 4, height: 4, borderRadius: 4, background: C.cobalt, opacity: 1 - lin(f, 10, 0, 1, 12) }} />;
      })}
    </AbsoluteFill>
  );
};
