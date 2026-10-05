/**
 * Bilingual (EN/AR) foundation for the Quantum Research Lab landing page.
 *
 * Why hand-rolled instead of next-intl?  The page is a single route with
 * ~250 copy strings living in `data.ts` + per-section components. A tiny
 * `L10n` pair + one context provider gives the students:
 *   - full TypeScript safety (no stringly-typed keys),
 *   - zero build-time route splitting,
 *   - a single `useLang()` hook and a `tr()` pick helper.
 *
 * Quantum note: think of each string as a qubit that collapses to either
 * |EN⟩ or |AR⟩ the moment you measure (render) it.
 */

export type Lang = "en" | "ar";

/** A localized string — two parallel amplitudes of the same copy. */
export interface L10n {
  en: string;
  ar: string;
}

/** Builder that keeps the data files readable: l("Hello", "مرحبًا"). */
export const l = (en: string, ar: string): L10n => ({ en, ar });

/** Collapse a localized value (or a plain string) into the active language. */
export function tr(value: L10n | string, lang: Lang): string {
  return typeof value === "string" ? value : value[lang];
}

/** Localized page titles (document.title swaps when the language flips). */
export const PAGE_TITLES: Record<Lang, string> = {
  en: "Quantum Research Lab — Building Egypt's Quantum Future | $50K Seed Proposal",
  ar: "مختبر أبحاث الكموم — نبني مستقبل مصر الكمومي | عرض تمويل 50 ألف دولار",
};

export const STORAGE_KEY = "qrl-lang";

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "ar";
}
