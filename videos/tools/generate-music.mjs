#!/usr/bin/env node
/**
 * Procedural ambient background music for the AngleSharp videos.
 *
 * No npm dependencies: the audio is synthesized in plain JS and encoded with
 * ffmpeg (must be on PATH). The output is deterministic for a given seed, so
 * the file can always be regenerated instead of hunting for the original.
 *
 *   node tools/generate-music.mjs --duration 480 --out intro/public/music.mp3
 *
 * Layers: a slow, warm chord pad (D major, 8 chord loop), a soft sub bass, sparse
 * bell notes with a ping-pong delay, a breath of filtered noise, and a large
 * reverb. Everything is kept low-passed and slow so it stays out of the way of
 * a voice.
 */
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {parseArgs} from 'node:util';

const {values: args} = parseArgs({
  options: {
    duration: {type: 'string', default: '480'}, // seconds
    seed: {type: 'string', default: '2026'},
    chord: {type: 'string', default: '8'}, // seconds per chord
    lufs: {type: 'string', default: '-18'}, // loudness of the master file
    out: {type: 'string', default: 'music.mp3'},
  },
});

const SR = 44100;
const DURATION = Number(args.duration);
const CHORD = Number(args.chord);
const N = Math.ceil(DURATION * SR);

// ---------------------------------------------------------------- helpers

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(Number(args.seed));
const range = (a, b) => a + (b - a) * rand();
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (x) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};

/** Wavetable with a soft, slightly reedy timbre (mostly fundamental). */
const TABLE = 4096;
const padTable = new Float32Array(TABLE + 1);
for (let i = 0; i <= TABLE; i++) {
  const p = (i / TABLE) * Math.PI * 2;
  padTable[i] = Math.sin(p) + 0.16 * Math.sin(2 * p) + 0.05 * Math.sin(3 * p) + 0.02 * Math.sin(5 * p);
}
const lookup = (table, phase) => {
  const x = phase * TABLE;
  const i = x | 0;
  const f = x - i;
  return table[i] + (table[i + 1] - table[i]) * f;
};

const L = new Float32Array(N);
const R = new Float32Array(N);
const busL = new Float32Array(N); // bells → delay
const busR = new Float32Array(N);
const verbIn = new Float32Array(N); // mono send into the reverb

// ---------------------------------------------------------------- harmony

// D major: Dmaj9 · Bm9 · Gmaj9 · Asus · Em9 · Gmaj7/D · Bm7 · A(add9)
const PROGRESSION = [
  {bass: 38, pad: [50, 57, 61, 64, 66]},
  {bass: 35, pad: [50, 54, 57, 61, 66]},
  {bass: 43, pad: [55, 59, 62, 66, 69]},
  {bass: 45, pad: [52, 57, 62, 64, 69]},
  {bass: 40, pad: [52, 55, 59, 62, 66]},
  {bass: 38, pad: [50, 55, 59, 62, 66]},
  {bass: 47, pad: [50, 54, 57, 59, 62]},
  {bass: 45, pad: [49, 52, 57, 61, 64]},
];
const PENTATONIC = [2, 4, 6, 9, 11]; // D E F# A B (pitch classes)

const XFADE = 3; // seconds of overlap between chords
const chordCount = Math.ceil(DURATION / CHORD) + 1;

/**
 * Equal-power crossfade envelope for chord k at time t. The voices of two
 * chords are uncorrelated, so sin/cos keeps the level constant through the change.
 */
const chordEnv = (k, t) => {
  const start = k * CHORD;
  const end = (k + 1) * CHORD;
  const fadeIn = k === 0 ? 1 : Math.sin((Math.PI / 2) * clamp01((t - (start - XFADE / 2)) / XFADE));
  const fadeOut = Math.cos((Math.PI / 2) * clamp01((t - (end - XFADE / 2)) / XFADE));
  return Math.min(fadeIn, fadeOut);
};

// ---------------------------------------------------------------- pad + bass

for (let k = 0; k < chordCount; k++) {
  const chord = PROGRESSION[k % PROGRESSION.length];
  const s0 = Math.max(0, Math.floor((k * CHORD - XFADE) * SR));
  const s1 = Math.min(N, Math.ceil(((k + 1) * CHORD + XFADE) * SR));
  if (s0 >= s1) continue;

  const voices = [];
  for (const note of chord.pad) {
    for (const [cents, pan] of [
      [range(-9, -4), -0.6],
      [range(-1, 1), 0],
      [range(4, 9), 0.6],
    ]) {
      voices.push({
        inc: (hz(note) * 2 ** (cents / 1200)) / SR,
        phase: rand(),
        gl: Math.sqrt((1 - pan) / 2),
        gr: Math.sqrt((1 + pan) / 2),
        lfoInc: range(0.04, 0.11) / SR,
        lfoPhase: rand(),
        amp: 0.07 / chord.pad.length,
      });
    }
  }
  const bassInc = hz(chord.bass) / SR;
  let bassPhase = 0;

  for (let i = s0; i < s1; i++) {
    const t = i / SR;
    const env = chordEnv(k, t);
    if (env <= 0) continue;
    let l = 0;
    let r = 0;
    for (const v of voices) {
      const breath = 0.75 + 0.25 * Math.sin(2 * Math.PI * v.lfoPhase);
      const s = lookup(padTable, v.phase) * v.amp * breath;
      l += s * v.gl;
      r += s * v.gr;
      v.phase += v.inc;
      if (v.phase >= 1) v.phase -= 1;
      v.lfoPhase += v.lfoInc;
    }
    // Sub bass enters after the opening seconds.
    const bassGain = 0.032 * smooth((t - 6) / 8);
    const b = Math.sin(2 * Math.PI * bassPhase) * bassGain;
    bassPhase += bassInc;
    if (bassPhase >= 1) bassPhase -= 1;

    L[i] += (l + b) * env;
    R[i] += (r + b) * env;
    verbIn[i] += (l + r) * 0.5 * env;
  }
}

// Gentle, slowly moving low-pass over the pad so it never gets bright.
{
  let yl = 0;
  let yr = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const cutoff = 1100 + 500 * Math.sin((2 * Math.PI * t) / 47);
    const a = 1 - Math.exp((-2 * Math.PI * cutoff) / SR);
    yl += a * (L[i] - yl);
    yr += a * (R[i] - yr);
    L[i] = yl;
    R[i] = yr;
  }
}

// ---------------------------------------------------------------- bells

/** How busy the bells are over time: silent intro, thinning out at the end. */
const density = (t) => smooth((t - 12) / 14) * (1 - smooth((t - (DURATION - 34)) / 22));

const STEP = 0.5; // seconds
let melodyIndex = 4;
for (let t = 0; t < DURATION - 6; t += STEP) {
  const d = density(t);
  if (d <= 0 || rand() > 0.26 * d) continue;

  const chord = PROGRESSION[Math.floor(t / CHORD) % PROGRESSION.length];
  const candidates = [];
  for (let m = 69; m <= 86; m++) {
    const pc = m % 12;
    if (PENTATONIC.includes(pc) || chord.pad.some((n) => n % 12 === pc)) candidates.push(m);
  }
  melodyIndex = Math.max(0, Math.min(candidates.length - 1, melodyIndex + Math.round(range(-2.4, 2.4))));
  const f = hz(candidates[melodyIndex]);
  const vel = range(0.022, 0.04) * (0.6 + 0.4 * d);
  const pan = range(-0.45, 0.45);
  const gl = Math.sqrt((1 - pan) / 2);
  const gr = Math.sqrt((1 + pan) / 2);
  const start = Math.floor((t + range(0, 0.04)) * SR);
  const len = Math.min(N - start, Math.floor(5 * SR));
  for (let j = 0; j < len; j++) {
    const u = j / SR;
    const env = (1 - Math.exp(-u / 0.006)) * Math.exp(-u / 1.5);
    const w = 2 * Math.PI * f * u;
    const s =
      (Math.sin(w) + 0.28 * Math.sin(2.01 * w) * Math.exp(-u / 0.35) + 0.06 * Math.sin(3.98 * w) * Math.exp(-u / 0.15)) *
      env *
      vel;
    busL[start + j] += s * gl;
    busR[start + j] += s * gr;
  }
}

// Ping-pong delay (dotted rhythm) with a darkening feedback path.
{
  const dl = Math.floor(0.75 * SR);
  const fb = 0.38;
  const dlL = new Float32Array(dl);
  const dlR = new Float32Array(dl);
  let lpL = 0;
  let lpR = 0;
  const a = 1 - Math.exp((-2 * Math.PI * 2400) / SR);
  for (let i = 0; i < N; i++) {
    const k = i % dl;
    const outL = dlL[k];
    const outR = dlR[k];
    lpL += a * (outR - lpL);
    lpR += a * (outL - lpR);
    dlL[k] = busL[i] + lpL * fb;
    dlR[k] = busR[i] + lpR * fb;
    const l = busL[i] + outL * 0.45;
    const r = busR[i] + outR * 0.45;
    L[i] += l;
    R[i] += r;
    verbIn[i] += (l + r) * 0.9;
  }
}

// ---------------------------------------------------------------- air

{
  let y = 0;
  let y2 = 0;
  const a = 1 - Math.exp((-2 * Math.PI * 700) / SR);
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    y += a * (rand() * 2 - 1 - y);
    y2 += a * (y - y2);
    const swell = 0.006 * (0.5 + 0.5 * Math.sin((2 * Math.PI * t) / 31 - 1.2));
    L[i] += y2 * swell;
    R[i] -= y2 * swell;
  }
}

// ---------------------------------------------------------------- reverb (Freeverb style)

{
  const scale = SR / 44100;
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
  const allpasses = [556, 441, 341, 225];
  const makeChannel = (spread) => ({
    combs: combs.map((n) => ({buf: new Float32Array(Math.floor((n + spread) * scale)), idx: 0, store: 0})),
    aps: allpasses.map((n) => ({buf: new Float32Array(Math.floor((n + spread) * scale)), idx: 0})),
  });
  const chans = [makeChannel(0), makeChannel(23)];
  const feedback = 0.88;
  const damp = 0.35;
  const wet = 0.5;
  for (let i = 0; i < N; i++) {
    const input = verbIn[i] * 0.015;
    for (let c = 0; c < 2; c++) {
      const ch = chans[c];
      let out = 0;
      for (const cb of ch.combs) {
        const y = cb.buf[cb.idx];
        cb.store = y * (1 - damp) + cb.store * damp;
        cb.buf[cb.idx] = input + cb.store * feedback;
        if (++cb.idx >= cb.buf.length) cb.idx = 0;
        out += y;
      }
      for (const ap of ch.aps) {
        const b = ap.buf[ap.idx];
        ap.buf[ap.idx] = out + b * 0.5;
        if (++ap.idx >= ap.buf.length) ap.idx = 0;
        out = b - out;
      }
      if (c === 0) L[i] += out * wet;
      else R[i] += out * wet;
    }
  }
}

// ---------------------------------------------------------------- master

const FADE_IN = 5;
const FADE_OUT = 9;
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const g = smooth(t / FADE_IN) * (1 - smooth((t - (DURATION - FADE_OUT)) / FADE_OUT));
  L[i] = Math.tanh(L[i] * 1.2) * g;
  R[i] = Math.tanh(R[i] * 1.2) * g;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}

const norm = 0.89 / (peak || 1);
const pcm = Buffer.alloc(44 + N * 4);
pcm.write('RIFF', 0);
pcm.writeUInt32LE(36 + N * 4, 4);
pcm.write('WAVE', 8);
pcm.write('fmt ', 12);
pcm.writeUInt32LE(16, 16);
pcm.writeUInt16LE(1, 20); // PCM
pcm.writeUInt16LE(2, 22); // stereo
pcm.writeUInt32LE(SR, 24);
pcm.writeUInt32LE(SR * 4, 28);
pcm.writeUInt16LE(4, 32);
pcm.writeUInt16LE(16, 34);
pcm.write('data', 36);
pcm.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * norm)) * 32767), 44 + i * 4);
  pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * norm)) * 32767), 46 + i * 4);
}

const dir = mkdtempSync(join(tmpdir(), 'anglesharp-music-'));
try {
  const wav = join(dir, 'music.wav');
  writeFileSync(wav, pcm);
  if (args.out.endsWith('.wav')) {
    writeFileSync(args.out, pcm);
  } else {
    // Two-pass loudnorm in linear mode: a single static gain, so the fades and
    // the quiet intro keep their shape.
    const target = `I=${args.lufs}:TP=-2:LRA=11`;
    const analysis = spawnSync(
      'ffmpeg',
      ['-hide_banner', '-nostats', '-i', wav, '-af', `loudnorm=${target}:print_format=json`, '-f', 'null', '-'],
      {encoding: 'utf8'},
    ).stderr;
    const m = JSON.parse(analysis.slice(analysis.lastIndexOf('{')));
    const measured = `measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}`;
    execFileSync(
      'ffmpeg',
      ['-y', '-loglevel', 'error', '-i', wav, '-af', `loudnorm=${target}:${measured}:linear=true`, '-ar', String(SR), '-b:a', '160k', args.out],
      {stdio: 'inherit'},
    );
  }
  console.log(`Wrote ${args.out} (${DURATION}s, seed ${args.seed})`);
} finally {
  rmSync(dir, {recursive: true, force: true});
}
