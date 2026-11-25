import React from 'react';
import {colors, fonts} from '../theme';

export const Pill: React.FC<{
  children: React.ReactNode;
  color?: string;
  mono?: boolean;
  style?: React.CSSProperties;
}> = ({children, color = colors.brandLight, mono = false, style}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 20px',
      borderRadius: 999,
      fontSize: 24,
      fontWeight: 600,
      fontFamily: mono ? fonts.mono : undefined,
      color,
      background: `${color}1a`,
      border: `1px solid ${color}55`,
      ...style,
    }}
  >
    {children}
  </span>
);

/** Inline code span. */
export const Code: React.FC<{children: React.ReactNode; color?: string}> = ({
  children,
  color = colors.accentStrong,
}) => (
  <code
    style={{
      fontFamily: fonts.mono,
      fontSize: '0.86em',
      color,
      background: 'rgba(148, 178, 230, 0.1)',
      padding: '0.08em 0.35em',
      borderRadius: 8,
    }}
  >
    {children}
  </code>
);
