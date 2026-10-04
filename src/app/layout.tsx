import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter, Montserrat, Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/lib/LanguageProvider";
import { PAGE_TITLES, isLang, type Lang } from "@/lib/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

/** Arabic companion face — Montserrat has no Arabic glyphs, Cairo carries |AR⟩. */
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

/** Canonical site URL — override with NEXT_PUBLIC_SITE_URL at deploy time. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Server-side language collapse: read the qrl-lang cookie written by the
 * LanguageProvider so the FIRST paint already carries the right lang/dir
 * and copy — returning Arabic readers see no English flash (zero-flash i18n).
 */
async function getInitialLang(): Promise<Lang> {
  const store = await cookies();
  const value = store.get("qrl-lang")?.value;
  return isLang(value) ? value : "en";
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getInitialLang();
  return {
    metadataBase: new URL(siteUrl),
    title: PAGE_TITLES[lang],
    description:
      "A student-led, faculty-mentored Quantum Research Laboratory seeking $50,000 in seed funding. 200 quantum-fluent graduates, 15 research projects, and the region's first student quantum hub — in three years.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "quantum computing",
    "quantum research lab",
    "student-led research",
    "Qiskit",
    "IBM Quantum",
    "Egypt quantum",
    "seed funding",
    "grant proposal",
    "ASRT",
    "ITIDA",
  ],
  authors: [{ name: "Quantum Research Lab Team" }],
  icons: {
    icon:
      "data:image/svg+xml," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="5" fill="%2300D9FF"/><ellipse cx="16" cy="16" rx="14" ry="6" fill="none" stroke="%236C5CE7" stroke-width="1.5" transform="rotate(30 16 16)"/><ellipse cx="16" cy="16" rx="14" ry="6" fill="none" stroke="%2300D9FF" stroke-width="1.5" transform="rotate(-30 16 16)"/></svg>'
      ),
  },
  openGraph: {
    title: "Quantum Research Lab — Building Egypt's Quantum Future Today",
    description:
      "Student-led quantum research lab seeking $50,000 seed funding. Train 200 quantum-fluent graduates and launch the region's first student quantum hub.",
    url: "/",
    siteName: "Quantum Research Lab",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/og-cover.png",
        width: 1344,
        height: 768,
        alt: "Glowing quantum particle network above a circuit board — Quantum Research Lab seed proposal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quantum Research Lab — Seed Proposal 2026",
    description:
      "Student-led quantum research lab seeking $50,000. Where students simulate reality.",
    images: ["/images/og-cover.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  };
}

/** Structured data — helps funding agencies & search engines index the lab */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ResearchOrganization",
  name: "University Quantum Research Laboratory",
  alternateName: "Quantum Research Lab",
  description:
    "Student-led, faculty-mentored quantum research laboratory. Seeking $50,000 seed funding for a 3-year plan: Foundation, Operations, Sustainability.",
  email: "quantum.lab@university.edu.eg",
  funder: {
    "@type": "Organization",
    name: "Seed Investment Partners",
  },
  department: {
    "@type": "CollegeOrUniversity",
    name: "Department of Physics & Computer Science",
  },
  knowsAbout: [
    "Quantum Computing",
    "Quantum Simulation",
    "Qiskit",
    "Quantum Algorithms",
    "VQE",
    "QAOA",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Collapse the language server-side from the persisted cookie.
  const lang = await getInitialLang();
  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${montserrat.variable} ${cairo.variable} antialiased bg-background text-foreground`}
      >
        {/* Language observer — collapses every L10n string to |EN⟩ or |AR⟩,
            seeded from the cookie so the first paint already speaks AR. */}
        <LanguageProvider initialLang={lang}>
          {/* Accessibility: skip straight to content, WCAG 2.1 §2.4.1 */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-quantum-blue focus:px-4 focus:py-2.5 focus:font-heading focus:text-sm focus:font-bold focus:text-quantum-navy focus:shadow-[0_0_24px_rgba(0,217,255,0.5)]"
          >
            Skip to main content
          </a>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
