import React from 'react';
import { C } from '../tokens';
import { impact } from '../fonts';

// Same construction as the site's Wordmark.astro: "perk" in Heebo 800, tracking -0.055em, and a solid disc as the "o".
export const Wordmark: React.FC<{ size: number; color?: string; disc?: string; reveal?: number; hideDisc?: boolean }> = ({ size, color = C.ink, disc = C.cobalt, reveal = 1, hideDisc }) => (
  <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.035em', fontFamily: impact, fontWeight: 800, fontSize: size, letterSpacing: '-0.055em', lineHeight: 1, color, direction: 'ltr' }}>
    <span style={{ clipPath: `inset(-20% ${(1 - reveal) * 100}% -20% -5%)` }}>perk</span>
    <span style={{ display: 'inline-block', width: '0.5em', height: '0.5em', borderRadius: '50%', background: disc, transform: 'translateY(0.015em)', opacity: hideDisc ? 0 : 1 }} />
  </div>
);
