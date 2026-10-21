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
import { initSmooth, scrollToTarget } from './core/smooth.js';
import { initLineReveals, initCharReveals, initBlockReveals, initScrambleLabels } from './motion/text.js';
import { initTransitions } from './motion/transition.js';
import { initCursor, initMagnets } from './motion/cursor.js';
import { initStrips } from './motion/strip.js';
import { initChrome } from './motion/chrome.js';
import { initMenu, initAnchors, initVelocitySkew, initForm, initAccordions } from './ui/ui.js';
import { FEATURES } from './config.js';

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
  if (location.hash && document.querySelector(location.hash)) requestAnimationFrame(() => scrollToTarget(location.hash, { immediate: true }));
  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.documentElement.classList.add('is-ready');
}

boot();
