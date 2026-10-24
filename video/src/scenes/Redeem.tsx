import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, BEAT } from '../tokens';
import { accent, impact, mono } from '../fonts';
import { accel, drift, lin, snap } from '../motion';
import { Blur } from '../components/Blur';
import { Letters } from '../components/Letters';

// 1.25 bars (252-342, cobalt field). VO 4 at f252: "יראו כמה חסר, ויחזרו לממש את ההטבה."
// The card shows what is left; on beat 3 (f288) the last stamp lands and the reward is ready.
// Exit (diagonal slab wipe): the white card shears into the first of three slabs that sweep toward the reading end.
export const Redeem: React.FC = () => {
  const g = useCurrentFrame(); // 0 = f252
  const done = BEAT * 2; // f288

  const cardY = (x: number) => snap(x, 0, 140, 0, 9) - drift(x, 9, 0, 8, 80);
  const cv = Math.abs(cardY(g) - cardY(g - 1));
  const cardS = snap(g, 0, 0.9, 1, 9);

  const count = g < done ? 9 : Math.round(snap(g, done, 9, 10, 6));
  const wX = (x: number) => snap(x, done, -300, 0, 5);
  const wv = Math.abs(wX(g) - wX(g - 1));

  const wipe = accel(g, 76, 0, 1, 14);
  const impactStyle: React.CSSProperties = { fontFamily: impact, fontWeight: 900, fontSize: 210, letterSpacing: '-0.035em', color: C.white, lineHeight: 1 };

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 20% 30%, #5B71FF 0%, ${C.cobalt} 50%, #3047EE 100%)` }}>
      {/* right column type */}
      <div style={{ position: 'absolute', right: 200, top: 330, width: 820, direction: 'rtl' }}>
        <div style={{ fontFamily: mono, fontSize: 19, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.78)', direction: 'ltr', display: 'flex', justifyContent: 'flex-end', gap: 16, alignItems: 'center', opacity: lin(g, 3, 0, 1, 4) }}>
          <span>10 / 10</span>
          <span style={{ width: lin(g, 3, 0, 180, 10), height: 1.5, background: 'rgba(255,255,255,0.5)' }} />
          <span>STEP 02</span>
        </div>
        <div style={{ height: 250, marginTop: 18 }}>
          {g < done ? (
            <Letters text="כמה חסר?" f={g} at={2} style={impactStyle} />
          ) : (
            <Blur x={wv}><div style={{ ...impactStyle, transform: `translateX(${wX(g)}px)` }}>חוזרים.</div></Blur>
          )}
        </div>
        <div style={{ height: 110, marginTop: -6, marginRight: 150 }}>
          {g < done ? (
            <Letters text="חותמת אחת." f={g} at={9} stagger={1} dur={10} style={{ fontFamily: accent, fontSize: 82, color: C.white }} />
          ) : (
            <Letters text="ומממשים את ההטבה." f={g} at={done + 5} stagger={1} dur={10} style={{ fontFamily: accent, fontSize: 82, color: C.white }} />
          )}
        </div>
      </div>

      {/* card stack */}
      <Blur y={cv} style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', left: 300, top: 205, width: 560, height: 670, transform: `translateY(${cardY(g)}px) scale(${cardS})` }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 44, background: 'rgba(255,255,255,0.16)', transform: `rotate(${-6 + Math.sin(g / 20)}deg) translate(-34px, 18px)` }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: 44, background: 'rgba(255,255,255,0.24)', transform: `rotate(${3.5 - Math.sin(g / 24)}deg) translate(26px, 10px)` }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: 44, background: C.white, padding: 44, fontFamily: impact, direction: 'rtl', color: C.ink, boxShadow: '0 22px 54px rgba(10,20,90,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ width: 70, height: 70, borderRadius: 20, background: C.cobalt, color: C.white, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 30 }}>פ</div>
              <div>
                <div style={{ fontSize: 34, fontWeight: 800 }}>קפה פינה</div>
                <div style={{ fontSize: 21, color: C.slate }}>כרטיס קפה · שם לדוגמה</div>
              </div>
            </div>
            <div style={{ marginTop: 40, display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <span style={{ fontSize: 132, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
              <span style={{ fontSize: 28, color: C.slate }}>מתוך 10 חותמות</span>
            </div>
            <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14 }}>
              {Array.from({ length: 10 }, (_, i) => {
                const isLast = i === 9;
                const on = i < 9 || g >= done;
                const s = isLast && g >= done ? snap(g, done, 0.4, 1, 8) : 1;
                return (
                  <span key={i} style={{ aspectRatio: '1', borderRadius: 99, background: on ? C.cobalt : C.white, boxShadow: on ? undefined : `inset 0 0 0 4px ${C.paleStrong}`, transform: `scale(${s})`, display: 'grid', placeItems: 'center' }}>
                    {isLast && (
                      <svg viewBox="0 0 24 24" width="55%" height="55%"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke={on ? C.white : C.slate} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                  </span>
                );
              })}
            </div>
            <div style={{ marginTop: 30, fontSize: 27, fontWeight: 700 }}>{g < done ? 'עוד חותמת אחת לקפה הפוך עלינו' : 'ההטבה מוכנה: קפה הפוך עלינו'}</div>
            <div style={{ marginTop: 22, height: 70, borderRadius: 40, background: C.ink, color: C.white, display: 'grid', placeItems: 'center', fontSize: 26, fontWeight: 700, opacity: g < done + 6 ? 0 : 1, transform: `translateY(${snap(g, done + 6, 30, 0, 8)}px)` }}>
              מימוש בקופה
            </div>
          </div>
        </div>
      </Blur>

      {/* exit: three slabs at -20deg sweep from the right edge toward the left */}
      {g >= 76 && [C.white, C.paleStrong, C.pale].map((col, i) => {
        const p = Math.max(0, wipe * 1.35 - i * 0.16);
        const x = 2400 - p * 3400;
        return <div key={i} style={{ position: 'absolute', top: -300, left: x, width: 4200, height: 1700, background: col, transform: 'skewX(-20deg)' }} />;
      })}
    </AbsoluteFill>
  );
};
