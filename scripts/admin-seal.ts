// Create or replace src/data/admin-vault.json: the GitHub token for /admin, encrypted with your
// admin username and password. Run in your own terminal:  npm run admin:seal
// The token is checked against GitHub first. Nothing but the ciphertext is written to disk.

import { writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { seal, unseal, REPOS } from '../src/scripts/admin-core.ts';

function ask(question: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      // Echo nothing while the answer is typed.
      (rl as any)._writeToOutput = (s: string) => {
        if (s.startsWith(question)) process.stdout.write(question);
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write('\n');
      resolve(answer);
    });
  });
}

const username = (await ask('Admin username: ')).trim();
const password = await ask('Admin password (12+ characters): ', true);
const again = await ask('Repeat password: ', true);
if (!username) throw new Error('username is empty');
if (password.length < 12) throw new Error('use a password of at least 12 characters');
if (password !== again) throw new Error('passwords differ');

console.log(`\nCreate a fine-grained token at https://github.com/settings/personal-access-tokens/new
  Resource owner: verysillytuna · Repositories: ${REPOS.map((r) => r.split('/')[1]).join(', ')}
  Permissions: Issues (read and write), Pull requests (read), Contents (read), Metadata (read)
  Expiration: up to a year (re-run this script when it expires)\n`);
const token = (await ask('Token (input hidden): ', true)).trim();

const res = await fetch(`https://api.github.com/repos/${REPOS[0]}`, {
  headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
});
if (!res.ok) throw new Error(`GitHub rejected the token for ${REPOS[0]}: HTTP ${res.status}`);

const vault = await seal(username, password, token);
if ((await unseal(vault, username, password)) !== token) throw new Error('round trip failed');
writeFileSync(new URL('../src/data/admin-vault.json', import.meta.url), JSON.stringify(vault, null, 2) + '\n');
console.log('Wrote src/data/admin-vault.json. Commit it; the next deploy enables /admin.');
