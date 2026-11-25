import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Accent, CodeBlock, colors, fonts, Heading, progress, SceneFrame} from '@anglesharp/video-shared';

const extensions = ['Css', 'Js', 'Xml', 'Io', 'XPath', 'Wasm', 'Renderer'];
const tooling = ['AngleSharp.Diffing', 'AngleSharp.Browser'];

const Box: React.FC<{
  children: React.ReactNode;
  at: number;
  color: string;
  style?: React.CSSProperties;
}> = ({children, at, color, style}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, at, 20);
  return (
    <div
      style={{
        flex: 1,
        padding: '22px 20px',
        borderRadius: 16,
        border: `1px solid ${color}66`,
        background: `${color}14`,
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 600,
        opacity: p,
        translate: `0px ${(1 - p) * 24}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const RowLabel: React.FC<{children: React.ReactNode; at: number}> = ({children, at}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width: 200,
        flexShrink: 0,
        fontSize: 22,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: colors.muted,
        opacity: progress(frame, at, 20),
      }}
    >
      {children}
    </div>
  );
};

export const Ecosystem: React.FC = () => {
  return (
    <SceneFrame chapter="The ecosystem" index={5}>
      <Heading
        title={
          <>
            A lean core — <Accent>everything else is opt-in</Accent>
          </>
        }
      />
      <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <RowLabel at={330}>Tooling</RowLabel>
          {tooling.map((t, i) => (
            <Box key={t} at={330 + i * 20} color={colors.purple}>
              {t}
            </Box>
          ))}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <RowLabel at={150}>Extensions</RowLabel>
          {extensions.map((e, i) => (
            <Box key={e} at={150 + i * 18} color={colors.brandLight} style={{fontSize: 26}}>
              <span style={{color: colors.muted, fontSize: 20, display: 'block'}}>AngleSharp.</span>
              {e}
            </Box>
          ))}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <RowLabel at={50}>Core</RowLabel>
          <Box at={50} color={colors.brandDeep} style={{padding: '28px 20px'}}>
            <div style={{fontSize: 38, fontWeight: 800}}>AngleSharp</div>
            <div style={{fontSize: 24, color: colors.muted, fontWeight: 400, marginTop: 6, fontFamily: fonts.mono}}>
              HTML5 parser · DOM · CSS selectors · URL & MIME · Configuration · BrowsingContext
            </div>
          </Box>
        </div>
      </div>
      <CodeBlock
        title="Plugging in extensions"
        language="csharp"
        start={480}
        fontSize={30}
        lineNumbers={false}
        style={{marginTop: 'auto'}}
        code={`var config = Configuration.Default.WithCss().WithJs().WithDefaultLoader();`}
      />
    </SceneFrame>
  );
};
