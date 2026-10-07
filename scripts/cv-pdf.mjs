// Prints /cv/document/ to public/cv.pdf. Usage: npm run cv:pdf (builds first, then serves dist/ via astro preview).
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const port = 4329;
const server = spawn('npx', ['astro', 'preview', '--port', String(port)], { stdio: 'ignore' });
try {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (let i = 0; ; i++) {
    try {
      await page.goto(`http://localhost:${port}/cv/document/`, { waitUntil: 'networkidle' });
      break;
    } catch (e) {
      if (i > 40) throw e;
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: 'public/cv.pdf', format: 'Letter', preferCSSPageSize: true, printBackground: true });
  await browser.close();
  console.log('Wrote public/cv.pdf');
} finally {
  server.kill();
}
