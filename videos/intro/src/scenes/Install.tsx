import React from 'react';
import {Accent, CodeBlock, colors, Heading, Pill, SceneFrame, Terminal, useEnter} from '@anglesharp/video-shared';

export const Install: React.FC = () => {
  const pills = useEnter(660);
  return (
    <SceneFrame chapter="Getting started" index={4}>
      <Heading
        title={
          <>
            Adding AngleSharp to a <Accent>project</Accent>
          </>
        }
        subtitle="One NuGet package. No native dependencies."
      />
      <div style={{display: 'flex', gap: 36, alignItems: 'flex-start'}}>
        <Terminal
          style={{width: 720}}
          fontSize={23}
          lines={[
            {type: 'cmd', text: 'dotnet new console -n Demo', at: 30},
            {type: 'out', text: 'The template "Console App" was created successfully.', at: 80},
            {type: 'cmd', text: 'cd Demo', at: 110},
            {type: 'cmd', text: 'dotnet add package AngleSharp', at: 140},
            {
              type: 'out',
              text: "info : PackageReference for package 'AngleSharp' added to 'Demo.csproj'.",
              at: 200,
              color: colors.good,
            },
            {type: 'cmd', text: 'dotnet run', at: 540},
            {type: 'out', text: 'Hello, AngleSharp!', at: 580, color: colors.text},
          ]}
        />
        <CodeBlock
          title="Program.cs"
          language="csharp"
          start={260}
          lineDelay={18}
          fontSize={23}
          lineNumbers={false}
          style={{flex: 1}}
          highlights={[
            {lines: [3, 4], from: 420, to: 500},
            {lines: [5, 6], from: 500, to: 580},
            {lines: [8, 8], from: 580, to: 680},
          ]}
          code={`
using AngleSharp;

var config = Configuration.Default;
var context = BrowsingContext.New(config);
var document = await context.OpenAsync(req =>
    req.Content("<h1>Hello, AngleSharp!</h1>"));

Console.WriteLine(document.QuerySelector("h1")?.TextContent);
`}
        />
      </div>
      <div style={{display: 'flex', gap: 16, marginTop: 'auto', ...pills}}>
        {['netstandard2.0', 'net8.0', 'net10.0'].map((t) => (
          <Pill key={t} mono>
            {t}
          </Pill>
        ))}
        <Pill color={colors.good}>MIT licensed</Pill>
        <Pill color={colors.purple}>Windows · Linux · macOS · WASM · mobile</Pill>
      </div>
    </SceneFrame>
  );
};
