import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {
  Accent,
  CodeBlock,
  colors,
  fonts,
  Heading,
  progress,
  SceneFrame,
  Terminal,
  windowed,
} from '@anglesharp/video-shared';

type Step = {
  title: string;
  from: number;
  to?: number;
  caption: React.ReactNode;
  code: string;
};

const steps: Step[] = [
  {
    title: 'Configure',
    from: 90,
    to: 510,
    caption: 'Opt in to what you need: a loader for HTTP requests and CSS for computed styles.',
    code: `
using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Css.Dom;  // dotnet add package AngleSharp.Css

var config = Configuration.Default
    .WithDefaultLoader()   // allow HTTP(S) requests
    .WithCss();            // stylesheets & computed styles
`,
  },
  {
    title: 'Load',
    from: 510,
    to: 930,
    caption: 'The browsing context fetches the page, follows redirects and decodes it — like a browser tab.',
    code: `
var context = BrowsingContext.New(config);

using var document = await context
    .OpenAsync("https://example.com/blog");

Console.WriteLine(document.Title);
`,
  },
  {
    title: 'Query',
    from: 930,
    to: 1470,
    caption: 'Plain CSS selectors and DOM properties — Href is already resolved to an absolute URL.',
    code: `
var posts = document
    .QuerySelectorAll("article.post")
    .Where(a => a.ComputeCurrentStyle().GetDisplay() != "none")
    .Select(a => new
    {
        Title = a.QuerySelector("h2")?.TextContent.Trim(),
        Link = a.QuerySelector<IHtmlAnchorElement>("a")?.Href,
    });
`,
  },
  {
    title: 'Use',
    from: 1470,
    caption: "It's just .NET objects and LINQ from here on.",
    code: `
foreach (var post in posts)
{
    Console.WriteLine($"{post.Title} → {post.Link}");
}
`,
  },
];

export const EndToEnd: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame chapter="End to end" index={7}>
      <Heading
        title={
          <>
            End to end: <Accent>extracting blog posts</Accent>
          </>
        }
      />
      <div style={{display: 'flex', gap: 48, flex: 1}}>
        <div style={{width: 360, display: 'flex', flexDirection: 'column', gap: 18}}>
          {steps.map((step, i) => {
            const active = frame >= step.from && (step.to === undefined || frame < step.to);
            const done = step.to !== undefined && frame >= step.to;
            const appear = progress(frame, 20 + i * 10, 16);
            return (
              <div
                key={step.title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  padding: '16px 20px',
                  borderRadius: 16,
                  background: active ? colors.accentBg : 'transparent',
                  border: `1px solid ${active ? colors.brandLight + '66' : 'transparent'}`,
                  opacity: appear,
                }}
              >
                <span
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: fonts.mono,
                    fontSize: 26,
                    fontWeight: 600,
                    background: done ? colors.good : active ? colors.brandLight : colors.cardStrong,
                    color: done || active ? colors.bg : colors.muted,
                  }}
                >
                  {done ? '✓' : i + 1}
                </span>
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: active ? 700 : 500,
                    color: active ? colors.text : colors.muted,
                  }}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{flex: 1, position: 'relative'}}>
          {steps.map((step) => {
            const opacity = windowed(frame, step.from, step.to === undefined ? undefined : step.to + 8, 14);
            if (opacity <= 0) {
              return null;
            }
            return (
              <AbsoluteFill
                key={step.title}
                style={{opacity, display: 'flex', flexDirection: 'column', gap: 24}}
              >
                <CodeBlock
                  title="Program.cs"
                  language="csharp"
                  code={step.code}
                  start={step.from + 20}
                  lineDelay={12}
                  fontSize={26}
                />
                <div style={{fontSize: 32, color: colors.muted, lineHeight: 1.4}}>{step.caption}</div>
                {step.to === undefined ? (
                  <Terminal
                    fontSize={24}
                    lines={[
                      {type: 'cmd', text: 'dotnet run', at: step.from + 120},
                      {type: 'out', text: 'Example Blog', at: step.from + 170, color: colors.text},
                      {
                        type: 'out',
                        text: 'Parsing HTML the right way → https://example.com/blog/parsing-html',
                        at: step.from + 185,
                      },
                      {
                        type: 'out',
                        text: 'CSS selectors in depth → https://example.com/blog/css-selectors',
                        at: step.from + 200,
                      },
                      {
                        type: 'out',
                        text: 'Why specs matter → https://example.com/blog/why-specs-matter',
                        at: step.from + 215,
                      },
                    ]}
                  />
                ) : null}
              </AbsoluteFill>
            );
          })}
        </div>
      </div>
    </SceneFrame>
  );
};
