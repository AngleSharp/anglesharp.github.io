import {staticFile} from 'remotion';
import {samples} from '../samples.generated';

/**
 * Accessors for the generated sample data. Everything a tutorial shows as
 * code or output must come through here, so it matches ../samples exactly.
 */
export type SampleId = keyof typeof samples;

const dedent = (lines: string[]): string[] => {
  const indents = lines.filter((l) => l.trim().length > 0).map((l) => l.match(/^ */)![0].length);
  const min = indents.length > 0 ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(min));
};

const slice = (text: string, from = 1, to?: number): string[] => {
  const lines = text.split('\n');
  return lines.slice(from - 1, to ?? lines.length);
};

/** Lines `from`–`to` (1-based, inclusive) of section `n` of a sample's Program.cs. */
export const code = (id: SampleId, n: number, from?: number, to?: number): string => {
  const section = (samples[id].sections as Record<string, {title: string; code: string}>)[String(n)];
  if (!section) {
    throw new Error(`${id} has no section ${n}`);
  }
  return dedent(slice(section.code, from, to)).join('\n');
};

/** Lines `from`–`to` (1-based, inclusive) of the captured console output. */
export const out = (id: SampleId, from: number, to?: number): string[] =>
  slice(samples[id].stdout, from, to ?? from).map((l) => l.replace(/\t/g, '  '));

/** A text file from the sample's input/ folder. */
export const input = (id: SampleId, path: string): string => {
  const value = (samples[id].inputs as Record<string, string>)[path];
  if (value === undefined) {
    throw new Error(`${id} has no input ${path}`);
  }
  return value;
};

/** A text file the sample wrote to output/. */
export const output = (id: SampleId, path: string): string => {
  const value = (samples[id].outputs as Record<string, string>)[path];
  if (value === undefined) {
    throw new Error(`${id} has no output ${path}`);
  }
  return value;
};

/** A PNG the sample rendered (copied to public/samples/<id>/). */
export const image = (id: SampleId, file: string): string => staticFile(`samples/${id}/${file}`);

/**
 * A top-level declaration from the sample's helpers, found by the start of
 * its first line (e.g. "static async Task<IDocument> SubmitAsync("). It ends at
 * the first line that is exactly "}" or, for expression bodies, ends with ";".
 */
export const block = (id: SampleId, startsWith: string): string => {
  const lines = samples[id].program.split('\n');
  const first = lines.findIndex((l) => l.startsWith(startsWith));
  if (first < 0) {
    throw new Error(`${id} has no declaration starting with ${startsWith}`);
  }
  const rest = lines.slice(first);
  const open = rest.findIndex((l) => l === '{');
  const semicolon = rest.findIndex((l) => l.trimEnd().endsWith(';'));
  const end = open >= 0 && (semicolon < 0 || open < semicolon) ? rest.findIndex((l) => l === '}') : semicolon;
  return rest.slice(0, end + 1).join('\n');
};
