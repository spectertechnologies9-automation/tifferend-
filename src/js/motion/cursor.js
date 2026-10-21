import { gsap } from '../core/gsap.js';
import { env, qs } from '../core/env.js';
import { scramble } from './text.js';

// AUGE cursor: a small diamond that trails the pointer + an ember pill that decodes its label
// over [data-cursor] targets. Decorative only; the native cursor is untouched.
export function initCursor() {
  const root = qs('.cursor');
  if (!root || !env.finePointer || env.reduced) return;
  const pill = qs('.cursor__pill', root);
  const xTo = gsap.quickTo(root, 'x', { duration: 0.18, ease: 'power3.out' });
  const yTo = gsap.quickTo(root, 'y', { duration: 0.18, ease: 'power3.out' });
  let moved = false, px = 0, py = 0, current = null;

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    px = e.clientX; py = e.clientY;
    if (!moved) { moved = true; gsap.set(root, { x: px, y: py }); document.documentElement.classList.add('has-pointer'); update(e.target); }
    xTo(px); yTo(py);
  }, { passive: true });

  const update = (target) => {
    const t = target ? target.closest('[data-cursor]') : null;
    if (t === current) return;
    current = t;
    if (t) { gsap.to(pill, { opacity: 1, scale: 1, duration: 0.35, ease: 'expo.out', overwrite: true }); scramble(pill, t.dataset.cursor, { duration: 0.45 }); }
    else gsap.to(pill, { opacity: 0, scale: 0.7, duration: 0.25, ease: 'power2.out', overwrite: true });
  };
  document.addEventListener('pointerover', (e) => { if (moved && e.pointerType === 'mouse') update(e.target); });
  document.documentElement.addEventListener('pointerleave', () => { update(null); document.documentElement.classList.remove('has-pointer'); moved = false; });
  let raf = 0;
  window.addEventListener('scroll', () => {
    if (!moved || raf) return;
    raf = requestAnimationFrame(() => { raf = 0; update(document.elementFromPoint(px, py)); });
  }, { passive: true });
}

// Magnet (vanilla port of the React Bits "Magnet" idea): [data-magnet="strength"] elements lean
// toward the pointer when it comes within reach, and settle back when it leaves. Fine pointers only.
export function initMagnets() {
  if (!env.finePointer || env.reduced) return;
  const els = [...document.querySelectorAll('[data-magnet]')];
  if (!els.length) return;
  const reach = 70;
  const state = new Map(els.map((el) => [el, false]));
  let raf = 0, px = 0, py = 0;
  const tick = () => {
    raf = 0;
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const inside = Math.abs(px - cx) < r.width / 2 + reach && Math.abs(py - cy) < r.height / 2 + reach;
      const k = Number(el.dataset.magnet) || 0.3;
      if (inside) { state.set(el, true); gsap.to(el, { '--mx': `${(px - cx) * k}px`, '--my': `${(py - cy) * k}px`, duration: 0.5, ease: 'power3.out', overwrite: 'auto' }); }
      else if (state.get(el)) { state.set(el, false); gsap.to(el, { '--mx': '0px', '--my': '0px', duration: 0.8, ease: 'expo.out', overwrite: 'auto' }); }
    });
  };
  window.addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') return; px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
}
