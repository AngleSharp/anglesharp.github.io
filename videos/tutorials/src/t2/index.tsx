import React from 'react';
import {Accent, CodeBlock, TutorialOpening, TutorialOutro} from '@anglesharp/video-shared';
import {CodeStep} from '../lib/CodeStep';
import {Goal} from '../lib/Goal';
import {code, input, out, output} from '../lib/samples';
import type {TutorialDef} from '../lib/tutorial';

const S = '02-generating';

const Opening: React.FC = () => (
  <TutorialOpening
    part={2}
    of={6}
    title={
      <>
        Changing and <Accent>generating HTML</Accent>
      </>
    }
    packages={['AngleSharp']}
    builds="a newsletter cleaner that removes scripts, rewrites links and writes clean HTML."
  />
);

const pretty = output(S, 'output/pretty.html').replace(/\t/g, '  ').split('\n');

const GoalScene: React.FC = () => (
  <Goal
    chapter="The goal"
    title={
      <>
        Messy HTML in, <Accent>clean HTML</Accent> out
      </>
    }
    subtitle="Scripts and handlers gone, links tagged, a footer added."
    left={
      <CodeBlock
        title="input/newsletter.html"
        language="html"
        code={input(S, 'input/newsletter.html')}
        fontSize={15}
        lineNumbers={false}
        start={20}
        lineDelay={3}
        style={{width: 760}}
      />
    }
    right={
      <CodeBlock
        title="output/pretty.html"
        language="html"
        code={[...pretty.slice(0, 22), '  …'].join('\n')}
        fontSize={14}
        lineNumbers={false}
        start={110}
        lineDelay={3}
        style={{width: 720}}
      />
    }
  />
);

const Create: React.FC = () => (
  <CodeStep
    chapter="Create and insert"
    index={1}
    title={
      <>
        Building nodes with <Accent>DOM methods</Accent>
      </>
    }
    code={code(S, 1)}
    fontSize={22}
    highlights={[
      {lines: [1, 3], from: 100, to: 480},
      {lines: [5, 9], from: 480, to: 900},
      {lines: [11, 13], from: 900, to: 1300},
    ]}
    notes={[
      {title: 'Same names as the browser', icon: '+', at: 240, body: 'CreateElement, Append, Prepend, Before, After, ClassList.'},
      {title: 'Typed creation', icon: 'T', at: 560, accent: '#b18cff', body: 'CreateElement<IHtmlAnchorElement>() gives you Href right away.'},
      {title: 'data-* attributes', icon: 'D', at: 960, accent: '#3ddc97', body: 'Dataset["campaign"] writes data-campaign.'},
    ]}
  />
);

const Remove: React.FC = () => (
  <CodeStep
    chapter="Remove and replace"
    index={2}
    title={
      <>
        Removing what <Accent>doesn't belong</Accent>
      </>
    }
    code={code(S, 2, 1, 18)}
    fontSize={21}
    lineDelay={4}
    highlights={[
      {lines: [1, 6], from: 100, to: 520},
      {lines: [8, 18], from: 520, to: 1100},
    ]}
    notes={[
      {title: 'Remove()', icon: '−', at: 220, body: 'Takes the element and everything inside it out of the tree.'},
      {title: 'Copy, then change', icon: '!', at: 640, accent: '#ffb454', body: 'Attributes is live. Collect the names with ToList() before removing.'},
      {
        title: 'Untrusted input?',
        icon: '✓',
        at: 1150,
        accent: '#3ddc97',
        body: 'Use a real sanitizer. HtmlSanitizer is built on AngleSharp.',
      },
    ]}
  />
);

const Links: React.FC = () => (
  <CodeStep
    chapter="Unwrap and rewrite links"
    index={3}
    title={
      <>
        Unwrap, then <Accent>rewrite links</Accent>
      </>
    }
    code={code(S, 2, 20, 35)}
    fontSize={21}
    highlights={[
      {lines: [1, 4], from: 100, to: 400},
      {lines: [6, 10], from: 400, to: 760},
      {lines: [11, 15], from: 760, to: 1150},
    ]}
    notes={[
      {title: 'Replace = replaceWith()', icon: '⇄', at: 160, accent: '#b18cff', body: 'font.Replace(children) unwraps the <font> but keeps its text.'},
      {title: 'Resolved URLs', icon: '⇗', at: 460, body: 'Href is absolute, so "/archive" becomes https://news.example.com/archive.'},
    ]}
    output={{lines: out(S, 14, 20).filter((l) => l.includes('<a ')), at: 820, command: null, title: 'output/pretty.html (links)', fontSize: 16, stagger: 20}}
  />
);

const Fragments: React.FC = () => (
  <CodeStep
    chapter="Fragments"
    index={4}
    title={
      <>
        Fragments need <Accent>context</Accent>
      </>
    }
    code={code(S, 3)}
    fontSize={21}
    highlights={[
      {lines: [1, 3], from: 100, to: 400},
      {lines: [5, 8], from: 400, to: 900},
      {lines: [9, 9], from: 900, to: 1150},
    ]}
    notes={[
      {
        title: 'Parsed like the browser would',
        icon: '<>',
        at: 600,
        accent: '#ffb454',
        body: 'Outside a table a <tr> is dropped, leaving only text. Inside <tbody> it stays a row.',
      },
    ]}
    output={{lines: out(S, 1, 2), at: 420, times: [470, 520]}}
  />
);

const Serialize: React.FC = () => (
  <CodeStep
    chapter="Serializing"
    index={5}
    title={
      <>
        Back to text: <Accent>pick a formatter</Accent>
      </>
    }
    code={code(S, 4, 1, 14)}
    fontSize={21}
    highlights={[
      {lines: [1, 2], from: 100, to: 480},
      {lines: [4, 7], from: 480, to: 1050},
      {lines: [9, 14], from: 1050, to: 1400},
    ]}
    notes={[
      {
        title: 'Where did <html> come from?',
        icon: '?',
        at: 260,
        accent: '#ffb454',
        body: 'Like a browser, the parser adds html, head and body. Serialize Body.InnerHtml for just the content.',
      },
      {title: 'Formatters', icon: '{}', at: 640, body: 'Pretty, Minify and XHTML are one call each.'},
    ]}
    output={{lines: out(S, 3, 4), at: 300, times: [340, 1120]}}
  />
);

const Outro: React.FC = () => (
  <TutorialOutro
    remember={['CreateElement / Append', 'Remove() / Replace()', 'ParseFragment(html, context)', 'ToHtml(formatter)']}
    sample="02-generating"
    next="working with styles in AngleSharp.Css"
  />
);

export const tutorial2: TutorialDef = {
  part: 2,
  title: 'Changing and generating HTML',
  scenes: [
    {id: 'Opening', name: 'Opening', duration: 240, Component: Opening},
    {id: 'Goal', name: 'The goal', duration: 600, Component: GoalScene},
    {id: 'Create', name: 'Create and insert', duration: 1350, Component: Create},
    {id: 'Remove', name: 'Remove and replace', duration: 1650, Component: Remove},
    {id: 'Links', name: 'Unwrap and rewrite links', duration: 1200, Component: Links},
    {id: 'Fragments', name: 'Fragments', duration: 1200, Component: Fragments},
    {id: 'Serialize', name: 'Serializing', duration: 1500, Component: Serialize},
    {id: 'Outro', name: 'Outro', duration: 465, Component: Outro},
  ],
};
