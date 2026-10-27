import React from 'react';
import { snap } from '../motion';
import { accent, accentSettings, impact } from '../fonts';
import { Blur } from './Blur';

export const impactStyle = (size: number, color: string): React.CSSProperties => ({
  fontFamily: impact, fontWeight: 900, fontSize: size, letterSpacing: '-0.04em', lineHeight: 1, color, direction: 'rtl', whiteSpace: 'nowrap',
});

export const accentStyle = (size: number, color: string): React.CSSProperties => ({
  fontFamily: accent, ...accentSettings, fontSize: size, lineHeight: 1.05, color, direction: 'rtl', whiteSpace: 'nowrap', letterSpacing: '-0.01em',
});

/** Whip-in with chromatic split (STYLE_GUIDE §4.4): 4 f horizontal entrance from the left, RGB fringes collapse to 0. */
export const Whip: React.FC<{ g: number; at: number; style: React.CSSProperties; children: React.ReactNode; dist?: number }> = ({ g, at, style, children, dist = 420 }) => {
  const x = (f: number) => snap(f, at, -dist, 0, 5);
  const v = Math.abs(x(g) - x(g - 1));
  const split = g >= at ? Math.max(0, 1 - (g - at) / 4) : 0;
  if (g < at) return null;
  return (
    <div style={{ position: 'relative', transform: `translateX(${x(g)}px)` }}>
      {split > 0 && (
        <>
          <div style={{ ...style, position: 'absolute', inset: 0, color: '#11130F', opacity: 0.22, transform: `translateX(${-40 * split}px)`, mixBlendMode: 'multiply' }}>{children}</div>
          <div style={{ ...style, position: 'absolute', inset: 0, color: '#11130F', opacity: 0.12, transform: `translateX(${40 * split}px)`, mixBlendMode: 'multiply' }}>{children}</div>
        </>
      )}
      <Blur x={v}><div style={style}>{children}</div></Blur>
    </div>
  );
};

/** Serif write-on: resolves from blur with a slight drift (STYLE_GUIDE §4.4). */
export const WriteOn: React.FC<{ g: number; at: number; style: React.CSSProperties; children: React.ReactNode }> = ({ g, at, style, children }) => {
  const k = snap(g, at, 1, 0, 9);
  if (g < at) return null;
  return (
    <Blur x={k * 26}>
      <div style={{ ...style, opacity: 1 - k * 0.9, transform: `translateX(${k * -30}px)` }}>{children}</div>
    </Blur>
  );
};
