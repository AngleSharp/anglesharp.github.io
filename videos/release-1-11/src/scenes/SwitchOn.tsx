import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {
  Accent,
  Card,
  Code,
  CodeBlock,
  colors,
  fonts,
  Heading,
  progress,
  SceneFrame,
  useEnter,
  windowed,
} from '@anglesharp/video-shared';

const PHASE_B = 360;

const config = `
using AngleSharp;
using AngleSharp.Css;
using AngleSharp.Scripting;
using AngleSharp.Xml;

var config = Configuration.Default
    .WithCss()
    .WithXml()
    .WithJs(DomRegistrations.Combine(
        CssDom.Register,
        XmlDom.Register))
    .WithEventLoop();
`;

const Configure: React.FC = () => (
  <div style={{display: 'flex', gap: 44, alignItems: 'center', height: '100%'}}>
    <CodeBlock
      title="Program.cs"
      language="csharp"
      code={config}
      start={30}
      lineDelay={7}
      fontSize={26}
      highlights={[
        {lines: [9, 11], from: 150, to: 240},
        {lines: [7, 8], from: 240, to: 330},
      ]}
      style={{width: 860}}
    />
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 22}}>
      <Card compact title="One new overload" icon="+" delay={130}>
        <Code>WithJs(DomRegistration)</Code> exposes exactly what the registration declares.
      </Card>
      <Card compact title="Name only what you use" icon="✓" delay={200} accent={colors.good}>
        The core DOM and the Js DOM are always registered first.
        <div style={{marginTop: 10, fontFamily: fonts.mono, fontSize: 22, color: colors.muted}}>
          CssDom · IoDom · WasmDom · XmlDom · RendererDom
        </div>
      </Card>
      <Card compact title="The old way still works" icon="↺" delay={270} accent={colors.purple}>
        <Code>WithJs()</Code> falls back to reflection, exactly as before.
      </Card>
    </div>
  </div>
);

const attribute = `
using AngleSharp.Attributes;

[assembly: GenerateDomRegistration("MyApp.AppDom")]
`;

const usage = `
.WithJs(DomRegistrations.Combine(
    CssDom.Register,
    AppDom.Register))
`;

const rules = [
  ['ASDOM001', 'DOM member not registered'],
  ['ASDOM002', 'Added DOM member shadows an existing one'],
  ['ASDOM003', 'DOM name not found'],
];

const Generator: React.FC = () => {
  const frame = useCurrentFrame();
  const gen = useEnter(PHASE_B + 120, 20);
  const table = progress(frame, PHASE_B + 300, 20);
  return (
    <div style={{display: 'flex', gap: 44, height: '100%', alignItems: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, width: 900}}>
        <CodeBlock title="AssemblyInfo.cs" language="csharp" code={attribute} start={PHASE_B + 30} lineDelay={10} fontSize={25} lineNumbers={false} />
        <div
          style={{
            alignSelf: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 28,
            fontWeight: 600,
            color: colors.brandLight,
            ...gen,
          }}
        >
          <span style={{fontSize: 34}}>⚙</span> source generator, at build time <span style={{fontSize: 34}}>↓</span>
        </div>
        <CodeBlock language="csharp" code={usage} start={PHASE_B + 170} lineDelay={10} fontSize={25} lineNumbers={false} accent="rgba(54, 197, 244, 0.45)" />
      </div>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 24}}>
        <Card title="Built into AngleSharp 1.11" icon="1.11" delay={PHASE_B + 70} accent={colors.good}>
          Turns your <Code>[DomName]</Code> attributes into a <Code>Register</Code> method. Nothing extra to install.
        </Card>
        <div
          style={{
            borderRadius: 20,
            border: `1px solid ${colors.border}`,
            background: colors.card,
            padding: '24px 28px',
            opacity: table,
            translate: `0px ${(1 - table) * 20}px`,
          }}
        >
          <div style={{fontSize: 28, fontWeight: 800, marginBottom: 14}}>
            Warnings at <Accent>build time</Accent>, not surprises at runtime
          </div>
          {rules.map(([id, text], i) => (
            <div
              key={id}
              style={{display: 'flex', gap: 20, fontSize: 24, padding: '8px 0', opacity: progress(frame, PHASE_B + 320 + i * 15, 12)}}
            >
              <span style={{fontFamily: fonts.mono, color: colors.warn, width: 140, flexShrink: 0}}>{id}</span>
              <span style={{color: colors.muted}}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SwitchOn: React.FC = () => {
  const frame = useCurrentFrame();
  const a = windowed(frame, 0, PHASE_B + 10, 14);
  const b = windowed(frame, PHASE_B, undefined, 14);
  return (
    <SceneFrame chapter="Switching on AoT" index={3}>
      <Heading
        title={
          frame < PHASE_B ? (
            <>
              One overload: <Accent>WithJs(registration)</Accent>
            </>
          ) : (
            <>
              Nobody writes registrations <Accent>by hand</Accent>
            </>
          )
        }
      />
      <div style={{position: 'relative', flex: 1}}>
        {a > 0 ? (
          <AbsoluteFill style={{opacity: a}}>
            <Configure />
          </AbsoluteFill>
        ) : null}
        {b > 0 ? (
          <AbsoluteFill style={{opacity: b}}>
            <Generator />
          </AbsoluteFill>
        ) : null}
      </div>
    </SceneFrame>
  );
};
