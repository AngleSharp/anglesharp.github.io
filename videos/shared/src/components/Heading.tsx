import React from 'react';
import {useEnter} from '../anim';
import {colors} from '../theme';

export const Heading: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  delay?: number;
  size?: number;
}> = ({title, subtitle, delay = 0, size = 76}) => {
  const t = useEnter(delay);
  const s = useEnter(delay + 8);
  return (
    <div style={{marginBottom: 48}}>
      <div
        style={{
          fontSize: size,
          fontWeight: 800,
          letterSpacing: '-0.025em',
          lineHeight: 1.08,
          ...t,
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            marginTop: 18,
            fontSize: 36,
            color: colors.muted,
            lineHeight: 1.35,
            maxWidth: 1400,
            ...s,
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
};

/** Inline brand-colored emphasis. */
export const Accent: React.FC<{children: React.ReactNode; color?: string}> = ({
  children,
  color = colors.brandLight,
}) => <span style={{color}}>{children}</span>;
