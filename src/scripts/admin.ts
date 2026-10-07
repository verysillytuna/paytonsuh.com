// Client for /admin: unlock the vault, then render the workbench dashboard from the GitHub REST API.
// Same sections and actions as workbench apps/dashboard (milestones 1–2), without the local server.

import {
  DAILY_BODY,
  REPOS,
  inline,
  markLocal,
  pacificToday,
  parseBacklogNow,
  parseStatus,
  parseTable,
  unseal,
  type Vault,
} from './admin-core';

const KEY = 'admin-token'; // sessionStorage: cleared when the tab closes
const API = 'https://api.github.com';
const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

let token = '';

async function gh(path: string, init: RequestInit = {}, raw = false) {
  const res = await fetch(API + path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  if (res.status === 401) {
    signOut('GitHub rejected the token (expired or revoked). Re-run npm run admin:seal.');
    throw new Error('unauthorized');
  }
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      msg += `: ${(await res.json()).message}`;
    } catch {}
    throw new Error(`${path.split('?')[0]}: ${msg}`);
  }
  return raw ? res.text() : res.json();
}

// ---------------------------------------------------------------------------
// Login

export function start() {
  const vault = JSON.parse($('vault').textContent || 'null') as Vault | null;
  try {
    token = sessionStorage.getItem(KEY) ?? '';
  } catch {}
  if (token) return showDashboard();
  const form = document.getElementById('login-form') as HTMLFormElement | null;
  if (!vault || !form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const button = form.querySelector('button')!;
    button.disabled = true;
    button.textContent = 'Checking…';
    const t = await unseal(vault, String(f.get('username')), String(f.get('password')));
    button.disabled = false;
    button.textContent = 'Sign in';
    if (!t) {
      $('login-error').textContent = 'Wrong username or password.';
      $('login-error').hidden = false;
      return;
    }
    token = t;
    try {
      sessionStorage.setItem(KEY, t);
    } catch {}
    form.reset();
    showDashboard();
  });
}

function signOut(message?: string) {
  token = '';
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
  $('dash').hidden = true;
  $('login').hidden = false;
  if (message && $('login-error')) {
    $('login-error').textContent = message;
    $('login-error').hidden = false;
  }
}

let wired = false;
function showDashboard() {
  $('login').hidden = true;
  $('dash').hidden = false;
  if (!wired) {
    wired = true;
    $('logout').addEventListener('click', () => signOut());
    $('refresh').addEventListener('click', () => load());
    wireCreateForm();
  }
  load();
}

// ---------------------------------------------------------------------------
// Data

interface Issue {
  repo: string;
  number: number;
  title: string;
  url: string;
  labels: string[];
}
interface PR {
  repo: string;
  number: number;
  title: string;
  url: string;
  branch: string;
  draft: boolean;
}

async function load() {
  $('taken').textContent = 'Loading…';
  const errors: string[] = [];
  const attempt = async <T>(p: Promise<T>, fallback: T): Promise<T> => {
    try {
      return await p;
    } catch (e) {
      if ((e as Error).message !== 'unauthorized') errors.push((e as Error).message);
      return fallback;
    }
  };

  const [issueLists, prLists, files] = await Promise.all([
    Promise.all(REPOS.map((r) => attempt(gh(`/repos/${r}/issues?state=open&per_page=100`), []))),
    Promise.all(REPOS.map((r) => attempt(gh(`/repos/${r}/pulls?state=open&per_page=100`), []))),
    attempt(loadWorkbenchFiles(), null),
  ]);
  if (!token) return;

  const issues: Issue[] = issueLists.flatMap((list: any[], i) =>
    list
      .filter((x) => !x.pull_request)
      .map((x) => ({
        repo: REPOS[i],
        number: x.number,
        title: x.title,
        url: x.html_url,
        labels: x.labels.map((l: any) => (typeof l === 'string' ? l : l.name)),
      })),
  );
  const prs: PR[] = prLists.flatMap((list: any[], i) =>
    list.map((x) => ({
      repo: REPOS[i],
      number: x.number,
      title: x.title,
      url: x.html_url,
      branch: x.head.ref,
      draft: x.draft,
    })),
  );

  const asks = issues.filter((i) => i.labels.includes('for-payton'));
  const inbox = issues.filter((i) => !asks.includes(i) && (i.labels.includes('daily') || i.labels.includes('task')));
  const other = issues.filter((i) => !asks.includes(i) && !inbox.includes(i));
  renderIssues('asks', asks);
  renderIssues('inbox', inbox);
  renderIssues('other', other);
  renderPRs(prs);
  if (files) renderFiles(files);

  $('errors').replaceChildren(...errors.map((e) => li(e)));
  $('taken').textContent = `Updated ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
}

async function loadWorkbenchFiles() {
  const repo = REPOS[0];
  const read = (path: string) => gh(`/repos/${repo}/contents/${path}`, {}, true).catch(() => '') as Promise<string>;
  const tree: { path: string }[] = (await gh(`/repos/${repo}/git/trees/HEAD?recursive=1`)).tree;
  const statusPaths = tree
    .map((t) => t.path)
    .filter((p) => /^[^/]+\/[^/]+(\/[^/]+)?\/STATUS\.md$/.test(p) && !p.includes('node_modules'))
    .sort();
  const journal = tree
    .map((t) => t.path)
    .filter((p) => /^journal\/\d{4}-\d{2}-\d{2}\.md$/.test(p))
    .sort()
    .at(-1);
  const [tracker, backlog, journalText, ...statuses] = await Promise.all([
    read('opportunities/tracker.md'),
    read('mission/BACKLOG.md'),
    journal ? read(journal) : Promise.resolve(''),
    ...statusPaths.map(read),
  ]);
  return {
    opportunities: parseTable(tracker).filter((r) => !/^ruled out/i.test(r.Status ?? '')),
    backlog: parseBacklogNow(backlog),
    statuses: statusPaths.map((p, i) => [p.replace(/\/STATUS\.md$/, ''), parseStatus(statuses[i])] as const),
    journalName: journal?.slice(8, 18) ?? '',
    journal: journalText,
  };
}

// ---------------------------------------------------------------------------
// Rendering (all text goes through textContent or inline(), which escapes)

function li(text: string) {
  const el = document.createElement('li');
  el.textContent = text;
  return el;
}

function html(tag: string, markup: string) {
  const el = document.createElement(tag);
  el.innerHTML = markup;
  return el;
}

function link(text: string, href: string) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;
  return a;
}

function short(repo: string) {
  return repo.split('/')[1];
}

function renderIssues(id: string, items: Issue[]) {
  if (!items.length) return $(id).replaceChildren(li('None.'));
  $(id).replaceChildren(
    ...items.map((i) => {
      const el = document.createElement('li');
      el.append(link(`${short(i.repo)}#${i.number}`, i.url), ' ', i.title);
      for (const l of i.labels) {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = l;
        el.append(tag);
      }
      el.append(actions(i));
      return el;
    }),
  );
}

function actions(i: Issue) {
  const d = document.createElement('details');
  d.className = 'act';
  d.innerHTML = `<summary>act</summary>
    <form data-do="comment"><textarea name="body" rows="3" required placeholder="Comment"></textarea><button>Comment</button></form>
    <form data-do="close"><button>Close issue</button></form>`;
  for (const form of d.querySelectorAll('form')) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const base = `/repos/${i.repo}/issues/${i.number}`;
      if (form.dataset.do === 'close') {
        if (!confirm(`Close ${short(i.repo)}#${i.number}?`)) return;
        await act(`Closed ${short(i.repo)}#${i.number}`, gh(base, { method: 'PATCH', body: JSON.stringify({ state: 'closed' }) }));
      } else {
        const body = String(new FormData(form).get('body')).trim();
        if (!body) return;
        await act(`Commented on ${short(i.repo)}#${i.number}`, gh(`${base}/comments`, { method: 'POST', body: JSON.stringify({ body }) }));
      }
    });
  }
  return d;
}

async function act(success: string, request: Promise<any>) {
  try {
    const res = await request;
    flash(true, res?.html_url && !success.startsWith('Closed') ? `${success}: ${res.html_url}` : success);
    load();
  } catch (e) {
    flash(false, (e as Error).message);
  }
}

function flash(ok: boolean, message: string) {
  const el = $('flash');
  el.textContent = message;
  el.classList.toggle('bad', !ok);
  el.hidden = false;
  el.scrollIntoView({ block: 'nearest' });
}

function renderPRs(prs: PR[]) {
  if (!prs.length) return $('prs').replaceChildren(li('None.'));
  $('prs').replaceChildren(
    ...prs.map((p) => {
      const el = document.createElement('li');
      el.append(link(`${short(p.repo)}#${p.number}`, p.url), ' ', p.title, ' ');
      const code = document.createElement('code');
      code.textContent = p.branch;
      el.append(code);
      if (p.draft) el.append(' (draft)');
      return el;
    }),
  );
}

function renderFiles(f: Awaited<ReturnType<typeof loadWorkbenchFiles>>) {
  const cols = ['Opportunity', 'Deadline', 'Status', 'Link'];
  const table = $('opps');
  table.replaceChildren();
  if (f.opportunities.length) {
    table.append(html('tr', cols.map((c) => `<th>${c}</th>`).join('')));
    for (const row of f.opportunities) table.append(html('tr', cols.map((c) => `<td>${inline(row[c] ?? '')}</td>`).join('')));
  }
  $('backlog').replaceChildren(...f.backlog.map((b) => html('li', inline(b))));

  $('projects').replaceChildren(
    ...f.statuses.map(([name, sections]) => {
      const box = document.createElement('div');
      const h = document.createElement('h3');
      h.textContent = name;
      box.append(h);
      for (const [heading, bullets] of Object.entries(sections)) {
        if (!bullets.length) continue;
        const p = document.createElement('p');
        p.innerHTML = `<strong>${inline(heading)}</strong>`;
        const ul = document.createElement('ul');
        ul.append(...bullets.map((b) => html('li', inline(b))));
        box.append(p, ul);
      }
      return box;
    }),
  );
  $('journal-title').textContent = f.journalName ? `Latest journal: ${f.journalName}` : 'Latest journal';
  $('journal').textContent = f.journal || 'None.';
}

// ---------------------------------------------------------------------------
// New daily issue

function wireCreateForm() {
  const select = $<HTMLSelectElement>('repo-select');
  select.replaceChildren(...REPOS.map((r) => new Option(r, r)));
  const form = $<HTMLFormElement>('create-form');
  const resetFields = () => {
    $<HTMLInputElement>('title-input').value = `Daily: ${pacificToday()}`;
    $<HTMLTextAreaElement>('body-input').value = DAILY_BODY;
  };
  resetFields();
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const repo = String(f.get('repo'));
    if (!(REPOS as readonly string[]).includes(repo)) return flash(false, `repo not allowed: ${repo}`);
    let body = String(f.get('body')).replace(/\r\n/g, '\n').trim();
    if (!body) return flash(false, 'the issue body is empty');
    const labels = ['daily'];
    if (f.get('local') === 'on') {
      body = markLocal(body);
      labels.push('local');
    }
    const title = String(f.get('title')).trim() || `Daily: ${pacificToday()}`;
    await act(`Opened ${short(repo)} issue`, gh(`/repos/${repo}/issues`, { method: 'POST', body: JSON.stringify({ title, body, labels }) }));
    form.reset();
    resetFields();
    (form.closest('details') as HTMLDetailsElement).open = false;
  });
}
