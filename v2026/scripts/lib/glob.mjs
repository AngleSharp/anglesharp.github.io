// Minimal glob matcher supporting `*`, `**`, `?`, and `{a,b}`.
const cache = new Map();

export function globToRegExp(pattern) {
  let re = '';
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    if (c === '*') {
      if (pattern[i + 1] === '*') {
        // `**/` matches zero or more directories, `**` at the end matches anything
        if (pattern[i + 2] === '/') {
          re += '(?:.*/)?';
          i += 2;
        } else {
          re += '.*';
          i += 1;
        }
      } else {
        re += '[^/]*';
      }
    } else if (c === '?') {
      re += '[^/]';
    } else if (c === '{') {
      const end = pattern.indexOf('}', i);
      const options = pattern.slice(i + 1, end).split(',').map(escape);
      re += `(?:${options.join('|')})`;
      i = end;
    } else {
      re += escape(c);
    }
  }
  return new RegExp(`^${re}$`, 'i');
}

function escape(s) {
  return s.replace(/[.+^${}()|[\]\\]/g, '\\$&');
}

export function matches(path, patterns) {
  return patterns.some((p) => {
    let re = cache.get(p);
    if (!re) {
      re = globToRegExp(p);
      cache.set(p, re);
    }
    return re.test(path);
  });
}
