import React from 'react';
import {Accent, Card, Code, colors, Heading, SceneFrame, useEnter} from '@anglesharp/video-shared';

const cases = [
  {
    icon: '</>',
    title: 'Scraping & extraction',
    text: 'Pull structured data out of web pages with CSS selectors.',
    accent: colors.brandLight,
  },
  {
    icon: '#',
    title: 'Sanitizing & rewriting',
    text: 'Clean user HTML, rewrite links, strip or inline styles.',
    accent: colors.good,
  },
  {
    icon: '==',
    title: 'Testing markup',
    text: 'Assert on rendered output — e.g. Blazor components via bUnit.',
    accent: colors.purple,
  },
  {
    icon: '{}',
    title: 'Generating documents',
    text: 'Build HTML, SVG or XML in code and serialize it reliably.',
    accent: colors.warn,
  },
  {
    icon: 'js',
    title: 'Headless browsing',
    text: 'Cookies, forms, navigation and scripts — without a browser.',
    accent: colors.pink,
  },
  {
    icon: 'a11y',
    title: 'Analysis & auditing',
    text: 'Check SEO, accessibility or broken links across whole sites.',
    accent: colors.brand,
  },
];

export const UseCases: React.FC = () => {
  const note = useEnter(780);
  return (
    <SceneFrame chapter="When is it useful?" index={2}>
      <Heading
        title={
          <>
            When is AngleSharp <Accent>useful</Accent>?
          </>
        }
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 28,
        }}
      >
        {cases.map((c, i) => (
          <Card
            key={c.title}
            icon={c.icon}
            title={c.title}
            accent={c.accent}
            delay={60 + i * 90}
            style={{padding: '28px 32px'}}
          >
            {c.text}
          </Card>
        ))}
      </div>
      <div
        style={{
          marginTop: 'auto',
          padding: '22px 32px',
          borderRadius: 18,
          border: `1px dashed ${colors.border}`,
          fontSize: 32,
          color: colors.muted,
          ...note,
        }}
      >
        <span style={{color: colors.warn, fontWeight: 700}}>Not the right tool</span> for
        pixel-perfect screenshots of arbitrary websites — that's what <Code>Playwright</Code> and real
        browsers are for.
      </div>
    </SceneFrame>
  );
};
