import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useStoryFrame } from '../time';
import { C } from '../tokens';
import { accel, snap } from '../motion';
import { Whip, WriteOn, accentStyle, impactStyle } from '../components/Kinetic';

// Bar 6 (story f240-288). Kinetic type, one word per beat, each on its own field:
//   beat 1 ink   "סורקים"   whip     · beat 2 lime "צוברים" whip (field swap behind the word)
//   beats 3-4 paper "ומממשים." accent voice + drawn underline
// Exit (line -> band): the underline thickens into an ink band that fills the frame for the scan scene.
const UL = { y: 640 }; // underline centre in the frame

export const CollectScene: React.FC = () => {
  const g = useStoryFrame();
  const band = accel(g, 38, 8, 1200, 10);
  const field = g < 12 ? C.ink : g < 24 ? C.lime : C.paper;

  return (
    <AbsoluteFill style={{ background: field, alignItems: 'center', justifyContent: 'center' }}>
      {g < 12 && <Whip g={g} at={0} style={impactStyle(330, C.paper)}>סורקים</Whip>}
      {g >= 12 && g < 24 && <Whip g={g} at={12} style={impactStyle(330, C.ink)}>צוברים</Whip>}
      {g >= 24 && (
        <>
          <div style={{ position: 'relative', marginTop: -60 }}>
            <WriteOn g={g} at={24} style={accentStyle(250, C.ink)}>ומממשים.</WriteOn>
          </div>
          {g < 38 ? (
            <svg width="900" height="70" viewBox="0 0 900 70" style={{ position: 'absolute', left: 510, top: UL.y - 35 }}>
              <path d="M880 34 C 650 56, 380 20, 20 42" fill="none" stroke={C.ink} strokeWidth="8" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - snap(g, 29, 0, 1, 8)} />
            </svg>
          ) : (
            <div style={{ position: 'absolute', left: 530 - (band - 8) * 0.6, right: 510 - (band - 8) * 0.6, top: UL.y - band / 2, height: band, borderRadius: 8, background: C.ink }} />
          )}
        </>
      )}
    </AbsoluteFill>
  );
};
