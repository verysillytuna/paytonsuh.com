// Shared by /admin (browser) and scripts/admin-seal.ts (Node): the vault format and the Markdown parsers.
//
// The site is static, so the admin login can't be checked by a server. Instead, a fine-grained GitHub
// token is encrypted with a key derived from the username and password (PBKDF2-SHA256, AES-256-GCM) and
// the ciphertext is committed as src/data/admin-vault.json. The right username and password decrypt the
// token in the browser; the page then talks to the GitHub API directly. Nothing private is in the build.

export interface Vault {
  v: 1;
  iter: number;
  salt: string; // base64
  iv: string; // base64
  ct: string; // base64 ciphertext of JSON { token }
}

export const ITERATIONS = 600_000;
export const REPOS = ['verysillytuna/workbench', 'verysillytuna/paytonsuh.com'] as const;

const enc = new TextEncoder();
const b64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function deriveKey(username: string, password: string, salt: Uint8Array, iter: number) {
  // Username is normalized (trimmed, lowercased) and bound into the key along with the password.
  const material = enc.encode(`${username.trim().toLowerCase()}\n${password}`);
  const base = await crypto.subtle.importKey('raw', material, 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function seal(username: string, password: string, token: string): Promise<Vault> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(username, password, salt, ITERATIONS);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify({ token })));
  return { v: 1, iter: ITERATIONS, salt: b64(salt), iv: b64(iv), ct: b64(new Uint8Array(ct)) };
}

/** Returns the GitHub token, or null if the username or password is wrong. */
export async function unseal(vault: Vault, username: string, password: string): Promise<string | null> {
  try {
    const key = await deriveKey(username, password, unb64(vault.salt), vault.iter);
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(vault.iv) }, key, unb64(vault.ct));
    return JSON.parse(new TextDecoder().decode(pt)).token ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Parsers, ported from workbench apps/dashboard/dashboard.py

/** Rows of the first Markdown table, as objects keyed by header. */
export function parseTable(markdown: string): Record<string, string>[] {
  const lines = markdown.split('\n').map((l) => l.trim());
  for (let i = 0; i + 1 < lines.length; i++) {
    if (lines[i].startsWith('|') && /^\|[\s:|-]+\|$/.test(lines[i + 1])) {
      const cells = (row: string) => row.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const headers = cells(lines[i]);
      const rows = [];
      for (const row of lines.slice(i + 2)) {
        if (!row.startsWith('|')) break;
        const c = cells(row);
        rows.push(Object.fromEntries(headers.map((h, j) => [h, c[j] ?? ''])));
      }
      return rows;
    }
  }
  return [];
}

/** Bold item titles under the "## Now" heading of mission/BACKLOG.md. */
export function parseBacklogNow(markdown: string): string[] {
  const m = markdown.match(/^## Now.*?$([\s\S]*?)(?=^## )/m);
  if (!m) return [];
  return [...m[1].matchAll(/^\d+[a-z]?\.\s+\*\*(.+?)\*\*/gm)].map((x) => x[1]);
}

/** A STATUS.md split into its "## " sections' bullet lists. */
export function parseStatus(markdown: string): Record<string, string[]> {
  const sections: Record<string, string[]> = {};
  let current: string | null = null;
  for (const line of markdown.split('\n')) {
    if (line.startsWith('## ')) {
      current = line.slice(3).trim();
      sections[current] = [];
    } else if (current && /^\s*[-*] /.test(line)) {
      sections[current].push(line.replace(/^\s*[-*] (\[[ x]\] )?/, '').trim());
    }
  }
  return sections;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Escape text, then turn Markdown links (http/https only), `code`, and **bold** into HTML. */
export function inline(text: string): string {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s"]+)\)/g, '<a href="$2">$1</a>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

export function pacificToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(now);
}

export const DAILY_BODY =
  '### Tasks\n\n- \n\n### Attachments\n\n_No response_\n\n### Needs files on my Mac?\n\nNo';

/** Mirror the dashboard's "local" checkbox: answer Yes in the issue form body. */
export function markLocal(body: string): string {
  return body.replace(/(### Needs files on my Mac\?\s*\n\s*\n)No\s*$/, '$1Yes');
}

export const OWNER = 'verysillytuna';

/** Claude links shown on the Claude tab. Opening them still requires the claude.ai login. */
export const CLAUDE_LINKS = [
  {
    label: 'Workbench routine',
    href: 'https://claude.ai/code/routines/trig_01TLq1GFygktyR16NjA37SiP',
    note: 'The twice-daily unattended run: schedule, history, run now.',
  },
  { label: 'Claude Code sessions', href: 'https://claude.ai/code', note: 'Every cloud session, including past routine runs.' },
] as const;

/** Pacific hours at which the routine fires (midnight and noon). */
export const RUN_HOURS = [0, 12] as const;

/** Minutes from `now` until the next scheduled run, in Pacific wall-clock time. */
export function minutesToNextRun(now = new Date(), hours: readonly number[] = RUN_HOURS): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  const current = Number(parts.hour) * 60 + Number(parts.minute);
  const waits = hours.map((h) => (h * 60 - current + 1440) % 1440 || 1440);
  return Math.min(...waits);
}

export interface Repo {
  name: string;
  full: string;
  url: string;
  description: string;
  private: boolean;
  archived: boolean;
  fork: boolean;
  pushed: string;
  openIssues: number;
}

/** Combine repo lists from several endpoints: one entry per repo, most recently pushed first. */
export function mergeRepos(...lists: any[][]): Repo[] {
  const seen = new Map<string, Repo>();
  for (const r of lists.flat()) {
    if (!r?.full_name || seen.has(r.full_name)) continue;
    seen.set(r.full_name, {
      name: r.name,
      full: r.full_name,
      url: r.html_url,
      description: r.description ?? '',
      private: Boolean(r.private),
      archived: Boolean(r.archived),
      fork: Boolean(r.fork),
      pushed: r.pushed_at ?? '',
      openIssues: r.open_issues_count ?? 0,
    });
  }
  return [...seen.values()].sort((a, b) => b.pushed.localeCompare(a.pushed));
}
