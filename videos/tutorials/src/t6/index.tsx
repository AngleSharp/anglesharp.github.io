import React from 'react';
import {Img, interpolate, useCurrentFrame} from 'remotion';
import {
  Accent,
  BulletList,
  Code,
  colors,
  easeOut,
  fonts,
  Heading,
  Pill,
  progress,
  SceneFrame,
  TutorialOpening,
  TutorialOutro,
  useEnter,
} from '@anglesharp/video-shared';
import {CodeStep} from '../lib/CodeStep';
import {code, image, out} from '../lib/samples';
import type {TutorialDef} from '../lib/tutorial';

const S = '06-rendering';

const Opening: React.FC = () => (
  <TutorialOpening
    part={6}
    of={6}
    title={
      <>
        From HTML to pixels: <Accent>AngleSharp.Renderer</Accent>
      </>
    }
    packages={['AngleSharp', 'AngleSharp.Css', 'AngleSharp.Renderer (preview)']}
    builds="a social-card generator: an HTML/CSS template in, 1200 × 630 PNGs out. No browser, no headless Chrome."
  />
);

/** A rendered PNG from the sample, with a thin frame. */
const Shot: React.FC<{file: string; width: number; at: number; style?: React.CSSProperties}> = ({file, width, at, style}) => {
  const enter = useEnter(at);
  return (
    <Img
      src={image(S, file)}
      style={{width, borderRadius: 12, border: `1px solid ${colors.border}`, boxShadow: '0 24px 60px rgba(0,0,0,0.45)', ...enter, ...style}}
    />
  );
};

const GoalScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneFrame chapter="The goal" index={0}>
      <Heading
        title={
          <>
            Templates in, <Accent>PNGs</Accent> out
          </>
        }
        subtitle="These three cards were rendered by the sample. Every pixel is AngleSharp.Renderer."
      />
      <div style={{position: 'relative', flex: 1}}>
        {['card-1.png', 'card-2.png', 'card-3.png'].map((file, i) => {
          const p = progress(frame, 60 + i * 50, 30, easeOut);
          return (
            <Img
              key={file}
              src={image(S, file)}
              style={{
                position: 'absolute',
                width: 760,
                left: interpolate(p, [0, 1], [460, 40 + i * 420]),
                top: interpolate(p, [0, 1], [120, i * 70]),
                rotate: `${interpolate(p, [0, 1], [0, (i - 1) * 3])}deg`,
                borderRadius: 14,
                border: `1px solid ${colors.border}`,
                boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
                opacity: p,
              }}
            />
          );
        })}
      </div>
    </SceneFrame>
  );
};

const stages = [
  {label: 'HTML', sub: 'AngleSharp'},
  {label: 'Styles', sub: 'AngleSharp.Css'},
  {label: 'Layout', sub: 'block · flex · grid'},
  {label: 'Paint', sub: 'SkiaSharp'},
  {label: 'PNG', sub: 'RenderedImage'},
];

const WhatIs: React.FC = () => {
  const frame = useCurrentFrame();
  const notes = useEnter(420);
  return (
    <SceneFrame chapter="What the renderer is" index={1}>
      <Heading
        title={
          <>
            A layout and paint engine, <Accent>in .NET</Accent>
          </>
        }
      />
      <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 20}}>
        {stages.map((s, i) => {
          const p = progress(frame, 60 + i * 40, 20);
          return (
            <React.Fragment key={s.label}>
              {i > 0 ? <div style={{fontSize: 44, color: colors.brandLight, opacity: p}}>→</div> : null}
              <div
                style={{
                  flex: 1,
                  padding: '28px 20px',
                  borderRadius: 18,
                  border: `1px solid ${colors.border}`,
                  background: i === 2 || i === 3 ? 'rgba(54, 197, 244, 0.1)' : colors.card,
                  textAlign: 'center',
                  opacity: p,
                  translate: `0px ${(1 - p) * 20}px`,
                }}
              >
                <div style={{fontSize: 38, fontWeight: 800}}>{s.label}</div>
                <div style={{fontSize: 22, color: colors.muted, fontFamily: fonts.mono, marginTop: 8}}>{s.sub}</div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div style={{display: 'flex', gap: 40, marginTop: 56, ...notes}}>
        <div style={{flex: 1}}>
          <div style={{fontSize: 30, fontWeight: 700, marginBottom: 14}}>Good at</div>
          <BulletList
            start={440}
            stagger={30}
            fontSize={28}
            items={['Pages and templates you control', 'Flexbox, grid, subgrid, gradients, web fonts', 'SVG and the 2D canvas']}
          />
        </div>
        <div style={{flex: 1}}>
          <div style={{fontSize: 30, fontWeight: 700, marginBottom: 14, display: 'flex', gap: 14, alignItems: 'center'}}>
            Keep in mind <Pill color={colors.warn}>preview</Pill>
          </div>
          <BulletList
            start={560}
            stagger={30}
            fontSize={28}
            items={['Not for screenshots of arbitrary websites', 'APIs may still change before 1.0', 'Use Playwright when you need a real browser']}
          />
        </div>
      </div>
    </SceneFrame>
  );
};


const FirstRender: React.FC = () => (
  <CodeStep
    chapter="First render"
    index={2}
    title={
      <>
        Three calls to a <Accent>PNG</Accent>
      </>
    }
    subtitle="dotnet add package AngleSharp.Renderer --prerelease"
    code={code(S, 1)}
    fontSize={20}
    lineDelay={4}
    highlights={[
      {lines: [1, 5], from: 100, to: 500},
      {lines: [6, 10], from: 500, to: 950},
      {lines: [12, 16], from: 950, to: 1500},
    ]}
    side={<Shot file="card-template.png" width={600} at={1000} />}
    notes={[
      {
        title: 'The viewport is the image size',
        icon: '▭',
        at: 260,
        accent: '#ffb454',
        body: 'Set ViewPortWidth and ViewPortHeight. The default device is 0 × 0.',
      },
    ]}
    output={{lines: out(S, 1), at: 1060, fontSize: 17}}
  />
);

const Template: React.FC = () => (
  <CodeStep
    chapter="The template"
    index={3}
    title={
      <>
        Fill it through the <Accent>DOM</Accent>
      </>
    }
    code={code(S, 2)}
    fontSize={19}
    lineDelay={4}
    highlights={[
      {lines: [1, 6], from: 100, to: 450},
      {lines: [10, 13], from: 450, to: 1000},
      {lines: [15, 17], from: 1000, to: 1550},
    ]}
    notes={[
      {
        title: 'No string templating',
        icon: '≠',
        at: 520,
        body: 'Setting TextContent escapes for you: no broken markup from a title with "<" in it.',
      },
    ]}
    side={
      <div style={{display: 'flex', gap: 12}}>
        <Shot file="card-1.png" width={300} at={1060} />
        <Shot file="card-3.png" width={300} at={1100} />
      </div>
    }
    output={{lines: out(S, 2, 4), at: 1040, stagger: 20, fontSize: 16}}
  />
);

const Controlling: React.FC = () => (
  <CodeStep
    chapter="Controlling the output"
    index={4}
    title={
      <>
        Scale, clip, or <Accent>one element</Accent>
      </>
    }
    code={code(S, 3)}
    fontSize={19}
    lineDelay={4}
    highlights={[
      {lines: [1, 4], from: 100, to: 450},
      {lines: [5, 8], from: 450, to: 800},
      {lines: [9, 9], from: 800, to: 1150},
    ]}
    side={
      <div style={{display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start'}}>
        <Shot file="banner.png" width={620} at={500} />
        <Shot file="badge.png" width={180} at={840} />
      </div>
    }
    notes={[
      {title: 'RenderOptions', icon: '⚙', at: 200, body: 'DeviceScaleFactor for retina, Clip for a region, FullPage for the whole document.'},
    ]}
    output={{lines: out(S, 5, 7), at: 1000, stagger: 20, fontSize: 16}}
  />
);

const Svg: React.FC = () => (
  <CodeStep
    chapter="SVG to PNG"
    index={5}
    title={
      <>
        Charts and badges from <Accent>SVG</Accent>
      </>
    }
    code={code(S, 4)}
    fontSize={21}
    highlights={[
      {lines: [1, 9], from: 100, to: 500},
      {lines: [10, 14], from: 500, to: 1000},
    ]}
    side={<Shot file="chart.png" width={480} at={620} />}
    output={{lines: out(S, 8), at: 700, fontSize: 17}}
  />
);

const Canvas: React.FC = () => (
  <CodeStep
    chapter="Canvas 2D"
    index={6}
    title={
      <>
        The <Accent>canvas API</Accent> from C#
      </>
    }
    code={code(S, 5)}
    fontSize={19}
    lineDelay={4}
    highlights={[
      {lines: [1, 4], from: 100, to: 450},
      {lines: [6, 13], from: 450, to: 900},
      {lines: [15, 19], from: 900, to: 1300},
    ]}
    side={<Shot file="canvas.png" width={420} at={700} />}
    notes={[
      {title: 'Read pixels back', icon: 'px', at: 940, accent: '#3ddc97', body: 'GetImageData() returns RGBA bytes: handy for tests.'},
    ]}
    output={{lines: out(S, 9, 10), at: 980, stagger: 30, fontSize: 17}}
  />
);

const Limits: React.FC = () => {
  const roadmap = useEnter(300);
  return (
    <SceneFrame chapter="Where it's going" index={7}>
      <Heading
        title={
          <>
            Preview today, <Accent>1.0</Accent> soon
          </>
        }
      />
      <BulletList
        start={40}
        stagger={45}
        fontSize={36}
        items={[
          <>
            Render what <b>you</b> control: templates, reports, cards, SVG and canvas
          </>,
          <>
            Pin the version you tested with: <Code>0.13.0-beta.240</Code> in the sample
          </>,
          <>Need any site, exactly like Chrome? Use Playwright.</>,
        ]}
      />
      <div style={{marginTop: 70, fontSize: 44, fontWeight: 700, ...roadmap}}>
        AngleSharp.Renderer <Accent>1.0</Accent> is planned for this year.
      </div>
    </SceneFrame>
  );
};

const Outro: React.FC = () => (
  <TutorialOutro
    remember={['WithRenderDevice(…)', 'WithRendering()', 'RenderToPng()', 'RenderToImage(options)', 'GetContext("2d")']}
    sample="06-rendering"
    next={<>That's the series. Thanks for watching!</>}
  />
);

export const tutorial6: TutorialDef = {
  part: 6,
  title: 'From HTML to pixels: AngleSharp.Renderer',
  scenes: [
    {id: 'Opening', name: 'Opening', duration: 240, Component: Opening},
    {id: 'Goal', name: 'The goal', duration: 750, Component: GoalScene},
    {id: 'WhatIs', name: 'What the renderer is', duration: 1200, Component: WhatIs},
    {id: 'FirstRender', name: 'First render', duration: 1650, Component: FirstRender},
    {id: 'Template', name: 'The template', duration: 1650, Component: Template},
    {id: 'Controlling', name: 'Controlling the output', duration: 1500, Component: Controlling},
    {id: 'Svg', name: 'SVG to PNG', duration: 1200, Component: Svg},
    {id: 'Canvas', name: 'Canvas 2D', duration: 1350, Component: Canvas},
    {id: 'Limits', name: "Where it's going", duration: 900, Component: Limits},
    {id: 'Outro', name: 'Outro', duration: 495, Component: Outro},
  ],
};
