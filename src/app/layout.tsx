import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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

export const metadata: Metadata = {
  title:
    "Quantum Research Lab — Building Egypt's Quantum Future | $50K Seed Proposal",
  description:
    "A student-led, faculty-mentored Quantum Research Laboratory seeking $50,000 in seed funding. 200 quantum-fluent graduates, 15 research projects, and the region's first student quantum hub — in three years.",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Quantum Research Lab — Seed Proposal 2026",
    description:
      "Student-led quantum research lab seeking $50,000. Where students simulate reality.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
