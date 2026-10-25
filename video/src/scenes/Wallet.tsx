import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../tokens';
import { impact, mono } from '../fonts';
import { accel, lin, snap } from '../motion';
import { Blur } from '../components/Blur';
import { Wordmark } from '../components/Wordmark';

// Bar 4 (f144-192, ink), on the drop, while the VO says "...את כולם למקום אחד".
// The scene emerges from the ink mask through an iris. The product is the hero: one wallet with four sample cards.
// Rows stagger in 2.5 f apart, their progress bars fill with expo-out. The one signal: the café row's cobalt bar.
// Exit (column dissolve): vertical strips of the pale field slide down, staggered from the right.
const rows = [
  { name: 'קפה פינה', kind: 'כרטיס קפה', v: 7, of: 10, unit: '' },
  { name: 'זעתר', kind: 'כרטיס ארוחות', v: 4, of: 6, unit: '' },
  { name: 'מאפיית הגפן', kind: 'פתק חותמות', v: 5, of: 8, unit: '' },
  { name: 'דפדוף', kind: 'מועדון קוראים', v: 120, of: 200, unit: ' נק׳' },
];

export const Wallet: React.FC = () => {
  const g = useCurrentFrame();
  const iris = accel(g, 0, 0, 1, 1) * snap(g, 0, 0, 1, 8);
  const cardY = (x: number) => snap(x, 1, 120, 0, 8);
  const v = Math.abs(cardY(g) - cardY(g - 1));
  const strips = [140, 90, 210, 120, 170, 80, 230, 150, 110, 190, 130, 200];

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #1E2219 0%, ${C.ink} 62%)` }}>
      <AbsoluteFill style={{ clipPath: `circle(${iris * 1200}px at 50% 50%)` }}>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #1E2219 0%, ${C.ink} 62%)` }} />
        <div style={{ position: 'absolute', left: 560, top: 150, width: 800, fontFamily: mono, fontSize: 17, letterSpacing: '0.2em', color: C.onInk, direction: 'ltr', display: 'flex', justifyContent: 'space-between', opacity: lin(g, 4, 0, 1, 4) }}>
          <span>WALLET · ONE APP</span><span>SAMPLE DATA</span>
        </div>
        <Blur y={v} style={{ position: 'absolute', left: 560, top: 200, width: 800 }}>
          <div style={{ transform: `translateY(${cardY(g)}px) scale(${1 + lin(g, 8, 0, 0.02, 40)})`, background: C.paper, borderRadius: 44, padding: '40px 44px 34px', fontFamily: impact, direction: 'rtl', color: C.ink, boxShadow: '0 30px 70px rgba(0,0,0,0.35)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
              <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em' }}>הכרטיסים שלי</span>
              <Wordmark size={46} disc={C.ink} />
            </div>
            {rows.map((r, i) => {
              const at = 5 + i * 2.5;
              const y = snap(g, at, 40, 0, 8);
              const fill = snap(g, at + 3, 0, r.v / r.of, 24);
              const shown = r.unit ? Math.round(fill * r.of) : Math.round(fill * r.of);
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '64px 1fr 120px', gap: 22, alignItems: 'center', background: C.tint, borderRadius: 24, padding: '18px 22px', marginTop: 12, opacity: g < at ? 0 : 1, transform: `translateY(${y}px)` }}>
                  <span style={{ width: 64, height: 64, borderRadius: 18, background: i === 0 ? C.lime : C.tintStrong, color: C.ink, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 28 }}>{r.name[0]}</span>
                  <span style={{ display: 'grid', gap: 10 }}>
                    <span style={{ fontSize: 30, fontWeight: 800 }}>{r.name} <span style={{ fontWeight: 500, color: C.muted, fontSize: 24 }}>· {r.kind}</span></span>
                    <span style={{ height: 10, borderRadius: 10, background: C.tintStrong, overflow: 'hidden' }}>
                      <span style={{ display: 'block', height: '100%', width: '100%', borderRadius: 10, background: i === 0 ? C.ink : 'rgba(17,19,15,0.4)', transformOrigin: 'right', transform: `scaleX(${fill})` }} />
                    </span>
                  </span>
                  <span style={{ fontSize: 30, fontWeight: 700, textAlign: 'left', fontVariantNumeric: 'tabular-nums', direction: 'ltr' }}>{shown}/{r.of}</span>
                </div>
              );
            })}
          </div>
        </Blur>
      </AbsoluteFill>

      {/* exit: column dissolve into the pale field */}
      {g >= 38 && (() => {
        let x = 1920;
        return strips.map((w, i) => {
          x -= w * 1.0;
          const p = accel(g, 38 + i * 0.5, 0, 1, 7);
          return <div key={i} style={{ position: 'absolute', left: x, width: w + 2, top: -1100 + p * 1100 * (1 + (i % 3) * 0.08), height: 1100 * (1 + (i % 3) * 0.08), background: C.lime }} />;
        });
      })()}
    </AbsoluteFill>
  );
};
