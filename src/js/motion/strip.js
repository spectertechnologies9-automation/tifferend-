import { gsap, ScrollTrigger } from '../core/gsap.js';
import { env, clamp, qsa } from '../core/env.js';
import { getVelocity } from '../core/smooth.js';

/**
 * AUGE ragged image row (A1/A2).
 * Fine pointer + motion: drifts right→left, scroll velocity adds speed and leans the images
 * (skewX, origin top), drag scrubs it, hover slows it. Otherwise CSS makes it a native swipe row.
 * `strip.dataset.hold = '1'` freezes the drift (used by the intro hand-off).
 */
export function initStrips() {
  qsa('[data-strip]').forEach(setup);
}

function setup(strip) {
  const track = strip.querySelector('[data-strip-track]');
  if (!track || env.reduced || !env.finePointer || window.innerWidth < 768) return;

  [...track.children].forEach((li) => {
    const c = li.cloneNode(true);
    c.dataset.clone = '';
    c.removeAttribute('data-lead');
    c.setAttribute('aria-hidden', 'true');
    c.querySelectorAll('a, button').forEach((n) => n.setAttribute('tabindex', '-1'));
    c.querySelectorAll('img').forEach((n) => { n.loading = 'lazy'; n.removeAttribute('fetchpriority'); });
    track.appendChild(c);
  });

  const base = Number(strip.dataset.speed || 60);
  let x = 0, half = 0, skew = 0, slow = 1, running = false;
  let dragging = false, dragStart = 0, dragX = 0, moved = 0;
  const setX = gsap.quickSetter(track, 'x', 'px');
  const imgs = qsa('img', track);
  const setSkew = imgs.map((im) => gsap.quickSetter(im, 'skewX', 'deg'));
  const measure = () => { half = track.scrollWidth / 2; };
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);

  const tick = (_t, dt) => {
    const hold = strip.dataset.hold === '1';
    const v = hold ? 0 : getVelocity();
    if (!dragging && !hold) x -= (base * slow * dt) / 1000 + Math.abs(v) * 0.9 * (dt / 16);
    if (x <= -half) x += half;
    if (x > 0) x -= half;
    setX(x);
    const target = clamp(-v * 0.45, -10, 10);
    skew += (target - skew) * 0.12;
    if (Math.abs(skew) > 0.01 || Math.abs(target) > 0.01) setSkew.forEach((s) => s(skew));
  };
  const start = () => { if (!running) { gsap.ticker.add(tick); running = true; } };
  const stop = () => { if (running) { gsap.ticker.remove(tick); running = false; } };
  ScrollTrigger.create({ trigger: strip, start: 'top bottom', end: 'bottom top', onToggle: (s) => (s.isActive ? start() : stop()) });

  const tweenSlow = (to, d) => gsap.to({ v: slow }, { v: to, duration: d, onUpdate() { slow = this.targets()[0].v; } });
  strip.addEventListener('mouseenter', () => tweenSlow(0.22, 0.6));
  strip.addEventListener('mouseleave', () => tweenSlow(1, 0.9));

  strip.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    dragging = true; moved = 0; dragStart = e.clientX; dragX = x; strip.dataset.dragged = '0';
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart;
    moved = Math.max(moved, Math.abs(dx));
    if (moved > 6) strip.dataset.dragged = '1';
    x = dragX + dx;
  });
  window.addEventListener('pointerup', () => { if (dragging) { dragging = false; setTimeout(() => { strip.dataset.dragged = '0'; }, 0); } });
  strip.addEventListener('dragstart', (e) => e.preventDefault());

  strip.addEventListener('focusin', (e) => {
    const li = e.target.closest('.strip__item');
    if (!li) return;
    slow = 0;
    gsap.to({ v: x }, { v: -li.offsetLeft + 40, duration: 0.8, ease: 'expo.out', onUpdate() { x = this.targets()[0].v; } });
  });
  strip.addEventListener('focusout', (e) => { if (!strip.contains(e.relatedTarget)) slow = 1; });
}
