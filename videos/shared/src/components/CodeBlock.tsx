import React, {useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {progress} from '../anim';
import {type Language, tokenColors, tokenizeLines} from '../highlight';
import {colors, fonts} from '../theme';
import {Window} from './Window';

export type CodeHighlight = {
  /** 1-based, inclusive line range. */
  lines: [number, number];
  from: number;
  to?: number;
};

/**
 * Syntax highlighted code in a window. Lines can be revealed one after the
 * other (`lineDelay`) and ranges can be spotlighted over time (`highlights`).
 */
export const CodeBlock: React.FC<{
  code: string;
  language: Language;
  title?: string;
  start?: number;
  lineDelay?: number;
  highlights?: CodeHighlight[];
  fontSize?: number;
  style?: React.CSSProperties;
  lineNumbers?: boolean;
  accent?: string;
}> = ({
  code,
  language,
  title,
  start = 0,
  lineDelay = 0,
  highlights = [],
  fontSize = 28,
  style,
  lineNumbers = true,
  accent,
}) => {
  const frame = useCurrentFrame();
  const lines = useMemo(() => tokenizeLines(code.replace(/^\n|\n\s*$/g, ''), language), [code, language]);

  const active = highlights.find(
    (h) => frame >= h.from && (h.to === undefined || frame < h.to),
  );
  const spot = active
    ? Math.min(
        progress(frame, active.from, 12),
        active.to === undefined ? 1 : 1 - progress(frame, active.to - 12, 12),
      )
    : 0;

  return (
    <Window title={title} style={style} accent={accent} bodyStyle={{padding: '24px 0'}}>
      <div style={{fontFamily: fonts.mono, fontSize, lineHeight: 1.55, fontVariantLigatures: 'none'}}>
        {lines.map((tokens, i) => {
          const lineNo = i + 1;
          const reveal = progress(frame, start + i * lineDelay, 12);
          const inSpot = active && lineNo >= active.lines[0] && lineNo <= active.lines[1];
          const dim = active && !inSpot ? 1 - spot * 0.6 : 1;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                whiteSpace: 'pre',
                padding: '0 28px 0 0',
                opacity: reveal * dim,
                translate: `${(1 - reveal) * 16}px 0px`,
                background: inSpot ? `rgba(54, 197, 244, ${0.1 * spot})` : 'transparent',
                boxShadow: inSpot ? `inset 4px 0 0 rgba(54, 197, 244, ${spot})` : 'none',
              }}
            >
              {lineNumbers ? (
                <span
                  style={{
                    width: fontSize * 2.4,
                    textAlign: 'right',
                    paddingRight: fontSize * 0.9,
                    color: colors.faint,
                    flexShrink: 0,
                  }}
                >
                  {lineNo}
                </span>
              ) : (
                <span style={{width: 28, flexShrink: 0}} />
              )}
              <span>
                {tokens.map((t, j) => (
                  <span key={j} style={{color: tokenColors[t.kind]}}>
                    {t.text}
                  </span>
                ))}
                {tokens.length === 0 ? ' ' : null}
              </span>
            </div>
          );
        })}
      </div>
    </Window>
  );
};
