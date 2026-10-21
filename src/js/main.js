import '@fontsource/inter-tight/latin-400.css';
import '@fontsource/inter-tight/latin-600.css';
import '@fontsource/inter-tight/latin-900.css';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource/pinyon-script/latin-400.css';
import '@fontsource/space-mono/latin-400.css';
import '@fontsource/lora/latin-700.css';
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/chrome.css';
import '../styles/home.css';
import '../styles/case.css';
import '../styles/careers.css';

import { ScrollTrigger } from './core/gsap.js';
import { env } from './core/env.js';
import { initSmooth, scrollToTarget, getLenis } from './core/smooth.js';
import { initLineReveals, initCharReveals, initBlockReveals, initScrambleLabels } from './motion/text.js';
import { initTransitions } from './motion/transition.js';
import { initCursor, initMagnets } from './motion/cursor.js';
import { initStrips } from './motion/strip.js';
import { initChrome } from './motion/chrome.js';
import { initMenu, initAnchors, initVelocitySkew, initForm, initAccordions } from './ui/ui.js';
import { FEATURES } from './config.js';

// Scroll restoration is done by hand: the browser restores before pins add their spacers
// (page still short), which lands a reload inside a pinned chapter far too early.
const SCROLL_KEY = 'tf-scroll:' + location.pathname;
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('pagehide', () => { try { sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY))); } catch (e) { /* blocked */ } });

async function boot() {
  initSmooth();
  initTransitions();
  initMenu();
  initAnchors();
  initForm();
  initAccordions();
  initCursor();
  initMagnets();

  // split only after fonts are ready so line/char measurements are correct
  try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]); } catch (e) { /* ignore */ }

  if (env.page === 'home') {
    const home = await import('./motion/home.js');
    home.mountTestimonials(FEATURES.testimonials);
    initStrips();
    initLineReveals();
    initCharReveals();
    home.initIntro();
    home.initNumbers();
    home.initWork();
    home.initServices();
    home.initOpener();
    home.initMap();
    home.initValues();
  } else {
    initStrips();
    initLineReveals();
    initCharReveals();
    const page = await import('./motion/pages.js');
    page.initPage(env.page);
  }

  initChrome();
  initBlockReveals();
  initScrambleLabels();
  initVelocitySkew();

  ScrollTrigger.refresh();
  let saved = null;
  try { saved = sessionStorage.getItem(SCROLL_KEY); sessionStorage.removeItem(SCROLL_KEY); } catch (e) { /* blocked */ }
  const arrivedViaWipe = !!document.querySelector('.wipe.is-active');
  const navType = performance.getEntriesByType('navigation')[0]?.type;
  if (saved && !arrivedViaWipe && (navType === 'reload' || navType === 'back_forward')) {
    // reload / back-forward return the reader to where they were (even if the URL has a hash, as browsers do)
    const y = Number(saved);
    const lenis = getLenis();
    requestAnimationFrame(() => { if (lenis) lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y); ScrollTrigger.update(); });
  }
  else if (location.hash && document.querySelector(location.hash)) requestAnimationFrame(() => scrollToTarget(location.hash, { immediate: true }));
  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.documentElement.classList.add('is-ready');
}

boot();
