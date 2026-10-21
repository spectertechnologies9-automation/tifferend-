import { gsap, ScrollTrigger } from '../core/gsap.js';
import { env, qs, qsa } from '../core/env.js';

/**
 * ERA chrome behaviour: badge rotates with scroll, rail counts 00→100,
 * chrome colour follows the chapter under it (data-theme), and on the home page the
 * badge/CTA stack stay hidden over the AUGE first viewport (AUGE shows no chrome there).
 */
export function initChrome() {
  const root = document.documentElement;
  const badge = qs('.badge svg');
  const fill = qs('.rail__fill');
  const count = qs('.rail__count');
  const rail = qs('.rail');

  if (badge && !env.reduced) {
    gsap.to(badge, { rotate: 720, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.6 } });
  }
  if (rail) {
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (s) => {
        const p = s.progress;
        if (fill) fill.style.transform = `scaleY(${p})`;
        if (count) count.textContent = String(Math.round(p * 100)).padStart(2, '0');
        rail.classList.toggle('is-end', p > 0.97);
      },
    });
  }

  // chapter-driven chrome colour
  // chapter-driven chrome colour: the innermost (last in document order) active chapter wins
  const themed = qsa('[data-theme]');
  const active = new Set();
  const apply = () => {
    const el = themed.filter((t) => active.has(t)).pop();
    if (el) root.dataset.chrome = el.dataset.theme;
  };
  themed.forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 64px', end: 'bottom 64px',
      onToggle: (s) => { if (s.isActive) active.add(sec); else active.delete(sec); apply(); },
    });
  });

  // home: chrome appears once the AUGE first viewport is left
  const hero = qs('.hero');
  if (hero) {
    ScrollTrigger.create({ trigger: hero, start: 'bottom 70%', onEnter: () => root.classList.remove('chrome-hidden'), onLeaveBack: () => root.classList.add('chrome-hidden') });
  } else {
    root.classList.remove('chrome-hidden');
  }
}
