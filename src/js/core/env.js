// Environment flags, read once and kept in sync with media query changes.
const mq = (q) => window.matchMedia(q);

export const env = {
  reduced: mq('(prefers-reduced-motion: reduce)').matches,
  finePointer: mq('(hover: hover) and (pointer: fine)').matches,
  desktop: mq('(min-width: 1024px)').matches,
  page: document.body.dataset.page || 'home',
};

mq('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
  env.reduced = e.matches;
  document.documentElement.classList.toggle('reduced', e.matches);
});
mq('(min-width: 1024px)').addEventListener('change', (e) => { env.desktop = e.matches; });

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const qs = (s, root = document) => root.querySelector(s);
export const qsa = (s, root = document) => [...root.querySelectorAll(s)];
