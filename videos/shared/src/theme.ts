import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

const inter = loadInter('normal', {
  weights: ['400', '500', '600', '800'],
  subsets: ['latin'],
});

const mono = loadMono('normal', {
  weights: ['400', '600'],
  subsets: ['latin'],
});

/**
 * Brand colors — kept in sync with the website (v2026/src/styles.css).
 */
export const colors = {
  bg: '#070b14',
  bgElev: '#0c1220',
  bgCode: '#0a0f1b',
  card: 'rgba(148, 178, 230, 0.06)',
  cardStrong: 'rgba(148, 178, 230, 0.1)',
  border: 'rgba(148, 178, 230, 0.16)',
  brandDeep: '#0a6fd1',
  brand: '#1ba1e2',
  brandLight: '#36c5f4',
  accentStrong: '#6ad7fb',
  accentBg: 'rgba(54, 197, 244, 0.12)',
  text: '#e6edf7',
  muted: '#8b9ab3',
  faint: '#56627a',
  good: '#3ddc97',
  warn: '#ffb454',
  bad: '#ff6b6b',
  purple: '#b18cff',
  pink: '#ff7ab6',
} as const;

export const fonts = {
  sans: inter.fontFamily,
  mono: mono.fontFamily,
} as const;

/** Standard video format for all AngleSharp videos. */
export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

/** Safe-area padding for 1920x1080. */
export const SAFE = {
  x: 120,
  y: 100,
} as const;
