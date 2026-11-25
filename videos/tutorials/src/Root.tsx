import React from 'react';
import {TutorialCompositions} from './lib/tutorial';
import {tutorial1} from './t1';
import {tutorial2} from './t2';
import {tutorial3} from './t3';
import {tutorial4} from './t4';
import {tutorial5} from './t5';
import {tutorial6} from './t6';

export const tutorials = [tutorial1, tutorial2, tutorial3, tutorial4, tutorial5, tutorial6];

export const RemotionRoot: React.FC = () => (
  <>
    {tutorials.map((def) => (
      <TutorialCompositions key={def.part} def={def} />
    ))}
  </>
);
