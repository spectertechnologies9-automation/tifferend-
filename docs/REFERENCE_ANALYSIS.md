# Reference Analysis — AUGE · ERA · Igloo

**Source:** the three supplied screen recordings. All are 1920×1080, 60 fps, with Chrome UI visible.

**Method (session 2):**
- Full-resolution frames extracted at 30 key timestamps, with browser chrome cropped off.
- 1 fps contact sheets across the full duration of each recording.
- 3–5 fps sequences around every transition.
- Colours sampled from raw frame pixels.

The earlier session's motion table (`MOTION_REFERENCE.md`) is still valid. This document adds typography, colour, composition and image direction, and states which reference governs which part of the Tifferend site.

What a recording **cannot** establish is listed in §5. Font names below are identifications by eye (no source access). Where I'm not certain, I say so.

---

## 1. AUGE Experience (auge-xp.com) — 35.5 s

### Typography

| Role | Observation | Identification | Free alternative used |
|---|---|---|---|
| Wordmark / case titles | Heavy-to-black neo-grotesque, all caps. Tight but not crushed tracking (≈ −0.02em), line-height ≈ 0.85. "AUGE" spans ≈ 46% of viewport width; "AC40 / LUNAROSSA" spans ≈ 64%, centred, cap height ≈ 18vh. G has a spur, R has a straight leg, S terminals are horizontal. | Neue Haas Grotesk Display / Helvetica Now Display Black class. **Not verified.** | **Inter Tight 800–900** (OFL). It's the same neo-grotesque category with similar G/R/S construction; slightly narrower apertures. |
| Intro paragraph | Neo-grotesque regular, ≈ 26 px at 1920, sentence case, line-height ≈ 1.3, ragged right. Column starts at ≈ 58% of width. | Same family, text cut | Inter Tight 400/500 |
| Labels / legal row | Same grotesque, bold, all caps, ≈ 16 px: "© 2026 - P.IVA … \| PRIVACY \| COOKIES \| 🔈" bottom-left, "LINKEDIN \| INSTAGRAM" bottom-right. Pipes are separators. | — | Inter Tight 600 caps |
| Case metadata | Small caps label ("INSTALLATION") centred under the title. Left column lists disciplines in regular sentence case (Installation / Touchscreen / Motion Design). | — | Inter Tight |
| Scramble state | During decode, glyphs switch between italic serif and upright grotesk ("AC46 LUNAROSPS" → "AC40 LUNAROSSA"). Small labels decode into random caps ("LPSPNYPA"). | Effect, not a font | ScrambleText with a mixed font span |

Typography is **monumental but sparse**: one giant word, one paragraph, one legal row. No decorative italics except the velocity skew (A2) and the decode moment.

### Colour

| Token | Sampled | Use |
|---|---|---|
| Canvas | `#EDF0E5` (warm, slightly green off-white) | All light pages |
| Ink | ≈ `#0A0A0A` | All type |
| Signal | `#FAF98F` (pale lemon) | Cursor diamond, "View project" pill, the menu button's two lines, page-transition panel |
| Dark chapter | `#000000` | Immersive case section (A9) |
| Secondary cursor | Navy diamond on the case page | Cursor state change per page |

Colour comes **only from the photography**. The UI is monochrome plus one signal colour.

### Composition (home, 1920×1080)

- **Top 0–48vh:** a single row of images with **ragged bottoms** (heights ≈ 37–55vh, widths ≈ 15–29vw), butted edge-to-edge with no gutters, drifting left. Images bleed off both edges.
- **Bottom-left:** the giant wordmark, baseline ≈ 92vh, left margin ≈ 2vw.
- **Right:** small diamond accent over the last letter. Label "AUGE EXPERIENCE©" at ≈ 58vw / 63vh, paragraph beneath.
- **Bottom-right:** black square menu button (≈ 90 px) with two signal-coloured lines, at ≈ 94vw / 83vh.
- **Legal row:** at ≈ 95vh, full width.
- Top-right of the case pages: a monogram logo.
- **No header bar and no nav links.** Navigation is the menu square.

### Motion

| Element | Starting state | Trigger | Animation | Ending state |
|---|---|---|---|---|
| Image row | Row partially off-screen right | Autoplay + scroll/drag | Continuous right→left drift ≈ 70 px/s; images **skew** (top edge leans) when velocity rises | Endless |
| Wordmark + paragraph | Upright | Strip velocity | Skew to ≈ −12° italic, spring back ≈ 0.4 s | Upright |
| Card hover | Card at rest | Pointer over image | Bold caps name + discipline appear above the card and **decode**; lemon pill "View project" follows the cursor and decodes | Readable label |
| Card click | Row in place | Click | Card shrinks to a small centred thumbnail (≈ 0.8 s) while the page desaturates to grey | Thumbnail centred |
| Transition panel | Grey page | Continues | Lemon panel rises from the bottom with a **convex curved top** (≈ 0.4 s, expo) | Full lemon screen |
| Case title | Lemon screen + thumbnail | Auto | Title decodes over ≈ 2 s, mixing italic-serif and grotesk glyphs | "AC40 LUNAROSSA" |
| Case hero | Lemon | Route change | Hero image slides down from the top as a band with a **curved bottom edge**. Giant title reveals | Band + giant centred title |
| Case text | Hidden | Scroll | Paragraph lines rise **with slight rotation** (≈ −2° → 0°), staggered; disciplines list staggers; labels decode | Readable |
| Dark section | Light page | Scroll | Black chapter with 3D panels in perspective (rotateY ≈ ±10–15°); mono-ish UI lists | — |
| Light return | Black | Scroll | White panel rises with a **curved top edge** | Light page |
| Next project | Small image centred, name right | Hover / click | Pill → repeat of the transition | Next case |

---

## 2. ERA Residence (era-residence.com) — 47.0 s

### Typography

| Role | Observation | Identification | Free alternative used |
|---|---|---|---|
| Display | **Ultra-condensed, high-contrast Didone caps** (hairline serifs, vertical stress). Sizes: "ERA" ≈ 18vh, "RESIDENCE" ≈ 18vh spanning 33vw. Section statements ≈ 6–7vh, centred, 2–3 lines. Numerals for stats and the phone number are huge in the same face. | A condensed display Didone. Identity **not verified**. | **Instrument Serif** (OFL). It's a condensed contemporary serif, not as extreme, so set slightly larger with tighter tracking. Closest practical free option. |
| Script insertion | One word per statement in a **formal connected script**, overlapping the caps line ("Estepona", "yours"). It's larger than the caps x-height and has long swashes. | — | **Pinyon Script** (OFL), formal copperplate script. |
| Labels | Wide geometric sans, bold, caps, tracked ≈ +0.25em, ≈ 13 px ("BOOK A CALL", "CONTACT", "THE CONCEPT", "BEDROOMS", "SALES OFFICE"). | — | Inter Tight 600 caps, +0.24em |
| Body | Small neo-grotesque, centred, ≈ 17 px ("Inspired by the atmosphere of Marbella's…"). | — | Inter Tight 400 |
| Badge | Circular text "ERA · RESIDENCE ·" around a floral mark, top-left, rotates on scroll. | — | Circular "TIFFEREND · CREATIVE BRANDING STUDIO ·" badge around the ember dot |

Statements are **restrained and centred**. Drama comes from contrast between ultra-condensed caps and one script word, not from size alone.

### Colour

| Token | Sampled | Use |
|---|---|---|
| Cream | `#F2F4E9` | Concept, "coast", license chapters |
| Navy ink | `#182037` | Type on cream |
| Sky | `#20498B` (photo sky) | Hero, carried by photography |
| Powder blue | `#B5D0D9` | "Three reasons" circle, apartment chapters |
| Maroon | `#2F0722` | Intro curtain, footer/contact finale |
| Botanical magenta | Bougainvillea photo cut-outs | Accent carried by imagery |

Each chapter switches the **whole background colour**, and the switch is itself an animated shape (arch, circle, slanted panel).

### Composition

- **Persistent chrome:**
  - Circular badge top-left (≈ 7vw, 20vh).
  - Under it, a vertical hairline progress rail with a **numeric counter 00 → 100**, plus "SCROLL ↓" lower (or "TO TOP ↑" at the end).
  - Top-right: stacked condensed-serif CTA "SELECT / AN APARTMENT" underlined, with tracked "BOOK A CALL / CONTACT" beneath.
- **Hero:** title centred. "A PLACE … TO RETURN TO" split to the far left and right on the same baseline. "BY DAY ——— BY NIGHT" toggle under the script.
- **Statement chapters:** small label centred above, 2–3 centred lines of caps, small centred body paragraph, floral glyph below. Botanical cut-outs bleed in from the corners.
- **Data chapters:**
  - Left: label + huge condensed numeral (BEDROOMS 3, AREA UP TO 178 — 202 M²).
  - Centre: tall portrait image (≈ 22vw × 75vh) that enters **skewed/trapezoidal**.
  - Right: small body + outlined pill CTA.
- **Map chapter:** a thin hand-drawn line runs across the screen with **station dots and labels** (GIBRALTAR 50 MIN … MALAGA AIRPORT 45 MIN). The line draws on scroll.
- **Finale:** maroon. Glyph centred, the phone number huge, address small below, legal two-column row at the bottom.

### Motion

| Element | Starting state | Trigger | Animation | Ending state |
|---|---|---|---|---|
| Intro curtain | Maroon full screen | Load | Arch (round top, flat bottom) grows up from the bottom centre (6.7–8.3 s), then expands to full screen (8.3–8.7 s) | Full-bleed hero |
| Hero title | Invisible | Load (inside arch) | Glyphs fade in with blur, staggered; script draws in | Static |
| Statement caps | Invisible | Scroll | **Per-character** opacity/blur reveal left→right; script word fades separately | Readable |
| Body lines | Masked | Scroll | Line-mask rise | Readable |
| Circle opener | Panorama | Scroll (scrubbed) | Powder-blue semicircle rises from the bottom with arc text "THREE REASONS TO CHOOSE ERA", then grows to cover (≈ 1 s of scroll) | New chapter colour |
| Map line | Undrawn | Scroll | Stroke draws left→right; station dots/labels appear as the line passes | Full map |
| Image panels | Off-screen / skewed | Scroll | Rise with a **slanted top edge** that flattens; small images grow into larger ones | Rectangular |
| Section join | Previous chapter | Scroll | Slanted panel (≈ 6° diagonal edge) slides over the previous chapter | Next chapter |
| Rail counter | 00 | Scroll | Counts to 100 with page progress | 100 + "TO TOP" |
| Badge | — | Scroll | Rotates with scroll | — |

---

## 3. Igloo Inc. (igloo.inc) — 0–48 s of recording C

### Typography

| Role | Observation | Free alternative |
|---|---|---|
| Logo | Rounded geometric display wordmark "IGLOO" (custom) | n/a |
| HUD | **Monospace caps**, ≈ 14 px: "PORTFOLIO_CO_01 / FUNKY PENGUINS", coordinates, dates, "// Copyright © 2026", "////// Manifesto". Labels attach to objects with thin leader lines. | **Space Mono** (already the Tifferend UI font) |
| Status | "🔈 Sound: On" bottom-left | Space Mono |

### Colour

Monochrome fog: `#9296A2` → `#B6BAC5` gradients, white highlights, near-white HUD text. **No accent colour.** The palette is the atmosphere.

### Composition

- Centred object in fog. HUD label offset up-left of the object with a leader line. Logo top-left, manifesto block top-right, status bottom-left.
- **One subject per screen.**

### Motion

| Element | Starting state | Trigger | Animation | Ending state |
|---|---|---|---|---|
| Igloo blocks | Assembled | Pointer / scroll (uncertain) | Seams glow, blocks lift apart | Re-assemble |
| Scene change | Scene | Scroll | Wireframe constellation, then horizontal **RGB-split smear** | Next scene |
| Portfolio shard | In fog, far | Scroll | Crystal shard approaches/rotates. HUD label decodes ("IITVHIOLJYFKZ,5" → name). Leader line draws | Readable label |
| Ring portal | — | Scroll | Ring of light zooms toward camera | Next item |
| Character | Solid | Scroll / hover | Dissolves into particles, re-forms | — |

---

## 4. Mapping: which reference governs which part of Tifferend

One reference governs each part. They aren't blended inside a section.

| Tifferend part | Governing reference | Techniques taken (observed) |
|---|---|---|
| Loading sequence | **ERA** (B2–B4) | Full-colour curtain → arch grows from the bottom → full bleed. Handed off with a shared-element move (AUGE A5 in reverse) into the first image of the home strip |
| Home first viewport | **AUGE** | Edge-to-edge ragged image row across the top. Giant wordmark bottom-left. Studio label + paragraph right. Legal row. Black menu square bottom-right. Velocity skew. Hover decode + pill |
| Global chrome | **ERA** (top-right CTA stack, badge, rail) + **AUGE** (menu square, legal row) | ERA's stacked "START / A PROJECT" + "BOOK A CALL / CONTACT" (real Tifferend CTAs). Rotating circular badge. 00→100 rail |
| Clients | **AUGE** typographic register | Names as a heavy caps index, no logo marquee |
| Philosophy statement | **ERA** (B7/B8) | Centred condensed caps with one script word ("personal"), per-character reveal, centred body |
| Numbers | **ERA** data chapter | Label + huge condensed numerals flanking a tall skew-entering portrait |
| Selected work | **AUGE** (A11 "next project" block + A5 click) | Small centred image, name right, pill, shrink-and-wipe |
| Services | **Igloo** | Fog chapter, one subject per screen, shard-clipped images, mono HUD labels with leader lines and decode, RGB-split on change |
| Process | **ERA** (B6 + B9) | Circle opener with arc text, then the "map": a drawn line with three stations (Understand / Create / Amplify) |
| Studio / mission / values | **ERA** statement chapter | Centred caps + script word, centred body, glyph |
| Contact finale + footer | **ERA** (B12) | Deep colour chapter, glyph, giant condensed email, small centred details, two-column legal row |
| Case study | **AUGE** (A7–A12) | Lemon→ember panel + decode title. Hero band with curved bottom. Giant centred title + category. Rotating line reveals. Black perspective chapter (palette). Curved-top white return. Next-project block |
| Careers | **AUGE** case-text register | Centred giant title, left-column metadata, roles as big grotesk rows |

## 5. Not verifiable from the recordings

- Exact font families (identified by eye only).
- Whether AUGE's drift is autoplay or scroll-driven (looks like both).
- Whether Igloo's block lift is triggered by hover or scroll.
- Easing curve formulas (inferred from frame spacing).
- Any behaviour off-screen or before each recording starts.
- No mobile behaviour is shown in any recording, so every mobile decision is an interpretation.
