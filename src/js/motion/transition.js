import { gsap } from '../core/gsap.js';
import { env, qs } from '../core/env.js';
import { mixedDecode } from './text.js';

// AUGE A5–A7: chosen image shrinks / page greys → ember panel rises with a convex curved top →
// thumbnail + title decoding with mixed serif/grotesk glyphs → navigate → panel lifts on arrival.
const P = {
  hiddenBottom: 'M0 100 C 30 100 70 100 100 100 L 100 100 C 70 100 30 100 0 100 Z',
  rising: 'M0 58 C 30 14 70 14 100 58 L 100 100 C 70 100 30 100 0 100 Z',
  full: 'M0 0 C 30 0 70 0 100 0 L 100 100 C 70 100 30 100 0 100 Z',
  lifting: 'M0 0 C 30 0 70 0 100 0 L 100 42 C 70 6 30 6 0 42 Z',
  goneTop: 'M0 0 C 30 0 70 0 100 0 L 100 0 C 70 0 30 0 0 0 Z',
};
const KEY = 'tf-wipe';
let wipe, path, inner, label, thumb;

export function initTransitions() {
  wipe = qs('.wipe');
  if (!wipe) return;
  path = qs('path', wipe); inner = qs('.wipe__inner', wipe); label = qs('.wipe__label', wipe); thumb = qs('.wipe__thumb', wipe);
  let incoming = null;
  try { incoming = JSON.parse(sessionStorage.getItem(KEY) || 'null'); sessionStorage.removeItem(KEY); } catch (e) { /* blocked */ }
  if (incoming && !env.reduced) reveal(incoming);
  document.addEventListener('click', onClick);
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    wipe.classList.remove('is-active'); gsap.set(path, { attr: { d: P.hiddenBottom } }); gsap.set(inner, { opacity: 0 });
    gsap.set('main *', { clearProps: 'filter' });
    document.querySelectorAll('[data-shrunk]').forEach((n) => { gsap.set(n, { clearProps: 'scale' }); n.removeAttribute('data-shrunk'); });
  });
}

function isPageLink(a) {
  if (!a || a.target === '_blank' || a.hasAttribute('download')) return false;
  const href = a.getAttribute('href') || '';
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return false;
  if (url.pathname === location.pathname && url.hash) return false;
  return true;
}

function onClick(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest('a');
  if (!isPageLink(a)) return;
  if (a.closest('[data-strip]')?.dataset.dragged === '1') { e.preventDefault(); return; }
  if (env.reduced) return;
  e.preventDefault();
  const data = { label: a.dataset.transition || 'Tifferend', thumb: a.dataset.thumb ? new URL(a.dataset.thumb, location.href).href : '' };
  const img = a.querySelector('img');
  let lead = 0;
  if (img) {
    // AUGE A5: the chosen image shrinks while everything else desaturates
    img.setAttribute('data-shrunk', '');
    gsap.to(img, { scale: 0.82, duration: 0.7, ease: 'expo.inOut' });
    const others = [...document.querySelectorAll('main > section, .strip__item, .work > *')].filter((n) => !n.contains(a));
    gsap.to(others, { filter: 'grayscale(1) brightness(0.62)', duration: 0.5, ease: 'power2.out' });
    lead = 0.4;
  }
  gsap.delayedCall(lead, () => cover(data).then(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(data)); } catch (err) { /* ignore */ }
    window.location.href = a.href;
  }));
}

function fill(data) {
  if (data.thumb) { thumb.src = data.thumb; thumb.hidden = false; } else thumb.hidden = true;
}

export function cover(data) {
  return new Promise((resolve) => {
    wipe.classList.add('is-active');
    fill(data); label.textContent = '';
    gsap.timeline({ onComplete: resolve })
      .set(path, { attr: { d: P.hiddenBottom } })
      .to(path, { attr: { d: P.rising }, duration: 0.42, ease: 'power3.in' })
      .to(path, { attr: { d: P.full }, duration: 0.36, ease: 'power3.out' })
      .to(inner, { opacity: 1, duration: 0.2 }, '-=0.2')
      .add(() => mixedDecode(label, data.label, 0.7), '-=0.2')
      .to({}, { duration: 0.6 });
  });
}

function reveal(data) {
  wipe.classList.add('is-active');
  gsap.set(path, { attr: { d: P.full } });
  fill(data); label.textContent = data.label; gsap.set(inner, { opacity: 1 });
  const go = () => {
    document.dispatchEvent(new CustomEvent('tf:revealed'));
    gsap.timeline({ onComplete: () => { wipe.classList.remove('is-active'); gsap.set(path, { attr: { d: P.hiddenBottom } }); gsap.set(inner, { opacity: 0, y: 0 }); } })
      .to(inner, { opacity: 0, y: -40, duration: 0.45, ease: 'power2.in' }, 0.1)
      .to(path, { attr: { d: P.lifting }, duration: 0.45, ease: 'power3.in' }, 0.25)
      .to(path, { attr: { d: P.goneTop }, duration: 0.4, ease: 'power3.out' });
  };
  (document.fonts?.ready || Promise.resolve()).then(() => requestAnimationFrame(go));
}
