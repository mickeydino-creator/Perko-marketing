import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useStoryFrame } from '../time';
import { C } from '../tokens';
import { impact, mono } from '../fonts';
import { lin, snap } from '../motion';
import { Blur } from '../components/Blur';
import { WriteOn, accentStyle } from '../components/Kinetic';

// End card (story f432-528, lime, no HUD). The groove has stopped. The cobalt dot settles with a halo, then on the VO
// "Perko." (f491) it travels and writes the wordmark, landing as its "o". The accent follows the VO (f515), then a
// hairline, the mono tagline decoding in the signal colour, and a small credit line. The last second is still.
const SIZE = 250;
const LETTERS_W = 445; // "perk" at 250px Heebo 800, -0.055em, measured in Chromium
const TAG = 'פיילוט · עמק רפאים ודרך בית לחם';
const GLYPHS = '#%/_-+=*01<>';

export const End: React.FC = () => {
  const g = useStoryFrame();
  const appear = snap(g, 3, 0, 1, 7);
  const p = (x: number) => snap(x, 11, 0, 1, 13);
  const v = Math.abs(p(g) - p(g - 1)) * LETTERS_W;
  const decodeAt = 50;
  const decoded = Math.floor(lin(g, decodeAt, 0, TAG.length, 20));
  const tag = g < decodeAt ? '' : Array.from(TAG).map((ch, i) => (i < decoded || ch === ' ' ? ch : i < decoded + 5 ? GLYPHS[(i * 7 + Math.floor(g)) % GLYPHS.length] : '')).join('');

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #E4FF6E 0%, ${C.lime} 55%, #CAF02F 100%)`, alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 330, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.035em', fontFamily: impact, fontWeight: 800, fontSize: SIZE, letterSpacing: '-0.055em', lineHeight: 1, color: C.ink, direction: 'ltr' }}>
          <span style={{ clipPath: `inset(-20% ${(1 - p(g)) * 100}% -20% -5%)` }}>perk</span>
          <Blur x={v}>
            <span style={{
              display: 'inline-block', width: '0.5em', height: '0.5em', borderRadius: '50%', background: C.ink,
              transform: `translateX(${-(1 - p(g)) * (LETTERS_W / 2)}px) translateY(0.015em) scale(${appear})`,
            }} />
          </Blur>
        </div>
        <div style={{ marginTop: 26, height: 92 }}>
          <WriteOn g={g} at={35} style={accentStyle(84, C.ink)}>הצטרפו בחינם לגישה המוקדמת</WriteOn>
        </div>
        <div style={{ marginTop: 30, height: 84, display: 'flex', alignItems: 'center', gap: 14, padding: '0 40px', borderRadius: 999, background: C.ink, color: C.lime, fontFamily: impact, fontWeight: 700, fontSize: 34, direction: 'rtl', opacity: g < 42 ? 0 : 1, transform: `translateY(${snap(g, 42, 40, 0, 8)}px)` }}>
          הצטרפו בחינם
          <svg width="30" height="30" viewBox="0 0 24 24"><path d="M19 12H5m6-6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ marginTop: 26, fontFamily: mono, fontSize: 20, letterSpacing: '0.08em', color: C.ink, direction: 'rtl', height: 30 }}>{tag}</div>
      </div>
      <div style={{ position: 'absolute', bottom: 70, fontFamily: mono, fontSize: 15, letterSpacing: '0.06em', color: C.muted, direction: 'rtl', opacity: lin(g, 62, 0, 1, 6) }}>
        פרקו · 2026 · מסכים מהאפליקציה עם נתוני דוגמה
      </div>
    </AbsoluteFill>
  );
};
