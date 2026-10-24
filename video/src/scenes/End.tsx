import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../tokens';
import { accent, impact, mono } from '../fonts';
import { lin, snap } from '../motion';
import { Blur } from '../components/Blur';
import { Letters } from '../components/Letters';

// End card (450-576, ink). VO 6: "Perko." at f450, "הצטרפו בחינם לגישה המוקדמת." from f473.
// The dot returns and writes the wordmark (LTR, like the logo), settling as its "o". Then the accent, a hairline,
// and the mono tagline decode. The last ~1.2 s is the one fully settled hold.

const SIZE = 250;
const LETTERS_W = 445; // "perk" at 250px Heebo 800, -0.055em, measured in Chromium
const TAG = 'EARLY ACCESS · FREE TO JOIN · 2026';
const GLYPHS = '#%/_-+=*01<>';

export const End: React.FC = () => {
  const g = useCurrentFrame(); // 0 = f450
  const p = (x: number) => snap(x, 1, 0, 1, 14);
  const v = Math.abs(p(g) - p(g - 1)) * LETTERS_W;
  const decoded = Math.floor(lin(g, 34, 0, TAG.length, 22));
  const tag = g < 34 ? '' : Array.from(TAG).map((ch, i) => (i < decoded || ch === ' ' ? ch : i < decoded + 6 ? GLYPHS[(i * 7 + g) % GLYPHS.length] : '')).join('');
  const halo = 34 + Math.sin(Math.min(g, 90) / 6) * 8;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, #1A2138 0%, ${C.ink} 62%)`, alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 300, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* wordmark written by the dot */}
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.035em', fontFamily: impact, fontWeight: 800, fontSize: SIZE, letterSpacing: '-0.055em', lineHeight: 1, color: C.white, direction: 'ltr' }}>
          <span style={{ clipPath: `inset(-20% ${(1 - p(g)) * 100}% -20% -5%)` }}>perk</span>
          <Blur x={v}>
            <span style={{
              display: 'inline-block', width: '0.5em', height: '0.5em', borderRadius: '50%', background: C.cobalt,
              transform: `translateX(${-(1 - p(g)) * LETTERS_W}px) translateY(0.015em) scale(${g < 1 ? 0 : 1})`,
              boxShadow: `0 0 ${halo}px rgba(67,91,255,0.85), 0 0 ${halo * 2.6}px rgba(67,91,255,0.35)`,
            }} />
          </Blur>
        </div>

        <div style={{ marginTop: 40, height: 100 }}>
          <Letters text="הצטרפו בחינם לגישה המוקדמת." f={g} at={23} stagger={0.8} dur={10} style={{ fontFamily: accent, fontSize: 70, color: C.white }} />
        </div>
        <div style={{ marginTop: 34, width: lin(g, 32, 0, 640, 10), height: 1.5, background: 'rgba(255,255,255,0.4)' }} />
        <div style={{ marginTop: 28, fontFamily: mono, fontSize: 24, letterSpacing: '0.22em', color: C.slateOnInk, direction: 'ltr', height: 32 }}>{tag}</div>
      </div>
    </AbsoluteFill>
  );
};
