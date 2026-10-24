// Single source of truth. Brand values come from video/PROJECT_BRIEF.md (§3, §4).
import { Easing } from 'remotion';

export const FPS = 30;
export const BPM = 100; // measured from the supplied track (autocorrelation, kicks every 0.6 s)
export const BEAT = Math.round((60 / BPM) * FPS); // 18 f
export const BAR = BEAT * 4; // 72 f
export const W = 1920;
export const H = 1080;
export const DURATION = 576; // 19.2 s = 8 bars

// Scene boundaries in frames. Each start is on a beat; VO lines start on these downbeats.
export const S = {
  boot: { from: 0, to: 72 }, // VO 1 at 0.6 s
  title: { from: 72, to: 144 }, // VO 2 at 2.4 s; music drop lands on 144
  collect: { from: 144, to: 252 }, // VO 3 at 4.8 s
  redeem: { from: 252, to: 342 }, // VO 4 at 8.4 s
  network: { from: 342, to: 450 }, // VO 5 at 11.4 s
  end: { from: 450, to: DURATION }, // VO 6 at 15.0 s ("Perko."), 15.76 s rest of the line
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
