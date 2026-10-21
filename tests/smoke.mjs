// Deployment smoke test: node tests/smoke.mjs <baseUrl ending in />
// e.g. node tests/smoke.mjs https://spectertechnologies9-automation.github.io/tifferend-/
// Checks every page at desktop and phone width: HTTP errors, console errors, every <img> decoded,
// the display fonts loaded, and in-site navigation (home → case → careers) through the lime wipe.
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:4173/';
const pages = [['home', ''], ['case', 'work/my-mithila/index.html'], ['careers', 'careers/index.html']];
const log = [];
const ok = (n, c, x = '') => log.push(`${c ? 'PASS' : 'FAIL'}  ${n} ${x}`);
const b = await chromium.launch();

for (const [vw, vh, mobile] of [[1440, 900, false], [390, 844, true]]) {
  const ctx = await b.newContext({ viewport: { width: vw, height: vh }, isMobile: mobile, hasTouch: mobile });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('tf-intro', '1'); } catch (e) { /* ignore */ } });
  for (const [name, path] of pages) {
    const p = await ctx.newPage();
    const errs = [], bad = [];
    p.on('pageerror', (e) => errs.push(e.message));
    p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    p.on('response', (r) => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
    p.on('requestfailed', (r) => bad.push(`failed ${r.url()}`));
    const res = await p.goto(BASE + path, { waitUntil: 'networkidle' });
    const total = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += vh * 0.8) { await p.evaluate((yy) => scrollTo(0, yy), y); await p.waitForTimeout(90); }
    await p.waitForTimeout(1200);
    const imgs = await p.evaluate(() => [...document.images].filter((i) => !(i.loading === 'lazy' && i.getBoundingClientRect().left >= innerWidth)).filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src));
    const fonts = await p.evaluate(async () => { await document.fonts.ready; return ['Archivo Variable', 'Instrument Serif', 'Herr Von Muellerhoff', 'Space Mono'].map((f) => document.fonts.check(`16px "${f}"`)); });
    const tag = `${name}@${vw}`;
    ok(`${tag} HTTP ${res.status()}`, res.ok());
    ok(`${tag} no failed requests`, bad.length === 0, bad.slice(0, 3).join(' | '));
    ok(`${tag} all images decoded`, imgs.length === 0, imgs.slice(0, 3).join(' | '));
    ok(`${tag} display fonts loaded`, fonts.every(Boolean), JSON.stringify(fonts));
    ok(`${tag} no console errors`, errs.length === 0, errs.slice(0, 3).join(' | '));
    await p.close();
  }
  await ctx.close();
}

// navigation through real links
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('tf-intro', '1'); } catch (e) { /* ignore */ } });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.querySelector('.collage__text .btn').scrollIntoView({ block: 'center' })); await p.waitForTimeout(800);
  await p.click('.collage__text .btn');
  await p.waitForURL(/my-mithila\/index\.html/, { timeout: 10000 }); await p.waitForTimeout(1500);
  ok('nav: home → case', (await p.title()).startsWith('My Mithila'));
  await p.click('.menu-btn'); await p.waitForTimeout(900);
  await p.click('#menu a[href*="careers"]');
  await p.waitForURL(/careers\/index\.html/, { timeout: 10000 }); await p.waitForTimeout(1500);
  ok('nav: case → careers via menu', (await p.title()).startsWith('Careers'));
  await p.click('.logo'); await p.waitForURL((u) => /tifferend-\/(index\.html)?$|:\d+\/(index\.html)?$/.test(u.toString()), { timeout: 10000 }); await p.waitForTimeout(1200);
  ok('nav: careers → home via logo', (await p.title()).startsWith('Tifferend'));
  await ctx.close();
}

await b.close();
console.log(log.join('\n'));
if (log.some((l) => l.startsWith('FAIL'))) process.exitCode = 1;
