import React from 'react';
import {useEnter} from '../anim';
import {colors, fonts} from '../theme';

/**
 * A content card with an optional icon/badge, title and body.
 * `compact` puts the icon next to the title and shrinks everything, for
 * stacking several cards next to a code block.
 */
export const Card: React.FC<{
  title: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  delay?: number;
  accent?: string;
  compact?: boolean;
  style?: React.CSSProperties;
}> = ({title, children, icon, delay = 0, accent = colors.brandLight, compact = false, style}) => {
  const enter = useEnter(delay);
  const iconSize = compact ? 48 : 64;
  const iconBox = icon ? (
    <div
      style={{
        minWidth: iconSize,
        height: iconSize,
        padding: '0 10px',
        boxSizing: 'border-box',
        alignSelf: 'flex-start',
        flexShrink: 0,
        borderRadius: compact ? 12 : 16,
        background: `${accent}1f`,
        color: accent,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: compact ? 26 : 34,
        fontFamily: fonts.mono,
        fontWeight: 600,
      }}
    >
      {icon}
    </div>
  ) : null;
  const titleEl = <div style={{fontSize: compact ? 32 : 40, fontWeight: 700, letterSpacing: '-0.01em'}}>{title}</div>;

  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: compact ? 18 : 22,
        padding: compact ? '22px 26px' : '34px 36px',
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 10 : 14,
        ...enter,
        ...style,
      }}
    >
      {compact ? (
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          {iconBox}
          {titleEl}
        </div>
      ) : (
        <>
          {iconBox}
          {titleEl}
        </>
      )}
      {children ? (
        <div style={{fontSize: compact ? 25 : 30, color: colors.muted, lineHeight: 1.4}}>{children}</div>
      ) : null}
    </div>
  );
};
