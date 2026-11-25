import React from 'react';
import {
  Card,
  CodeBlock,
  type CodeHighlight,
  colors,
  Heading,
  type Language,
  SceneFrame,
  Terminal,
  type TerminalLine,
} from '@anglesharp/video-shared';

export type StepNote = {
  title: React.ReactNode;
  body?: React.ReactNode;
  icon: string;
  at: number;
  accent?: string;
};

export type StepOutput = {
  lines: string[];
  at: number;
  /** Frames between output lines. */
  stagger?: number;
  /** Exact frame per output line (overrides `at`/`stagger` for the lines). */
  times?: number[];
  /** Typed before the output; null for none. */
  command?: string | null;
  title?: string;
  fontSize?: number;
};

/**
 * The standard tutorial step: heading, code from the sample on the left,
 * notes and the real console output on the right.
 */
export const CodeStep: React.FC<{
  chapter: string;
  index: number;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  code: string;
  language?: Language;
  file?: string;
  codeStart?: number;
  lineDelay?: number;
  highlights?: CodeHighlight[];
  fontSize?: number;
  codeWidth?: number;
  output?: StepOutput;
  notes?: StepNote[];
  side?: React.ReactNode;
}> = ({
  chapter,
  index,
  title,
  subtitle,
  code,
  language = 'csharp',
  file = 'Program.cs',
  codeStart = 30,
  lineDelay = 6,
  highlights,
  fontSize = 21,
  codeWidth,
  output,
  notes = [],
  side,
}) => {
  const longest = Math.max(...code.split('\n').map((l) => l.length));
  const width = codeWidth ?? Math.min(1060, Math.max(620, Math.round(longest * fontSize * 0.6 + fontSize * 2.4 + 70)));
  const terminal: TerminalLine[] = output
    ? [
        ...(output.command === null ? [] : [{type: 'cmd' as const, text: output.command ?? 'dotnet run', at: output.at}]),
        ...output.lines.map((text, i) => ({
          type: 'out' as const,
          text: text.length === 0 ? ' ' : text,
          at: output.times?.[i] ?? output.at + (output.command === null ? 0 : 30) + i * (output.stagger ?? 5),
          color: colors.text,
        })),
      ]
    : [];

  return (
    <SceneFrame chapter={chapter} index={index}>
      <Heading title={title} subtitle={subtitle} />
      <div style={{display: 'flex', gap: 36, alignItems: 'flex-start', minHeight: 0}}>
        <CodeBlock
          title={file}
          language={language}
          code={code}
          start={codeStart}
          lineDelay={lineDelay}
          highlights={highlights}
          fontSize={fontSize}
          style={{width, flexShrink: 0}}
        />
        <div style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18}}>
          {side}
          {notes.map((n, i) => (
            <Card key={i} compact title={n.title} icon={n.icon} delay={n.at} accent={n.accent}>
              {n.body}
            </Card>
          ))}
          {output ? <Terminal title={output.title ?? 'output'} fontSize={output.fontSize ?? 19} lines={terminal} /> : null}
        </div>
      </div>
    </SceneFrame>
  );
};
