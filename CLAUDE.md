# CLAUDE.md — Tifferend site

Durable rules for anyone (human or agent) working on this repo.

## Creative authority
- The visual authority is the user's screen recordings, specifically:
  - **LN** (the Lando Norris segment, 53–89 s of the Igloo recording);
  - **ERA**;
  - **IG** (Igloo, 0–48 s).
- `docs/REFERENCE_VIDEO_BREAKDOWN.md` records what was observed, with timestamps. `docs/ART_DIRECTION.md` says which reference governs each section.
- AUGE is no longer a governing reference.
- **One reference per section.** Don't blend registers inside a section. New sections must name their governing reference in ART_DIRECTION.
- Each palette colour owns whole chapters. Don't sprinkle colours as decoration.
- My Mithila's own palette (forest / mustard / bone) is used only for the work chapter and the case study.
- Avoid generic agency patterns:
  - no header bar;
  - no pill buttons (buttons are LN lime rectangles, radius 4 px);
  - no card grids except LN notched `.cell`s;
  - no drop shadows, gradients or random italics.
- Script type (`--f-script`) appears at most once per block: one word in an ERA statement, or one LN signature.

## Content integrity
- Use only content verified on the client's site or supplied by the client (`docs/CLIENT_CONTENT_INVENTORY.md`).
- Never present the live site's placeholder projects or their metrics as client work.
- Testimonials stay behind `FEATURES.testimonials` (`src/js/config.js`) until confirmed.
- Generated or illustrative images must say so in their alt text, and captions where shown. Never caption them as client work.
- Paid Higgsfield generations only after the user approves a quoted price.

## Architecture
- Vite multi-page with `base: './'`. Internal links are explicit relative `…/index.html` paths.
- Content lives in HTML and works without JS. JS enhances it.
- **CSS layering:** `tokens` → `base` (type primitives `.t-mega .t-state .t-serif .t-script .t-label .t-wide .t-mono .t-body .t-lede`, `.btn`, `.cell`, `.contours`) → `chrome` (chrome, menu, loader/wipe, footer) → per-page files.
- **JS layout:**
  - `main.js` boots.
  - Shared: `fx/{text,transition,chrome,marquee,cursor}.js`, `ui/ui.js`.
  - Home: `pages/home.js`. Case and careers: `pages/pages.js`.
- Chrome colour comes from `data-chrome` (dark | light) on sections. `data-theme` sets section colours and the `--bar`/`--accent` vars.
- **Stacked layout is the CSS default:** services, map, opener, fan.
  - The pinned/sticky versions are opt-in classes (`.is-pinned`, `.is-on`, `.is-fanned`), added by `gsap.matchMedia()` on ≥1024 px (services, map) or ≥761 px, with motion allowed.
  - Mobile, reduced motion and no-JS all get the stacked layout.
- **`overflow: hidden` breaks sticky.** On any ancestor of a sticky stage, use `overflow: clip` instead.
- **GSAP folds the CSS `translate` property into its own transform.** Never centre an element with `translate: -50% -50%` if you'll tween `xPercent`/`yPercent` on it. Centre with insets + `margin: auto`, or negative margins.
- Pre-animation hidden states are gated on `.js:not(.reduced)` in `base.css`. Every reveal needs a reduced-motion end state.
- The inline head script removes `js` after 5 s if boot never finishes.
- **No layout-affecting tweens on load** (margins, widths of in-flow elements). Use clip-path/transform.
- Numbers lock their width before counting.
- The three display fonts are preloaded in each page's `<head>`. Keep that, because it brought CLS to 0.
- `html{overflow-x:clip}` hides overflow from `scrollWidth`, so `tests/run.mjs` checks element edges and any offender fails the run. Decorative bleeds must be added to its exclusion list.
- **Fonts:** Archivo Variable (one wdth file for all weights and widths), Instrument Serif 400, Herr Von Muellerhoff 400, Space Mono 400. Don't add families without updating ART_DIRECTION.

## QA before declaring done
- Run `npm run build`, then serve `dist` (`npm run preview`).
- Then `npm test` (layout 24 + interaction 29) and `npm run perf`.
- Use `node tests/shoot.mjs <page> <w> <h> <out> <sel@offset…>` for chapter screenshots, and `node tests/cls-probe.mjs <page>` to attribute layout shifts.
- Record real results in `PROJECT_STATUS.md`. Never claim unmeasured scores or untested browsers.
