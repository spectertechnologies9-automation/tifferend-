# Motion Reference — analysis of the three supplied recordings

Method: every recording was decoded with ffmpeg, sampled at 1 fps (Igloo at 0.5 fps) across its **full** duration, and assembled into timestamped contact sheets. Key transitions were re-sampled at 3–5 fps for timing. All recordings are 1920×1080 at 60 fps.

| Recording | Duration | Content |
|---|---|---|
| A. AUGE Experience (auge-xp.com) | 35.5 s | Home strip → project open → AC40 Lunarossa case → next project |
| B. ERA Residence (era-residence.com) | 47.0 s | Intro → hero → full homepage scroll → footer |
| C. "Igloo Inc." | 92.7 s | 0–48 s igloo.inc; **48–90 s the recording continues on awwwards → landonorris.com** (also analysed below as a bonus) |

Timings are ±0.2 s (sampling resolution). Easing is inferred from frame spacing (large movement early, small late = ease-out). Triggers are inferred from cursor position and URL changes, and are marked *uncertain* where they couldn't be established.

## A. AUGE Experience

| # | Time | Initial state | Observed change | Trigger | Direction / pacing | Easing | Purpose | Tifferend adaptation | Mobile | Conf. |
|---|---|---|---|---|---|---|---|---|---|---|
| A1 | 0–12 s | A row of project images of varied size/height across the top ~45% of the viewport | The row drifts continuously right→left (~70 px/s). Images enter at the right and exit at the left in an infinite loop | Autoplay, accelerated by wheel (uncertain) | Horizontal, constant | Linear plus a velocity boost | Shows a lot of work without a grid; feels alive | **Work strip**: an infinite drifting strip of My Mithila deliverables, with wheel/scroll velocity added | Native horizontal swipe with scroll-snap, no autoplay drift | High |
| A2 | 4–11 s | "AUGE" wordmark is upright | The giant wordmark and the paragraph **skew to italic** while the strip is moving fast, then return to upright | Scroll/drag velocity | Skew X ≈ −10° | Spring back ~0.4 s | Makes speed visible | Velocity skew (clamped ±8°) on strip cards and the giant "tifferend" wordmark | Off | High |
| A3 | 4–11 s | Card at rest | Hovering a card shows a small yellow pill label beside the cursor that **scrambles** from random letters into "View project" (~0.4 s). The project name and discipline appear above the card in bold condensed caps, also scrambled ("JJ CREG YSGBHBVXGD" → resolves) | Hover | Text decode left→right | Stepped | Turns hover into a micro-reveal | Cursor pill "View case" + scrambled card caption | Caption always visible below each card, no pill | High |
| A4 | 0 s, 3 s | Intro label "AUGE EXPERIENCE©" | The label itself appears scrambled ("RUQS YTYERFSGCE") before settling | Page load / interval | — | Stepped | Brand texture | Eyebrow labels decode once on enter | Same (cheap) | High |
| A5 | 13.1–14.3 s | Card clicked | The other cards stay; the clicked image **shrinks and travels to centre-top** as a small thumbnail (~0.8 s). The rest of the page desaturates to grey | Click | Scale ≈ 1→0.45, translate to centre | Ease in-out | Keeps context while leaving | Shared-element feel: clicked card scales toward centre while the page dims | Skipped; goes straight to the wipe | High |
| A6 | 14.3–14.7 s | Grey page | A pale-yellow panel **rises from the bottom with a convex curved top edge** (bulging bezier) and covers the viewport in ~0.4 s | Continuation of A5 | Bottom→top | Expo in-out | Signature page transition | **Ember curved wipe** for every internal navigation (SVG path morph: flat → curved → flat) | Same; it's cheap | High |
| A7 | 14.7–16.9 s | Yellow page, thumbnail + title | The title "AC40 LUNAROSSA" decodes over ~2 s, mixing *italic serif* and upright sans letters per glyph | Auto | Per-glyph | Stepped | Loading moment with personality | Case-study title decodes on arrival (≤1 s, so it doesn't add wait) | Same | High |
| A8 | 17–19 s | Case page | Huge "AC40 / LUNAROSSA" display type. A hero image slides down behind it with a **curved bottom edge**, then text lines reveal | Load + scroll | Top→down | Ease-out | Editorial opening | Case hero: masked line reveal + image reveal | Same, smaller type | Med |
| A9 | 20–26 s | Light page | Scrolling into a **black immersive section** with 3D-rendered panels that rotate in perspective and staggered UI lists (FOILS / SAILS / CONTROL…) | Scroll | Z-depth | Ease-out | Changes register, shows craft | Dark "Process" chapter with perspective-tilted panels (CSS 3D, no WebGL) | Flat stacked | Med (3D implementation unknown) |
| A10 | 27 s | Dark section | A white panel **rises with a curved top edge** to return to the light register | Scroll | Bottom→top | Scrubbed | Scene change | Curved-edge section joins between dark and light chapters | Same | High |
| A11 | 29–32 s | End of case | "NEXT PROJECT" card. Hover shows the yellow pill. Click repeats A5–A7 | Hover/click | — | — | Continuity | "Next" block on the case page leads to Contact through the same transition | Same | High |
| A12 | throughout | — | Persistent UI: tiny legal footer row, a black square menu button bottom-right, the logo mark top-right | — | — | — | Minimal chrome | Minimal fixed chrome: wordmark top-left, menu + CTA top-right | Same | High |

## B. ERA Residence

| # | Time | Initial state | Observed change | Trigger | Direction / pacing | Easing | Purpose | Tifferend adaptation | Mobile | Conf. |
|---|---|---|---|---|---|---|---|---|---|---|
| B1 | 0–5 s | Hero visible (the recording starts mid-session) | Static hero. Condensed serif caps "ERA RESIDENCE", script "Estepona", flanking caps "A PLACE … TO RETURN TO", rotating circular badge logo top-left | — | — | — | Typographic contrast (condensed caps vs script) | Lora caps vs Lora italic contrast in the hero headline | Same | High |
| B2 | 5.5–6.5 s | Reload | Full-screen solid deep maroon | Reload (uncertain) | — | — | Curtain | Loader curtain (black) with the verified loader words | Same, shorter | High |
| B3 | 6.7–8.3 s | Maroon | An **arch-shaped window** (rounded top, flat bottom) grows from the bottom centre, revealing the hero photo inside (~1.6 s). Title glyphs fade/blur in, staggered, inside the arch | Load | Upward + widening | Ease-out | Memorable intro, architectural motif | **Arch reveal**: hero image inside an arch that grows, then expands to full-bleed | Arch grows faster (0.9 s) | High |
| B4 | 8.3–8.7 s | Arch ~70% wide | The arch expands to full viewport and the frame disappears | Auto | Radial | Expo-out | Hand-off to hero | Same, then scroll keeps a subtle scale-down (1.12 → 1) | Same | High |
| B5 | 11–20 s | Hero | Scroll lifts the title away. The photo becomes a full-bleed panorama; hotspot circles and a cream info card ("YOUR PRIVATE SANCTUARY") slide in at right | Scroll | Vertical | Ease-out | Cinematic establishing shot | Hero parallax: headline drifts up and fades, image scales | Simplified | High |
| B6 | 21.2–22.2 s | Panorama | A **pale-blue semicircle** rises from the bottom carrying curved text "THREE REASONS TO CHOOSE ERA" set on the arc, then grows until it covers the screen (~1 s) | Scroll (scrubbed) | Bottom→up, scale | Linear to scroll | Chapter break with a graphic signature | **Process chapter opener**: ember-ink semicircle with "Understand · Create · Amplify" on a textPath | Smaller circle, still scrubbed | High |
| B7 | 22–24 s | Blue page | "REAL…" condensed caps reveal letter by letter. Architectural image panels rise in from the bottom | Scroll | Up | Ease-out | Pacing | Line/char reveals on section headings | Same | High |
| B8 | 24–28 s | Cream page | Bougainvillea cut-out image drifts in from the corner over the text. Statements in condensed caps with an italic script word inside ("THE COAST YOU WANTED *yours* THIS YEAR") | Scroll | Diagonal parallax | Ease-out | Layered depth | Philosophy statement with an italic emphasis word and layered image parallax | Parallax reduced | High |
| B9 | 27–28 s | — | A map line with labelled destinations **draws** left→right (SVG stroke) | Scroll | L→R | Linear to scroll | Turns data into a drawing | Process timeline line drawn by scroll | Same | High |
| B10 | 29–39 s | — | Alternating image/text compositions. Image panels reveal with clip-path (bottom-up, side-in). Small images grow into large ones | Scroll | Mixed | Ease-out | Editorial rhythm | Case-study image sequences use clip-path reveals | Same | High |
| B11 | left edge, throughout | — | Thin **vertical progress line** with section numbers (00…100) on the left | Scroll | — | — | Orientation | Section index/progress rail on desktop | Hidden | High |
| B12 | 40–46 s | — | Final scene on deep maroon: a phone number set huge in condensed serif, sales office address, legal row | Scroll | Up | Ease-out | Strong closing CTA | **Contact finale**: `hello@tifferend.com` set huge in Lora, with the CTA and form beneath | Wraps to 2 lines | High |

## C. Igloo Inc. (0–48 s)

| # | Time | Initial state | Observed change | Trigger | Purpose | Tifferend adaptation | Mobile | Conf. |
|---|---|---|---|---|---|---|---|---|
| C1 | 0–4 s | 3D igloo on a snow-covered mountain, monochrome | Blocks light up with a white rim glow along the seams, then individual blocks lift and float apart | Hover/pointer or scroll (uncertain) | Tactile 3D hero | Not reproduced in 3D. It would need modelled assets and WebGL. Echoed as a pointer-reactive light sheen over the hero photo | Off | High observation / low implementation certainty |
| C2 | 8 s | Igloo | The scene dissolves into a **wireframe constellation** of lines and vertices around a translucent igloo | Scroll | Scene transition | Not reproduced (no 3D assets) | — | Med |
| C3 | 18 s | Scene | Horizontal **chromatic aberration / RGB-split** smear across the frame during the transition | Scroll | Glitch transition | Subtle RGB-split pulse (CSS `text-shadow`/`filter`) on the giant wordmark at the strip's peak velocity | Off | Med |
| C4 | 20–22 s, 36–38 s | — | Portfolio items as **ice-crystal shards** floating in fog, with **monospace HUD labels** ("PORTFOLIO_CO_01 / FUNKY PENGUINS", coordinates, dates) | Scroll | Experimental portfolio | HUD-style Space Mono metadata labels on work cards (index, discipline, year, coordinates of the studio) | Same | High |
| C5 | 24 s, 40–42 s | — | Circular **ring portal** that zooms toward camera | Scroll | Depth transition | Inspires the circular chapter opener (B6) | — | Med |
| C6 | 26–32 s, 44–46 s | Character on a pedestal | The character **dissolves into particles** that stream upward, then re-forms | Scroll/hover (uncertain) | Spectacle | Not reproduced (needs WebGL particles). A lightweight canvas grain/particle layer is out of scope for v1 | — | Med |
| C7 | throughout | — | Minimal UI: logo, tiny mono copyright, "Sound: On" toggle, mono manifesto block top-right | — | Restraint | Mono micro-copy blocks (e.g. "© 2026 / Tifferend / Creative branding studio") | Same | High |

### Bonus: landonorris.com (48–90 s of recording C)

| Time | Observation | Adaptation |
|---|---|---|
| 54–57 s | Lime full-screen loader with a monogram that draws in | Loader concept (ours uses the loader words) |
| 60 s | A portrait in a box with an animated diagonal brush stroke across it. Big type is split left/right around the image | — |
| 62 s | Statement paragraph with **one word highlighted in accent colour** and an inline cursor caret as text reveals | **Philosophy paragraph: scroll-scrubbed word highlight** (words go from 20% to 100% opacity; key words take the ember colour) |
| 64–66 s | Scattered collage of small images on a contour-line background | — |
| 72–74 s | Dark helmet grid with hover-highlighted cells | — |
| 80 s | Partner logo marquee with a giant scribble overlay | Client name marquee |
| 84 s | Closing hero with nav columns and logos | — |

## Proposed animation inventory (implemented in `src/js/motion/`)

| ID | Name | Source refs | Tech | Reduced motion |
|---|---|---|---|---|
| M1 | Loader: word cycle → arch reveal → full-bleed | B2–B4, client loader | GSAP timeline, `clip-path: inset(... round)` | Skipped |
| M2 | Line-mask text reveals (headings) | A8, B7 | GSAP SplitText (lines/chars, mask) | Text visible |
| M3 | Scramble decode for labels, pill, case title | A3, A4, A7 | GSAP ScrambleTextPlugin | Final text |
| M4 | Infinite drifting work strip + velocity skew | A1, A2 | GSAP ticker + Lenis velocity | Static scrollable row |
| M5 | Cursor pill "View case" | A3 | Pointer follow (`quickTo`) | Hidden |
| M6 | Curved ember wipe page transition | A6, A10 | SVG path morph | Instant navigation |
| M7 | Hero scroll: image scale + headline lift | B5 | ScrollTrigger scrub | Static |
| M8 | Scroll-scrubbed word highlight paragraph | Lando 62 s | ScrollTrigger scrub | Full opacity |
| M9 | Semicircle chapter opener with arc text | B6, C5 | ScrollTrigger scrub, SVG textPath | Static band |
| M10 | Process: pinned horizontal panels + drawn line | B9, A9 | ScrollTrigger pin + scrub | Vertical list |
| M11 | Service pinned list with clip-path image swap | B10 | ScrollTrigger | Plain list with images |
| M12 | Clip-path image reveals | B10 | ScrollTrigger batch | Visible |
| M13 | Stat counters | — | GSAP | Final numbers |
| M14 | Client marquee | Lando 80 s | CSS animation | Paused |
| M15 | Section progress rail | B11 | ScrollTrigger | Static |
| M16 | Curved-edge section joins | A10, B6 | CSS + scrub | Static curve |

Global timing tokens: `--ease-out: cubic-bezier(.16,1,.3,1)` (≈ expo out, matches A6/B4); durations fast 0.45 s, base 0.9 s, slow 1.4 s; stagger 0.06 s per line, 0.025 s per char.
