// Text effects. Each one leaves plain, readable text as its end state, and does nothing under reduced motion.
import { gsap, ScrollTrigger, SplitText, SCRAMBLE_CHARS } from '../core/gsap.js';
import { env, qsa } from '../core/env.js';

const rand = (a, b) => a + Math.random() * (b - a);

/**
 * LN stepped highlight bars (61.5–62.5 s): every line is covered by one or two bars
 * of uneven width that retract sideways, staggered, revealing the text.
 */
export function initBars(root = document) {
  qsa('[data-bars]', root).forEach((el) => {
    if (env.reduced) return;
    const centred = getComputedStyle(el).textAlign === 'center';
    let played = false;
    SplitText.create(el, {
      type: 'lines', linesClass: 'bar-line', autoSplit: true,
      onSplit(self) {
        el.classList.add('is-split');
        self.lines.forEach((line) => { line.style.display = 'table'; line.style.marginInline = centred ? 'auto' : '0'; });
        if (played) return;
        const bars = [];
        self.lines.forEach((line, i) => {
          const a = document.createElement('span');
          a.className = 'bar';
          a.style.left = `-${rand(0.04, 0.2).toFixed(2)}em`;
          a.style.right = `-${rand(0.05, 0.9).toFixed(2)}em`;
          a.style.transformOrigin = i % 2 ? '0% 50%' : '100% 50%';
          line.appendChild(a); bars.push(a);
          if (Math.random() < 0.55) {
            const b = document.createElement('span');
            b.className = 'bar';
            b.style.left = `${rand(25, 60).toFixed(0)}%`;
            b.style.right = `-${rand(0.2, 1.4).toFixed(2)}em`;
            b.style.top = '42%';
            b.style.bottom = '-14%';
            b.style.transformOrigin = '100% 50%';
            line.appendChild(b); bars.push(b);
          }
        });
        const tween = gsap.to(bars, {
          scaleX: 0, duration: 0.75, ease: 'expo.inOut', stagger: { each: 0.06, from: 'start' },
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
          onComplete: () => { played = true; bars.forEach((b) => b.remove()); },
        });
        return tween;
      },
    });
  });
}

/** LN type-on behind a block caret (77–79 s). The box never changes size: characters only change opacity. */
export function initType(root = document) {
  qsa('[data-type]', root).forEach((el) => {
    if (env.reduced) return;
    const split = SplitText.create(el, { type: 'chars', charsClass: 'tc' });
    gsap.set(split.chars, { opacity: 0 });
    el.classList.add('is-typed');
    const caret = document.createElement('span');
    caret.className = 'caret'; caret.setAttribute('aria-hidden', 'true');
    caret.style.cssText = 'position:absolute;left:0;top:0;opacity:0;pointer-events:none';
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    if (getComputedStyle(el).display === 'inline') el.style.display = 'inline-block';
    el.appendChild(caret);
    const place = (ch) => {
      caret.style.height = `${ch.offsetHeight * 0.8}px`;
      caret.style.width = `${Math.max(6, ch.offsetHeight * 0.42)}px`;
      caret.style.transform = `translate(${ch.offsetLeft + ch.offsetWidth + 2}px, ${ch.offsetTop + ch.offsetHeight * 0.1}px)`;
    };
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        tl.set(caret, { opacity: 1 });
        split.chars.forEach((ch, i) => tl.call(() => { ch.style.opacity = 1; place(ch); }, null, i * 0.045));
        tl.to(caret, { opacity: 0, duration: 0.01, repeat: 5, yoyo: true, repeatDelay: 0.18 }, '+=0.05');
        tl.call(() => { caret.remove(); split.revert(); });
      },
    });
  });
}

/**
 * ERA per-character statement reveal (22 s): caps resolve from blur left → right, scrubbed;
 * the script word wipes in separately.
 */
export function initChars(root = document) {
  qsa('[data-chars]', root).forEach((el) => {
    el.classList.add('is-split');
    if (env.reduced) return;
    const scripts = qsa('.t-script', el);
    scripts.forEach((s) => s.setAttribute('data-keep', ''));
    const split = SplitText.create(el, { type: 'words,chars', charsClass: 'ch', wordsClass: 'wd' });
    const chars = split.chars.filter((c) => !c.closest('.t-script'));
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 48%', scrub: 0.8 } });
    tl.fromTo(chars, { opacity: 0, filter: 'blur(12px)', yPercent: 12 }, { opacity: 1, filter: 'blur(0px)', yPercent: 0, ease: 'none', stagger: 0.035, duration: 0.5 }, 0);
    scripts.forEach((s) => tl.fromTo(s, { clipPath: 'inset(-30% 100% -40% -10%)' }, { clipPath: 'inset(-30% -10% -40% -10%)', ease: 'power1.inOut', duration: 0.9 }, 0.45));
  });
}

/** Line-mask rise, used for body copy (quiet register). */
export function initLines(root = document) {
  qsa('[data-lines]', root).forEach((el) => {
    if (env.reduced) { el.classList.add('is-split'); return; }
    let played = false;
    SplitText.create(el, {
      type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
      onSplit(self) {
        el.classList.add('is-split');
        if (played) return;
        return gsap.from(self.lines, {
          yPercent: 115, rotate: 2.5, transformOrigin: '0% 0%', duration: 1.15, stagger: 0.08, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }, onComplete: () => { played = true; },
        });
      },
    });
  });
}

/** Signature-script words wipe in left → right, like a pen stroke. */
export function initSigns(root = document) {
  qsa('[data-sign]', root).forEach((el) => {
    if (env.reduced || el.closest('[data-chars]')) return;
    gsap.fromTo(el, { clipPath: 'inset(-40% 100% -60% -20%)' }, {
      clipPath: 'inset(-40% -20% -60% -20%)', duration: 1.6, ease: 'power2.inOut',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}

/** Block rise for figures and list items. */
export function initRise(root = document) {
  if (env.reduced) return;
  ScrollTrigger.batch(qsa('[data-rise]', root), {
    start: 'top 92%', once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, stagger: 0.09, ease: 'expo.out', overwrite: true }),
  });
}

/** Igloo HUD decode. Width-safe for mono labels (fixed advance). */
export function decode(el, text = el.dataset.text || el.textContent, duration = 0.7) {
  if (!el) return null;
  el.dataset.text = text;
  if (env.reduced) { el.textContent = text; return null; }
  return gsap.to(el, { duration, ease: 'none', overwrite: true, scrambleText: { text, chars: SCRAMBLE_CHARS + '/_[]', revealDelay: 0.15, speed: 0.8, tweenLength: false } });
}

/** Count-up numerals. */
export function initCounts(root = document) {
  qsa('[data-count]', root).forEach((el) => {
    if (env.reduced) return;
    const to = +el.dataset.count;
    const o = { v: 0 };
    // lock the final width so counting never shifts the layout (CLS-safe)
    el.style.display = 'inline-block';
    el.style.width = `${el.getBoundingClientRect().width}px`;
    el.style.fontVariantNumeric = 'tabular-nums';
    el.textContent = '0';
    gsap.to(o, { v: to, duration: 1.8, ease: 'expo.out', snap: { v: 1 }, onUpdate: () => { el.textContent = String(o.v); },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
}
