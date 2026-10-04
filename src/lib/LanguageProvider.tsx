"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  PAGE_TITLES,
  STORAGE_KEY,
  isLang,
  tr as pick,
  type L10n,
  type Lang,
} from "@/lib/i18n";
import { COPY, type Copy } from "@/lib/copy";

/**
 * Language context — the observer that collapses every L10n string
 * into |EN⟩ or |AR⟩. Persists the choice, mirrors it onto
 * <html lang dir> (RTL for Arabic), and swaps the document title.
 */

interface LangContextValue {
  lang: Lang;
  isAr: boolean;
  /** Active copy deck (typed — no `any`, no missing keys at compile time). */
  t: Copy;
  /** Collapse a localized data field from data.ts into the active language. */
  tx: (value: L10n | string) => string;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default EN — matches the server-rendered markup, so hydration is stable.
  // The saved preference (if any) takes over right after mount.
  const [lang, setLang] = useState<Lang>("en");

  // Hydrate the persisted choice once. Deferred by a tick so the server
  // markup (EN) paints first — no hydration mismatch — then the saved
  // language collapses the superposition.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* private mode — superposition stays */
    }
    if (isLang(saved)) {
      const id = window.setTimeout(() => setLang(saved as Lang), 0);
      return () => window.clearTimeout(id);
    }
  }, []);

  // Reflect language onto the document: dir, lang, title, persistence.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = PAGE_TITLES[lang];
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }

    // Next.js re-asserts the SSR <title> after hydration — guard it so the
    // document title always speaks the active language (no infinite loop:
    // our own writes satisfy the equality check).
    const titleEl = document.querySelector("head > title");
    let observer: MutationObserver | undefined;
    if (titleEl) {
      observer = new MutationObserver(() => {
        if (document.title !== PAGE_TITLES[lang]) {
          document.title = PAGE_TITLES[lang];
        }
      });
      observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
    }
    // Belt & suspenders: re-assert once the app router settles.
    const reassert = window.setTimeout(() => {
      document.title = PAGE_TITLES[lang];
    }, 400);

    return () => {
      observer?.disconnect();
      window.clearTimeout(reassert);
    };
  }, [lang]);

  const toggle = useCallback(() => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  }, []);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      isAr: lang === "ar",
      t: COPY[lang],
      tx: (v) => pick(v, lang),
      setLang,
      toggle,
    }),
    [lang, toggle]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error("useLang must be used inside <LanguageProvider>");
  }
  return ctx;
}
