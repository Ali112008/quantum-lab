import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import Methodology from "@/components/Methodology";
import BudgetCalculator from "@/components/BudgetCalculator";
import Scoreboard from "@/components/Scoreboard";
import Team from "@/components/Team";
import FAQ from "@/components/FAQ";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import QuantumBackground from "@/components/ui/QuantumBackground";
import QuantumTicker from "@/components/QuantumTicker";
import ScrollToTop from "@/components/ScrollToTop";

/**
 * Single-page landing for the University Quantum Research Lab.
 * One wavefunction, eleven sections, smooth scroll.
 */
export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      {/* Global animated particle field (fixed, behind everything) */}
      <QuantumBackground />

      <Navbar />

      <main id="main-content" className="relative z-10 flex-1">
        <Hero />
        <QuantumTicker />
        <Problem />
        <Solution />
        <Methodology />
        <BudgetCalculator />
        <Scoreboard />
        <Team />
        <FAQ />
        <ContactSection />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
