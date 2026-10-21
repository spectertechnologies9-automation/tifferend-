# Asset Manifest

## How assets were retrieved

The cloud workspace's network allowlist blocks `tifferend-brand-journey.lovable.app` (proxy 403), so files couldn't be downloaded directly. Instead, every asset was **captured from the live site in the user's built-in browser**: each image was rendered at exactly 1 image-pixel per screenshot-pixel, captured as 799×600 tiles, and stitched losslessly with known offsets (`tools/stitch_tiles.py`; method in PROJECT_STATUS). Seams were checked visually. The result is a faithful re-render, re-encoded once to WebP/JPEG, so quality is close to but not byte-identical with the originals.

Responsive variants (WebP q80) live in `public/img/`. The stitched masters are in `src/assets/img/`.

| File (master) | Original source URL (path on tifferend-brand-journey.lovable.app) | Original size | Captured size | Section used | Type | Retrieval | Verified client material | Usage notes |
|---|---|---|---|---|---|---|---|---|
| hero-field.jpg | /assets/hero-bg-BI47yX4T.jpg | 1920×1080 | 1920×1080 | Home hero, OG image | Photo | ✅ tiled capture | Yes — the client's own hero | Unknown whether shot by the studio or licensed. Confirm usage rights |
| mymithila-wordmark.webp | /assets/hero-sTHZRQk3.webp | 1920×1008 | 1560×819 | Work strip 01, Services 01, Case hero | Brand artwork | ✅ | Yes — My Mithila case | Client work. Confirm My Mithila consents to portfolio use (already public on the live site) |
| mymithila-cards.webp | /assets/cards-Bihin9_o.webp | 1600×1476 | 1260×1162 | Strip 02, Case | Mockup | ✅ | Yes | The card shows placeholder phone "+91 99999 99999" (as on the original) |
| mymithila-billboard.webp | /mymithila-brand/billboard.webp | 1600×644 | 1560×628 | Strip 03, Case OOH | Mockup | ✅ | Yes | — |
| mymithila-storefront.webp | /assets/web-DEWSIHmy.webp | 1600×1477 | 1260×1163 | Strip 05, Services 03, Case | Mockup | ✅ | Yes | — |
| mymithila-tote.webp | /mymithila-brand/tote.webp | 1150×1376 | 970×1160 | Strip 06, Case toolkit | Mockup | ✅ | Yes | — |
| mymithila-bamboo.webp | /assets/bamboo-Lr4q_5Yn.webp | 1600×1477 | 1260×1163 | Strip 08, Case | Photo | ✅ | Yes (case material) | Looks like stock photography. Confirm the licence |
| mm-02 … mm-06.webp | /mymithila-gallery/mm_2.jpg … mm_6.jpg | 1400×1400 | 780×780 | Strip 04/07/09, Case social diary | Social posts | ✅ | Yes | — |
| illus-film-set.webp | /assets/project-video-1-B3zK9Utq.jpg | 1024×1024 | 1024×1024 | Services 02 only, **illustrative** | Image | ✅ | **No.** Used on the live site as the thumbnail for placeholder projects "Frame Collective"/"Lumen Festival" and appears AI-generated | Not captioned as client work. Its alt text says "(illustrative)". Replace with real production stills |
| illus-portrait-noir.webp | /assets/project-2-DQ9M4BvC.jpg | 1024×1024 | 1024×1024 | Not used | Image | ✅ | No (placeholder "Noir Collective") | Kept for reference only |

## Not retrieved / not used

| Asset | Source | Reason |
|---|---|---|
| Tifferend logo PNG | /assets/tifferend-logo-CM9xRreX.png (710×147, white on transparent) | Session ended before capture. A raster logo can't be cleanly re-captured with transparency anyway. **The build uses a typeset wordmark in Lora Bold + ember dot.** Request the vector logo (SVG). |
| 14 client logos | /assets/ploco…, pav-co…, fiamm…, inmobi…, etc. | Browser link dropped before capture. Client names are shown as a typographic marquee instead. Request SVG logos, then switch the marquee to logos. |
| My Mithila brand film | /videos/mymithila.mp4 (45.9 MB) | Video can't be captured by screenshot, and direct download was blocked. The case study omits the film section. Request the file (and a compressed 1080p/720p web encode + poster). |
| mm_1, mm_7 … mm_13 gallery posts | /mymithila-gallery/ | Browser link dropped mid-capture. Five of thirteen are in the build. |
| My Mithila motifs (mountain/sun/water/leaf PNG), sticker set | /mymithila-brand/motif-*.png, sticker-*.webp | Not captured (transparency). The palette section is built from the verified hex values instead. |
| 6 other placeholder project thumbnails | /assets/project-5…, project-web-1…, project-social-1/2… | Deliberately not used: AI-generated placeholders, not client work. |

## Fonts

Lora and Space Mono (both SIL Open Font License) are self-hosted via `@fontsource` (latin subset only, 6 files ≈ 120 KB woff2). They match the live site's fonts.

## Session 2 additions and changes (2026-10-21)

| Asset | Source | Treatment |
|---|---|---|
| mm-01, mm-07 … mm-13 (8 My Mithila social posts) | Live site case page, captured 1:1 in the browser (799×600 tiles, stitched with `tools/stitch_tiles.py`) | WebP 480 + 624/780 in `public/img/`, masters in `src/assets/img/`. The diary now shows all 13 real posts |
| My Mithila motifs (mountain, sun, water, leaf) | Client motif PNGs on the live case page (the row above: not captured as raster) | Traced as inline SVG in `work/my-mithila/index.html`. Sticker set still not used |
| hero-field | Existing | Also reused in the numbers chapter portrait and the case "next" block. Never shown larger than the source |
| illus-film-set | Existing | Still the only illustrative image. Its alt text says so |
| Client logos | — | Still not captured. The clients chapter is a typographic index by design |

### Fonts (session 2)

All OFL, self-hosted via `@fontsource`, latin subset only:

- **Inter Tight** 400/600/900: alternative to AUGE's grotesk.
- **Instrument Serif** 400 + italic: alternative to ERA's condensed Didone.
- **Pinyon Script** 400: alternative to ERA's script.
- **Space Mono** 400: kept, Igloo HUD.
- **Lora** 700: kept, the wordmark.

The fonts section above describes session 1.

## Session 5 additions (2026-10-21): generated with Higgsfield, with the user's approval

Model: GPT Image 2.5 (`gpt_image_2_5`), 2K, quality high. Cost: 2.75 credits each, **13.75 credits total**. The account went from 70 to about 56 credits. One submission hit a 429 rate limit (not charged) and was resubmitted. No re-rolls.

None of these images is client work. Each one's alt text or caption says "illustrative". Masters (PNG) are in `assets/generated/` (not shipped). Web versions (WebP q80) are in `public/img/`.

| File (web) | Master | Prompt summary | Used in | Notes |
|---|---|---|---|---|
| hero-diff-640/1080/1600/1920 | hero-difference.png (2688×1520, resized to 1920×1080) | The client's hero photo (uploaded as reference) recoloured: lime grass, cobalt + pink/lavender sky, acid-yellow horizon, orange suit, same composition | Hero lens reveal; footer window | A derivative of the client's hero photo. Same usage-rights question as hero-field. Registered to the original by eye |
| svc-identity-560/960 | svc-identity.png (1792×2240) | Stacked geometric solids on acid yellow | Service 01 | |
| svc-content-560/960 | svc-content.png | Vintage film camera on a tripod aimed at an orange, hot pink sweep | Service 02 | Replaces the live-site placeholder `illus-film-set` |
| svc-growth-560/960 | svc-growth.png | Coloured blocks rising like a chart toward a chrome ball, cobalt | Service 03 | |
| studio-flatlay-800/1600 | studio-flatlay.png (2688×1520) | Overhead studio flat-lay on cobalt (camera, swatches, sketchbook, scissors, cactus) | Studio section; careers OG image | The camera dial carries tiny illegible marks; no readable text or brand |

**Generated and checked:** every image was viewed at full size before use, with no readable lettering, logos or third-party marks.

**Video:** none. Seedance 2.5 costs 80 credits for 5 s at 1080p, which is over the 70-credit balance.

**Also new:**
- `public/img/contours.svg`: procedurally generated topographic lines (matplotlib contour of a random Gaussian field), 31 KB raw.

**No longer used:**
- `illus-film-set`, `illus-portrait-noir`: kept in `public/img/` but unreferenced.
- `hero-field-640`, `-lqip`: kept, unreferenced.

**Fonts (session 5):** Archivo Variable (wdth file, latin ≈ 90 KB), Instrument Serif, Herr Von Muellerhoff, Space Mono. All OFL, self-hosted via `@fontsource`. Lora, Inter Tight and Pinyon Script were removed from package.json.
