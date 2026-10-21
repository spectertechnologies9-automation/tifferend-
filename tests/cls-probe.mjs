// Attribute layout shifts to elements: node tests/cls-probe.mjs <path> [w h]
import { chromium } from 'playwright';
const [,, path = 'index.html', w = 1440, h = 900] = process.argv;
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: +w, height: +h } })).newPage();
await p.addInitScript(() => { sessionStorage.setItem('tf-intro', '1'); window.__ls = [];
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__ls.push({ v: +e.value.toFixed(4), t: Math.round(e.startTime), src: e.sources.map((s) => (s.node?.className || s.node?.nodeName || '?').toString().slice(0, 50)) }); }).observe({ type: 'layout-shift', buffered: true }); });
await p.goto('http://localhost:4173/' + path, { waitUntil: 'load' }); await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate(() => window.__ls), null, 1)); await b.close();
