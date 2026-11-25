import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress} from '../anim';
import {colors, fonts} from '../theme';

export type BarCompareRow = {
  label: React.ReactNode;
  before: number;
  after: number;
  /** Relative change in percent, if it should not be derived from the rounded values. */
  change?: number;
};

/**
 * Before/after benchmark bars (lower is better). Each row grows its "before"
 * bar first, then the "after" bar, then shows the relative change.
 */
export const BarCompare: React.FC<{
  rows: BarCompareRow[];
  unit: string;
  start?: number;
  stagger?: number;
  beforeLabel?: string;
  afterLabel?: string;
  labelWidth?: number;
  barWidth?: number;
  fontSize?: number;
}> = ({
  rows,
  unit,
  start = 0,
  stagger = 18,
  beforeLabel = 'before',
  afterLabel = 'after',
  labelWidth = 520,
  barWidth = 820,
  fontSize = 26,
}) => {
  const frame = useCurrentFrame();
  const max = Math.max(...rows.flatMap((r) => [r.before, r.after]));
  const legend = progress(frame, start, 15);
  const barHeight = Math.round(fontSize * 1.15);

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: Math.round(fontSize * 0.9)}}>
      <div style={{display: 'flex', gap: 28, paddingLeft: labelWidth, fontSize: fontSize * 0.8, color: colors.muted, opacity: legend}}>
        <span style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <span style={{width: 18, height: 18, borderRadius: 4, background: colors.faint}} />
          {beforeLabel}
        </span>
        <span style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <span style={{width: 18, height: 18, borderRadius: 4, background: colors.brandLight}} />
          {afterLabel}
        </span>
      </div>
      {rows.map((row, i) => {
        const at = start + 10 + i * stagger;
        const pBefore = progress(frame, at, 20);
        const pAfter = progress(frame, at + 16, 24);
        const pDelta = progress(frame, at + 36, 14);
        const change = row.change ?? Math.round(((row.after - row.before) / row.before) * 100);
        const good = change <= -5;
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', opacity: progress(frame, at, 10)}}>
            <div
              style={{
                width: labelWidth,
                paddingRight: 28,
                boxSizing: 'border-box',
                fontFamily: fonts.mono,
                fontSize: fontSize * 0.92,
                color: colors.text,
                fontVariantLigatures: 'none',
              }}
            >
              {row.label}
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 6, width: barWidth}}>
              {[
                {value: row.before, p: pBefore, color: colors.faint, text: colors.muted},
                {value: row.after, p: pAfter, color: colors.brandLight, text: colors.text},
              ].map((bar, j) => (
                <div key={j} style={{display: 'flex', alignItems: 'center', gap: 14}}>
                  <div
                    style={{
                      height: barHeight,
                      width: Math.max(4, (bar.value / max) * (barWidth - 190) * bar.p),
                      borderRadius: 6,
                      background: bar.color,
                    }}
                  />
                  <span style={{fontFamily: fonts.mono, fontSize: fontSize * 0.8, color: bar.text, opacity: bar.p}}>
                    {bar.value.toLocaleString('en-US')} {unit}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                minWidth: 120,
                textAlign: 'right',
                fontSize: fontSize * 1.1,
                fontWeight: 800,
                color: good ? colors.good : colors.muted,
                opacity: pDelta,
              }}
            >
              {change > 0 ? '+' : change < 0 ? '−' : '±'}
              {Math.abs(change)}%
            </div>
          </div>
        );
      })}
    </div>
  );
};
