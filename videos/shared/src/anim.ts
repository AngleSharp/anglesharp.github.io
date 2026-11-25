import {Easing, interpolate, useCurrentFrame} from 'remotion';

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

/** 0 → 1 progress between `start` and `start + duration`. */
export const progress = (
  frame: number,
  start: number,
  duration = 20,
  easing = easeOut,
) => interpolate(frame, [start, start + duration], [0, 1], {...clamp, easing});

/** Visible window: fades in at `start`, fades out at `end` (if given). */
export const windowed = (
  frame: number,
  start: number,
  end?: number,
  fade = 15,
) => {
  const fadeIn = progress(frame, start, fade);
  if (end === undefined) {
    return fadeIn;
  }
  return Math.min(fadeIn, 1 - progress(frame, end - fade, fade, easeInOut));
};

/** Style for an element that rises into view at `delay`. */
export const useEnter = (delay = 0, distance = 30, duration = 22) => {
  const frame = useCurrentFrame();
  const p = progress(frame, delay, duration);
  return {
    opacity: p,
    translate: `0px ${(1 - p) * distance}px`,
  } as const;
};

/** Number of characters of `text` visible for a typewriter effect. */
export const typed = (
  frame: number,
  start: number,
  text: string,
  charsPerFrame = 1.2,
) => text.slice(0, Math.max(0, Math.floor((frame - start) * charsPerFrame)));
