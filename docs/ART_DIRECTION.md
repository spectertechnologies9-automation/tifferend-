# Art Direction — session 2 rebuild

## Concept

**"A studio that frames brands."** The site behaves like the references' best moments:
- AUGE's confident, monumental studio voice for anything about **Tifferend itself** (identity, work, case study).
- ERA's slow, architectural storytelling for anything about **belief and process** (philosophy, numbers, process, studio, contact).
- Igloo's foggy one-subject-per-screen HUD world for **services**: the "lab" of what the studio makes.

Tifferend keeps its name, lowercase serif wordmark, ember accent and its real copy. Ember takes over the job AUGE gives to lemon (signal colour) and ERA gives to its circle (chapter colour).

## Typography system

| Token | Family | Use | Reference match |
|---|---|---|---|
| `--f-grotesk` | **Inter Tight** 500/700/800/900 | Monumental words (home wordmark echo, case title, careers title, role rows), labels, legal row, body | Alternative to AUGE's Neue Haas / Helvetica Now Display Black (same category; exact font not identifiable) |
| `--f-didone` | **Instrument Serif** 400 | ERA statements, numerals, CTA stack, giant email | Alternative to ERA's condensed Didone (less extreme; tracked tighter to compensate) |
| `--f-script` | **Pinyon Script** 400 | Exactly one word inside an ERA statement | Alternative to ERA's formal script |
| `--f-mono` | **Space Mono** 400/700 | Igloo HUD labels, metadata, counters | Igloo HUD is monospace. Also Tifferend's existing UI font |
| `--f-mark` | **Lora** 700 | The "tifferend" wordmark only (giant on home, small in chrome) | Tifferend's identity font, kept |

Scale rules:
- AUGE monumental: 13–20vw, line-height 0.82, tracking −0.035em.
- ERA statements: 5.2–7.4vw caps, line-height 0.95, tracking −0.01em, centred, max 3 lines.
- Labels: 11–13 px caps, tracking +0.24em (ERA) or +0.02em bold (AUGE legal row).
- Body: 16–19 px Inter Tight, line-height 1.4.

## Colour system

| Token | Value | Source |
|---|---|---|
| `--canvas` | `#EDF0E5` | AUGE canvas, sampled |
| `--cream` | `#F2F4E9` | ERA cream, sampled |
| `--ink` | `#0A0A0A` | AUGE ink |
| `--navy` | `#182037` | ERA ink (ERA chapters only) |
| `--ember` | `#FF7A4D` | Tifferend accent (replaces AUGE lemon / ERA powder blue) |
| `--fog-1/2` | `#9296A2` / `#B6BAC5` | Igloo fog, sampled |
| `--night` | `#140C0A` | ERA maroon role, warmed toward ember (contact finale) |

## Layout rules

- **No header bar.** Fixed chrome:
  - Badge top-left.
  - CTA stack top-right.
  - Menu square bottom-right.
  - Rail + counter on the left edge (≥ 1024).
  - Chrome inverts automatically over dark chapters (`mix-blend-mode: difference` on the stack/badge).
- Gutters: 2.1vw desktop (AUGE ≈ 40 px at 1920), 16 px mobile.
- **No cards, shadows, gradients or rounded rectangles.** The two exceptions are both taken from the references: the AUGE hover pill and ERA's outlined pill CTA (one, in the numbers chapter).

## Section specification and motion answers

Key: **T** = trigger, **Δ** = what changes, **D** = duration/ease, **N** = relation to the next interaction, **R** = fast-scroll/reverse behaviour, **M** = mobile, **RM** = reduced motion.

### 0. Loader (ERA)
- **T:** first load per session.
- **Δ:**
  - Ember curtain. Tracked caps loader words cycle.
  - Arch grows from the bottom (0.8 s expo.out), then expands full screen (0.9 s expo.inOut).
  - The full-bleed photo then **flies (GSAP Flip) into the first strip slot** (1.0 s expo.inOut) while the wordmark rises line-masked and the chrome fades in.
- **D:** ≈ 3.2 s total. Skippable by click or any key.
- **N:** ends exactly in the AUGE first viewport.
- **R:** scroll is locked during the 3.2 s and released after.
- **M:** same choreography. The arch is narrower.
- **RM:** no loader.

### 1. Home first viewport (AUGE)
- **Δ:**
  - The strip drifts left at 60 px/s. Scroll/drag velocity adds speed and skewX ±10° on images.
  - The wordmark and paragraph skew with velocity.
  - Hover: caption decodes (0.5 s) + ember pill "View case".
- **N:** clicking an image runs the AUGE shrink → grey → ember wipe.
- **R:** skew follows signed velocity and springs back (lerp 0.12).
- **M:** the strip becomes a native swipe row with captions always visible, no drift, no skew. The wordmark is 24vw. The paragraph moves under the wordmark.
- **RM:** static row.

### 2. Clients (AUGE register)
- **T:** enter viewport.
- **Δ:** names reveal line by line (line mask, 0.9 s, stagger 0.06). Hover sets a name in italic skew (−10°).
- **M/RM:** static.

### 3. Philosophy (ERA)
- **T:** scroll, scrubbed.
- **Δ:**
  - Caps statement reveals **per character** (opacity 0 → 1 with blur 8 → 0 px) left→right.
  - The script word "personal" fades/draws in after the caps.
  - Body lines mask-rise.
- **D:** scrubbed over ≈ 70% of viewport height.
- **R:** reversible (scrub).
- **M:** same, smaller.
- **RM:** visible.

### 4. Numbers (ERA data chapter)
- **Δ:** the centre portrait enters with a **skewed/trapezoid clip** (polygon → rectangle, 1.4 s). Numerals count up (1.6 s expo.out).
- **M:** 2×2 numerals, image above.
- **RM:** static.

### 5. Selected work (AUGE A11)
- **Δ:** hover shows the pill and scales the image 1.04. Click shrinks the image → grey page → ember wipe → case.
- **M:** tap goes straight to the wipe.

### 6. Services (Igloo)
- **T:** pinned for 3 × 100vh (desktop).
- **Δ:**
  - Fog background (CSS radial gradients + slow drifting noise).
  - Each service image is clipped to an irregular **shard polygon**, centred, monochrome.
  - On scroll the active shard approaches (scale 0.6 → 1, blur 10 → 0, rotateY 12° → 0); the previous one recedes into the fog (scale ↑, blur ↑, opacity ↓).
  - A HUD label (mono) with a leader line decodes beside it: "SERVICE_0X / NAME", followed by the verified bullet list as HUD lines.
  - An RGB-split flash plays on change.
- **D:** scrubbed.
- **R:** fully reversible.
- **M:** no pin. Each service is a fog screen with its shard and HUD, revealed on enter.
- **RM:** static stacked list with images.

### 7. Circle opener → Process map (ERA)
- **T:** scrub.
- **Δ:**
  - The ember semicircle with arc text rises and covers.
  - The map chapter (ember background) pins for 150vh while a hand-drawn line draws left→right.
  - Three station dots pop as the line reaches them. Each station's label and paragraph mask-rise.
- **R:** reversible.
- **M:** vertical line drawn top→bottom with stations stacked (no pin).
- **RM:** full drawn map, static.

### 8. Studio (ERA statement)
- Centred caps statement "CREATE A DIFFERENCE, *with a* DIFFERENCE" (script on "with a"), per-character reveal, founder story centred, mission small caps.
- Values as four ERA "stations" in a row (label + condensed numeral + one line).
- **M:** stacked.

### 9. Contact finale (ERA B12)
- Night colour, glyph (ember dot in a ring), **giant Instrument Serif email** that reveals per character.
- Centred details: "Book a free consultation" + "Start a project" underlined CTAs.
- The enquiry form is set as an ERA "sales office" block: underlined fields, no boxes. Legal row at the bottom.

### Case study (AUGE)
1. **Arrival:** ember wipe with thumbnail + decoding title (mixed serif-italic / grotesk glyph decode).
2. **Hero band:** the image slides down with a curved bottom edge (SVG mask path morph). The giant centred "MY MITHILA" (Inter Tight 900) reveals, with the category "REBRANDING" small beneath.
3. **Text chapter:**
   - Left: ©2024 + scope list stagger.
   - Right: about paragraph, **lines rise with −2° rotation** (AUGE A8).
4. **Background / Strategy:** two-column AUGE text.
5. **Verbal identity:** centred giant quote in Instrument Serif (it's a quote, so an ERA statement register).
6. **Black chapter:** palette swatches as perspective panels that rotate in (rotateY ±14° → 0, scrubbed), with mono labels.
7. **Curved-top white panel** returns to light: product images in an AUGE ragged row, OOH full bleed, tote.
8. **Social diary:** AUGE drifting strip.
9. **Next project:** small centred image + "START A PROJECT" → wipe to contact.

### Careers (AUGE)
- Giant centred "JOIN THE TEAM" grotesk.
- Left metadata column, roles as heavy rows (hover skew + pill "Read role"), accordion, then an ERA statement for the story.

## Performance requirements

- No WebGL. Igloo is interpreted with CSS 3D, clip-path and filters.
- Transform/opacity/filter/clip-path only, with will-change applied briefly.
- Fonts: latin subsets, ≤ 9 files.
- LCP image preloaded.
- CLS < 0.05.
- Pins only in Services and Process (desktop).
