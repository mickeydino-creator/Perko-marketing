import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../tokens';
import { impact, mono } from '../fonts';
import { accel, lin, snap } from '../motion';
import { Blur } from '../components/Blur';
import { WriteOn, accentStyle } from '../components/Kinetic';

// Bar 3 (f96-144, cobalt). The reference title, rebuilt with Perko's own wordmark:
// mono overline above-left, the hero "perk" revealed letter by letter, the disc arrives as the period,
// the accent sits under the hero, right-aligned to it. A 3% push over the bar.
// Exit (punctuation -> ink mask): the disc grows with a soft edge and covers the frame on the drop (f144).
const SIZE = 460;
const LETTERS = ['p', 'e', 'r', 'k'];

export const Title: React.FC = () => {
  const g = useCurrentFrame();
  const push = 1 + lin(g, 0, 0, 0.03, 48);
  const disc = snap(g, 9, 0, 1, 6);
  const mask = accel(g, 34, 0, 1, 14);
  const r = 0.25 * SIZE + mask * 2600;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 30%, #E4FF6E 0%, ${C.lime} 48%, #C9F02E 100%)` }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: 'absolute', left: 300, top: 300, direction: 'ltr' }}>
          {/* overline */}
          <div style={{ fontFamily: mono, fontSize: 19, letterSpacing: '0.06em', color: C.ink, display: 'flex', alignItems: 'center', gap: 14, opacity: lin(g, 2, 0, 1, 3), marginLeft: 18 }}>
            נאמנות <span style={{ letterSpacing: '0.1em' }}>------</span> 01
          </div>
          {/* hero */}
          <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: impact, fontWeight: 800, fontSize: SIZE, letterSpacing: '-0.055em', lineHeight: 0.9, color: C.ink, marginTop: -20, position: 'relative', zIndex: 2 }}>
            {LETTERS.map((ch, i) => {
              const at = 2 + i * 1.5;
              const x = (f: number) => snap(f, at, -0.35, 0, 6);
              const v = Math.abs(x(g) - x(g - 1)) * SIZE;
              return (
                <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em' }}>
                  <Blur x={v}>
                    <span style={{ display: 'inline-block', transform: `translateX(${x(g) * 100}%)`, opacity: g < at ? 0 : 1 }}>{ch}</span>
                  </Blur>
                </span>
              );
            })}
            <span style={{ display: 'inline-block', width: '0.5em', height: '0.5em', marginLeft: '0.035em', transform: `translateY(0.015em) scale(${disc})`, position: 'relative' }}>
              <span style={{ position: 'absolute', left: '50%', top: '50%', width: r * 2, height: r * 2, marginLeft: -r, marginTop: -r, borderRadius: '50%', background: `radial-gradient(circle, ${C.ink} ${mask > 0 ? 62 : 100}%, rgba(17,19,15,0) 71%)` }} />
            </span>
          </div>
          {/* accent, right-aligned to the hero */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, marginRight: -40 }}>
            <WriteOn g={g} at={9} style={accentStyle(94, C.ink)}>כל ההטבות, במקום אחד</WriteOn>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
