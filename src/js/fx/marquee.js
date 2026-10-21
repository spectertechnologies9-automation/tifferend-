// Name marquees (LN 79–81 s): endless drift, speed nudged by scroll velocity, paused off-screen.
import { gsap } from '../core/gsap.js';
import { env, qsa } from '../core/env.js';
import { onScrollVelocity } from '../core/smooth.js';

export function initMarquees() {
  const items = qsa('[data-marquee]').map((el) => {
    const track = el.querySelector('.marquee__track');
    const group = el.querySelector('.marquee__group');
    if (env.reduced) { el.classList.add('is-static'); return null; }
    // clone groups until the track is at least 2× the viewport, so the loop never shows a gap
    let guard = 0;
    while (track.scrollWidth < el.clientWidth * 2 + group.offsetWidth && guard++ < 8) {
      const c = group.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c);
    }
    return { el, track, w: group.offsetWidth, speed: +el.dataset.marquee || 40, x: 0, on: false };
  }).filter(Boolean);
  if (!items.length) return;

  const io = new IntersectionObserver((es) => es.forEach((e) => { const m = items.find((i) => i.el === e.target); if (m) m.on = e.isIntersecting; }));
  items.forEach((m) => io.observe(m.el));
  let boost = 0;
  onScrollVelocity((v) => { boost = Math.min(6, Math.abs(v) * 0.06); });
  gsap.ticker.add((t, dt) => {
    boost *= 0.94;
    items.forEach((m) => {
      if (!m.on) return;
      const dir = Math.sign(m.speed);
      m.x -= (Math.abs(m.speed) * (1 + boost) * dt) / 1000 * dir;
      if (m.x <= -m.w) m.x += m.w;
      if (m.x > 0) m.x -= m.w;
      m.track.style.transform = `translate3d(${m.x.toFixed(2)}px,0,0)`;
    });
  });
  window.addEventListener('resize', () => items.forEach((m) => { m.w = m.track.querySelector('.marquee__group').offsetWidth; }));
}
