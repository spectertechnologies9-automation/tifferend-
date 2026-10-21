import { gsap, ScrollTrigger } from '../core/gsap.js';
import { env, qs, qsa, clamp } from '../core/env.js';
import { scramble } from './text.js';
import { stopScroll, startScroll } from '../core/smooth.js';

/* ======================================================================
   0 + 1. ERA loader → AUGE first viewport (shared-element hand-off)
   ====================================================================== */
export function initIntro() {
  const loader = qs('#loader');
  const strip = qs('.strip--hero');
  const lead = qs('[data-lead] img');
  const items = qsa('.strip--hero .strip__item:not([data-clone])');
  const word = qs('[data-hero-word]');
  const intro = qs('.hero__intro');
  const legal = qs('.hero__legal');
  const square = qs('.menu-square');
  const first = document.documentElement.classList.contains('has-loader');

  if (env.reduced) { if (loader) loader.hidden = true; return; }

  const enterHero = (tl, at) => {
    tl.fromTo(word, { yPercent: 105, clipPath: 'inset(0% 0% 100% 0%)' }, { yPercent: 0, clipPath: 'inset(0% 0% -10% 0%)', duration: 1.3, ease: 'expo.out', clearProps: 'clipPath' }, at)
      .set([intro, legal, square], { opacity: 1 }, at)
      .fromTo(intro.children, { y: 26, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'expo.out' }, at + 0.25)
      .fromTo([legal, square], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', clearProps: 'transform' }, at + 0.4)
      .add(() => { const lbl = qs('.hero__label'); scramble(lbl, lbl.textContent, { duration: 0.8 }); }, at + 0.3);
  };

  // Repeat visit / arrival from another page: AUGE entrance only
  if (!first || !loader) {
    if (strip) strip.dataset.hold = '1';
    const tl = gsap.timeline({ delay: qs('.wipe.is-active') ? 0.55 : 0.05, onComplete: () => { if (strip) strip.dataset.hold = '0'; } });
    tl.from(items, { yPercent: -105, duration: 1.15, ease: 'expo.out', stagger: 0.055 }, 0);
    enterHero(tl, 0.25);
    return;
  }

  try { sessionStorage.setItem('tf-intro', '1'); } catch (e) { /* ignore */ }
  loader.hidden = false;
  stopScroll();
  strip.dataset.hold = '1';
  const media = qs('[data-loader-media]', loader);
  const words = qsa('.loader__words span', loader);
  const count = qs('.loader__count', loader);
  gsap.set(items, { opacity: 0 });
  gsap.set([word], { yPercent: 105 });
  gsap.set([intro, legal, square], { opacity: 0 });

  // ERA arch: narrow, round-topped window rising from the bottom centre
  const w = window.innerWidth;
  const archW = Math.min(w * 0.34, 400);
  const arch = { top: 100, side: ((w - archW) / 2 / w) * 100, r: archW / 2 };
  const clip = () => { media.style.clipPath = `inset(${arch.top}% ${arch.side}% 0% ${arch.side}% round ${arch.r}px ${arch.r}px 0px 0px)`; };
  clip();
  const counter = { v: 0 };

  const tl = gsap.timeline({ onComplete: finish });
  tl.set(words, { yPercent: 100 })
    .to(counter, { v: 100, duration: 1.5, ease: 'power2.inOut', onUpdate: () => { count.textContent = String(Math.round(counter.v)).padStart(2, '0'); } }, 0);
  words.forEach((wd, i) => {
    tl.to(wd, { yPercent: 0, duration: 0.16, ease: 'power2.out' }, i * 0.19)
      .to(wd, { yPercent: -100, duration: 0.16, ease: 'power2.in' }, i * 0.19 + 0.19);
  });
  tl.to(arch, { top: 30, duration: 0.85, ease: 'expo.out', onUpdate: clip }, 1.15)
    .fromTo(media.querySelector('img'), { scale: 1.4 }, { scale: 1.06, duration: 1.6, ease: 'expo.out' }, 1.15)
    .to(arch, { top: 0, side: 0, r: 0, duration: 0.85, ease: 'expo.inOut', onUpdate: clip }, 1.75)
    .to([count, qs('.loader__words', loader), qs('.loader__skip', loader)], { opacity: 0, duration: 0.3 }, 1.7)
    .set(loader, { backgroundColor: 'transparent' }, 2.6)
    // shared-element flight into the first AUGE strip slot
    .add(() => {
      const r = lead.getBoundingClientRect();
      gsap.to(media, { left: r.left, top: r.top, width: r.width, height: r.height, duration: 1.1, ease: 'expo.inOut' });
      gsap.to(media.querySelector('img'), { scale: 1, objectPosition: getComputedStyle(lead).objectPosition, duration: 1.1, ease: 'expo.inOut' });
    }, 2.6)
    .to(items.slice(1), { opacity: 1, duration: 0.01 }, 2.6)
    .from(items.slice(1), { xPercent: 60, yPercent: -40, duration: 1.2, stagger: 0.06, ease: 'expo.out' }, 2.75)
    .set(items[0], { opacity: 1 }, 3.7)
    .set(loader, { autoAlpha: 0 }, 3.72);
  enterHero(tl, 3.0);

  function finish() {
    loader.hidden = true;
    media.style.cssText = '';
    gsap.set(items, { clearProps: 'opacity,transform' });
    strip.dataset.hold = '0';
    startScroll();
    ScrollTrigger.refresh();
  }
  const skip = () => { if (tl.isActive()) tl.progress(1); };
  qs('.loader__skip', loader).addEventListener('click', skip);
  window.addEventListener('keydown', function onKey() { skip(); window.removeEventListener('keydown', onKey); });
}

/* ======================================================================
   4. ERA data chapter: slanted entry, skewed portrait, counters
   ====================================================================== */
export function initNumbers() {
  const sec = qs('.numbers');
  if (!sec) return;
  qsa('[data-count]', sec).forEach((el) => {
    if (env.reduced) return;
    const end = Number(el.dataset.count); const o = { v: 0 }; el.textContent = '0';
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 1.6, ease: 'expo.out', onUpdate: () => { el.textContent = Math.round(o.v); } }) });
  });
  if (env.reduced) { sec.style.setProperty('--slant-l', '4vw'); return; }
  gsap.fromTo(sec, { '--slant-l': '18vw', '--slant-r': '8vw' }, { '--slant-l': '3vw', '--slant-r': '0vw', ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 25%', scrub: true } });
  const fig = qs('[data-skew-reveal]', sec);
  if (fig) {
    gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 85%', once: true } })
      .fromTo(fig, { clipPath: 'polygon(14% 10%, 86% 0%, 100% 100%, 0% 88%)', opacity: 0 }, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', opacity: 1, duration: 1.5, ease: 'expo.inOut' })
      .fromTo(fig.querySelector('img'), { scale: 1.3 }, { scale: 1.06, duration: 1.8, ease: 'expo.out' }, 0);
  }
}

/* ======================================================================
   6. Igloo services: fog, shards approaching from depth, HUD decode, RGB split
   ====================================================================== */
export function initServices() {
  const pin = qs('[data-services]');
  if (!pin) return;
  const svcs = qsa('[data-svc]', pin);
  const shards = svcs.map((s) => qs('.svc__shard', s));
  const huds = svcs.map((s) => qs('.svc__hud', s));
  const codes = svcs.map((s) => qs('[data-hud-decode]', s));
  const counter = qs('[data-svc-count]', pin);
  if (env.reduced) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    qs('.services__list', pin).style.perspective = '1400px';
    gsap.set(shards.slice(1), { scale: 0.5, opacity: 0, filter: 'blur(16px)', rotateY: 16, xPercent: -50, yPercent: -50 });
    gsap.set(shards[0], { xPercent: -50, yPercent: -50 });
    gsap.set(huds.slice(1), { opacity: 0, x: -24 });
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    for (let i = 1; i < svcs.length; i++) {
      const at = i - 1;
      tl.to(shards[i - 1], { scale: 1.9, opacity: 0, filter: 'blur(18px)', rotateY: -10, duration: 1 }, at)
        .to(huds[i - 1], { opacity: 0, x: 24, duration: 0.4 }, at)
        .to(shards[i], { scale: 1, opacity: 1, filter: 'blur(0px)', rotateY: 0, duration: 1 }, at)
        .to(huds[i], { opacity: 1, x: 0, duration: 0.45 }, at + 0.55);
    }
    let current = 0;
    ScrollTrigger.create({
      trigger: pin, start: 'top top', end: () => '+=' + window.innerHeight * 2.2, pin: true, scrub: 0.8, animation: tl, anticipatePin: 1,
      onUpdate: (s) => {
        const idx = clamp(Math.round(s.progress * (svcs.length - 1)), 0, svcs.length - 1);
        if (idx !== current) {
          current = idx;
          counter.textContent = String(idx + 1).padStart(2, '0');
          scramble(codes[idx], codes[idx].textContent, { duration: 0.6 });
          shards[idx].classList.remove('rgb'); void shards[idx].offsetWidth; shards[idx].classList.add('rgb');
        }
      },
    });
    // Igloo: the object answers the pointer (subtle)
    const onMove = (e) => {
      const rx = (e.clientY / window.innerHeight - 0.5) * -6;
      const ry = (e.clientX / window.innerWidth - 0.5) * 8;
      gsap.to(qs('.services__list', pin), { rotateX: rx, rotateY: ry, duration: 1.2, ease: 'power3.out', transformPerspective: 1400 });
    };
    pin.addEventListener('pointermove', onMove);
    return () => pin.removeEventListener('pointermove', onMove);
  });
  mm.add('(max-width: 1023px)', () => {
    svcs.forEach((s, i) => {
      gsap.timeline({ scrollTrigger: { trigger: s, start: 'top 75%', once: true, onEnter: () => scramble(codes[i], codes[i].textContent, { duration: 0.6 }) } })
        .from(shards[i], { scale: 0.7, opacity: 0, filter: 'blur(14px)', duration: 1.3, ease: 'expo.out' })
        .from(huds[i], { y: 30, opacity: 0, duration: 1, ease: 'expo.out' }, 0.25);
    });
  });
}

/* ======================================================================
   7. ERA circle opener → ERA map with stations
   ====================================================================== */
export function initOpener() {
  const opener = qs('[data-opener]');
  const circle = qs('[data-opener-circle]');
  if (!opener || !circle || env.reduced) return;
  gsap.timeline({ scrollTrigger: { trigger: opener, start: 'top bottom', end: 'bottom bottom', scrub: 0.5, invalidateOnRefresh: true } })
    .fromTo(circle, { y: () => -circle.offsetHeight * 0.1 }, { y: () => -(window.innerHeight / 2 + circle.offsetHeight / 2), ease: 'none' }, 0)
    .fromTo(circle.querySelector('svg'), { rotate: -10 }, { rotate: 8, ease: 'none' }, 0);
}

export function initMap() {
  const pin = qs('[data-process]');
  const path = qs('[data-map-path]');
  const svg = qs('.map__line');
  const stations = qsa('.station');
  if (!pin || !path) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', () => {
    const total = path.getTotalLength();
    // find the length at which the path reaches a given x (viewBox units)
    const lengthAtX = (x) => { let lo = 0, hi = total; for (let k = 0; k < 24; k++) { const mid = (lo + hi) / 2; if (path.getPointAtLength(mid).x < x) lo = mid; else hi = mid; } return lo; };
    const marks = stations.map((st) => lengthAtX(parseFloat(st.style.getPropertyValue('--x')) / 100 * 1600));
    const place = () => {
      const h = svg.getBoundingClientRect().height;
      stations.forEach((st, i) => { const p = path.getPointAtLength(marks[i]); st.style.setProperty('--y', `${(p.y / 200) * h - 5}px`); });
    };
    place();
    window.addEventListener('resize', place);
    if (env.reduced) { stations.forEach((s) => s.classList.add('is-on')); return; }
    gsap.set(path, { strokeDasharray: total, strokeDashoffset: total });
    gsap.set(stations, { opacity: 0, y: 24 });
    const shown = new Set();
    ScrollTrigger.create({
      trigger: pin, start: 'top top', end: () => '+=' + window.innerHeight * 1.3, pin: true, scrub: 0.6, anticipatePin: 1,
      animation: gsap.to(path, { strokeDashoffset: 0, ease: 'none' }),
      onUpdate: (s) => {
        const drawn = s.progress * total;
        marks.forEach((m, i) => {
          const on = drawn >= m - 4;
          if (on && !shown.has(i)) { shown.add(i); gsap.to(stations[i], { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }); }
          else if (!on && shown.has(i)) { shown.delete(i); gsap.to(stations[i], { opacity: 0, y: 24, duration: 0.5, ease: 'power2.in' }); }
        });
      },
    });
    return () => window.removeEventListener('resize', place);
  });
  mm.add('(max-width: 1023px)', () => {
    if (env.reduced) return;
    stations.forEach((st) => gsap.from(st, { opacity: 0, y: 30, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: st, start: 'top 85%', once: true } }));
  });
}

/* Studio values: quiet stagger (ERA) */
export function initValues() {
  if (env.reduced) return;
  const vals = qsa('.value');
  if (vals.length) gsap.from(vals, { opacity: 0, y: 30, stagger: 0.1, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.values', start: 'top 85%', once: true } });
}

export function mountTestimonials(enabled) {
  if (!enabled) return;
  const tpl = qs('#tpl-testimonials'); const slot = qs('[data-testimonials-slot]');
  if (tpl && slot) slot.replaceWith(tpl.content.cloneNode(true));
}
