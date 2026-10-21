// Cross-browser smoke: node tests/xbrowser.mjs [outDir]  (preview must be running)
// For WebKit + Firefox (+ Chromium for reference): page errors, failed requests, element-edge overflow,
// still-hidden reveals, and screenshots of the scroll-driven chapters.
import { chromium, webkit, firefox } from 'playwright';
import fs from 'node:fs';
const BASE = 'http://localhost:4173/';
const OUT = process.argv[2] || 'tests/xbrowser';
fs.mkdirSync(OUT, { recursive: true });
const pages = [['home', 'index.html', ['.work@0.7', '.services@1.2', '.process@0.9']], ['case', 'work/my-mithila/index.html', ['.c-dark@0.9', '.c-next@0.2']], ['careers', 'careers/index.html', []]];
let bad = 0;
for (const [bn, bt] of [['webkit', webkit], ['firefox', firefox], ['chromium', chromium]]) {
  const br = await bt.launch();
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    for (const [name, path, shots] of pages) {
      const mobile = w < 768;
      const ctx = await br.newContext({ viewport: { width: w, height: h }, hasTouch: mobile, ...(bn !== 'firefox' && { isMobile: mobile }) });
      const p = await ctx.newPage();
      const errs = [], failed = [];
      p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
      p.on('response', (r) => r.status() >= 400 && failed.push(r.status() + ' ' + r.url()));
      await p.addInitScript(() => sessionStorage.setItem('tf-intro', '1'));
      await p.goto(BASE + path, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
      await p.screenshot({ path: `${OUT}/${bn}-${name}-${w}-top.png` });
      for (const s of shots) {
        const [sel, off] = s.split('@');
        const y = await p.evaluate(([sel, off]) => document.querySelector(sel).getBoundingClientRect().top + scrollY + parseFloat(off) * innerHeight, [sel, off]);
        const cur = await p.evaluate(() => scrollY);
        for (let k = 1; k <= 10; k++) { await p.evaluate((yy) => window.scrollTo(0, yy), cur + (y - cur) * k / 10); await p.waitForTimeout(70); }
        await p.waitForTimeout(1400);
        await p.screenshot({ path: `${OUT}/${bn}-${name}-${w}-${sel.replace(/\W/g, '')}.png` });
      }
      const total = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < total; y += h * 0.7) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(110); }
      await p.waitForTimeout(800);
      const res = await p.evaluate(() => {
        const vw = document.documentElement.clientWidth, off = [];
        document.querySelectorAll('body *').forEach((el) => { if (el.ownerSVGElement) return; // svg internals: UA clips svg overflow; Firefox counts stroke in the bbox
        if (el.closest('.strip, .fog, .opener, .wipe, .menu, .loader, .kit, .c-full, .cursor, .work__title')) return; const r = el.getBoundingClientRect(); if (r.width && (r.right > vw + 1 || r.left < -1)) off.push(el.tagName + '.' + el.className + ' ' + Math.round(r.left) + '→' + Math.round(r.right)); });
        const hidden = [...document.querySelectorAll('[data-reveal]')].filter((el) => getComputedStyle(el).visibility === 'hidden' || getComputedStyle(el).opacity === '0').length;
        return { off: off.slice(0, 4), hidden };
      });
      const fail = errs.length || failed.length || res.off.length || res.hidden;
      if (fail) bad++;
      console.log(`${fail ? 'ISSUE' : 'ok   '} ${bn.padEnd(8)} ${name.padEnd(7)} ${w}  err=${errs.length} fail=${failed.length} overflow=${res.off.length} hidden=${res.hidden}${fail ? ' ' + JSON.stringify({ errs: errs.slice(0, 2), failed: failed.slice(0, 2), off: res.off }) : ''}`);
      await ctx.close();
    }
  }
  await br.close();
}
if (bad) process.exitCode = 1;
