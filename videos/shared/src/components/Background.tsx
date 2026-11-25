import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {colors} from '../theme';

/**
 * The branded dark backdrop: slowly drifting glows over a dot grid.
 */
export const Background: React.FC<{intensity?: number}> = ({intensity = 1}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const x1 = 20 + Math.sin(t * 0.13) * 8;
  const y1 = 15 + Math.cos(t * 0.11) * 6;
  const x2 = 82 + Math.cos(t * 0.09) * 7;
  const y2 = 88 + Math.sin(t * 0.12) * 6;

  return (
    <AbsoluteFill style={{backgroundColor: colors.bg}}>
      <AbsoluteFill
        style={{
          opacity: intensity,
          background: `radial-gradient(900px 700px at ${x1}% ${y1}%, rgba(10, 111, 209, 0.28), transparent 70%), radial-gradient(800px 650px at ${x2}% ${y2}%, rgba(54, 197, 244, 0.16), transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            'radial-gradient(rgba(148, 178, 230, 0.13) 1.4px, transparent 1.4px)',
          backgroundSize: '44px 44px',
          backgroundPosition: `${(t * 4) % 44}px 0px`,
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 85%)',
        }}
      />
    </AbsoluteFill>
  );
};
