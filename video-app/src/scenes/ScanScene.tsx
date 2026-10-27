import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useStoryFrame } from '../time';
import { C } from '../tokens';
import { accel, lin, snap } from '../motion';
import { Blur } from '../components/Blur';
import { Phone, SCREEN, Shot, toFrame } from '../components/Phone';
import { Label } from '../components/Label';

// Bar 7 (story f288-336, ink). The ink band becomes the scanner's dark screen; the result sheet of the real app
// (scan-result.png) snaps up: "הכרטיס מלא". Beat 2: a lime ring locks onto the tenth stamp (the one signal).
// Exit (radial burst): streaks fly out of that stamp and a lime disc opens from it into the redeem scene.
const SHEET = 470; // the sheet's top edge in scan-result.png
const STAMP = { x: 55, y: 690 }; // the checked stamp

export const ScanScene: React.FC = () => {
  const g = useStoryFrame();
  const y = (f: number) => snap(f, 2, SCREEN.h - SHEET, 0, 9);
  const v = Math.abs(y(g) - y(g - 1)) * 0.94;
  const st = toFrame(STAMP.x, STAMP.y);
  const lock = snap(g, 16, 1.8, 1, 7);
  const burst = accel(g, 37, 0, 1, 11);
  const disc = accel(g, 40, 0, 2300, 8);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, #1E2219 0%, ${C.ink} 65%)` }}>
      <Label color={C.onInk} style={{ right: 250, top: 430 }} opacity={lin(g, 6, 0, 1, 4)}>סריקה בקופה · אחרי רכישה</Label>
      <Label color={C.onInk} style={{ right: 250, top: 466 }} opacity={lin(g, 8.5, 0, 1, 4)}>הכרטיס מלא</Label>
      <Label color={C.onInk} style={{ left: 250, top: 610 }} opacity={lin(g, 18, 0, 1, 4)}>10 מתוך 10 חותמות</Label>
      <Phone dark screenBg={C.ink}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: SCREEN.w, height: SHEET, overflow: 'hidden' }}>
          <Shot name="scan-result" />
        </div>
        <div style={{ position: 'absolute', left: 0, top: SHEET, width: SCREEN.w, height: SCREEN.h - SHEET, overflow: 'hidden', transform: `translateY(${y(g)}px)` }}>
          <Blur y={v}>
            <div style={{ position: 'relative', width: SCREEN.w, height: SCREEN.h - SHEET, overflow: 'hidden' }}>
              <Shot name="scan-result" style={{ top: -SHEET }} />
            </div>
          </Blur>
        </div>
      </Phone>
      {g >= 16 && (
        <div style={{ position: 'absolute', left: st.x, top: st.y, width: 0, height: 0 }}>
          <div style={{ position: 'absolute', width: 86, height: 86, left: -43, top: -43, borderRadius: 99, border: `4px solid ${C.lime}`, transform: `scale(${lock})`, opacity: 1 - lin(g, 30, 0, 1, 6) }} />
        </div>
      )}
      {g >= 37 && Array.from({ length: 16 }, (_, i) => (
        <div key={i} style={{ position: 'absolute', left: st.x, top: st.y - 3, width: 30 + burst * 600, height: 6, borderRadius: 6, background: C.lime, transformOrigin: '0 50%', transform: `rotate(${(i / 16) * 360}deg) translateX(${30 + burst * 900}px)` }} />
      ))}
      {g >= 40 && <div style={{ position: 'absolute', left: st.x - disc, top: st.y - disc, width: disc * 2, height: disc * 2, borderRadius: '50%', background: C.lime }} />}
    </AbsoluteFill>
  );
};
