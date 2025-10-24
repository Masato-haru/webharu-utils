const fs = require('fs');
const path = require('path');
const root = __dirname ? path.join(__dirname, '..') : path.resolve('..');

require.extensions['.ts'] = require.extensions['.js'];

const helpers = {
  read(file) {
    return fs.readFileSync(path.join(root, file), 'utf8');
  },
  json(file) {
    return JSON.parse(this.read(file));
  },
  assert(cond, message) {
    if (!cond) {
      throw new Error(message);
    }
  },
  includes(text, needle, message) {
    if (!text.includes(needle)) {
      throw new Error(message || 'Expected to include: ' + needle);
    }
  },
  size(file) {
    return fs.statSync(path.join(root, file)).size;
  },
  exists(file) {
    return fs.existsSync(path.join(root, file));
  }
};

const tests = [];
function register(name, fn) {
  tests.push({ name, fn });
}

const specsDir = path.join(root, 'tests', 'e2e');
fs.readdirSync(specsDir)
  .filter((file) => file.endsWith('.spec.ts'))
  .sort()
  .forEach((file) => {
    const mod = require(path.join(specsDir, file));
    if (typeof mod === 'function') {
      mod(register, helpers);
    }
  });

let failed = 0;
tests.forEach((t, index) => {
  try {
    t.fn();
    console.log('✓', t.name);
  } catch (err) {
    failed += 1;
    console.error('✗', t.name, '-', err.message);
  }
});

if (failed) {
  process.exit(1);
}

console.log('All tests passed (' + tests.length + ')');
