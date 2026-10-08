// node --test scripts/   (Node 22.18+ runs TypeScript directly)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seal, unseal, parseTable, parseBacklogNow, parseStatus, inline, markLocal, DAILY_BODY, minutesToNextRun, mergeRepos } from '../src/scripts/admin-core.ts';

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

test('minutesToNextRun counts to the next midnight or noon Pacific', () => {
  // 2026-10-08 00:15 PDT = 07:15 UTC
  assert.equal(minutesToNextRun(new Date('2026-10-08T07:15:00Z')), 11 * 60 + 45);
  // exactly noon: the next run is midnight
  assert.equal(minutesToNextRun(new Date('2026-10-08T19:00:00Z')), 12 * 60);
  // winter (PST): 2026-12-01 23:30 PST = 2026-12-02 07:30 UTC
  assert.equal(minutesToNextRun(new Date('2026-12-02T07:30:00Z')), 30);
});

test('mergeRepos dedupes and sorts by last push', () => {
  const a = { full_name: 'o/a', name: 'a', html_url: 'u', pushed_at: '2026-01-01T00:00:00Z', private: true };
  const b = { full_name: 'o/b', name: 'b', html_url: 'u', pushed_at: '2026-05-01T00:00:00Z' };
  const repos = mergeRepos([a], [b, { ...a, private: false }], [null]);
  assert.deepEqual(repos.map((r) => r.full), ['o/b', 'o/a']);
  assert.equal(repos[1].private, true);
  assert.equal(repos[0].description, '');
});
