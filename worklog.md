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
