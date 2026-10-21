// Cursor label over [data-cursor] (fine pointers only) and magnetic CTAs [data-magnet].
import { gsap } from '../core/gsap.js';
import { env, qs, qsa } from '../core/env.js';

export function initCursor() {
  const c = qs('#cursor');
  if (!c || !env.finePointer) return;
  const xTo = gsap.quickTo(c, 'x', { duration: 0.45, ease: 'power3' });
  const yTo = gsap.quickTo(c, 'y', { duration: 0.45, ease: 'power3' });
  window.addEventListener('pointermove', (e) => { xTo(e.clientX + 16); yTo(e.clientY + 16); }, { passive: true });
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[data-cursor]');
    if (t) { c.textContent = t.dataset.cursor; c.classList.add('is-on'); }
  });
  document.addEventListener('pointerout', (e) => {
    const t = e.target.closest('[data-cursor]');
    if (t && !t.contains(e.relatedTarget)) c.classList.remove('is-on');
  });

  if (env.reduced) return;
  qsa('[data-magnet]').forEach((el) => {
    const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    const my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      mx((e.clientX - r.left - r.width / 2) * 0.18); my((e.clientY - r.top - r.height / 2) * 0.3);
    });
    el.addEventListener('pointerleave', () => { mx(0); my(0); });
  });
}
