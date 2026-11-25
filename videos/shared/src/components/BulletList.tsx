import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress} from '../anim';
import {colors} from '../theme';

/** Bullets that appear one after another. */
export const BulletList: React.FC<{
  items: React.ReactNode[];
  start?: number;
  stagger?: number;
  fontSize?: number;
  gap?: number;
  marker?: React.ReactNode;
}> = ({items, start = 0, stagger = 30, fontSize = 40, gap = 30, marker}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap}}>
      {items.map((item, i) => {
        const p = progress(frame, start + i * stagger, 20);
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 24,
              fontSize,
              lineHeight: 1.3,
              opacity: p,
              translate: `${(1 - p) * -24}px 0px`,
            }}
          >
            <span
              style={{
                flexShrink: 0,
                marginTop: fontSize * 0.42,
                width: fontSize * 0.42,
                height: fontSize * 0.42,
                borderRadius: 6,
                background: colors.brandLight,
                rotate: '45deg',
                display: marker ? 'none' : 'block',
              }}
            />
            {marker}
            <span>{item}</span>
          </div>
        );
      })}
    </div>
  );
};
