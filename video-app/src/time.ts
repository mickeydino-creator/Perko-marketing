import { useCurrentFrame } from 'remotion';
import { SLOW } from './tokens';

/** The current frame in story time (fractional). All scene timings are written in story frames. */
export const useStoryFrame = () => useCurrentFrame() / SLOW;
