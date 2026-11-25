import React from 'react';
import {Composition, Folder} from 'remotion';
import {VIDEO} from '@anglesharp/video-shared';
import {defaultIntroductionProps, Introduction} from './Introduction';
import {SCENES, TOTAL_FRAMES} from './timeline';
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

const scenes = [
  {id: 'Opening', component: Opening, duration: SCENES.opening},
  {id: 'WhatIs', component: WhatIs, duration: SCENES.whatIs},
  {id: 'UseCases', component: UseCases, duration: SCENES.useCases},
  {id: 'Philosophy', component: Philosophy, duration: SCENES.philosophy},
  {id: 'Install', component: Install, duration: SCENES.install},
  {id: 'Ecosystem', component: Ecosystem, duration: SCENES.ecosystem},
  {id: 'Extensions', component: Extensions, duration: SCENES.extensions},
  {id: 'EndToEnd', component: EndToEnd, duration: SCENES.endToEnd},
  {id: 'Pitfalls', component: Pitfalls, duration: SCENES.pitfalls},
  {id: 'Ideas', component: Ideas, duration: SCENES.ideas},
  {id: 'Outro', component: Outro, duration: SCENES.outro},
];

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Introduction"
      component={Introduction}
      defaultProps={defaultIntroductionProps}
      durationInFrames={TOTAL_FRAMES}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Folder name="Introduction-Scenes">
      {scenes.map((s) => (
        <Composition
          key={s.id}
          id={s.id}
          component={s.component}
          durationInFrames={s.duration}
          fps={VIDEO.fps}
          width={VIDEO.width}
          height={VIDEO.height}
        />
      ))}
    </Folder>
  </>
);
