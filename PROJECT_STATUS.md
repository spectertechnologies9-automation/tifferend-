# PROJECT_STATUS — Tifferend website

_Last updated: 2026-10-21 (session 3: resume, critique and fixes after the session-2 rebuild)_

## Session 3: what happened (read this first)

**Recovered state.** The session-2 code, docs and fixes were all present and matched the handover. Left undone when session 2 stopped:

- the debug scripts `tests/probe*.mjs` (now deleted);
- the final rebuild and re-test;
- a fresh zip (the old one predated the last fixes).

**Critique.** I compared contact sheets of all three recordings with chapter screenshots at 1440, 1024 and 390, still in `/mnt/user-data/uploads`. Each finding and its fix:

1. **Services, desktop.** The "What we do" header overlapped the HUD label of each shard. The HUD now sits below the header block (`.svc__hud` top in `home.css`).
2. **Careers, mobile.** "THE TEAM" ran 6–9 px past the right edge at 360/390/430. The grid track also grew to the title's width, which pushed the intro paragraph to the edge. Fixed with a font-size cap of `(100vw − 2·gutter) / 4.9` and a `minmax(0,1fr)` track in `careers.css`. Measured result: the title spans 21→339 at 360 and 22→368 at 390.
3. **Corner chrome clearance, desktop.** The studio values row and the case credits ran under the fixed CTA stack. Both now keep clear of it.
4. **Careers LCP.** The title decode now runs only on arrival through the in-site wipe, which is where AUGE uses it. A direct load shows the title at once (`pages.js`). Careers LCP went from 1200 → 584 ms on desktop and 3060 → 2400 ms on throttled mobile, with CLS unchanged.
5. **Test gap.** `tests/run.mjs` collected edge offenders but never failed on them, because `html{overflow-x:clip}` hides page-level overflow. Offenders now fail the run, so finding 2 can't recur unnoticed.

**Tests run in session 3**, on a fresh `vite build` with the preview on :4173:

- **Layout (stricter check):** 24/24 clean, with no element past the viewport edge.
- **Interaction:** 27/27 pass.
- **Perf:**

| Page | Desktop transfer / LCP / CLS | Mobile (throttled) transfer / LCP / CLS |
|---|---|---|
| Home | 674 KB / 172 ms / 0.009 | 348 KB / 864 ms / 0.006 |
| Case | 442 KB / 152 ms / 0.011 | 495 KB / 1876 ms / 0.002 |
| Careers | 240 KB / 584 ms / 0.009 | 240 KB / 2400 ms / 0.009 |

**Still not run:** Lighthouse, Safari/WebKit, Firefox, real devices, screen reader.

**Noted while reviewing:** the Igloo recording also contains about 25 s of other sites (an Awwwards listing and a racing driver's site). Only the Igloo part (≈0–45 s) was used as reference.

---

_Session 2 notes below; the perf table there predates the session-3 fixes._

## Current state

The site was rebuilt around the three reference recordings. Each part of the experience is governed by one reference (see `docs/ART_DIRECTION.md`):

| Part | Reference | What it now is |
|---|---|---|
| Loader | ERA | Ember curtain + tracked loader words + 00→100 counter. An arch window rises from the bottom, expands to full bleed, then the photo **flies into the first slot of the AUGE strip** |
| Home first viewport | AUGE | Edge-to-edge ragged image row drifting across the top (velocity lean, hover decode, ember pill). Giant "tifferend" wordmark bottom-left. Studio label + paragraph right. Legal row. Black menu square |
| Chrome | ERA + AUGE | Rotating circular badge (top-left). Stacked condensed-serif "Start a project" + tracked "Book a call / Contact" (top-right). 00→100 hairline rail. All hidden over the AUGE first viewport, colour follows the chapter |
| Clients | AUGE | Heavy caps index with ember diamonds |
| Philosophy | ERA | Centred condensed caps + one script word, per-character blur reveal, scrubbed |
| Numbers | ERA data chapter | Dark slanted panel, condensed numerals, skew-revealed portrait, outlined pill |
| Selected work | AUGE A11 | Small centred image + name. Click → image shrinks, page greys, ember wipe |
| Services | Igloo | Pinned fog chapter: one monochrome shard per service approaching from depth, mono HUD with leader line, decode + RGB split on change, pointer-reactive tilt |
| Process | ERA B6 + B9 | Ember semicircle with arc text covers the screen, then a pinned "map": hand-drawn line with three stations |
| Studio | ERA | Statement + founder story + mission + four value "stations" |
| Contact | ERA B12 | Night chapter, glyph, giant condensed-serif email, underlined CTAs, form restyled without boxes |
| Case study | AUGE A7–A12 | Decode arrival, curved image band, giant centred title, rotating line reveals, black perspective palette panels, curved-top light return, traced motif kit, ragged image row, drifting 13-post social diary, next block |
| Careers | AUGE + ERA | Giant title, heavy grotesk role rows (skew on hover) with accordion, ERA statement, night apply finale |

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/ (static, relative paths)
npm run preview    # serves dist/ on :4173 (needed by the tests)
npm test           # layout QA + interaction tests (preview must be running)
npm run perf       # transfer / LCP / CLS
node tests/shoot.mjs index.html 1440 900 /tmp/shot ".philo" ".services@1"   # chapter screenshots
```

## Fonts (see REFERENCE_ANALYSIS §1–3)

| Role | Font used | Match status |
|---|---|---|
| AUGE monumental + body + labels | **Inter Tight** 400/600/900 | **Alternative.** AUGE looks like a Neue Haas / Helvetica Now Display Black class grotesk; exact font not identifiable from video |
| ERA condensed Didone | **Instrument Serif** 400 (+ italic in decode) | **Alternative.** ERA's face is more extremely condensed |
| ERA script word | **Pinyon Script** 400 | **Alternative.** Formal connected script, as observed |
| Igloo HUD | **Space Mono** 400 | **Category match** (monospace). Also Tifferend's existing UI font |
| Tifferend wordmark | **Lora** 700 | Tifferend's own identity font (kept) |

All fonts are OFL and self-hosted (latin subsets, 8 woff2 files).

## Assets this session

- **Added (captured from the live site via the built-in browser, 1:1 tile capture):** My Mithila social posts mm-01, mm-07 … mm-13 (8 new). The diary now shows all 13 real posts.
- **Re-created as vector:** the four My Mithila motifs (mountain/sun/water/leaf), traced as inline SVG from the client's motif PNGs. They're simple geometric shapes, so vector is crisper than a raster capture.
- **Re-used, not enlarged beyond source:** hero-field, wordmark, cards, billboard, storefront, tote, bamboo, illus-film-set (labelled illustrative).
- **Not used:** placeholder-project images. Client logos were deliberately replaced by the typographic index.

## Tests actually run (session 2, on `vite build` + `vite preview`, Chromium/Playwright)

1. **Baseline before changes:** session-1 build ✓, layout 24/24 clean, interactions 21/21.
2. **`tests/run.mjs` (final):** **24/24 clean.** 3 pages × 360/390/430/768/1440/1920, plus reduced motion at 390/1440. No horizontal overflow, 0 hidden reveal elements after scroll, 0 console errors, 0 failed requests.
   - Bugs found and fixed:
     - Client separators wrapped alone onto a line.
     - With no whitespace between `<li>`s, the client list became one unbreakable line in reduced motion.
     - Velocity skew pushed the hero paragraph 6 px off-screen on touch.
3. **`tests/motion.mjs` (final): 27/27 pass.**
   - Intro and transitions:
     - Loader completes and releases the strip; skipped on repeat visit.
     - Strip drifts; pill decodes on hover.
     - Chrome is hidden over the hero and shown after it.
   - Scroll chapters:
     - Per-character statement resolves.
     - Chrome theme follows dark and ember chapters.
     - Services pin advances shards 1 → 2 → 3.
     - Map line draws and stations appear.
   - Case study:
     - Work click → wipe → case; the overlay clears.
     - The decoded title returns to plain text.
     - Palette panels settle flat.
     - No page errors.
   - Mobile and keyboard:
     - Skip link is the first tab stop.
     - Menu square opens; focus is trapped; Esc closes it and returns focus.
     - The strip is natively scrollable on touch.
     - Form validation works.
     - Careers accordion opens; the Apply link is correct.
     - Focus ring is visible on the first 10 tab stops.
   - Bugs found and fixed:
     - After the loader, the hero paragraph, legal row and menu square stayed invisible (from-tweens ended at 0).
     - Cursor pill show/hide tweens raced, and the first hover was missed.
4. **`tests/perf.mjs` (final, localhost, so network figures are optimistic):**

| Page | Desktop transfer / LCP / CLS | Mobile (4× CPU, ~1.6 Mbps, 150 ms) transfer / LCP / CLS |
|---|---|---|
| Home | 674 KB / 204 ms / 0.009 | 348 KB / 988 ms / 0.006 |
| Case | 442 KB / 156 ms / 0.011 | 495 KB / 1860 ms / 0.002 |
| Careers | 240 KB / 1192 ms / 0.009 | 240 KB / 3136 ms / 0.001 |

   - Fixed: the case/careers CLS was 0.52–0.65, caused by the centred decoding titles resizing every frame. Decoding now draws in a transform-positioned overlay.
   - Remaining: careers mobile LCP (3.1 s throttled) waits for the 900-weight webfont, because the title decodes in after fonts load.
5. **Visual review:** chapter-by-chapter screenshots at 1440 and 390 for all pages, plus loader/wipe/arrival frames, inspected by eye. Fixes from review:
   - HUD contrast on fog (white → ink).
   - Rail overlapping left-aligned content (new `--pl` padding).
   - Next-project image overlapping its label.
   - Chrome colour over nested chapters.

**Not run:** Lighthouse (not installed), Safari/WebKit and Firefox, real iOS/Android devices, screen-reader pass.

## Decisions and rationale

- **Light canvas** (`#EDF0E5`, sampled from AUGE) replaces the session-1 all-black scheme. All three references are predominantly light. Dark is now a deliberate chapter (numbers, case palette, contact).
- **Typography follows the references, not the old Lora system.** Lora is kept only for the wordmark (identity). Every ERA statement uses exactly one script word, as ERA does.
- **No header bar:** AUGE has none, ERA uses corner chrome.
- **Pill buttons removed** except the AUGE hover pill and ERA's outlined pill CTA. Both are observed in the references.
- **Igloo interpreted without WebGL** (CSS 3D, clip-path, filters, fog gradients). No 3D assets exist for Tifferend, and a shader demo would cost performance without content to show.
- **Igloo HUD text is ink, not white.** White on light fog fails contrast (≈1.6:1). This is a documented deviation for legibility.
- **Content integrity unchanged:**
  - Only My Mithila is presented as work.
  - Testimonials stay behind `FEATURES.testimonials = false`.
  - Stats are client-stated and flagged.
  - No invented copy. All text is from the live site, lightly re-set ("6 open positions" counts the six listed roles).

## Unresolved issues / remaining work

1. Client confirmations are still needed: testimonials, stats, hero-photo and bamboo usage rights, and the placeholder projects.
2. Brand film (`/videos/mymithila.mp4`, 45.9 MB) is still not retrieved. A video can't be tile-captured, and direct download is blocked by the workspace network policy.
3. Careers mobile LCP is now 2.4 s throttled (was 3.1 s; see session 3). The rest is the font wait before hidden text appears. Preloading the Inter Tight 900 woff2 would shave it further.
4. Cross-browser and real-device QA (Safari/iOS especially: `clip-path` path morphs, `svh` units, sticky + Lenis).
5. Form backend, if the client doesn't want `mailto:`.
6. While scrolling, the fixed corner chrome (badge/CTA) passes over content. This is intentional (ERA does the same), but worth a client look.

## Exact next steps

1. Review on a real phone and in Safari. Adjust `svh` fallbacks if needed.
2. Get client answers for (1). Switch on testimonials if confirmed.
3. Obtain the brand film and add it to the case study (between the text chapter and Background) as `<video preload="none" muted playsinline>` with a poster.
4. Deploy `dist/` to the client's host (needs the user's permission) and run Lighthouse there.

## Files changed this session

- **Rewritten:**
  - `index.html`, `work/my-mithila/index.html`, `careers/index.html`
  - `src/styles/{tokens,base}.css`
  - `src/js/main.js`, `src/js/motion/{text,strip,home,pages,transition,cursor}.js`, `src/js/ui/ui.js`
  - `tests/motion.mjs`
- **New:**
  - `src/styles/{chrome,home,case,careers}.css`, `src/js/motion/chrome.js`
  - `tests/shoot.mjs`
  - `docs/{REFERENCE_ANALYSIS,DESIGN_AUDIT,ART_DIRECTION}.md`
  - 16 new image variants in `public/img/` (mm-01, mm-07…13)
- **Removed:** `src/styles/{components,sections,pages}.css` (replaced). The session-1 source is preserved in the session-1 zip delivered earlier.
- **Dependencies:**
  - Added `@fontsource/inter-tight`, `@fontsource/instrument-serif`, `@fontsource/pinyon-script`.
  - Existing: gsap 3.15 (ScrollTrigger, SplitText, ScrambleText; all free), lenis, @fontsource/lora, @fontsource/space-mono.
