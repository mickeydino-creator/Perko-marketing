import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useStoryFrame } from '../time';
import { C } from '../tokens';
import { accel, lin, snap } from '../motion';
import { Blur } from '../components/Blur';
import { Phone, toFrame } from '../components/Phone';
import { Label } from '../components/Label';

// Bar 3 (story f96-144, ink). Out of the title's ink mask the phone snaps up with the real wallet: a stack of
// physical cards. Hold: a slow push. Beat 3: a tap lands on the top card (a lime dot, the scene's one signal).
// Exit: the tap dot accelerates open into the lime field of the next scene.
const TAP = { x: 290, y: 120 }; // the "קפה פינה" card header in wallet.png
export const WalletScene: React.FC = () => {
  const g = useStoryFrame();
  const y = (f: number) => snap(f, 0, 760, 0, 10);
  const v = Math.abs(y(g) - y(g - 1));
  const push = 1 + lin(g, 10, 0, 0.025, 38);
  const tap = toFrame(TAP.x, TAP.y);
  const dot = snap(g, 26, 0, 1, 6);
  const open = accel(g, 38, 0, 1, 10);
  const r = 14 + open * 2300;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, #1E2219 0%, ${C.ink} 65%)` }}>
      <Label color={C.onInk} style={{ right: 250, top: 430 }} opacity={lin(g, 8, 0, 1, 4)}>הארנק · כרטיסים כמו בכיס</Label>
      <Label color={C.onInk} style={{ right: 250, top: 466 }} opacity={lin(g, 10.5, 0, 1, 4)}>הקרוב להטבה, ראשון</Label>
      <Label color={C.onInk} style={{ left: 250, top: 610 }} opacity={lin(g, 13, 0, 1, 4)}>נתוני דוגמה</Label>
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${y(g)}px) scale(${push})`, transformOrigin: `${tap.x}px ${tap.y}px` }}>
        <Blur y={v}>
          <div style={{ position: 'absolute', inset: 0, width: 1920, height: 1080 }}>
            <Phone shot="wallet" dark />
          </div>
        </Blur>
        {/* tap: a ring that contracts onto the card, leaving the lime dot */}
        {g >= 22 && (
          <div style={{ position: 'absolute', left: tap.x, top: tap.y, width: 0, height: 0 }}>
            <div style={{ position: 'absolute', width: 120, height: 120, left: -60, top: -60, borderRadius: 99, border: `4px solid ${C.lime}`, transform: `scale(${snap(g, 22, 1.6, 0.3, 6)})`, opacity: 1 - lin(g, 26, 0, 1, 4) }} />
          </div>
        )}
      </div>
      {g >= 26 && <div style={{ position: 'absolute', left: tap.x - r, top: tap.y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: C.lime, transform: `scale(${dot})` }} />}
    </AbsoluteFill>
  );
};
