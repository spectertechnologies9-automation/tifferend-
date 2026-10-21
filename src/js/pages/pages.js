// Case study and careers choreography.
import { gsap, ScrollTrigger } from '../core/gsap.js';
import { env, qs, qsa } from '../core/env.js';

const MOTION = '(prefers-reduced-motion: no-preference)';
const DESK = '(min-width: 761px)';
const mm = gsap.matchMedia();

export function initPage(page) {
  if (page === 'case') initCase();
}

function initCase() {
  // hero band (LN 69–71 s): the image band opens from a framed strip to full width while its photo settles
  mm.add(MOTION, () => {
    const band = qs('[data-band]');
    gsap.fromTo(qs('img', band), { clipPath: 'inset(0% 12% 0% 12%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: band, start: 'top 85%', end: 'bottom 40%', scrub: true } });
    gsap.fromTo(qs('img', band), { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: true } });

    // palette cells fill from the bottom, one after another
    const sws = qsa('.sw');
    gsap.fromTo(sws, { '--fill': 0 }, { '--fill': 1, duration: 1.1, ease: 'expo.inOut', stagger: 0.12, scrollTrigger: { trigger: '.c-pal__grid', start: 'top 75%', once: true } });

    // kit motifs drop in
    gsap.from('.kit', { opacity: 0, y: 50, duration: 1, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '.c-kit__grid', start: 'top 80%', once: true } });
  });

  mm.add(`${DESK} and ${MOTION}`, () => {
    qsa('.c-float').forEach((el) => {
      const sp = +el.dataset.speed || 0;
      gsap.fromTo(el, { y: sp * 360 }, { y: -sp * 360, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // social diary (LN 81.5–84 s): a stack of cards fans out from one pivot as you scroll
    const fan = qs('[data-fan]');
    const cards = qsa('.fc', fan);
    fan.classList.add('is-fanned');
    const n = cards.length, mid = (n - 1) / 2;
    gsap.set(cards, { rotate: (i) => (i - mid) * 0.6, x: 0, y: (i) => -i * 0.5, zIndex: (i) => n - Math.abs(Math.round(i - mid)) });
    const tl = gsap.timeline({ scrollTrigger: { trigger: fan, start: 'top top', end: 'bottom bottom', scrub: 0.6 } });
    tl.fromTo(cards, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'power2.out', duration: 0.3, stagger: 0.012 }, 0)
      .to(cards, { rotate: (i) => (i - mid) * 7.2, x: (i) => (i - mid) * Math.min(innerWidth * 0.052, 78), y: (i) => Math.abs(i - mid) * 14, ease: 'power2.inOut', duration: 0.6 }, 0.3)
      .to({}, { duration: 0.2 });
    return () => { fan.classList.remove('is-fanned'); gsap.set(cards, { clearProps: 'all' }); };
  });
}
