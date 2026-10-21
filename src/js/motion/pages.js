import { gsap, ScrollTrigger } from '../core/gsap.js';
import { env, qs, qsa } from '../core/env.js';
import { scramble, mixedDecode } from './text.js';

export function initPage(page) {
  // AUGE A7: titles decode on arrival with mixed serif/grotesk glyphs
  // The decode belongs to the page transition (as in AUGE), so it only runs when arriving through
  // the in-site wipe. On a direct load the title is shown at once (line rise only), which keeps
  // it from being held back as the largest paint.
  const decode = qsa('[data-decode]');
  const startDecode = () => decode.forEach((el, i) => { const text = el.textContent; gsap.delayedCall(i * 0.12, () => { el.classList.add('is-on'); mixedDecode(el, text, 0.9, { overlay: true }); }); });
  if (qs('.wipe.is-active')) document.addEventListener('tf:revealed', startDecode, { once: true });
  else decode.forEach((el) => el.classList.add('is-on'));
  if (page === 'case') initCase();
  if (page === 'careers') initCareers();
}

function initCase() {
  if (env.reduced) return;
  const band = qs('[data-band]');
  if (band) {
    // A8: band slides down from the top; its curve relaxes as it lands, then parallax
    gsap.fromTo(band, { yPercent: -100, borderBottomLeftRadius: '50% 40%', borderBottomRightRadius: '50% 40%' }, { yPercent: 0, borderBottomLeftRadius: '50% 14%', borderBottomRightRadius: '50% 14%', duration: 1.4, ease: 'expo.out', delay: qs('.wipe.is-active') ? 0.5 : 0.1 });
    gsap.to(band.querySelector('img'), { yPercent: -12, ease: 'none', scrollTrigger: { trigger: band, start: 'top top', end: 'bottom top', scrub: true } });
  }
  gsap.from('.c-hero__title .c-line', { yPercent: 40, opacity: 0, stagger: 0.1, duration: 1.3, ease: 'expo.out', delay: 0.35 });
  gsap.from('.c-disc li', { yPercent: 60, opacity: 0, stagger: 0.07, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.c-disc', start: 'top 85%', once: true } });

  // A9: palette panels swing into the picture plane (scrubbed, reversible)
  const panels = qsa('[data-panels] .panel');
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    panels.forEach((p, i) => {
      gsap.fromTo(p, { rotateY: i < 2 ? 28 : -28, z: -220, opacity: 0.2 }, { rotateY: 0, z: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '[data-panels]', start: 'top 95%', end: 'top 30%', scrub: 0.7 } });
    });
  });
  mm.add('(max-width: 899px)', () => {
    gsap.from(panels, { yPercent: 20, opacity: 0, stagger: 0.08, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '[data-panels]', start: 'top 85%', once: true } });
  });
  qsa('[data-hex]').forEach((el, i) => {
    const t = el.textContent;
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => scramble(el, t, { duration: 0.8, delay: i * 0.1 }) });
  });

  // A10: white panel rises; its curved edge flattens as it covers the black chapter
  const ret = qs('.c-return');
  gsap.fromTo(ret, { borderTopLeftRadius: '50% 18vw', borderTopRightRadius: '50% 18vw' }, { borderTopLeftRadius: '50% 3vw', borderTopRightRadius: '50% 3vw', ease: 'none', scrollTrigger: { trigger: ret, start: 'top bottom', end: 'top 20%', scrub: true } });

  // kit-of-parts: the four motifs drift in from scattered positions and lock into a row (scrubbed)
  const kit = qs('[data-kit]');
  if (kit) {
    const from = [{ x: -40, y: 60, r: -40 }, { x: 10, y: -70, r: 0 }, { x: -10, y: 80, r: 25 }, { x: 40, y: -50, r: 60 }];
    qsa('.kit__m', kit).forEach((m, i) => {
      gsap.fromTo(m, { xPercent: from[i].x, yPercent: from[i].y, rotate: from[i].r, scale: 0.6 }, { xPercent: 0, yPercent: 0, rotate: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: kit, start: 'top 90%', end: 'center 55%', scrub: 0.8 } });
    });
  }

  // A11 next block: one variable (--q) opens the window and closes the gap between the words
  const next = qs('[data-next]');
  if (next) gsap.fromTo(next, { '--q': 0 }, { '--q': 1, ease: 'none', scrollTrigger: { trigger: next, start: 'top 85%', end: 'center 50%', scrub: 0.6 } });

  // clip reveals for case imagery (bottom→top, AUGE/ERA image reveal)
  qsa('[data-clip]').forEach((img) => {
    gsap.fromTo(img, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.12 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: img, start: 'top 88%', once: true } });
  });
}

function initCareers() {
  if (env.reduced) return;
  gsap.from('.k-hero__title .c-line', { yPercent: 40, opacity: 0, stagger: 0.1, duration: 1.3, ease: 'expo.out', delay: 0.3 });
  gsap.from('.role', { y: 40, opacity: 0, stagger: 0.06, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.roles__list', start: 'top 85%', once: true } });
}
