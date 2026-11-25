import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useEnter} from '../anim';
import {colors, fonts, SAFE} from '../theme';
import {Background} from './Background';
import {LogoMark} from './Logo';

/**
 * Common frame for every content scene: background, chapter label and
 * a small logo watermark. Children are laid out inside the safe area.
 */
export const SceneFrame: React.FC<{
  chapter?: string;
  index?: number;
  children: React.ReactNode;
}> = ({chapter, index, children}) => {
  const enter = useEnter(0, 10, 18);
  return (
    <AbsoluteFill style={{fontFamily: fonts.sans, color: colors.text}}>
      <Background />
      {chapter ? (
        <div
          style={{
            position: 'absolute',
            top: 48,
            left: SAFE.x,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: colors.muted,
            ...enter,
          }}
        >
          {index !== undefined ? (
            <span style={{color: colors.brandLight, fontFamily: fonts.mono}}>
              {String(index).padStart(2, '0')}
            </span>
          ) : null}
          <span style={{width: 28, height: 2, background: colors.border}} />
          {chapter}
        </div>
      ) : null}
      <div style={{position: 'absolute', top: 40, right: SAFE.x, opacity: 0.7}}>
        <LogoMark size={44} />
      </div>
      <AbsoluteFill
        style={{
          padding: `${SAFE.y + 40}px ${SAFE.x}px ${SAFE.y - 20}px`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
