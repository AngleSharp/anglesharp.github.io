import {linearTiming} from '@remotion/transitions';

/** The default scene transition timing used across videos (0.5s). */
export const TRANSITION_FRAMES = 15;
export const sceneTiming = () => linearTiming({durationInFrames: TRANSITION_FRAMES});
