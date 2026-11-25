import {TRANSITION_FRAMES} from '@anglesharp/video-shared';

/**
 * Scene durations in frames (30 fps). The narration in `narration.md`
 * follows these timings — keep both in sync when changing them.
 */
export const SCENES = {
  opening: 300, //     0:10
  lockstep: 660, //    0:22
  aot: 900, //         0:30
  switchOn: 900, //    0:30
  performance: 990, // 0:33
  roadTo1: 660, //     0:22
  more: 540, //        0:18
  getStarted: 555, //  0:18.5
} as const;

const sceneCount = Object.keys(SCENES).length;

/** Total length: sum of scenes minus the overlapping transitions (= 3:00). */
export const TOTAL_FRAMES =
  Object.values(SCENES).reduce((sum, d) => sum + d, 0) -
  (sceneCount - 1) * TRANSITION_FRAMES;
