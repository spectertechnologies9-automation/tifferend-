# CLAUDE.md — Tifferend site

Durable rules for anyone (human or agent) working on this repo.

## Creative authority
- The three reference recordings (AUGE, ERA, Igloo) are the visual authority. `docs/REFERENCE_ANALYSIS.md` records what was observed, and `docs/ART_DIRECTION.md` says which reference governs each section.
- **One reference per section.** Don't blend registers inside a section. New sections must name their governing reference in ART_DIRECTION.
- Avoid generic agency patterns: no header bar, no pill buttons (except the AUGE hover pill and ERA outlined pill), no cards, shadows, gradients or random italics. Script type appears only as the single ERA script word in an ERA statement.

## Content integrity
- Use only content verified on the client's site or supplied by the client (`docs/CLIENT_CONTENT_INVENTORY.md`).
- Never present the live site's placeholder projects or their metrics as client work.
- Testimonials stay behind `FEATURES.testimonials` (`src/js/config.js`) until confirmed.
- Illustrative images must say so in their alt text and must never be captioned as client work.

## Architecture
- Vite multi-page with `base: './'`. Internal links are explicit relative `…/index.html` paths.
- Content lives in HTML (works without JS). JS enhances.
- CSS: `tokens` → `base` (type primitives `.mega` AUGE, `.era` ERA, `.hud` Igloo, `.lbl`, `.legal-txt`) → `chrome` → per-page files.
- JS: `main.js` boots. Shared: `motion/{text,transition,cursor,strip,chrome}.js`, `ui/ui.js`. Home choreography: `motion/home.js`. Case/careers: `motion/pages.js`.
- Chrome colour comes from `data-theme` on sections (light | dark | ember | fog). The innermost active section wins.
- Pre-animation hidden states are gated on `.js:not(.reduced)` in `base.css`. Every reveal needs a reduced-motion end state.
- Decoding text that changes width must use `mixedDecode(..., { overlay: true })` to stay CLS-safe.
- Page-title decode runs only on arrival through the in-site wipe. Direct loads show the title at once (LCP).
- `html{overflow-x:clip}` hides overflow from `scrollWidth`. `tests/run.mjs` therefore checks element edges, and any offender fails the run.
- Only Inter Tight 400/600/900 are loaded. Don't use 500/700 (they'd map to 400/900).
- No React. The site is vanilla. Port component ideas (e.g. React Bits) to plain JS in `motion/`.
- Scrubbed compositions use one CSS variable tweened by GSAP (`--p` on `.work`, `--q` on `.c-next`), with all geometry in CSS `calc()`. The static/reduced state must be a finished composition by itself.
- Interaction feedback (press, magnet) uses the independent `scale` / `translate` properties, never `transform`, so it can't fight GSAP transforms.
- Pinned timelines need settled holds between transitions. Derive state shown in the UI (counters, labels) from `self.progress`, never from a scrubbed timeline's lagging `time()`.
- Scroll restoration is manual (`main.js`, re-applied after `ScrollTrigger.refresh()`). Don't switch it back to `auto`, or a reload inside a pin lands in the wrong place.

## QA before declaring done
`npm run build && npm run preview`, then `npm test`, `npm run xbrowser` (WebKit + Firefox + Chromium) and `npm run perf`. On Windows, stop the preview before building: it locks `dist/`. Record real results in `PROJECT_STATUS.md`. Never claim unmeasured scores or untested browsers.
