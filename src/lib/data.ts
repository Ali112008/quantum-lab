/**
 * Single source of truth for the landing page content.
 * Numbers are taken from the official seed pitch deck (2026)
 * and the grant proposal guide — keep them consistent with reporting.
 */

/* ------------------------------- Team -------------------------------- */

export type TeamGroup = "leads" | "research" | "tech" | "ops" | "media" | "open";

export interface TeamMember {
  name: string;
  role: string;
  year: string;
  skills: string[];
  /** tailwind gradient classes for the avatar halo */
  gradient: string;
  /** filter group shown in the team section */
  group: TeamGroup;
  /** open founding seat rendered with dashed border */
  open?: boolean;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Ali Mahmoud Ali",
    role: "Project Lead",
    year: "4th Year · Computer Science",
    skills: ["Leadership", "Quantum Algorithms", "Strategy"],
    gradient: "from-quantum-blue/80 to-quantum-blue/20",
    group: "leads",
  },
  {
    name: "Mohamed Raafat Mohamed",
    role: "Technical Lead",
    year: "3rd Year · Physics",
    skills: ["Qiskit", "Python", "Circuit Design"],
    gradient: "from-quantum-purple/80 to-quantum-purple/20",
    group: "tech",
  },
  {
    name: "Elsayed Ramdan Labib",
    role: "Research Lead",
    year: "4th Year · Physics",
    skills: ["Quantum Theory", "VQE", "Scientific Writing"],
    gradient: "from-quantum-green/80 to-quantum-green/20",
    group: "research",
  },
  {
    name: "Basmalla Ahmed Awad",
    role: "Education Lead",
    year: "3rd Year · Computer Science",
    skills: ["Curriculum Design", "Qiskit", "Teaching"],
    gradient: "from-quantum-amber/80 to-quantum-amber/20",
    group: "ops",
  },
  {
    name: "Nada Ehab Ahmed",
    role: "Partnerships Lead",
    year: "4th Year · Communications Eng.",
    skills: ["Industry Liaison", "Public Speaking"],
    gradient: "from-quantum-blue/80 to-quantum-purple/30",
    group: "ops",
  },
  {
    name: "Youssef Mohammed Eldabaa",
    role: "Quantum Algorithms",
    year: "3rd Year · Mathematics",
    skills: ["QAOA", "Linear Algebra", "Python"],
    gradient: "from-quantum-purple/80 to-quantum-blue/30",
    group: "research",
  },
  {
    name: "Salma Mohamed Ghoniem",
    role: "Simulation Engineer",
    year: "3rd Year · Physics",
    skills: ["Aer Simulator", "NumPy", "HPC"],
    gradient: "from-quantum-green/80 to-quantum-blue/30",
    group: "tech",
  },
  {
    name: "Sara Emad Hassan",
    role: "Outreach & Media",
    year: "2nd Year · Computer Science",
    skills: ["Content Creation", "Community"],
    gradient: "from-quantum-amber/80 to-quantum-red/30",
    group: "media",
  },
  {
    name: "Shahenda Ahmed Khalil",
    role: "Operations Manager",
    year: "4th Year · Physics",
    skills: ["Logistics", "Scheduling", "Reporting"],
    gradient: "from-quantum-blue/80 to-quantum-green/30",
    group: "ops",
  },
  {
    name: "Menna Osama Mohammed",
    role: "Documentation Lead",
    year: "3rd Year · Computer Science",
    skills: ["Technical Writing", "Git", "Docs"],
    gradient: "from-quantum-purple/80 to-quantum-green/30",
    group: "ops",
  },
  {
    name: "Mohamed Tamer Ismail",
    role: "Hardware & Cloud",
    year: "4th Year · Computer Engineering",
    skills: ["AWS Braket", "IBM Quantum", "Linux"],
    gradient: "from-quantum-green/80 to-quantum-purple/30",
    group: "tech",
  },
  {
    name: "Malak Asaad Ismail",
    role: "Design Lead",
    year: "2nd Year · Information Systems",
    skills: ["UI/UX", "Figma", "Branding"],
    gradient: "from-quantum-amber/80 to-quantum-purple/30",
    group: "media",
  },
  {
    name: "Somaia Adel Mohamed",
    role: "Events & Workshops",
    year: "3rd Year · Physics",
    skills: ["Event Planning", "Hackathons", "Qiskit"],
    gradient: "from-quantum-red/80 to-quantum-blue/30",
    group: "ops",
  },
  {
    name: "|0⟩",
    role: "Open Founding Seat",
    year: "Could be you — apply now",
    skills: ["Apply via email"],
    gradient: "from-quantum-subtle/60 to-quantum-subtle/10",
    group: "open",
    open: true,
  },
  {
    name: "|1⟩",
    role: "Open Founding Seat",
    year: "Could be you — apply now",
    skills: ["Apply via email"],
    gradient: "from-quantum-subtle/60 to-quantum-subtle/10",
    group: "open",
    open: true,
  },
];

/* ------------------------------ Problem ------------------------------ */

export interface FunnelStage {
  value: number;
  label: string;
  /** visual bar width in % (scaled for readability, not linear) */
  width: number;
  color: string;
}

export const FUNNEL_STAGES: FunnelStage[] = [
  { value: 10000, label: "STEM students enrolled", width: 100, color: "#00B894" },
  { value: 800, label: "ever hear the word “qubit”", width: 74, color: "#2EC4B6" },
  { value: 90, label: "try a tutorial", width: 56, color: "#6C5CE7" },
  { value: 12, label: "access real hardware", width: 38, color: "#C0556B" },
  { value: 4, label: "stay in the region", width: 26, color: "#FF6B6B" },
];

export const PROBLEM_STATS = [
  {
    value: 300,
    suffix: "%",
    label: "growth in quantum job postings worldwide",
  },
  {
    value: 0,
    suffix: "",
    label: "practical quantum labs in Egyptian universities",
  },
  {
    value: 2,
    prefix: "2",
    suffix: "³⁰⁰",
    label: "states on a 300-qubit machine — more than atoms in the observable universe",
  },
];

/* ------------------------------ Solution ----------------------------- */

export const CORE_FEATURES = [
  {
    icon: "cloud",
    title: "Cloud Access",
    description:
      "IBM Quantum & Amazon Braket accounts from day one — real circuits on real hardware, not slideware.",
    color: "#00D9FF",
  },
  {
    icon: "terminal",
    title: "Practical Training",
    description:
      "Qiskit programming cohorts — from the first H gate to official certification, taught by students for students.",
    color: "#6C5CE7",
  },
  {
    icon: "microscope",
    title: "Research Environment",
    description:
      "Student-led projects with faculty mentorship — student names on real papers and real hardware time.",
    color: "#00B894",
  },
] as const;

export const PILLARS = [
  {
    name: "EDUCATE",
    description:
      "Cohort training + Qiskit certification — from curious sophomore to hired quantum programmer.",
    footnote: "From |0⟩ to job-ready",
    color: "#00D9FF",
  },
  {
    name: "SIMULATE",
    description:
      "Research projects on real quantum hardware: chemistry, optimization, machine learning.",
    footnote: "VQE · QAOA · QML",
    color: "#6C5CE7",
  },
  {
    name: "CONNECT",
    description:
      "Hackathons, industry projects, and a global quantum network.",
    footnote: "IBM · AWS · Open Source",
    color: "#00B894",
  },
] as const;

export const STACK_LAYERS = [
  {
    name: "ACCESS",
    detail: "IBM Quantum · AWS Braket cloud credits",
    color: "#00D9FF",
  },
  {
    name: "FRAMEWORKS",
    detail: "Qiskit · Cirq · PennyLane",
    color: "#6C5CE7",
  },
  {
    name: "SIMULATION",
    detail: "Aer GPU cluster — local · 24/7 · free",
    color: "#56CCF2",
  },
  {
    name: "APPLICATIONS",
    detail: "VQE chemistry · QAOA optimization · Quantum ML",
    color: "#00B894",
  },
] as const;

export const TRACK_RECORD = [
  { title: "IBM Quantum Challenge", result: "top 5% global", year: "2023", color: "#FFD166" },
  { title: "Qiskit Summer School", result: "3 alumni", year: "2023", color: "#00D9FF" },
  { title: "National Hackathon", result: "1st place", year: "2024", color: "#FFD166" },
  { title: "Publications", result: "2 undergrad papers", year: "2024", color: "#00B894" },
  { title: "Community reach", result: "500+ students", year: "2025", color: "#56CCF2" },
] as const;

/* ----------------------------- Methodology --------------------------- */

export interface Phase {
  id: number;
  name: string;
  months: string;
  title: string;
  tagline: string;
  color: string;
  activities: string[];
  milestones: { value: string; label: string }[];
}

export const PHASES: Phase[] = [
  {
    id: 1,
    name: "Foundation",
    months: "Months 1–6",
    title: "Setup & Training",
    tagline: "From empty room to live hardware access.",
    color: "#00D9FF",
    activities: [
      "Recruit 25 founding members — open, merit-based",
      "Hardware access live — IBM Quantum + Braket accounts",
      "10-workshop curriculum built and piloted",
      "First simulation project shipped to real hardware",
    ],
    milestones: [
      { value: "25", label: "founding members" },
      { value: "4", label: "workshops / month" },
      { value: "1", label: "live hardware project" },
    ],
  },
  {
    id: 2,
    name: "Operations",
    months: "Months 7–18",
    title: "Research & Workshops",
    tagline: "The flywheel turns: learn → simulate → publish → mentor.",
    color: "#6C5CE7",
    activities: [
      "Cohort handover — founding members mentor cohort 2",
      "8 research projects on real quantum hardware",
      "2 national hackathons hosted on campus",
      "First industry pilot signed",
    ],
    milestones: [
      { value: "100", label: "students trained" },
      { value: "8", label: "research projects" },
      { value: "1", label: "industry pilot" },
    ],
  },
  {
    id: 3,
    name: "Sustainability",
    months: "Months 19–36",
    title: "Expansion & Partnerships",
    tagline: "The seed is the ignition — not the business model.",
    color: "#00B894",
    activities: [
      "3 revenue streams live — training, industry projects, grants",
      "2 partner universities join the network",
      "Self-funding climbs 60% → 100% by Month 36",
      "Regional quantum hub formally launched",
    ],
    milestones: [
      { value: "200", label: "students cumulative" },
      { value: "3", label: "revenue streams" },
      { value: "2", label: "partner universities" },
    ],
  },
];

/* ---------------------------- Budget data ---------------------------- */

export interface BudgetCategory {
  id: string;
  label: string;
  percent: number;
  description: string;
  color: string;
}

/** Allocation mirrors the pitch deck — "Where every dollar goes" */
export const BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    id: "hardware",
    label: "Hardware & Cloud Access",
    percent: 0.24,
    description:
      "IBM Quantum premium + AWS Braket credits — real machine time, the credibility slice.",
    color: "#00D9FF",
  },
  {
    id: "infrastructure",
    label: "Computing Infrastructure",
    percent: 0.2,
    description:
      "2 GPU workstations + server rack — local Aer simulation running 24/7 for free.",
    color: "#6C5CE7",
  },
  {
    id: "stipends",
    label: "Student Research Stipends",
    percent: 0.2,
    description:
      "10 × $1,000 micro-stipends — talent focuses on research, not side gigs.",
    color: "#56CCF2",
  },
  {
    id: "training",
    label: "Training & Certification",
    percent: 0.16,
    description:
      "40 Qiskit certification seats + guest lecturers + workshop materials.",
    color: "#00B894",
  },
  {
    id: "events",
    label: "Events & Hackathons",
    percent: 0.12,
    description:
      "2 national hackathons — venue, prizes, judging panels, outreach.",
    color: "#A78BFA",
  },
  {
    id: "operations",
    label: "Operations & Contingency",
    percent: 0.08,
    description:
      "Insurance, quarterly reporting, admin reserve for shocks — audit-ready transparency.",
    color: "#3E5C94",
  },
];

export interface BudgetItem {
  icon: "grid" | "cloud" | "cpu" | "flask" | "award" | "trophy" | "shield";
  resource: string;
  qty: string;
  cost: number;
}

/** Itemized, audit-ready table — reconciled quarterly against reports */
export const BUDGET_ITEMS: BudgetItem[] = [
  { icon: "grid", resource: "IBM Quantum premium access", qty: "12 mo", cost: 7200 },
  { icon: "cloud", resource: "AWS Braket simulation credits", qty: "flexible", cost: 4800 },
  { icon: "cpu", resource: "GPU workstations", qty: "2", cost: 10000 },
  { icon: "flask", resource: "Student research stipends", qty: "10 × $1,000", cost: 10000 },
  { icon: "award", resource: "Qiskit certification seats", qty: "40", cost: 8000 },
  { icon: "trophy", resource: "Hackathons — venue + prizes", qty: "2", cost: 6000 },
  { icon: "shield", resource: "Contingency reserve", qty: "—", cost: 4000 },
];

export const TOTAL_SEED = 50000;

export interface BudgetScenario {
  amount: number;
  title: string;
  outcome: string;
}

export const BUDGET_SCENARIOS: BudgetScenario[] = [
  {
    amount: 10000,
    title: "Ignition",
    outcome:
      "1 GPU workstation + founding cohort of 25 trained + 2 workshops every month.",
  },
  {
    amount: 25000,
    title: "Momentum",
    outcome:
      "Full cloud access + 50 students trained + first research project executed on real hardware.",
  },
  {
    amount: 40000,
    title: "Acceleration",
    outcome:
      "100 students trained + 2 hackathons hosted + first industry pilot signed.",
  },
  {
    amount: 50000,
    title: "Full Lab",
    outcome:
      "200 careers launched + 5 peer-reviewed publications + a regional quantum hub by Year 3.",
  },
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
  { value: 200, label: "students trained & certified", color: "#00D9FF" },
  { value: 15, label: "research projects completed", color: "#6C5CE7" },
  { value: 5, label: "peer-reviewed publications", color: "#56CCF2" },
  { value: 3, label: "industry partnerships signed", color: "#A78BFA" },
  { value: 2, label: "national competition wins", color: "#FFD166" },
  { value: 1, label: "regional quantum hub — named after you", color: "#00B894" },
] as const;

export const LAB_EMAIL = "quantum.lab@university.edu.eg";

export const NAV_LINKS = [
  { href: "#problem", label: "Problem" },
  { href: "#solution", label: "Solution" },
  { href: "#methodology", label: "Methodology" },
  { href: "#budget", label: "Budget" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Contact" },
] as const;
