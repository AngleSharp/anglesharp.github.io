import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Background, colors, easeOut, fonts, LogoMark, Pill, progress, useEnter} from '@anglesharp/video-shared';

const themes = [
  {text: 'Native AoT, across the board', color: colors.brandLight},
  {text: 'Faster, across the stack', color: colors.good},
  {text: 'Rendering, close to 1.0', color: colors.purple},
];

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const title = useEnter(20, 40);
  const date = useEnter(50);
  const glow = progress(frame, 0, 60);
  // The version number counts up from 1.10 to 1.11.
  const bump = progress(frame, 70, 24);
  const minor = bump >= 1 ? 11 : 10;
  const flip = interpolate(bump, [0, 0.5, 1], [0, 1, 0], {easing: easeOut});

  return (
    <AbsoluteFill style={{fontFamily: fonts.sans, color: colors.text}}>
      <Background intensity={glow} />
      <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 34}}>
        <LogoMark size={170} animateFrom={4} />
        <div style={{display: 'flex', alignItems: 'baseline', gap: 40, ...title}}>
          <div style={{fontSize: 130, fontWeight: 800, letterSpacing: '-0.035em'}}>
            Angle<span style={{color: colors.brandLight}}>Sharp</span>
          </div>
          <div
            style={{
              fontSize: 130,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              fontFamily: fonts.mono,
              color: colors.brandLight,
              opacity: 1 - flip * 0.7,
              translate: `0px ${flip * -20}px`,
            }}
          >
            1.{minor}
          </div>
        </div>
        <div style={{...date}}>
          <Pill mono>Release · November 2026</Pill>
        </div>
        <div style={{display: 'flex', gap: 22, marginTop: 30}}>
          {themes.map((t, i) => {
            const enter = progress(frame, 130 + i * 22, 20);
            return (
              <div
                key={t.text}
                style={{
                  fontSize: 34,
                  fontWeight: 600,
                  padding: '16px 30px',
                  borderRadius: 16,
                  border: `1px solid ${t.color}55`,
                  background: `${t.color}14`,
                  color: t.color,
                  opacity: enter,
                  translate: `0px ${(1 - enter) * 24}px`,
                }}
              >
                {t.text}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
