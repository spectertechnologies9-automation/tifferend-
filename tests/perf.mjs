// Real measurements on the production build: node tests/perf.mjs [baseUrl]
import { chromium } from 'playwright';
const BASE = process.argv[2] || 'http://localhost:4173/';
const b = await chromium.launch();
for (const [label, vp, mobile] of [['desktop 1440', { width: 1440, height: 900 }, false], ['mobile 390 (4x CPU, Fast 3G-ish)', { width: 390, height: 844 }, true]]) {
  for (const path of ['index.html', 'work/my-mithila/index.html', 'careers/index.html']) {
    const ctx = await b.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
    const p = await ctx.newPage();
    const cdp = await ctx.newCDPSession(p);
    await cdp.send('Network.enable');
    if (mobile) {
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
    }
    let bytes = 0; cdp.on('Network.loadingFinished', (e) => { bytes += e.encodedDataLength; });
    await p.addInitScript(() => {
      sessionStorage.setItem('tf-intro', '1');
      window.__lcp = 0; window.__cls = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    const t0 = Date.now();
    await p.goto(BASE + path, { waitUntil: 'load' });
    const loadMs = Date.now() - t0;
    await p.waitForTimeout(2500);
    const m = await p.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(3), dcl: Math.round(performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd) }));
    console.log(`${label.padEnd(34)} ${path.padEnd(28)} transfer=${(bytes / 1024).toFixed(0)}KB load=${loadMs}ms DCL=${m.dcl}ms LCP=${m.lcp}ms CLS=${m.cls}`);
    await ctx.close();
  }
}
await b.close();
