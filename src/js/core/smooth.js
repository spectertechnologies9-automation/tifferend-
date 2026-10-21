import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap.js';
import { env } from './env.js';

// Smooth scrolling (desktop pointer devices only). Touch keeps native scrolling.
let lenis = null;
const listeners = new Set();
let lastY = window.scrollY;
let velocity = 0;

export function initSmooth() {
  if (!env.reduced && env.finePointer) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', (l) => {
      velocity = l.velocity;
      ScrollTrigger.update();
      listeners.forEach((fn) => fn(l.velocity));
    });
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    // derive a velocity for native scrolling, so velocity-driven effects still get a value
    window.addEventListener('scroll', () => {
      const y = window.scrollY; velocity = y - lastY; lastY = y;
      listeners.forEach((fn) => fn(velocity));
    }, { passive: true });
  }
  return lenis;
}

export const getLenis = () => lenis;
export const getVelocity = () => velocity;
export const onScrollVelocity = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

export function scrollToTarget(target, { immediate = false } = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  const header = document.getElementById('header');
  const offset = el.id === 'top' ? 0 : -((header?.offsetHeight || 0) - 1);
  if (lenis) lenis.scrollTo(el, { offset, immediate, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: immediate || env.reduced ? 'auto' : 'smooth' });
  }
}

export function stopScroll() { lenis ? lenis.stop() : (document.documentElement.style.overflow = 'hidden'); }
export function startScroll() { lenis ? lenis.start() : (document.documentElement.style.overflow = ''); }
