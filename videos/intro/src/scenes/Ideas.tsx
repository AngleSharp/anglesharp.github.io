import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {
  Accent,
  CodeBlock,
  colors,
  easeOut,
  fonts,
  Heading,
  Pill,
  progress,
  SceneFrame,
  windowed,
  Window,
} from '@anglesharp/video-shared';

/** Idea 1: an SVG chart that "renders" bar by bar. */
const SvgVisual: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  const bars = [0.45, 0.7, 0.55, 0.9, 0.75, 1];
  return (
    <Window title="chart.png  ·  640 × 420" style={{width: 640}}>
      <svg width={640} height={420} viewBox="0 0 640 420">
        <rect width={640} height={420} fill="#ffffff" />
        <text x={40} y={56} fontFamily={fonts.sans} fontSize={28} fontWeight={700} fill="#0c1220">
          NuGet downloads
        </text>
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={40} x2={600} y1={360 - i * 80} y2={360 - i * 80} stroke="#e3e8f0" strokeWidth={2} />
        ))}
        {bars.map((b, i) => {
          const p = interpolate(frame, [start + i * 12, start + i * 12 + 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: easeOut,
          });
          const h = b * 260 * p;
          return <rect key={i} x={60 + i * 90} y={360 - h} width={60} height={h} rx={8} fill={i === 5 ? '#36c5f4' : '#0a6fd1'} />;
        })}
      </svg>
    </Window>
  );
};

/** Idea 2: a canvas that gets filled rectangle by rectangle. */
const CanvasVisual: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  const palette = [colors.brandLight, colors.brandDeep, colors.purple, colors.good, colors.warn, colors.pink];
  const cells = Array.from({length: 48}, (_, i) => i);
  return (
    <Window title="canvas.png  ·  <canvas width=640 height=420>" style={{width: 640}}>
      <div style={{width: 640, height: 420, background: '#0b1324', position: 'relative'}}>
        {cells.map((i) => {
          const col = i % 8;
          const row = Math.floor(i / 8);
          const p = progress(frame, start + ((i * 7) % 48) * 3, 14);
          const size = 34 + ((i * 13) % 5) * 8;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 40 + col * 72 + (60 - size) / 2,
                top: 20 + row * 66 + (60 - size) / 2,
                width: size,
                height: size,
                borderRadius: i % 3 === 0 ? size / 2 : 6,
                background: palette[(i * 5) % palette.length],
                opacity: p * 0.9,
                scale: `${0.4 + p * 0.6}`,
              }}
            />
          );
        })}
      </div>
    </Window>
  );
};

/** Idea 3: a desktop app whose view is HTML/CSS and whose logic is C#. */
const AppVisual: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  const click = start + 150;
  const saved = frame >= click;
  const cursorP = progress(frame, start + 60, 80);
  const press = frame >= click && frame < click + 6;
  return (
    <div style={{position: 'relative'}}>
      <Window title="Notes — Avalonia + AngleSharp.Browser" style={{width: 640}}>
        <div
          style={{
            width: 640,
            height: 420,
            background: '#f6f8fc',
            padding: 36,
            boxSizing: 'border-box',
            color: '#0c1220',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <div style={{fontSize: 34, fontWeight: 800}}>My notes</div>
          <div
            style={{
              flex: 1,
              borderRadius: 12,
              border: '2px solid #d5deeb',
              background: '#fff',
              padding: 18,
              fontSize: 24,
              color: '#40506b',
            }}
          >
            HTML & CSS for the view,
            <br />C# for everything else.
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
            <div
              style={{
                padding: '14px 34px',
                borderRadius: 10,
                background: press ? '#0a6fd1' : '#1ba1e2',
                color: '#fff',
                fontSize: 24,
                fontWeight: 700,
                scale: press ? '0.96' : '1',
              }}
            >
              Save
            </div>
            <div style={{fontSize: 24, fontWeight: 600, color: saved ? '#16a36b' : '#8b9ab3'}}>
              {saved ? 'Saved!' : 'Unsaved changes'}
            </div>
          </div>
        </div>
      </Window>
      <svg
        width={36}
        height={36}
        viewBox="0 0 24 24"
        style={{
          position: 'absolute',
          left: interpolate(cursorP, [0, 1], [560, 110]),
          top: interpolate(cursorP, [0, 1], [180, 420]),
        }}
      >
        <path d="M3 2l7 19 2.5-7.5L20 11z" fill="#0c1220" stroke="#fff" strokeWidth={1.5} />
      </svg>
    </div>
  );
};

type Idea = {
  title: React.ReactNode;
  text: string;
  tags: string[];
  code: string;
  from: number;
  to?: number;
  Visual: React.FC<{start: number}>;
};

const ideas: Idea[] = [
  {
    title: (
      <>
        A native <Accent>SVG renderer</Accent> for .NET
      </>
    ),
    text: 'Turn SVG charts, icons and badges into PNGs on the server — no browser, no native SVG library.',
    tags: ['AngleSharp.Css', 'AngleSharp.Renderer'],
    from: 40,
    to: 520,
    code: `
var document = await context.OpenAsync(r => r.Content(svg));
var png = document.RenderToPng();
await File.WriteAllBytesAsync("chart.png", png.Data);
`,
    Visual: SvgVisual,
  },
  {
    title: (
      <>
        <Accent>Canvas</Accent> in C#
      </>
    ),
    text: 'Use the familiar 2D canvas API from C# for thumbnails, reports or generative art.',
    tags: ['AngleSharp.Renderer'],
    from: 520,
    to: 1000,
    code: `
var canvas = document.QuerySelector<IHtmlCanvasElement>("canvas");
var ctx = canvas.GetContext("2d") as Canvas2DRenderingContext;
ctx.SetFillStyle("#36c5f4");
ctx.FillRect(10f, 10f, 100f, 50f);
var png = ctx.ToImage("image/png");
`,
    Visual: CanvasVisual,
  },
  {
    title: (
      <>
        Cross-platform apps: <Accent>HTML/CSS</Accent> views, <Accent>C#</Accent> logic
      </>
    ),
    text: 'Render your UI with web standards inside Avalonia and handle DOM events in C# — no JavaScript required.',
    tags: ['AngleSharp.Browser.Avalonia', 'Windows · macOS · Linux'],
    from: 1000,
    code: `
var save = document.QuerySelector("#save");
var status = document.QuerySelector("#status");
save.AddEventListener("click", (sender, ev) =>
{
    status.TextContent = "Saved!";
});
`,
    Visual: AppVisual,
  },
];

export const Ideas: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneFrame chapter="Ideas" index={9}>
      <Heading
        title={
          <>
            What will <Accent>you</Accent> build?
          </>
        }
      />
      <div style={{position: 'relative', flex: 1}}>
        {ideas.map((idea, i) => {
          const opacity = windowed(frame, idea.from, idea.to === undefined ? undefined : idea.to + 8, 14);
          if (opacity <= 0) {
            return null;
          }
          const {Visual} = idea;
          return (
            <AbsoluteFill key={i} style={{opacity, display: 'flex', flexDirection: 'row', gap: 56}}>
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 26}}>
                <div style={{fontSize: 50, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15}}>
                  {idea.title}
                </div>
                <div style={{fontSize: 32, color: colors.muted, lineHeight: 1.4}}>{idea.text}</div>
                <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
                  {idea.tags.map((t) => (
                    <Pill key={t} color={colors.purple}>
                      {t}
                    </Pill>
                  ))}
                </div>
                <CodeBlock
                  language="csharp"
                  code={idea.code}
                  start={idea.from + 60}
                  lineDelay={10}
                  fontSize={23}
                  lineNumbers={false}
                />
              </div>
              <div style={{paddingTop: 10}}>
                <Visual start={idea.from + 40} />
              </div>
            </AbsoluteFill>
          );
        })}
      </div>
    </SceneFrame>
  );
};
