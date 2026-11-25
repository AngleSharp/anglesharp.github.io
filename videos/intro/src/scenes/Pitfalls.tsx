import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Accent, CodeBlock, colors, fonts, Heading, progress, SceneFrame, windowed} from '@anglesharp/video-shared';

type Pitfall = {
  symptom: string;
  cause: string;
  fix: string;
};

const pitfalls: Pitfall[] = [
  {
    symptom: 'OpenAsync("https://…") returns an empty document',
    cause: 'The default configuration does not load anything from the network.',
    fix: `
var config = Configuration.Default.WithDefaultLoader();
`,
  },
  {
    symptom: 'Stylesheets are ignored, computed styles are empty',
    cause: 'CSS support beyond selectors lives in the AngleSharp.Css package.',
    fix: `
// dotnet add package AngleSharp.Css
var config = Configuration.Default.WithCss();
`,
  },
  {
    symptom: 'Content rendered by JavaScript is missing',
    cause: 'Scripts are not executed unless you add a scripting engine. (Often simpler: call the JSON API the page uses.)',
    fix: `
var config = Configuration.Default.WithJs().WithDefaultLoader();
// ...
await document.WaitForReadyAsync();
`,
  },
  {
    symptom: 'GetAttribute("href") returns "/about" instead of a full URL',
    cause: 'Attributes hold the raw value. DOM properties resolve it — exactly like in the browser.',
    fix: `
var anchor = document.QuerySelector<IHtmlAnchorElement>("a");
var url = anchor.Href; // "https://example.com/about"
`,
  },
  {
    symptom: 'The serialized HTML differs from the input',
    cause: 'Like a browser, the parser fixes markup and adds <html>, <head> and <body>.',
    fix: `
var content = document.Body.InnerHtml;            // just the body
var pretty = document.ToHtml(new PrettyMarkupFormatter());
`,
  },
];

const START = 90;
const PER_ITEM = 300;

export const Pitfalls: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame chapter="Common pitfalls" index={8}>
      <Heading
        title={
          <>
            Common <Accent color={colors.warn}>pitfalls</Accent>
          </>
        }
      />
      <div style={{position: 'relative', flex: 1}}>
        {pitfalls.map((p, i) => {
          const from = START + i * PER_ITEM;
          const to = i === pitfalls.length - 1 ? undefined : from + PER_ITEM + 8;
          const opacity = windowed(frame, from, to, 14);
          if (opacity <= 0) {
            return null;
          }
          const causeIn = progress(frame, from + 45, 18);
          const fixIn = progress(frame, from + 100, 18);
          return (
            <AbsoluteFill key={i} style={{opacity, display: 'flex', flexDirection: 'column', gap: 30}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
                <span
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 30,
                    color: colors.muted,
                    flexShrink: 0,
                  }}
                >
                  {i + 1} / {pitfalls.length}
                </span>
                <div style={{display: 'flex', gap: 10}}>
                  {pitfalls.map((_, j) => (
                    <span
                      key={j}
                      style={{
                        width: j === i ? 44 : 14,
                        height: 14,
                        borderRadius: 7,
                        background: j <= i ? colors.warn : colors.cardStrong,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div
                style={{
                  padding: '30px 36px',
                  borderRadius: 20,
                  background: 'rgba(255, 107, 107, 0.08)',
                  border: '1px solid rgba(255, 107, 107, 0.35)',
                }}
              >
                <div style={{fontSize: 24, fontWeight: 700, letterSpacing: '0.1em', color: colors.bad}}>
                  SYMPTOM
                </div>
                <div style={{fontSize: 46, fontWeight: 700, marginTop: 8}}>{p.symptom}</div>
              </div>
              <div style={{fontSize: 36, color: colors.muted, lineHeight: 1.4, opacity: causeIn}}>
                <span style={{color: colors.text, fontWeight: 700}}>Why: </span>
                {p.cause}
              </div>
              <div style={{opacity: fixIn, translate: `0px ${(1 - fixIn) * 20}px`}}>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: colors.good,
                    marginBottom: 14,
                  }}
                >
                  FIX
                </div>
                <CodeBlock
                  language="csharp"
                  code={p.fix}
                  fontSize={28}
                  lineNumbers={false}
                  accent="rgba(61, 220, 151, 0.45)"
                />
              </div>
            </AbsoluteFill>
          );
        })}
      </div>
    </SceneFrame>
  );
};
