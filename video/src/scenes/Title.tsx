import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, BEAT } from '../tokens';
import { accent, impact, mono } from '../fonts';
import { accel, lin, snap } from '../motion';
import { Blur } from '../components/Blur';
import { Letters } from '../components/Letters';
import { Wordmark } from '../components/Wordmark';

// Bar 2 (72-144, cobalt field). VO 2 at f72: "Perko מכניסה את כולם למקום אחד."
// Beat 1: the wordmark. Beat 3 (f108): whip to "מקום אחד." whose period is the white signal dot.
// Exit (punctuation -> mask): the period grows to fill the frame and becomes the paper field on the drop (f144).
export const Title: React.FC = () => {
  const g = useCurrentFrame(); // local frame, 0 = f72
  const swap = BEAT * 2; // f108

  // wordmark: snap up from blur, exits with a whip upward at the swap
  const wmY = (x: number) => (x < swap - 3 ? snap(x, 0, 120, 0, 9) : accel(x, swap - 3, 0, -420, 4));
  const wmV = Math.abs(wmY(g) - wmY(g - 1));

  // headline whips in from the left (reading start for the next line) with a chromatic split
  const hX = (x: number) => snap(x, swap, -360, 0, 5);
  const hV = Math.abs(hX(g) - hX(g - 1));
  const split = Math.max(0, 1 - (g - swap) / 4) * (g >= swap ? 1 : 0);

  const grow = accel(g, 60, 1, 150, 12);
  const toPaper = lin(g, 66, 0, 1, 6);

  const headStyle: React.CSSProperties = { fontFamily: impact, fontWeight: 900, fontSize: 230, letterSpacing: '-0.035em', color: C.ink, lineHeight: 1 };

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 78% 20%, #5A70FF 0%, ${C.cobalt} 45%, #3349F0 100%)` }}>
      {/* overline */}
      <div style={{ position: 'absolute', top: 300, right: 330, fontFamily: mono, fontSize: 20, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.8)', direction: 'ltr', display: 'flex', alignItems: 'center', gap: 18, opacity: lin(g, 4, 0, 1, 4) }}>
        <span>2026</span>
        <span style={{ width: lin(g, 4, 0, 260, 10), height: 1.5, background: 'rgba(255,255,255,0.6)' }} />
        <span>PERKO</span>
      </div>

      {/* beat 1: the wordmark, white with a white disc on the brand field */}
      {g < swap + 2 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Blur y={wmV}>
            <div style={{ transform: `translateY(${wmY(g)}px) scale(${1 + g * 0.0012})`, opacity: g < 1 ? 0 : 1 }}>
              <Wordmark size={300} color={C.white} disc={C.white} />
            </div>
          </Blur>
        </AbsoluteFill>
      )}

      {/* beat 3: "מקום אחד." */}
      {g >= swap && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', transform: `translateX(${hX(g)}px) scale(${1 + (g - swap) * 0.0015})` }}>
            {split > 0 && (
              <>
                <div style={{ ...headStyle, position: 'absolute', inset: 0, color: '#FF3B6B', opacity: 0.55, transform: `translateX(${-34 * split}px)`, direction: 'rtl' }}>מקום אחד</div>
                <div style={{ ...headStyle, position: 'absolute', inset: 0, color: '#3FD2FF', opacity: 0.55, transform: `translateX(${34 * split}px)`, direction: 'rtl' }}>מקום אחד</div>
              </>
            )}
            <Blur x={hV}>
              <div style={{ display: 'flex', direction: 'rtl', alignItems: 'baseline' }}>
                <div style={headStyle}>מקום אחד</div>
                <div style={{ width: 54, height: 54, borderRadius: 99, background: C.white, marginRight: 14, transform: `scale(${grow})`, position: 'relative', zIndex: 5 }} />
              </div>
            </Blur>
            {/* accent, offset to the end side and slightly into the baseline zone */}
            <div style={{ position: 'absolute', left: 40, top: 238, fontFamily: accent, fontSize: 84, color: C.white, direction: 'rtl', whiteSpace: 'nowrap' }}>
              <Letters text="את כל הכרטיסים." f={g} at={swap + 6} stagger={1} dur={10} style={{ fontFamily: accent, fontSize: 84, color: C.white }} />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* the grown period turns into the paper field */}
      <AbsoluteFill style={{ background: C.paper, opacity: toPaper }} />
    </AbsoluteFill>
  );
};
