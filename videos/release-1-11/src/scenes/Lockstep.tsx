import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Accent, colors, fonts, Heading, Pill, progress, SceneFrame} from '@anglesharp/video-shared';

type Pkg = {name: string; version: string; next?: string};

const packages: Pkg[] = [
  {name: 'AngleSharp', version: '1.11.0'},
  {name: 'AngleSharp.Css', version: '1.6.0'},
  {name: 'AngleSharp.Js', version: '1.3.0'},
  {name: 'AngleSharp.Io', version: '1.4.0'},
  {name: 'AngleSharp.Wasm', version: '1.2.0'},
  {name: 'AngleSharp.Xml', version: '1.4.0'},
  {name: 'AngleSharp.Renderer', version: '0.13.0', next: '1.0 this year'},
  {name: 'AngleSharp.Browser', version: '0.3.0', next: '1.0 shortly after'},
];

const CARDS = 50;
const STAGGER = 14;
const REQUIRES = 230;
const AOT = 330;
const NEXT = 450;

export const Lockstep: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneFrame chapter="The whole ecosystem" index={1}>
      <Heading
        title={
          <>
            Eight releases, <Accent>one foundation</Accent>
          </>
        }
        subtitle="All of them require AngleSharp 1.11.0, and all of them are AoT friendly."
      />
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginTop: 10}}>
        {packages.map((pkg, i) => {
          const enter = progress(frame, CARDS + i * STAGGER, 18);
          const req = progress(frame, REQUIRES + i * 6, 14);
          const aot = progress(frame, AOT + i * 6, 14);
          const next = pkg.next ? progress(frame, NEXT, 20) : 0;
          const core = i === 0;
          return (
            <div
              key={pkg.name}
              style={{
                position: 'relative',
                padding: '26px 28px',
                borderRadius: 20,
                background: core ? 'rgba(54, 197, 244, 0.1)' : colors.card,
                border: `1px solid ${next > 0 ? `rgba(255, 180, 84, ${0.2 + next * 0.5})` : core ? `${colors.brandLight}66` : colors.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                opacity: enter,
                translate: `0px ${(1 - enter) * 26}px`,
              }}
            >
              <div style={{fontSize: 22, color: colors.muted, fontFamily: fonts.mono}}>{pkg.name}</div>
              <div style={{fontSize: 56, fontWeight: 800, fontFamily: fonts.mono, letterSpacing: '-0.02em', color: core ? colors.brandLight : colors.text}}>
                {pkg.version}
              </div>
              <div style={{display: 'flex', gap: 10, flexWrap: 'wrap', minHeight: 42}}>
                {!core ? (
                  <div style={{opacity: req}}>
                    <Pill mono style={{fontSize: 18, padding: '6px 14px'}}>
                      ≥ 1.11.0
                    </Pill>
                  </div>
                ) : null}
                <div style={{opacity: aot}}>
                  <Pill color={colors.good} style={{fontSize: 18, padding: '6px 14px'}}>
                    AoT friendly
                  </Pill>
                </div>
              </div>
              {pkg.next ? (
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: colors.warn,
                    opacity: next,
                    height: next * 34,
                  }}
                >
                  → {pkg.next}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 'auto',
          textAlign: 'center',
          fontSize: 36,
          color: colors.muted,
          opacity: progress(frame, 540, 20),
        }}
      >
        Using several packages? <Accent>Update them together.</Accent>
      </div>
    </SceneFrame>
  );
};
