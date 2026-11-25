import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background, colors, fonts, LogoMark, Pill, useEnter} from '@anglesharp/video-shared';

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const recap = useEnter(20);
  const thanks = useEnter(200);
  const links = useEnter(250);
  const cta = useEnter(300);

  return (
    <AbsoluteFill style={{fontFamily: fonts.sans, color: colors.text}}>
      <Background />
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
        }}
      >
        <div style={{display: 'flex', gap: 18, ...recap}}>
          <Pill>Standards-based DOM</Pill>
          <Pill color={colors.good}>Familiar, spec-mirroring API</Pill>
          <Pill color={colors.purple}>Opt-in extensions</Pill>
        </div>
        <LogoMark size={180} animateFrom={150} />
        <div style={{fontSize: 96, fontWeight: 800, letterSpacing: '-0.03em', ...thanks}}>
          Thanks for watching!
        </div>
        <div
          style={{
            display: 'flex',
            gap: 60,
            fontFamily: fonts.mono,
            fontSize: 38,
            color: colors.brandLight,
            ...links,
          }}
        >
          <span>anglesharp.github.io</span>
          <span style={{color: colors.faint}}>·</span>
          <span>github.com/AngleSharp</span>
        </div>
        <div style={{fontSize: 34, color: colors.muted, ...cta}}>
          Star the repo · Join the discussions · Contribute · Sponsor
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: '#000',
          opacity: interpolate(frame, [durationInFrames - 30, durationInFrames - 1], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
    </AbsoluteFill>
  );
};
