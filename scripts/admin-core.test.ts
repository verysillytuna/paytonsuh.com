// node --test scripts/   (Node 22.18+ runs TypeScript directly)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seal, unseal, parseTable, parseBacklogNow, parseStatus, inline, markLocal, DAILY_BODY } from '../src/scripts/admin-core.ts';

test('vault round trip; wrong credentials fail', async () => {
  const v = await seal('Payton', 'correct horse battery', 'ghp_x');
  assert.equal(await unseal(v, ' payton ', 'correct horse battery'), 'ghp_x');
  assert.equal(await unseal(v, 'payton', 'wrong password!!'), null);
  assert.equal(await unseal(v, 'someone', 'correct horse battery'), null);
  assert.equal(JSON.stringify(v).includes('ghp_x'), false);
});

test('parseTable reads the first table', () => {
  const rows = parseTable('# T\n\n| A | B |\n|---|---|\n| 1 | [x](https://e.com) |\n| 2 | |\n\nafter');
  assert.deepEqual(rows, [{ A: '1', B: '[x](https://e.com)' }, { A: '2', B: '' }]);
});

test('parseBacklogNow takes bold titles under ## Now, including 4a.', () => {
  const md = '## Now (fall)\n\n0. **Scouting** (L)\n1. **Putnam** (M)\n4a. **Goldwater** (M)\n\n## Later\n5. **No**';
  assert.deepEqual(parseBacklogNow(md), ['Scouting', 'Putnam', 'Goldwater']);
});

test('parseStatus splits sections', () => {
  assert.deepEqual(parseStatus('# S\n## Done\n- a\n- [x] b\n## Next\n* c'), { Done: ['a', 'b'], Next: ['c'] });
});

test('inline escapes HTML and only links http(s)', () => {
  assert.equal(inline('<b> **x** `y`'), '&lt;b&gt; <strong>x</strong> <code>y</code>');
  assert.equal(inline('[a](javascript:alert(1))'), '[a](javascript:alert(1))');
  assert.equal(inline('[a](https://e.com)'), '<a href="https://e.com">a</a>');
});

test('markLocal answers Yes', () => {
  assert.match(markLocal(DAILY_BODY), /Mac\?\n\nYes$/);
});
