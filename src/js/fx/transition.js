// Loader (LN 53–58 s) and page transitions: a lime field built from stepped bars that slide in and out.
import { gsap } from '../core/gsap.js';
import { env, qs, qsa } from '../core/env.js';
import { stopScroll, startScroll } from '../core/smooth.js';

const html = document.documentElement;
const N = 6;
const ORDER = [2, 0, 4, 1, 5, 3]; // uneven stagger reads as "stepped", like LN's bars
let bars = [];
let glyph;
let resolveIntro;
export const introDone = new Promise((r) => { resolveIntro = r; });

function buildWipe() {
  const wipe = qs('#wipe');
  if (!wipe || bars.length) return wipe;
  for (let i = 0; i < N; i++) {
    const b = document.createElement('span');
    b.className = 'wipe__bar';
    b.style.top = `calc(${(i * 100) / N}% - 1px)`;
    b.style.height = `calc(${100 / N}% + 2px)`;
    wipe.appendChild(b); bars.push(b);
  }
  glyph = document.createElement('span');
  glyph.className = 'wipe__glyph'; glyph.textContent = 't.';
  wipe.appendChild(glyph);
  return wipe;
}
const ordered = () => ORDER.map((i) => bars[i]);

export function coverIn() {
  const wipe = buildWipe();
  wipe.hidden = false;
  return new Promise((res) => {
    gsap.timeline({ onComplete: res })
      .fromTo(ordered(), { xPercent: 101 }, { xPercent: 0, duration: 0.7, ease: 'expo.inOut', stagger: 0.05 })
      .to(glyph, { opacity: 1, duration: 0.2 }, '-=0.2');
  });
}

export function coverOut(delay = 0) {
  const wipe = buildWipe();
  wipe.hidden = false;
  gsap.set(bars, { xPercent: 0 });
  return new Promise((res) => {
    gsap.timeline({ delay, onComplete: () => { wipe.hidden = true; res(); } })
      .to(glyph, { opacity: 0, duration: 0.2 }, 0)
      .to(ordered(), { xPercent: -101, duration: 0.8, ease: 'expo.inOut', stagger: 0.05 }, 0.05);
  });
}

function runLoader() {
  const loader = qs('#loader');
  if (!loader || !html.classList.contains('is-loading')) { html.classList.remove('is-loading'); resolveIntro(); return; }
  loader.hidden = false;
  stopScroll();
  window.scrollTo(0, 0);
  const glyphs = qsa('.loader__glyph span', loader);
  const words = ['Brand', 'Design', 'Identity', 'Story', 'Strategy', 'Craft'];
  const wordEl = qs('[data-loader-word]', loader);
  const countEl = qs('[data-loader-count]', loader);
  let gi = 0;
  const cycle = setInterval(() => {
    glyphs[gi].classList.remove('on'); gi = (gi + 1) % glyphs.length; glyphs[gi].classList.add('on');
    wordEl.textContent = words[gi % words.length];
  }, 260);
  const c = { v: 0 };
  const finish = () => {
    clearInterval(cycle);
    buildWipe();
    gsap.set(bars, { xPercent: 0 }); qs('#wipe').hidden = false;
    loader.hidden = true;
    html.classList.remove('is-loading');
    try { sessionStorage.setItem('tf-intro', '1'); } catch (e) { /* private mode */ }
    startScroll();
    resolveIntro();
    coverOut(0.05);
  };
  const tl = gsap.to(c, { v: 100, duration: 1.9, ease: 'power2.inOut', onUpdate: () => { countEl.textContent = String(Math.round(c.v)).padStart(2, '0'); }, onComplete: finish });
  // any key or click skips the wait
  const skip = () => { tl.progress(1); window.removeEventListener('keydown', skip); loader.removeEventListener('pointerdown', skip); };
  window.addEventListener('keydown', skip);
  loader.addEventListener('pointerdown', skip);
}

export function initTransitions() {
  // arrival through the in-site wipe
  if (html.classList.contains('is-wiping')) {
    buildWipe();
    gsap.set(bars, { xPercent: 0 }); qs('#wipe').hidden = false; gsap.set(glyph, { opacity: 1 });
    html.classList.remove('is-wiping');
    try { sessionStorage.removeItem('tf-wipe'); } catch (e) { /* ignore */ }
    coverOut(0.15);
  }
  runLoader();

  if (env.reduced) return;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname) return; // same page (+hash) is handled by anchors
    e.preventDefault();
    coverIn().then(() => {
      try { sessionStorage.setItem('tf-wipe', '1'); } catch (err) { /* ignore */ }
      location.href = url.href;
    });
  });
  // back/forward cache: never come back to a covered page
  window.addEventListener('pageshow', (e) => { if (e.persisted) { const w = qs('#wipe'); if (w) w.hidden = true; } });
}
