// Single source of truth. Brand values come from video/PROJECT_BRIEF.md (§3, §4).
import { Easing } from 'remotion';

export const FPS = 30;
export const BPM = 150; // Motion DNA clock; the score (music/compose.py) is written at this tempo
export const BEAT = Math.round((60 / BPM) * FPS); // 12 f = 0.4 s
export const BAR = BEAT * 4; // 48 f = 1.6 s
export const W = 1920;
export const H = 1080;
export const DURATION = 612; // 20.4 s

// One scene = one bar. VO lines start on beats: f48, f108, f192, f288, f384, f491 (see README).
export const S = {
  boot: { from: 0, to: 48 },
  problem: { from: 48, to: 96 }, // kinetic type, VO 1
  title: { from: 96, to: 144 }, // VO 2; the music drop lands on f144
  wallet: { from: 144, to: 192 },
  scan: { from: 192, to: 240 }, // VO 3
  stamp: { from: 240, to: 288 },
  progress: { from: 288, to: 336 }, // VO 4
  back: { from: 336, to: 384 }, // kinetic type
  map: { from: 384, to: 432 }, // VO 5
  orbit: { from: 432, to: 480 },
  end: { from: 480, to: DURATION }, // VO 6; the groove stops on f480
};

export const C = {
  ink: '#111522', // [V] src/styles/global.css --ink  -> field.dark
  cobalt: '#435BFF', // [V] --cobalt -> field.brand + signal
  cobaltStrong: '#2B44F2', // [V] --cobalt-strong
  paper: '#F8F9FC', // [V] --paper -> field.light
  pale: '#E9EDFF', // [V] --pale -> field.cool
  paleStrong: '#D9E0FF', // [V] --pale-strong
  white: '#FFFFFF', // [V] --white (elements only, never a field)
  slate: '#586079', // [V] --slate
  slateOnInk: '#AEB5CB', // [V] --slate-on-ink
  inkRaised: '#1C2234', // [V] --ink-raised
  cream: '#FFF8EC', // [S] paper punch card, from Problem.astro
  coral: '#E2553D', // [S] app tile in Problem.astro
  green: '#2F8F5B', // [S] paper slip ticks in Problem.astro
};

export const EASE = {
  snap: Easing.bezier(0.16, 1, 0.3, 1),
  accel: Easing.bezier(0.7, 0, 0.84, 0),
  drift: Easing.bezier(0.45, 0, 0.55, 1),
};

export const T = { snap: 8, letter: 1.5, item: 2.5, whip: 4, transition: 6, flashPeak: 2, flashDecay: 8, counter: 28, minHold: 10 };
