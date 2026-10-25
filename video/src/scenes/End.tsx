import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../tokens';
import { impact, mono } from '../fonts';
import { lin, snap } from '../motion';
import { Blur } from '../components/Blur';
import { WriteOn, accentStyle } from '../components/Kinetic';

// End card (f480-612, ink, no HUD). The groove has stopped. The cobalt dot settles with a halo, then on the VO
// "Perko." (f491) it travels and writes the wordmark, landing as its "o". The accent follows the VO (f515), then a
// hairline, the mono tagline decoding in the signal colour, and a small credit line. The last second is still.
const SIZE = 250;
const LETTERS_W = 445; // "perk" at 250px Heebo 800, -0.055em, measured in Chromium
const TAG = 'EARLY ACCESS · FREE TO JOIN';
const GLYPHS = '#%/_-+=*01<>';

export const End: React.FC = () => {
  const g = useCurrentFrame();
  const appear = snap(g, 3, 0, 1, 7);
  const p = (x: number) => snap(x, 11, 0, 1, 13);
  const v = Math.abs(p(g) - p(g - 1)) * LETTERS_W;
  const decodeAt = 44;
  const decoded = Math.floor(lin(g, decodeAt, 0, TAG.length, 20));
  const tag = g < decodeAt ? '' : Array.from(TAG).map((ch, i) => (i < decoded || ch === ' ' ? ch : i < decoded + 5 ? GLYPHS[(i * 7 + g) % GLYPHS.length] : '')).join('');
  const halo = 30 + Math.sin(Math.min(g, 96) / 6) * 6;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 44%, #1C2440 0%, ${C.ink} 62%)`, alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 330, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.035em', fontFamily: impact, fontWeight: 800, fontSize: SIZE, letterSpacing: '-0.055em', lineHeight: 1, color: C.white, direction: 'ltr' }}>
          <span style={{ clipPath: `inset(-20% ${(1 - p(g)) * 100}% -20% -5%)` }}>perk</span>
          <Blur x={v}>
            <span style={{
              display: 'inline-block', width: '0.5em', height: '0.5em', borderRadius: '50%', background: C.cobalt,
              transform: `translateX(${-(1 - p(g)) * (LETTERS_W / 2)}px) translateY(0.015em) scale(${appear})`,
              boxShadow: `0 0 ${halo}px rgba(67,91,255,0.85), 0 0 ${halo * 2.6}px rgba(67,91,255,0.35)`,
            }} />
          </Blur>
        </div>
        <div style={{ marginTop: 26, height: 92 }}>
          <WriteOn g={g} at={35} style={accentStyle(84, C.white)}>הצטרפו בחינם לגישה המוקדמת.</WriteOn>
        </div>
        <div style={{ marginTop: 26, width: lin(g, 40, 0, 620, 9), height: 1.5, background: 'rgba(255,255,255,0.35)' }} />
        <div style={{ marginTop: 26, fontFamily: mono, fontSize: 24, letterSpacing: '0.3em', color: '#8FA0FF', direction: 'ltr', height: 30 }}>{tag}</div>
      </div>
      <div style={{ position: 'absolute', bottom: 70, fontFamily: mono, fontSize: 15, letterSpacing: '0.18em', color: C.slateOnInk, direction: 'ltr', opacity: lin(g, 62, 0, 1, 6) }}>
        PERKO · 2026 · PRODUCT SCREENS ARE ILLUSTRATIVE
      </div>
    </AbsoluteFill>
  );
};
