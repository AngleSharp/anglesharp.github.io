import React from 'react';
import {Composition, Folder} from 'remotion';
import {VIDEO} from '@anglesharp/video-shared';
import {defaultRelease111Props, Release111, sceneList} from './Release111';
import {TOTAL_FRAMES} from './timeline';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Release111"
      component={Release111}
      defaultProps={defaultRelease111Props}
      durationInFrames={TOTAL_FRAMES}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Folder name="Release111-Scenes">
      {sceneList.map((s) => (
        <Composition
          key={s.id}
          id={`R111-${s.id}`}
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
