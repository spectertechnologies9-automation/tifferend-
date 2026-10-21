# Art Direction — session 5 rebuild ("tifferendly")

Evidence and timestamps: `docs/REFERENCE_VIDEO_BREAKDOWN.md`. The session-2 direction (AUGE/ERA/Igloo, ember, light canvas) is superseded. Its analysis of AUGE remains in `REFERENCE_ANALYSIS.md` for reference only.

## Concept

**Create a difference, with a difference.** The site keeps a hidden "difference" layer that the visitor uncovers:
- a lens in the hero that reveals a recoloured world;
- highlight bars that retract to reveal statements;
- chapters that switch their whole colour.

The brand line (verbatim from the client's careers page) is the idea, and the headline uses `mix-blend-mode: difference`.

## Governing references (one per section)

| Code | Reference | Where it governs |
|---|---|---|
| **LN** | Lando Norris site (Igloo recording 53–89 s) | Loader, page wipe, chrome, hero, philosophy, work collage, numbers, clients, footer, case study, careers roles and finale |
| **ERA** | ERA Residence | Process opener (circle + arc text), process map, studio statement, contact finale, case quote, careers story |
| **IG** | Igloo Inc. (0–48 s) | Services (pinned one-subject stage, HUD, leader line, decode, smear, ring portal) |

New sections must name their reference here.

## Colour

Each colour owns whole chapters. Colours are never sprinkled as decoration.

| Token | Hex | Role |
|---|---|---|
| `--lime` | `#D4FF09` | LN signal: CTAs, bars, loader, wipe, footer frame. Sampled from LN |
| `--olive` | `#272D1F` | LN statement and footer panel. Sampled |
| `--paper` | `#F4F2EC` | Light canvas (LN off-white) |
| `--ink` | `#101210` | Type, numbers grid |
| `--cobalt` | `#1F4BFF` | Accent on paper, service 03 |
| `--pink` | `#FF3D8B` | Service 02, careers script |
| `--orange` | `#FF6A1F` | Contact finale (Tifferend's old ember, pushed brighter) |
| `--lavender` | `#C7B8FF` | Process (ERA's powder blue role), careers story |
| `--yellow` | `#F2E92E` | Service 01 |
| `--forest` / `--mustard` / `--bone` | `#0E5A2E` / `#F5C518` / `#F4EFE6` | My Mithila's own palette: the work chapter and the case study only |

**Home chapter order:**
1. paper (hero)
2. olive (philosophy)
3. olive → forest → bone (work)
4. yellow / pink / cobalt (services)
5. ink (numbers)
6. paper (clients)
7. lavender disc → lavender (process)
8. paper (studio)
9. orange (contact)
10. lime frame + olive panel (footer)

## Typography

| Token | Family | Role | Reference match |
|---|---|---|---|
| `--f-sans` | **Archivo Variable** (wght 100–900, wdth 62–125) | Mega titles, statements, labels, body. Width axis used for hover stretch and ERA's wide tracked labels (`.t-wide`, wdth 125) | LN heavy grotesk (alternative); ERA wide sans (alternative) |
| `--f-serif` | **Instrument Serif** 400 | LN accent words, ERA condensed caps statements, ledes, numerals | LN light serif / ERA condensed Didone (alternative) |
| `--f-script` | **Herr Von Muellerhoff** 400 | One signature-script word per statement or block | LN signature / ERA script (alternative) |
| `--f-mono` | **Space Mono** 400 | Igloo HUD only (services, scope lines) | Igloo HUD (category match) |

**Type primitives** (`base.css`):
- `.t-mega`: 900, caps, lh 0.84
- `.t-state`: 800, caps, lh 0.93
- `.t-serif`
- `.t-script`
- `.t-label`: 11 px, 750, caps
- `.t-wide`: ERA
- `.t-mono`: IG
- `.t-body`
- `.t-lede`

**Rules:**
- A statement mixes grotesk caps with serif accent words (LN).
- ERA statements are serif caps with exactly one script word.
- Script appears at most once per block.

## Components

- **Buttons:** lime rectangles (radius 4 px) with a rolling label. Ink and paper variants exist. No pills.
- **Notched cell** (`.cell`, `.notch`): LN chamfered corners with a 1 px border. On hover, a lime border.
- **Contour texture** (`.contours`): LN topographic lines, masked so they take the section's colour.
- **Stepped bars** (`[data-bars]`): LN highlight bars. They retract per line and remove themselves.

## Motion inventory (what each section does — no section repeats another's entrance)

| Section | Motion |
|---|---|
| Loader | Glyph morph across 4 typefaces, 00→100 counter, stepped lime wipe out |
| Hero | Lagged lens + trailing blob; scroll pin opens the window to full bleed and grows the lens until the difference takes over |
| Philosophy | Stepped bars; script word wipes; body lines rise |
| Work | Background interpolates; parallax collage; images clip up; script drifts |
| Services | Pinned stage; object approaches from depth with blur; HUD decodes; RGB smear + ring portal between subjects; stage colour switches |
| Numbers | Count-up; lime border on hover |
| Clients | Type-on with block caret; giant script wipes; velocity-reactive marquees |
| Process | Lavender disc rises with arc text and fills the screen; map route draws; stations appear as it passes |
| Studio / contact | ERA per-character blur reveal, scrubbed |
| Footer | Bars; signature wipe; marquee |
| Case | Band opens; palette cells fill; kit drops in; card fan spreads; curved-top join into the lime "next" block |
| Careers | Accordion rows with width-axis stretch |

**Mobile is designed, not shrunk:**
- The hero lens drifts on its own.
- Services become full colour screens.
- The map becomes a vertical route.
- The fan becomes a native swipe strip.
- Menu links size to the viewport.

**Reduced motion:**
- no loader, wipe, bars, pins or drift;
- static marquees wrap;
- every text end state is plain.

## Content integrity (unchanged rules)

- Only My Mithila is presented as work.
- Generated images are labelled illustrative in their alt text and captions.
- Stats are the client's own live-site claims.
- Testimonials stay behind `FEATURES.testimonials`.
