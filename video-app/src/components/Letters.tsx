import React from 'react';
import { snap } from '../motion';
import { Blur } from './Blur';

/**
 * Letter-sequential masked reveal, right to left for Hebrew (STYLE_GUIDE §4.4, §4.6).
 * Each letter slides in from below inside its own mask, staggered `stagger` frames, smeared while fast.
 */
export const Letters: React.FC<{
  text: string; f: number; at: number; style: React.CSSProperties; stagger?: number; dur?: number; dot?: React.ReactNode;
}> = ({ text, f, at, style, stagger = 1.5, dur = 8, dot }) => {
  const chars = Array.from(text);
  return (
    <div style={{ ...style, display: 'flex', direction: 'rtl', alignItems: 'baseline', whiteSpace: 'pre' }}>
      {chars.map((ch, i) => {
        const t0 = at + i * stagger;
        const fn = (x: number) => snap(x, t0, 0.55, 0, dur);
        const y = fn(f);
        const v = Math.abs(fn(f) - fn(f - 1));
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBlock: '0.12em', marginBlock: '-0.12em' }}>
            <Blur y={v * 260} style={{ display: 'inline-block', transform: `translateY(${y * 100}%)`, opacity: f < t0 ? 0 : 1 }}>
              {ch}
            </Blur>
          </span>
        );
      })}
      {dot}
    </div>
  );
};
