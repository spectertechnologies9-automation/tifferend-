// Chrome colour follows the section under the top edge of the viewport ([data-chrome] = dark | light).
import { ScrollTrigger } from '../core/gsap.js';
import { qsa } from '../core/env.js';

const root = document.documentElement;
let lock = null; // a section can take over (e.g. the work collage while its colour interpolates)

export function setChrome(v, owner) {
  if (lock && lock !== owner) return;
  if (root.dataset.chrome !== v) root.dataset.chrome = v;
}
export function lockChrome(owner) { lock = owner; }
export function unlockChrome(owner) { if (lock === owner) lock = null; }

export function initChromeTheme() {
  qsa('[data-chrome]').forEach((el) => {
    if (el === root) return;
    ScrollTrigger.create({
      trigger: el, start: 'top top+=36', end: 'bottom top+=36',
      onToggle: (self) => { if (self.isActive) { setChrome(el.dataset.chrome, 'theme'); root.dataset.surface = el.dataset.theme || ''; } },
    });
  });
}
