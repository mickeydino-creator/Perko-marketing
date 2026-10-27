import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useStoryFrame } from '../time';
import { C } from '../tokens';
import { accel, lin, snap } from '../motion';
import { Blur } from '../components/Blur';
import { Phone, SCREEN, Shot } from '../components/Phone';
import { Label } from '../components/Label';

// Bar 4 (story f144-192, lime). The tapped card is open (focus-coffee.png). On beat 2 a sideways swipe moves to the
// next card, as in the app: only the card strip slides (the next card enters from the left, RTL), the buttons stay,
// the page dots update. Exit: a diagonal slab wipe (ink, lime 2, paper) into the paper field.
const CARD = { top: 0, h: 262 }; // the focused card strip in focus-*.png
const DOTS = { top: 328, h: 22 }; // the page indicator

export const SwipeScene: React.FC = () => {
  const g = useStoryFrame();
  const enter = snap(g, 0, 0.9, 1, 8);
  const sw = (f: number) => snap(f, 16, 0, 1, 9);
  const v = Math.abs(sw(g) - sw(g - 1)) * SCREEN.w;
  const wipe = accel(g, 39, 0, 1, 9);
  const second = sw(g) > 0.5;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 30%, #E4FF6E 0%, ${C.lime} 48%, #C9F02E 100%)` }}>
      <Label color={C.ink} style={{ right: 250, top: 430 }} opacity={lin(g, 4, 0, 1, 4)}>החלקה בין כרטיסים</Label>
      <Label color={C.muted} style={{ right: 250, top: 466 }} opacity={lin(g, 6.5, 0, 1, 4)}>כמו בארנק של הטלפון</Label>
      <Label color={C.ink} style={{ left: 250, top: 610, direction: 'rtl' }} opacity={lin(g, 9, 0, 1, 4)}>{second ? 'כרטיס 2 מתוך 3' : 'כרטיס 1 מתוך 3'}</Label>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${enter})` }}>
        <Phone shot="focus-coffee">
          <div style={{ position: 'absolute', left: 0, top: CARD.top, width: SCREEN.w, height: CARD.h, overflow: 'hidden' }}>
            <Blur x={v}>
              <div style={{ position: 'relative', width: SCREEN.w, height: CARD.h }}>
                <div style={{ position: 'absolute', left: sw(g) * SCREEN.w, top: 0, width: SCREEN.w, height: CARD.h, overflow: 'hidden' }}>
                  <Shot name="focus-coffee" style={{ top: -CARD.top }} />
                </div>
                <div style={{ position: 'absolute', left: (sw(g) - 1) * SCREEN.w, top: 0, width: SCREEN.w, height: CARD.h, overflow: 'hidden' }}>
                  <Shot name="focus-zaatar" style={{ top: -CARD.top }} />
                </div>
              </div>
            </Blur>
          </div>
          {second && (
            <div style={{ position: 'absolute', left: 0, top: DOTS.top, width: SCREEN.w, height: DOTS.h, overflow: 'hidden' }}>
              <Shot name="focus-zaatar" style={{ top: -DOTS.top }} />
            </div>
          )}
        </Phone>
      </div>
      {g >= 39 && [C.ink, C.lime2, C.paper].map((col, i) => {
        const p = Math.max(0, wipe * 1.3 - i * 0.15);
        return <div key={i} style={{ position: 'absolute', top: -300, left: 2300 - p * 3600, width: 4200, height: 1700, background: col, transform: 'skewX(-20deg)' }} />;
      })}
    </AbsoluteFill>
  );
};
