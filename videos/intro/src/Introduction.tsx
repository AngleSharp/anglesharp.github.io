import React from 'react';
import {staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {sceneTiming} from '@anglesharp/video-shared';
import {SCENES} from './timeline';
import {Opening} from './scenes/Opening';
import {WhatIs} from './scenes/WhatIs';
import {UseCases} from './scenes/UseCases';
import {Philosophy} from './scenes/Philosophy';
import {Install} from './scenes/Install';
import {Ecosystem} from './scenes/Ecosystem';
import {Extensions} from './scenes/Extensions';
import {EndToEnd} from './scenes/EndToEnd';
import {Pitfalls} from './scenes/Pitfalls';
import {Ideas} from './scenes/Ideas';
import {Outro} from './scenes/Outro';

export type IntroductionProps = {
  /** Play the ambient background track (`public/music.mp3`). */
  music: boolean;
  /** Music volume, 0–1. The track is mastered at -18 LUFS; 0.3 keeps it well under a voice. */
  musicVolume: number;
};

export const defaultIntroductionProps: IntroductionProps = {music: true, musicVolume: 0.3};

/** The full 8 minute "Introduction to AngleSharp" video. */
export const Introduction: React.FC<IntroductionProps> = ({music, musicVolume}) => (
  <>
    {music ? <Audio src={staticFile('music.mp3')} volume={musicVolume} /> : null}
    <Scenes />
  </>
);

const Scenes: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Opening" durationInFrames={SCENES.opening}>
      <Opening />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={sceneTiming()} />
    <TransitionSeries.Sequence name="What is AngleSharp" durationInFrames={SCENES.whatIs}>
      <WhatIs />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={sceneTiming()} />
    <TransitionSeries.Sequence name="Use cases" durationInFrames={SCENES.useCases}>
      <UseCases />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={sceneTiming()} />
    <TransitionSeries.Sequence name="Philosophy" durationInFrames={SCENES.philosophy}>
      <Philosophy />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={sceneTiming()} />
    <TransitionSeries.Sequence name="Install" durationInFrames={SCENES.install}>
      <Install />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={sceneTiming()} />
    <TransitionSeries.Sequence name="Ecosystem" durationInFrames={SCENES.ecosystem}>
      <Ecosystem />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={sceneTiming()} />
    <TransitionSeries.Sequence name="Extensions" durationInFrames={SCENES.extensions}>
      <Extensions />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={sceneTiming()} />
    <TransitionSeries.Sequence name="End to end" durationInFrames={SCENES.endToEnd}>
      <EndToEnd />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={sceneTiming()} />
    <TransitionSeries.Sequence name="Pitfalls" durationInFrames={SCENES.pitfalls}>
      <Pitfalls />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={sceneTiming()} />
    <TransitionSeries.Sequence name="Ideas" durationInFrames={SCENES.ideas}>
      <Ideas />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={sceneTiming()} />
    <TransitionSeries.Sequence name="Outro" durationInFrames={SCENES.outro}>
      <Outro />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
