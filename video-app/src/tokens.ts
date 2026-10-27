// Single source of truth. Brand values come from video/PROJECT_BRIEF.md (§3, §4).
import { Easing } from 'remotion';

export const FPS = 30;
// Scenes are timed in story frames (12 per beat, 48 per bar). SLOW stretches story time onto real frames,
// so the whole film plays 1.25x slower: 120 BPM, beat = 0.5 s, bar = 2.0 s. Must match music/*.py.
export const SLOW = 1.25;
export const BPM = 150 / SLOW;
export const BEAT = 12; // story frames (0.5 s)
export const BAR = BEAT * 4; // story frames (2.0 s)
export const W = 1920;
export const H = 1080;
export const DURATION = 528; // story frames
export const REAL_DURATION = DURATION * SLOW; // 660 f = 22.0 s

// One scene = one bar (48 story frames). The drop lands on the title exit (story f96 = 4.0 s); the groove stops at
// the end card (story f432 = 18.0 s). Screenshots: real app, demo mode, sample data (PROJECT_BRIEF §4).
export const S = {
  boot: { from: 0, to: 48 },
  title: { from: 48, to: 96 },
  wallet: { from: 96, to: 144 },
  swipe: { from: 144, to: 192 },
  discover: { from: 192, to: 240 },
  collect: { from: 240, to: 288 }, // kinetic type
  scan: { from: 288, to: 336 },
  redeem: { from: 336, to: 384 },
  business: { from: 384, to: 432 }, // kinetic type
  end: { from: 432, to: DURATION },
};

export const C = {
  lime: '#D7FF35', // [V] Perko brand: primary, dominant field (field.brand)
  lime2: '#BCE82D', // [V] secondary lime: small variations only
  ink: '#11130F', // [V] near black: type, shapes (field.dark)
  paper: '#F8F8F4', // [V] warm off-white (field.light)
  muted: '#303626', // [V] muted text on lime / off-white
  // derived tints of the palette (not new colours)
  inkRaised: '#1F221B', // ink + 4% paper
  tint: '#EBECE4', // ink 6% on paper
  tintStrong: '#D8DACE', // ink 13% on paper
  onInk: '#B9BCB0', // paper 70% on ink
};

export const EASE = {
  snap: Easing.bezier(0.16, 1, 0.3, 1),
  accel: Easing.bezier(0.7, 0, 0.84, 0),
  drift: Easing.bezier(0.45, 0, 0.55, 1),
};

export const T = { snap: 8, letter: 1.5, item: 2.5, whip: 4, transition: 6, flashPeak: 2, flashDecay: 8, counter: 28, minHold: 10 };
