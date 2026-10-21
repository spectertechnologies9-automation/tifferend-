import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/herr-von-muellerhoff/latin-400.css';
import '@fontsource/space-mono/latin-400.css';
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/chrome.css';
import '../styles/home.css';
import '../styles/case.css';
import '../styles/careers.css';

import { ScrollTrigger } from './core/gsap.js';
import { env } from './core/env.js';
import { initSmooth, scrollToTarget } from './core/smooth.js';
import { initBars, initType, initChars, initLines, initSigns, initRise, initCounts } from './fx/text.js';
import { initTransitions } from './fx/transition.js';
import { initCursor } from './fx/cursor.js';
import { initChromeTheme } from './fx/chrome.js';
import { initMarquees } from './fx/marquee.js';
import { initMenu, initAnchors, initForm, initAccordions } from './ui/ui.js';
import { FEATURES } from './config.js';

async function boot() {
  initSmooth();
  initTransitions();
  initMenu();
  initAnchors();
  initForm();
  initAccordions();
  initCursor();

  if (env.page === 'home') (await import('./pages/home.js')).mountTestimonials(FEATURES.testimonials);

  // split text only after the fonts are in, so line and character measurements are right
  try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]); } catch (e) { /* ignore */ }

  if (env.page === 'home') {
    const home = await import('./pages/home.js');
    home.initHero();
    home.initWork();
    home.initServices();
    home.initOpener();
    home.initMap();
  } else {
    const page = await import('./pages/pages.js');
    page.initPage(env.page);
  }

  initBars();
  initType();
  initChars();
  initLines();
  initSigns();
  initRise();
  initCounts();
  initMarquees();
  initChromeTheme();

  ScrollTrigger.refresh();
  if (location.hash && document.querySelector(location.hash)) requestAnimationFrame(() => scrollToTarget(location.hash, { immediate: true }));
  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.documentElement.classList.add('is-ready');
}

boot();
