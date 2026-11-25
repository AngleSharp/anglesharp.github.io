import {TRANSITION_FRAMES} from '@anglesharp/video-shared';

/**
 * Scene durations in frames (30 fps). The narration in `narration.md`
 * follows these timings — keep both in sync when changing them.
 */
export const SCENES = {
  opening: 450, //        0:15
  whatIs: 1350, //       0:45
  useCases: 1200, //     0:40
  philosophy: 1650, //   0:55
  install: 900, //       0:30
  ecosystem: 900, //     0:30
  extensions: 2130, //   1:11
  endToEnd: 2100, //     1:10
  pitfalls: 1650, //     0:55
  ideas: 1500, //        0:50
  outro: 720, //         0:24
} as const;

const sceneCount = Object.keys(SCENES).length;

/** Total length: sum of scenes minus the overlapping transitions (= 8:00). */
export const TOTAL_FRAMES =
  Object.values(SCENES).reduce((sum, d) => sum + d, 0) -
  (sceneCount - 1) * TRANSITION_FRAMES;
