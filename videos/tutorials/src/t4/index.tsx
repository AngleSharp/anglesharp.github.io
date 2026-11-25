import React from 'react';
import {Accent, CodeBlock, colors, Terminal, TutorialOpening, TutorialOutro} from '@anglesharp/video-shared';
import {CodeStep} from '../lib/CodeStep';
import {Goal} from '../lib/Goal';
import {code, input, out} from '../lib/samples';
import type {TutorialDef} from '../lib/tutorial';

const S = '04-xml';

const Opening: React.FC = () => (
  <TutorialOpening
    part={4}
    of={6}
    title={
      <>
        XML, SVG and XHTML: <Accent>AngleSharp.Xml</Accent>
      </>
    }
    packages={['AngleSharp', 'AngleSharp.Xml']}
    builds="a small feed reader, plus validation of its XML configuration."
  />
);

const GoalScene: React.FC = () => (
  <Goal
    chapter="The goal"
    title={
      <>
        Read the feed, <Accent>check the config</Accent>
      </>
    }
    subtitle="An Atom feed in, entries out, and precise errors for a broken config file."
    left={
      <CodeBlock
        title="input/feed.xml"
        language="html"
        code={input(S, 'input/feed.xml')}
        fontSize={15}
        lineNumbers={false}
        start={20}
        lineDelay={2}
        style={{width: 720}}
      />
    }
    right={
      <Terminal
        title="output"
        fontSize={18}
        style={{width: 780}}
        lines={[
          {type: 'cmd', text: 'dotnet run', at: 100},
          ...[...out(S, 5, 8), ' ', ...out(S, 14, 16)].map((text, i) => ({
            type: 'out' as const,
            text,
            at: 140 + i * 12,
            color: colors.text,
          })),
        ]}
      />
    }
  />
);

const WhyXml: React.FC = () => (
  <CodeStep
    chapter="Why a second parser"
    index={1}
    title={
      <>
        HTML forgives, <Accent>XML is strict</Accent>
      </>
    }
    code={code(S, 1)}
    fontSize={20}
    lineDelay={4}
    highlights={[
      {lines: [1, 6], from: 100, to: 700},
      {lines: [8, 17], from: 700, to: 1400},
    ]}
    notes={[
      {
        title: 'Case and self-closing tags',
        icon: '<>',
        at: 380,
        body: 'HTML lowercases names and ignores "/>", so <Theme/> swallows the next element. XML keeps both.',
      },
      {
        title: 'Check the content type',
        icon: '!',
        at: 900,
        accent: '#ffb454',
        body: 'WithXml() covers text/xml, application/xml and image/svg+xml. A feed sent as application/atom+xml lands in the HTML parser.',
      },
    ]}
    output={{lines: out(S, 1, 4), at: 300, times: [340, 400, 1000, 1060], fontSize: 16}}
  />
);

const Feed: React.FC = () => (
  <CodeStep
    chapter="Reading a feed"
    index={2}
    title={
      <>
        Same DOM API, <Accent>namespaces</Accent> included
      </>
    }
    code={code(S, 2)}
    fontSize={21}
    highlights={[
      {lines: [1, 4], from: 100, to: 450},
      {lines: [6, 13], from: 450, to: 950},
    ]}
    notes={[
      {
        title: 'Namespaces',
        icon: 'ns',
        at: 300,
        body: 'Atom lives in http://www.w3.org/2005/Atom. GetElementsByTagNameNS matches the namespace exactly.',
      },
    ]}
    output={{lines: out(S, 5, 8), at: 500, stagger: 20}}
  />
);

const Errors: React.FC = () => (
  <CodeStep
    chapter="Errors"
    index={3}
    title={
      <>
        Broken XML <Accent>throws</Accent>, with a position
      </>
    }
    code={code(S, 3, 1, 17)}
    fontSize={20}
    lineDelay={4}
    highlights={[
      {lines: [1, 9], from: 100, to: 500},
      {lines: [11, 17], from: 500, to: 950},
    ]}
    notes={[
      {
        title: 'Well-formed or nothing',
        icon: '✗',
        at: 260,
        accent: '#ff6b6b',
        body: 'The <theme> element is never closed, so parsing stops with an XmlParseException.',
      },
      {title: 'Or keep going', icon: '~', at: 600, body: 'IsSuppressingErrors returns what could be built.'},
    ]}
    output={{lines: out(S, 9, 10), at: 300, times: [360, 700], fontSize: 16}}
  />
);

const SourceReferences: React.FC = () => (
  <CodeStep
    chapter="Errors"
    index={3}
    title={
      <>
        Keep <Accent>line numbers</Accent> for your messages
      </>
    }
    code={code(S, 3, 19, 28)}
    fontSize={22}
    highlights={[
      {lines: [1, 4], from: 80, to: 350},
      {lines: [6, 10], from: 350, to: 650},
    ]}
    output={{lines: out(S, 11, 13), at: 360, stagger: 15}}
  />
);

const Validation: React.FC = () => (
  <CodeStep
    chapter="Validation"
    index={4}
    title={
      <>
        Validate against an <Accent>XSD</Accent>
      </>
    }
    code={code(S, 4)}
    fontSize={23}
    highlights={[{lines: [1, 7], from: 100, to: 900}]}
    notes={[
      {title: 'ValidateXsd(schema)', icon: '✓', at: 220, accent: '#3ddc97', body: 'Returns IsValid and a list of diagnostics with line numbers.'},
    ]}
    output={{lines: out(S, 14, 16), at: 360, stagger: 30, fontSize: 16}}
  />
);

const SvgXhtml: React.FC = () => (
  <CodeStep
    chapter="SVG and XHTML"
    index={5}
    title={
      <>
        <Accent>SVG</Accent> in, <Accent>XHTML</Accent> out
      </>
    }
    code={code(S, 5)}
    fontSize={20}
    highlights={[
      {lines: [1, 5], from: 100, to: 450},
      {lines: [7, 11], from: 450, to: 820},
    ]}
    output={{lines: out(S, 17, 21), at: 300, times: [340, 370, 400, 600, 640], fontSize: 16}}
  />
);

const Outro: React.FC = () => (
  <TutorialOutro
    remember={['XmlParser', 'WithXml()', 'GetElementsByTagNameNS', 'XmlParseException', 'ValidateXsd()']}
    sample="04-xml"
    next={
      <>
        real-world browsing with <span style={{color: colors.brandLight}}>AngleSharp.Io</span>
      </>
    }
  />
);

export const tutorial4: TutorialDef = {
  part: 4,
  title: 'XML, SVG and XHTML: AngleSharp.Xml',
  scenes: [
    {id: 'Opening', name: 'Opening', duration: 240, Component: Opening},
    {id: 'Goal', name: 'The goal', duration: 540, Component: GoalScene},
    {id: 'WhyXml', name: 'Why a second parser', duration: 1500, Component: WhyXml},
    {id: 'Feed', name: 'Reading a feed', duration: 1050, Component: Feed},
    {id: 'Errors', name: 'Errors', duration: 990, Component: Errors},
    {id: 'SourceReferences', name: 'Line numbers', duration: 720, Component: SourceReferences},
    {id: 'Validation', name: 'Validation', duration: 990, Component: Validation},
    {id: 'SvgXhtml', name: 'SVG and XHTML', duration: 870, Component: SvgXhtml},
    {id: 'Outro', name: 'Outro', duration: 420, Component: Outro},
  ],
};
