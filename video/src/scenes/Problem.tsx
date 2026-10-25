import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, BEAT } from '../tokens';
import { mono } from '../fonts';
import { accel, lin, snap } from '../motion';
import { Blur } from '../components/Blur';
import { Whip, WriteOn, accentStyle, impactStyle } from '../components/Kinetic';

// Bar 2 (f48-96). Kinetic type, one word per beat, each on its own field (STYLE_GUIDE §6.3), under VO 1
// "כל עסק עם כרטיס אחר.":
//   beat 1  paper  "כל עסק,"   chromatic whip
//   beat 2  ink    "כרטיס"     cobalt hot fill, surrounded by scrolling outline rows of the same word: a card per shop
//   beat 3  pale   "אחר."      glitch slices inside viewfinder brackets
//   beat 4  paper  "ועוד אחד." serif accent with a drawn underline
// Exit: diagonal slab wipe into the cobalt title.
export const Problem: React.FC = () => {
  const g = useCurrentFrame();
  const b = Math.min(3, Math.floor(g / BEAT));
  const field = [C.lime, C.ink, C.lime, C.paper][b];
  const flash = 1 - lin(g, 0, 0, 1, 8); // the boot flash cools into the paper field

  // beat 2: the word grows out of a small version of itself while the field swaps
  const grow = snap(g, BEAT, 0.55, 1, 7);
  const gv = Math.abs(snap(g, BEAT, 0.55, 1, 7) - snap(g - 1, BEAT, 0.55, 1, 7)) * 900;

  // beat 3: 6 glitch slices resolve in ~4 f
  const slices = 6;

  const wipe = accel(g, 40, 0, 1, 9);

  return (
    <AbsoluteFill style={{ background: field, alignItems: 'center', justifyContent: 'center' }}>
      {b === 0 && (
        <Whip g={g} at={1} style={impactStyle(300, C.ink)}>כל עסק,</Whip>
      )}

      {b === 1 && (
        <>
          <AbsoluteFill style={{ justifyContent: 'center', overflow: 'hidden' }}>
            {Array.from({ length: 7 }, (_, r) => {
              const dir = r % 2 ? 1 : -1;
              const off = ((g - BEAT) * 9 * dir + r * 240) % 900;
              return (
                <div key={r} style={{ ...impactStyle(150, 'transparent'), WebkitTextStroke: '1.5px rgba(215,255,53,0.28)', transform: `translateX(${off - 450}px)`, height: 156, display: 'flex', gap: 60 }}>
                  {Array.from({ length: 7 }, (_, k) => <span key={k}>כרטיס</span>)}
                </div>
              );
            })}
          </AbsoluteFill>
          <Blur y={gv}>
            <div style={{ ...impactStyle(330, C.lime), transform: `scale(${grow})`, background: 'linear-gradient(180deg, #F4FFC7 0%, #D7FF35 55%, #BCE82D 100%)', WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 26px rgba(215,255,53,0.45))', padding: '0 20px' }}>
              כרטיס
            </div>
          </Blur>
        </>
      )}

      {b === 2 && (
        <div style={{ position: 'relative', padding: '70px 110px' }}>
          {(['tl', 'tr', 'bl', 'br'] as const).map((k) => (
            <span key={k} style={{
              position: 'absolute', width: 54, height: 54, borderColor: C.ink, borderStyle: 'solid', borderWidth: 0,
              ...(k[0] === 't' ? { top: 0, borderTopWidth: 3 } : { bottom: 0, borderBottomWidth: 3 }),
              ...(k[1] === 'l' ? { left: 0, borderLeftWidth: 3 } : { right: 0, borderRightWidth: 3 }),
            }} />
          ))}
          <div style={{ position: 'absolute', top: 18, right: 4, fontFamily: mono, fontSize: 16, letterSpacing: '0.06em', color: C.muted, direction: 'rtl' }}>כרטיסייה · אפליקציה · מועדון</div>
          <div style={{ position: 'absolute', bottom: 18, left: 4, fontFamily: mono, fontSize: 16, letterSpacing: '0.06em', color: C.muted, direction: 'rtl' }}>כרטיס נפרד לכל חנות</div>
          <div style={{ position: 'relative' }}>
            {Array.from({ length: slices }, (_, i) => {
              const t = g - BEAT * 2 - i * 0.6;
              const off = t < 0 ? 0 : Math.max(0, 1 - t / 4) * ((i * 37) % 2 ? 1 : -1) * (40 + ((i * 53) % 90));
              const top = (i / slices) * 100;
              const bottom = 100 - ((i + 1) / slices) * 100;
              return (
                <div key={i} style={{ ...impactStyle(320, C.ink), position: i ? 'absolute' : 'relative', inset: i ? 0 : undefined, clipPath: `inset(${top}% 0 ${bottom}% 0)`, transform: `translateX(${off}px)`, opacity: t < 0 ? 0 : 1 }}>
                  אחר.
                </div>
              );
            })}
          </div>
        </div>
      )}

      {b === 3 && (
        <div style={{ position: 'relative' }}>
          <WriteOn g={g} at={BEAT * 3} style={accentStyle(230, C.ink)}>ועוד אחד.</WriteOn>
          <svg width="760" height="60" viewBox="0 0 760 60" style={{ position: 'absolute', right: -10, bottom: -36 }}>
            <path d="M745 30 C 560 48, 330 18, 20 36" fill="none" stroke={C.ink} strokeWidth="7" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - snap(g, BEAT * 3 + 3, 0, 1, 8)} />
          </svg>
        </div>
      )}

      {/* exit: three slabs at -20deg sweep toward the reading end, the last one is the title's cobalt field */}
      {g >= 40 && [C.ink, C.paper, C.lime].map((col, i) => {
        const p = Math.max(0, wipe * 1.3 - i * 0.15);
        return <div key={i} style={{ position: 'absolute', top: -300, left: 2300 - p * 3600, width: 4200, height: 1700, background: col, transform: 'skewX(-20deg)' }} />;
      })}

      <AbsoluteFill style={{ background: '#FFFFF4', opacity: flash }} />
    </AbsoluteFill>
  );
};
