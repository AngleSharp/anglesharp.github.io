import React from 'react';
import {colors, fonts} from '../theme';

/** A window with "traffic light" chrome — used for code, terminals and app mocks. */
export const Window: React.FC<{
  title?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  accent?: string;
}> = ({title, children, style, bodyStyle, accent}) => (
  <div
    style={{
      background: colors.bgCode,
      border: `1px solid ${accent ?? colors.border}`,
      borderRadius: 18,
      boxShadow: '0 30px 80px rgba(0, 0, 0, 0.45)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
  >
    <div
      style={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 20px',
        borderBottom: `1px solid ${colors.border}`,
        background: 'rgba(148, 178, 230, 0.04)',
        flexShrink: 0,
      }}
    >
      {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
        <span key={c} style={{width: 14, height: 14, borderRadius: 7, background: c, opacity: 0.85}} />
      ))}
      {title ? (
        <span
          style={{
            marginLeft: 14,
            fontFamily: fonts.mono,
            fontSize: 20,
            color: colors.muted,
          }}
        >
          {title}
        </span>
      ) : null}
    </div>
    <div style={{flex: 1, position: 'relative', ...bodyStyle}}>{children}</div>
  </div>
);
