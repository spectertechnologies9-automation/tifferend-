// Viewport screenshots at chapter positions: node tests/shoot.mjs <page> <w> <h> <outprefix> [sel1 sel2 ...]
import { chromium } from 'playwright';
const [,, path, w, h, out, ...sels] = process.argv;
const b = await chromium.launch();
const mobile = +w < 768;
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, isMobile: mobile, hasTouch: mobile });
const p = await ctx.newPage();
const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
await p.addInitScript(() => sessionStorage.setItem('tf-intro', '1'));
await p.goto('http://localhost:4173/' + path, { waitUntil: 'networkidle' });
await p.waitForTimeout(1800);
let i = 0;
await p.screenshot({ path: `${out}_${String(i++).padStart(2, '0')}_top.png` });
for (const s of sels) {
  const [sel, off] = s.split('@');
  const y = await p.evaluate(([sel, off]) => { const el = document.querySelector(sel); if (!el) return null; return el.getBoundingClientRect().top + scrollY + (off ? parseFloat(off) * innerHeight : 0); }, [sel, off]);
  if (y === null) { console.log('missing', sel); continue; }
  // scroll in steps so scrubbed/pinned sections update like real scrolling
  const cur = await p.evaluate(() => scrollY);
  const steps = 10; for (let k = 1; k <= steps; k++) { await p.evaluate((yy) => window.scrollTo(0, yy), cur + (y - cur) * k / steps); await p.waitForTimeout(60); }
  await p.waitForTimeout(1300);
  await p.screenshot({ path: `${out}_${String(i++).padStart(2, '0')}_${sel.replace(/[^a-z0-9]/gi, '')}${off ? '_' + off : ''}.png` });
}
console.log('errors:', errs.length ? errs : 'none');
await b.close();
