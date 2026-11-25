import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {
  Accent,
  Card,
  Code,
  CodeBlock,
  type CodeHighlight,
  colors,
  Heading,
  Pill,
  progress,
  SceneFrame,
  windowed,
} from '@anglesharp/video-shared';

const js = `
const doc = new DOMParser()
  .parseFromString(html, "text/html");
const links = doc.querySelectorAll("a[href]");
for (const a of links) {
  console.log(a.textContent, a.href);
}
doc.body.append(doc.createElement("footer"));
`;

const cs = `
var doc = await context
  .OpenAsync(r => r.Content(html));
var links = doc.QuerySelectorAll("a[href]");
foreach (var a in links.OfType<IHtmlAnchorElement>()) {
  Console.WriteLine($"{a.TextContent} {a.Href}");
}
doc.Body.Append(doc.CreateElement("footer"));
`;

const highlights: CodeHighlight[] = [
  {lines: [1, 2], from: 330, to: 480},
  {lines: [3, 3], from: 480, to: 630},
  {lines: [4, 6], from: 630, to: 780},
  {lines: [7, 7], from: 780, to: 930},
];

export const Philosophy: React.FC = () => {
  const frame = useCurrentFrame();
  const codePart = windowed(frame, 0, 1060);
  const cardPart = windowed(frame, 1050);
  const labels = progress(frame, 60, 20);

  return (
    <SceneFrame chapter="Philosophy" index={3}>
      <Heading
        title={
          <>
            Don't reinvent the wheel — <Accent>mirror the spec</Accent>
          </>
        }
        subtitle="If you know the DOM from MDN, you already know AngleSharp."
      />
      <div style={{position: 'relative', flex: 1}}>
        <AbsoluteFill style={{opacity: codePart, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 40}}>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 16}}>
            <div style={{opacity: labels}}>
              <Pill color={colors.warn}>JavaScript · in the browser</Pill>
            </div>
            <CodeBlock
              title="browser.js"
              language="js"
              code={js}
              start={90}
              lineDelay={12}
              fontSize={23}
              lineNumbers={false}
              highlights={highlights}
            />
          </div>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 16}}>
            <div style={{opacity: labels}}>
              <Pill>C# · with AngleSharp</Pill>
            </div>
            <CodeBlock
              title="Program.cs"
              language="csharp"
              code={cs}
              start={180}
              lineDelay={12}
              fontSize={23}
              lineNumbers={false}
              highlights={highlights}
              accent="rgba(54, 197, 244, 0.45)"
            />
          </div>
        </AbsoluteFill>

        <AbsoluteFill style={{opacity: cardPart, display: 'flex', flexDirection: 'column', gap: 36}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28}}>
            <Card title="Spec first" icon="§" delay={1080}>
              Behavior follows the W3C and WHATWG algorithms — not ideas we made up.
            </Card>
            <Card title="Familiar names" icon="Aa" delay={1140} accent={colors.good}>
              <div style={{fontSize: 26}}>
                <Code>querySelector</Code> → <Code>QuerySelector</Code>
              </div>
              <div style={{marginTop: 8, fontSize: 26}}>
                <Code>textContent</Code> → <Code>TextContent</Code>
              </div>
            </Card>
            <Card title="Interfaces everywhere" icon="I" delay={1200} accent={colors.purple}>
              Types like <Code>IHtmlAnchorElement</Code> mirror the spec's IDL.
            </Card>
          </div>
          <div
            style={{
              fontSize: 40,
              textAlign: 'center',
              color: colors.muted,
              opacity: progress(frame, 1320, 25),
            }}
          >
            Your knowledge transfers — <Accent>in both directions</Accent>.
          </div>
        </AbsoluteFill>
      </div>
    </SceneFrame>
  );
};
