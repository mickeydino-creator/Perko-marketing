import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, BEAT } from '../tokens';
import { accent, impact, mono } from '../fonts';
import { accel, drift, lin, snap } from '../motion';
import { Blur } from '../components/Blur';
import { Letters } from '../components/Letters';
import { QrGlyph } from '../components/QrGlyph';

// 1.5 bars (144-252, paper). VO 3 at f144: "הלקוחות יסרקו קוד בקופה ויצברו חותמות."
// The illustrative collect screen of the site: scan the code at the counter, a stamp lands (the one signal).
// Exit (radial burst): the new stamp's ring explodes and a cobalt disc opens from it into the next field.

// Phone geometry in frame px (needed so the exit can grow from the stamp).
const PH = { x: 420, y: 112, w: 400, h: 856, bez: 11 };
const SCR = { x: PH.x + PH.bez, y: PH.y + PH.bez, w: PH.w - PH.bez * 2, h: PH.h - PH.bez * 2 };
const SHEET_TOP = SCR.y + SCR.h - 372;
const GRID = { x: SCR.x + 28, y: SHEET_TOP + 128, w: SCR.w - 56, gap: 12 };
const CELL = (GRID.w - GRID.gap * 4) / 5;
const stampAt = (i: number) => {
  const col = i % 5; // RTL: index 0 is the rightmost
  const row = Math.floor(i / 5);
  const x = GRID.x + GRID.w - CELL - col * (CELL + GRID.gap);
  const y = GRID.y + row * (CELL + GRID.gap);
  return { x, y, cx: x + CELL / 2, cy: y + CELL / 2 };
};
export const NEW_STAMP = stampAt(8);

export const Collect: React.FC = () => {
  const g = useCurrentFrame(); // 0 = f144
  const sheetAt = BEAT * 2; // f180, with "ויצברו"
  const stampLand = BEAT * 3; // f198

  const phoneY = (x: number) => snap(x, 0, 340, 0, 9) - drift(x, 9, 0, 10, 90);
  const pv = Math.abs(phoneY(g) - phoneY(g - 1));
  const sheetY = (x: number) => snap(x, sheetAt, 380, 0, 8);
  const sv = Math.abs(sheetY(g) - sheetY(g - 1));
  const scan = lin(g, 10, 0, 1, 22);

  const wordSwap = BEAT * 2;
  const wX = (x: number) => snap(x, wordSwap, -300, 0, 5);
  const wv = Math.abs(wX(g) - wX(g - 1));

  const burst = accel(g, 94, 0, 1, 14);
  const disc = accel(g, 96, 0, 3300, 12);

  const impactStyle: React.CSSProperties = { fontFamily: impact, fontWeight: 900, fontSize: 210, letterSpacing: '-0.035em', color: C.ink, lineHeight: 1 };
  const st = NEW_STAMP;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 40%, #FFFFFF 0%, ${C.paper} 55%, #EEF1F8 100%)` }}>
      {/* right column type */}
      <div style={{ position: 'absolute', right: 200, top: 330, width: 820, direction: 'rtl' }}>
        <div style={{ fontFamily: mono, fontSize: 19, letterSpacing: '0.2em', color: C.slate, direction: 'ltr', display: 'flex', justifyContent: 'flex-end', gap: 16, alignItems: 'center', opacity: lin(g, 3, 0, 1, 4) }}>
          <span>QR / COUNTER</span>
          <span style={{ width: lin(g, 3, 0, 180, 10), height: 1.5, background: 'rgba(17,21,34,0.35)' }} />
          <span>STEP 01</span>
        </div>
        <div style={{ height: 250, position: 'relative', marginTop: 18 }}>
          {g < wordSwap ? (
            <Letters text="סורקים." f={g} at={2} style={impactStyle} />
          ) : (
            <Blur x={wv}><div style={{ ...impactStyle, transform: `translateX(${wX(g)}px)` }}>צוברים.</div></Blur>
          )}
        </div>
        <div style={{ position: 'relative', height: 110, marginTop: -6, marginRight: 160 }}>
          {g < wordSwap ? (
            <Letters text="קוד בקופה," f={g} at={9} stagger={1} dur={10} style={{ fontFamily: accent, fontSize: 82, color: C.ink }} />
          ) : (
            <Letters text="חותמת אחרי חותמת." f={g} at={wordSwap + 5} stagger={1} dur={10} style={{ fontFamily: accent, fontSize: 82, color: C.ink }} />
          )}
        </div>
      </div>

      {/* phone */}
      <Blur y={pv} style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', left: PH.x, top: PH.y, width: PH.w, height: PH.h, transform: `translateY(${phoneY(g)}px)` }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 62, background: '#0B0E18' }} />
          <div style={{ position: 'absolute', left: PH.bez, top: PH.bez, width: SCR.w, height: SCR.h, borderRadius: 52, overflow: 'hidden', background: '#0E1220', fontFamily: impact, direction: 'rtl' }}>
            <div style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', width: 118, height: 34, borderRadius: 30, background: '#0B0E18' }} />
            <div style={{ position: 'absolute', top: 92, width: '100%', textAlign: 'center', color: C.white, fontSize: 19, fontWeight: 600, opacity: 0.9 }}>מכוונים את המצלמה לקוד שבקופה</div>
            {/* viewfinder */}
            <div style={{ position: 'absolute', left: (SCR.w - 230) / 2, top: 160, width: 230, height: 230 }}>
              {(['tr', 'tl', 'br', 'bl'] as const).map((k) => (
                <span key={k} style={{
                  position: 'absolute', width: 44, height: 44, borderColor: C.white, borderStyle: 'solid', borderWidth: 0,
                  ...(k.includes('t') ? { top: 0, borderTopWidth: 5 } : { bottom: 0, borderBottomWidth: 5 }),
                  ...(k.includes('r') ? { right: 0, borderRightWidth: 5 } : { left: 0, borderLeftWidth: 5 }),
                  borderRadius: 14,
                }} />
              ))}
              <div style={{ position: 'absolute', inset: 34, background: C.white, borderRadius: 14, padding: 14 }}>
                <QrGlyph color={C.ink} />
              </div>
              <div style={{ position: 'absolute', left: 20, right: 20, top: 30 + scan * 170, height: 3, borderRadius: 3, background: 'rgba(255,255,255,0.9)', opacity: g < 34 ? 1 : 0 }} />
            </div>

            {/* success sheet */}
            <Blur y={sv} style={{ position: 'absolute', left: 0, right: 0, top: SHEET_TOP - SCR.y, height: SCR.h, transform: `translateY(${sheetY(g)}px)`, opacity: g < sheetAt ? 0 : 1 }}>
              <div style={{ position: 'absolute', inset: 0, background: C.white, borderRadius: '40px 40px 0 0' }}>
                <div style={{ width: 64, height: 7, borderRadius: 9, background: C.paleStrong, margin: '16px auto 18px' }} />
                <div style={{ padding: '0 28px', color: C.ink }}>
                  <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em' }}>נוספה חותמת</div>
                  <div style={{ fontSize: 19, color: C.slate }}>קפה פינה · כרטיס קפה · שם לדוגמה</div>
                </div>
              </div>
            </Blur>
          </div>
        </div>
      </Blur>

      {/* stamps (frame coordinates, so the burst can grow from the new one) */}
      {g >= sheetAt && Array.from({ length: 10 }, (_, i) => {
        const p = stampAt(i);
        const isNew = i === 8;
        const on = i < 8 || (isNew && g >= stampLand);
        const pop = isNew ? snap(g, stampLand, 0.4, 1, 8) : 1;
        const y = sheetY(g) + phoneY(g);
        return (
          <div key={i} style={{
            position: 'absolute', left: p.x, top: p.y + y, width: CELL, height: CELL, borderRadius: 99,
            background: on ? (isNew ? C.cobalt : C.ink) : i === 9 ? C.white : C.pale,
            boxShadow: i === 9 ? `inset 0 0 0 3px ${C.paleStrong}` : undefined,
            transform: `scale(${on && isNew ? pop : 1})`,
          }} />
        );
      })}
      {g >= sheetAt && (
        <div style={{ position: 'absolute', left: SCR.x + 28, top: GRID.y + CELL * 2 + GRID.gap + 22 + sheetY(g) + phoneY(g), width: GRID.w, fontFamily: impact, fontSize: 21, color: C.ink, direction: 'rtl' }}>
          <b>{g >= stampLand ? '9 מתוך 10.' : '8 מתוך 10.'}</b> {g >= stampLand ? 'עוד ביקור אחד לקפה חינם.' : 'עוד 2 ביקורים לקפה חינם.'}
        </div>
      )}

      {/* stamp ring pulse on landing, then the burst */}
      {g >= stampLand && (
        <div style={{
          position: 'absolute', left: st.cx, top: st.cy, width: CELL, height: CELL, marginLeft: -CELL / 2, marginTop: -CELL / 2, borderRadius: 999,
          border: `4px solid ${C.cobalt}`, transform: `scale(${g < 94 ? snap(g, stampLand, 1, 1.9, 12) : 1.9 + burst * 26})`,
          opacity: g < 94 ? 1 - lin(g, stampLand + 4, 0, 0.75, 14) : 1 - burst * 0.6,
        }} />
      )}
      {g >= 94 && Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const d = burst * 1400;
        return <div key={i} style={{ position: 'absolute', left: st.cx, top: st.cy, width: 220 * burst + 20, height: 5, background: C.cobalt, borderRadius: 5, transformOrigin: '0 50%', transform: `rotate(${a}rad) translateX(${d * 0.45}px)` }} />;
      })}
      <div style={{ position: 'absolute', left: st.cx - disc / 2, top: st.cy - disc / 2, width: disc, height: disc, borderRadius: 9999, background: C.cobalt }} />
    </AbsoluteFill>
  );
};
