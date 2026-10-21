# Creative Direction — "A difference, in motion"

## Core concept

Tifferend's own line is *"create a difference, with a difference."* The site expresses this as **contrast in motion**: a black, editorial canvas where one ember-coloured gesture (the curved wipe, the arch, the semicircle) keeps interrupting the stillness. Calm serif type does the talking, and motion only arrives at the moments that change the story.

## Brand characteristics established through research

- **Founder-led, personal, warm-but-sharp voice** ("Building a brand is personal." / "tifferendly").
- **Photography and film roots.** The founder came from commercial photography, and the hero is a cinematic, motion-blurred field portrait.
- **Existing identity:** black/white with an ember accent (`hsl(17 100% 65%)`), Lora + Space Mono. Kept, not replaced.

## Typography

- **Display: Lora** (verified brand font). Set very large (clamp up to ~12vw) and tight (−0.03em) for headlines, with *italic Lora* as the expressive counter-voice. This mirrors ERA's caps-vs-script contrast while staying on-brand.
- **UI / metadata: Space Mono** (verified). Uppercase 11–12px with +0.12em tracking for eyebrows, HUD labels and buttons (Igloo's HUD language).
- Body: Lora at 18–20px for long reads (the case study). Space Mono only for short labels.

## Colour and contrast

| Token | Value | Use |
|---|---|---|
| `--ink` | `#000` | Canvas (verified) |
| `--ink-2` | `#0f0f0f` | Raised surfaces (verified card 6%) |
| `--line` | `#2e2e2e` | Hairlines (verified border 18%) |
| `--paper` | `#F4EFE6` | Light chapters. "Bone" from the client's own case-study palettes |
| `--fg` | `#fff` | Text on ink |
| `--muted` | `#8c8c8c` | Secondary text (verified 55%) |
| `--ember` | `#FF7A4D` | Accent, wipes, highlights, focus ring (verified) |

Contrast (computed from WCAG relative luminance): white on black 21:1; muted `#8c8c8c` on black ≈ 6.2:1 (AA); ember on black ≈ 8.1:1, and black text on ember is the same ≈ 8.1:1 (AA at any size). White on ember is only ≈ 2.6:1, so it's never used. Text on ember is always black.

## Image art direction

- Only verified client imagery: the hero field portrait and the My Mithila deliverables (wordmark grid, cards, OOH, tote, storefront, bamboo, social posts).
- Two live-site images (studio film-set, noir portrait) are used **only** as atmospheric service imagery, never captioned as client projects (see ASSET_MANIFEST).
- Treatments: clip-path reveals, slow scale (1.12→1), no filters on client work. The hero gets a grain overlay and a vignette for legibility.

## Layout principles

- 12-column fluid grid, 16px gutters on mobile and 24px on desktop, max width 1680px.
- Asymmetry: headlines hang left, metadata sits right in mono. Big negative space between chapters (≥ 20vh).
- Light/dark chapter rhythm: Ink (hero → manifesto) → Ink (work) → Paper (services) → Ember semicircle → Ink (process) → Paper (studio) → Ink (contact).

## Motion principles

1. **One easing family:** expo-out `cubic-bezier(.16,1,.3,1)` for reveals, expo-in-out for wipes.
2. **Motion at thresholds only:** entrances, chapter changes, navigation. Nothing loops except the work strip and the marquee.
3. **Velocity is honest:** the strip and wordmark skew only as fast as the visitor scrolls.
4. **Never block content:** the loader is capped at ~2.4 s, plays only on the first visit per session, and can be skipped with a click or any key.
5. **Reduced motion = still and complete:** every animation has a static end state.

## Navigation concept

- Fixed slim header: typeset "tifferend" wordmark (left). On desktop: Work · Services · Studio · Careers + "Start a project" ember button. On mobile: "Menu" button → full-screen ink overlay with large Lora links that stagger in, focus-trapped, closes on Esc.
- Top ticker (verified copy) above the header on desktop. It scrolls away.
- Internal page changes use the ember curved wipe.
- Desktop progress rail (left edge) shows the current chapter.

## Page structure and storyboard

### Home (`/`)

| # | Section | Purpose | Content source | Layout | Motion | Mobile | Conversion role |
|---|---|---|---|---|---|---|---|
| 0 | Loader | Brand moment | Verified loader words | Black, mono words cycling centre | M1: words cycle 0.9 s → arch grows over hero (1.1 s) → full-bleed | Same, faster | — |
| 1 | Hero | Value proposition | Verified hero copy + hero photo | Full-bleed photo. Headline bottom-left "Your brand's *creative* partner". Mono sub + 2 CTAs | M2 line reveal, M7 scroll scale/lift | Image crops centred on the subject | Primary CTA |
| 2 | Clients | Instant credibility | Verified client names | Marquee of names in Lora italic separated by ✦ | M14 | Same | Trust |
| 3 | Manifesto | Brand voice | Verified philosophy copy | Huge statement + scrubbed paragraph | M8 word highlight, M2 | Same, smaller | Emotional buy-in |
| 4 | Numbers | Proof | Client-stated stats (flagged) | 4-col → 2×2 | M13 counters | 2×2 | Trust |
| 5 | Work | Portfolio | My Mithila deliverables | Giant "Work" + drifting strip + mono HUD captions + case CTA | M4, M5, M3 | Swipe row | Case-study entry |
| 6 | Services | What we do | Verified services | Paper chapter. Sticky image left, 3 numbered services right | M11, M12 | Stacked, image per service | → Contact |
| 7 | Chapter opener | Graphic signature | "Understand · Create · Amplify" | Ember semicircle rising with arc text | M9 | Same | — |
| 8 | Process | How | Verified process | Pinned horizontal 3 panels with drawn line | M10 | Vertical | → Contact |
| 9 | Studio | Who | Verified founder story, mission, values | Paper. Mission statement large, values grid | M2, M12 | Stacked | → Careers |
| 10 | Contact finale | Convert | Verified email | Giant email, enquiry form, consultation note, footer | M2 | Email wraps | **Primary conversion** |

### Case study (`/work/my-mithila/`)

Hero (title decode M3 + wordmark image reveal) → facts row (scope/year) → About → Background / Strategy (split) → Verbal identity quote → Visual identity palette (4 verified swatches) → OOH full-bleed (billboard) → Product experience (storefront + cards + bamboo, staggered composition) → Tote → Social diary strip → Credits → Next: "Start a project" (wipe to `/#contact`).

### Careers (`/careers/`)

Hero "Join the team" → open roles (6, accordion with descriptions, Apply → Google Form) → story → values → CTA.

## Mobile adaptation strategy

- Loader is shorter. Arch reveal is kept (it's cheap).
- Work strip becomes a native horizontal scroller with snap points. No drift or skew, and no cursor pill (captions are always visible).
- Pinned horizontal process becomes a vertical list with a drawn vertical line.
- Sticky services become stacked cards with their own image.
- Lenis smooth scrolling is disabled on touch (native scroll).
- Tap targets are at least 44px. No hover-only content.

## Accessibility principles

Semantic landmarks (`header`, `nav`, `main`, `section[aria-labelledby]`, `footer`); a skip link; a visible ember focus ring; the menu dialog has `aria-modal` and a focus trap; marquee and strip are `aria-hidden` duplicates with a real list for screen readers; `prefers-reduced-motion` honoured globally; all content exists in the HTML without JS.

## Why this differentiates Tifferend

Competitors prove themselves with logos and numbers. Tifferend proves itself with **taste and depth**: a site that looks like it was directed by a photographer, a manifesto you scroll through, and a case study told like a film. It also keeps one clear path to "Start a project".
