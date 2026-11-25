import React from 'react';
import {Composition, Folder, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {sceneTiming, TRANSITION_FRAMES, VIDEO} from '@anglesharp/video-shared';

export type SceneDef = {
  id: string;
  name: string;
  /** Frames at 30 fps. */
  duration: number;
  Component: React.FC;
};

export type TutorialDef = {
  part: number;
  title: string;
  scenes: SceneDef[];
};

export type TutorialProps = {
  /** Play the ambient background track (`public/music-<part>.mp3`). */
  music: boolean;
  /** Music volume, 0–1. The track is mastered at -18 LUFS; 0.3 keeps it well under a voice. */
  musicVolume: number;
};

const defaultProps: TutorialProps = {music: true, musicVolume: 0.3};

/** Total length: sum of the scenes minus the overlapping fades. */
export const totalFrames = (def: TutorialDef) =>
  def.scenes.reduce((sum, s) => sum + s.duration, 0) - (def.scenes.length - 1) * TRANSITION_FRAMES;

const videos = new Map<number, React.FC<TutorialProps>>();

const makeVideo = (def: TutorialDef): React.FC<TutorialProps> => {
  const cached = videos.get(def.part);
  if (cached) {
    return cached;
  }
  const Video: React.FC<TutorialProps> = ({music, musicVolume}) => (
    <>
      {music ? <Audio src={staticFile(`music-${def.part}.mp3`)} volume={musicVolume} /> : null}
      <TransitionSeries>
        {def.scenes.flatMap(({id, name, duration, Component}, i) => [
          ...(i > 0 ? [<TransitionSeries.Transition key={`${id}-t`} presentation={fade()} timing={sceneTiming()} />] : []),
          <TransitionSeries.Sequence key={id} name={name} durationInFrames={duration}>
            <Component />
          </TransitionSeries.Sequence>,
        ])}
      </TransitionSeries>
    </>
  );
  Video.displayName = `Tutorial${def.part}`;
  videos.set(def.part, Video);
  return Video;
};

/** Registers `Tutorial<part>` and one composition per scene (`T<part>-<id>`). */
export const TutorialCompositions: React.FC<{def: TutorialDef}> = ({def}) => (
  <>
    <Composition
      id={`Tutorial${def.part}`}
      component={makeVideo(def)}
      defaultProps={defaultProps}
      durationInFrames={totalFrames(def)}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Folder name={`Tutorial${def.part}-Scenes`}>
      {def.scenes.map((s) => (
        <Composition
          key={s.id}
          id={`T${def.part}-${s.id}`}
          component={s.Component}
          durationInFrames={s.duration}
          fps={VIDEO.fps}
          width={VIDEO.width}
          height={VIDEO.height}
        />
      ))}
    </Folder>
  </>
);
