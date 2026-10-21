# Competitor Research

## Method and limitations

- Both competitor sites were read through WebFetch, which returns rendered page text and structure but no screenshots or motion.
- The browser link to the user's computer was used for the Tifferend site, but it dropped before the competitors could be inspected visually. So the **visual and motion observations below are limited to what the page structure describes** (for example, "looping video previews on project cards"). They are marked *text-derived*.
- A live visual pass on both competitors is a recommended next step (see PROJECT_STATUS).
- Pages covered: `imagined.studio/`, `imagined.studio/tech`, `mellowdesigns.co/`.

## Direct observations

### Imagined Studio (Bengaluru, "full stack product first design agency")

- Home hero: "Hello this is Imagined. From Vision to Version." with "Visual Identity, Motion Design and development creative agency."
- `/tech` hero: "Engineering partners for Xiaomi, WLDD, and Tatva. Designed, developed and launched 10+ apps & 40+ websites."
- Nav: About · Visual Bank (12) · Techlab · Contact (an external cal.com booking link) · Blog. The work section is branded "Visual Bank" and shows a live item count in the nav.
- Sections: Studio intro → Team (ex-founders, IT heads, psychologists, engineers, designers) → "A PROCESS THAT WORKS ACROSS SCALE" (What we do / How we do it / Who are we for) → **Design Stack** and **Dev Stack** service lists → client logos (Reliance, Zerodha, CRED, Xiaomi) → "ANY MORE QUESTIONS?" → footer.
- Services are framed as **outcomes and engagements** ("zero-to-one launches", "fundraise sprints", "identity and rebrands", "content engines", "retail and print kits") rather than disciplines.
- CTAs: "Book a call" is repeated, plus "Let's talk" and email. There are two booking URLs (cal.com and /book), which is inconsistent.

### Mellow Designs (Bengaluru, est. 2018, "business design studio")

- Hero: "Your brand is your baby. It's ours too." The subhead talks about "co-parenting" the brand. A looping show reel plays behind it, with "Ask ChatGPT" / "Ask Claude" buttons.
- Nav split by verticals: Business Design · Mellow Films · Mellow X · Mellow Staffing, plus Projects / Services / Contact.
- The sequence is engineered for trust: client logos (Titan, Giva, 3M, MillerKnoll, DLF…) → **"So far, so good. Real numbers, real growth."** (eight quantified outcomes) → projects "Breaking fresh grounds." → news → **named founders** → video insights → services (six groups) → **video testimonials with name, title and logo** → FAQ (engagement length and model) → CTA "Your brand's success story starts here" → culture → contact form.
- Project cards: looping video preview, name, one-line summary, discipline tags (*text-derived*).
- Contact: form (name, email, company, phone), live chat, WhatsApp, email, phones, office address with map, socials.

## Comparison matrix

| # | Competitor / page | Verified observation | Why it works | Relevance to Tifferend | Proposed original adaptation | Complexity | Priority | Evidence |
|---|---|---|---|---|---|---|---|---|
| 1 | Mellow / home | Results band "Real numbers, real growth." with specific outcomes | Converts claims into proof | High. Tifferend has stats (50+/200+/8+/5+) but no outcomes | Animated stat counters with the client's own captions. Outcome metrics only when the client supplies them (no invented numbers) | Low | P1 | Text (WebFetch) |
| 2 | Mellow / home | Named founders section | Humanises a studio and builds trust | High. Founder Kunj's freelance-to-studio story is verified | "Studio" chapter built around Kunj's story and the mission | Low | P1 | Text |
| 3 | Mellow / home | FAQ on engagement model and timelines | Removes pre-enquiry friction | Medium. No Tifferend data | Not built. Listed as a content request (needs client answers) | Low | P3 | Text |
| 4 | Mellow / home | Video testimonials with name, title and logo | Hard-to-fake social proof | Medium. Tifferend's quotes are unconfirmed | Testimonial component built but flagged off until confirmed | Low | P2 | Text |
| 5 | Mellow / home | Multiple contact channels (form, WhatsApp, email, phone, map) | Meets each visitor where they are | High | Contact finale: giant email + structured enquiry form (composes a `mailto:`) + "Book a free consultation" | Medium | P1 | Text |
| 6 | Mellow / projects | Cards with looping video previews and discipline tags | Motion sells creative work | High | Drifting work strip (from AUGE) with HUD-style discipline tags (from Igloo) | Medium | P1 | Text-derived |
| 7 | Imagined / home | Services framed as engagements ("zero-to-one launches") | Speaks to the buyer's situation, not the agency's toolset | Medium | Kept Tifferend's verified three services, but each leads with an outcome sentence from their own copy | Low | P2 | Text |
| 8 | Imagined / tech | Hero leads with named clients and volume ("10+ apps & 40+ websites") | Instant credibility | High. Tifferend has verified clients | Client name marquee directly under the hero, set as typography | Low | P1 | Text |
| 9 | Imagined / nav | "Visual Bank (12)", a branded work section with a count | Makes the archive feel curated | Medium | Work strip labelled with an index counter ("01 / 07") in mono | Low | P2 | Text |
| 10 | Imagined / process | "What we do / How we do it / Who are we for" | A clear, scannable 3-part process | High. Tifferend has Understand / Create / Amplify | Pinned horizontal process chapter with a drawn line | Medium | P1 | Text |
| 11 | Imagined / CTA | Repeated "Book a call", but with two different booking URLs | Repetition helps; inconsistency hurts | High (avoid the mistake) | One canonical enquiry destination (`#contact`), used consistently | Low | P1 | Text |
| 12 | Both | Neither competitor surfaces a deep case study on the homepage | Gap | High | **My Mithila case study as a full, immersive page**, Tifferend's strongest differentiator | High | P1 | Text |

## Interpretation

- Both competitors lean on **scale signals** (big-brand logos, numbers). Tifferend's verified roster is smaller and more varied (F&B, healthcare, education, D2C, auto, tech). Its advantage is **depth and voice**: a real, richly documented identity project and a founder-led, "tifferendly" personality.
- Mellow's voice is warm and parental. Imagined's is technical. Tifferend's own copy ("Building a brand is personal… That's not a process. That's a philosophy.") sits between the two. The design should let that copy breathe at editorial scale rather than bury it in cards.

## Highest-value opportunities for Tifferend

1. **Lead with one real story, told cinematically.** The My Mithila case study becomes a full chapter of the site, which neither competitor offers on its homepage.
2. **Make the philosophy the centrepiece.** A scroll-scrubbed manifesto paragraph turns brand voice into an experience.
3. **Proof without fabrication.** Verified client names, the client's own stats, and a testimonial slot that switches on once the quotes are confirmed.
4. **One consistent conversion path.** Every CTA leads to the contact finale. The form composes a ready-to-send email, and there's a free-consultation hook (from the client's own ticker).
5. **A motion signature competitors don't have.** The ember curved wipe, the arch reveal and the drifting strip, used consistently.
