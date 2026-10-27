import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useStoryFrame } from '../time';
import { C } from '../tokens';
import { accel, lin, rnd, snap } from '../motion';
import { Phone, SCREEN, Shot } from '../components/Phone';
import { Label } from '../components/Label';

// Bar 8 (story f336-384, lime). The redeem screen of the real app (redeem-a.png). On beat 3 the code changes, as it
// does every 30 s in the app: a glitch-slice swap to redeem-b.png (captured 31 s later), confined to the code box.
// Exit (collapse -> portal): the phone collapses into an ink dot, which opens as rings onto the paper field.
const CODE = { top: 455, h: 115 }; // the code box in redeem-*.png
const SLICES = 6;

export const RedeemScene: React.FC = () => {
  const g = useStoryFrame();
  const enter = snap(g, 0, 0.88, 1, 8);
  const swap = 26;
  const t = g - swap;
  const collapse = accel(g, 34, 0, 1, 8);
  const ring = accel(g, 41, 0, 1, 7);
  const s = enter * (1 - collapse * 0.985);
  const radius = 58 + collapse * 400;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 30%, #E4FF6E 0%, ${C.lime} 48%, #C9F02E 100%)` }}>
      <Label color={C.ink} style={{ right: 250, top: 430 }} opacity={lin(g, 6, 0, 1, 4) * (1 - collapse)}>מימוש · מציגים לצוות בקופה</Label>
      <Label color={C.muted} style={{ right: 250, top: 466 }} opacity={lin(g, 8.5, 0, 1, 4) * (1 - collapse)}>קוד שמתחלף כל 30 שניות</Label>
      <Label color={C.ink} style={{ left: 250, top: 610 }} opacity={lin(g, 28, 0, 1, 4) * (1 - collapse)}>צילום מסך לא שווה מימוש</Label>
      {g < 41 && (
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${s})` }}>
          <Phone shot="redeem-a" style={{ borderRadius: radius }}>
            {g >= swap && (
              <div style={{ position: 'absolute', left: 0, top: CODE.top, width: SCREEN.w, height: CODE.h }}>
                {Array.from({ length: SLICES }, (_, i) => {
                  const h = CODE.h / SLICES;
                  const off = t < 5 ? (rnd(i * 3 + Math.floor(t)) - 0.5) * 120 * (1 - t / 5) : 0;
                  return (
                    <div key={i} style={{ position: 'absolute', left: 0, top: i * h, width: SCREEN.w, height: h + 0.5, overflow: 'hidden', transform: `translateX(${off}px)` }}>
                      <Shot name="redeem-b" style={{ top: -(CODE.top + i * h) }} />
                    </div>
                  );
                })}
              </div>
            )}
            {collapse > 0 && <div style={{ position: 'absolute', inset: 0, background: C.ink, opacity: Math.min(1, collapse * 1.6) }} />}
          </Phone>
        </div>
      )}
      {g >= 41 && [0, 1, 2, 3].map((i) => {
        const r = Math.max(0, ring * 2600 - i * 260);
        return <div key={i} style={{ position: 'absolute', left: 960 - r, top: 540 - r, width: r * 2, height: r * 2, borderRadius: '50%', background: i % 2 ? C.paper : C.ink }} />;
      })}
      {g >= 41 && <div style={{ position: 'absolute', left: 960 - 14, top: 540 - 14, width: 28, height: 28, borderRadius: 99, background: C.ink, opacity: 1 - ring }} />}
    </AbsoluteFill>
  );
};
