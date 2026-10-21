// Motion/interaction checks with real input (session-2 structure): node tests/motion.mjs [baseUrl]
import { chromium } from 'playwright';
import fs from 'node:fs';
const BASE = process.argv[2] || 'http://localhost:4173/';
const OUT = process.env.SHOTS || 'tests/motion';
fs.mkdirSync(OUT, { recursive: true });
const log = [];
const ok = (name, cond, extra = '') => log.push(`${cond ? 'PASS' : 'FAIL'}  ${name} ${extra}`);
const b = await chromium.launch();

{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  // 1) ERA loader → arch → AUGE strip hand-off
  await p.goto(BASE + 'index.html');
  let t0 = 0;
  for (const t of [400, 1300, 1800, 2500, 3100, 3600, 4400]) { await p.waitForTimeout(t - t0); t0 = t; await p.screenshot({ path: `${OUT}/loader-${t}.png` }); }
  const st = await p.evaluate(() => ({ hidden: document.getElementById('loader').hidden, hold: document.querySelector('.strip--hero').dataset.hold, word: getComputedStyle(document.querySelector('[data-hero-word]')).transform }));
  ok('loader completes, hides and releases the strip', st.hidden && st.hold === '0', JSON.stringify(st));
  await p.reload(); await p.waitForTimeout(500);
  ok('loader skipped on repeat visit', await p.evaluate(() => document.getElementById('loader').hidden));
  await p.waitForTimeout(1500);

  // 2) strip drift + hover pill + caption
  await p.mouse.move(700, 450);
  const tx = () => p.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.strip--hero [data-strip-track]')).transform).m41);
  const a = await tx(); await p.waitForTimeout(1000); const c = await tx();
  ok('hero strip drifts (AUGE A1)', c < a, `${a.toFixed(1)} → ${c.toFixed(1)}`);
  await p.mouse.move(720, 200, { steps: 6 }); await p.waitForTimeout(700);
  const pill = await p.evaluate(() => ({ o: +getComputedStyle(document.querySelector('.cursor__pill')).opacity, t: document.querySelector('.cursor__pill').textContent }));
  await p.screenshot({ path: `${OUT}/strip-hover.png` });
  ok('cursor pill decodes over a strip image', pill.o > 0.9 && pill.t.length > 3, JSON.stringify(pill));
  ok('chrome hidden over the AUGE first viewport', await p.evaluate(() => document.documentElement.classList.contains('chrome-hidden')));

  // Lenis accumulates wheel deltas, so step and let each step settle before measuring again
  const wheelTo = async (y) => { for (let i = 0; i < 160; i++) { const cur = await p.evaluate(() => scrollY); const d = y - cur; if (Math.abs(d) < 30) break; await p.mouse.wheel(0, Math.max(-500, Math.min(500, d * 0.9))); await p.waitForTimeout(Math.abs(d) > 1500 ? 120 : 380); } await p.waitForTimeout(1000); };
  const yOf = (sel, f = 0) => p.evaluate(([s, f]) => document.querySelector(s).getBoundingClientRect().top + scrollY + f * innerHeight, [sel, f]);

  // 3) chrome appears + theme follows chapters
  await wheelTo(await yOf('.philo', 0.2));
  ok('chrome visible after the hero', await p.evaluate(() => !document.documentElement.classList.contains('chrome-hidden')));
  await wheelTo(await yOf('.philo', 0.9));
  const chars = await p.evaluate(() => [...document.querySelectorAll('.philo__statement .ch')].map((c) => +getComputedStyle(c).opacity));
  ok('ERA per-character statement resolves on scroll', chars.length > 10 && chars.every((o) => o > 0.9), `${chars.length} chars`);
  await wheelTo(await yOf('.numbers', 0.3));
  ok('chrome switches to dark over the numbers chapter', await p.evaluate(() => document.documentElement.dataset.chrome === 'dark'));
  await p.screenshot({ path: `${OUT}/numbers.png` });

  // 4) Igloo services pin
  const sv = await yOf('.services');
  await wheelTo(sv + 10); await p.screenshot({ path: `${OUT}/services-0.png` });
  const s0 = await p.evaluate(() => [...document.querySelectorAll('.svc__shard')].map((s) => +getComputedStyle(s).opacity));
  const seq = []; let pinnedSeen = false;
  for (let k = 1; k <= 12; k++) {
    await wheelTo(sv + k * 180);
    const r = await p.evaluate(() => ({ op: [...document.querySelectorAll('.svc__shard')].map((s) => +getComputedStyle(s).opacity), pinned: Math.abs(document.querySelector('[data-services]').getBoundingClientRect().top) < 2 }));
    pinnedSeen = pinnedSeen || r.pinned;
    const idx = r.op.indexOf(Math.max(...r.op));
    if (seq[seq.length - 1] !== idx) seq.push(idx);
    if (k === 5) await p.screenshot({ path: `${OUT}/services-1.png` });
  }
  ok('services pinned while shards change', pinnedSeen);
  ok('shards advance 1 → 2 → 3 through the pin', JSON.stringify(seq) === '[0,1,2]', JSON.stringify(seq) + ' first=' + JSON.stringify(s0));
  // 5) ERA circle + map
  await wheelTo(await yOf('.opener', 0.25)); await p.screenshot({ path: `${OUT}/opener.png` });
  const pr = await yOf('.process');
  await wheelTo(pr + 10);
  const d0 = await p.evaluate(() => +getComputedStyle(document.querySelector('[data-map-path]')).strokeDashoffset.replace('px', ''));
  await wheelTo(pr + 1100); await p.screenshot({ path: `${OUT}/map.png` });
  const d1 = await p.evaluate(() => ({ off: +getComputedStyle(document.querySelector('[data-map-path]')).strokeDashoffset.replace('px', ''), on: [...document.querySelectorAll('.station')].map((s) => +getComputedStyle(s).opacity) }));
  ok('map line draws on scroll and stations appear', d1.off < d0 && d1.on.filter((o) => o > 0.9).length >= 2, `${d0.toFixed(0)} → ${d1.off.toFixed(0)} ${JSON.stringify(d1.on)}`);
  ok('chrome follows the ember chapter', await p.evaluate(() => document.documentElement.dataset.chrome === 'ember'));

  // 6) work block → AUGE shrink/grey → ember wipe → case
  await wheelTo(await yOf('.work', 0.1));
  const box = await p.locator('.work__img').boundingBox();
  await p.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await p.waitForTimeout(250); await p.screenshot({ path: `${OUT}/wipe-1.png` });
  await p.waitForTimeout(500); await p.screenshot({ path: `${OUT}/wipe-2.png` });
  await p.waitForURL('**/work/my-mithila/**', { timeout: 6000 });
  await p.waitForTimeout(200); await p.screenshot({ path: `${OUT}/arrive-1.png` });
  await p.waitForTimeout(1800); await p.screenshot({ path: `${OUT}/arrive-2.png` });
  ok('case reached via wipe; overlay cleared', !(await p.evaluate(() => document.querySelector('.wipe').classList.contains('is-active'))));
  ok('case title decoded back to plain text', (await p.evaluate(() => [...document.querySelectorAll('.c-line')].map((e) => e.textContent).join(' '))) === 'My Mithila');
  // case: perspective panels settle, curved return, kit
  const dark = await yOf('.c-dark', 0.9);
  await wheelTo(dark); await p.screenshot({ path: `${OUT}/case-dark.png` });
  const rot = await p.evaluate(() => getComputedStyle(document.querySelector('.panel')).transform);
  ok('palette panels settle into the picture plane', rot === 'none' || /matrix\(1, 0, 0, 1, 0, 0\)|matrix3d\(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1\)/.test(rot), rot.slice(0, 60));
  ok('no page errors (desktop flow)', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

// 7) keyboard, menu, form, careers (mobile)
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.addInitScript(() => sessionStorage.setItem('tf-intro', '1'));
  await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  await p.keyboard.press('Tab');
  ok('first Tab focuses skip link', await p.evaluate(() => document.activeElement.classList.contains('skip-link')));
  await p.click('.menu-square'); await p.waitForTimeout(1000);
  await p.screenshot({ path: `${OUT}/menu-390.png` });
  ok('menu square opens the menu', (await p.getAttribute('.menu-square', 'aria-expanded')) === 'true');
  ok('focus moved into menu', await p.evaluate(() => document.getElementById('menu').contains(document.activeElement)));
  for (let i = 0; i < 12; i++) await p.keyboard.press('Tab');
  ok('focus trapped in menu + toggle', await p.evaluate(() => document.getElementById('menu').contains(document.activeElement) || document.activeElement.classList.contains('menu-square')));
  await p.keyboard.press('Escape'); await p.waitForTimeout(900);
  ok('Escape closes menu, focus returns to the square', await p.evaluate(() => !document.body.classList.contains('menu-open') && document.activeElement.classList.contains('menu-square')));
  ok('hero strip is natively scrollable on touch', (await p.evaluate(() => getComputedStyle(document.querySelector('.strip--hero')).overflowX)) === 'auto');
  await p.evaluate(() => document.getElementById('enquiry').scrollIntoView());
  await p.click('.form__submit'); await p.waitForTimeout(200);
  ok('form shows validation on empty submit', (await p.textContent('.form__status')).length > 5);
  ok('invalid field flagged', (await p.getAttribute('#f-name', 'aria-invalid')) === 'true');
  await p.goto(BASE + 'careers/index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
  await p.click('.role button >> nth=0'); await p.waitForTimeout(900);
  ok('careers accordion opens', (await p.getAttribute('.role button >> nth=0', 'aria-expanded')) === 'true' && await p.isVisible('#r1'));
  ok('apply link points to the Google Form', (await p.getAttribute('#r1 a', 'href')) === 'https://forms.gle/hJoBoTJDMgsCnCJu9');
  await ctx.close();
}

// 8) focus ring visibility (desktop)
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.addInitScript(() => sessionStorage.setItem('tf-intro', '1'));
  await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  const outlines = [];
  for (let i = 0; i < 10; i++) { await p.keyboard.press('Tab'); outlines.push(await p.evaluate(() => { const s = getComputedStyle(document.activeElement); return document.activeElement.tagName + ':' + s.outlineStyle; })); }
  ok('visible focus ring on the first 10 tab stops', outlines.filter((o) => !o.startsWith('BODY')).every((o) => o.endsWith('solid')), outlines.join(' '));
  await ctx.close();
}
await b.close();
console.log(log.join('\n'));
fs.writeFileSync(`${OUT}/../motion-results.txt`, log.join('\n'));
if (log.some((l) => l.startsWith('FAIL'))) process.exitCode = 1;
