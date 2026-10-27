import React from 'react';
import { AbsoluteFill } from 'remotion';
import { useStoryFrame } from '../time';
import { C } from '../tokens';
import { accel, snap } from '../motion';
import { Whip, WriteOn, accentStyle, impactStyle } from '../components/Kinetic';

// Bar 9 (story f384-432). For the business owner, one word per beat (site copy, Business.astro):
//   beat 1 paper "הלקוחות" · beat 2 lime "חוזרים." · beats 3-4 ink, accent "והעסק נשאר בתודעה" + a lime disc as the period
// Exit (punctuation -> mask): the lime period grows and becomes the end card's field.
export const BusinessScene: React.FC = () => {
  const g = useStoryFrame();
  const field = g < 12 ? C.paper : g < 24 ? C.lime : C.ink;
  const dot = snap(g, 30, 0, 1, 6);
  const grow = accel(g, 38, 0, 1, 10);
  const r = 22 + grow * 2300;

  return (
    <AbsoluteFill style={{ background: field, alignItems: 'center', justifyContent: 'center' }}>
      {g < 12 && <Whip g={g} at={0} style={impactStyle(300, C.ink)}>הלקוחות</Whip>}
      {g >= 12 && g < 24 && <Whip g={g} at={12} style={impactStyle(330, C.ink)}>חוזרים.</Whip>}
      {g >= 24 && (
        <div style={{ display: 'flex', alignItems: 'flex-end', direction: 'rtl', gap: 18, marginTop: -30 }}>
          <WriteOn g={g} at={24} style={{ ...accentStyle(150, C.paper), opacity: 1 - grow }}>והעסק נשאר בתודעה</WriteOn>
          <div style={{ width: 44, height: 44, marginBottom: 26, position: 'relative', transform: `scale(${dot})` }}>
            <div style={{ position: 'absolute', left: 22 - r, top: 22 - r, width: r * 2, height: r * 2, borderRadius: '50%', background: C.lime }} />
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
