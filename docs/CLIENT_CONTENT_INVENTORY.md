# Client Content Inventory — Tifferend

Researched 2026-10-20 in a live browser session (rendered DOM, not search snippets).
Source root: `https://tifferend-brand-journey.lovable.app` (a Lovable-hosted SPA; WebFetch only returns the empty shell, so all content below was read from the rendered page).

Status key:
- **Verified (live)** — present on the published client site, read directly.
- **Live / unconfirmed** — present on the live site but looks like template placeholder or is internally contradictory. Needs client sign-off before it's presented as fact.
- **Not found** — looked for and absent.

## Identity

| Item | Value | Source | Status |
|---|---|---|---|
| Name | Tifferend (lowercase wordmark "tifferend") | `/`, `<title>`, logo PNG | Verified (live) |
| Title / meta | "Tifferend — Creative Branding Studio" / "Tifferend builds brands through strategy, storytelling, and design. A full-service branding, marketing, and creative studio." | `<head>` | Verified (live) |
| Twitter | @tifferend | `meta[twitter:site]` | Verified (live), profile itself not checked |
| Email | hello@tifferend.com | ticker + `mailto:` links | Verified (live) |
| Phone / address | — | — | Not found |
| Instagram / LinkedIn | — | — | Not found on the site |
| Founder | Kunj ("honed his skills in commercial photography, brand design, and media production while freelancing") | `/careers` "Our story" | Verified (live) |
| Brand line | "create a difference, with a difference"; "Let's do things tifferendly" | `/careers` | Verified (live) |
| Mission | "To create a difference in everything we deliver — empowering businesses of all sizes to reach their full potential through accessible, high-quality media and marketing." | `/careers` | Verified (live) |
| Values | Customer-centric · Staying updated · Utmost creativity · Innovation (with one-line descriptions) | `/careers` | Verified (live) |
| Loader words | BRAND · DESIGN · IDENTITY · STORY · STRATEGY · CRAFT | `/` preloader | Verified (live) |
| Ticker | BRANDING · IDENTITY · STRATEGY / BOOK A FREE CONSULTATION (FREE) / HELLO@TIFFEREND.COM / CONTENT · PHOTOGRAPHY · FILM / SOCIAL MEDIA · CAMPAIGNS · GROWTH / PACKAGING · WEB DESIGN · ART DIRECTION | `/` top bar | Verified (live) |

## Visual system observed

- Background `#000`, foreground `#fff`, card `hsl(0 0% 6%)`, border `hsl(0 0% 18%)`, muted text `hsl(0 0% 55%)`.
- Accent `hsl(17 100% 65%)` ≈ `#FF7A4D` (CSS var `--accent`). The Noir Collective page names it "EMBER #FF734E"; I use `#FF7A4D` from the CSS.
- Type: **Lora** (serif, h1 96px/600) for display, **Space Mono** for UI labels and eyebrows.
- Hero photograph: person in tailored camel blazer standing in a motion-blurred golden grass field under a deep blue sky.

## Homepage copy (verbatim, `/`)

- Hero: "Your brand's creative partner" / "BRIDGING THE GAP BETWEEN BUSINESS AND CREATIVITY." / CTAs "START A PROJECT", "SEE OUR WORK".
- Clients: "Brands we've helped come alive".
- Stats: 50+ Brands built ("From startups to heritage names across industries."), 200+ Projects delivered ("Identity, content, campaigns, and digital experiences."), 8+ Industries served ("Hospitality, fashion, tech, F&B, real estate and more."), 5+ Years of craft ("Building brands with strategy and creative conviction."). **Status:** Live / unconfirmed. These are client-stated business claims, reproduced as-is and flagged for sign-off.
- Philosophy: "Building a brand is personal." + 3 paragraphs ending "That's not a process. That's a philosophy." Verified (live).
- Services (3, verbatim titles, descriptions and bullets): 01 Brand Strategy & Identity, 02 Content & Media Production, 03 Digital & Growth Marketing. Verified (live).
- Process: 01 Understand, 02 Create, 03 Amplify (verbatim paragraphs). Verified (live).
- Contact: "Let's build something remarkable." / "Ready to elevate your brand? We'd love to hear about your project." Verified (live).
- Footer: WORK · STUDIO · SERVICES · CAREERS · CONTACT · © 2026 TIFFEREND.

## Clients (logo alt text on `/`)

Verified (live) as logos on the client strip: Ploco, Mumbai Pav Co., Bhagwan Mahaveer Jain Hospital, FIAMM, JITO Youth Wing, Autoverse, Everow Nutrition, EIMR Business School, Her Amora, Ishq by Moh, Make-up Biography, InMobi, Towands, IDH. My Mithila is verified separately through its case study.

Logo files with alt text "Asset 127" and "Tifferend Studio" were left out because they can't be identified.

## Work

| Project | Live URL | Status |
|---|---|---|
| **My Mithila** (Rebranding, Identity, Logo, Packaging, E-commerce, Print, 2024) | `/work/my-mithila` | **Verified (live).** A full case study with real deliverables: wordmark, business cards, OOH billboard, tote, storefront, social posts, brand film, palette hexes and founder credit (Anant Alok). |
| Noir Collective, Maison Luxe, Ember & Oak, Frame Collective, Velour Films, Synapse, The Grand, Atelier Digital, Nexus Studio, Bloom Social, Pulse Media, Lumen Festival, Atlas Summit | `/work/*` | **Live / unconfirmed — treated as placeholders.** The thumbnails are AI-generated (one has garbled lettering, "LUXURY FASHI LION"). None of these names appear in the client logo strip. Pages carry generic metrics (e.g. Noir "Online sales grew 65% in Q1"). **Not presented as client work in the new build.** |

## Testimonials (live, `/`)

1. "Tifferend didn't just design a logo — they unearthed who we actually were and gave it a voice." — Ananya Rao, Founder · My Mithila
2. "They moved like an in-house team from day one…" — Rohan Mehta, Co-founder & CEO · Autoverse
3. "Every touchpoint feels considered…" — Priya Kapoor, Brand Director · Her Amora

**Status: Live / unconfirmed.** The case study names Anant Alok as My Mithila's founder (also printed on the business card), which contradicts testimonial 1. All three quotes are kept in `src/data/content.js` with `verified: false`. The section is built but switched off (`FEATURES.testimonials = false`) until the client confirms the quotes are real.

## Careers (`/careers`)

Six roles (Account/Project Manager, Content Strategist/Creator, Cinematographer & Video Editor, Graphic Designer, Video Editor, Social Media Marketing Intern), each with its type and description. Apply link: `https://forms.gle/hJoBoTJDMgsCnCJu9`. Verified (live).

## Missing / to request from client

- Real assets and confirmed facts for any project besides My Mithila.
- Confirmation (or replacement) of the testimonials and the stats.
- The My Mithila brand film (`/videos/mymithila.mp4`, 45.9 MB). It exists but couldn't be retrieved (see ASSET_MANIFEST).
- Phone, studio address, Instagram/LinkedIn handles.
- Vector logo (SVG). Only a 710×147 PNG exists, so the new build uses a typeset wordmark.
