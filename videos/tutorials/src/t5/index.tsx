import React from 'react';
import {Accent, colors, Heading, NetworkLog, Pill, SceneFrame, TutorialOpening, TutorialOutro, useEnter} from '@anglesharp/video-shared';
import {CodeStep} from '../lib/CodeStep';
import {block, code, out} from '../lib/samples';
import type {TutorialDef} from '../lib/tutorial';

const S = '05-browsing';

const Opening: React.FC = () => (
  <TutorialOpening
    part={5}
    of={6}
    title={
      <>
        Real-world browsing: <Accent>AngleSharp.Io</Accent>
      </>
    }
    packages={['AngleSharp', 'AngleSharp.Io']}
    builds="a browsing session with headers, cookies, forms and redirects, then the same flow as an offline test."
  />
);

/** The requests the sample makes, with the status codes the test site answers. */
const GoalScene: React.FC = () => {
  const site = useEnter(20);
  return (
    <SceneFrame chapter="The goal" index={0}>
      <Heading
        title={
          <>
            A session against a <Accent>real server</Accent>
          </>
        }
        subtitle="AngleSharp.Infrastructure.TestSite: the site the AngleSharp integration tests use."
      />
      <div style={{display: 'flex', gap: 14, marginBottom: 22, ...site}}>
        <Pill mono>npm run dev</Pill>
        <Pill mono color={colors.good}>
          http://localhost:8080
        </Pill>
      </div>
      <NetworkLog
        fontSize={23}
        entries={[
          {method: 'GET', url: '/test-cases/user-agent', status: 200, note: 'echoes the User-Agent', at: 60},
          {method: 'GET', url: '/test-cases/set-cookies?session=abc123', status: 302, note: 'Set-Cookie', at: 100},
          {method: 'GET', url: '/test-cases/get-cookies', status: 200, note: 'Cookie: session=abc123', at: 130},
          {method: 'GET', url: '/PostUrlencodeNormal', status: 200, note: 'the form', at: 180},
          {method: 'POST', url: '/PostUrlencodeNormal', status: 200, note: '"okay"', at: 220},
          {method: 'GET', url: '/test-cases/redirect?url=/test-cases/status/404', status: 302, at: 270},
          {method: 'GET', url: '/test-cases/status/404', status: 404, at: 300},
        ]}
      />
    </SceneFrame>
  );
};

const Requesters: React.FC = () => (
  <CodeStep
    chapter="Requesters"
    index={1}
    title={
      <>
        Who's asking? <Accent>Requesters</Accent>
      </>
    }
    subtitle="dotnet add package AngleSharp.Io"
    code={code(S, 1)}
    fontSize={21}
    highlights={[
      {lines: [1, 2], from: 100, to: 450},
      {lines: [4, 5], from: 450, to: 850},
      {lines: [7, 13], from: 850, to: 1500},
    ]}
    notes={[
      {title: 'WithRequesters()', icon: 'IO', at: 500, body: 'HttpClient-based, with handlers for proxies, certificates and decompression.'},
      {
        title: 'It sends no User-Agent',
        icon: '!',
        at: 700,
        accent: '#ffb454',
        body: 'Many sites reject that. Bring your own HttpClient and name your bot.',
      },
    ]}
    output={{lines: out(S, 1, 3), at: 300, times: [360, 760, 1200], fontSize: 17}}
  />
);

const Cookies: React.FC = () => (
  <CodeStep
    chapter="Cookies"
    index={2}
    title={
      <>
        Staying <Accent>logged in</Accent>
      </>
    }
    code={code(S, 2)}
    fontSize={19}
    lineDelay={4}
    highlights={[
      {lines: [1, 2], from: 100, to: 450},
      {lines: [4, 11], from: 450, to: 1050},
      {lines: [13, 20], from: 1050, to: 1700},
    ]}
    notes={[
      {title: 'WithTemporaryCookies()', icon: 'C', at: 560, body: 'An in-memory cookie jar: the redirect to get-cookies already sends the session back.'},
      {
        title: 'Session cookies stay in memory',
        icon: '!',
        at: 1150,
        accent: '#ffb454',
        body: 'WithPersistentCookies(file) writes only cookies with Expires or Max-Age, just like a browser.',
      },
    ]}
    output={{lines: out(S, 4, 7), at: 300, times: [340, 800, 840, 1300], fontSize: 16}}
  />
);

const Forms: React.FC = () => (
  <CodeStep
    chapter="Forms"
    index={3}
    title={
      <>
        Fill in, <Accent>SubmitAsync()</Accent>
      </>
    }
    code={`${code(S, 3)}\n\n${block(S, 'static async Task<IDocument> SubmitAsync(')}`}
    fontSize={19}
    lineDelay={4}
    highlights={[
      {lines: [1, 4], from: 100, to: 500},
      {lines: [6, 16], from: 500, to: 1200},
      {lines: [15, 15], from: 1200, to: 1550},
    ]}
    notes={[
      {title: 'Form elements by name', icon: 'F', at: 600, body: 'form.Elements["Name"] is an IHtmlInputElement: set Value or IsChecked.'},
      {
        title: 'Check the status code',
        icon: '#',
        at: 1250,
        accent: '#b18cff',
        body: 'A failed submit is still a document. document.StatusCode tells you 200 or 400.',
      },
    ]}
    output={{lines: out(S, 8, 9), at: 300, times: [360, 420]}}
  />
);

const Redirects: React.FC = () => (
  <CodeStep
    chapter="Redirects and status codes"
    index={4}
    title={
      <>
        Where did we <Accent>end up</Accent>?
      </>
    }
    code={code(S, 4)}
    fontSize={22}
    highlights={[{lines: [1, 4], from: 100, to: 700}]}
    notes={[
      {title: 'Redirects are followed', icon: '↪', at: 240, body: 'document.Url is the final address; StatusCode belongs to the last response.'},
    ]}
    output={{lines: out(S, 10, 11), at: 360, stagger: 20}}
  />
);

const Offline: React.FC = () => (
  <CodeStep
    chapter="Offline tests"
    index={5}
    title={
      <>
        Same flow, <Accent>no network</Accent>
      </>
    }
    code={code(S, 5)}
    fontSize={20}
    lineDelay={4}
    highlights={[
      {lines: [1, 10], from: 100, to: 700},
      {lines: [11, 13], from: 700, to: 1100},
      {lines: [14, 16], from: 1100, to: 1650},
    ]}
    notes={[
      {
        title: 'Your own IRequester',
        icon: 'R',
        at: 260,
        body: 'CannedRequester derives from BaseRequester and answers from a dictionary. About 30 lines in the sample.',
      },
      {title: 'Register it with With(…)', icon: '+', at: 760, accent: '#b18cff', body: 'The loader uses it for every request, including the form POST.'},
    ]}
    output={{lines: out(S, 12, 13), at: 1150, stagger: 30, fontSize: 17}}
  />
);

const Citizen: React.FC = () => (
  <CodeStep
    chapter="Being a good citizen"
    index={6}
    title={
      <>
        Scrape <Accent>politely</Accent>
      </>
    }
    code={code(S, 6)}
    fontSize={23}
    highlights={[{lines: [1, 2], from: 100, to: 500}]}
    notes={[
      {title: 'Respect robots.txt', icon: 'R', at: 200, body: 'It is just another document: load it and honor Disallow.'},
      {title: 'Slow down', icon: 't', at: 360, accent: '#ffb454', body: 'Add delays, cache responses, and identify yourself with a User-Agent.'},
      {title: 'Read the terms', icon: '§', at: 520, accent: '#b18cff', body: 'Prefer an official API or feed when the site offers one.'},
    ]}
    output={{lines: out(S, 14), at: 280}}
  />
);

const Outro: React.FC = () => (
  <TutorialOutro
    remember={['WithRequesters()', 'WithTemporaryCookies()', 'form.SubmitAsync()', 'document.StatusCode', 'BaseRequester']}
    sample="05-browsing"
    next={
      <>
        from HTML to pixels with <span style={{color: colors.brandLight}}>AngleSharp.Renderer</span>
      </>
    }
  />
);

export const tutorial5: TutorialDef = {
  part: 5,
  title: 'Real-world browsing: AngleSharp.Io',
  scenes: [
    {id: 'Opening', name: 'Opening', duration: 240, Component: Opening},
    {id: 'Goal', name: 'The goal', duration: 510, Component: GoalScene},
    {id: 'Requesters', name: 'Requesters', duration: 1650, Component: Requesters},
    {id: 'Cookies', name: 'Cookies', duration: 1800, Component: Cookies},
    {id: 'Forms', name: 'Forms', duration: 1650, Component: Forms},
    {id: 'Redirects', name: 'Redirects and status codes', duration: 1050, Component: Redirects},
    {id: 'Offline', name: 'Offline tests', duration: 1800, Component: Offline},
    {id: 'Citizen', name: 'Being a good citizen', duration: 900, Component: Citizen},
    {id: 'Outro', name: 'Outro', duration: 420, Component: Outro},
  ],
};
