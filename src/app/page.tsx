import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import Methodology from "@/components/Methodology";
import BudgetCalculator from "@/components/BudgetCalculator";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import QuantumBackground from "@/components/ui/QuantumBackground";

/**
 * Single-page landing for the University Quantum Research Lab.
 * One wavefunction, eight sections, smooth scroll.
 */
export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      {/* Global animated particle field (fixed, behind everything) */}
      <QuantumBackground />

      <Navbar />

      <main className="relative z-10 flex-1">
        <Hero />
        <Problem />
        <Solution />
        <Methodology />
        <BudgetCalculator />
        <Team />
      </main>

      <Footer />
    </div>
  );
}
