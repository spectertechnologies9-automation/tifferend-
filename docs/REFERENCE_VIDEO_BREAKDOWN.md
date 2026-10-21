# Reference video breakdown — session 5 rebuild

**Files inspected this session** (both attached by the user, in `C:\Users\GX10\Videos\Captures\`):

| File | Length | What it contains |
|---|---|---|
| `ERA Residence — … 2026-10-20 22-56-57.mp4` | 47.0 s, 1920×1080 | era-residence.com, top to bottom |
| `Igloo Inc. - … 2026-10-20 22-48-14.mp4` | 92.7 s, 1920×1080 | **0–48 s** igloo.inc · **49–53 s** an Awwwards "Sites of the Year" listing · **53–89 s** the Lando Norris site (reached from that listing) |

**Method.**
- ffmpeg (npm `ffmpeg-static`, run from the scratchpad) produced 1 fps contact sheets of both files, 2 fps sheets of 49–89 s, and full-resolution frames at about 30 timestamps.
- Browser chrome was cropped off.
- Colours were sampled from raw frame pixels.
- Timestamps are ±0.5 s.

**Not inspected this session:** the AUGE recording. It wasn't attached this time, so it isn't a governing reference for the rebuild. Its analysis from session 2 is still in `REFERENCE_ANALYSIS.md`.

**Change from session 2.** Session 2 dismissed the 53–89 s Lando Norris segment as "other sites". It's the closest match in the user's material to the new brief (electric lime, bold editorial type, pop motion), so this rebuild uses it as a full reference and calls it **LN**.

---

## 1. Lando Norris (LN), Igloo file 53–89 s

### First impression
- **53.5–57.5 s:** full-screen electric lime (`#D4FF09`, sampled). A tiny black monogram sits dead centre and morphs between glyph states (`LN` → `L` → `L,`), like a hand-drawn loader. A tiny caps label "LOAD NORRIS" sits at bottom centre. Nothing else is on screen.
- **58–60.5 s:** hard cut to a near-white page (`#F4F4EF`) with a centred studio portrait, cropped at the chest, head close to the top.
  - **Cursor reveal:** under the cursor, a soft-edged blob reveals an alternate image registered to the same face (him wearing the lime helmet). The blob follows the pointer with lag, so the face and helmet are visible at the same time.
  - **Chrome:** the stacked logo top-left (light serif "LANDO" over heavy grotesk "NORRIS"); a lime rectangular "STORE" button and an outlined square menu button top-right; a small "NEXT RACE" card bottom-left.

### Typography
| Role | Observation | Our match |
|---|---|---|
| Statement caps | Heavy, normal-width neo-grotesk, all caps, line-height ≈ 0.92, tight tracking, centred, ≈ 7vw | **Archivo variable** (wght 800–900, wdth 100), OFL |
| Accent words | Light, high-contrast serif caps in lime inside the grotesk line ("REDEFINING", "WINS", "LEGACY") | **Instrument Serif** 400 (already a project font) |
| Signature | Fast marker-like signature script in lime, drawn as a stroke over the content (61 s), plus a giant script word painted behind the partners heading ("Collabs", 79–81 s) | **Herr Von Muellerhoff** 400 (OFL), the closest free fast-signature script |
| Body | Small grotesk regular (partners) and a book serif for quotes ("Since I was 7 years old…", 69.5 s) | Archivo 400 / Instrument Serif |
| Labels | Tiny bold caps, ≈ 9–10 px ("BARCELONA, 2024", "NEXT RACE") | Archivo 700, 10–11 px caps |

### Colour
| Token | Sampled | Use |
|---|---|---|
| Lime | `#D4FF09` | Loader field, buttons, accent words, highlight bars, signature, footer frame |
| Olive-black | `#272D1F` | Statement chapter, footer panel |
| Off-white | `#F4F4EF` | Hero, collage, partners |
| Grey-sage | `#A4A79C` | Mid-transition of the collage background |
| Ink | `#101210` | Helmet grid |

The collage background **interpolates colour while you scroll** (olive → grey-sage → off-white, 65–69 s).

### Motion and interaction (timestamped)
| t | Element | Behaviour |
|---|---|---|
| 53.5–57.5 | Loader | Lime screen, glyph morph loop, label. Cuts straight to the hero |
| 58–60.5 | Hero | Pointer-following blob mask reveals the alternate registered image. The edge is soft, the follow is lagged (≈ 0.15 lerp) |
| 61 | Signature | Lime script stroke draws across the screen over a greyed photo and a line of caps |
| 61.5–62.5 | **Block reveal** | Each statement line is covered by a lime bar. The bars are stepped (different widths per line) and retract sideways to uncover the text, staggered. Sometimes there are 2–3 overlapping bars per line |
| 63–64.5 | Statement | Text scrolls up through the frame at reading pace. Not pinned |
| 65–68.5 | Collage | Scattered photos at different sizes and depths, each with a tiny caption above it. Parallax per item; background colour interpolates. Small lime dashes mark captions |
| 69–71 | Big type | "ON TRACK / OFF TRACK" giant caps with a script "ON" over them. Dark bars precede the words (redaction-style reveal) |
| 71.5–75 | Grid | Ink background. Cells with 1 px borders and **notched (chamfered) corners**, objects centred, caption bottom-right. Hover gives a lime border and swaps the cell to a photo |
| 76.5 | Section join | An off-white panel rises with a **convex curved top** over the dark grid |
| 77–79 | Type-on | Headings type on letter by letter behind a **block cursor** ("PARTNER█"). Body lines are covered by ink bars that retract |
| 79–81 | Partners | Giant lime script painted behind the heading; a logo marquee runs underneath |
| 81.5–84 | Socials | "WHAT'S UP ON SOCIALS" centred, a phone-ratio card rises, then a **fan of cards** spreads from one centre point (rotations ≈ −20° → +20°) |
| 84–89 | Footer | The page bg turns lime and the dark panel sits inside it as a **framed card with a notch tab at the top**. Lime bars reveal "ALWAYS BRINGING THE FIGHT." (grotesk + lime serif words) with the signature above. Nav columns left and right, logo marquee, legal row inside the lime frame |

---

## 2. ERA Residence (ERA), ERA file 0–47 s

### First impression
- **0–5 s:** full-bleed photo (blue sky).
  - Centred ultra-condensed Didone "ERA / RESIDENCE" with a formal script "Estepona" overlapping.
  - "A PLACE ——— TO RETURN TO" split to the far left and right.
  - Circular rotating badge top-left; stacked condensed CTA top-right.
- **6–8.5 s (reload):** maroon curtain (`#2F0722`). An **arch window** (round top) grows from the bottom centre (7 s), then expands to full screen (8.4 s). The title glyphs fade in with blur inside it.

### Typography
Ultra-condensed high-contrast Didone caps, plus one script word per statement, plus wide tracked geometric sans labels. It reads restrained and centred, and the drama comes from contrast rather than size. We use **Instrument Serif** (condensed Didone register) and **Herr Von Muellerhoff** (script), and set labels in **Archivo at wdth 125**, which gives ERA's wide tracked sans.

### Colour
Cream `#F2F4E9`, navy ink `#182037`, powder blue `#B5D0D9`, maroon `#2F0722`, with bougainvillea magenta carried by cut-out photos. **Each chapter switches the whole background colour, and the switch is itself a shape.**

### Motion (timestamped)
| t | Element | Behaviour |
|---|---|---|
| 7–8.4 | Arch intro | Arch grows from the bottom, then expands to full bleed |
| 18–20 | Text panel | Small cream card rises over the photo |
| 21 | **Circle opener** | A powder-blue semicircle rises from the bottom carrying **arc text** "THREE REASONS TO CHOOSE ERA", then grows to fill the screen (scrubbed) |
| 22 | Char reveal | Condensed caps resolve per character from blur ("REAL…") |
| 25–28 | Statement + **map** | Centred caps + script word "yours". A thin hand-drawn line draws left → right with station dots and wide-tracked labels (GIBRALTAR 50 MIN … MALAGA AIRPORT 45 MIN) |
| 30 | Slanted join | The next chapter's image slides in with a slanted (≈ 6°) top edge |
| 31–32 | Data chapter | Label + huge condensed numerals (3 / 178 — 202 M²); tall image; "GROUND FLOOR + BASEMENT" types in with per-letter fade |
| 34–40 | Image choreography | A maroon slanted panel; images rise, scale from small to large and skew-correct to rectangles |
| 41 | License | Centred stacked caps "DEVELOPER / SALES & MARKETING / LICENSE OBTAINED / 2026" |
| 44–47 | Finale | Maroon. Glyph centred, giant condensed phone number, small address, legal two-column row |
| throughout | Rail | Left vertical hairline with a numeric 00 → 100 counter and "SCROLL ↓" |

---

## 3. Igloo Inc. (IG), Igloo file 0–48 s

### First impression
A monochrome fog world (`#9296A2` → `#B6BAC5`). One centred 3D object (the igloo) on a snowy ridge. "IGLOO" logo top-left, "// Copyright © 2026" under it, a mono manifesto block top-right, and "Sound: On" bottom-left.

### Typography
Monospace caps everywhere in the HUD ("PORTFOLIO_CO_01 / PUDGY PENGUINS", "TEMP 35.99", "D 01.02.2026 CLICK TO EXPLORE"). It's **Space Mono** in our system.

### Motion (timestamped)
| t | Element | Behaviour |
|---|---|---|
| 8–9 | Constellation | A wireframe point-and-line constellation surrounds the object, then fades as the solid emerges |
| 10–18 | Blocks lift | The igloo's blocks separate outward and re-seat |
| 19 | **RGB smear** | Horizontal chromatic smear across the frame between scenes |
| 20–22 | **Shard approach** | A crystal shard rises from below and approaches from depth into the centre. A HUD label sits up-left with a **leader line**. Text **decodes** from random glyphs ("JITWAJPMKZHL[" → name). Metadata sits right and bottom with short rules |
| 23–25 | **Ring portal** | A glowing ring zooms toward the camera and passes through it into the next item |
| 26–31 | Object | Character on a plinth dissolves into particles and re-forms. "[ LinkedIn ]" bracket button |
| 35–39 | Repeat | Smear → shard 2 → ring. **One subject per screen**, every time |

---

## 4. Mapping: which reference drives each Tifferend part

One reference per section (the CLAUDE.md rule, kept).

| Tifferend part | Reference | Techniques reproduced |
|---|---|---|
| Loader + page transition | **LN** 53–58 s | Lime field, centred morphing monogram ("t" → "tf" → "t."), tiny label "LOADING TIFFERENDLY". The transition wipes in with stepped lime bars (LN block shape) |
| Global chrome | **LN** 58 s | Stacked logo top-left (serif "tifferend" over grotesk "STUDIO"), lime rectangular CTA + outlined menu square top-right, colour follows the section theme |
| Home hero | **LN** 58–60.5 s | Centred photo window, a pointer-following lagged blob mask revealing a registered "difference" version of the same photo (generated). Paused/touch state is a static seam split, so it reads complete without motion |
| Philosophy statement | **LN** 61–64.5 s | Olive chapter, heavy grotesk caps + lime serif accent words, stepped lime bars retract per line, lime signature-script stroke |
| Selected work (My Mithila) | **LN** 65–71 s | Scattered collage with tiny captions and lime dashes, per-item parallax, background interpolating olive → forest → bone. Giant "MY / Mithila" with script overlay |
| Services | **IG** 19–39 s | Pinned, one subject per screen. Each service image approaches from depth, a HUD with a leader line decodes its label, an RGB smear plays on change, a ring portal sits between subjects |
| Numbers | **LN** 71.5–75 s | Ink grid of notched cells, lime border on hover/focus, giant figures |
| Clients | **LN** 77–81 s | Heading types on behind a block cursor, giant lime script painted behind, typeset client-name marquee (no logos, as before) |
| Process | **ERA** 21 s + 25–28 s | Lavender semicircle with arc text rises and fills the screen, then the hand-drawn map line with three stations (Understand · Create · Amplify) |
| Studio | **ERA** 22–28 s | Centred condensed serif caps with one script word ("tifferendly"), per-character blur reveal, centred body, illustrative flat-lay |
| Contact | **ERA** 44–47 s | Full-colour finale chapter (orange instead of maroon), giant condensed-serif email, small centred details, underline-only form |
| Footer | **LN** 84–89 s | Lime frame, olive panel with notch tab, bar-revealed sign-off, nav columns, name marquee, legal row |
| Case study | **LN** register throughout (one project, one voice) | Hero cursor reveal over the wordmark artwork, bar-revealed intro, collage, notched palette grid, fanned social cards (81.5–84 s), curved-top section joins (76.5 s) |
| Careers | **LN** (roles, finale) + **ERA** (story statement) | Type-on title with block cursor, notched role rows, ERA statement, lime finale |

## 5. Practical implementation plan

1. **Tokens:** lime `#D4FF09`, olive `#272D1F`, paper `#F4F2EC`, ink `#101210`, plus the funky secondaries cobalt `#1F4BFF`, hot pink `#FF3D8B`, orange `#FF6A1F` (Tifferend's ember pushed brighter), lavender `#C7B8FF` and acid yellow `#F2E92E`, each given to whole chapters, never sprinkled.
2. **Fonts:** Archivo variable (wght + wdth in one 90 KB file), Instrument Serif, Herr Von Muellerhoff, Space Mono. Lora, Inter Tight and Pinyon Script are dropped.
3. **Motion primitives** (`src/js/fx/`):
   - `bars.js`: stepped lime bar reveal.
   - `type.js`: type-on with block cursor, decode, char blur.
   - `reveal.js`: blob mask with lag.
   - `collage.js`: parallax + background interpolation.
   - `pin.js`: Igloo pinned service sequence with smear and ring.
   - `era.js`: circle opener with arc text, map line.
   - `fan.js`: card fan.
4. **Reduced motion:** every primitive has an end-state path. Bars never render, text shows, the reveal becomes the static split, pins become stacked screens.
5. **Mobile:**
   - Hero reveal auto-sweeps once, then follows touch-drag inside the photo only.
   - Services become stacked colour screens (no pin).
   - Collage becomes a two-column offset stack.
   - Fan becomes a native horizontal scroller.

## 6. What can't be reproduced exactly, and why

- **Igloo's real-time 3D** (igloo, shards, particles). Tifferend has no 3D assets, and video generation was over the credit budget (80 credits for 5 s against 70 available). The shard approach is rebuilt with generated still-life photographs, depth scale/blur, and a CSS ring and smear.
- **LN's helmet alternate is a photo shoot.** Our alternate is a generated recolour of the client's hero photo. It's labelled illustrative and registered to within a few pixels by eye. A small misalignment isn't visible because the blob shows a different world anyway.
- **LN's signature** is a real person's autograph. We don't fabricate the founder's signature. The lime script is the typeset word "tifferendly" (a real brand line) in a signature-style font, drawn with a clip-path wipe rather than a true centre-line stroke.
- **Fonts** are free alternatives identified by eye (see the tables above). The exact families can't be verified from video.
- **Mobile behaviour** isn't shown in either recording. All mobile decisions are interpretations.
