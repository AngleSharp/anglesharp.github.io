import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {easeOut} from '../anim';
import {colors} from '../theme';

/**
 * The AngleSharp mark (two interlocking angle brackets).
 * With `animateFrom`, both halves slide together starting at that frame.
 */
export const LogoMark: React.FC<{size?: number; animateFrom?: number}> = ({
  size = 64,
  animateFrom,
}) => {
  const frame = useCurrentFrame();
  const p =
    animateFrom === undefined
      ? 1
      : interpolate(frame, [animateFrom, animateFrom + 30], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: easeOut,
        });

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{overflow: 'visible'}}>
      <path
        d="M31 22 9 36l22 14v-8.6L22.4 36 31 30.6Z"
        fill={colors.brandDeep}
        style={{opacity: p, translate: `${(1 - p) * -18}px ${(1 - p) * 10}px`}}
      />
      <path
        d="M33 8v8.6L41.6 22 33 27.4V36l22-14Z"
        fill={colors.brandLight}
        style={{opacity: p, translate: `${(1 - p) * 18}px ${(1 - p) * -10}px`}}
      />
    </svg>
  );
};

export const Wordmark: React.FC<{size?: number}> = ({size = 64}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.3}}>
    <LogoMark size={size} />
    <span
      style={{
        fontSize: size * 0.78,
        fontWeight: 800,
        letterSpacing: '-0.02em',
        color: colors.text,
      }}
    >
      Angle<span style={{color: colors.brandLight}}>Sharp</span>
    </span>
  </div>
);
