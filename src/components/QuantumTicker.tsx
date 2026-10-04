"use client";

import { useLang } from "@/lib/LanguageProvider";
import { l, type L10n } from "@/lib/i18n";

const TICKER_ITEMS: L10n[] = [
  l("|ψ⟩ = α|0⟩ + β|1⟩", "|ψ⟩ = α|0⟩ + β|1⟩"),
  l("SUPERPOSITION", "تراكب كمومي"),
  l("IBM QUANTUM CHALLENGE — TOP 5% GLOBAL", "تحدي IBM الكمومي — الأفضل 5% عالميًا"),
  l("ENTANGLEMENT", "تشابك كمومي"),
  l("QISKIT CERTIFIED — 40 SEATS", "شهادات Qiskit — 40 مقعدًا"),
  l("DECOHERENCE", "فقدان التماسك"),
  l("$1 → $100 BY 2036", "$1 → $100 بحلول 2036"),
  l("200 CAREERS LAUNCHED", "200 مسيرة مهنية تُطلق"),
  l("VQE · QAOA · QML", "VQE · QAOA · QML"),
  l("NATIONAL HACKATHON — 1ST PLACE", "هاكاثون وطني — المركز الأول"),
  l("2 PEER-REVIEWED PAPERS", "ورقتان بحثيتان محكّمتان"),
  l("MEASURE THE TALENT", "قِس الموهبة"),
];

/**
 * Continuous marquee of quantum vocabulary + lab achievements.
 * Rendered twice for a seamless CSS-only loop. The strip itself is forced
 * LTR so the translateX marquee physics stay identical in both languages
 * (Arabic items still render RTL inside each pill).
 */
export default function QuantumTicker() {
  const { tx } = useLang();

  return (
    <div
      dir="ltr"
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
                key={`${copy}-${item.en}`}
                className="flex items-center gap-10 whitespace-nowrap font-mono text-[11px] md:text-xs tracking-[0.25em] text-quantum-subtle"
              >
                <span className="text-quantum-blue/70">◆</span>
                {tx(item)}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
