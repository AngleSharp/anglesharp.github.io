import React from 'react';
import {Accent, Card, Code, colors, Heading, SceneFrame} from '@anglesharp/video-shared';

const items: {title: string; icon: string; accent: string; body: React.ReactNode}[] = [
  {
    title: 'AngleSharp 1.11',
    icon: 'Core',
    accent: colors.brandLight,
    body: (
      <>
        <Code>ElementInternals</Code> and <Code>:state()</Code>, <Code>::part()</Code>, <Code>setHTMLUnsafe()</Code>
      </>
    ),
  },
  {
    title: 'AngleSharp.Css 1.6',
    icon: 'Css',
    accent: colors.good,
    body: (
      <>
        <Code>@scope</Code>, <Code>in oklch</Code> interpolation, shadow-aware computed styles
      </>
    ),
  },
  {
    title: 'AngleSharp.Js 1.3',
    icon: 'Js',
    accent: colors.warn,
    body: (
      <>
        <Code>SharedWorker</Code>, CSS module scripts, <Code>crypto.subtle</Code>
      </>
    ),
  },
  {
    title: 'AngleSharp.Io 1.4',
    icon: 'Io',
    accent: colors.purple,
    body: (
      <>
        <Code>EventSource</Code>, <Code>URLPattern</Code>, XHR <Code>responseType</Code>
      </>
    ),
  },
  {
    title: 'AngleSharp.Wasm 1.2',
    icon: 'Wasm',
    accent: colors.pink,
    body: <>The WebAssembly JavaScript API as browsers have it: imports, exports, shared memory</>,
  },
  {
    title: 'Correctness',
    icon: '✓',
    accent: colors.brand,
    body: (
      <>
        <Code>click()</Code>, <Code>Range</Code>, <Code>template</Code>, input value sanitization, 308 redirects
      </>
    ),
  },
];

export const More: React.FC = () => (
  <SceneFrame chapter="And a lot more" index={6}>
    <Heading
      title={
        <>
          And <Accent>a lot more</Accent>
        </>
      }
    />
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26}}>
      {items.map((item, i) => (
        <Card key={item.title} title={item.title} icon={item.icon} accent={item.accent} delay={30 + i * 45}>
          {item.body}
        </Card>
      ))}
    </div>
  </SceneFrame>
);
