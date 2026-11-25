import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Accent, BulletList, Code, colors, fonts, Heading, Pill, progress, SceneFrame, useEnter} from '@anglesharp/video-shared';

const rendererFeatures = [
  <>
    <Code>subgrid</Code> and <Code>background-clip: text</Code>
  </>,
  <>
    <Code>loading="lazy"</Code> images and CSS Painting API <Code>paint()</Code>
  </>,
  <>
    <Code>getImageData()</Code> / <Code>putImageData()</Code> on the canvas
  </>,
  <>Color and date/time pickers, animated <Code>@property</Code> values</>,
  <>Layout fixes: margin collapsing, min/max-height, grid and flex edge cases</>,
];

const browserFeatures = ['Text selection', ':visited links', 'Range sliders', 'Popovers', 'Fullscreen API', 'Trusted events'];

/** A simple "test passed" face, standing in for the Acid2 smiley (not a screenshot). */
const PassFace: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, start, 24);
  const smile = progress(frame, start + 18, 20);
  return (
    <svg width={150} height={150} viewBox="0 0 120 120" style={{opacity: p, scale: `${0.7 + 0.3 * p}`}}>
      <rect x={8} y={8} width={104} height={104} rx={18} fill="#ffd84d" stroke="#0c1220" strokeWidth={6} />
      <rect x={34} y={36} width={14} height={14} fill="#0c1220" />
      <rect x={72} y={36} width={14} height={14} fill="#0c1220" />
      <path
        d="M30 74 Q60 100 90 74"
        fill="none"
        stroke="#0c1220"
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={80}
        strokeDashoffset={80 * (1 - smile)}
      />
    </svg>
  );
};

const milestones = [
  {label: 'Today', detail: 'Renderer 0.13 · Browser 0.3', color: colors.brandLight},
  {label: 'This year', detail: 'Renderer 1.0', color: colors.warn},
  {label: 'Shortly after', detail: 'Browser 1.0', color: colors.purple},
];

const ROADMAP = 440;

export const RoadTo1: React.FC = () => {
  const frame = useCurrentFrame();
  const left = useEnter(40);
  const right = useEnter(250);
  const line = progress(frame, ROADMAP + 20, 90);
  return (
    <SceneFrame chapter="Road to 1.0" index={5}>
      <Heading
        title={
          <>
            Rendering, <Accent>close to 1.0</Accent>
          </>
        }
      />
      <div style={{display: 'flex', gap: 40}}>
        <div
          style={{
            flex: 1.35,
            padding: '28px 34px',
            borderRadius: 22,
            border: `1px solid ${colors.border}`,
            background: colors.card,
            ...left,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22}}>
            <div style={{fontSize: 36, fontWeight: 800}}>AngleSharp.Renderer</div>
            <Pill mono>0.13.0</Pill>
          </div>
          <BulletList items={rendererFeatures} start={70} stagger={30} fontSize={28} />
        </div>
        <div
          style={{
            flex: 1,
            padding: '28px 34px',
            borderRadius: 22,
            border: `1px solid ${colors.good}44`,
            background: `${colors.good}0d`,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            ...right,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <div style={{fontSize: 36, fontWeight: 800}}>AngleSharp.Browser</div>
            <Pill mono color={colors.good}>
              0.3.0
            </Pill>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
            <PassFace start={280} />
            <div style={{fontSize: 40, fontWeight: 800, lineHeight: 1.15}}>
              Renders the <span style={{color: colors.good}}>Acid2</span> test correctly
            </div>
          </div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>
            {browserFeatures.map((f, i) => (
              <div key={f} style={{opacity: progress(frame, 330 + i * 10, 12)}}>
                <Pill color={colors.good} style={{fontSize: 20, padding: '6px 16px'}}>
                  {f}
                </Pill>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{marginTop: 'auto', position: 'relative', height: 120, opacity: progress(frame, ROADMAP, 20)}}>
        <div style={{position: 'absolute', left: 220, right: 220, top: 22, height: 6, borderRadius: 3, background: colors.border}} />
        <div
          style={{
            position: 'absolute',
            left: 220,
            top: 22,
            height: 6,
            borderRadius: 3,
            width: `calc((100% - 440px) * ${line})`,
            background: `linear-gradient(90deg, ${colors.brandLight}, ${colors.warn}, ${colors.purple})`,
          }}
        />
        {milestones.map((m, i) => {
          const at = i / (milestones.length - 1);
          const on = progress(frame, ROADMAP + 20 + at * 90, 14);
          return (
            <div
              key={m.label}
              style={{
                position: 'absolute',
                left: `calc(220px + (100% - 440px) * ${at})`,
                top: 0,
                translate: '-50% 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                opacity: 0.3 + 0.7 * on,
              }}
            >
              <div style={{width: 50, height: 50, borderRadius: 25, background: colors.bg, border: `6px solid ${m.color}`, boxSizing: 'border-box'}} />
              <div style={{fontSize: 24, fontWeight: 700, color: m.color, whiteSpace: 'nowrap'}}>{m.label}</div>
              <div style={{fontSize: 22, color: colors.muted, fontFamily: fonts.mono, whiteSpace: 'nowrap'}}>{m.detail}</div>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
