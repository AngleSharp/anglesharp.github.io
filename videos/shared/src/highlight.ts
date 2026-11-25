import {colors} from './theme';

/**
 * A tiny, synchronous syntax highlighter. Good enough for the short
 * snippets shown in videos, and deterministic across rendered frames.
 */
export type Language = 'csharp' | 'js' | 'html' | 'bash' | 'text';

export type TokenKind =
  | 'plain'
  | 'keyword'
  | 'type'
  | 'string'
  | 'comment'
  | 'number'
  | 'func'
  | 'punct'
  | 'tag'
  | 'attr'
  | 'prompt';

export type Token = {kind: TokenKind; text: string};

export const tokenColors: Record<TokenKind, string> = {
  plain: colors.text,
  keyword: '#c792ea',
  type: '#ffcb6b',
  string: '#c3e88d',
  comment: '#5f6f8a',
  number: '#f78c6c',
  func: '#82aaff',
  punct: '#89ddff',
  tag: '#f07178',
  attr: '#ffcb6b',
  prompt: colors.brandLight,
};

type Rule = [TokenKind, RegExp];

const csharpKeywords =
  'using|var|new|await|async|return|if|else|foreach|for|in|is|as|null|true|false|public|private|static|class|void|string|int|bool|this|namespace|select|from|where';
const jsKeywords =
  'const|let|var|new|await|async|return|if|else|for|of|in|function|null|true|false|class|this|import|from|export';

const rules: Record<Language, Rule[]> = {
  csharp: [
    ['comment', /\/\/[^\n]*/y],
    ['string', /\$?@?"""[\s\S]*?"""|\$?@?"(?:[^"\\\n]|\\.)*"/y],
    ['keyword', new RegExp(`\\b(?:${csharpKeywords})\\b`, 'y')],
    ['number', /\b\d+(?:\.\d+)?f?\b/y],
    ['func', /\b[A-Za-z_]\w*(?=\s*\(|<\w+>\()/y],
    ['type', /\b[A-Z]\w*/y],
    ['plain', /\b[a-z_]\w*/y],
    ['punct', /=>|[{}()[\];.,=<>?!:+\-*/&|]/y],
  ],
  js: [
    ['comment', /\/\/[^\n]*/y],
    ['string', /`(?:[^`\\]|\\.)*`|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/y],
    ['keyword', new RegExp(`\\b(?:${jsKeywords})\\b`, 'y')],
    ['number', /\b\d+(?:\.\d+)?\b/y],
    ['func', /\b[A-Za-z_$][\w$]*(?=\s*\()/y],
    ['type', /\b[A-Z][\w$]*/y],
    ['plain', /\b[a-z_$][\w$]*/y],
    ['punct', /=>|[{}()[\];.,=<>?!:+\-*/&|]/y],
  ],
  html: [
    ['comment', /<!--[\s\S]*?-->/y],
    ['tag', /<\/?[A-Za-z][\w-]*|\/?>/y],
    ['attr', /\b[A-Za-z-:]+(?==)/y],
    ['string', /"[^"]*"|'[^']*'/y],
    ['punct', /=/y],
  ],
  bash: [
    ['comment', /#[^\n]*/y],
    ['prompt', /^\$|^>/my],
    ['string', /"[^"]*"|'[^']*'/y],
    ['keyword', /\b(?:dotnet|npm|cd|mkdir)\b/y],
    ['func', /\b(?:add|new|run|package|build)\b/y],
    ['type', /\b[A-Z][\w.]*/y],
  ],
  text: [],
};

export const tokenize = (code: string, language: Language): Token[] => {
  const tokens: Token[] = [];
  const list = rules[language];
  let i = 0;
  let plain = '';

  const flush = () => {
    if (plain) {
      tokens.push({kind: 'plain', text: plain});
      plain = '';
    }
  };

  while (i < code.length) {
    let matched = false;
    for (const [kind, regex] of list) {
      regex.lastIndex = i;
      const m = regex.exec(code);
      if (m && m[0].length > 0) {
        flush();
        tokens.push({kind, text: m[0]});
        i += m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      plain += code[i];
      i++;
    }
  }

  flush();
  return tokens;
};

/** Tokenize and split into lines (tokens never span lines afterwards). */
export const tokenizeLines = (code: string, language: Language): Token[][] => {
  const lines: Token[][] = [[]];
  for (const token of tokenize(code, language)) {
    const parts = token.text.split('\n');
    parts.forEach((part, index) => {
      if (index > 0) {
        lines.push([]);
      }
      if (part) {
        lines[lines.length - 1].push({kind: token.kind, text: part});
      }
    });
  }
  return lines;
};
