import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../tokens';
import { impact, mono } from '../fonts';
import { accel, lin, snap } from '../motion';
import { Blur } from '../components/Blur';

// Bar 7 (f288-336, cobalt). VO 4 "יראו כמה חסר, ...". The reference UI scene: one card on a parallax stack,
// flown in with blur. It shows what is left; on beat 2 the tenth stamp fills and the reward is ready.
// Exit (collapse to a glowing shape): the card shrinks into a dark rounded square whose bloom ring opens to paper.
export const Progress: React.FC = () => {
  const g = useCurrentFrame();
  const fly = (x: number) => snap(x, 0, 700, 0, 7);
  const v = Math.abs(fly(g) - fly(g - 1));
  const done = 12;
  const collapse = accel(g, 34, 0, 1, 6);
  const bloom = accel(g, 39, 0, 1, 9);
  const W = 860 - collapse * 700;
  const Hh = 560 - collapse * 400;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, ${C.cobalt} 0%, #3149EE 55%, #2236C8 100%)` }}>
      {/* back cards */}
      <div style={{ position: 'absolute', left: 960 - 430, top: 540 - 280, width: 860, height: 560, borderRadius: 44, background: 'rgba(255,255,255,0.14)', transform: `rotate(${-5 + Math.sin(g / 16)}deg) translate(-40px, 22px) translateX(${fly(g) * 0.6}px)`, opacity: 1 - collapse }} />
      <div style={{ position: 'absolute', left: 960 - 430, top: 540 - 280, width: 860, height: 560, borderRadius: 44, background: 'rgba(255,255,255,0.22)', transform: `rotate(${3 - Math.sin(g / 20)}deg) translate(36px, 12px) translateX(${fly(g) * 0.8}px)`, opacity: 1 - collapse }} />

      <Blur x={v} style={{ position: 'absolute', inset: 0 }}>
        <div style={{
          position: 'absolute', left: 960 - W / 2, top: 540 - Hh / 2, width: W, height: Hh, transform: `translateX(${fly(g)}px)`,
          borderRadius: 44 - collapse * 10, background: collapse > 0.5 ? C.ink : C.white, overflow: 'hidden', fontFamily: impact, direction: 'rtl', color: C.ink, boxShadow: '0 30px 70px rgba(10,20,90,0.35)',
        }}>
          <div style={{ padding: '40px 48px', opacity: 1 - collapse * 3 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                <span style={{ width: 70, height: 70, borderRadius: 20, background: C.cobalt, color: C.white, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 30 }}>פ</span>
                <span style={{ display: 'grid' }}>
                  <span style={{ fontSize: 36, fontWeight: 800 }}>קפה פינה</span>
                  <span style={{ fontFamily: mono, fontSize: 15, letterSpacing: '0.18em', color: C.slate, direction: 'ltr', textAlign: 'right' }}>COFFEE CARD · SAMPLE</span>
                </span>
              </div>
              <span style={{ fontSize: 30, fontWeight: 700, color: C.slate, direction: 'ltr' }}>{g >= done ? '10' : '9'}/10</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 14, marginTop: 44 }}>
              {Array.from({ length: 10 }, (_, i) => {
                const last = i === 9;
                const on = !last || g >= done;
                return <span key={i} style={{ aspectRatio: '1', borderRadius: 99, background: on ? (last ? C.cobalt : C.ink) : C.white, boxShadow: on ? undefined : `inset 0 0 0 4px ${C.paleStrong}`, transform: `scale(${last && g >= done ? snap(g, done, 0.4, 1, 7) : 1})` }} />;
              })}
            </div>
            <div style={{ marginTop: 40, fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em' }}>{g >= done ? 'ההטבה מוכנה: קפה הפוך עלינו' : 'עוד חותמת אחת לקפה חינם'}</div>
            <div style={{ marginTop: 28, height: 78, borderRadius: 40, background: g >= done ? C.ink : C.pale, color: g >= done ? C.white : C.slate, display: 'grid', placeItems: 'center', fontSize: 28, fontWeight: 700 }}>
              {g >= done ? 'מציגים לצוות בקופה' : 'ממשיכים לצבור'}
            </div>
          </div>
        </div>
      </Blur>

      {g >= 39 && (
        <div style={{ position: 'absolute', left: 960 - (160 + bloom * 2600) / 2, top: 540 - (160 + bloom * 2600) / 2, width: 160 + bloom * 2600, height: 160 + bloom * 2600, borderRadius: 9999, background: C.paper, boxShadow: `0 0 0 ${10 + bloom * 30}px rgba(169,181,255,0.9)` }} />
      )}
    </AbsoluteFill>
  );
};
