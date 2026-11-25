import React from 'react';
import {Accent, colors, Heading, Pill, SceneFrame, TutorialOpening, TutorialOutro, useEnter} from '@anglesharp/video-shared';
import {CodeStep} from '../lib/CodeStep';
import {bodyOf} from '../lib/Goal';
import {code, input, out, output} from '../lib/samples';
import type {TutorialDef} from '../lib/tutorial';

const S = '03-styles';

const Opening: React.FC = () => (
  <TutorialOpening
    part={3}
    of={6}
    title={
      <>
        Working with styles: <Accent>AngleSharp.Css</Accent>
      </>
    }
    packages={['AngleSharp', 'AngleSharp.Css']}
    builds="a CSS inliner for HTML emails, because many email clients ignore <style> blocks."
  />
);

/** Renders email HTML at 1.3× inside a white "mail client" pane. */
const Mail: React.FC<{html: string; bodyStyle?: string}> = ({html, bodyStyle}) => (
  <div style={{width: '100%', height: '100%', background: '#ffffff', overflow: 'hidden'}}>
    <div
      style={{width: 640, transform: 'scale(1.25)', transformOrigin: 'top left', fontFamily: 'Times New Roman, serif', color: '#000'}}
    >
      <div style={parseStyle(bodyStyle)} dangerouslySetInnerHTML={{__html: html}} />
    </div>
  </div>
);

const parseStyle = (css?: string): React.CSSProperties =>
  Object.fromEntries(
    (css ?? '')
      .split(';')
      .map((d) => d.split(':').map((x) => x.trim()))
      .filter((d) => d.length === 2 && d[0])
      .map(([k, v]) => [k.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()), v]),
  );

const inlined = output(S, 'output/inlined.html');
const inlinedBodyStyle = inlined.match(/<body style="([^"]*)"/)?.[1];

const Pane: React.FC<{label: string; color: string; at: number; children: React.ReactNode}> = ({label, color, at, children}) => {
  const enter = useEnter(at);
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 14, ...enter}}>
      <div>
        <Pill color={color}>{label}</Pill>
      </div>
      <div style={{width: 800, height: 470, borderRadius: 16, overflow: 'hidden', border: `1px solid ${colors.border}`}}>{children}</div>
    </div>
  );
};

const GoalScene: React.FC = () => (
  <SceneFrame chapter="The goal" index={0}>
    <Heading
      title={
        <>
          Same email, <Accent>styles inlined</Accent>
        </>
      }
      subtitle="The sample's input email, and the inliner's real output."
    />
    <div style={{display: 'flex', justifyContent: 'center', gap: 40}}>
      <Pane label="<style> dropped by the client" color={colors.warn} at={30}>
        <Mail html={bodyOf(input(S, 'input/email.html'))} />
      </Pane>
      <Pane label="styles inlined" color={colors.good} at={100}>
        <Mail html={bodyOf(inlined)} bodyStyle={inlinedBodyStyle} />
      </Pane>
    </div>
  </SceneFrame>
);

const Setup: React.FC = () => (
  <CodeStep
    chapter="Setup"
    index={1}
    title={
      <>
        One package, <Accent>one call</Accent>
      </>
    }
    subtitle="dotnet add package AngleSharp.Css"
    code={code(S, 1)}
    fontSize={23}
    highlights={[
      {lines: [6, 8], from: 100, to: 450},
      {lines: [1, 5], from: 450, to: 800},
    ]}
    notes={[
      {title: 'Core vs. Css', icon: 'C', at: 200, body: 'The core parses selectors. WithCss() adds the CSS parser, the CSSOM and computed styles.'},
      {
        title: 'Pick a viewport',
        icon: '▭',
        at: 500,
        accent: '#ffb454',
        body: 'Media queries are evaluated against the render device. We use 800px, a typical email width.',
      },
    ]}
  />
);

const StyleSheets: React.FC = () => (
  <CodeStep
    chapter="Style sheets as objects"
    index={2}
    title={
      <>
        The <Accent>CSSOM</Accent>, in C#
      </>
    }
    code={code(S, 2)}
    fontSize={21}
    highlights={[
      {lines: [1, 2], from: 100, to: 400},
      {lines: [4, 8], from: 400, to: 800},
      {lines: [10, 12], from: 800, to: 1250},
    ]}
    notes={[
      {title: 'CssParser', icon: 'P', at: 200, body: 'Parses any CSS text into an ICssStyleSheet with typed rules.'},
      {title: 'Find and edit rules', icon: '✎', at: 860, accent: '#b18cff', body: 'GetStyleRuleWith(".button") and SetProperty, then ToCss().'},
    ]}
    output={{lines: out(S, 1, 8), at: 420, times: [460, 470, 480, 490, 500, 510, 520, 940], fontSize: 17}}
  />
);

const Inline: React.FC = () => (
  <CodeStep
    chapter="Inline styles"
    index={3}
    title={
      <>
        <Accent>GetStyle()</Accent> is element.style
      </>
    }
    code={code(S, 3)}
    fontSize={24}
    highlights={[{lines: [2, 2], from: 100, to: 600}]}
    notes={[
      {title: 'Reads and writes the style attribute', icon: '=', at: 220, body: 'Changes are serialized back into style="…" automatically.'},
    ]}
    output={{lines: out(S, 9), at: 300}}
  />
);

const Computed: React.FC = () => (
  <CodeStep
    chapter="Computed styles"
    index={4}
    title={
      <>
        What actually <Accent>applies</Accent>
      </>
    }
    code={code(S, 4)}
    fontSize={23}
    highlights={[
      {lines: [1, 2], from: 100, to: 500},
      {lines: [3, 7], from: 500, to: 1150},
    ]}
    notes={[
      {
        title: 'The whole cascade',
        icon: '↓',
        at: 240,
        body: 'Selectors, specificity, inheritance and defaults: .note gets its color from its class and its font from <body>.',
      },
      {title: 'Typed helpers', icon: 'T', at: 640, accent: '#b18cff', body: 'GetColor(), GetFontSize(), GetDisplay(), …, or GetPropertyValue(name).'},
    ]}
    output={{lines: out(S, 10, 13), at: 520, stagger: 30}}
  />
);

const MediaQueries: React.FC = () => (
  <CodeStep
    chapter="Media queries"
    index={5}
    title={
      <>
        Same document, <Accent>different devices</Accent>
      </>
    }
    code={code(S, 5)}
    fontSize={20}
    lineDelay={4}
    highlights={[
      {lines: [4, 9], from: 100, to: 600},
      {lines: [12, 15], from: 600, to: 1200},
    ]}
    notes={[
      {
        title: 'The default viewport is 0 × 0',
        icon: '!',
        at: 700,
        accent: '#ffb454',
        body: 'Without a device every max-width query matches: you get the mobile styles.',
      },
    ]}
    output={{lines: out(S, 14, 16), at: 560, stagger: 40}}
  />
);

const Which: React.FC = () => (
  <CodeStep
    chapter="The inliner"
    index={6}
    title={
      <>
        Inline only <Accent>what matters</Accent>
      </>
    }
    code={code(S, 6, 1, 15)}
    fontSize={22}
    highlights={[
      {lines: [1, 5], from: 80, to: 400},
      {lines: [6, 13], from: 400, to: 700},
    ]}
    notes={[
      {
        title: 'Keep the output small',
        icon: '≈',
        at: 160,
        body: 'Inherited properties only where they differ from the parent; the rest only where they differ from the initial value.',
      },
    ]}
  />
);

const Loop: React.FC = () => (
  <CodeStep
    chapter="The inliner"
    index={6}
    title={
      <>
        Compute, compare, <Accent>write back</Accent>
      </>
    }
    code={code(S, 6, 16, 39)}
    fontSize={18}
    lineDelay={3}
    highlights={[
      {lines: [2, 5], from: 100, to: 450},
      {lines: [7, 14], from: 450, to: 800},
      {lines: [16, 23], from: 800, to: 1150},
    ]}
    notes={[
      {title: 'Computed in, inline out', icon: '⇄', at: 200, body: 'ComputeCurrentStyle() reads; GetStyle().SetProperty() writes.'},
    ]}
  />
);

const Result: React.FC = () => (
  <CodeStep
    chapter="The inliner"
    index={6}
    title={
      <>
        Drop the <Accent>&lt;style&gt;</Accent>, keep the look
      </>
    }
    code={code(S, 6, 41, 50)}
    fontSize={21}
    highlights={[{lines: [1, 4], from: 100, to: 500}]}
    output={{lines: out(S, 17, 23), at: 420, stagger: 18, fontSize: 17}}
  />
);

const Outro: React.FC = () => (
  <TutorialOutro
    remember={['WithCss()', 'CssParser.ParseStyleSheet', 'GetStyle()', 'ComputeCurrentStyle()', 'WithRenderDevice(…)']}
    sample="03-styles"
    next={
      <>
        XML, SVG and XHTML with <span style={{color: colors.brandLight}}>AngleSharp.Xml</span>
      </>
    }
  />
);

export const tutorial3: TutorialDef = {
  part: 3,
  title: 'Working with styles: AngleSharp.Css',
  scenes: [
    {id: 'Opening', name: 'Opening', duration: 240, Component: Opening},
    {id: 'Goal', name: 'The goal', duration: 750, Component: GoalScene},
    {id: 'Setup', name: 'Setup', duration: 900, Component: Setup},
    {id: 'StyleSheets', name: 'Style sheets as objects', duration: 1350, Component: StyleSheets},
    {id: 'Inline', name: 'Inline styles', duration: 750, Component: Inline},
    {id: 'Computed', name: 'Computed styles', duration: 1350, Component: Computed},
    {id: 'MediaQueries', name: 'Media queries', duration: 1350, Component: MediaQueries},
    {id: 'Which', name: 'Which properties', duration: 750, Component: Which},
    {id: 'Loop', name: 'The loop', duration: 1200, Component: Loop},
    {id: 'Result', name: 'The result', duration: 1050, Component: Result},
    {id: 'Outro', name: 'Outro', duration: 360, Component: Outro},
  ],
};
