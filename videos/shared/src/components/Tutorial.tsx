import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {progress, useEnter} from '../anim';
import {colors, fonts} from '../theme';
import {Background} from './Background';
import {LogoMark} from './Logo';
import {Code, Pill} from './Pill';

/** Opening card of a tutorial: series label, title, packages and what gets built. */
export const TutorialOpening: React.FC<{
  part: number;
  of: number;
  title: React.ReactNode;
  packages: string[];
  builds: React.ReactNode;
}> = ({part, of, title, packages, builds}) => {
  const frame = useCurrentFrame();
  const label = useEnter(10);
  const heading = useEnter(24, 36);
  const pills = useEnter(50);
  const goal = useEnter(80);
  return (
    <AbsoluteFill style={{fontFamily: fonts.sans, color: colors.text}}>
      <Background intensity={progress(frame, 0, 40)} />
      <AbsoluteFill style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 160px', gap: 34}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, ...label}}>
          <LogoMark size={64} animateFrom={4} />
          <div style={{fontSize: 30, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: colors.brandLight}}>
            AngleSharp Tutorials · Part {part} of {of}
          </div>
        </div>
        <div style={{fontSize: 104, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.05, maxWidth: 1500, ...heading}}>{title}</div>
        <div style={{display: 'flex', gap: 14, ...pills}}>
          {packages.map((p) => (
            <Pill key={p} mono>
              {p}
            </Pill>
          ))}
        </div>
        <div style={{fontSize: 38, color: colors.muted, maxWidth: 1400, lineHeight: 1.4, ...goal}}>
          <span style={{color: colors.text, fontWeight: 700}}>We'll build: </span>
          {builds}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Closing card: the APIs to remember, the sample to run and what comes next. */
export const TutorialOutro: React.FC<{
  remember: string[];
  sample: string;
  next?: React.ReactNode;
}> = ({remember, sample, next}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const title = useEnter(10);
  const sampleIn = useEnter(40 + remember.length * 14);
  const nextIn = useEnter(70 + remember.length * 14);
  return (
    <AbsoluteFill style={{fontFamily: fonts.sans, color: colors.text}}>
      <Background />
      <AbsoluteFill style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 160px', gap: 40}}>
        <div style={{fontSize: 34, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: colors.brandLight, ...title}}>
          Remember
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 20}}>
          {remember.map((r, i) => {
            const p = progress(frame, 24 + i * 14, 16);
            return (
              <div key={r} style={{fontSize: 44, opacity: p, translate: `0px ${(1 - p) * 20}px`}}>
                <Code>{r}</Code>
              </div>
            );
          })}
        </div>
        <div style={{fontSize: 36, color: colors.muted, ...sampleIn}}>
          Run it yourself: <span style={{fontFamily: fonts.mono, color: colors.text}}>samples/{sample}</span>
          <span style={{color: colors.faint}}> · </span>
          <span style={{fontFamily: fonts.mono, color: colors.brandLight}}>anglesharp.github.io</span>
        </div>
        {next ? (
          <div style={{fontSize: 52, fontWeight: 800, ...nextIn}}>
            <span style={{color: colors.muted, fontWeight: 600}}>Next: </span>
            {next}
          </div>
        ) : null}
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

/** A light browser window with an address bar, for showing pages. */
export const BrowserWindow: React.FC<{
  url: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}> = ({url, children, width = 760, height = 520, style}) => (
  <div
    style={{
      width,
      borderRadius: 16,
      overflow: 'hidden',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 30px 80px rgba(0, 0, 0, 0.45)',
      background: '#ffffff',
      flexShrink: 0,
      ...style,
    }}
  >
    <div style={{height: 54, background: '#e8edf5', display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px'}}>
      {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
        <span key={c} style={{width: 13, height: 13, borderRadius: 7, background: c}} />
      ))}
      <div
        style={{
          marginLeft: 14,
          flex: 1,
          height: 34,
          borderRadius: 17,
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          padding: '0 18px',
          fontFamily: fonts.mono,
          fontSize: 18,
          color: '#40506b',
        }}
      >
        {url}
      </div>
    </div>
    <div style={{height, overflow: 'hidden', color: '#0c1220', fontFamily: fonts.sans}}>{children}</div>
  </div>
);

export type NetworkEntry = {
  method: string;
  url: string;
  status: number;
  note?: string;
  at: number;
};

/** A request log: method, URL, status and an optional note per row. */
export const NetworkLog: React.FC<{entries: NetworkEntry[]; fontSize?: number; title?: string}> = ({
  entries,
  fontSize = 24,
  title = 'Network',
}) => {
  const frame = useCurrentFrame();
  const statusColor = (s: number) => (s >= 400 ? colors.bad : s >= 300 ? colors.warn : colors.good);
  return (
    <div style={{borderRadius: 18, border: `1px solid ${colors.border}`, background: colors.bgCode, overflow: 'hidden'}}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '110px 1fr 90px',
          padding: '14px 26px',
          fontSize: fontSize * 0.75,
          color: colors.faint,
          borderBottom: `1px solid ${colors.border}`,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        <span>{title}</span>
        <span />
        <span style={{textAlign: 'right'}}>Status</span>
      </div>
      {entries.map((e, i) => {
        const p = progress(frame, e.at, 12);
        return (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '110px 1fr 90px',
              alignItems: 'baseline',
              padding: '12px 26px',
              fontFamily: fonts.mono,
              fontSize,
              borderBottom: i < entries.length - 1 ? `1px solid ${colors.border}` : 'none',
              opacity: p,
              translate: `${(1 - p) * -16}px 0px`,
              fontVariantLigatures: 'none',
            }}
          >
            <span style={{color: colors.purple}}>{e.method}</span>
            <span style={{color: colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
              {e.url}
              {e.note ? <span style={{color: colors.muted}}>{`  ${e.note}`}</span> : null}
            </span>
            <span style={{color: statusColor(e.status), textAlign: 'right', fontWeight: 600}}>{e.status}</span>
          </div>
        );
      })}
    </div>
  );
};
