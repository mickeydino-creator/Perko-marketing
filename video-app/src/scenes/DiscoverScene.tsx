import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useStoryFrame } from '../time';
import { C } from '../tokens';
import { accel, lin, snap } from '../motion';
import { Blur } from '../components/Blur';
import { Phone, toFrame } from '../components/Phone';
import { Label } from '../components/Label';

// Bar 5 (story f192-240, paper). The slab wipe hands over to the discover list (discover.png): the phone whips in
// from the left. Beat 3: a tap on "הוספה" for the bakery (ink ring, the scene's one signal on paper).
// Exit: a column dissolve, ink strips fall at staggered speeds and close the frame on ink.
const ADD = { x: 62, y: 530 }; // the "הוספה" button of "מאפיית הגפן"
const COLS = 12;

export const DiscoverScene: React.FC = () => {
  const g = useStoryFrame();
  const x = (f: number) => snap(f, 0, -1100, 0, 6);
  const v = Math.abs(x(g) - x(g - 1));
  const push = 1 + lin(g, 6, 0, 0.02, 40);
  const add = toFrame(ADD.x, ADD.y);
  const fall = accel(g, 38, 0, 1, 10);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 60% 40%, #FFFFFB 0%, ${C.paper} 60%)` }}>
      <Label color={C.ink} style={{ right: 250, top: 430 }} opacity={lin(g, 6, 0, 1, 4)}>גילוי · עסקים בשכונה</Label>
      <Label color={C.muted} style={{ right: 250, top: 466 }} opacity={lin(g, 8.5, 0, 1, 4)}>קפה · אוכל · חנויות</Label>
      <Label color={C.muted} style={{ left: 250, top: 610 }} opacity={lin(g, 11, 0, 1, 4)}>עסקים לדוגמה</Label>
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${x(g)}px) scale(${push})`, transformOrigin: `${add.x}px ${add.y}px` }}>
        <Blur x={v}>
          <div style={{ position: 'absolute', inset: 0, width: 1920, height: 1080 }}>
            <Phone shot="discover" />
          </div>
        </Blur>
        {g >= 24 && (
          <div style={{ position: 'absolute', left: add.x, top: add.y, width: 0, height: 0 }}>
            <div style={{ position: 'absolute', width: 130, height: 130, left: -65, top: -65, borderRadius: 99, border: `4px solid ${C.ink}`, transform: `scale(${snap(g, 24, 1.5, 0.55, 7)})`, opacity: 1 - lin(g, 31, 0, 1, 6) }} />
          </div>
        )}
      </div>
      {g >= 38 && Array.from({ length: COLS }, (_, i) => {
        const k = [0.2, 0.55, 0.05, 0.4, 0.75, 0.15, 0.6, 0.3, 0.9, 0.1, 0.5, 0.35][i];
        const p = Math.min(1, fall * (1.25 + k * 0.6));
        return <div key={i} style={{ position: 'absolute', left: (i * 1920) / COLS - 1, width: 1920 / COLS + 2, top: 0, height: 1080 * p, background: C.ink }} />;
      })}
    </AbsoluteFill>
  );
};
