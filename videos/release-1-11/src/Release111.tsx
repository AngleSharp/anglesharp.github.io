import React from 'react';
import {staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {sceneTiming} from '@anglesharp/video-shared';
import {SCENES} from './timeline';
import {Opening} from './scenes/Opening';
import {Lockstep} from './scenes/Lockstep';
import {Aot} from './scenes/Aot';
import {SwitchOn} from './scenes/SwitchOn';
import {Performance} from './scenes/Performance';
import {RoadTo1} from './scenes/RoadTo1';
import {More} from './scenes/More';
import {GetStarted} from './scenes/GetStarted';

export type Release111Props = {
  /** Play the ambient background track (`public/music.mp3`). */
  music: boolean;
  /** Music volume, 0–1. The track is mastered at -18 LUFS; 0.3 keeps it well under a voice. */
  musicVolume: number;
};

export const defaultRelease111Props: Release111Props = {music: true, musicVolume: 0.3};

export const sceneList = [
  {id: 'Opening', name: 'Opening', component: Opening, duration: SCENES.opening},
  {id: 'Lockstep', name: 'Ecosystem in lockstep', component: Lockstep, duration: SCENES.lockstep},
  {id: 'Aot', name: 'Native AoT', component: Aot, duration: SCENES.aot},
  {id: 'SwitchOn', name: 'Switching on AoT', component: SwitchOn, duration: SCENES.switchOn},
  {id: 'Performance', name: 'Performance', component: Performance, duration: SCENES.performance},
  {id: 'RoadTo1', name: 'Road to 1.0', component: RoadTo1, duration: SCENES.roadTo1},
  {id: 'More', name: 'And more', component: More, duration: SCENES.more},
  {id: 'GetStarted', name: 'Get started', component: GetStarted, duration: SCENES.getStarted},
];

/** The 3 minute "AngleSharp 1.11" release video. */
export const Release111: React.FC<Release111Props> = ({music, musicVolume}) => (
  <>
    {music ? <Audio src={staticFile('music.mp3')} volume={musicVolume} /> : null}
    <TransitionSeries>
      {sceneList.flatMap(({id, name, component: Scene, duration}, i) => [
        ...(i > 0 ? [<TransitionSeries.Transition key={`${id}-t`} presentation={fade()} timing={sceneTiming()} />] : []),
        <TransitionSeries.Sequence key={id} name={name} durationInFrames={duration}>
          <Scene />
        </TransitionSeries.Sequence>,
      ])}
    </TransitionSeries>
  </>
);
