import React from 'react';
import {Accent, BrowserWindow, CodeBlock, TutorialOpening, TutorialOutro} from '@anglesharp/video-shared';
import {CodeStep} from '../lib/CodeStep';
import {bodyOf, Goal} from '../lib/Goal';
import {code, input, out, output} from '../lib/samples';
import type {TutorialDef} from '../lib/tutorial';

const S = '01-querying';

/** Minimal shop styling for showing the sample's real input page. */
const shopCss = `
.shop { padding: 22px 28px; font-size: 17px; }
.shop nav { color: #6b7280; font-size: 14px; }
.shop nav a { color: #0a6fd1; text-decoration: none; }
.shop h1 { font-size: 28px; margin: 6px 0 16px; }
.shop main { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.shop article { border: 1px solid #d5deeb; border-radius: 12px; padding: 14px 16px; position: relative; }
.shop .img { display: block; width: 100%; height: 70px; background: linear-gradient(135deg, #cfe8f7, #e8f1fb); border-radius: 8px; }
.shop h2 { font-size: 18px; margin: 10px 0 4px; }
.shop h2 a { color: #0c1220; text-decoration: none; }
.shop .price { margin: 0; color: #0a6fd1; font-weight: 700; }
.shop .badge { position: absolute; top: 20px; right: 22px; background: #ff6b6b; color: white; font-size: 12px; font-weight: 700; padding: 2px 10px; border-radius: 10px; }
`;

const Opening: React.FC = () => (
  <TutorialOpening
    part={1}
    of={6}
    title={
      <>
        Finding things: <Accent>selectors, types, traversal</Accent>
      </>
    }
    packages={['AngleSharp']}
    builds="an extractor that turns a product listing page into JSON."
  />
);

const GoalScene: React.FC = () => (
  <Goal
    chapter="The goal"
    title={
      <>
        From a web page to <Accent>clean data</Accent>
      </>
    }
    subtitle="input/products.html in, output/products.json out."
    left={
      <BrowserWindow url="https://shop.example.com/garden/" width={680} height={560}>
        <style>{shopCss}</style>
        <div className="shop" dangerouslySetInnerHTML={{__html: bodyOf(input(S, 'input/products.html')).replace(/<img[^>]*>/g, '<div class="img"></div>')}} />
      </BrowserWindow>
    }
    right={
      <CodeBlock
        title="output/products.json"
        language="js"
        code={output(S, 'output/products.json').split('\n').slice(0, 17).join('\n') + '\n  …'}
        start={110}
        lineDelay={4}
        fontSize={18}
        lineNumbers={false}
        style={{width: 760}}
      />
    }
  />
);

const ParseOrLoad: React.FC = () => (
  <CodeStep
    chapter="Parse or load"
    index={1}
    title={
      <>
        Two ways in: <Accent>parse</Accent> or <Accent>load</Accent>
      </>
    }
    code={code(S, 1)}
    fontSize={24}
    highlights={[
      {lines: [1, 3], from: 120, to: 640},
      {lines: [5, 8], from: 640, to: 1350},
    ]}
    notes={[
      {title: 'HtmlParser', icon: 'P', at: 260, body: 'Synchronous, no configuration. Perfect for strings and files.'},
      {
        title: 'BrowsingContext',
        icon: 'B',
        at: 760,
        accent: '#b18cff',
        body: 'Like a browser tab: loaders, cookies, scripts, and an address to resolve relative URLs.',
      },
    ]}
    output={{lines: out(S, 1), at: 480}}
  />
);

const Selectors: React.FC = () => (
  <CodeStep
    chapter="Selectors"
    index={2}
    title={
      <>
        The <Accent>browser's</Accent> selector engine
      </>
    }
    subtitle="QuerySelector, QuerySelectorAll, Matches and Closest."
    code={code(S, 2)}
    fontSize={21}
    highlights={[
      {lines: [1, 3], from: 100, to: 560},
      {lines: [4, 5], from: 560, to: 900},
      {lines: [7, 10], from: 960, to: 1800},
    ]}
    notes={[
      {title: 'Any CSS selector', icon: '#', at: 260, body: 'Classes, attributes, :nth-child(), combinators: what works in the browser works here.'},
      {title: 'Walk up, test, match', icon: '↑', at: 1000, accent: '#3ddc97', body: 'Closest() finds the nearest ancestor; Matches() tests one element.'},
    ]}
    output={{lines: out(S, 2, 5), at: 560, times: [600, 640, 1150, 1210]}}
  />
);

const Typed: React.FC = () => (
  <CodeStep
    chapter="Typed elements"
    index={3}
    title={
      <>
        Typed elements, <Accent>resolved URLs</Accent>
      </>
    }
    code={code(S, 3)}
    fontSize={22}
    highlights={[
      {lines: [1, 3], from: 90, to: 760},
      {lines: [5, 6], from: 760, to: 1300},
    ]}
    notes={[
      {
        title: 'Attribute vs. property',
        icon: '⇄',
        at: 520,
        accent: '#ffb454',
        body: 'GetAttribute returns the raw value. Href and Source are resolved against the document address, like in the browser.',
      },
    ]}
    output={{lines: out(S, 6, 8), at: 300, times: [380, 460, 860]}}
  />
);

const Traversal: React.FC = () => (
  <CodeStep
    chapter="Traversal and text"
    index={4}
    title={
      <>
        Moving around, <Accent>reading text</Accent>
      </>
    }
    code={code(S, 4)}
    fontSize={22}
    highlights={[
      {lines: [1, 5], from: 90, to: 640},
      {lines: [7, 8], from: 640, to: 1000},
      {lines: [9, 10], from: 1000, to: 1350},
    ]}
    notes={[
      {title: 'Null-safe queries', icon: '?', at: 260, body: 'QuerySelector returns null when nothing matches: use ?. or check it.'},
      {
        title: 'TextContent includes scripts',
        icon: '!',
        at: 720,
        accent: '#ffb454',
        body: 'Text inside <script> counts too. Select the element you need, then Trim().',
      },
    ]}
    output={{lines: out(S, 9, 13), at: 300, times: [380, 420, 460, 760, 1060]}}
  />
);

const IntoObjects: React.FC = () => (
  <CodeStep
    chapter="Into objects"
    index={5}
    title={
      <>
        Into <Accent>records</Accent>, out as JSON
      </>
    }
    code={code(S, 5)}
    fontSize={21}
    highlights={[
      {lines: [1, 8], from: 120, to: 620},
      {lines: [10, 14], from: 620, to: 1000},
    ]}
    output={{lines: out(S, 14, 27), at: 640, stagger: 4, fontSize: 18}}
  />
);

const Outro: React.FC = () => (
  <TutorialOutro
    remember={['QuerySelectorAll', 'QuerySelector<T>', 'Closest()', 'Href vs. GetAttribute', 'TextContent.Trim()']}
    sample="01-querying"
    next="changing and generating HTML"
  />
);

export const tutorial1: TutorialDef = {
  part: 1,
  title: 'Finding things: selectors, types, traversal',
  scenes: [
    {id: 'Opening', name: 'Opening', duration: 240, Component: Opening},
    {id: 'Goal', name: 'The goal', duration: 600, Component: GoalScene},
    {id: 'ParseOrLoad', name: 'Parse or load', duration: 1500, Component: ParseOrLoad},
    {id: 'Selectors', name: 'Selectors', duration: 2100, Component: Selectors},
    {id: 'Typed', name: 'Typed elements', duration: 1500, Component: Typed},
    {id: 'Traversal', name: 'Traversal and text', duration: 1500, Component: Traversal},
    {id: 'IntoObjects', name: 'Into objects', duration: 1200, Component: IntoObjects},
    {id: 'Outro', name: 'Outro', duration: 465, Component: Outro},
  ],
};
