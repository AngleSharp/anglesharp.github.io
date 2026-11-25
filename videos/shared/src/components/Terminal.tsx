import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress, typed} from '../anim';
import {tokenColors} from '../highlight';
import {colors, fonts} from '../theme';
import {Window} from './Window';

export type TerminalLine =
  | {type: 'cmd'; text: string; at: number}
  | {type: 'out'; text: string; at: number; color?: string};

/** A terminal that types commands and prints output at given frames. */
export const Terminal: React.FC<{
  lines: TerminalLine[];
  title?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({lines, title = 'bash', fontSize = 28, style}) => {
  const frame = useCurrentFrame();
  const lastCmd = [...lines].reverse().find((l) => l.type === 'cmd' && frame >= l.at);
  const cursorOn = Math.floor(frame / 15) % 2 === 0;

  return (
    <Window title={title} style={style} bodyStyle={{padding: '24px 30px'}}>
      <div style={{fontFamily: fonts.mono, fontSize, lineHeight: 1.6, fontVariantLigatures: 'none'}}>
        {lines.map((line, i) => {
          if (frame < line.at) {
            return null;
          }
          if (line.type === 'cmd') {
            const text = typed(frame, line.at, line.text, 1.4);
            const isTyping = line === lastCmd;
            return (
              <div key={i} style={{whiteSpace: 'pre-wrap'}}>
                <span style={{color: tokenColors.prompt}}>$ </span>
                <span style={{color: colors.text}}>{text}</span>
                {isTyping && cursorOn ? (
                  <span style={{background: colors.brandLight, color: colors.bg}}> </span>
                ) : null}
              </div>
            );
          }
          return (
            <div
              key={i}
              style={{
                whiteSpace: 'pre-wrap',
                color: line.color ?? colors.muted,
                opacity: progress(frame, line.at, 8),
              }}
            >
              {line.text}
            </div>
          );
        })}
      </div>
    </Window>
  );
};
