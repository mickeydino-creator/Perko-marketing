import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../tokens';
import { impact, mono } from '../fonts';
import { accel, lin, snap } from '../motion';
import { Blur } from '../components/Blur';
import { QrGlyph } from '../components/QrGlyph';

// Bar 5 (f192-240, pale). VO 3 "הלקוחות יסרקו קוד בקופה...". The phone is the hero, centred, as in the reference
// UI scene; only small mono labels sit beside it. The scan line sweeps, the brackets lock in cobalt (the signal).
// Exit (contained shape): the white QR plate grows to fill the frame and becomes the paper field of the next scene.
const PH = { x: 960 - 215, y: 84, w: 430, h: 916, bez: 12 };
const PLATE = { cx: 960, cy: 420, s: 230 };

export const Scan: React.FC = () => {
  const g = useCurrentFrame();
  const y = (x: number) => snap(x, 0, 520, 0, 8);
  const v = Math.abs(y(g) - y(g - 1));
  const scan = lin(g, 9, 0, 1, 16);
  const lock = snap(g, 26, 0, 1, 6);
  const grow = accel(g, 38, 0, 1, 10);
  const plate = PLATE.s + grow * 2300;

  const label: React.CSSProperties = { position: 'absolute', fontFamily: mono, fontSize: 17, letterSpacing: '0.06em', color: C.muted, direction: 'rtl', whiteSpace: 'nowrap', opacity: lin(g, 6, 0, 1, 4) };

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 30%, #E4FF6E 0%, ${C.lime} 48%, #C9F02E 100%)` }}>
      <div style={{ ...label, right: 200, top: 360 }}>סריקה · קוד בקופה</div>
      <div style={{ ...label, right: 200, top: 394, color: C.ink, fontFamily: impact, letterSpacing: 0, fontSize: 30, fontWeight: 700, direction: 'rtl' }}>סורקים את הקוד בקופה</div>
      <div style={{ ...label, left: 200, top: 640 }}>תהליך להמחשה</div>
      <div style={{ ...label, left: 200, top: 674 }}>{g >= 26 ? 'סטטוס · אושר' : 'סטטוס · קורא'}</div>

      <Blur y={v} style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', left: PH.x, top: PH.y, width: PH.w, height: PH.h, transform: `translateY(${y(g)}px)` }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 66, background: '#0A0B08', boxShadow: '0 40px 80px rgba(17,19,15,0.25)' }} />
          <div style={{ position: 'absolute', inset: PH.bez, borderRadius: 55, overflow: 'hidden', background: C.ink, fontFamily: impact, direction: 'rtl' }}>
            <div style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', width: 124, height: 36, borderRadius: 30, background: '#0A0B08' }} />
            <div style={{ position: 'absolute', top: 104, width: '100%', textAlign: 'center', color: C.paper, fontSize: 21, fontWeight: 600, opacity: 0.9 }}>מכוונים את המצלמה לקוד שבקופה</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 250, background: C.paper, borderRadius: '40px 40px 0 0', padding: '26px 30px', color: C.ink }}>
              <div style={{ width: 64, height: 7, borderRadius: 9, background: C.tintStrong, margin: '0 auto 22px' }} />
              <div style={{ fontSize: 30, fontWeight: 800 }}>קפה פינה</div>
              <div style={{ fontSize: 20, color: C.muted }}>כרטיס קפה · שם לדוגמה</div>
              <div style={{ marginTop: 18, height: 10, borderRadius: 10, background: C.tint }}>
                <div style={{ height: '100%', width: '80%', marginRight: 0, borderRadius: 10, background: C.ink }} />
              </div>
            </div>
          </div>
        </div>
      </Blur>

      {/* viewfinder + plate in frame coordinates, so the plate can become the next field */}
      <div style={{ position: 'absolute', left: PLATE.cx, top: PLATE.cy + y(g), width: 0, height: 0 }}>
        {(['tl', 'tr', 'bl', 'br'] as const).map((k) => {
          const d = 175 - lock * 14;
          return (
            <span key={k} style={{
              position: 'absolute', width: 52, height: 52, borderStyle: 'solid', borderColor: g >= 26 ? C.lime : C.paper, borderWidth: 0, borderRadius: 14,
              ...(k[0] === 't' ? { top: -d, borderTopWidth: 6 } : { top: d - 52, borderBottomWidth: 6 }),
              ...(k[1] === 'l' ? { left: -d, borderLeftWidth: 6 } : { left: d - 52, borderRightWidth: 6 }),
              opacity: 1 - grow,
            }} />
          );
        })}
        <div style={{ position: 'absolute', left: -plate / 2, top: -plate / 2, width: plate, height: plate, borderRadius: 18 + grow * 400, background: C.paper, padding: 20 * (1 - grow) }}>
          <div style={{ width: '100%', height: '100%', opacity: Math.max(0, 1 - grow * 10) }}><QrGlyph color={C.ink} bg={C.paper} /></div>
        </div>
        <div style={{ position: 'absolute', left: -150, width: 300, top: -150 + scan * 300, height: 4, borderRadius: 4, background: C.lime, boxShadow: '0 0 18px rgba(215,255,53,0.9)', opacity: g >= 9 && g < 26 ? 1 : 0 }} />
      </div>
    </AbsoluteFill>
  );
};
