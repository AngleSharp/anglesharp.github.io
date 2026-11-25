import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {
  Accent,
  BulletList,
  CodeBlock,
  colors,
  fonts,
  Heading,
  progress,
  SceneFrame,
  windowed,
  Window,
} from '@anglesharp/video-shared';

type TreeNode = {depth: number; label: string; kind: 'el' | 'text' | 'implied'};

// The DOM the HTML5 parsing algorithm produces for the snippet below.
const tree: TreeNode[] = [
  {depth: 0, label: 'html', kind: 'implied'},
  {depth: 1, label: 'head', kind: 'implied'},
  {depth: 1, label: 'body', kind: 'implied'},
  {depth: 2, label: 'ul', kind: 'el'},
  {depth: 3, label: 'li', kind: 'el'},
  {depth: 4, label: '"One"', kind: 'text'},
  {depth: 3, label: 'li', kind: 'el'},
  {depth: 4, label: '"Two"', kind: 'text'},
  {depth: 2, label: 'p', kind: 'el'},
  {depth: 3, label: '"Unclosed "', kind: 'text'},
  {depth: 3, label: 'b', kind: 'el'},
  {depth: 4, label: '"bold"', kind: 'text'},
];

const DomTree: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{fontFamily: fonts.mono, fontSize: 30, lineHeight: 1.5, padding: '24px 36px'}}>
      {tree.map((node, i) => {
        const p = progress(frame, start + i * 9, 14);
        const color =
          node.kind === 'text' ? '#c3e88d' : node.kind === 'implied' ? colors.warn : '#f07178';
        return (
          <div
            key={i}
            style={{
              paddingLeft: node.depth * 40,
              opacity: p,
              translate: `${(1 - p) * 20}px 0px`,
              color,
              whiteSpace: 'pre',
            }}
          >
            <span style={{color: colors.faint}}>{node.depth > 0 ? '└ ' : ''}</span>
            {node.kind === 'text' ? node.label : `<${node.label}>`}
            {node.kind === 'implied' ? (
              <span style={{color: colors.faint, fontSize: 22}}>  (implied)</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export const WhatIs: React.FC = () => {
  const frame = useCurrentFrame();
  const partA = windowed(frame, 0, 720);
  const partB = windowed(frame, 700);
  const arrow = progress(frame, 860, 20);

  return (
    <SceneFrame chapter="What is AngleSharp?" index={1}>
      <AbsoluteFill style={{padding: '140px 120px 80px', opacity: partA}}>
        <Heading
          title={
            <>
              What is <Accent>AngleSharp</Accent>?
            </>
          }
          subtitle="A .NET library that turns markup into a real, standards-compliant DOM."
        />
        <BulletList
          start={90}
          stagger={95}
          fontSize={44}
          items={[
            'Parses HTML5, CSS, SVG, MathML and XML',
            'Builds the same DOM a browser would — even from broken markup',
            'Implements the W3C and WHATWG specifications',
            'Pure managed code: netstandard2.0, net8.0 and net10.0',
            'Open source (MIT) since 2013, .NET Foundation member since 2019',
          ]}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{padding: '140px 120px 80px', opacity: partB}}>
        <Heading
          delay={700}
          title={
            <>
              Tolerant — <Accent>like a browser</Accent>
            </>
          }
          subtitle="Real-world HTML is messy. AngleSharp follows the exact HTML5 parsing algorithm."
        />
        <div style={{display: 'flex', alignItems: 'center', gap: 48}}>
          <CodeBlock
            title="input.html"
            language="html"
            start={760}
            lineDelay={10}
            fontSize={34}
            style={{width: 680}}
            code={`
<ul>
  <li>One
  <li>Two
</ul>
<p>Unclosed <b>bold
`}
          />
          <div
            style={{
              fontSize: 80,
              color: colors.brandLight,
              opacity: arrow,
              translate: `${(1 - arrow) * -30}px 0px`,
            }}
          >
            →
          </div>
          <Window title="document (DOM)" style={{flex: 1, opacity: progress(frame, 870, 15)}}>
            <DomTree start={880} />
          </Window>
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};
