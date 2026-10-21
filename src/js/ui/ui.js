import { gsap } from '../core/gsap.js';
import { env, qs, qsa } from '../core/env.js';
import { scrollToTarget, stopScroll, startScroll } from '../core/smooth.js';

/* Menu square → full-screen lime menu (dialog semantics, focus trap, Esc, focus return) */
export function initMenu() {
  const menu = qs('#menu');
  const btn = qs('.menu-btn');
  if (!menu || !btn) return;
  const links = qsa('.menu__list a', menu);
  let tl, open = false;
  const focusables = () => [btn, ...qsa('a[href], button:not([disabled])', menu)];
  const onKey = (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const f = focusables(); const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  function show() {
    open = true;
    menu.classList.add('is-open'); document.body.classList.add('menu-open');
    btn.setAttribute('aria-expanded', 'true'); btn.querySelector('.sr-only').textContent = 'Close menu';
    stopScroll(); tl?.kill();
    if (env.reduced) gsap.set(menu, { clipPath: 'inset(0 0 0% 0)' });
    else tl = gsap.timeline()
      .fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.75, ease: 'expo.inOut' })
      .from(links, { yPercent: 105, opacity: 0, stagger: 0.05, duration: 0.9, ease: 'expo.out' }, '-=0.3');
    document.addEventListener('keydown', onKey);
    setTimeout(() => links[0]?.focus(), 60);
  }
  function close(returnFocus = true) {
    if (!open) return;
    open = false;
    document.removeEventListener('keydown', onKey);
    btn.setAttribute('aria-expanded', 'false'); btn.querySelector('.sr-only').textContent = 'Menu';
    document.body.classList.remove('menu-open'); startScroll(); tl?.kill();
    const done = () => { menu.classList.remove('is-open'); gsap.set(links, { clearProps: 'all' }); };
    if (env.reduced) { gsap.set(menu, { clipPath: 'inset(0 0 100% 0)' }); done(); }
    else gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut', onComplete: done });
    if (returnFocus) btn.focus();
  }
  btn.addEventListener('click', () => (open ? close() : show()));
  links.forEach((a) => a.addEventListener('click', () => close(false)));
}

export function initAnchors() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    requestAnimationFrame(() => scrollToTarget(target));
    history.replaceState(null, '', id);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}

/* Enquiry form → composes an email (no backend; documented in PROJECT_STATUS) */
export function initForm() {
  const form = qs('#enquiry');
  if (!form) return;
  const status = qs('.form__status', form);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = ['name', 'email', 'message'].map((n) => form.elements[n]);
    let bad = null;
    fields.forEach((f) => {
      const ok = f.type === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()) : f.value.trim().length > 0;
      f.setAttribute('aria-invalid', String(!ok));
      if (!ok && !bad) bad = f;
    });
    if (bad) { status.textContent = bad.name === 'email' ? 'Please enter a valid email address.' : 'Please fill in your name, email and a short message.'; bad.focus(); return; }
    const d = new FormData(form);
    const services = d.getAll('services');
    const body = [`Name: ${d.get('name')}`, `Email: ${d.get('email')}`, d.get('company') ? `Brand / company: ${d.get('company')}` : null, services.length ? `Interested in: ${services.join(', ')}` : null, '', d.get('message')].filter((l) => l !== null).join('\n');
    const subject = `Project enquiry — ${d.get('company') || d.get('name')}`;
    status.textContent = 'Opening your email app… If nothing happens, write to hello@tifferend.com.';
    window.location.href = `mailto:hello@tifferend.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
  form.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') e.target.setAttribute('aria-invalid', 'false'); });
}

export function initAccordions() {
  qsa('[data-accordion] button[aria-controls]').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.closest('[data-accordion]')?.classList.toggle('is-open', !open);
      if (env.reduced) { panel.hidden = open; return; }
      if (open) gsap.to(panel, { height: 0, duration: 0.5, ease: 'expo.inOut', onComplete: () => { panel.hidden = true; gsap.set(panel, { clearProps: 'height' }); } });
      else { panel.hidden = false; gsap.from(panel, { height: 0, duration: 0.7, ease: 'expo.inOut', clearProps: 'height' }); }
    });
  });
}
