import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Accent, CodeBlock, colors, fonts, Heading, progress, SceneFrame, Terminal} from '@anglesharp/video-shared';

const csproj = `
<PropertyGroup>
  <PublishAot>true</PublishAot>
</PropertyGroup>
`;

const swap = `
// before: reflection
.WithJs()
// after: trimming and native AoT
.WithJs(DomRegistrations.Combine(
    CssDom.Register))
`;

export const GetStarted: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill>
      <SceneFrame chapter="Get started" index={7}>
        <Heading
          title={
            <>
              Get <Accent>started</Accent>
            </>
          }
        />
        <div style={{display: 'flex', gap: 36, alignItems: 'flex-start'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 24, width: 860}}>
            <Terminal
              title="update together"
              fontSize={25}
              lines={[
                {type: 'cmd', text: 'dotnet add package AngleSharp --version 1.11.0', at: 20},
                {type: 'cmd', text: 'dotnet add package AngleSharp.Css --version 1.6.0', at: 60},
                {type: 'cmd', text: 'dotnet add package AngleSharp.Js --version 1.3.0', at: 100},
                {type: 'cmd', text: 'dotnet publish -c Release', at: 250},
              ]}
            />
            <div
              style={{
                padding: '24px 30px',
                borderRadius: 18,
                border: `1px solid ${colors.border}`,
                background: colors.card,
                fontSize: 28,
                color: colors.muted,
                lineHeight: 1.45,
                opacity: progress(frame, 300, 20),
              }}
            >
              Release notes for all eight packages, plus the full benchmarks:
              <div style={{fontFamily: fonts.mono, fontSize: 28, color: colors.brandLight, marginTop: 8}}>anglesharp.github.io/blog</div>
            </div>
          </div>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 20}}>
            <CodeBlock title="App.csproj" language="html" code={csproj} start={140} lineDelay={8} fontSize={24} lineNumbers={false} />
            <CodeBlock title="Program.cs" language="csharp" code={swap} start={180} lineDelay={8} fontSize={24} lineNumbers={false} />
          </div>
        </div>
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: progress(frame, 360, 20),
          }}
        >
          <div style={{fontSize: 40, fontWeight: 800}}>
            Next stop: <Accent>1.0</Accent> for the renderer and the browser.
          </div>
          <div style={{fontFamily: fonts.mono, fontSize: 30, color: colors.brandLight}}>anglesharp.github.io</div>
        </div>
      </SceneFrame>
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
