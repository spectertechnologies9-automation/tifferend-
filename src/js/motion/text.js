import { gsap, ScrollTrigger, SplitText, SCRAMBLE_CHARS } from '../core/gsap.js';
import { env, qsa } from '../core/env.js';

const pending = new Map(); // el -> tween for intro-controlled reveals

/**
 * Line reveals.
 *  data-reveal="lines"      → line-mask rise (generic)
 *  data-reveal="rot-lines"  → AUGE A8: lines rise with a slight rotation that settles to 0°
 *  data-reveal-now          → paused; played by an intro timeline via playNow()
 */
export function initLineReveals(root = document) {
  qsa('[data-reveal="lines"], [data-reveal="rot-lines"]', root).forEach((el) => {
    if (env.reduced) { el.style.visibility = 'visible'; return; }
    const rot = el.dataset.reveal === 'rot-lines';
    const now = el.hasAttribute('data-reveal-now');
    SplitText.create(el, {
      type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        if (el.dataset.played) return;
        const tween = gsap.from(self.lines, {
          yPercent: rot ? 130 : 110,
          rotate: rot ? -3.2 : 0,
          transformOrigin: '0% 0%',
          duration: rot ? 1.25 : 1.05,
          stagger: rot ? 0.11 : 0.07,
          ease: 'expo.out',
          paused: now,
          onComplete: () => { el.dataset.played = '1'; },
          scrollTrigger: now ? undefined : { trigger: el, start: 'top 88%', once: true },
        });
        if (now) pending.set(el, tween);
        return tween;
      },
    });
  });
}

export function playNow(el, delay = 0) {
  const t = pending.get(el);
  if (t) gsap.delayedCall(delay, () => t.play());
  else if (el) el.style.visibility = 'visible';
}

/**
 * ERA per-character statement reveal (B7/B8): caps resolve left→right from blur,
 * the script word draws in with a left→right clip. Scrubbed, so it reverses on scroll-up.
 */
export function initCharReveals(root = document) {
  qsa('[data-reveal="chars"]', root).forEach((el) => {
    gsap.set(el, { visibility: 'visible' });
    if (env.reduced) return;
    const caps = el.querySelectorAll('.caps').length ? qsa('.caps', el) : [el];
    const scripts = qsa('.script', el);
    const split = SplitText.create(caps, { type: 'words,chars', charsClass: 'ch' });
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 86%', end: 'top 30%', scrub: 0.7 } });
    tl.fromTo(split.chars, { opacity: 0, filter: 'blur(10px)', yPercent: 8 }, { opacity: 1, filter: 'blur(0px)', yPercent: 0, ease: 'none', stagger: 0.04, duration: 0.5 }, 0);
    scripts.forEach((s) => {
      tl.fromTo(s, { clipPath: 'inset(-20% 100% -40% 0%)', opacity: 0.2 }, { clipPath: 'inset(-20% 0% -40% 0%)', opacity: 1, ease: 'power1.inOut', duration: 0.9 }, 0.35);
    });
  });
}

export function initBlockReveals() {
  if (env.reduced) return;
  ScrollTrigger.batch('[data-reveal="fade"]', {
    start: 'top 92%', once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out', overwrite: true }),
  });
}

/** AUGE text decode (A3/A4/A7). */
export function scramble(el, text = el.textContent, { duration = 0.8, delay = 0 } = {}) {
  if (!el) return null;
  if (env.reduced) { el.textContent = text; return null; }
  return gsap.to(el, { duration, delay, ease: 'none', scrambleText: { text, chars: SCRAMBLE_CHARS, revealDelay: 0.12, speed: 0.7, tweenLength: false } });
}

/**
 * AUGE A7 decode that mixes italic-serif and grotesk glyphs while resolving.
 * Writes spans into `el`; ends as plain text.
 */
export function mixedDecode(el, text, duration = 0.9, { overlay = false } = {}) {
  if (!el) return Promise.resolve();
  if (env.reduced) { el.textContent = text; return Promise.resolve(); }
  const pool = SCRAMBLE_CHARS;
  const state = { p: 0 };
  // overlay mode: the real text keeps its box (transparent) while the decoding glyphs are drawn
  // in an absolutely positioned layer centred with a transform → no layout shift (CLS-safe)
  let host = el;
  if (overlay) {
    el.style.position = 'relative';
    el.style.color = 'transparent';
    host = document.createElement('span');
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText = 'position:absolute;left:50%;top:0;transform:translateX(-50%);white-space:nowrap;color:var(--ink);pointer-events:none';
    el.appendChild(host);
  }
  return new Promise((resolve) => {
    gsap.to(state, {
      p: 1, duration, ease: 'power1.inOut',
      onUpdate: () => {
        let html = '';
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === ' ') { html += ' '; continue; }
          const done = state.p * (text.length + 4) - 4 > i;
          if (done) html += ch;
          else if (Math.random() < 0.5) html += `<span class="alt">${Math.random() < 0.5 ? ch : pool[(Math.random() * pool.length) | 0]}</span>`;
          else html += pool[(Math.random() * pool.length) | 0];
        }
        host.innerHTML = html;
      },
      onComplete: () => {
        if (overlay) { host.remove(); el.style.color = ''; } else el.textContent = text;
        resolve();
      },
    });
  });
}

export function initScrambleLabels() {
  if (env.reduced) return;
  qsa('[data-scramble]').forEach((el) => {
    const text = el.textContent.trim();
    ScrollTrigger.create({ trigger: el, start: 'top 95%', once: true, onEnter: () => scramble(el, text, { duration: 1 }) });
  });
  qsa('[data-scramble-hover]').forEach((el) => {
    const text = el.textContent.trim();
    const host = el.closest('a') || el;
    let busy = false;
    const run = () => {
      if (busy) return;
      busy = true;
      const t = scramble(el, text, { duration: 0.5 });
      if (t) t.eventCallback('onComplete', () => { busy = false; }); else busy = false;
    };
    host.addEventListener('mouseenter', run);
    host.addEventListener('focus', run);
  });
}
