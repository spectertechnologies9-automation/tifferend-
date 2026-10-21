// Motion + interaction checks with real input (session-5 structure): node tests/motion.mjs [baseUrl]
// Needs the production preview running (npm run build && npm run preview).
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:4173/';
const OUT = process.env.SHOTS || 'tests/motion';
fs.mkdirSync(OUT, { recursive: true });
const log = [];
const ok = (name, cond, extra = '') => log.push(`${cond ? 'PASS' : 'FAIL'}  ${name} ${extra}`);
const b = await chromium.launch();

const scrollStep = async (p, y, steps = 14) => {
  const cur = await p.evaluate(() => scrollY);
  for (let k = 1; k <= steps; k++) { await p.evaluate((yy) => window.scrollTo(0, yy), cur + ((y - cur) * k) / steps); await p.waitForTimeout(45); }
  await p.waitForTimeout(900);
};
const yOf = (p, sel, f = 0) => p.evaluate(([s, f]) => document.querySelector(s).getBoundingClientRect().top + scrollY + f * innerHeight, [sel, f]);

/* ---------------- desktop 1440 ---------------- */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));

  // 1) LN loader: lime field, then a stepped wipe out
  await p.goto(BASE + 'index.html');
  await p.waitForTimeout(500); await p.screenshot({ path: `${OUT}/loader-500.png` });
  const during = await p.evaluate(() => ({ shown: !document.getElementById('loader').hidden, loading: document.documentElement.classList.contains('is-loading') }));
  await p.waitForTimeout(2000); await p.screenshot({ path: `${OUT}/loader-2500.png` });
  await p.waitForTimeout(1500); await p.screenshot({ path: `${OUT}/arrive.png` });
  const after = await p.evaluate(() => ({ hidden: document.getElementById('loader').hidden, loading: document.documentElement.classList.contains('is-loading'), wipe: document.getElementById('wipe').hidden, flag: sessionStorage.getItem('tf-intro') }));
  ok('loader shows on first visit', during.shown && during.loading, JSON.stringify(during));
  ok('loader completes and wipes out', after.hidden && !after.loading && after.wipe && after.flag === '1', JSON.stringify(after));
  await p.reload(); await p.waitForTimeout(400);
  ok('loader skipped on repeat visit', await p.evaluate(() => document.getElementById('loader').hidden && !document.documentElement.classList.contains('is-loading')));
  await p.waitForTimeout(1500);

  // 2) hero lens follows the pointer with lag; headline uses the difference blend
  const lens = () => p.evaluate(() => { const s = getComputedStyle(document.querySelector('.hero__diff')); return { x: parseFloat(s.getPropertyValue('--x1')), y: parseFloat(s.getPropertyValue('--y1')), r: parseFloat(s.getPropertyValue('--r1')) }; });
  const l0 = await lens();
  await p.mouse.move(820, 300, { steps: 8 }); await p.waitForTimeout(120);
  const lMid = await lens(); await p.waitForTimeout(900);
  const l1 = await lens();
  await p.screenshot({ path: `${OUT}/hero-lens.png` });
  ok('hero lens opens to its rest radius', l0.r > 100, JSON.stringify(l0));
  ok('hero lens follows the pointer (lagged)', l1.x > 60 && l1.y < 40 && lMid.x < l1.x, `${JSON.stringify(lMid)} → ${JSON.stringify(l1)}`);
  ok('hero headline blends with difference', await p.evaluate(() => getComputedStyle(document.querySelector('.hero__title')).mixBlendMode === 'difference'));

  // 3) philosophy: chrome flips light, LN bars retract and leave
  await scrollStep(p, await yOf(p, '.philo', 0.35));
  await p.waitForTimeout(1200);
  ok('chrome turns light over the olive chapter', await p.evaluate(() => document.documentElement.dataset.chrome === 'light'));
  ok('LN highlight bars retract and are removed', await p.evaluate(() => document.querySelectorAll('.philo__state .bar').length === 0 && document.querySelector('.philo__state').classList.contains('is-split')));
  await p.screenshot({ path: `${OUT}/philo.png` });

  // 4) work: background interpolates olive → forest → bone
  await scrollStep(p, await yOf(p, '.collage', 0.2));
  const mid = await p.evaluate(() => getComputedStyle(document.querySelector('.work')).backgroundColor);
  await scrollStep(p, await yOf(p, '.svc', -0.45));
  const end = await p.evaluate(() => getComputedStyle(document.querySelector('.work')).backgroundColor);
  ok('work background interpolates to forest, then bone', /rgb\(14, 90, 46\)/.test(mid) && /rgb\(24[0-9], 2[34][0-9], 2[23][0-9]\)/.test(end), `${mid} → ${end}`);

  // 5) Igloo services: sticky stage, one subject per screen 01 → 02 → 03, HUD decodes to the real label
  const sv = await yOf(p, '.svc');
  const seq = []; let stuck = true;
  for (const f of [0.3, 0.8, 1.4, 1.9, 2.5, 3.0]) {
    await scrollStep(p, sv + f * 900, 6);
    const r = await p.evaluate(() => ({ n: document.querySelector('[data-svc-n]').textContent, top: Math.round(document.querySelector('.svc__stage').getBoundingClientRect().top) }));
    stuck = stuck && r.top === 0;
    if (seq[seq.length - 1] !== r.n) seq.push(r.n);
    if (f === 1.4) await p.screenshot({ path: `${OUT}/services-2.png` });
  }
  await p.waitForTimeout(900);
  const label = await p.evaluate(() => document.querySelectorAll('[data-decode]')[2].textContent);
  ok('services stage stays pinned (sticky)', stuck);
  ok('services advance 01 → 02 → 03', seq.join() === '01,02,03', seq.join());
  ok('HUD label decodes to the real text', /Service_03 \/\/ Digital & growth marketing/i.test(label), label);

  // 6) numbers count up; chrome follows the ink chapter
  await scrollStep(p, await yOf(p, '.nums', 0.1)); await p.waitForTimeout(1800);
  ok('numbers count up to their values', await p.evaluate(() => [...document.querySelectorAll('[data-count]')].map((e) => e.textContent).join() === '50,200,8,5'));

  // 7) ERA opener disc rises and fills, then the map draws its route and stations
  const op = await yOf(p, '.opener');
  await scrollStep(p, op + 0.3 * 900);
  const d1 = await p.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.opener__disc')).transform).m42);
  await p.screenshot({ path: `${OUT}/opener.png` });
  ok('ERA disc rises with the scroll', d1 < -150, `y=${d1.toFixed(0)}`);
  const mp = await yOf(p, '.map');
  await scrollStep(p, mp + 1.65 * 900); await p.waitForTimeout(900);
  const map = await p.evaluate(() => ({ off: parseFloat(getComputedStyle(document.querySelector('.map__line path')).strokeDashoffset), op: [...document.querySelectorAll('.map__st')].map((s) => +getComputedStyle(s).opacity) }));
  await p.screenshot({ path: `${OUT}/map.png` });
  ok('map line draws and all stations appear', map.off < 0.1 && map.op.every((o) => o > 0.9), JSON.stringify(map));

  // 8) menu: opens, traps focus, Esc closes and returns focus
  await p.click('.menu-btn'); await p.waitForTimeout(900);
  const open = await p.evaluate(() => ({ open: document.getElementById('menu').classList.contains('is-open'), focus: document.activeElement?.closest('#menu') !== null }));
  await p.screenshot({ path: `${OUT}/menu.png` });
  await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  const closed = await p.evaluate(() => ({ open: document.getElementById('menu').classList.contains('is-open'), focusBtn: document.activeElement?.classList.contains('menu-btn') }));
  ok('menu opens with focus inside', open.open && open.focus, JSON.stringify(open));
  ok('Esc closes the menu and returns focus', !closed.open && closed.focusBtn, JSON.stringify(closed));

  // 9) form validation
  await scrollStep(p, await yOf(p, '#enquiry', -0.2));
  await p.click('#enquiry button[type=submit]');
  ok('form validates required fields', await p.evaluate(() => document.querySelector('#enquiry [name=name]').getAttribute('aria-invalid') === 'true' && /fill in/.test(document.querySelector('.form__status').textContent)));

  // 10) in-site transition: stepped lime wipe → case page → wipe clears
  await scrollStep(p, await yOf(p, '.collage__text', -0.4));
  await p.click('.collage__text .btn');
  await p.waitForTimeout(350); await p.screenshot({ path: `${OUT}/wipe-in.png` });
  await p.waitForURL(/my-mithila/, { timeout: 8000 });
  await p.waitForTimeout(250); await p.screenshot({ path: `${OUT}/wipe-out.png` });
  await p.waitForTimeout(1600);
  ok('wipe navigates to the case and clears', await p.evaluate(() => document.getElementById('wipe').hidden && !document.documentElement.classList.contains('is-wiping')));

  // 11) case: palette fills, social diary fans out
  await scrollStep(p, await yOf(p, '.c-pal__grid', -0.3)); await p.waitForTimeout(1600);
  ok('palette cells fill', await p.evaluate(() => [...document.querySelectorAll('.sw')].every((s) => parseFloat(getComputedStyle(s).getPropertyValue('--fill')) > 0.95)));
  const fan = await yOf(p, '.c-fan');
  await scrollStep(p, fan + 1.4 * 900); await p.waitForTimeout(1000);
  const rot = await p.evaluate(() => { const c = [...document.querySelectorAll('.fc')]; const m = new DOMMatrix(getComputedStyle(c[c.length - 1]).transform); return Math.round((Math.atan2(m.b, m.a) * 180) / Math.PI); });
  await p.screenshot({ path: `${OUT}/case-fan.png` });
  ok('social cards fan out (LN)', rot > 30, `last card ${rot}°`);

  // 12) careers accordion + apply link
  await p.goto(BASE + 'careers/index.html'); await p.waitForTimeout(1500);
  await scrollStep(p, await yOf(p, '.roles', 0));
  await p.click('.role__btn'); await p.waitForTimeout(900);
  const acc = await p.evaluate(() => ({ exp: document.querySelector('.role__btn').getAttribute('aria-expanded'), vis: !document.getElementById('r1').hidden, href: document.querySelector('#r1 a').href }));
  await p.screenshot({ path: `${OUT}/careers-role.png` });
  ok('careers accordion opens with a working apply link', acc.exp === 'true' && acc.vis && acc.href.includes('forms.gle/hJoBoTJDMgsCnCJu9'), JSON.stringify(acc));

  // 13) keyboard: skip link first, visible focus ring
  await p.goto(BASE + 'index.html'); await p.waitForTimeout(1200);
  await p.keyboard.press('Tab');
  const skip = await p.evaluate(() => ({ cls: document.activeElement.className, top: document.activeElement.getBoundingClientRect().top }));
  ok('skip link is the first tab stop and becomes visible', skip.cls === 'skip' && skip.top >= 0, JSON.stringify(skip));
  ok('no page errors (desktop)', errs.length === 0, errs.slice(0, 3).join(' | '));
  await ctx.close();
}

/* ---------------- phone 390 (touch) ---------------- */
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.addInitScript(() => sessionStorage.setItem('tf-intro', '1'));
  await p.goto(BASE + 'index.html'); await p.waitForTimeout(1500);
  const a = await p.evaluate(() => getComputedStyle(document.querySelector('.hero__diff')).getPropertyValue('--x1'));
  await p.waitForTimeout(3500);
  const c = await p.evaluate(() => getComputedStyle(document.querySelector('.hero__diff')).getPropertyValue('--x1'));
  await p.screenshot({ path: `${OUT}/m-hero.png` });
  ok('phone: idle lens drifts on its own', a !== c, `${a} → ${c}`);
  ok('phone: services are stacked screens (no pin)', await p.evaluate(() => !document.querySelector('.svc').classList.contains('is-pinned') && document.querySelector('.svc__item').offsetHeight > 600));
  await p.click('.menu-btn'); await p.waitForTimeout(900);
  await p.screenshot({ path: `${OUT}/m-menu.png` });
  ok('phone: menu opens', await p.evaluate(() => document.getElementById('menu').classList.contains('is-open')));
  ok('no page errors (phone)', errs.length === 0, errs.slice(0, 3).join(' | '));
  await ctx.close();
}

/* ---------------- reduced motion ---------------- */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(BASE + 'index.html'); await p.waitForTimeout(1200);
  const r = await p.evaluate(() => ({
    loader: document.getElementById('loader').hidden,
    bars: document.querySelectorAll('.bar').length,
    hidden: [...document.querySelectorAll('[data-bars],[data-type],[data-chars],[data-lines],[data-rise]')].filter((e) => getComputedStyle(e).visibility === 'hidden' || +getComputedStyle(e).opacity < 1).length,
    pinned: document.querySelector('.svc').classList.contains('is-pinned') || document.querySelector('.map').classList.contains('is-pinned'),
    marquee: document.querySelector('[data-marquee]').classList.contains('is-static'),
  }));
  ok('reduced motion: no loader, no bars, nothing hidden, no pins, static marquees', r.loader && r.bars === 0 && r.hidden === 0 && !r.pinned && r.marquee, JSON.stringify(r));
  await ctx.close();
}

await b.close();
fs.writeFileSync('tests/motion-results.txt', log.join('\n') + '\n');
console.log(log.join('\n'));
if (log.some((l) => l.startsWith('FAIL'))) process.exitCode = 1;
