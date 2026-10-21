# Design Audit — session-1 build (baseline before the rebuild)

**Baseline (2026-10-21, before changes):**
- `vite build` ✓ (≈ 0.3 s)
- `tests/run.mjs` 24/24 clean
- `tests/motion.mjs` 21/21 pass

All three pages render, and every feature listed in PROJECT_STATUS works. The audit is about **art direction**, not function.

## Why it feels ordinary

| # | Problem | Where | Evidence | Fix (reference) |
|---|---|---|---|---|
| 1 | **The hero is a stock "agency hero"**: full-bleed photo, big serif headline bottom-left, two pill buttons. Any template does this. | Home §1 | Screenshot `home-1440-top` | AUGE composition: ragged image row + giant wordmark + side paragraph, no buttons |
| 2 | **The type system isn't drawn from the references.** Lora at every size plus a random italic word per heading. The italic-ember-word pattern repeats 14 times and becomes a tic. | Every heading | `<em>` in every h1/h2 | AUGE heavy grotesk for monumental moments. ERA condensed Didone + **one** script word only in ERA-governed statements |
| 3 | **Black everywhere, with dark-mode-agency clichés** (grain overlay, gradient shade, ember pills) | Global | `body{background:#000}` | References are predominantly light (AUGE `#EDF0E5`, ERA `#F2F4E9`). Dark becomes a deliberate chapter (contact, case palette) |
| 4 | **Pill buttons everywhere.** Rounded, outlined, fill-on-hover | 15+ buttons | `.btn{border-radius:999px}` | ERA underlined condensed-serif CTAs + tracked caps links. AUGE black square. The only pill left is the AUGE hover pill, as in the reference |
| 5 | **Header bar with centred nav links**, the generic pattern | Global | `.header` | ERA top-right CTA stack + circular badge + AUGE menu square |
| 6 | **Repetitive section rhythm.** Eyebrow dot + big heading + paragraph, repeated 7 times | Home | Eyebrow dots | Each chapter governed by one reference, with its own composition (§4 of REFERENCE_ANALYSIS) |
| 7 | **Client marquee** reads as a stock logo-wall substitute | Clients | `.clients__marquee` | Static heavy-caps index (AUGE register) |
| 8 | **Stats are a generic 4-up grid** with "+" superscripts | Philosophy | `.stats` | ERA data chapter: label + condensed numerals flanking a portrait |
| 9 | **Services: sticky image + list**, a common SaaS pattern | Services | `.services__grid` | Igloo fog chapter, one service per screen, HUD labels |
| 10 | **Process: horizontal-scroll panels** with outline numerals, a trendy device the references don't use there | Process | `.process__track` | ERA map: one drawn line, three stations |
| 11 | The semicircle opener was right (ERA B6), but it **led into a block of horizontal text**, so the payoff was lost | Opener → Process | — | Circle hands off to the map chapter in the same colour |
| 12 | **Contact is a form-first layout** with a boxed "consultation" card | Contact | `.contact__consult` | ERA finale: glyph, giant email, small details. Form kept (working feature) but typographically integrated, without boxes |
| 13 | **The case study is a long editorial template** (eyebrow, h2, paragraph, image, repeat) with no AUGE opening | Case | — | AUGE A7–A12: lemon/ember decode arrival, curved hero band, giant centred title, rotating line reveals, black perspective palette chapter, curved white return, next-project block |
| 14 | **The loader ends on a full-bleed photo that just stays a hero.** The intro and the page have no relationship | Loader | — | Arch → full bleed → **shared-element flight** into the first strip image |
| 15 | **The rail shows section names in mono,** a generic dot-nav | Rail | `.rail` | ERA 00→100 numeric counter on a hairline, "SCROLL ↓" / "TO TOP ↑" |
| 16 | **Image crops are arbitrary** (strip cards are fixed-width with random heights). Mobile crops all images to 4:5, which cuts the wordmark image badly | Strip | `--w/--h` inline | Heights follow AUGE's ragged system; each item gets an `object-position` focal point |
| 17 | **Motion timing is generic** (everything 0.9–1.2 s expo.out) and lacks AUGE's quick decode or ERA's slower per-char reveals | Global | `gsap.defaults` | Per-reference timing tokens (see ART_DIRECTION) |

## What works and is kept

- **Content integrity rules:** only My Mithila as work, testimonials flagged off, the stats flag.
- **Infrastructure:** smooth-scroll infrastructure, ScrollTrigger setup, SplitText/Scramble utilities, the page-transition engine (re-skinned), focus management, the menu dialog, the enquiry form logic, the careers accordion, reduced-motion handling, the QA harness.
- **Assets:** the stitched asset set and responsive variants.

## Image audit

| Asset | Keep? | Notes |
|---|---|---|
| hero-field (1920×1080) | **Keep, primary** | Cinematic, strong subject. Used as the loader's arch image and the lead strip image (focal point: figure, x ≈ 51%) |
| mymithila-wordmark (1560×819) | Keep | Wide. Good as the case hero band and an Igloo shard (crop centre) |
| mymithila-cards (1260×1162) | Keep | Strong colour. Strip + case |
| mymithila-billboard (1560×628) | Keep | Very wide. Strip (wide slot) + case full bleed |
| mymithila-storefront (1260×1163) | Keep | Strip, a services shard, case |
| mymithila-tote (970×1160) | Keep | Portrait. Strip tall slot + case |
| mymithila-bamboo (1260×1163) | Keep, secondary | Probably stock. Used small |
| mm-02…06 (780×780) | Keep | Social posts with baked-in text, so they're only used at ≤ 390 px display width |
| illus-film-set (1024×1024) | Keep, labelled illustrative | Only image for "Content & Media Production". Igloo monochrome treatment suits it |
| illus-portrait-noir | Not used | Placeholder-project image |

**No image is enlarged beyond its captured resolution in the new layout.** The largest display slot is the hero at 1920 px, which the hero master provides.
