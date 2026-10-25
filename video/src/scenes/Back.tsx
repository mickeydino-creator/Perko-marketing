import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../tokens';
import { accel, snap } from '../motion';
import { Whip, WriteOn, accentStyle, impactStyle } from '../components/Kinetic';

// Bar 8 (f336-384, paper), under "...ויחזרו לממש את ההטבה". Kinetic type: the impact word, then on beat 2 the human
// resolution in the accent voice with a drawn underline (the reference's "with you." moment).
// Exit: diagonal slab wipe into the pale map.
export const Back: React.FC = () => {
  const g = useCurrentFrame();
  const swap = 16;
  const wipe = accel(g, 40, 0, 1, 9);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 60% 40%, #FFFFFB 0%, ${C.paper} 60%)`, alignItems: 'center', justifyContent: 'center' }}>
      {g < swap ? (
        <Whip g={g} at={0} style={impactStyle(330, C.ink)}>חוזרים.</Whip>
      ) : (
        <div style={{ position: 'relative' }}>
          <WriteOn g={g} at={swap} style={accentStyle(250, C.ink)}>ומממשים.</WriteOn>
          <svg width="900" height="70" viewBox="0 0 900 70" style={{ position: 'absolute', right: -40, bottom: -44 }}>
            <path d="M880 34 C 650 56, 380 20, 20 42" fill="none" stroke={C.ink} strokeWidth="8" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - snap(g, swap + 5, 0, 1, 8)} />
          </svg>
        </div>
      )}
      {g >= 40 && [C.ink, C.paper, C.lime].map((col, i) => {
        const p = Math.max(0, wipe * 1.3 - i * 0.15);
        return <div key={i} style={{ position: 'absolute', top: -300, left: 2300 - p * 3600, width: 4200, height: 1700, background: col, transform: 'skewX(-20deg)' }} />;
      })}
    </AbsoluteFill>
  );
};
