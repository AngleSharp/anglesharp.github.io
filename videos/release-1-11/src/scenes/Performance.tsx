import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Accent, BarCompare, type BarCompareRow, colors, fonts, Heading, Pill, progress, SceneFrame, windowed} from '@anglesharp/video-shared';

type Page = {
  tab: string;
  pkg: string;
  compare: [string, string];
  unit: string;
  rows: BarCompareRow[];
  callout: React.ReactNode;
};

// Numbers from the 1.11 release blog post (v2026/content/blog/2026-11-24-anglesharp-v111-release.md).
const pages: Page[] = [
  {
    tab: 'CSS selectors',
    pkg: 'AngleSharp 1.11.0',
    compare: ['1.10.0', '1.11.0'],
    unit: 'µs',
    rows: [
      {label: 'parse 300 simple', before: 311, after: 212},
      {label: 'parse 300 functional', before: 620, after: 355},
      {label: 'p:nth-child(2n+1)', before: 211, after: 51},
      {label: '[class~=tocline2]', before: 150, after: 73, change: -52},
      {label: 'p + p', before: 111, after: 49},
    ],
    callout: (
      <>
        <Accent>:nth-child()</Accent> matching is now four times as fast.
      </>
    ),
  },
  {
    tab: 'CSS render tree',
    pkg: 'AngleSharp.Css 1.6.0',
    compare: ['Css 1.4.0', 'Css 1.6.0'],
    unit: 'ms',
    rows: [
      {label: 'render · Bootstrap', before: 137, after: 43},
      {label: 'render · Yahoo', before: 98, after: 24, change: -76},
      {label: 'load + render · Bootstrap', before: 242, after: 146},
      {label: 'load + render · Yahoo', before: 182, after: 93},
    ],
    callout: (
      <>
        <Accent>3–4× as fast</Accent>, with less than half the memory (33.7 → 14.6 MB).
      </>
    ),
  },
  {
    tab: 'Rendering',
    pkg: 'AngleSharp.Renderer 0.13.0',
    compare: ['before', 'after'],
    unit: 'ms',
    rows: [
      {label: 'dashboard · first frame', before: 329, after: 81},
      {label: '1,500 flex-column rows', before: 349, after: 128},
      {label: '1,500 block rows', before: 165, after: 98},
      {label: 'dashboard · full page', before: 296, after: 281},
    ],
    callout: (
      <>
        The first frame is ready in <Accent>a quarter of the time</Accent>. Same pixels.
      </>
    ),
  },
];

const PER_PAGE = 330;

export const Performance: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.min(pages.length - 1, Math.floor(frame / PER_PAGE));
  return (
    <SceneFrame chapter="Performance" index={4}>
      <Heading
        title={
          <>
            Faster, <Accent>across the stack</Accent>
          </>
        }
      />
      <div style={{display: 'flex', gap: 14, marginBottom: 26}}>
        {pages.map((p, i) => (
          <div
            key={p.tab}
            style={{
              fontSize: 26,
              fontWeight: 600,
              padding: '10px 24px',
              borderRadius: 12,
              color: i === active ? colors.text : colors.faint,
              background: i === active ? colors.accentBg : 'transparent',
              border: `1px solid ${i === active ? `${colors.brandLight}55` : colors.border}`,
              opacity: progress(frame, 10 + i * 8, 14),
            }}
          >
            {i + 1} · {p.tab}
          </div>
        ))}
      </div>
      <div style={{position: 'relative', flex: 1}}>
        {pages.map((page, i) => {
          const from = i * PER_PAGE;
          const to = i === pages.length - 1 ? undefined : from + PER_PAGE + 8;
          const opacity = windowed(frame, from, to, 14);
          if (opacity <= 0) {
            return null;
          }
          return (
            <AbsoluteFill key={page.tab} style={{opacity, display: 'flex', flexDirection: 'column', gap: 26}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                <Pill mono>{page.pkg}</Pill>
                <span style={{fontSize: 24, color: colors.muted}}>lower is better</span>
              </div>
              <BarCompare
                rows={page.rows}
                unit={page.unit}
                start={from + 20}
                stagger={16}
                beforeLabel={page.compare[0]}
                afterLabel={page.compare[1]}
                labelWidth={470}
                barWidth={900}
                fontSize={24}
              />
              <div style={{fontSize: 38, fontWeight: 700, marginTop: 6, opacity: progress(frame, from + 150, 20)}}>{page.callout}</div>
            </AbsoluteFill>
          );
        })}
      </div>
      <div style={{fontSize: 20, color: colors.faint, fontFamily: fonts.sans, opacity: progress(frame, 40, 20)}}>
        Benchmarks on a single machine. Absolute times differ on yours; the relative gains should carry over.
      </div>
    </SceneFrame>
  );
};
