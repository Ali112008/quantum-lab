import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import Methodology from "@/components/Methodology";
import Playground from "@/components/Playground";
import BudgetCalculator from "@/components/BudgetCalculator";
import Scoreboard from "@/components/Scoreboard";
import Team from "@/components/Team";
import FAQ from "@/components/FAQ";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import QuantumBackground from "@/components/ui/QuantumBackground";
import QuantumTicker from "@/components/QuantumTicker";
import ScrollToTop from "@/components/ScrollToTop";
import SectionDivider from "@/components/ui/SectionDivider";

/**
 * Single-page landing for the University Quantum Research Lab.
 * One wavefunction, twelve sections, smooth scroll — EN ⟷ AR.
 */
export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      {/* Global animated particle field (fixed, behind everything) */}
      <QuantumBackground />
      {/* Quantum vacuum grain — subtle film texture over the canvas */}
      <div aria-hidden="true" className="noise-veil" />

      <Navbar />

      <main id="main-content" className="relative z-10 flex-1">
        <Hero />
        <QuantumTicker />
        <Problem />
        <Solution />
        <SectionDivider accent="#6C5CE7" />
        <Methodology />
        <SectionDivider accent="#00B894" echo="#6C5CE7" />
        <Playground />
        <SectionDivider accent="#00D9FF" echo="#00B894" />
        <BudgetCalculator />
        <Scoreboard />
        <SectionDivider accent="#FFD166" echo="#00D9FF" />
        <Team />
        <FAQ />
        <SectionDivider accent="#00D9FF" echo="#00B894" />
        <ContactSection />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
