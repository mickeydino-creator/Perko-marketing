import React from 'react';
import { Img, staticFile } from 'remotion';
import { C } from '../tokens';

// A plain Android phone around a real app screenshot (412×892 CSS px at 3x, captured from the app in demo mode).
// Children are laid out in the screenshot's own CSS px, so overlays (tap rings, swipe strips) line up with the UI.
export const SCREEN = { w: 412, h: 892 };
export const K = 0.94; // screen scale in the 1080p frame
const PAD = 12;
export const PHONE = { w: SCREEN.w * K + PAD * 2, h: SCREEN.h * K + PAD * 2 };

export const Shot: React.FC<{ name: string; style?: React.CSSProperties }> = ({ name, style }) => (
  <Img src={staticFile(`shots/${name}.png`)} style={{ position: 'absolute', left: 0, top: 0, width: SCREEN.w, height: SCREEN.h, ...style }} />
);

export const Phone: React.FC<{ shot?: string; dark?: boolean; screenBg?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ shot, dark, screenBg = C.paper, children, style }) => (
  <div style={{
    position: 'absolute', left: 960 - PHONE.w / 2, top: 540 - PHONE.h / 2, width: PHONE.w, height: PHONE.h,
    borderRadius: 58, background: C.ink, padding: PAD, boxSizing: 'border-box',
    // the only soft shadow in the film: UI cards / devices (STYLE_GUIDE §11.9)
    boxShadow: dark ? `0 0 0 2px ${C.inkRaised}, 0 30px 70px rgba(0,0,0,0.45)` : '0 26px 60px rgba(17,19,15,0.28)',
    ...style,
  }}>
    <div style={{ width: SCREEN.w * K, height: SCREEN.h * K, borderRadius: 46, overflow: 'hidden', position: 'relative', background: screenBg }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: SCREEN.w, height: SCREEN.h, transform: `scale(${K})`, transformOrigin: '0 0' }}>
        {shot ? <Shot name={shot} /> : null}
        {children}
      </div>
    </div>
  </div>
);

/** Frame coordinates (1080p) of a point given in screenshot CSS px, for a phone at rest in the centre. */
export const toFrame = (x: number, y: number) => ({ x: 960 - PHONE.w / 2 + PAD + x * K, y: 540 - PHONE.h / 2 + PAD + y * K });
