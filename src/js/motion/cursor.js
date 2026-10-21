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
