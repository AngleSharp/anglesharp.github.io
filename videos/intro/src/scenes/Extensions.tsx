import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {
  Accent,
  CodeBlock,
  colors,
  fonts,
  Heading,
  type Language,
  Pill,
  progress,
  SceneFrame,
  windowed,
} from '@anglesharp/video-shared';

type Extension = {
  name: string;
  status: 'stable' | 'preview';
  kind: 'extension' | 'tooling';
  what: string;
  why: string;
  language: Language;
  code: string;
};

const extensions: Extension[] = [
  {
    name: 'Css',
    status: 'stable',
    kind: 'extension',
    what: 'Full CSS parser, CSSOM and style computation.',
    why: 'The core only needs selectors. Stylesheets, the cascade and computed styles are big — so they are opt-in.',
    language: 'csharp',
    code: `
var config = Configuration.Default.WithCss();
// ...
var style = element.ComputeCurrentStyle();
Console.WriteLine(style.GetDisplay());
`,
  },
  {
    name: 'Js',
    status: 'stable',
    kind: 'extension',
    what: 'Runs scripts against the DOM, powered by Jint.',
    why: 'Executing JavaScript needs a whole engine. Most scrapers do not want that cost — the ones that do add one line.',
    language: 'csharp',
    code: `
var config = Configuration.Default.WithJs();
var document = await context.OpenAsync(r => r.Content(html));
await document.WaitForReadyAsync();
`,
  },
  {
    name: 'Xml',
    status: 'stable',
    kind: 'extension',
    what: 'XML, XHTML and SVG documents plus DTD validation.',
    why: 'XML has its own, strict parsing rules. A different parser — but the very same DOM API.',
    language: 'csharp',
    code: `
var config = Configuration.Default.WithXml();
var parser = new XmlParser();
var doc = parser.ParseDocument("<note><to>You</to></note>");
`,
  },
  {
    name: 'Io',
    status: 'stable',
    kind: 'extension',
    what: 'Better requesters, cookies, downloads, storage and caching.',
    why: 'The core ships a minimal HTTP loader. Real-world browsing needs cookies, files and caches.',
    language: 'csharp',
    code: `
var config = Configuration.Default
    .WithRequesters()
    .WithDefaultLoader()
    .WithTemporaryCookies();
`,
  },
  {
    name: 'XPath',
    status: 'stable',
    kind: 'extension',
    what: 'Select nodes with XPath expressions.',
    why: 'XPath is not part of the HTML DOM we mirror — but many developers know and love it from XML.',
    language: 'csharp',
    code: `
using AngleSharp.XPath;

var title = document.Body.SelectSingleNode("//h1");
var links = document.Body.SelectNodes("//a[@href]");
`,
  },
  {
    name: 'Diffing',
    status: 'stable',
    kind: 'tooling',
    what: 'Semantic comparison of DOM trees.',
    why: 'Comparing markup as strings breaks on whitespace or attribute order. Diffing compares meaning — it powers bUnit.',
    language: 'csharp',
    code: `
var diffs = DiffBuilder
    .Compare("<p class='a b'>Hi</p>")
    .WithTest("<p class='b a'>Hi</p>")
    .Build();
`,
  },
  {
    name: 'Wasm',
    status: 'stable',
    kind: 'extension',
    what: 'Runs WebAssembly modules inside browsing contexts.',
    why: 'Modern pages ship WebAssembly. Together with AngleSharp.Js, modules can be loaded and called.',
    language: 'csharp',
    code: `
var config = Configuration.Default
    .WithJs()
    .WithWasm();
`,
  },
  {
    name: 'Renderer',
    status: 'preview',
    kind: 'extension',
    what: 'Lays out and paints the styled DOM.',
    why: 'Once styles are computed, the next step is layout and painting — headless output to PNG via SkiaSharp.',
    language: 'csharp',
    code: `
var config = Configuration.Default.WithCss().WithRendering();
// ...
var png = document.RenderToPng();
File.WriteAllBytes("page.png", png.Data);
`,
  },
  {
    name: 'Browser',
    status: 'preview',
    kind: 'tooling',
    what: 'The whole ecosystem, assembled into a browser engine.',
    why: 'Navigation, history and input wired together — headless, or as a ready-made Avalonia control.',
    language: 'html',
    code: `
<Window xmlns:browser="using:AngleSharp.Browser.Avalonia">
  <browser:BrowserView Source="https://example.org" />
</Window>
`,
  },
];

const INTRO = 60;
const PER_ITEM = 230;

export const Extensions: React.FC = () => {
  const frame = useCurrentFrame();
  const activeIndex = Math.min(
    extensions.length - 1,
    Math.max(0, Math.floor((frame - INTRO) / PER_ITEM)),
  );

  return (
    <SceneFrame chapter="Extensions" index={6}>
      <Heading
        title={
          <>
            A tour of the <Accent>extensions</Accent>
          </>
        }
      />
      <div style={{display: 'flex', gap: 48, flex: 1}}>
        <div style={{width: 400, display: 'flex', flexDirection: 'column', gap: 8}}>
          {extensions.map((ext, i) => {
            const isActive = i === activeIndex && frame >= INTRO;
            const appear = progress(frame, 10 + i * 6, 16);
            return (
              <div
                key={ext.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 22px',
                  borderRadius: 14,
                  fontSize: 30,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? colors.text : colors.muted,
                  background: isActive ? colors.accentBg : 'transparent',
                  boxShadow: isActive ? `inset 4px 0 0 ${colors.brandLight}` : 'none',
                  opacity: appear,
                  translate: `${(1 - appear) * -20}px 0px`,
                }}
              >
                <span>
                  <span style={{color: colors.faint, fontWeight: 400}}>.</span>
                  {ext.name}
                </span>
                {ext.status === 'preview' ? (
                  <span style={{fontSize: 18, color: colors.warn}}>preview</span>
                ) : null}
              </div>
            );
          })}
        </div>
        <div style={{flex: 1, position: 'relative'}}>
          {extensions.map((ext, i) => {
            const from = INTRO + i * PER_ITEM;
            const to = i === extensions.length - 1 ? undefined : from + PER_ITEM + 8;
            const opacity = windowed(frame, from, to, 14);
            if (opacity <= 0) {
              return null;
            }
            return (
              <AbsoluteFill
                key={ext.name}
                style={{opacity, display: 'flex', flexDirection: 'column', gap: 26}}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
                  <div style={{fontSize: 60, fontWeight: 800, letterSpacing: '-0.02em'}}>
                    <span style={{color: colors.muted}}>AngleSharp.</span>
                    {ext.name}
                  </div>
                  <Pill color={ext.status === 'preview' ? colors.warn : colors.good}>{ext.status}</Pill>
                  <Pill color={ext.kind === 'tooling' ? colors.purple : colors.brandLight}>{ext.kind}</Pill>
                </div>
                <div style={{fontSize: 40, fontWeight: 600}}>{ext.what}</div>
                <div style={{fontSize: 32, color: colors.muted, lineHeight: 1.4, maxWidth: 1150}}>
                  <span style={{color: colors.brandLight, fontWeight: 700, fontFamily: fonts.sans}}>
                    Why it exists:{' '}
                  </span>
                  {ext.why}
                </div>
                <CodeBlock
                  language={ext.language}
                  code={ext.code}
                  start={from + 40}
                  lineDelay={8}
                  fontSize={26}
                  lineNumbers={false}
                />
              </AbsoluteFill>
            );
          })}
        </div>
      </div>
    </SceneFrame>
  );
};
