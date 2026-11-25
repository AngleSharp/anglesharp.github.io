import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {
  Accent,
  Card,
  Code,
  CodeBlock,
  type CodeHighlight,
  colors,
  fonts,
  Heading,
  Pill,
  progress,
  SceneFrame,
  windowed,
  Window,
} from '@anglesharp/video-shared';

const PHASE_B = 420;

const scanned = [
  ['[DomName("Node")]', 'class Node'],
  ['[DomName("Element")]', 'class Element'],
  ['[DomName("HTMLElement")]', 'class HtmlElement'],
  ['[DomName("Document")]', 'class Document'],
  ['[DomName("Event")]', 'class Event'],
  ['[DomName("Range")]', 'class Range'],
  ['[DomName("Window")]', 'class Window'],
];

/** Phase A: the scripting engine scans assemblies for attributes at runtime. */
const Reflection: React.FC = () => {
  const frame = useCurrentFrame();
  const rowH = 52;
  const scan = interpolate(frame, [50, 130, 131, 211], [0, 1, 0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scanOn = frame >= 50 && frame <= 215;
  const engine = progress(frame, 70, 20);
  const problem = progress(frame, 240, 20);
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 34}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
        <Window title="AngleSharp.dll · AngleSharp.Css.dll · …" style={{width: 820, opacity: progress(frame, 15, 18)}}>
          <div style={{position: 'relative', padding: '18px 26px', fontFamily: fonts.mono, fontSize: 26, fontVariantLigatures: 'none'}}>
            {scanned.map(([attr, cls], i) => {
              const lit = scanOn && Math.abs(scan * scanned.length - (i + 0.5)) < 0.8;
              return (
                <div key={cls} style={{height: rowH, display: 'flex', alignItems: 'center', gap: 18, whiteSpace: 'pre'}}>
                  <span style={{color: lit ? colors.warn : colors.purple, width: 430}}>{attr}</span>
                  <span style={{color: colors.muted}}>{cls}</span>
                </div>
              );
            })}
            {scanOn ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 18 + scan * scanned.length * rowH - 3,
                  height: 6,
                  background: `linear-gradient(90deg, transparent, ${colors.warn}, transparent)`,
                  boxShadow: `0 0 24px ${colors.warn}`,
                }}
              />
            ) : null}
          </div>
        </Window>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: engine}}>
          <div style={{fontSize: 24, color: colors.warn, fontWeight: 600}}>reflection at runtime</div>
          <div style={{fontSize: 64, color: colors.warn, lineHeight: 1}}>→</div>
        </div>
        <div
          style={{
            flex: 1,
            padding: '40px 30px',
            borderRadius: 22,
            border: `1px solid ${colors.border}`,
            background: colors.card,
            textAlign: 'center',
            opacity: engine,
          }}
        >
          <div style={{fontSize: 40, fontWeight: 800}}>Script engine</div>
          <div style={{fontSize: 26, color: colors.muted, marginTop: 10}}>builds the JavaScript surface from what it finds</div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 26,
          padding: '24px 32px',
          borderRadius: 20,
          border: `1px solid ${colors.bad}55`,
          background: `${colors.bad}12`,
          opacity: problem,
          translate: `0px ${(1 - problem) * 20}px`,
        }}
      >
        <div style={{fontSize: 52, color: colors.bad, fontWeight: 800}}>✗</div>
        <div style={{fontSize: 32, lineHeight: 1.35}}>
          The <b>trimmer</b> and <b>native AoT</b> can't see which types reflection will touch, so they either{' '}
          <span style={{color: colors.warn}}>keep too much</span> or <span style={{color: colors.bad}}>remove what's needed</span>.
        </div>
      </div>
    </div>
  );
};

const registration = `
DomRegistration registration = registry =>
{
    registry.Type<INode>("Node")
        .Property("textContent",
            node => node.TextContent,
            (node, value) => node.TextContent = value);

    registry.Type<IElement>("Element")
        .Inherits<INode>()
        .Method("getAttribute",
            (el, args) => el.GetAttribute(args.Get<String>(0)),
            length: 1);
};
`;

const highlights: CodeHighlight[] = [
  {lines: [3, 6], from: 600, to: 690},
  {lines: [8, 9], from: 690, to: 770},
  {lines: [10, 12], from: 770, to: 860},
];

/** Phase B: the DOM declared in code. */
const Declared: React.FC = () => (
  <div style={{display: 'flex', gap: 40, alignItems: 'center', height: '100%'}}>
    <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
      <div style={{display: 'flex', gap: 12}}>
        <Pill mono>AngleSharp.Scripting</Pill>
        <Pill mono color={colors.purple}>
          DomRegistry
        </Pill>
      </div>
      <CodeBlock
        title="Registration.cs"
        language="csharp"
        code={registration}
        start={PHASE_B + 40}
        lineDelay={7}
        fontSize={23}
        highlights={highlights}
        style={{width: 960}}
      />
    </div>
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 22}}>
      <Card compact title="Declared in code" icon="{ }" delay={600}>
        <Code>Type&lt;T&gt;</Code>, members, constructors, constants, events.
      </Card>
      <Card compact title="Strongly typed delegates" icon="λ" delay={690} accent={colors.purple}>
        The engine calls them directly. No reflection.
      </Card>
      <Card compact title="Trim-safe" icon="✂" delay={770} accent={colors.good}>
        What gets registered is exactly what the trimmer keeps.
      </Card>
    </div>
  </div>
);

export const Aot: React.FC = () => {
  const frame = useCurrentFrame();
  const a = windowed(frame, 0, PHASE_B + 10, 14);
  const b = windowed(frame, PHASE_B, undefined, 14);
  return (
    <SceneFrame chapter="Native AoT" index={2}>
      <Heading
        title={
          <>
            Native AoT, <Accent>across the board</Accent>
          </>
        }
        subtitle={
          frame < PHASE_B ? 'Until now: scripting engines discovered the DOM by reflection.' : 'Now: the DOM can be declared in code. No reflection at runtime.'
        }
      />
      <div style={{position: 'relative', flex: 1}}>
        {a > 0 ? (
          <AbsoluteFill style={{opacity: a, paddingTop: 20}}>
            <Reflection />
          </AbsoluteFill>
        ) : null}
        {b > 0 ? (
          <AbsoluteFill style={{opacity: b}}>
            <Declared />
          </AbsoluteFill>
        ) : null}
      </div>
    </SceneFrame>
  );
};
