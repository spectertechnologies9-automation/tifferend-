// Home choreography. Each init names its governing reference (docs/REFERENCE_VIDEO_BREAKDOWN.md §4).
import { gsap, ScrollTrigger } from '../core/gsap.js';
import { env, qs, qsa, clamp, lerp } from '../core/env.js';
import { introDone } from '../fx/transition.js';
import { decode } from '../fx/text.js';
import { setChrome, lockChrome, unlockChrome } from '../fx/chrome.js';

const MOTION = '(prefers-reduced-motion: no-preference)';
const DESK = '(min-width: 761px)';
const WIDE = '(min-width: 1024px)'; // pinned one-subject stages need landscape room
const mm = gsap.matchMedia();

/* ---------- 1 · HERO (LN 58–60.5 s): lagged lens + trailing blob, then the window opens to full bleed ---------- */
export function initHero() {
  const hero = qs('[data-hero]');
  if (!hero) return;
  const win = qs('[data-lens]', hero);
  const diff = qs('.hero__diff', win);
  const l1 = qs('.hero__l1', hero), l2 = qs('.hero__l2', hero);
  const HOME = { x: 0.5, y: 0.42 };
  const s = { x: HOME.x, y: HOME.y, x2: HOME.x, y2: HOME.y, r: 0, r2: 0 };
  const tgt = { ...HOME };
  const lens = { r: 0, grow: 0 };
  let rect = win.getBoundingClientRect();
  let lastInput = 0, visible = true;
  const restR = () => (innerWidth < 761 ? innerWidth * 0.3 : Math.min(innerWidth * 0.125, 220));
  const coverR = () => Math.hypot(rect.width, rect.height);
  const measure = () => { rect = win.getBoundingClientRect(); };
  window.addEventListener('resize', measure);
  ScrollTrigger.addEventListener('refresh', measure);

  const setFrom = (cx, cy) => {
    measure();
    tgt.x = (cx - rect.left) / rect.width; tgt.y = (cy - rect.top) / rect.height;
    lastInput = performance.now();
  };
  hero.addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') setFrom(e.clientX, e.clientY); }, { passive: true });
  hero.addEventListener('pointerleave', () => { tgt.x = HOME.x; tgt.y = HOME.y; });
  win.addEventListener('touchmove', (e) => { const t = e.touches[0]; if (t) setFrom(t.clientX, t.clientY); }, { passive: true });
  win.addEventListener('touchstart', (e) => { const t = e.touches[0]; if (t) setFrom(t.clientX, t.clientY); }, { passive: true });

  const apply = () => {
    const g = lens.grow;
    const x = lerp(s.x, 0.5, g), y = lerp(s.y, 0.5, g);
    const r = lerp(lens.r, coverR(), g);
    diff.style.setProperty('--x1', `${(x * 100).toFixed(2)}%`);
    diff.style.setProperty('--y1', `${(y * 100).toFixed(2)}%`);
    diff.style.setProperty('--r1', `${r.toFixed(1)}px`);
    diff.style.setProperty('--x2', `${(s.x2 * 100).toFixed(2)}%`);
    diff.style.setProperty('--y2', `${(s.y2 * 100).toFixed(2)}%`);
    diff.style.setProperty('--r2', `${(s.r2 * (1 - g)).toFixed(1)}px`);
  };

  if (env.reduced) { lens.r = restR(); apply(); return; }

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);
  const t0 = performance.now();
  gsap.ticker.add(() => {
    if (!visible) return;
    const now = performance.now();
    // touch devices: an idle lens drifts slowly, so the hero is never static
    if (!env.finePointer && now - lastInput > 2500) {
      const t = (now - t0) / 1000;
      tgt.x = HOME.x + Math.sin(t * 0.55) * 0.2; tgt.y = HOME.y + Math.sin(t * 0.83) * 0.12;
    }
    const px = s.x, py = s.y;
    s.x += (tgt.x - s.x) * 0.12; s.y += (tgt.y - s.y) * 0.12;
    s.x2 += (s.x - s.x2) * 0.07; s.y2 += (s.y - s.y2) * 0.07;
    const speed = Math.hypot(s.x - px, s.y - py) * 60;
    s.r2 += (lens.r * 0.62 * clamp(speed * 2.2 + Math.hypot(s.x - s.x2, s.y - s.y2) * 3, 0, 1) - s.r2) * 0.12;
    apply();
  });

  // intro: lens opens from nothing, title lines rise through a mask
  introDone.then(() => {
    gsap.fromTo(lens, { r: 0 }, { r: restR(), duration: 1.3, ease: 'expo.out', delay: 0.15 });
    gsap.fromTo([l1, l2], { clipPath: 'inset(0 0 100% 0)', y: 60 }, { clipPath: 'inset(0 0 -20% 0)', y: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out', delay: 0.05 });
    window.addEventListener('resize', () => { if (!gsap.isTweening(lens)) lens.r = restR(); });
  });

  // scroll: the window opens to full bleed and the lens grows until the difference takes over
  mm.add(`${DESK} and ${MOTION}`, () => {
    const extras = qsa('.hero__side, .hero__card, .hero__lede, .hero__cap', hero);
    const tl = gsap.timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: '+=95%', pin: qs('.hero__pin', hero), scrub: true, anticipatePin: 1 },
    });
    tl.to(win, { width: '100vw', top: 0, ease: 'power1.inOut' }, 0)
      .to(lens, { grow: 1, ease: 'power1.in' }, 0)
      .to(l1, { yPercent: -140, opacity: 0, ease: 'power1.in' }, 0)
      .to(l2, { yPercent: 90, opacity: 0, ease: 'power1.in' }, 0)
      .to(extras, { opacity: 0, duration: 0.3, ease: 'none' }, 0);
    return () => { lens.grow = 0; };
  });
}

/* ---------- 3 · WORK (LN 65–71 s): collage parallax + background interpolation ---------- */
export function initWork() {
  const sec = qs('[data-work]');
  if (!sec) return;
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  qsa('.cl__img', sec).forEach((el) => {
    if (env.reduced) return;
    gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sec, start: 'top 55%', end: 'bottom 60%', scrub: env.reduced ? false : 0.5,
      onToggle: (self) => (self.isActive ? lockChrome('work') : unlockChrome('work')),
      onUpdate: (self) => setChrome(self.progress > 0.9 ? 'dark' : 'light', 'work'),
    },
  });
  // olive → My Mithila forest quickly, hold it through the collage, then a short switch to bone before the services
  tl.to(sec, { backgroundColor: css('--forest'), color: css('--bone'), '--accent': css('--mustard'), ease: 'none', duration: 0.5 })
    .to(sec, { backgroundColor: css('--bone'), color: css('--ink'), '--accent': css('--forest'), ease: 'none', duration: 0.35 }, '+=2.15');

  mm.add(`${DESK} and ${MOTION}`, () => {
    qsa('.cl', sec).forEach((el) => {
      const sp = +el.dataset.speed || 0;
      gsap.fromTo(el, { y: sp * 420 }, { y: -sp * 420, ease: 'none', scrollTrigger: { trigger: '.collage', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.fromTo('.work__script', { rotate: -16, x: -60 }, { rotate: -4, x: 60, ease: 'none', scrollTrigger: { trigger: '.work__head', start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* ---------- 4 · SERVICES (Igloo 19–39 s): one subject per screen ---------- */
export function initServices() {
  const sec = qs('[data-svc]');
  if (!sec) return;
  const items = qsa('.svc__item', sec);
  const stage = qs('.svc__stage', sec);
  const labels = items.map((it) => qs('[data-decode]', it));

  mm.add(`${WIDE} and ${MOTION}`, () => {
    sec.classList.add('is-pinned');
    const figs = items.map((i) => qs('.svc__fig', i));
    const texts = items.map((i) => qs('.svc__text', i));
    const huds = items.map((i) => qs('.svc__hud', i));
    const ring = qs('.svc__ring', sec);
    const nEl = qs('[data-svc-n]', sec);
    const col = (it, v) => it.style.getPropertyValue(v).trim();
    gsap.set(stage, { '--svc-bg': col(items[0], '--c'), '--svc-fg': col(items[0], '--i') });
    gsap.set(figs, { opacity: 0, scale: 0.28, yPercent: 26, filter: 'blur(18px)' });
    gsap.set([...texts, ...huds], { opacity: 0 });
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    items.forEach((it, i) => {
      if (i > 0) tl.to(stage, { '--svc-bg': col(it, '--c'), '--svc-fg': col(it, '--i'), duration: 0.1 }, i - 0.06);
      tl.to(figs[i], { opacity: 1, scale: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.42, ease: 'power2.out' }, i)
        .to(huds[i], { opacity: 1, duration: 0.08 }, i + 0.16)
        .fromTo(texts[i], { opacity: 0, y: 46 }, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, i + 0.2);
      if (i < items.length - 1) {
        tl.to(figs[i], { scale: 2.6, opacity: 0, filter: 'blur(10px)', duration: 0.28, ease: 'power2.in' }, i + 0.7)
          .to([texts[i], huds[i]], { opacity: 0, duration: 0.1 }, i + 0.7)
          .fromTo(ring, { opacity: 0, scale: 0.15 }, { opacity: 1, scale: 1.1, duration: 0.14, ease: 'power1.in' }, i + 0.78)
          .to(ring, { opacity: 0, scale: 4.2, duration: 0.16, ease: 'power1.out' }, i + 0.92);
      }
    });
    tl.to({}, { duration: 0.35 });
    let cur = -1;
    const smear = () => { stage.classList.remove('is-smear'); void stage.offsetWidth; stage.classList.add('is-smear'); };
    ScrollTrigger.create({
      trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.6, animation: tl,
      onUpdate: (self) => {
        const t = self.progress * tl.duration();
        const idx = clamp(Math.floor(t + 0.1), 0, items.length - 1);
        if (idx === cur) return;
        if (cur !== -1) smear();
        cur = idx;
        nEl.textContent = String(idx + 1).padStart(2, '0');
        decode(labels[idx], undefined, 0.8);
      },
    });
    return () => { sec.classList.remove('is-pinned'); gsap.set([stage, ...figs, ...texts, ...huds, ring], { clearProps: 'all' }); };
  });

  // stacked mode with motion (mobile): decode each HUD as it arrives
  mm.add(`(max-width: 1023px) and ${MOTION}`, () => {
    labels.forEach((l) => ScrollTrigger.create({ trigger: l, start: 'top 85%', once: true, onEnter: () => decode(l, undefined, 0.8) }));
    qsa('.svc__fig', sec).forEach((f) => gsap.from(f, { scale: 0.6, opacity: 0, filter: 'blur(12px)', duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 88%', once: true } }));
  });
}

/* ---------- 7 · PROCESS (ERA 21 s): the lavender disc rises with arc text and fills the screen ---------- */
export function initOpener() {
  const op = qs('[data-opener]');
  if (!op) return;
  mm.add(MOTION, () => {
    op.classList.add('is-on');
    const disc = qs('.opener__disc', op);
    const tl = gsap.timeline({ scrollTrigger: { trigger: op, start: 'top top', end: () => `+=${innerHeight * 0.7}`, scrub: 0.4, invalidateOnRefresh: true } });
    // phones: the arc is wider than the screen, so the words travel along it (ERA's arc text, scrolled)
    if (innerWidth < 761) tl.fromTo(qs('.opener__arc textPath', op), { attr: { startOffset: '82%' } }, { attr: { startOffset: '18%' }, ease: 'none', duration: 2 }, 0);
    tl.fromTo(disc, { y: 0, scale: 1 }, { y: () => -innerHeight * 0.6, ease: 'power2.out', duration: 1 })
      .to(disc, { y: () => -innerHeight * 1.05, scale: 2.7, ease: 'power2.in', duration: 1 });
    return () => op.classList.remove('is-on');
  });
}

/* ---------- 7 · PROCESS (ERA 25–28 s): hand-drawn route with three stations ---------- */
export function initMap() {
  const map = qs('[data-map]');
  if (!map) return;
  const path = qs('.map__line path', map);
  const svg = qs('.map__line', map);
  const route = qs('.map__route', map);
  const sts = qsa('.map__st', map);
  const fracs = sts.map((st) => parseFloat(st.style.getPropertyValue('--x')) / 100);

  mm.add(`${WIDE} and ${MOTION}`, () => {
    map.classList.add('is-pinned');
    path.setAttribute('pathLength', '1');
    gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(sts, { opacity: 0, y: 24 });
    const total = path.getTotalLength();
    const yAt = (fx) => { // binary search the path for the point at x = fx · 1400
      let lo = 0, hi = total;
      for (let k = 0; k < 24; k++) { const mid = (lo + hi) / 2; if (path.getPointAtLength(mid).x < fx * 1400) lo = mid; else hi = mid; }
      return path.getPointAtLength(lo).y;
    };
    const place = () => {
      const r = route.getBoundingClientRect(), sv = svg.getBoundingClientRect();
      sts.forEach((st, i) => { st.style.top = `${sv.top - r.top + (yAt(fracs[i]) / 220) * sv.height}px`; });
    };
    place();
    ScrollTrigger.addEventListener('refresh', place);
    const shown = sts.map(() => false);
    const st = ScrollTrigger.create({
      trigger: map, start: 'top top', end: 'bottom bottom', scrub: 0.5,
      onUpdate: (self) => {
        const p = clamp((self.progress - 0.05) / 0.8, 0, 1);
        gsap.set(path, { strokeDashoffset: 1 - p });
        fracs.forEach((f, i) => {
          const on = p >= f - 0.04;
          if (on !== shown[i]) { shown[i] = on; gsap.to(sts[i], { opacity: on ? 1 : 0, y: on ? 0 : 24, duration: 0.7, ease: 'expo.out', overwrite: true }); }
        });
      },
    });
    return () => { st.kill(); ScrollTrigger.removeEventListener('refresh', place); map.classList.remove('is-pinned'); gsap.set([path, ...sts], { clearProps: 'all' }); };
  });

  mm.add(`(max-width: 1023px) and ${MOTION}`, () => {
    sts.forEach((st) => gsap.from(st, { opacity: 0, x: -24, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: st, start: 'top 88%', once: true } }));
  });
}

/* Testimonials stay off until the client confirms them (src/js/config.js). */
export function mountTestimonials(on) {
  const tpl = qs('#tpl-testimonials');
  if (!on || !tpl) return;
  qs('#contact').before(tpl.content.cloneNode(true));
}
