const fs = require('fs');
const path = require('path');
const SRC = path.join(__dirname, 'src', 'webharu-utils-refactored.js');
const DIST = path.join(__dirname, '..', 'assets', 'webharu-utils.v1.js');
const DIST_READABLE = path.join(__dirname, '..', 'assets', 'webharu-utils.v1.readable.js');

function minify(code) {
  let result = '';
  let length = code.length;
  let i = 0;
  let inString = null;
  let stringEscape = false;
  let inRegex = false;
  let regexEscape = false;
  let prevNonSpace = '';

  while (i < length) {
    const ch = code[i];
    const next = code[i + 1];

    if (inString) {
      result += ch;
      if (stringEscape) {
        stringEscape = false;
      } else if (ch === '\\') {
        stringEscape = true;
      } else if (ch === inString) {
        inString = null;
      }
      if (!/\s/.test(ch)) {
        prevNonSpace = ch;
      }
      i += 1;
      continue;
    }

    if (inRegex) {
      result += ch;
      if (regexEscape) {
        regexEscape = false;
      } else if (ch === '\\') {
        regexEscape = true;
      } else if (ch === '/') {
        inRegex = false;
        prevNonSpace = '/';
      }
      i += 1;
      continue;
    }

    if (ch === '\"' || ch === '\'' || ch === '`') {
      inString = ch;
      result += ch;
      i += 1;
      continue;
    }

    if (ch === '/') {
      if (next === '/') {
        i += 2;
        while (i < length && code[i] !== '\n') {
          i += 1;
        }
        continue;
      }
      if (next === '*') {
        if (code[i + 2] === '!') {
          let comment = '/*!';
          i += 3;
          while (i < length) {
            const c = code[i];
            comment += c;
            if (c === '*' && code[i + 1] === '/') {
              comment += '/';
              i += 2;
              break;
            }
            i += 1;
          }
          result += comment;
          continue;
        }
        i += 2;
        while (i < length) {
          if (code[i] === '*' && code[i + 1] === '/') {
            i += 2;
            break;
          }
          i += 1;
        }
        continue;
      }
      const prev = prevNonSpace;
      const canBeRegex = !prev || /[({[=:+\-!*&|?,<>^~]/.test(prev);
      if (canBeRegex) {
        inRegex = true;
        result += ch;
        i += 1;
        continue;
      }
      result += ch;
      prevNonSpace = ch;
      i += 1;
      continue;
    }

    if (/\s/.test(ch)) {
      let j = i + 1;
      while (j < length && /\s/.test(code[j])) {
        j += 1;
      }
      const prevCh = result[result.length - 1];
      const nextCh = code[j];
      const needSpace = /[\w$]/.test(prevCh) && /[\w$]/.test(nextCh);
      if (needSpace) {
        result += ' ';
      }
      i = j;
      continue;
    }

    result += ch;
    if (!/\s/.test(ch)) {
      prevNonSpace = ch;
    }
    i += 1;
  }
  return result;
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function build() {
  const src = fs.readFileSync(SRC, 'utf8');
  const license = '/*! WebHaru Utils v1 - Refactored | MIT License */';
  const minified = minify(src);
  const output = license + minified;

  ensureDir(DIST);
  ensureDir(DIST_READABLE);

  // Write minified version
  fs.writeFileSync(DIST, output, 'utf8');
  const size = Buffer.byteLength(output);

  // Write readable version for debugging
  fs.writeFileSync(DIST_READABLE, license + '\n' + src, 'utf8');

  console.log('✓ Built minified:', path.relative(process.cwd(), DIST), size + ' bytes');
  console.log('✓ Built readable:', path.relative(process.cwd(), DIST_READABLE));

  if (size > 16 * 1024) {
    console.warn('⚠ Warning: File size exceeds 16KB:', size, 'bytes');
  }
}

build();
