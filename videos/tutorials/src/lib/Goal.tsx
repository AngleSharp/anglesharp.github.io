import React from 'react';
import {useCurrentFrame} from 'remotion';
import {colors, Heading, progress, SceneFrame, useEnter} from '@anglesharp/video-shared';

/** "Here is what we'll build": input on the left, result on the right. */
export const Goal: React.FC<{
  chapter: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  left: React.ReactNode;
  right: React.ReactNode;
  arrow?: string;
  rightAt?: number;
}> = ({chapter, title, subtitle, left, right, arrow = 'AngleSharp', rightAt = 90}) => {
  const frame = useCurrentFrame();
  const leftIn = useEnter(20);
  const rightIn = useEnter(rightAt);
  const arrowIn = progress(frame, rightAt - 30, 24);
  return (
    <SceneFrame chapter={chapter} index={0}>
      <Heading title={title} subtitle={subtitle} />
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 36}}>
        <div style={leftIn}>{left}</div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: arrowIn}}>
          <div style={{fontSize: 22, fontWeight: 600, color: colors.brandLight, whiteSpace: 'nowrap'}}>{arrow}</div>
          <div style={{fontSize: 64, color: colors.brandLight, lineHeight: 1}}>→</div>
        </div>
        <div style={rightIn}>{right}</div>
      </div>
    </SceneFrame>
  );
};

/** Extracts the inner HTML of <body> from a full document string. */
export const bodyOf = (html: string) => html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;
