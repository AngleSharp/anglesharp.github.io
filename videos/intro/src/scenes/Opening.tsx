import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background, colors, fonts, LogoMark, Pill, progress, useEnter} from '@anglesharp/video-shared';

const glyphs = ['<', '>', '</>', '<p>', '{ }', '<svg>', '<div>', '/>', '<math>', '<?xml?>', '#', '<a>'];

const FloatingGlyphs: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill>
      {glyphs.map((g, i) => {
        const x = ((i * 397) % 100) / 100;
        const baseY = ((i * 211) % 100) / 100;
        const y = (baseY - frame * (0.0006 + (i % 4) * 0.0002) + 1) % 1;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x * width,
              top: y * height,
              fontFamily: fonts.mono,
              fontSize: 36 + (i % 3) * 18,
              color: i % 2 ? colors.brandLight : colors.brandDeep,
              opacity: 0.1 + (i % 3) * 0.04,
            }}
          >
            {g}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const word = useEnter(30, 40);
  const tagline = useEnter(60);
  const formats = useEnter(100);
  const intro = useEnter(240);
  const glow = progress(frame, 0, 60);

  return (
    <AbsoluteFill style={{fontFamily: fonts.sans, color: colors.text}}>
      <Background intensity={glow} />
      <FloatingGlyphs />
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36,
        }}
      >
        <LogoMark size={220} animateFrom={8} />
        <div style={{fontSize: 150, fontWeight: 800, letterSpacing: '-0.035em', ...word}}>
          Angle<span style={{color: colors.brandLight}}>Sharp</span>
        </div>
        <div style={{fontSize: 46, color: colors.muted, ...tagline}}>
          The ultimate angle brackets parser for .NET
        </div>
        <div style={{display: 'flex', gap: 16, ...formats}}>
          {['HTML5', 'CSS', 'SVG', 'MathML', 'XML'].map((f) => (
            <Pill key={f} mono>
              {f}
            </Pill>
          ))}
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: colors.brandLight,
            ...intro,
          }}
        >
          An introduction
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
