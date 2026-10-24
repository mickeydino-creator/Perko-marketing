import { interpolate } from 'remotion';
import { EASE, T } from './tokens';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** Expo-out snap from a to b starting at frame `at`. */
export const snap = (f: number, at: number, a: number, b: number, dur: number = T.snap) =>
  interpolate(f, [at, at + dur], [a, b], { ...clamp, easing: EASE.snap });

/** Expo-in acceleration (exits and transition devices). */
export const accel = (f: number, at: number, a: number, b: number, dur: number) =>
  interpolate(f, [at, at + dur], [a, b], { ...clamp, easing: EASE.accel });

export const drift = (f: number, at: number, a: number, b: number, dur: number) =>
  interpolate(f, [at, at + dur], [a, b], { ...clamp, easing: EASE.drift });

export const lin = (f: number, at: number, a: number, b: number, dur: number) =>
  interpolate(f, [at, at + dur], [a, b], clamp);

/** Motion-blur amount (px) for a value function, from its per-frame speed. ~300° shutter. */
export const speed = (fn: (f: number) => number, f: number) => Math.abs(fn(f) - fn(f - 1)) * 0.85;

/** Seeded random, deterministic per render. */
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
