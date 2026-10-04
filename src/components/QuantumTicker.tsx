const TICKER_ITEMS = [
  "|ψ⟩ = α|0⟩ + β|1⟩",
  "SUPERPOSITION",
  "IBM QUANTUM CHALLENGE — TOP 5% GLOBAL",
  "ENTANGLEMENT",
  "QISKIT CERTIFIED — 40 SEATS",
  "DECOHERENCE",
  "$1 → $100 BY 2036",
  "200 CAREERS LAUNCHED",
  "VQE · QAOA · QML",
  "NATIONAL HACKATHON — 1ST PLACE",
  "2 PEER-REVIEWED PAPERS",
  "MEASURE THE TALENT",
];

/**
 * Continuous marquee of quantum vocabulary + lab achievements.
 * Rendered twice for a seamless CSS-only loop.
 */
export default function QuantumTicker() {
  return (
    <div
      aria-hidden="true"
      className="relative z-10 overflow-hidden border-y border-quantum-blue/15 bg-quantum-deep/70 py-3 backdrop-blur-sm select-none"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-quantum-navy to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-quantum-navy to-transparent" />
      <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-10 pr-10">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center gap-10" aria-hidden={copy === 1}>
            {TICKER_ITEMS.map((item) => (
              <li
                key={`${copy}-${item}`}
                className="flex items-center gap-10 whitespace-nowrap font-mono text-[11px] md:text-xs tracking-[0.25em] text-quantum-subtle"
              >
                <span className="text-quantum-blue/70">◆</span>
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
