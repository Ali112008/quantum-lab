import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import Methodology from "@/components/Methodology";
import BudgetCalculator from "@/components/BudgetCalculator";
import Scoreboard from "@/components/Scoreboard";
import Team from "@/components/Team";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import QuantumBackground from "@/components/ui/QuantumBackground";
import QuantumTicker from "@/components/QuantumTicker";
import ScrollToTop from "@/components/ScrollToTop";

/**
 * Single-page landing for the University Quantum Research Lab.
 * One wavefunction, ten sections, smooth scroll.
 */
export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      {/* Global animated particle field (fixed, behind everything) */}
      <QuantumBackground />

      <Navbar />

      <main className="relative z-10 flex-1">
        <Hero />
        <QuantumTicker />
        <Problem />
        <Solution />
        <Methodology />
        <BudgetCalculator />
        <Scoreboard />
        <Team />
        <ContactSection />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
