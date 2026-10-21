// QA harness: node tests/run.mjs [baseUrl]
// Requires `npm run preview` (or any static server for dist/) to be running.
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:4173/';
const OUT = process.env.SHOTS || 'tests/screens';
fs.mkdirSync(OUT, { recursive: true });
const pages = [['home', 'index.html'], ['case', 'work/my-mithila/index.html'], ['careers', 'careers/index.html']];
const widths = [[360, 740], [390, 844], [430, 932], [768, 1024], [1440, 900], [1920, 1080]];
const results = [];

const browser = await chromium.launch();
for (const reduced of [false, true]) {
  for (const [name, path] of pages) {
    for (const [w, h] of widths) {
      if (reduced && w !== 390 && w !== 1440) continue;
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: reduced ? 'reduce' : 'no-preference', hasTouch: w < 1024, isMobile: w < 768, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const errors = [], failed = [];
      page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
      page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
      page.on('requestfailed', (r) => failed.push(r.url() + ' ' + r.failure()?.errorText));
      page.on('response', (r) => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });
      // skip the intro loader for screenshot runs
      await page.addInitScript(() => { try { sessionStorage.setItem('tf-intro', '1'); } catch (e) {} });
      await page.goto(BASE + path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
      // scroll through to trigger reveals and lazy images
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < total; y += Math.round(h * 0.7)) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(140); }
      await page.waitForTimeout(800);
      const overflow = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth; const offenders = [];
        document.querySelectorAll('body *').forEach((el) => {
          if (el.closest('.strip, .fog, .opener, .wipe, .menu, .loader, .kit, .c-full, .cursor')) return;
          const r = el.getBoundingClientRect();
          if (r.width && (r.right > vw + 1 || r.left < -1)) offenders.push(el.tagName.toLowerCase() + '.' + [...el.classList].join('.') + ' ' + Math.round(r.left) + '→' + Math.round(r.right));
        });
        return { scrollW: document.documentElement.scrollWidth, vw, offenders: offenders.slice(0, 8) };
      });
      const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter((el) => getComputedStyle(el).visibility === 'hidden' || getComputedStyle(el).opacity === '0').length);
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(500);
      const tag = `${name}-${w}${reduced ? '-reduced' : ''}`;
      await page.screenshot({ path: `${OUT}/${tag}-top.png` });
      await page.screenshot({ path: `${OUT}/${tag}-full.png`, fullPage: true });
      results.push({ tag, height: total, horizontalOverflow: overflow.scrollW > overflow.vw || overflow.offenders.length > 0, overflow, stillHiddenReveals: hidden, errors, failed });
      await ctx.close();
    }
  }
}
await browser.close();
fs.writeFileSync('tests/results.json', JSON.stringify(results, null, 2));
const bad = results.filter((r) => r.horizontalOverflow || r.errors.length || r.failed.length || r.stillHiddenReveals);
console.log(results.map((r) => `${r.tag.padEnd(22)} h=${r.height} overflow=${r.horizontalOverflow} hidden=${r.stillHiddenReveals} err=${r.errors.length} fail=${r.failed.length}`).join('\n'));
if (bad.length) { console.log('\nISSUES:'); bad.forEach((b) => console.log(b.tag, JSON.stringify({ o: b.overflow.offenders, e: b.errors.slice(0, 3), f: b.failed.slice(0, 3) }))); process.exitCode = 1; }
