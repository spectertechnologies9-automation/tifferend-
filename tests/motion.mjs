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
  // 4b) services HOLD: inside each hold the active shard is sharp and its HUD readable (session 4)
  const holdState = () => p.evaluate(() => [...document.querySelectorAll('[data-svc]')].map((li) => ({ o: +(+getComputedStyle(li.querySelector('.svc__shard')).opacity).toFixed(2), blur: getComputedStyle(li.querySelector('.svc__shard')).filter, hud: +(+getComputedStyle(li.querySelector('.svc__hud')).opacity).toFixed(2) })));
  await wheelTo(sv + 0.22 * 900); const h0 = await holdState();
  await wheelTo(sv + 1.22 * 900); const h1 = await holdState();
  const sharp = (h) => h.o > 0.97 && h.hud > 0.97 && !/blur\((?!0px)/.test(h.blur);
  ok('services hold: service 1 sharp + HUD readable', sharp(h0[0]), JSON.stringify(h0[0]));
  ok('services hold: service 2 sharp + HUD readable', sharp(h1[1]), JSON.stringify(h1[1]));
  // 5) ERA circle + map
  await wheelTo(await yOf('.opener', 0.25)); await p.screenshot({ path: `${OUT}/opener.png` });
  const pr = await yOf('.process');
  await wheelTo(pr + 10);
  const d0 = await p.evaluate(() => +getComputedStyle(document.querySelector('[data-map-path]')).strokeDashoffset.replace('px', ''));
  await wheelTo(pr + 1100); await p.screenshot({ path: `${OUT}/map.png` });
  const d1 = await p.evaluate(() => ({ off: +getComputedStyle(document.querySelector('[data-map-path]')).strokeDashoffset.replace('px', ''), on: [...document.querySelectorAll('.station')].map((s) => +getComputedStyle(s).opacity) }));
  ok('map line draws on scroll and stations appear', d1.off < d0 && d1.on.filter((o) => o > 0.9).length >= 2, `${d0.toFixed(0)} → ${d1.off.toFixed(0)} ${JSON.stringify(d1.on)}`);
  ok('chrome follows the ember chapter', await p.evaluate(() => document.documentElement.dataset.chrome === 'ember'));

  // 5b) AUGE work: the frame opens and parts the name (scrubbed --p, pinned)
  const wk = await yOf('.work');
  const workState = () => p.evaluate(() => { const sec = document.querySelector('.work'); const r = (s) => document.querySelector(s).getBoundingClientRect(); return { p: +getComputedStyle(sec).getPropertyValue('--p'), frame: Math.round(r('.work__img').width), pinned: Math.abs(r('[data-work]').top) < 2, l: Math.round(r('.work__w--l').right), rr: Math.round(r('.work__w--r').left) }; });
  await wheelTo(wk + 5); const w0 = await workState();
  await wheelTo(wk + 0.7 * 900); const w1 = await workState();
  await wheelTo(wk + 1.3 * 900); const w2 = await workState(); await p.screenshot({ path: `${OUT}/work-open.png` });
  ok('work frame opens with scroll while pinned', w0.p < 0.1 && w1.p > w0.p && w2.p > 0.95 && w1.pinned, JSON.stringify([w0.p, w1.p, w2.p]));
  ok('work title parts as the frame opens', w2.l < w0.l && w2.rr > w0.rr, JSON.stringify({ l: [w0.l, w2.l], r: [w0.rr, w2.rr] }));

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
  // case A11: the next block's window opens as it reaches the centre
  await wheelTo(await yOf('.c-next', 0.2)); await p.screenshot({ path: `${OUT}/case-next.png` });
  const q = await p.evaluate(() => +getComputedStyle(document.querySelector('[data-next]')).getPropertyValue('--q'));
  ok('case next-block window opens on scroll', q > 0.9, String(q));
  ok('no page errors (desktop flow)', errs.length === 0, errs.join(' | '));
  await ctx.close();
}

// 6b) anchors through Lenis + pins (desktop): menu links and the numbers pill land on their chapter
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(() => sessionStorage.setItem('tf-intro', '1'));
  await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  const land = [];
  for (const id of ['#services', '#work', '#contact', '#studio']) {
    await p.click('.menu-square'); await p.waitForTimeout(700);
    await p.click(`.menu a[href="${id}"]`); await p.waitForTimeout(2600);
    land.push([id, Math.round(await p.evaluate((s) => document.querySelector(s).getBoundingClientRect().top, id))]);
  }
  ok('menu anchors land on their chapter (Lenis + pins)', land.every(([, t]) => Math.abs(t) <= 4), JSON.stringify(land));
  await p.evaluate(() => window.scrollTo(0, document.querySelector('.numbers').offsetTop)); await p.waitForTimeout(800);
  await p.click('.pill-era'); await p.waitForTimeout(2600);
  const wt = Math.round(await p.evaluate(() => document.querySelector('#work').getBoundingClientRect().top));
  ok('"See our work" pill lands on the work chapter', Math.abs(wt) <= 4, String(wt));
  // reload inside the services pin restores the same scroll and the same service (manual restoration)
  const sy = await p.evaluate(() => Math.round(document.querySelector('.services').getBoundingClientRect().top + scrollY + 1.22 * innerHeight));
  await p.evaluate((y) => window.scrollTo(0, y), sy); await p.waitForTimeout(1500);
  const rb = await p.evaluate(() => document.querySelector('[data-svc-count]').textContent);
  await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
  const ra = await p.evaluate(() => ({ y: Math.round(scrollY), n: document.querySelector('[data-svc-count]').textContent }));
  ok('reload inside a pin restores scroll + state', Math.abs(ra.y - sy) <= 2 && ra.n === rb && rb === '02', JSON.stringify({ sy, rb, ra }));
  ok('no page errors (anchors)', errs.length === 0, errs.join(' | '));
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
