# Worklog — Quantum Research Lab Landing Page

---

Task ID: 1
Agent: Z.ai Code (main)
Task: Build a single-page landing website for a University Quantum Research Lab (Next.js 16 + Tailwind 4 + Framer Motion + TypeScript) based on the user's prompt, the uploaded seed pitch deck (27 slides), the grant proposal PDF, and 13 real team member names.

Work Log:
- Explored project scaffold: Next.js 16 App Router, Tailwind 4 (CSS-based @theme config, NOT tailwind.config.js), shadcn/ui full set, framer-motion 12 already installed.
- `src/app/globals.css`: added quantum design tokens via Tailwind v4 `@theme` (quantum-navy #0A192F, secondary #112240, blue #00D9FF, purple #6C5CE7, green #00B894, amber, subtle #8892B0), custom keyframes (float, pulse-glow, orbit, bob, blink), font tokens (Montserrat headings / Inter body / Courier mono), dark quantum theme as default shadcn variables, custom scrollbars, glass-panel + text-glow utilities, prefers-reduced-motion support.
- `src/app/layout.tsx`: Montserrat + Inter via next/font, full SEO metadata (title/description/keywords/OG/Twitter), SVG favicon, JSON-LD ResearchOrganization structured data.
- `src/lib/data.ts`: single source of truth — 15 team members (13 REAL names from the user's WhatsApp list + 2 open seats |0⟩ and |1⟩ as requested), problem funnel (10,000→800→90→12→4), problem stats (300% jobs, 0 labs, 2^300), core features, three pillars, stack layers, track record, 3 phases (Foundation M1–6 / Operations M7–18 / Sustainability M19–36) with exit criteria, budget categories from the pitch deck (24/20/20/16/12/8% = $50K), itemized audit table ($7,200 IBM + $4,800 Braket + $10,000 GPU + $10,000 stipends + $8,000 certs + $6,000 hackathons + $4,000 contingency), 4 "what if" scenarios, calculateROI(), year-3 scoreboard, lab email, nav links.
- `src/lib/animations.ts`: shared Framer Motion variants (quantumVariants, fadeInLeft/Right, scaleIn, staggerContainer, heroStagger, wordRise, entangled, shared viewport config).
- `src/components/ui/QuantumBackground.tsx`: full-page fixed canvas — adaptive particle count, entanglement links between nearby particles, cursor repulsion + parallax, DPR-aware, resize handling, reduced-motion static frame, proper cleanup.
- `src/components/ui/QuantumCard.tsx`: reusable frosted card with accent-driven hover glow.
- `src/components/ui/SectionHeading.tsx`: mono eyebrow + Montserrat heading + subtitle.
- `src/components/ui/Counter.tsx`: count-up on view (framer `animate`).
- `src/components/Navbar.tsx`: sticky blur navbar, scroll-progress beam (useScroll+useSpring), desktop links + CTA, mobile AnimatePresence hamburger menu.
- `src/components/Hero.tsx`: 100vh hero — staggered word-by-word headline "Building Egypt's Quantum Future Today", SVG quantum circuit (H gate, CNOT with rotating target, X gate, animated measurement meters), mouse-parallax circuit + floating bra-ket symbols (|0⟩ |1⟩ ψ ⊗ ⟨φ| ħ), orbiting electron accents, credibility badges, dual CTAs, scroll indicator.
- `src/components/Problem.tsx`: talent funnel with animated widths/counters (slide from left), decoherence definition card, 300% / 0 / 2^300 stat cards (slide from right), punchline.
- `src/components/Solution.tsx`: 3 feature cards (Cloud/Training/Research, slide from right + icon glow), AI-generated dilution-refrigerator hardware image (next/image), Three Pillars with animated connecting beam, live stack rows, measured results list.
- `src/components/Methodology.tsx`: interactive 3-phase timeline — progress beam fills to active phase, click-to-expand cards with AnimatePresence, activities checklist + exit-criteria milestones.
- `src/components/BudgetCalculator.tsx`: THE SHOWSTOPPER — shadcn Slider ($0–$50K, step 500), spring-driven AnimatedDollars readout (no re-render), SVG donut where slices scale with funded fraction over a ghost ring, legend rows with Radix Tooltips + live dollar amounts, 4 scenario presets with dynamic outcome sentence, ROI counters (students/projects/pubs/partners/hackathons), $1→$100 promise note, itemized audit-ready table, ignition quote.
- `src/components/Team.tsx`: 15-member responsive grid (5 cols xl), gradient initial avatars, hover lift + skill chips reveal, dashed open-seat cards with spinning border, mailto CTA.
- `src/components/Footer.tsx`: sticky footer (mt-auto in min-h-screen flex), "Join the Quantum Revolution" CTA, partnership terms grid, transparency strip, socials, university logo placeholder, made-with-love bar.
- `src/app/page.tsx`: assembles all sections over the fixed QuantumBackground.
- Generated `public/images/quantum-hardware.jpg` via z-ai CLI (golden quantum computer chandelier).
- Fixed lint error (react-hooks/immutability) in BudgetCalculator donut math by rewriting to a functional cumulative-arc computation.
- `bun run lint` → clean. Dev server compiled with no errors.

Stage Summary:
- Verification (agent-browser, desktop 1440×900 + mobile 390×844): hero renders with circuit + parallax; Problem funnel counters animate; Solution image + pillars + stack + track record OK; Methodology timeline beam fills and Phase 2 expands on click; Budget slider/scenario interaction verified — $10K preset shrinks donut to 20% funded, all 6 legend amounts spring-update, ROI settles at 40/3/1/1/0, dynamic outcome text swaps; Team shows all 15 cards; Footer sticky at page bottom with terms; mobile hamburger menu opens; zero console errors, zero page errors, zero dev.log errors.
- Design decisions: dark-mode-only quantum theme; allocation % locked to the audited pitch-deck plan (donut shows funded share of full $50K lab — honest visualization); |0⟩/|1⟩ used as binary placeholder names for the 2 open seats exactly as user requested ("حط الاسم ثنائي بس كفاية").
- Artifacts: 11 components + 2 lib files + globals.css/layout/page + 1 generated image.
- Suggested next phases: Arabic/English i18n toggle (next-intl already installed), a downloadable one-page PDF proposal, contact/partnership form backed by a Prisma API route, team photo uploads, OG share image.

---
Task ID: 2-a
Agent: Z.ai Code (cron webDevReview round 1)
Task: Assess project status, QA via agent-browser, then add new features (mandatory: more styling detail + more functionality).

Work Log:
- QA regression pass: page loads clean, zero console/page errors, dev.log clean. Prior phase (Task 1) confirmed stable.
- Fullstack feature — partnership form:
  - `prisma/schema.prisma`: added `Inquiry` model (name, org, email, interest enum-ish string, message, createdAt); `bun run db:push` OK (SQLite db/custom.db).
  - `src/app/api/inquiries/route.ts`: POST (zod-validated create, 400 with field issues on invalid) + GET (public aggregate: total + latestAt, no-store). Verified live: POST 201 in 57ms, GET 200.
  - `src/components/ContactSection.tsx` (SECTION 07 — MAKE CONTACT): react-hook-form + zodResolver, shadcn Input/Textarea/Select/Button, radix toast on success/error, animated "Signal Received" success state with "send another", live SignalCounter pill ("N SIGNALS RECEIVED — YOU'D BE MEASUREMENT #N+1") fed by GET /api/inquiries. Character counter 0/2000, avg response note.
- New section — `src/components/Scoreboard.tsx` (SECTION 05 — THE SCOREBOARD, id=scoreboard): uses previously-unused YEAR3_OUTCOMES — 6 outcome tiles (200/15/5/3/2/1) with per-color animated counters + hover glow beam; "$50K exchange rate" comparison (elsewhere strikethrough vs here, fadeInLeft/Right); ten-year "$1 → $100" banner with sweeping light sweep.
- Styling details: `src/components/QuantumTicker.tsx` — seamless CSS marquee strip (marquee keyframes added to globals.css @theme) of quantum vocabulary + achievements between Hero and Problem; quantum scroll-to-top floating qubit button (appears >650px scroll).
- Team section upgrade: discipline filter chips (All 15 / Leads / Research / Tech / Ops & Events / Media & Design / Open Seats) — added `group` field to all 15 TEAM_MEMBERS, AnimatePresence popLayout + layout re-flow animation, aria-pressed/aria-live.
- Navigation: added "Contact" link to NAV_LINKS; footer id changed contact→footer to avoid duplicate anchor; section numbering normalized (01 Problem, 02 Solution, 03 Circuit, 04 Budget, 05 Scoreboard, 06 Team, 07 Make Contact).
- `bun run lint` clean after all changes.

Stage Summary:
- Browser-verified this round: form full round-trip (fill → POST 201 → success state + toast → GET shows total:1 in DB); team filter shows 2 research members when Research active; scoreboard tiles + comparison cards render with animations; ticker marquee scrolls; scroll-to-top qubit appears; Contact link in navbar works.
- Current status: stable, feature-rich MVP+ landing (10 sections + fullstack inquiry pipeline).
- Risks/notes: DB grows unbounded from public form (spam risk — consider rate limiting/honeypot later); signal counter not persisted across nav (fetch on mount, fine for MVP); admin has no dashboard for inquiries yet (read via prisma studio or API).
- Next-phase recommendations (priority order): 1) AR/EN bilingual toggle (grant guide is Arabic — funders likely Arabic-first; next-intl installed) with RTL layout support; 2) simple admin page or email digest for inquiries (protected); 3) downloadable one-page PDF proposal (print stylesheet or generated PDF); 4) OG share image + sitemap; 5) rate-limit + honeypot on POST /api/inquiries.

---
Task ID: 3
Agent: Z.ai Code (cron webDevReview round 2)
Task: Assess project status, QA via agent-browser, fix bugs, then add new features (mandatory: more styling detail + more functionality).

Work Log:
- QA regression (agent-browser, desktop 1440x900 + mobile 390x844): page loads clean, zero console/page errors, dev.log clean; verified budget $10K preset (slider->10000, donut 20%, legend amounts, ROI 40/3/1/1/0), team Research filter (2 cards), mobile hamburger menu, footer terms.
- Bug fix: grammar in BudgetCalculator outcome sentence — "publish 1 papers" -> pluralized "research project(s)" + "peer-reviewed paper(s)".
- Security hardening (worklog round-1 rec #5):
  - src/lib/rateLimit.ts: in-memory sliding-window limiter (5 POST / 10 min / IP, periodic sweep, x-forwarded-for keying).
  - POST /api/inquiries now: rate limit (429 + Retry-After + friendly quantum message), `website` honeypot (bots get fake 202 success, nothing stored).
  - ContactSection: hidden honeypot input (aria-hidden, tabIndex -1) + schema field.
  - Verified by curl: normal 201, honeypot 202 + NOT stored (total unchanged), 429 from 5th rapid hit; test rows deleted afterwards (DB back to 1 legacy row).
- SEO polish (rec #4): AI-generated OG cover image public/images/og-cover.png (1344x768, quantum network sphere over circuit board); layout.tsx got metadataBase (NEXT_PUBLIC_SITE_URL env fallback localhost), canonical, og/twitter images; src/app/sitemap.ts (single route); robots.txt + Sitemap line.
- New SECTION 07 - FAQ (id=faq, "Measured Answers"): src/components/FAQ.tsx — sticky left pitch panel (guarantee card + mailto + PDF download row) + 8-question Radix accordion (custom +/- rotate trigger, Q00-Q07 mono indices, open-state glow border, stagger entrance); FAQ_ITEMS in data.ts; inserted between Team and Contact; Contact renumbered to SECTION 08; NAV_LINKS gained FAQ.
- One-page PDF proposal (rec #3): download/proposal/quantum-lab-one-pager.html (A4 794x1123 dark quantum brand, self-hosted base64 Montserrat/Inter @font-face — Google Fonts CDN unreachable from headless browser; decorative SVG entanglement circuit + ghost psi; sections: header/hero+ask/problem strip/3-phase plan/budget allocation bar with itemized legend/Year-3 ROI KPIs/accountability strip/footer) -> skills/pdf html2poster.js -> public/proposal/quantum-lab-one-pager.pdf (vector, 276KB, exactly A4 after spacing trim; pdf_qa PASS; metadata Title/Author/Creator/Subject set).
- PDF CTAs: navbar desktop icon button + mobile menu item, FAQ guarantee card row, footer tertiary button (all download="QRL-Lab-Seed-Proposal.pdf"; PROPOSAL_PDF const in data.ts).
- Styling/a11y details: skip-to-content link (layout.tsx, first Tab stop — verified via keyboard), #main-content anchor on <main>; FAQ mobile wrap fix (flex-wrap gap-x-2).
- bun run lint clean; agent-browser final sweep zero errors; PDF endpoint 200 application/pdf; sitemap.xml 200.

Stage Summary:
- Status: stable, feature-rich MVP++ (11 sections + fullstack inquiry pipeline + hardened API + SEO/OG/sitemap + downloadable print-ready A4 proposal).
- Artifacts: og-cover.png, sitemap.ts, FAQ.tsx, rateLimit.ts, one-pager HTML/PDF/preview (download/proposal/), public/proposal/quantum-lab-one-pager.pdf.
- Verification highlights: honeypot/rate-limit live-tested; accordion single-open verified; skip link keyboard-verified; budget/team/footer regressions pass.
- Risks/notes: in-memory rate limiter resets on server restart (fine for single-node demo; swap Redis for multi-instance); OG image uses absolute metadataBase URL (set NEXT_PUBLIC_SITE_URL in prod); one-pager HTML is the editable source — re-render via html2poster.js after edits; PDF says "Cairo, Egypt" (assumed location — adjust if the university differs).
- Next-phase recommendations (priority): 1) AR/EN bilingual toggle + RTL (next-intl installed; biggest remaining item, needs direction-aware animation pass); 2) protected admin inbox for inquiries (note: only / route is user-visible per platform constraint — consider email digest cron or basic-auth API instead); 3) sitemap/OG deploy wiring via NEXT_PUBLIC_SITE_URL; 4) team photo uploads for the 13 real members.

---
---
Task ID: 4
Agent: Z.ai Code (cron webDevReview round 3)
Task: Assess status, QA via agent-browser, then add new features (bilingual AR/EN + newsletter + styling polish).

Work Log:
- Status assessment: dev.log clean, no runtime errors; agent-browser QA regression pass (desktop 1440x900 + mobile 390x844) — budget $10K preset (donut 20%, sentence "With $10,000, we can train 40 students", aria-pressed), FAQ single-open accordion, team Research filter (2 cards), mobile hamburger menu all PASS. No bugs found → proceeded to feature development per round-2 recommendations.
- MAJOR FEATURE — AR/EN bilingual toggle with full RTL:
  - src/lib/i18n.ts: Lang/L10n types, l() builder, tr() collapse helper, PAGE_TITLES, STORAGE_KEY.
  - src/lib/copy.ts: typed bilingual Copy deck (~260 strings x2 languages) — nav, hero, all 8 sections, forms, footer, aria labels; templated builders (budget outcome sentence, signal counter, newsletter count, phase bra-ket, donut aria).
  - src/lib/LanguageProvider.tsx: client context (lang/t/tx/toggle), localStorage persistence, <html lang dir> flip, document.title management incl. MutationObserver guard (Next re-asserts SSR title after hydration) + deferred re-assert.
  - src/lib/data.ts: ALL display fields converted to L10n pairs (team roles/years/skills, funnel labels, features, pillars, stack, track record, 3 phases + activities + milestones, budget categories/items/scenarios, Year-3 outcomes, 8 FAQ Q&A, nav links). Team NAMES stay Latin (user-provided roster).
  - layout.tsx: Cairo Arabic font (next/font, variable --font-cairo) + LanguageProvider wrapper.
  - globals.css: RTL layer — Cairo-first font stack for body/headings in dir=rtl, letter-spacing neutralized for Arabic ([class*="tracking-"] rule), line-height 1.75.
  - All 13 components rewired to useLang()/tx(); logical properties (ps/pe/start/end/text-start) replace physical ones; rtl: variants for hover translate, arrows (rtl:-scale-x-100), scroll-to-top corner, progress-beam origin; numbers/$ amounts pinned dir="ltr"; QuantumTicker forced dir="ltr" (marquee physics unchanged).
  - Arabic quality: MSA scientific register; Arabic numeral agreement in ROI sentence (3-10 plural → "5 أوراق محكَّمة", else singular accusative → "40 طالبًا"); Arabic-embedded Latin tech tokens (Qiskit, IBM Quantum) flow correctly under bidi.
  - Navbar: EN⇄AR pill toggle (desktop + mobile menu row), scroll-spy active link with measurement beam (aria-current), Cairo for the "عربي" label.
  - A11y: headline words joined by REAL space text-nodes (was margin-only → screen readers glued words); localized aria labels throughout; localized zod validation messages (schema rebuilt per language via useMemo); localized 429 rate-limit message (client maps status→copy, server stays English).
- FEATURE — Newsletter "Stay Entangled" (fullstack):
  - prisma/schema.prisma: Subscriber model (unique email); bun run db:push OK.
  - src/app/api/subscribe/route.ts: POST (zod, 5/10min rate limit, honeypot→fake 202, P2002→{ok,duplicate:true}), GET (public total, no-store). Live-tested: 201 first / duplicate:true on repeat / 400 invalid / 429 burst / honeypot stores nothing. Test rows cleaned (0 subscribers).
  - Footer.tsx: newsletter card (title, email input dir=ltr, submit with spinner, live "N ON THE LIST" counter from GET, success/duplicate/error toasts), honeypot field.
- STYLING POLISH:
  - SectionDivider component (entangled qubit trio on hairline beam, pulsing, symmetric/RTL-safe) inserted between major sections (4 instances, per-section accents).
  - ScrollToTop: measurement progress ring (SVG stroke-dashoffset fills with reading progress).
  - Scroll-spy navbar active beam (see above).
  - Ticker, badges, hero caption localized; mobile menu language row.
- Infra note: after db:push, the running dev server kept the OLD PrismaClient (module cache + globalThis singleton) → /api/subscribe 500 "cannot read count". Fixed by touching next.config.ts which forces a full `next dev` server restart (fresh module cache). Documented in next.config.ts comment.
- Bug fixes this round: duplicate React keys (TRACK_RECORD #FFD166 → key=title.en; BUDGET_ITEMS cost 10000 → key=resource.en); headline missing word spaces (a11y); Arabic title override by Next metadata (MutationObserver guard); Arabic numeral agreement in outcome sentence.
- bun run lint → clean. Final browser sweep: zero console errors in fresh session (EN + AR), desktop + mobile verified in both languages, RTL layout correct end-to-end (hero, funnel, donut, tables, FAQ, footer, mobile menu).

Stage Summary:
- Status: stable MVP+++ — 11 sections, bilingual AR/EN with full RTL, scroll-spy nav, newsletter fullstack pipeline, inquiry pipeline (rate-limited + honeypot), SEO/OG/sitemap, downloadable A4 PDF.
- Verification highlights: AR toggle persists across reload (localStorage qrl-lang); dir=rtl flips nav/menu/cards/tables/slider correctly; Cairo renders headings/body; budget interactions verified in BOTH languages; subscribe API all paths live-tested; localized toasts render (verified via ol.fixed viewport — note: [data-radix-toast-viewport] selector does NOT exist in this Radix version).
- Risks/notes: lang flash on hard reload (EN paints first, saved AR applies post-hydration — standard for client-side i18n without cookies); rate limiter is per-IP in-memory and shares the "local" key between curl and browser tests in this sandbox (bursts may 429 during dev testing; production keys differ); newsletter has no double opt-in (fine for MVP); one-pager PDF remains EN-only (candidate for AR version next).
- Next-phase recommendations (priority): 1) Arabic one-page PDF proposal (mirror of the EN one-pager with RTL layout); 2) admin inbox / email digest for inquiries+subscribers (platform constraint: only / route user-visible — consider basic-auth API or cron digest); 3) NEXT_PUBLIC_SITE_URL deploy wiring for OG/sitemap; 4) team photos for the 13 real members; 5) consider html lang pass on server via cookie for zero-flash i18n.

---
Task ID: 5
Agent: Z.ai Code (cron webDevReview round 4)
Task: Assess status, QA via agent-browser, then add new features (interactive qubit simulator + Arabic PDF + zero-flash i18n + styling detail pass).

Work Log:
- QA regression (agent-browser, desktop 1440x900 + mobile 390x844, EN+AR): all 9 anchors present; budget $10K preset (donut+ROI sentence) PASS; FAQ single-open accordion PASS; team Research filter (2 cards) PASS; mobile RTL hamburger PASS; localStorage lang persistence PASS. Zero console/page errors, dev.log clean. No bugs found this round. One transient during development (FAQ `lang` destructure landed one commit after PROPOSAL_PDFS usage) — resolved immediately; fresh-session console verified clean.
- MAJOR FEATURE — SECTION 04 "TRY QUANTUM" (id=playground), the second showstopper:
  - src/lib/quantum.ts: dependency-free single-qubit engine — Complex type + arithmetic, QubitState, 5 gates (H/X/Z/S/T) as 2x2 unitaries with bilingual names/blurbs, applyGate with renormalization, Born-rule probabilities, sampleOnce, Bloch coords (x,y,z), relativePhase, 5 famous-state presets (|0⟩ |1⟩ |+⟩ |−⟩ |+i⟩), U+2212 typographic minus in cformat.
  - src/components/Playground.tsx: Bloch disc SVG (constant-length rotating vector w/ spring + pulse-glow tip, equator hint, |0⟩/|1⟩ poles, P(0) gradient shading via clip-path), phase dial (relative-phase needle, dimmed when |β|≈0), animated probability bars, mono amplitude readout (dir=ltr), 5 gate buttons with hover/focus blurb panel + per-gate accent colors, animated circuit wire with gate chips (9-window + overflow counter + pulsing measure terminal), presets, Measure-once (collapse + AnimatePresence flash + aria-live) / 100-shots histogram (non-destructive) / Undo (32-deep snapshot stack) / Reset, pedagogy footer tying the toy to Phase-1 training + IBM hardware.
  - Math verified live: X→|1⟩ (P=100%), H|1⟩=(0.71,−0.71), shots on |+⟩ → 56/44, measure collapses to |0⟩ with flash, undo restores pre-measurement state. Verified EN + AR (RTL, localized gate names).
- Section renumbering: Playground = 04 → Budget 05, Scoreboard 06, Team 07, FAQ 08, Contact 09 (EN+AR eyebrows); NAV_LINKS gained {#playground, Playground/جرّب الكم}; misc.playgroundAria added; page.tsx assembly + divider accents.
- MAJOR FEATURE — Arabic one-page PDF proposal (RTL mirror of the EN one-pager):
  - download/proposal/build-ar-onepager.py: generator embedding base64 Cairo variable font (arabic+latin subsets reused from .next next/font cache — no CDN needed); dir=rtl with mirrored decor (circuit top-left), logical border sides, padding-right bullets, .ltr isolate spans for $ amounts/tech tokens; same brand system/A4 794x1123.
  - Fit-to-A4: 27 CSS metric trims (Cairo renders taller than Inter) — html2poster measured exactly 794x1123.
  - pdf_qa: PASS after rephrasing 3 stat captions (em-dash line-start false-positive-proof) + pymupdf metadata (Title/Author/Creator). Output: public/proposal/quantum-lab-one-pager-ar.pdf (681KB, 1 page).
  - Wiring: data.ts PROPOSAL_PDF → PROPOSAL_PDFS {en,ar} with per-lang download filenames; Navbar (desktop icon + mobile row), FAQ guarantee card, Footer CTA now serve the file matching the UI language; AR faq.pdfMeta "A4 · 681KB".
- FEATURE — Zero-flash i18n via lang cookie:
  - LanguageProvider: `initialLang` prop (seeded from server), writeLangCookie (qrl-lang, 1y, samesite=lax) on every change; localStorage still wins post-mount if it disagrees.
  - layout.tsx: async RootLayout + getInitialLang() reading cookies() → <html lang dir> server-rendered; static `metadata` converted to async generateMetadata with cookie-localized title. curl proof: Cookie qrl-lang=ar → raw SSR HTML `<html lang="ar" dir="rtl">` + Arabic <title> (no EN flash). Route now dynamic (acceptable for this page).
- STYLING DETAIL PASS:
  - globals.css: keyboard-only `a:focus-visible` measurement-glow outline (WCAG 2.4.7; controls keep shadcn rings); `.noise-veil` fixed film-grain (SVG feTurbulence data-URI, opacity .035, mix-blend overlay, z-1 between canvas and content, zero JS). NOTE: rules inside `@layer base` with the data-URI silently failed to compile — moved to unlayered end-of-file block (verified in compiled CSS + computed styles).
  - page.tsx: noise-veil div over QuantumBackground.
  - Navbar mobile panel: /95+blur-md → /[0.98]+blur-xl + cyan ambient shadow (no more page bleed-through).
- bun run lint clean; final agent-browser sweep zero errors (fresh session, EN+AR); both PDF endpoints 200.

Stage Summary:
- Status: stable, MVP*4 — 12 sections now incl. a real interactive qubit simulator; bilingual end-to-end with zero-flash server-rendered i18n; bilingual print-ready A4 proposals; hardened fullstack inquiry+newsletter pipelines; SEO/OG/sitemap.
- Verification highlights: quantum math live-verified (H/X/Born-rule statistics/collapse/undo); SSR cookie proof via curl; pdf_qa PASS; mobile menu + RTL regressions pass in both languages.
- Risks/notes: cookies() makes the route dynamic (fine for a landing page; could pre-render with a middleware-based i18n later); quantum.ts is display-grade not cryptographic (renormalized after each gate — drift-safe); Arabic PDF font subsets come from the next/font cache — if the cache is cleared, re-run build-ar-onepager.py after a dev-server font fetch; playground undo stack capped at 32.
- Next-phase recommendations (priority): 1) two-qubit playground extension (CNOT + Bell state) — natural evolution of SECTION 04; 2) admin email digest cron for inquiries/subscribers (platform constraint: only / visible — use basic-auth API); 3) team photos for the 13 real members; 4) playwright smoke suite to lock the regression checklist; 5) NEXT_PUBLIC_SITE_URL deploy wiring when a real domain exists.
