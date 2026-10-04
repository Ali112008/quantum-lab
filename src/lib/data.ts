/**
 * Single source of truth for the landing page content.
 * Numbers are taken from the official seed pitch deck (2026)
 * and the grant proposal guide — keep them consistent with reporting.
 *
 * Every user-facing string is an `L10n` pair (EN + AR) that collapses via
 * the language context. Team member NAMES stay in Latin script — they are
 * proper nouns from the founding roster, rendered identically in |EN⟩ and |AR⟩.
 */

import { l, type L10n } from "@/lib/i18n";

/* ------------------------------- Team -------------------------------- */

export type TeamGroup = "leads" | "research" | "tech" | "ops" | "media" | "open";

export interface TeamMember {
  name: string;
  role: L10n;
  year: L10n;
  skills: L10n[];
  /** tailwind gradient classes for the avatar halo */
  gradient: string;
  /** filter group shown in the team section */
  group: TeamGroup;
  /** open founding seat rendered with dashed border */
  open?: boolean;
}

const OPEN_SEAT_YEAR = l("Could be you — apply now", "قد تكون أنت — قدّم الآن");
const OPEN_SEAT_SKILL = l("Apply via email", "قدِّم عبر البريد");

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Ali Mahmoud Ali",
    role: l("Project Lead", "قائد المشروع"),
    year: l("4th Year · Computer Science", "السنة الرابعة · علوم الحاسب"),
    skills: [l("Leadership", "القيادة"), l("Quantum Algorithms", "خوارزميات كمومية"), l("Strategy", "استراتيجية")],
    gradient: "from-quantum-blue/80 to-quantum-blue/20",
    group: "leads",
  },
  {
    name: "Mohamed Raafat Mohamed",
    role: l("Technical Lead", "قائد تقني"),
    year: l("3rd Year · Physics", "السنة الثالثة · فيزياء"),
    skills: [l("Qiskit", "Qiskit"), l("Python", "Python"), l("Circuit Design", "تصميم دوائر")],
    gradient: "from-quantum-purple/80 to-quantum-purple/20",
    group: "tech",
  },
  {
    name: "Elsayed Ramdan Labib",
    role: l("Research Lead", "قائد البحث"),
    year: l("4th Year · Physics", "السنة الرابعة · فيزياء"),
    skills: [l("Quantum Theory", "نظرية كمومية"), l("VQE", "VQE"), l("Scientific Writing", "كتابة علمية")],
    gradient: "from-quantum-green/80 to-quantum-green/20",
    group: "research",
  },
  {
    name: "Basmalla Ahmed Awad",
    role: l("Education Lead", "قائدة التعليم"),
    year: l("3rd Year · Computer Science", "السنة الثالثة · علوم الحاسب"),
    skills: [l("Curriculum Design", "تصميم منهج"), l("Qiskit", "Qiskit"), l("Teaching", "تدريس")],
    gradient: "from-quantum-amber/80 to-quantum-amber/20",
    group: "ops",
  },
  {
    name: "Nada Ehab Ahmed",
    role: l("Partnerships Lead", "قائدة الشراكات"),
    year: l("4th Year · Communications Eng.", "السنة الرابعة · هندسة اتصالات"),
    skills: [l("Industry Liaison", "تواصل صناعي"), l("Public Speaking", "إلقاء أمام جمهور")],
    gradient: "from-quantum-blue/80 to-quantum-purple/30",
    group: "ops",
  },
  {
    name: "Youssef Mohammed Eldabaa",
    role: l("Quantum Algorithms", "خوارزميات كمومية"),
    year: l("3rd Year · Mathematics", "السنة الثالثة · رياضيات"),
    skills: [l("QAOA", "QAOA"), l("Linear Algebra", "جبر خطي"), l("Python", "Python")],
    gradient: "from-quantum-purple/80 to-quantum-blue/30",
    group: "research",
  },
  {
    name: "Salma Mohamed Ghoniem",
    role: l("Simulation Engineer", "مهندسة محاكاة"),
    year: l("3rd Year · Physics", "السنة الثالثة · فيزياء"),
    skills: [l("Aer Simulator", "محاكي Aer"), l("NumPy", "NumPy"), l("HPC", "حوسبة عالية الأداء")],
    gradient: "from-quantum-green/80 to-quantum-blue/30",
    group: "tech",
  },
  {
    name: "Sara Emad Hassan",
    role: l("Outreach & Media", "تواصل وإعلام"),
    year: l("2nd Year · Computer Science", "السنة الثانية · علوم الحاسب"),
    skills: [l("Content Creation", "صناعة محتوى"), l("Community", "بناء مجتمع")],
    gradient: "from-quantum-amber/80 to-quantum-red/30",
    group: "media",
  },
  {
    name: "Shahenda Ahmed Khalil",
    role: l("Operations Manager", "مديرة عمليات"),
    year: l("4th Year · Physics", "السنة الرابعة · فيزياء"),
    skills: [l("Logistics", "لوجستيات"), l("Scheduling", "جدولة"), l("Reporting", "تقارير")],
    gradient: "from-quantum-blue/80 to-quantum-green/30",
    group: "ops",
  },
  {
    name: "Menna Osama Mohammed",
    role: l("Documentation Lead", "قائدة التوثيق"),
    year: l("3rd Year · Computer Science", "السنة الثالثة · علوم الحاسب"),
    skills: [l("Technical Writing", "كتابة تقنية"), l("Git", "Git"), l("Docs", "توثيق")],
    gradient: "from-quantum-purple/80 to-quantum-green/30",
    group: "ops",
  },
  {
    name: "Mohamed Tamer Ismail",
    role: l("Hardware & Cloud", "عتاد وسحابة"),
    year: l("4th Year · Computer Engineering", "السنة الرابعة · هندسة حاسبات"),
    skills: [l("AWS Braket", "AWS Braket"), l("IBM Quantum", "IBM Quantum"), l("Linux", "Linux")],
    gradient: "from-quantum-green/80 to-quantum-purple/30",
    group: "tech",
  },
  {
    name: "Malak Asaad Ismail",
    role: l("Design Lead", "قائدة التصميم"),
    year: l("2nd Year · Information Systems", "السنة الثانية · نظم معلومات"),
    skills: [l("UI/UX", "UI/UX"), l("Figma", "Figma"), l("Branding", "هوية بصرية")],
    gradient: "from-quantum-amber/80 to-quantum-purple/30",
    group: "media",
  },
  {
    name: "Somaia Adel Mohamed",
    role: l("Events & Workshops", "فعاليات وورش"),
    year: l("3rd Year · Physics", "السنة الثالثة · فيزياء"),
    skills: [l("Event Planning", "تخطيط فعاليات"), l("Hackathons", "هاكاثونات"), l("Qiskit", "Qiskit")],
    gradient: "from-quantum-red/80 to-quantum-blue/30",
    group: "ops",
  },
  {
    name: "|0⟩",
    role: l("Open Founding Seat", "مقعد مؤسِّس شاغر"),
    year: OPEN_SEAT_YEAR,
    skills: [OPEN_SEAT_SKILL],
    gradient: "from-quantum-subtle/60 to-quantum-subtle/10",
    group: "open",
    open: true,
  },
  {
    name: "|1⟩",
    role: l("Open Founding Seat", "مقعد مؤسِّس شاغر"),
    year: OPEN_SEAT_YEAR,
    skills: [OPEN_SEAT_SKILL],
    gradient: "from-quantum-subtle/60 to-quantum-subtle/10",
    group: "open",
    open: true,
  },
];

/* ------------------------------ Problem ------------------------------ */

export interface FunnelStage {
  value: number;
  label: L10n;
  /** visual bar width in % (scaled for readability, not linear) */
  width: number;
  color: string;
}

export const FUNNEL_STAGES: FunnelStage[] = [
  { value: 10000, label: l("STEM students enrolled", "طالبًا مسجَّلًا في العلوم والهندسة"), width: 100, color: "#00B894" },
  { value: 800, label: l("ever hear the word “qubit”", "سمعوا كلمة «كيوبت» يومًا"), width: 74, color: "#2EC4B6" },
  { value: 90, label: l("try a tutorial", "جرّبوا درسًا تعليميًا"), width: 56, color: "#6C5CE7" },
  { value: 12, label: l("access real hardware", "وصلوا إلى عتاد حقيقي"), width: 38, color: "#C0556B" },
  { value: 4, label: l("stay in the region", "يبقون في المنطقة"), width: 26, color: "#FF6B6B" },
];

export const PROBLEM_STATS = [
  {
    value: 300,
    suffix: "%",
    label: l(
      "growth in quantum job postings worldwide",
      "نمو في إعلانات الوظائف الكمومية عالميًا"
    ),
  },
  {
    value: 0,
    suffix: "",
    label: l(
      "practical quantum labs in Egyptian universities",
      "مختبر كمومي عملي في الجامعات المصرية"
    ),
  },
  {
    value: 2,
    prefix: "2",
    suffix: "³⁰⁰",
    label: l(
      "states on a 300-qubit machine — more than atoms in the observable universe",
      "حالة على آلة بـ300 كيوبت — أكثر من ذرات الكون المرئي"
    ),
  },
];

/* ------------------------------ Solution ----------------------------- */

export const CORE_FEATURES = [
  {
    icon: "cloud",
    title: l("Cloud Access", "وصول سحابي"),
    description: l(
      "IBM Quantum & Amazon Braket accounts from day one — real circuits on real hardware, not slideware.",
      "حسابات IBM Quantum وAmazon Braket من اليوم الأول — دوائر حقيقية على عتاد حقيقي، لا عروض تقديمية."
    ),
    color: "#00D9FF",
  },
  {
    icon: "terminal",
    title: l("Practical Training", "تدريب عملي"),
    description: l(
      "Qiskit programming cohorts — from the first H gate to official certification, taught by students for students.",
      "دفاتر تدريبية على Qiskit — من بوابة H الأولى إلى الشهادة الرسمية، طلاب يعلّمون طلابًا."
    ),
    color: "#6C5CE7",
  },
  {
    icon: "microscope",
    title: l("Research Environment", "بيئة بحثية"),
    description: l(
      "Student-led projects with faculty mentorship — student names on real papers and real hardware time.",
      "مشاريع طلابية بإشراف أكاديمي — أسماء الطلاب على أوراق بحثية حقيقية ووقت تشغيل فعلي على العتاد."
    ),
    color: "#00B894",
  },
] as const;

export const PILLARS = [
  {
    name: l("EDUCATE", "نعلّم"),
    description: l(
      "Cohort training + Qiskit certification — from curious sophomore to hired quantum programmer.",
      "تدريب جماعي + شهادات Qiskit — من طالب فضولي إلى مبرمج كمومي مُوظَّف."
    ),
    footnote: l("From |0⟩ to job-ready", "من |0⟩ إلى جاهز للتوظيف"),
    color: "#00D9FF",
  },
  {
    name: l("SIMULATE", "نحاكي"),
    description: l(
      "Research projects on real quantum hardware: chemistry, optimization, machine learning.",
      "مشاريع بحثية على عتاد كمومي حقيقي: الكيمياء، والاستمثال، وتعلم الآلة."
    ),
    footnote: l("VQE · QAOA · QML", "VQE · QAOA · QML"),
    color: "#6C5CE7",
  },
  {
    name: l("CONNECT", "نتصل"),
    description: l(
      "Hackathons, industry projects, and a global quantum network.",
      "هاكاثونات ومشاريع صناعية وشبكة كمومية عالمية."
    ),
    footnote: l("IBM · AWS · Open Source", "IBM · AWS · مصادر مفتوحة"),
    color: "#00B894",
  },
] as const;

export const STACK_LAYERS = [
  {
    name: l("ACCESS", "وصول"),
    detail: l("IBM Quantum · AWS Braket cloud credits", "IBM Quantum · أرصدة AWS Braket سحابية"),
    color: "#00D9FF",
  },
  {
    name: l("FRAMEWORKS", "أطر العمل"),
    detail: l("Qiskit · Cirq · PennyLane", "Qiskit · Cirq · PennyLane"),
    color: "#6C5CE7",
  },
  {
    name: l("SIMULATION", "المحاكاة"),
    detail: l("Aer GPU cluster — local · 24/7 · free", "عنقود Aer بوحدات GPU — محلي · 24/7 · مجانًا"),
    color: "#56CCF2",
  },
  {
    name: l("APPLICATIONS", "التطبيقات"),
    detail: l("VQE chemistry · QAOA optimization · Quantum ML", "كيمياء VQE · استمثال QAOA · تعلّم آلة كمومي"),
    color: "#00B894",
  },
] as const;

export const TRACK_RECORD = [
  { title: l("IBM Quantum Challenge", "تحدي IBM الكمومي"), result: l("top 5% global", "الأفضل 5% عالميًا"), year: "2023", color: "#FFD166" },
  { title: l("Qiskit Summer School", "مدرسة Qiskit الصيفية"), result: l("3 alumni", "3 خريجين"), year: "2023", color: "#00D9FF" },
  { title: l("National Hackathon", "هاكاثون وطني"), result: l("1st place", "المركز الأول"), year: "2024", color: "#FFD166" },
  { title: l("Publications", "أوراق بحثية"), result: l("2 undergrad papers", "ورقتان للمرحلة الجامعية"), year: "2024", color: "#00B894" },
  { title: l("Community reach", "الوصول المجتمعي"), result: l("500+ students", "أكثر من 500 طالب"), year: "2025", color: "#56CCF2" },
] as const;

/* ----------------------------- Methodology --------------------------- */

export interface Phase {
  id: number;
  name: L10n;
  months: L10n;
  /** compact rail label under the timeline dots */
  monthsShort: L10n;
  title: L10n;
  tagline: L10n;
  color: string;
  activities: L10n[];
  milestones: { value: string; label: L10n }[];
}

export const PHASES: Phase[] = [
  {
    id: 1,
    name: l("Foundation", "التأسيس"),
    months: l("Months 1–6", "الأشهر 1–6"),
    monthsShort: l("M1–6", "الأشهر 1–6"),
    title: l("Setup & Training", "التهيئة والتدريب"),
    tagline: l("From empty room to live hardware access.", "من غرفة فارغة إلى وصول فعلي للعتاد."),
    color: "#00D9FF",
    activities: [
      l("Recruit 25 founding members — open, merit-based", "استقطاب 25 عضوًا مؤسِّسًا — باب مفتوح على أساس الجدارة"),
      l("Hardware access live — IBM Quantum + Braket accounts", "وصول العتاد فعليًا — حسابات IBM Quantum وBraket"),
      l("10-workshop curriculum built and piloted", "منهج من 10 ورش يُبنى ويُجرَّب"),
      l("First simulation project shipped to real hardware", "أول مشروع محاكاة يُرسَل إلى عتاد حقيقي"),
    ],
    milestones: [
      { value: "25", label: l("founding members", "أعضاء مؤسِّسون") },
      { value: "4", label: l("workshops / month", "ورشة / شهريًا") },
      { value: "1", label: l("live hardware project", "مشروع عتاد حي") },
    ],
  },
  {
    id: 2,
    name: l("Operations", "التشغيل"),
    months: l("Months 7–18", "الأشهر 7–18"),
    monthsShort: l("M7–18", "الأشهر 7–18"),
    title: l("Research & Workshops", "البحث وورش العمل"),
    tagline: l("The flywheel turns: learn → simulate → publish → mentor.", "عجلة الزخم تدور: تعلَّم، ثم حاكِ، ثم انشر، ثم علِّم غيرك."),
    color: "#6C5CE7",
    activities: [
      l("Cohort handover — founding members mentor cohort 2", "تسليم الدفعة — الأعضاء المؤسِّسون يرشدون الدفعة الثانية"),
      l("8 research projects on real quantum hardware", "8 مشاريع بحثية على عتاد كمومي حقيقي"),
      l("2 national hackathons hosted on campus", "هاكاثونان وطنيان داخل الحرم الجامعي"),
      l("First industry pilot signed", "أول تجربة صناعية موقَّعة"),
    ],
    milestones: [
      { value: "100", label: l("students trained", "طالب مدرَّب") },
      { value: "8", label: l("research projects", "مشاريع بحثية") },
      { value: "1", label: l("industry pilot", "تجربة صناعية") },
    ],
  },
  {
    id: 3,
    name: l("Sustainability", "الاستدامة"),
    months: l("Months 19–36", "الأشهر 19–36"),
    monthsShort: l("M19–36", "الأشهر 19–36"),
    title: l("Expansion & Partnerships", "التوسّع والشراكات"),
    tagline: l("The seed is the ignition — not the business model.", "البذرة هي الشرارة — لا نموذج العمل."),
    color: "#00B894",
    activities: [
      l("3 revenue streams live — training, industry projects, grants", "3 مصادر دخل تعمل — تدريب، مشاريع صناعية، منح"),
      l("2 partner universities join the network", "جامعتان شريكتان تنضمان إلى الشبكة"),
      l("Self-funding climbs 60% → 100% by Month 36", "الاكتفاء الذاتي يصعد من 60% إلى 100% بحلول الشهر 36"),
      l("Regional quantum hub formally launched", "إطلاق رسمي لمركز كمومي إقليمي"),
    ],
    milestones: [
      { value: "200", label: l("students cumulative", "طالب تراكميًا") },
      { value: "3", label: l("revenue streams", "مصادر دخل") },
      { value: "2", label: l("partner universities", "جامعتان شريكتان") },
    ],
  },
];

/* ---------------------------- Budget data ---------------------------- */

export interface BudgetCategory {
  id: string;
  label: L10n;
  percent: number;
  description: L10n;
  color: string;
}

/** Allocation mirrors the pitch deck — "Where every dollar goes" */
export const BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    id: "hardware",
    label: l("Hardware & Cloud Access", "العتاد والوصول السحابي"),
    percent: 0.24,
    description: l(
      "IBM Quantum premium + AWS Braket credits — real machine time, the credibility slice.",
      "اشتراك IBM Quantum المميز + أرصدة AWS Braket — وقت تشغيل فعلي على الآلات، شريحة المصداقية."
    ),
    color: "#00D9FF",
  },
  {
    id: "infrastructure",
    label: l("Computing Infrastructure", "البنية الحاسوبية"),
    percent: 0.2,
    description: l(
      "2 GPU workstations + server rack — local Aer simulation running 24/7 for free.",
      "محطتا عمل GPU + رف خوادم — محاكاة Aer محلية تعمل 24/7 مجانًا."
    ),
    color: "#6C5CE7",
  },
  {
    id: "stipends",
    label: l("Student Research Stipends", "مكافآت طلابية بحثية"),
    percent: 0.2,
    description: l(
      "10 × $1,000 micro-stipends — talent focuses on research, not side gigs.",
      "10 منح مصغّرة × 1,000 دولار — ليتفرّغ الطالب للبحث لا للأعمال الجانبية."
    ),
    color: "#56CCF2",
  },
  {
    id: "training",
    label: l("Training & Certification", "التدريب والشهادات"),
    percent: 0.16,
    description: l(
      "40 Qiskit certification seats + guest lecturers + workshop materials.",
      "40 مقعد شهادة Qiskit + محاضرون ضيوف + مواد الورش."
    ),
    color: "#00B894",
  },
  {
    id: "events",
    label: l("Events & Hackathons", "الفعاليات والهاكاثونات"),
    percent: 0.12,
    description: l(
      "2 national hackathons — venue, prizes, judging panels, outreach.",
      "هاكاثونان وطنيان — القاعة، والجوائز، لجان التحكيم، والتواصل."
    ),
    color: "#A78BFA",
  },
  {
    id: "operations",
    label: l("Operations & Contingency", "التشغيل والطوارئ"),
    percent: 0.08,
    description: l(
      "Insurance, quarterly reporting, admin reserve for shocks — audit-ready transparency.",
      "تأمين، وتقارير فصلية، واحتياطي إداري للصدمات — شفافية جاهزة للتدقيق."
    ),
    color: "#3E5C94",
  },
];

export interface BudgetItem {
  icon: "grid" | "cloud" | "cpu" | "flask" | "award" | "trophy" | "shield";
  resource: L10n;
  qty: L10n;
  cost: number;
}

/** Itemized, audit-ready table — reconciled quarterly against reports */
export const BUDGET_ITEMS: BudgetItem[] = [
  { icon: "grid", resource: l("IBM Quantum premium access", "اشتراك IBM Quantum المميز"), qty: l("12 mo", "12 شهرًا"), cost: 7200 },
  { icon: "cloud", resource: l("AWS Braket simulation credits", "أرصدة محاكاة AWS Braket"), qty: l("flexible", "مرن"), cost: 4800 },
  { icon: "cpu", resource: l("GPU workstations", "محطات عمل GPU"), qty: l("2", "2"), cost: 10000 },
  { icon: "flask", resource: l("Student research stipends", "مكافآت طلابية بحثية"), qty: l("10 × $1,000", "10 × 1,000$"), cost: 10000 },
  { icon: "award", resource: l("Qiskit certification seats", "مقاعد شهادة Qiskit"), qty: l("40", "40"), cost: 8000 },
  { icon: "trophy", resource: l("Hackathons — venue + prizes", "الهاكاثونات — قاعة + جوائز"), qty: l("2", "2"), cost: 6000 },
  { icon: "shield", resource: l("Contingency reserve", "احتياطي الطوارئ"), qty: l("—", "—"), cost: 4000 },
];

export const TOTAL_SEED = 50000;

export interface BudgetScenario {
  amount: number;
  title: L10n;
}

export const BUDGET_SCENARIOS: BudgetScenario[] = [
  { amount: 10000, title: l("Ignition", "إشعال") },
  { amount: 25000, title: l("Momentum", "زخم") },
  { amount: 40000, title: l("Acceleration", "تسارع") },
  { amount: 50000, title: l("Full Lab", "المختبر الكامل") },
];

/** Simplified ROI model — linear scaling from the full $50K ask */
export function calculateROI(investment: number) {
  const ratio = investment / TOTAL_SEED;
  return {
    studentsTrained: Math.round(200 * ratio),
    projectsCompleted: Math.round(15 * ratio),
    publications: Math.round(5 * ratio),
    industryPartners: Math.round(3 * ratio),
    hackathons: Math.round(2 * ratio),
  };
}

/** Year-3 scoreboard — “measured results, not promises” */
export const YEAR3_OUTCOMES = [
  { value: 200, label: l("students trained & certified", "طالب مدرَّب وحاصل على شهادة"), color: "#00D9FF" },
  { value: 15, label: l("research projects completed", "مشروعًا بحثيًا منجزًا"), color: "#6C5CE7" },
  { value: 5, label: l("peer-reviewed publications", "أوراق بحثية محكَّمة"), color: "#56CCF2" },
  { value: 3, label: l("industry partnerships signed", "شراكات صناعية موقَّعة"), color: "#A78BFA" },
  { value: 2, label: l("national competition wins", "فوز في مسابقات وطنية"), color: "#FFD166" },
  { value: 1, label: l("regional quantum hub — named after you", "مركز كمومي إقليمي — يحمل اسمك"), color: "#00B894" },
] as const;

export const LAB_EMAIL = "quantum.lab@university.edu.eg";

/** Downloadable one-page PDF proposals (print-ready A4, matches site branding). */
export const PROPOSAL_PDFS = {
  en: { href: "/proposal/quantum-lab-one-pager.pdf", download: "QRL-Lab-Seed-Proposal.pdf" },
  ar: { href: "/proposal/quantum-lab-one-pager-ar.pdf", download: "QRL-Lab-Seed-Proposal-AR.pdf" },
} as const;

/** SECTION 07 — FAQ. Every question a funder asks, with honest answers. */
export const FAQ_ITEMS = [
  {
    q: l(
      "Why does a quantum lab only need $50,000?",
      "لماذا يحتاج مختبر كمومي إلى 50,000 دولار فقط؟"
    ),
    a: l(
      "Because we rent the quantum computers instead of building them. A physical cleanroom would cost $10M+ — cloud access to IBM Quantum and AWS Braket delivers the same real-hardware research for the price of a conference booth. The full ask is itemized line-by-line in the budget table above.",
      "لأننا نستأجر الحواسيب الكمومية بدل بنائها. غرفة نظيفة فعلية تكلّف أكثر من 10 ملايين دولار — بينما يوفر الوصول السحابي إلى IBM Quantum وAWS Braket بحثًا حقيقيًا على العتاد نفسه بثمن جناح مؤتمر. المبلغ كامل مفصَّل سطرًا بسطر في جدول الميزانية أعلاه."
    ),
  },
  {
    q: l("Why students — and why now?", "لماذا الطلاب؟ ولماذا الآن؟"),
    a: l(
      "Quantum job postings grew 300% globally while Egyptian universities graduated thousands of physics and CS students with zero practical quantum training. Hardware time is purchasable today; the talent window compounds every semester we wait. First mover isn't a slogan — it's a hiring pipeline.",
      "نما الإعلان عن الوظائف الكمومية 300% عالميًا، بينما تخرّجت آلاف طلاب الفيزياء وعلوم الحاسب من جامعات مصرية دون أي تدريب كمومي عملي. وقت التشغيل على العتاد متاح للشراء اليوم، ونافذة المواهب تتراكم كل فصل ننتظره. الريادة ليست شعارًا — إنها خط توظيف."
    ),
  },
  {
    q: l("How will the money be audited?", "كيف ستُدقَّق الأموال؟"),
    a: l(
      "Every line item is pre-priced and published on this page. You receive quarterly reconciliation reports against that exact table, open finances, and named signatories. No blockchains needed — just quarterly receipts and a standing invitation to visit the lab.",
      "كل بند مسعَّر مسبقًا ومنشور على هذه الصفحة. ستتلقى تقارير مطابقة فصلية مع الجدول نفسه، ومالية مفتوحة، وموقِّعين بالاسم. لا حاجة لتقنيات سحرية — إيصالات فصلية ودعوة دائمة لزيارة المختبر."
    ),
  },
  {
    q: l(
      "What hardware will students actually touch?",
      "ما العتاد الذي سيستخدمه الطلاب فعلًا؟"
    ),
    a: l(
      "IBM Quantum premium access (12 months, ibm_torino-class processors), AWS Braket simulation credits, and two GPU workstations for local circuit simulation. Students run real superconducting hardware from day one through Qiskit — the same stack used by 60% of published quantum experiments.",
      "اشتراك IBM Quantum المميز (12 شهرًا على معالجات فئة ibm_torino)، وأرصدة محاكاة AWS Braket، ومحطتا عمل GPU للمحاكاة المحلية للدوائر. يشغّل الطلاب عتادًا فائق التوصيل حقيقيًا من اليوم الأول عبر Qiskit — المنصة نفسها المستخدمة في 60% من تجارب الكم المنشورة."
    ),
  },
  {
    q: l("What happens if a phase slips?", "ماذا لو تأخرت إحدى المراحل؟"),
    a: l(
      "Each phase has written exit criteria that gate the next one, and an 8% contingency reserve ($4,000) absorbs shocks. If a milestone slips, the report says so — and the plan re-sequences around it. You'll never discover a delay after the fact.",
      "لكل مرحلة معايير إنهاء مكتوبة تُبوِّب المرحلة التالية، واحتياطي طوارئ 8% (4,000 دولار) لامتصاص الصدمات. إذا تأخر مَعلم، يقول التقرير ذلك — وتُعاد ترتيب الخطة حوله. لن تكتشف أي تأخير بعد وقوعه."
    ),
  },
  {
    q: l("What happens after the 36 months?", "ماذا يحدث بعد 36 شهرًا؟"),
    a: l(
      "Sustainability was engineered in from day one: industry partnerships signed in Phase 2, follow-on grants (ASRT, ITIDA, Erasmus+), an alumni hiring pipeline companies pay to access, and co-branded outcomes. The seed ignites the engine — the engine then funds itself.",
      "صُمِّمت الاستدامة من اليوم الأول: شراكات صناعية توقَّعت في المرحلة الثانية، ومنح لاحقة (ASRT وITIDA وErasmus+)، وخط خريجين تشتري الشركات الوصول إليه، ومخرجات بعلامة مشتركة. البذرة تشعل المحرك — ثم يموّل المحرك نفسه."
    ),
  },
  {
    q: l("Who owns the research and the IP?", "من يملك البحث وحقوق الملكية؟"),
    a: l(
      "Students are first authors on peer-reviewed publications. IP follows the university's standard research policy, and everything we can publish openly, we do — open science is the fastest route to credibility for a first-of-its-kind lab.",
      "الطلاب مؤلفون أول في الأوراق المحكَّمة. تخضع الملكية الفكرية لسياسة البحث الجامعية المعتمدة، وكل ما يمكن نشره مفتوحًا ننشره — العلم المفتوح أسرع طريق لمصداقية مختبر رائد من نوعه."
    ),
  },
  {
    q: l(
      "Can we fund a specific line instead of the full seed?",
      "هل يمكن تمويل بند محدد بدل المبلغ الكامل؟"
    ),
    a: l(
      "Yes. The interactive budget calculator above lets you 'ignite' a partial amount — a $10K seed still trains 40 students on real hardware. Smaller seed, smaller lab, same physics. Reach out and we'll structure it.",
      "نعم. حاسبة الميزانية التفاعلية أعلاه تتيح لك «إشعال» مبلغ جزئي — حتى 10,000 دولار تدرّب 40 طالبًا على عتاد حقيقي. بذرة أصغر، مختبر أصغر، الفيزياء نفسها. راسلنا وسنصوغها معك."
    ),
  },
] as const;

export const NAV_LINKS = [
  { href: "#problem", label: l("Problem", "المشكلة") },
  { href: "#solution", label: l("Solution", "الحل") },
  { href: "#methodology", label: l("Methodology", "خطة العمل") },
  { href: "#playground", label: l("Playground", "جرّب الكم") },
  { href: "#budget", label: l("Budget", "الميزانية") },
  { href: "#team", label: l("Team", "الفريق") },
  { href: "#faq", label: l("FAQ", "الأسئلة الشائعة") },
  { href: "#contact", label: l("Contact", "تواصل معنا") },
] as const;
