import React from 'react';
import { impact } from '../fonts';

/** The technical voice beside a product shot (Hebrew labels set in Heebo 500, as the HUD's Hebrew fallback): small Hebrew labels, staggered in, never hero-size (§5.2, §15). */
export const Label: React.FC<{ children: React.ReactNode; color: string; style: React.CSSProperties; opacity?: number }> = ({ children, color, style, opacity = 1 }) => (
  <div style={{ position: 'absolute', fontFamily: impact, fontWeight: 500, fontSize: 23, letterSpacing: '0.01em', color, direction: 'rtl', whiteSpace: 'nowrap', opacity, ...style }}>
    {children}
  </div>
);
