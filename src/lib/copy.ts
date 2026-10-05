import type { Lang } from "@/lib/i18n";

/**
 * The full bilingual copy deck for the landing page.
 * English = source of truth from the pitch deck; Arabic = formal MSA with a
 * scientific register (Egyptian funders read both).
 *
 * Everything typed through `Copy` — a missing key in either language is a
 * compile error, not a production surprise (no quantum tunneling allowed).
 */

export interface Copy {
  meta: {
    skipToContent: string;
  };
  nav: {
    links: { href: string; label: string }[];
    cta: string;
    brandTag: string;
    downloadPdfAria: string;
    proposalPdfLabel: string;
    openMenu: string;
    closeMenu: string;
    langToggleAria: string;
  };
  hero: {
    badge: string;
    headline: { text: string; accent?: boolean }[];
    subPre: string;
    subLab: string;
    subMid: string;
    subPost: string;
    ctaExplore: string;
    ctaTeam: string;
    badges: string[];
    scroll: string;
    scrollAria: string;
    circuitAria: string;
    circuitCaption: string;
  };
  problem: {
    eyebrow: string;
    title: string;
    subtitle: string;
    funnelAria: string;
    punchPre: string;
    punchAccent: string;
    decoTerm: string;
    decoBody: string;
    stat300: string;
    stat0: string;
    stat2300: string;
    stat2300Accent: string;
  };
  solution: {
    eyebrow: string;
    title: string;
    subtitle: string;
    imageAlt: string;
    imageCaption: string;
    pillarsTitle: string;
    pillarsNote: string;
    stackTitlePre: string;
    stackTitleAccent: string;
    stackNote: string;
    resultsTitlePre: string;
    resultsTitleAccent: string;
  };
  methodology: {
    eyebrow: string;
    title: string;
    subtitle: string;
    phaseAria: (id: number, name: string) => string;
    phaseBraKet: (id: number) => string;
    exitCriteria: (id: number) => string;
    activitiesAria: (id: number) => string;
    quote: string;
  };
  playground: {
    eyebrow: string;
    title: string;
    subtitle: string;
    blochAria: string;
    phaseLabel: string;
    stateLabel: string;
    prob0Label: string;
    prob1Label: string;
    gatesTitle: string;
    gatesHint: string;
    circuitTitle: string;
    emptyCircuit: string;
    presetsTitle: string;
    presetAria: (label: string) => string;
    gateAria: (name: string) => string;
    undo: string;
    reset: string;
    measure: string;
    shots: string;
    controlsAria: string;
    resultAria: string;
    collapsedTo: (outcome: string) => string;
    shotsSummary: (zeros: number, ones: number) => string;
    histogramNote: string;
    pedagogyPre: string;
    pedagogyAccent: string;
    pedagogyPost: string;
    modeAria: string;
    modeSingle: string;
    modeEntangled: string;
  };
  twoQubit: {
    spheresTitle: string;
    wireHint: string;
    qubitLabel: (n: number) => string;
    jointTitle: string;
    endianNote: string;
    meterLabel: string;
    meterLeft: string;
    meterRight: string;
    meterAria: (c: number) => string;
    bellBadge: string;
    bellNote: string;
    gates2Title: string;
    gates2Hint: string;
    opAria: (name: string) => string;
    blurbH: (n: number) => string;
    blurbX: (n: number) => string;
    blurbCnot: (ctrl: number, tgt: number) => string;
    circuit2Title: string;
    emptyCircuit2: string;
    presets2Title: string;
    preset2Aria: (label: string) => string;
    recipeLabel: string;
    recipe: string;
    shotsSummary2: (summary: string) => string;
    pedagogy2Pre: string;
    pedagogy2Accent: string;
    pedagogy2Post: string;
    reducedAria: (n: number) => string;
  };
  chsh: {
    title: string;
    subtitle: string;
    dealBtn: string;
    measureBtn: string;
    nextBtn: string;
    resetBtn: string;
    resetAria: string;
    coachLabel: string;
    coachHintOn: string;
    coachHintOff: string;
    coachPick: string;
    sharedTitle: string;
    sharedNote: string;
    aliceStation: string;
    bobStation: string;
    questionAlice: (x: 0 | 1) => string;
    questionBob: (y: 0 | 1) => string;
    targetSame: string;
    targetDiff: string;
    basisA0: string;
    basisA1: string;
    basisB0: string;
    basisB1: string;
    basisBlurbA0: string;
    basisBlurbA1: string;
    basisBlurbB0: string;
    basisBlurbB1: string;
    stationAria: (who: string) => string;
    winBanner: string;
    lossBanner: string;
    winDetail: (a: 0 | 1, b: 0 | 1, target: 0 | 1) => string;
    statsTitle: string;
    roundsLabel: string;
    winsLabel: string;
    winRateLabel: string;
    classicalMark: string;
    quantumMark: string;
    winRateAria: (pct: number) => string;
    sTitle: string;
    sAria: (s: number) => string;
    sPending: string;
    sClassicalMark: string;
    sQuantumMark: string;
    violationBadge: string;
    violationNote: string;
    historyLabel: string;
    historyAria: string;
    noRoundYet: string;
    footerPre: string;
    footerAccent: string;
    footerPost: string;
    roundN: (n: number) => string;
    recordsTitle: string;
    recordsAria: string;
    recBestS: string;
    recBestSHint: string;
    recBestWinRate: string;
    recBestStreak: string;
    recTotalRounds: string;
    recNewBadge: string;
    recLifetimeNote: string;
    recNobelBadge: string;
    recNobelNote: string;
    streakNowLabel: string;
    shareBtn: string;
    shareAria: string;
    shareHintEmpty: string;
    shareToastTitle: string;
    shareToastDesc: string;
    shareToastFailTitle: string;
    shareToastFailDesc: string;
  };
  budget: {
    askEyebrow: string;
    askChips: string[];
    askNote: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    donutAria: (pct: number) => string;
    legendAria: (label: string, pct: number, amt: string, desc: string) => string;
    perStudent: (amt: string) => string;
    pctOfLab: (pct: number) => string;
    sliderLabel: string;
    sliderHint: (step: string) => string;
    scenariosTitle: string;
    scenariosAria: string;
    scenarioBtn: (k: string, title: string) => string;
    outcomeWith: (amount: string) => string;
    outcomeZero: string;
    outcomeBody: (r: {
      studentsTrained: number;
      projectsCompleted: number;
      publications: number;
      industryPartners: number;
    }) => string;
    roiTitle: string;
    roiLabels: string[];
    promise: string;
    promiseDetail: string;
    promiseDetail2: string;
    itemizedTitlePre: string;
    itemizedTitleAccent: string;
    itemizedSub: string;
    colResource: string;
    colQty: string;
    colCost: string;
    fundCol: string;
    fundAria: (item: string, cost: string) => string;
    tableCaption: string;
    totalSeed: string;
    closing: string;
  };
  scoreboard: {
    eyebrow: string;
    title: string;
    subtitle: string;
    tilesAria: string;
    elsewhereTitle: string;
    hereTitle: string;
    exchangeEyebrow: string;
    exchangeBodyPre: string;
    exchangeAccent: string;
    exchangeBodyPost: string;
  };
  team: {
    eyebrow: string;
    title: string;
    subtitle: string;
    gridAria: string;
    note: string;
  };
  faq: {
    eyebrow: string;
    titlePre: string;
    titleAccent: string;
    intro: string;
    guaranteeTag: string;
    guaranteeBody: string;
    guaranteeAccent: string;
    askDirect: string;
    pdfPre: string;
    pdfAccent: string;
    pdfMeta: string;
    observed: (n: number) => string;
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    counterScanning: string;
    counter: (n: number) => string;
    tiersEyebrow: string;
    tiersAria: string;
    tiers: { amount: string; name: string; tagline: string; perks: string[]; featured: boolean }[];
    tiersNote: string;
    tiersCta: string;
    tiersFeaturedBadge: string;
    qrTitle: string;
    qrCaption: string;
    /** Share-the-page module (AMPLIFY THE SIGNAL): native share, copy, X, LinkedIn, WhatsApp. */
    shareEyebrow: string;
    shareAria: string;
    shareText: string;
    shareBtnNative: string;
    shareBtnCopy: string;
    shareBtnX: string;
    shareBtnLinkedIn: string;
    shareBtnWhatsApp: string;
    shareToastCopiedTitle: string;
    shareToastCopiedDesc: string;
    fundEyebrow: string;
    fundTitle: string;
    fundSub: string;
    fundGoalChip: string;
    fundRaisedLabel: string;
    fundPctLabel: (pct: number) => string;
    fundEmpty: string;
    fundAria: string;
    fundMilestones: { at: string; label: string }[];
    /** Live pledge pipeline (Road-to-$50K): intents → human confirm → counted. */
    fundDisclaimer: string;
    pledgeEyebrow: string;
    pledgeIntro: string;
    pledgeName: string;
    pledgeNamePh: string;
    pledgeEmail: string;
    pledgeEmailPh: string;
    pledgeAmount: string;
    pledgeAmountPh: string;
    pledgeMessage: string;
    pledgeMessageOptional: string;
    pledgeMessagePh: string;
    pledgeSubmit: string;
    pledgeSubmitting: string;
    pledgeSuccessTitle: string;
    pledgeSuccessBody: string;
    pledgeAnother: string;
    pledgePendingNote: (n: number) => string;
    pledgeWallTitle: string;
    pledgeTierNames: { qubit: string; gate: string; founding: string; custom: string };
    pledgeAria: string;
    pledgeZodName: string;
    pledgeZodEmail: string;
    pledgeZodAmount: string;
    pledgeToastTitle: string;
    pledgeToastDesc: string;
    pledgeToastErrorTitle: string;
    tierPledgeCta: string;
    name: string;
    namePh: string;
    email: string;
    emailPh: string;
    org: string;
    orgOptional: string;
    orgPh: string;
    interest: string;
    interestPh: string;
    interestOptions: { value: "funding" | "partnership" | "join" | "other"; label: string }[];
    message: string;
    messagePh: string;
    privacy: string;
    responseTime: string;
    submit: string;
    submitting: string;
    honeypotLabel: string;
    successTitle: string;
    successBody: string;
    successBtn: string;
    toastTitle: string;
    toastDesc: string;
    toastErrorTitle: string;
    toastErrorDesc: string;
    rateLimited: string;
    // zod messages (bound at render time so validation speaks the page language)
    zodName: string;
    zodEmail: string;
    zodMessage: string;
  };
  newsletter: {
    title: string;
    subtitle: string;
    emailPh: string;
    submit: string;
    submitting: string;
    count: (n: number) => string;
    toastTitle: string;
    toastDesc: string;
    toastDupTitle: string;
    toastDupDesc: string;
    toastErrorTitle: string;
    zodEmail: string;
    honeypotLabel: string;
  };
  footer: {
    ctaPre: string;
    ctaAccent: string;
    sub: string;
    reviewTerms: string;
    onePager: string;
    onePagerAria: string;
    terms: string[];
    termsAria: string;
    brand: string;
    dept: string;
    transparency: string[];
    transparencyAria: string;
    copyright: string;
    madeWith: string;
    madeAccent: string;
    socialsLabel: string;
    socialAria: (name: string) => string;
  };
  misc: {
    backToTop: string;
    heroSectionAria: string;
    problemAria: string;
    solutionAria: string;
    methodologyAria: string;
    playgroundAria: string;
    budgetAria: string;
    scoreboardAria: string;
    teamAria: string;
    faqAria: string;
    contactAria: string;
    footerAria: string;
  };
}

/* ------------------------------------------------------------------ */
/*                              ENGLISH                                */
/* ------------------------------------------------------------------ */

const en: Copy = {
  meta: { skipToContent: "Skip to main content" },
  nav: {
    links: [
      { href: "#problem", label: "Problem" },
      { href: "#solution", label: "Solution" },
      { href: "#methodology", label: "Methodology" },
      { href: "#budget", label: "Budget" },
      { href: "#team", label: "Team" },
      { href: "#faq", label: "FAQ" },
      { href: "#contact", label: "Contact" },
    ],
    cta: "Fund the Future",
    brandTag: "Seed Pitch 2026",
    downloadPdfAria: "Download the one-page proposal PDF",
    proposalPdfLabel: "One-Page Proposal (PDF)",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    langToggleAria: "Switch language to Arabic",
  },
  hero: {
    badge: "Seed Pitch · 2026 · Student-Led · Faculty-Mentored",
    headline: [
      { text: "Building" },
      { text: "Egypt's" },
      { text: "Quantum", accent: true },
      { text: "Future", accent: true },
      { text: "Today" },
    ],
    subPre: "A student-led",
    subLab: "Quantum Research Lab",
    subMid: "seeking",
    subPost:
      "in seed funding — where students simulate reality on real quantum hardware, and the first lab of its kind in the region.",
    ctaExplore: "Explore Our Proposal",
    ctaTeam: "Meet the Team",
    badges: [
      "Presented to ASRT · ITIDA",
      "Global Quantum Partners",
      "15-Minute Investor Edition",
    ],
    scroll: "Scroll",
    scrollAria: "Scroll to the problem section",
    circuitAria:
      "Quantum circuit diagram: Hadamard gate on qubit 0, CNOT entangling qubits 0 and 1, measurement on both",
    circuitCaption: "grover_bell.py · backend: ibm_torino · shots: 1024",
  },
  problem: {
    eyebrow: "SECTION 01 — THE PROBLEM",
    title: "The Quantum Talent Pipeline Decoheres",
    subtitle:
      "Egypt graduates thousands of brilliant STEM students — and loses almost every one who touches quantum. Not for lack of talent. For lack of a lab.",
    funnelAria:
      "Talent funnel: from enrolled students to careers that stay in the region",
    punchPre: "We measure the talent. ",
    punchAccent: "Then we lose it.",
    decoTerm: "decoherence (n.)",
    decoBody:
      "— what destroys a quantum state before it can be measured. Also what happens to our best students between graduation and opportunity.",
    stat300:
      "growth in quantum job postings worldwide — the demand curve is vertical.",
    stat0: "practical quantum labs in Egyptian universities. Zero. The first-mover seat is empty.",
    stat2300:
      "states representable by a 300-qubit machine — more than atoms in the observable universe. ",
    stat2300Accent: "And our students have never touched one.",
  },
  solution: {
    eyebrow: "SECTION 02 — THE SOLUTION",
    title: "The Quantum Research Lab",
    subtitle:
      "A student-led, faculty-mentored laboratory where students run real quantum simulations and publish real research — the first of its kind in the region.",
    imageAlt:
      "Golden dilution-refrigerator quantum computer — the class of hardware our students access through the cloud",
    imageCaption: "The machines we simulate on — real quantum hardware",
    pillarsTitle: "Three Pillars, One Lab",
    pillarsNote: "entangled — each pillar amplifies the other two",
    stackTitlePre: "Our Stack — ",
    stackTitleAccent: "Real Hardware, Today",
    stackNote: "every layer is live today — zero capital required",
    resultsTitlePre: "Measured Results — ",
    resultsTitleAccent: "Not Promises",
  },
  methodology: {
    eyebrow: "SECTION 03 — THE CIRCUIT",
    title: "The Three-Year Circuit",
    subtitle:
      "Each phase output is the next phase input — the phases are entangled. Click any phase to collapse the wavefunction.",
    phaseAria: (id, name) => `Focus phase ${id}: ${name}`,
    phaseBraKet: (id) => `|Phase ${id}⟩`,
    exitCriteria: (id) => `Phase ${id} exit criteria`,
    activitiesAria: (id) => `Phase ${id} activities`,
    quote:
      "“each phase output is the next phase input — the phases are entangled”",
  },
  playground: {
    eyebrow: "SECTION 04 — TRY QUANTUM",
    title: "Play With A Real Qubit",
    subtitle:
      "Not a video — a live simulator running in your browser, on the same math our students master in Phase 1. Start with one qubit, entangle a pair, then beat the classical limit in the CHSH game. Apply gates, watch the Bloch sphere, measure. Go collapse something.",
    blochAria: "Bloch disc showing the current qubit state",
    phaseLabel: "RELATIVE PHASE φ",
    stateLabel: "STATE VECTOR",
    prob0Label: "P(measure 0)",
    prob1Label: "P(measure 1)",
    gatesTitle: "Gate rack",
    gatesHint: "Click a gate to apply it — hover for the intuition.",
    circuitTitle: "Circuit wire",
    emptyCircuit: "─ wire idle · apply a gate ─",
    presetsTitle: "Famous states",
    presetAria: (label) => `Load the state ${label}`,
    gateAria: (name) => `Apply the ${name} gate`,
    undo: "Undo",
    reset: "Reset",
    measure: "Measure once",
    shots: "Run 100 shots",
    controlsAria: "Qubit controls",
    resultAria: "Measurement results",
    collapsedTo: (o) => `Measured |${o}⟩ — the superposition collapsed. Undo restores it.`,
    shotsSummary: (zeros, ones) => `${zeros}× |0⟩ · ${ones}× |1⟩ — out of 100 shots`,
    histogramNote: "Non-destructive sampling: your state survives the statistics.",
    pedagogyPre: "This is the ",
    pedagogyAccent: "Phase-1 training engine",
    pedagogyPost:
      " — the same linear algebra as Qiskit's Statevector, shrunk into a browser tab. Fund the lab and 200 students will run it on real IBM Quantum hardware.",
    modeAria: "Simulator mode",
    modeSingle: "Single qubit",
    modeEntangled: "Entangled pair",
  },
  twoQubit: {
    spheresTitle: "Reduced states",
    wireHint: "Each sphere shows one qubit alone — trace out its partner.",
    qubitLabel: (n) => `q${n} · ${n === 0 ? "top" : "bottom"} wire`,
    jointTitle: "Joint probabilities",
    endianNote:
      "Bit order follows Qiskit's little-endian: |q₁ q₀⟩ — the top wire is the right-hand digit.",
    meterLabel: "ENTANGLEMENT",
    meterLeft: "separable",
    meterRight: "maximal",
    meterAria: (c) => `Entanglement meter at ${(c * 100).toFixed(0)} percent of maximal`,
    bellBadge: "BELL PAIR ACHIEVED",
    bellNote:
      "Each qubit alone is now pure noise — the vectors shrank to the center. Every bit of information lives in the correlation. That is entanglement.",
    gates2Title: "Two-qubit gate rack",
    gates2Hint: "H and X act on one wire — ⊕ (CNOT) entangles the pair.",
    opAria: (name) => `Apply ${name}`,
    blurbH: (n) =>
      `Hadamard on qubit ${n} — puts that wire alone into superposition. The pair is still separable… until CNOT.`,
    blurbX: (n) => `Pauli-X on qubit ${n} — flips that wire's |0⟩↔|1⟩.`,
    blurbCnot: (ctrl, tgt) =>
      `CNOT — if qubit ${ctrl} reads 1, flip qubit ${tgt}. THE entangling gate: one controlled flip turns product states into Bell states.`,
    circuit2Title: "Entangling circuit",
    emptyCircuit2: "─ lanes idle · apply a gate ─",
    presets2Title: "Famous pairs",
    preset2Aria: (label) => `Load the two-qubit state ${label}`,
    recipeLabel: "BELL RECIPE",
    recipe: "H on q0 → CNOT 0→1 → Φ⁺",
    collapsedTo2: (o) =>
      `Measured ${o} — both qubits collapsed together. Undo restores the entanglement.`,
    shotsSummary2: (summary) => `${summary} — out of 100 shots`,
    pedagogy2Pre: "This is the ",
    pedagogy2Accent: "Phase-2 research bench",
    pedagogy2Post:
      " — Bell states power quantum teleportation, QKD security proofs, and the CHSH experiments our students will run on real hardware. You just built one in a browser tab.",
    reducedAria: (n) => `Bloch disc of qubit ${n}'s reduced state`,
  },
  chsh: {
    title: "THE CHSH GAME",
    subtitle:
      "Alice and Bob share one entangled pair and may not communicate. Referee hands Alice bit x and Bob bit y — they win the round only if a ⊕ b = x·y. Classical strategy caps at 75%. Entanglement beats it. Prove it yourself.",
    dealBtn: "Deal the challenge",
    measureBtn: "Measure both",
    nextBtn: "Next round",
    resetBtn: "Reset stats",
    resetAria: "Reset all CHSH statistics",
    coachLabel: "COACH",
    coachHintOn: "Coach on — the winning basis glows each round.",
    coachHintOff: "Coach off — you're on your own, scientist.",
    coachPick: "COACH PICK",
    sharedTitle: "SHARED PAIR Φ⁺",
    sharedNote: "one Bell pair per round — no communication",
    aliceStation: "ALICE'S STATION",
    bobStation: "BOB'S STATION",
    questionAlice: (x) =>
      x === 0
        ? "Referee asks Alice: x = 0 — measure any axis you like."
        : "Referee asks Alice: x = 1 — measure any axis you like.",
    questionBob: (y) =>
      y === 0
        ? "Referee asks Bob: y = 0 — measure any axis you like."
        : "Referee asks Bob: y = 1 — measure any axis you like.",
    targetSame: "x·y = 0 → the bits must MATCH",
    targetDiff: "x·y = 1 → the bits must DIFFER",
    basisA0: "0° · Z",
    basisA1: "45° · X",
    basisB0: "+22.5°",
    basisB1: "−22.5°",
    basisBlurbA0:
      "Measure along the Z axis — the plain |0⟩/|1⟩ question. Optimal when x = 0.",
    basisBlurbA1:
      "Rotate 45° toward X — halfway between the poles. Optimal when x = 1.",
    basisBlurbB0:
      "Rotate +22.5° toward X — the famous half-angle. Optimal when y = 0.",
    basisBlurbB1:
      "Rotate −22.5° the other way — the twin setting. Optimal when y = 1.",
    stationAria: (who) => `${who}: choose a measurement basis`,
    winBanner: "ROUND WON",
    lossBanner: "ROUND LOST",
    winDetail: (a, b, target) =>
      `a ⊕ b = ${a ^ b} · x·y = ${target} — the correlation held${target === 0 ? "" : " (anti-correlated)"}.`,
    statsTitle: "SCOREBOARD",
    roundsLabel: "ROUNDS",
    winsLabel: "WINS",
    winRateLabel: "WIN RATE",
    classicalMark: "CLASSICAL 75%",
    quantumMark: "QUANTUM 85.4%",
    winRateAria: (pct) => `Win rate ${pct} percent`,
    sTitle: "CHSH S VALUE",
    sAria: (s) => `CHSH statistic S = ${s}`,
    sPending: "Play all 4 setting pairs to estimate S",
    sClassicalMark: "CLASSICAL |S| ≤ 2",
    sQuantumMark: "TSIRELSON 2√2",
    violationBadge: "BELL VIOLATION ACHIEVED",
    violationNote:
      "S crossed the classical bound with real sampling statistics. Local realism just failed in your browser — the same result that earned the 2022 Nobel Prize.",
    historyLabel: "LAST ROUNDS",
    historyAria: "History of recent rounds",
    noRoundYet: "No rounds yet — deal the first challenge.",
    footerPre: "This is the ",
    footerAccent: "Phase-2 lab experiment",
    footerPost:
      " — the exact CHSH protocol our students will run on entangled photons and superconducting hardware. In a browser tab you just reproduced the experiment that separates quantum mechanics from every classical theory.",
    roundN: (n) => `Round ${n}`,
    recordsTitle: "HALL OF FAME",
    recordsAria: "Personal bests, stored in this browser",
    recBestS: "BEST S",
    recBestSHint: "locks in after 8+ samples per setting pair",
    recBestWinRate: "BEST WIN RATE",
    recBestStreak: "BEST STREAK",
    recTotalRounds: "LIFETIME ROUNDS",
    recNewBadge: "NEW!",
    recLifetimeNote: "lifetime record — stored in this browser only",
    recNobelBadge: "NOBEL CLUB",
    recNobelNote: "you have violated Bell's inequality here before",
    streakNowLabel: "streak",
    shareBtn: "Share score",
    shareAria: "Share your quantum scoreboard as an image",
    shareHintEmpty: "Play a few rounds first — your records live in this browser.",
    shareToastTitle: "Score card ready ✅",
    shareToastDesc:
      "Your quantum scoreboard left the lab — thanks for spreading entanglement.",
    shareToastFailTitle: "Couldn't share the card",
    shareToastFailDesc:
      "The browser declined image sharing — the PNG was downloaded instead.",
  },
  budget: {
    askEyebrow: "The Ask",
    askChips: ["18 months of runway", "200 careers launched", "1 first-mover lab"],
    askNote: "Less than the cost of one conference booth per year.",
    eyebrow: "SECTION 05 — BUDGET",
    title: "Where Every Dollar Goes",
    subtitle:
      "Drag the slider and watch the lab take shape. Allocation proportions are locked to the audited plan — the ring shows how much of the full lab your investment ignites.",
    donutAria: (pct) =>
      `Donut chart: ${pct} percent of the full $50,000 lab funded`,
    legendAria: (label, pct, amt, desc) =>
      `${label}: ${pct} percent, about ${amt}. ${desc}`,
    perStudent: (amt) => `≈ ${amt} / student`,
    pctOfLab: (pct) => `${pct}% of full lab`,
    sliderLabel: "Tune the investment",
    sliderHint: (step) => `Slide, or use ← / → arrow keys. Step ${step}.`,
    scenariosTitle: "“WHAT IF” SCENARIOS",
    scenariosAria: "Preset funding scenarios",
    scenarioBtn: (k, title) => `${k} · ${title}`,
    outcomeWith: (amount) => `With ${amount}, `,
    outcomeZero:
      "the lab stays in superposition — nothing collapses into reality.",
    outcomeBody: (r) =>
      `we can train ${r.studentsTrained} students, complete ${r.projectsCompleted} research project${r.projectsCompleted === 1 ? "" : "s"}, publish ${r.publications} peer-reviewed paper${r.publications === 1 ? "" : "s"}, and sign ${r.industryPartners} industry partnership${r.industryPartners === 1 ? "" : "s"}.`,
    roiTitle: "RETURN ON INVESTMENT — BY YEAR 3",
    roiLabels: [
      "students trained",
      "research projects",
      "publications",
      "industry partners",
      "hackathons hosted",
    ],
    promise: "the $1 → $100 promise",
    promiseDetail:
      " — every seed dollar compounds into ~$100 of created value by 2036",
    promiseDetail2: " (skills premium + follow-on grants + ecosystem effects)",
    itemizedTitlePre: "Itemized & ",
    itemizedTitleAccent: "Audit-Ready",
    itemizedSub:
      "Quarterly reporting reconciles against this exact table — the full $50,000 allocation.",
    colResource: "Resource",
    colQty: "Qty",
    colCost: "Cost",
    fundCol: "Fund",
    fundAria: (item, cost) => `Fund this item: ${item} — ${cost}`,
    tableCaption:
      "Itemized budget for the full fifty thousand dollar seed request",
    totalSeed: "TOTAL SEED",
    closing:
      "Your seed is not our business model. It is our ignition — and ignitions only fire once.",
  },
  scoreboard: {
    eyebrow: "SECTION 06 — THE SCOREBOARD",
    title: "Year 3, Measured",
    subtitle:
      "We do not ask you to believe a vision. We ask you to hold us to these numbers — they are the acceptance criteria of your investment.",
    tilesAria: "Year 3 target outcomes",
    elsewhereTitle: "WHAT $50K USUALLY BUYS",
    hereTitle: "WHAT $50K BUYS HERE",
    exchangeEyebrow: "The ten-year exchange rate · 2026 → 2036",
    exchangeBodyPre: "Every seed dollar compounds into roughly ",
    exchangeAccent: "one hundred dollars",
    exchangeBodyPost:
      " of created value — skills premium, follow-on grants, and ecosystem effects.",
  },
  team: {
    eyebrow: "SECTION 07 — THE TEAM",
    title: "Entangled Expertise",
    subtitle:
      "15 students, one wavefunction — 13 founding members and 2 open seats, one entangled system of equal co-founders.",
    gridAria: "Team members",
    note: "one entangled system — 13 founding members, 2 open seats waiting to collapse",
  },
  faq: {
    eyebrow: "SECTION 08 — FAQ",
    titlePre: "Measured ",
    titleAccent: "Answers",
    intro:
      "Every funder asks the same eight questions. We'd rather collapse the uncertainty here than in a meeting — read on, then bring the hard ones.",
    guaranteeTag: "<GUARANTEE />",
    guaranteeBody:
      "If any answer above feels hand-wavy, email us and we'll send the spreadsheet behind it — ",
    guaranteeAccent: "quarterly, signed, and open",
    askDirect: "Ask a question directly",
    pdfPre: "Prefer paper? ",
    pdfAccent: "Download the one-page PDF",
    pdfMeta: "A4 · 276KB",
    observed: (n) =>
      `OBSERVED: ${n} QUESTIONS · SUPERPOSITION INTACT: |FAQ⟩ = Σ qᵢ |aᵢ⟩`,
  },
  contact: {
    eyebrow: "SECTION 09 — MAKE CONTACT",
    title: "Collapse the Wavefunction",
    subtitle:
      "Every partnership starts as a signal. Send yours — funding, industry pilots, or one of the two open founding seats.",
    counterScanning: "SIGNAL SCANNING…",
    counter: (n) =>
      `${n} SIGNAL${n === 1 ? "" : "S"} RECEIVED — YOU'D BE MEASUREMENT #${n + 1}`,
    tiersEyebrow: "PICK YOUR ENTANGLEMENT LEVEL",
    tiersAria: "Sponsorship tiers",
    tiers: [
      {
        amount: "$500",
        name: "Qubit Sponsor",
        tagline: "One student's full quantum toolkit for a semester.",
        perks: ["Name on the donor wall", "Quarterly lab digest", "Open hackathon-day invite"],
        featured: false,
      },
      {
        amount: "$5,000",
        name: "Gate Sponsor",
        tagline: "A named scholarship plus a remote lab demo for your team.",
        perks: ["Named student scholarship", "Private remote lab demo", "Co-branded workshop"],
        featured: false,
      },
      {
        amount: "$50,000",
        name: "Founding Partner",
        tagline: "The full lab. Your name on the door — and on the papers.",
        perks: [
          "Founding partner status · lab naming rights",
          "First-look at graduating quantum talent",
          "Seat on the research-roadmap review",
          "Quarterly executive impact report",
        ],
        featured: true,
      },
    ],
    tiersNote: "Every tier includes the quarterly transparency reports. Custom instruments (equipment, endowments) welcome.",
    tiersCta: "Claim this tier",
    tiersFeaturedBadge: "THE ASK",
    qrTitle: "PREFER TO SCAN?",
    qrCaption: "Point your camera — a draft email to the lab opens instantly.",
    shareEyebrow: "AMPLIFY THE SIGNAL",
    shareAria: "Share this proposal",
    shareText:
      "Egypt's first student-led quantum lab — a $50,000 seed ignites a 3-year engine: 200 quantum-fluent graduates, publishable research, one first-mover lab. Play the Bell-test game on the live page:",
    shareBtnNative: "Share",
    shareBtnCopy: "Copy link",
    shareBtnX: "Post",
    shareBtnLinkedIn: "LinkedIn",
    shareBtnWhatsApp: "WhatsApp",
    shareToastCopiedTitle: "Link copied ✅",
    shareToastCopiedDesc: "Send it to a colleague — entangled signals travel further.",
    fundEyebrow: "ROAD TO $50,000",
    fundTitle: "The seed round is open",
    fundSub:
      "One founding partner, or a constellation of smaller sponsors — every qubit counts.",
    fundGoalChip: "SEED ROUND · OPEN",
    fundRaisedLabel: "raised so far",
    fundPctLabel: (pct) => `${pct}% of the full lab`,
    fundEmpty: "Be our first sponsor — the first measurement collapses this state.",
    fundAria: "Seed funding progress — the road to fifty thousand dollars",
    fundMilestones: [
      { at: "$500", label: "first qubit" },
      { at: "$5,000", label: "first gate" },
      { at: "$50,000", label: "full lab" },
    ],
    fundDisclaimer:
      "Only verified money moves the tube — every intent is confirmed by the team before it counts.",
    pledgeEyebrow: "PLEDGE INTENT",
    pledgeIntro:
      "Commit now, settle later. Record an intent — the team confirms it with you personally, then your qubit joins the tube.",
    pledgeName: "Name",
    pledgeNamePh: "Dr. Ahmed Hassan",
    pledgeEmail: "Email",
    pledgeEmailPh: "you@agency.org",
    pledgeAmount: "Amount (USD)",
    pledgeAmountPh: "500",
    pledgeMessage: "Note",
    pledgeMessageOptional: "(optional)",
    pledgeMessagePh: "A word to the lab…",
    pledgeSubmit: "Record Pledge",
    pledgeSubmitting: "Recording…",
    pledgeSuccessTitle: "Pledge Recorded",
    pledgeSuccessBody:
      "Your intent is now in pending superposition. A team member will confirm it with you by email — only then does it move the tube.",
    pledgeAnother: "Record another pledge",
    pledgePendingNote: (n) => {
      if (n === 1) return "1 PLEDGE INTENT AWAITING CONFIRMATION";
      return `${n} PLEDGE INTENTS AWAITING CONFIRMATION`;
    },
    pledgeWallTitle: "ON THE DONOR WALL",
    pledgeTierNames: { qubit: "Qubit", gate: "Gate", founding: "Founding", custom: "Friend" },
    pledgeAria: "Pledge intent form",
    pledgeZodName: "Name must be at least 2 characters",
    pledgeZodEmail: "Please enter a valid email address",
    pledgeZodAmount: "Enter a whole dollar amount between $1 and $50,000",
    pledgeToastTitle: "Pledge recorded ✅",
    pledgeToastDesc: "Your intent is pending confirmation — we'll reach out to verify.",
    pledgeToastErrorTitle: "Decoherence detected",
    tierPledgeCta: "Pledge online",
    name: "Name",
    namePh: "Dr. Ahmed Hassan",
    email: "Email",
    emailPh: "you@agency.org",
    org: "Organization",
    orgOptional: "(optional)",
    orgPh: "ASRT · ITIDA · IBM · …",
    interest: "I'm interested in",
    interestPh: "Choose a channel",
    interestOptions: [
      { value: "funding", label: "Seed Funding ($50K)" },
      { value: "partnership", label: "Industry Partnership" },
      { value: "join", label: "Join the Team (|0⟩ / |1⟩)" },
      { value: "other", label: "Something Else" },
    ],
    message: "Message",
    messagePh: "Tell us how you'd like to entangle with the lab…",
    privacy: "Encrypted in transit · stored in our lab database only",
    responseTime: "avg. response time: 48h",
    submit: "Transmit Signal",
    submitting: "Transmitting…",
    honeypotLabel: "Leave this field empty",
    successTitle: "Signal Received",
    successBody:
      "Your inquiry collapsed into a row in our lab database. A human (a real one, we checked) will reply within 48 hours.",
    successBtn: "Send another signal",
    toastTitle: "Signal received ✅",
    toastDesc:
      "Your measurement collapsed into an email in our inbox — we reply within 48 hours.",
    toastErrorTitle: "Decoherence detected",
    toastErrorDesc: "Please try again in a moment.",
    rateLimited:
      "Too many signals from your node — the channel needs to decohere for a bit. Try again later.",
    zodName: "Name must be at least 2 characters",
    zodEmail: "Please enter a valid email address",
    zodMessage: "Tell us a little more — at least 10 characters",
  },
  newsletter: {
    title: "Stay Entangled",
    subtitle: "One monthly progress signal — no noise, no collapse.",
    emailPh: "your@email.org",
    submit: "Subscribe",
    submitting: "Subscribing…",
    count: (n) =>
      `${n} SUBSCRIBER${n === 1 ? "" : "S"} ON THE LIST`,
    toastTitle: "Qubit registered ✅",
    toastDesc: "You're on the list — the next signal reaches you soon.",
    toastDupTitle: "Already entangled",
    toastDupDesc: "This email is subscribed — your superposition is preserved.",
    toastErrorTitle: "Subscription decohered",
    zodEmail: "Please enter a valid email address",
    honeypotLabel: "Leave this field empty",
  },
  footer: {
    ctaPre: "Join the ",
    ctaAccent: "Quantum Revolution",
    sub: "For three years this lab has existed in superposition — every outcome possible at once. Today, you are the measurement.",
    reviewTerms: "Review the Terms",
    onePager: "One-Page PDF",
    onePagerAria: "Download the one-page proposal PDF (A4)",
    terms: [
      "$50,000 — seed investment",
      "3-year partnership — quarterly transparency reports",
      "Co-branded outcomes — lab naming rights",
      "First-look — at graduating quantum talent",
    ],
    termsAria: "Partnership terms",
    brand: "University Quantum Research Laboratory",
    dept: "Dept. of Physics · Computer Science",
    transparency: ["Quarterly reports", "Open finances", "ASRT · ITIDA aligned"],
    transparencyAria: "Transparency commitments",
    copyright: "© 2026 Quantum Research Lab — Seed Proposal · v1.0",
    madeWith: "Made with ❤️ by the Quantum Research Team — ",
    madeAccent: "Where Students Simulate Reality",
    socialsLabel: "Social media",
    socialAria: (name) => `Quantum Research Lab on ${name}`,
  },
  misc: {
    backToTop: "Back to top",
    heroSectionAria: "Introduction",
    problemAria: "The problem",
    solutionAria: "The solution",
    methodologyAria: "Methodology",
    playgroundAria: "Interactive qubit playground",
    budgetAria: "Budget calculator",
    scoreboardAria: "Year three scoreboard",
    teamAria: "The team",
    faqAria: "Frequently asked questions",
    contactAria: "Contact the lab",
    footerAria: "Contact and partnership",
  },
};

/* ------------------------------------------------------------------ */
/*                              ARABIC                                 */
/* ------------------------------------------------------------------ */

const ar: Copy = {
  meta: { skipToContent: "تخطَّ إلى المحتوى الرئيسي" },
  nav: {
    links: [
      { href: "#problem", label: "المشكلة" },
      { href: "#solution", label: "الحل" },
      { href: "#methodology", label: "خطة العمل" },
      { href: "#budget", label: "الميزانية" },
      { href: "#team", label: "الفريق" },
      { href: "#faq", label: "الأسئلة الشائعة" },
      { href: "#contact", label: "تواصل معنا" },
    ],
    cta: "موّل المستقبل",
    brandTag: "عرض تمويل · 2026",
    downloadPdfAria: "نزّل الملخص التنفيذي بصيغة PDF",
    proposalPdfLabel: "الملخص التنفيذي (PDF)",
    openMenu: "افتح القائمة",
    closeMenu: "أغلق القائمة",
    langToggleAria: "التبديل إلى اللغة الإنجليزية",
  },
  hero: {
    badge: "عرض تمويل تأسيسي · 2026 · بإشراف طلابي وأكاديمي",
    headline: [
      { text: "نبني" },
      { text: "مستقبل", accent: true },
      { text: "مصر" },
      { text: "الكمومي", accent: true },
      { text: "اليوم" },
    ],
    subPre: "مختبر",
    subLab: "لأبحاث الكموم",
    subMid: "يقوده الطلاب ويسعى إلى",
    subPost:
      "من تمويل تأسيسي — حيث يحاكي الطلاب الواقع على عتاد كمومي حقيقي، في أول مختبر من نوعه في المنطقة.",
    ctaExplore: "استكشف العرض",
    ctaTeam: "تعرّف على الفريق",
    badges: [
      "مُقدَّم إلى ASRT · ITIDA",
      "شركاء كموميون عالميون",
      "نسخة المستثمر — 15 دقيقة",
    ],
    scroll: "مرّر",
    scrollAria: "انتقل إلى قسم المشكلة",
    circuitAria:
      "رسم دائرة كمومية: بوابة هادامارد على الكيوبت صفر، وبوابة CNOT تشبّك الكيوبتَين صفر وواحد، وقياس على كليهما",
    circuitCaption: "grover_bell.py · المعالج: ibm_torino · المحاولات: 1024",
  },
  problem: {
    eyebrow: "القسم 01 — المشكلة",
    title: "خط مواهب الكموم يفقد تماسكه",
    subtitle:
      "تتخرج مصر آلاف الطلاب المتميزين في العلوم والهندسة — فتفقد كل من لمس الكم تقريبًا. ليس لنقص الموهبة، بل لنقص المختبر.",
    funnelAria: "قمع المواهب: من الطلاب المسجلين إلى المسيرات التي تبقى في المنطقة",
    punchPre: "نقيس الموهبة. ",
    punchAccent: "ثم نفقدها.",
    decoTerm: "فقدان التماسك (اسم)",
    decoBody:
      "— ما يُدمِّر حالة كمومية قبل أن تُقاس. وهو أيضًا ما يحدث لأفضل طلابنا بين التخرج والفرصة.",
    stat300:
      "نمو في إعلانات الوظائف الكمومية عالميًا — منحنى الطلب شبه عمودي.",
    stat0:
      "مختبر كمومي عملي في الجامعات المصرية. صفر. مقعد الرواد ما يزال شاغرًا.",
    stat2300:
      "حالة يمكن لآلة بـ300 كيوبت تمثيلها — أكثر من عدد الذرات في الكون المرئي. ",
    stat2300Accent: "وطلابنا لم يلمسوا واحدة منها قط.",
  },
  solution: {
    eyebrow: "القسم 02 — الحل",
    title: "مختبر أبحاث الكموم",
    subtitle:
      "مختبر يقوده الطلاب ويشرف عليه أعضاء هيئة التدريس، يُجري فيه الطلاب محاكاة كمومية حقيقية وينشرون أبحاثًا حقيقية — الأول من نوعه في المنطقة.",
    imageAlt:
      "حاسوب كمومي ذهبي بثلاجة التبريد العميق — فئة العتاد التي يصل إليها طلابنا عبر السحابة",
    imageCaption: "الآلات التي نحاكي عليها — عتاد كمومي حقيقي",
    pillarsTitle: "ثلاث ركائز، مختبر واحد",
    pillarsNote: "متشابكة — كل ركيزة تُضاعف الأخريين",
    stackTitlePre: "منصتنا — ",
    stackTitleAccent: "عتاد حقيقي، اليوم",
    stackNote: "كل طبقة تعمل اليوم — بلا رأس مال",
    resultsTitlePre: "نتائج مُقيسة — ",
    resultsTitleAccent: "لا وعود",
  },
  methodology: {
    eyebrow: "القسم 03 — الدائرة",
    title: "دائرة الثلاث سنوات",
    subtitle:
      "مخرجات كل مرحلة هي مدخلات التي تليها — المراحل متشابكة. انقر أي مرحلة لتُسقط الدالة الموجية.",
    phaseAria: (id, name) => `تركيز على المرحلة ${id}: ${name}`,
    phaseBraKet: (id) => `|المرحلة ${id}⟩`,
    exitCriteria: (id) => `معايير إنهاء المرحلة ${id}`,
    activitiesAria: (id) => `أنشطة المرحلة ${id}`,
    quote: "«مخرَج كل مرحلة هو مدخَل التي تليها — المراحل متشابكة»",
  },
  playground: {
    eyebrow: "القسم 04 — جرّب الكم",
    title: "جرّب كيوبيتًا حقيقيًا",
    subtitle:
      "ليست مقطعًا مرئيًا — إنها محاكاة حية تعمل في متصفحك، بالرياضيات نفسها التي يتقنها طلابنا في المرحلة الأولى. ابدأ بكيوبيت واحد، ثم شابك زوجًا، ثم اخترق الحد الكلاسيكي في لعبة CHSH. طبّق البوابات، راقب كرة بلوخ، ثم قِس. أسقِط شيئًا ما.",
    blochAria: "قرص بلوخ يعرض حالة الكيوبيت الحالية",
    phaseLabel: "الطور النسبي φ",
    stateLabel: "متجه الحالة",
    prob0Label: "احتمال قياس 0",
    prob1Label: "احتمال قياس 1",
    gatesTitle: "رف البوابات",
    gatesHint: "انقر بوابة لتطبيقها — مرّر المؤشر لتفهم أثرها.",
    circuitTitle: "سلك الدائرة",
    emptyCircuit: "─ السلك خالٍ · طبّق بوابة ─",
    presetsTitle: "حالات شهيرة",
    presetAria: (label) => `تحميل الحالة ${label}`,
    gateAria: (name) => `تطبيق بوابة ${name}`,
    undo: "تراجع",
    reset: "إعادة",
    measure: "قِس مرة",
    shots: "100 قياس",
    controlsAria: "أدوات التحكم بالكيوبيت",
    resultAria: "نتائج القياس",
    collapsedTo: (o) => `النتيجة |${o}⟩ — انسحب التراكب. «تراجع» يعيد الحالة.`,
    shotsSummary: (zeros, ones) => `${zeros} مرة |0⟩ · ${ones} مرة |1⟩ — من أصل 100 قياس`,
    histogramNote: "أخذ عينات غير مُدمِّر: حالتك تنجو من الإحصاء.",
    pedagogyPre: "هذه ",
    pedagogyAccent: "محرك تدريب المرحلة الأولى",
    pedagogyPost:
      " — نفس الجبر الخطي في Statevector من Qiskit، مضغوط في تبويب متصفح. موّل المختبر ليشغّلها 200 طالب على عتاد IBM Quantum الحقيقي.",
    modeAria: "وضع المحاكاة",
    modeSingle: "كيوبيت واحد",
    modeEntangled: "زوج متشابك",
  },
  twoQubit: {
    spheresTitle: "الحالات المختزلة",
    wireHint: "كل كرة تُظهر كيوبتًا واحدًا وحده — بعد استبعاد شريكه.",
    qubitLabel: (n) => `q${n} · ${n === 0 ? "السلك العلوي" : "السلك السفلي"}`,
    jointTitle: "الاحتمالات المشتركة",
    endianNote:
      "ترتيب البتات يتبع اصطلاح Qiskit الشطر الأصغر: |q₁ q₀⟩ — السلك العلوي هو الرقم الأيمن.",
    meterLabel: "التشابك",
    meterLeft: "منفصلان",
    meterRight: "أقصى تشابك",
    meterAria: (c) => `مقياس التشابك عند ${(c * 100).toFixed(0)} بالمئة من الحد الأقصى`,
    bellBadge: "زوج بِل تحقق!",
    bellNote:
      "كل كيوبت وحده صار ضجيجًا خالصًا — انكمشت المتجهات إلى المركز. كل المعلومات تسكن الارتباط المشترك. هذا هو التشابك.",
    gates2Title: "رف بوابات الكيوبتين",
    gates2Hint: "H و X يعملان على سلك واحد — ⊕ (CNOT) يُشابك الزوج.",
    opAria: (name) => `تطبيق ${name}`,
    blurbH: (n) =>
      `هادامارد على الكيوبيت ${n} — يضع ذلك السلك وحده في تراكب. يبقى الزوج منفصلًا… حتى يأتي CNOT.`,
    blurbX: (n) => `باولي-X على الكيوبيت ${n} — يقلب |0⟩↔|1⟩ في ذلك السلك.`,
    blurbCnot: (ctrl, tgt) =>
      `CNOT — إذا قرأ الكيوبيت ${ctrl} القيمة 1، يقلب الكيوبيت ${tgt}. بوابة التشابك الأولى: نقلة واحدة مُتحكَّم بها تحول حالات الضرب إلى حالات بِل.`,
    circuit2Title: "دائرة التشابك",
    emptyCircuit2: "─ المساران خاليان · طبّق بوابة ─",
    presets2Title: "أزواج شهيرة",
    preset2Aria: (label) => `تحميل الحالة ثنائية الكيوبيت ${label}`,
    recipeLabel: "وصفة بِل",
    recipe: "H على q0 ← CNOT 0→1 ← Φ⁺",
    collapsedTo2: (o) =>
      `النتيجة ${o} — انسحب الكيوبيتان معًا. «تراجع» يعيد التشابك.`,
    shotsSummary2: (summary) => `${summary} — من أصل 100 قياس`,
    pedagogy2Pre: "هذا ",
    pedagogy2Accent: "مكتب أبحاث المرحلة الثانية",
    pedagogy2Post:
      " — حالات بِل تشغّل النقل الكمومي وإثباتات أمان QKD وتجارب CHSH التي سيجريها طلابنا على عتاد حقيقي. لقد بنتَ واحدةً للتو في تبويب متصفح.",
    reducedAria: (n) => `قرص بلوخ للحالة المختزلة للكيوبيت ${n}`,
  },
  chsh: {
    title: "لعبة CHSH",
    subtitle:
      "أليس وبوب يتشاركان زوجًا متشابكًا واحدًا ولا يجوز أن يتبادلا أي رسالة. يمنح الحَكَم أليس البت x وبوب البت y — ولا يُحسم الجولة لصالحهما إلا إذا تحقق a ⊕ b = x·y. الاستراتيجية الكلاسيكية سقفها 75%. التشابك يتجاوز هذا السقف. أثبت ذلك بنفسك.",
    dealBtn: "اسحب التحدي",
    measureBtn: "قِس الطرفين",
    nextBtn: "الجولة التالية",
    resetBtn: "تصفير الإحصاءات",
    resetAria: "تصفير جميع إحصاءات CHSH",
    coachLabel: "المدرب",
    coachHintOn: "المدرب مفعّل — الأساس الرابح يتوهج في كل جولة.",
    coachHintOff: "المدرب معطّل — أنت وحدك الآن أيها الباحث.",
    coachPick: "اختيار المدرب",
    sharedTitle: "زوج مشترك Φ⁺",
    sharedNote: "زوج بِل واحد لكل جولة — بلا اتصال بين الطرفين",
    aliceStation: "محطة أليس",
    bobStation: "محطة بوب",
    questionAlice: (x) =>
      x === 0
        ? "يسأل الحَكَم أليس: x = 0 — قيسي على المحور الذي تريدينه."
        : "يسأل الحَكَم أليس: x = 1 — قيسي على المحور الذي تريدينه.",
    questionBob: (y) =>
      y === 0
        ? "يسأل الحَكَم بوب: y = 0 — قِس على المحور الذي تريده."
        : "يسأل الحَكَم بوب: y = 1 — قِس على المحور الذي تريده.",
    targetSame: "x·y = 0 ← يجب أن تتطابق البتان",
    targetDiff: "x·y = 1 ← يجب أن تختلفا البتان",
    basisA0: "0° · Z",
    basisA1: "45° · X",
    basisB0: "‎+22.5°",
    basisB1: "‎−22.5°",
    basisBlurbA0:
      "القياس على محور Z — السؤال المعتاد |0⟩/|1⟩. الأمثل عندما x = 0.",
    basisBlurbA1:
      "دوران 45° باتجاه X — في منتصف الطريق بين القطبين. الأمثل عندما x = 1.",
    basisBlurbB0:
      "دوران ‎+22.5° باتجاه X — نصف الزاوية الشهير. الأمثل عندما y = 0.",
    basisBlurbB1:
      "دوران ‎−22.5° في الاتجاه المعاكس — الإعداد التوأم. الأمثل عندما y = 1.",
    stationAria: (who) => `${who}: اختر أساس القياس`,
    winBanner: "جولة رابحة",
    lossBanner: "جولة خاسرة",
    winDetail: (a, b, target) =>
      `a ⊕ b = ${a ^ b} · x·y = ${target} — الارتباط صامد${target === 0 ? "ت" : " (تعاكس تام)"}.`,
    statsTitle: "لوحة النتائج",
    roundsLabel: "الجولات",
    winsLabel: "الانتصارات",
    winRateLabel: "نسبة الفوز",
    classicalMark: "كلاسيكي 75%",
    quantumMark: "كمومي 85.4%",
    winRateAria: (pct) => `نسبة الفوز ${pct} بالمئة`,
    sTitle: "قيمة CHSH",
    sAria: (s) => `إحصائية CHSH تساوي ${s}`,
    sPending: "العب الأزواج الأربعة كلها لتقدير S",
    sClassicalMark: "كلاسيكي |S| ≤ 2",
    sQuantumMark: "تسيرلسون 2√2",
    violationBadge: "كسرُ متباينة بِل تحقق!",
    violationNote:
      "تجاوز S الحد الكلاسيكي بإحصاءات قياس حقيقية. انهار الواقع المحلي للتو في متصفحك — النتيجة ذاتها التي نالت جائزة نوبل لعام 2022.",
    historyLabel: "آخر الجولات",
    historyAria: "سجل الجولات الأخيرة",
    noRoundYet: "لا جولات بعد — اسحب التحدي الأول.",
    footerPre: "هذه ",
    footerAccent: "تجربة المرحلة الثانية في مختبرنا",
    footerPost:
      " — بروتوكول CHSH نفسه الذي سيجريه طلابنا على الفوتونات المتشابكة والعتاد فائق التوصيل. في تبويب متصفح كنت تعيد للتو التجربة التي تفصل ميكانيكا الكم عن كل نظرية كلاسيكية.",
    roundN: (n) => `الجولة ${n}`,
    recordsTitle: "قاعة الأرقام القياسية",
    recordsAria: "أرقامك القياسية الشخصية، محفوظة في هذا المتصفح",
    recBestS: "أعلى S",
    recBestSHint: "يُثبَّت بعد 8 عينات فأكثر لكل زوج إعدادات",
    recBestWinRate: "أفضل نسبة فوز",
    recBestStreak: "أطول سلسلة انتصارات",
    recTotalRounds: "إجمالي الجولات",
    recNewBadge: "رقم قياسي!",
    recLifetimeNote: "سجل مدى الحياة — محفوظ في هذا المتصفح فقط",
    recNobelBadge: "نادي نوبل",
    recNobelNote: "لقد كسرتَ متباينة بِل هنا من قبل",
    streakNowLabel: "السلسلة الحالية",
    shareBtn: "شارك النتيجة",
    shareAria: "شارك لوحة نتائجك الكمومية كصورة",
    shareHintEmpty: "العب بعض الجولات أولًا — أرقامك القياسية محفوظة في هذا المتصفح.",
    shareToastTitle: "بطاقة النتيجة جاهزة ✅",
    shareToastDesc:
      "لوحة نتائجك الكمومية غادرت المختبر — شكرًا لنشر التشابك.",
    shareToastFailTitle: "تعذّرت مشاركة البطاقة",
    shareToastFailDesc:
      "رفض المتصفح مشاركة الصور — نزّلنا ملف PNG بدلًا من ذلك.",
  },
  budget: {
    askEyebrow: "المطلوب",
    askChips: ["18 شهرًا من الاستمرارية", "200 مسيرة مهنية", "مختبر رائد واحد"],
    askNote: "أقل من كلفة جناح مؤتمر واحد في السنة.",
    eyebrow: "القسم 05 — الميزانية",
    title: "إلى أين يذهب كل دولار",
    subtitle:
      "اسحب المنزلق وشاهد المختبر يتشكّل. نسب التوزيع مثبتة وفق الخطة المدقَّقة — الحلقة تُظهر أي جزء من المختبر الكامل يُشعله استثمارك.",
    donutAria: (pct) =>
      `رسم دائري: تمويل ${pct} بالمئة من مختبر الـ50,000 دولار الكامل`,
    legendAria: (label, pct, amt, desc) =>
      `${label}: ${pct} بالمئة، نحو ${amt}. ${desc}`,
    perStudent: (amt) => `≈ ${amt} / للطالب`,
    pctOfLab: (pct) => `${pct}% من المختبر الكامل`,
    sliderLabel: "اضبط حجم الاستثمار",
    sliderHint: (step) => `اسحب أو استخدم أسهم لوحة المفاتيح. الخطوة ${step}.`,
    scenariosTitle: "سيناريوهات «ماذا لو؟»",
    scenariosAria: "سيناريوهات تمويل جاهزة",
    scenarioBtn: (k, title) => `${k} · ${title}`,
    outcomeWith: (amount) => `بمبلغ ${amount}، `,
    outcomeZero:
      "يبقى المختبر في حالة تراكب — لا شيء ينهار إلى واقع.",
    // Arabic numeral agreement: 3–10 take the plural (عدد مذكر), the rest
    // take the singular accusative (تمييز منصوب) — e.g. 40 طالبًا / 5 أوراق.
    outcomeBody: (r) => {
      const count = (n: number, one: string, many: string) =>
        n >= 3 && n <= 10 ? `${n} ${many}` : `${n} ${one}`;
      return `يمكننا تدريب ${count(r.studentsTrained, "طالبًا", "طلاب")}، وإنجاز ${count(r.projectsCompleted, "مشروعًا بحثيًا", "مشاريع بحثية")}، ونشر ${count(r.publications, "ورقة محكَّمة", "أوراق محكَّمة")}، وتوقيع ${count(r.industryPartners, "شراكة صناعية", "شراكات صناعية")}.`;
    },
    roiTitle: "العائد على الاستثمار — بحلول السنة الثالثة",
    roiLabels: [
      "طلاب مدرَّبون",
      "مشاريع بحثية",
      "أوراق منشورة",
      "شركاء صناعيون",
      "هاكاثونات منظَّمة",
    ],
    promise: "وعد $1 → $100",
    promiseDetail: " — كل دولار تأسيسي يتراكم ليصبح نحو 100$ من القيمة المُنشأة بحلول 2036",
    promiseDetail2: " (علاوة المهارات + المنح اللاحقة + آثار المنظومة)",
    itemizedTitlePre: "تفصيل ",
    itemizedTitleAccent: "جاهز للتدقيق",
    itemizedSub:
      "تُطابَق التقارير الفصلية مع هذا الجدول بالضبط — توزيع الـ50,000 دولار كاملة.",
    colResource: "البند",
    colQty: "الكمية",
    colCost: "التكلفة",
    fundCol: "تمويل",
    fundAria: (item, cost) => `موّل هذا البند: ${item} — ${cost}`,
    tableCaption: "الميزانية التفصيلية لطلب التمويل التأسيسي الكامل (خمسون ألف دولار)",
    totalSeed: "إجمالي التمويل",
    closing:
      "تمويلك ليس نموذج أعمالنا؛ إنه شرارتنا — والشرارات تشتعل مرة واحدة فقط.",
  },
  scoreboard: {
    eyebrow: "القسم 06 — لوحة النتائج",
    title: "السنة الثالثة، بالأرقام",
    subtitle:
      "لا نطلب منك تصديق رؤية؛ نطلب أن تحاسبنا على هذه الأرقام — فهي معايير قبول استثمارك.",
    tilesAria: "مخرجات مستهدفة بحلول السنة الثالثة",
    elsewhereTitle: "ماذا تشتري 50 ألف دولار عادةً؟",
    hereTitle: "ماذا تشتري 50 ألف دولار هنا؟",
    exchangeEyebrow: "سعر الصرف لعشر سنوات · 2026 → 2036",
    exchangeBodyPre: "كل دولار تأسيسي يتراكم ليصبح نحو ",
    exchangeAccent: "مئة دولار",
    exchangeBodyPost:
      " من القيمة المُنشأة — علاوة المهارات، والمنح اللاحقة، وآثار المنظومة.",
  },
  team: {
    eyebrow: "القسم 07 — الفريق",
    title: "خبرات متشابكة",
    subtitle:
      "15 طالبًا في دالة موجية واحدة — 13 عضوًا مؤسِّسًا ومقعدان شاغران، منظومة متشابكة واحدة من مؤسسين متكافئين.",
    gridAria: "أعضاء الفريق",
    note: "منظومة متشابكة واحدة — 13 عضوًا مؤسِّسًا ومقعدان شاغران بانتظار الانهيار",
  },
  faq: {
    eyebrow: "القسم 08 — الأسئلة الشائعة",
    titlePre: "إجابات ",
    titleAccent: "مُقيسة",
    intro:
      "كل مموّل يسأل الأسئلة الثمانية نفسها. نفضّل إنهاء حالة عدم اليقين هنا بدلًا من الاجتماع — اقرأ، ثم أحضر الأسئلة الأصعب.",
    guaranteeTag: "<GUARANTEE />",
    guaranteeBody:
      "إذا بدا أي سؤال أعلاه عامًا، راسلنا وسنرسل لك جدول البيانات وراءه — ",
    guaranteeAccent: "فصليًا، موقَّعًا، ومفتوحًا",
    askDirect: "اسأل سؤالًا مباشرة",
    pdfPre: "تفضّل الورق؟ ",
    pdfAccent: "نزّل الملخص من صفحة واحدة",
    pdfMeta: "A4 · 681KB",
    observed: (n) =>
      `تمت الملاحظة: ${n} أسئلة · التراكب سليم: |FAQ⟩ = Σ qᵢ |aᵢ⟩`,
  },
  contact: {
    eyebrow: "القسم 09 — تواصل معنا",
    title: "أَسقِط الدالة الموجية",
    subtitle:
      "كل شراكة تبدأ كإشارة. أرسل إشارتك — تمويلًا أو تجارب صناعية أو أحد المقعدَين المؤسِّسيَّن الشاغرَين.",
    counterScanning: "جارٍ مسح الإشارات…",
    counter: (n) => {
      if (n === 0) return "ستكون القياس رقم 1";
      if (n === 1) return "إشارة واحدة مستلمة — ستكون القياس رقم 2";
      if (n === 2) return "إشارتان مستلمتان — ستكون القياس رقم 3";
      const unit = n <= 10 ? "إشارات" : "إشارة";
      return `${n} ${unit} مستلمة — ستكون القياس رقم ${n + 1}`;
    },
    name: "الاسم",
    namePh: "د. أحمد حسن",
    email: "البريد الإلكتروني",
    emailPh: "you@agency.org",
    org: "الجهة",
    orgOptional: "(اختياري)",
    orgPh: "ASRT · ITIDA · IBM · …",
    interest: "أهتم بـ",
    interestPh: "اختر القناة",
    interestOptions: [
      { value: "funding", label: "تمويل تأسيسي (50 ألف دولار)" },
      { value: "partnership", label: "شراكة صناعية" },
      { value: "join", label: "الانضمام للفريق (|0⟩ / |1⟩)" },
      { value: "other", label: "شيء آخر" },
    ],
    tiersEyebrow: "اختر مستوى تشابكك",
    tiersAria: "مستويات الرعاية",
    tiers: [
      {
        amount: "500$",
        name: "راعي الكيوبت",
        tagline: "عدة كمومية كاملة لطالب واحد لفصل دراسي.",
        perks: ["اسمك على جدار الداعمين", "ملخص فصلي عن المختبر", "دعوة إلى يوم الهاكاثون المفتوح"],
        featured: false,
      },
      {
        amount: "5,000$",
        name: "راعي البوابة",
        tagline: "منحة باسمك مع عرض حيّ للمختبر لفريقك عن بُعد.",
        perks: ["منحة للطلاب باسم جهتك", "عرض خاص للمختبر عن بُعد", "ورشة عمل بعلامة مشتركة"],
        featured: false,
      },
      {
        amount: "50,000$",
        name: "الشريك المؤسِّس",
        tagline: "المختبر كاملًا. اسمك على الباب — وعلى الأوراق البحثية.",
        perks: [
          "صفة الشريك المؤسِّس · حقوق تسمية المختبر",
          "أولوية الاطلاع على الخريجين الكموميين",
          "مقعد في مراجعة خارطة البحث",
          "تقرير أثر تنفيذي فصلي",
        ],
        featured: true,
      },
    ],
    tiersNote: "كل المستويات تشمل تقارير الشفافية الفصلية. نرحّب بالعتاد والوقفيات المخصصة.",
    tiersCta: "احجز هذا المستوى",
    tiersFeaturedBadge: "المطلوب",
    qrTitle: "تفضّل المسح؟",
    qrCaption: "وجّه كاميرتك — يُفتح مسودة بريد إلى المختبر فورًا.",
    shareEyebrow: "ضخّم الإشارة",
    shareAria: "شارك هذا العرض",
    shareText:
      "أول مختبر كمومي بقيادة طلابية في مصر — بذرة 50,000 دولار تشعل محركًا لثلاث سنوات: 200 خريج طلاقًا كموميًا، وبحث قابل للنشر، وأول مختبر رائد في المنطقة. جرّب لعبة اختبار بِل على الصفحة:",
    shareBtnNative: "مشاركة",
    shareBtnCopy: "انسخ الرابط",
    shareBtnX: "منشور",
    shareBtnLinkedIn: "لينكدإن",
    shareBtnWhatsApp: "واتساب",
    shareToastCopiedTitle: "تم نسخ الرابط ✅",
    shareToastCopiedDesc: "أرسله إلى زميلٍ — الإشارات المتشابكة تصل أبعد.",
    fundEyebrow: "الطريق إلى 50,000 دولار",
    fundTitle: "جولة التمويل التأسيسي مفتوحة",
    fundSub:
      "شريك مؤسِّس واحد، أو كوكبة من الرعاة الأصغر — كل كيوبت يصنع فرقًا.",
    fundGoalChip: "جولة التمويل · مفتوحة",
    fundRaisedLabel: "تم جمعه حتى الآن",
    fundPctLabel: (pct) => `${pct}% من المختبر الكامل`,
    fundEmpty: "كن أول راعينا — القياس الأول يُسقط حالة التراكب.",
    fundAria: "تقدّم تمويل التأسيس — الطريق إلى خمسين ألف دولار",
    fundMilestones: [
      { at: "500$", label: "أول كيوبت" },
      { at: "5,000$", label: "أول بوابة" },
      { at: "50,000$", label: "المختبر الكامل" },
    ],
    fundDisclaimer:
      "لا تُحرِّك الأنبوب إلا الأموال المتحقَّق منها — كل نيّة يؤكّدها الفريق قبل أن تُحتسب.",
    pledgeEyebrow: "تسجيل نية تعهُّد",
    pledgeIntro:
      "تعهَّد الآن ويسُدَّ لاحقًا. سجّل نيّتك — يؤكّدها الفريق معك شخصيًا، فيلتحق كيوبتك بالأنبوب.",
    pledgeName: "الاسم",
    pledgeNamePh: "د. أحمد حسن",
    pledgeEmail: "البريد الإلكتروني",
    pledgeEmailPh: "you@agency.org",
    pledgeAmount: "المبلغ (دولار)",
    pledgeAmountPh: "500",
    pledgeMessage: "ملاحظة",
    pledgeMessageOptional: "(اختياري)",
    pledgeMessagePh: "كلمة إلى المختبر…",
    pledgeSubmit: "سجّل التعهُّد",
    pledgeSubmitting: "جارٍ التسجيل…",
    pledgeSuccessTitle: "تم تسجيل التعهُّد",
    pledgeSuccessBody:
      "نيّتك الآن في تراكب مؤجَّل. سيتواصل معك أحد أعضاء الفريق عبر البريد للتأكيد — عندها فقط تُحرِّك الأنبوب.",
    pledgeAnother: "سجّل تعهُّدًا آخر",
    pledgePendingNote: (n) => {
      if (n === 1) return "نية تعهُّد واحدة بانتظار التأكيد";
      if (n === 2) return "نيتا تعهُّد بانتظار التأكيد";
      if (n <= 10) return `${n} نيّات تعهُّد بانتظار التأكيد`;
      return `${n} نيّة تعهُّد بانتظار التأكيد`;
    },
    pledgeWallTitle: "على جدار الداعمين",
    pledgeTierNames: { qubit: "كيوبت", gate: "بوابة", founding: "مؤسِّس", custom: "صديق" },
    pledgeAria: "نموذج نية التعهُّد",
    pledgeZodName: "الاسم قصير جدًا — حرفان على الأقل",
    pledgeZodEmail: "أدخل بريدًا إلكترونيًا صحيحًا",
    pledgeZodAmount: "أدخل مبلغًا صحيحًا بين 1 و50,000 دولار",
    pledgeToastTitle: "تم تسجيل التعهُّد ✅",
    pledgeToastDesc: "نيّتك بانتظار التأكيد — سنتواصل معك للتحقق.",
    pledgeToastErrorTitle: "رصدنا فقدان تماسك",
    tierPledgeCta: "تعهَّد عبر الموقع",
    message: "الرسالة",
    messagePh: "أخبرنا كيف تودّ التشابك مع المختبر…",
    privacy: "مشفَّرة أثناء النقل · تُخزَّن في قاعدة بيانات مختبرنا فقط",
    responseTime: "متوسط زمن الرد: 48 ساعة",
    submit: "أرسل الإشارة",
    submitting: "جارٍ الإرسال…",
    honeypotLabel: "اترك هذا الحقل فارغًا",
    successTitle: "وصلت الإشارة",
    successBody:
      "انهار استفسارك في صفّ بقاعدة بيانات مختبرنا. سيردّ عليك إنسان (حقيقي، تحققنا) خلال 48 ساعة.",
    successBtn: "أرسل إشارة أخرى",
    toastTitle: "وصلت الإشارة ✅",
    toastDesc: "تحوّلت رسالتك إلى بريد في صندوقنا — نرد خلال 48 ساعة.",
    toastErrorTitle: "رصدنا فقدان تماسك",
    toastErrorDesc: "حاول مرة أخرى بعد لحظات.",
    rateLimited:
      "إشارات كثيرة من جهازك — تحتاج القناة إلى بعض الهدوء. حاول مجددًا لاحقًا.",
    zodName: "الاسم قصير جدًا — حرفان على الأقل",
    zodEmail: "أدخل بريدًا إلكترونيًا صحيحًا",
    zodMessage: "أخبرنا المزيد — 10 أحرف على الأقل",
  },
  newsletter: {
    title: "ابقَ متشابكًا",
    subtitle: "إشارة تقدُّم واحدة شهريًا — لا ضجيج، لا انهيار.",
    emailPh: "your@email.org",
    submit: "اشترك",
    submitting: "جارٍ الاشتراك…",
    count: (n) => {
      if (n === 0) return "كن أول من يشترك";
      if (n === 1) return "مشترك واحد على القائمة";
      if (n === 2) return "مشتركان على القائمة";
      const unit = n <= 10 ? "مشتركين" : "مشتركًا";
      return `${n} ${unit} على القائمة`;
    },
    toastTitle: "تم تثبيت كيوبتك ✅",
    toastDesc: "أنت على القائمة — الإشارة القادمة تصلك قريبًا.",
    toastDupTitle: "أنت متشابك أصلًا",
    toastDupDesc: "هذا البريد مشترك من قبل — التراكب محفوظ.",
    toastErrorTitle: "تعذّر الاشتراك",
    zodEmail: "أدخل بريدًا إلكترونيًا صحيحًا",
    honeypotLabel: "اترك هذا الحقل فارغًا",
  },
  footer: {
    ctaPre: "انضم إلى ",
    ctaAccent: "الثورة الكمومية",
    sub: "منذ ثلاث سنوات وهذا المختبر موجود في حالة تراكب — كل النتائج ممكنة في آن واحد. اليوم، أنت القياس.",
    reviewTerms: "استعرض الشروط",
    onePager: "ملخص PDF",
    onePagerAria: "نزّل الملخص التنفيذي من صفحة واحدة (A4)",
    terms: [
      "50,000 دولار — استثمار تأسيسي",
      "شراكة 3 سنوات — تقارير شفافية فصلية",
      "مخرجات بعلامة مشتركة — حقوق تسمية المختبر",
      "أولوية الاطلاع — على الخريجين الكموميين",
    ],
    termsAria: "شروط الشراكة",
    brand: "مختبر الجامعة لأبحاث الكموم",
    dept: "قسم الفيزياء · علوم الحاسب",
    transparency: ["تقارير فصلية", "مالية مفتوحة", "متوافق مع ASRT · ITIDA"],
    transparencyAria: "التزامات الشفافية",
    copyright: "© 2026 مختبر أبحاث الكموم — عرض تأسيسي · v1.0",
    madeWith: "صُنع بـ ❤️ من فريق أبحاث الكم — ",
    madeAccent: "حيث يحاكي الطلاب الواقع",
    socialsLabel: "حسابات التواصل",
    socialAria: (name) => `مختبر أبحاث الكموم على ${name}`,
  },
  misc: {
    backToTop: "العودة إلى الأعلى",
    heroSectionAria: "مقدمة",
    problemAria: "المشكلة",
    solutionAria: "الحل",
    methodologyAria: "خطة العمل",
    playgroundAria: "ملعب الكيوبيت التفاعلي",
    budgetAria: "حاسبة الميزانية",
    scoreboardAria: "لوحة نتائج السنة الثالثة",
    teamAria: "الفريق",
    faqAria: "الأسئلة الشائعة",
    contactAria: "تواصل مع المختبر",
    footerAria: "التواصل والشراكة",
  },
};

/** The two amplitudes. Pick one per render via useLang().t */
export const COPY: Record<Lang, Copy> = { en, ar };
