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
 * into |EN⟩ or |AR⟩. Persists the choice (cookie + localStorage),
 * mirrors it onto <html lang dir> (RTL for Arabic), and swaps the title.
 *
 * Zero-flash: the server reads the cookie in layout.tsx and passes the
 * persisted language as `initialLang`, so the very first paint already
 * speaks the right language — no EN flash before hydration.
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

/** Mirror the language onto a long-lived cookie so the server can read it. */
function writeLangCookie(lang: Lang) {
  try {
    document.cookie = `${STORAGE_KEY}=${lang}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    /* cookies disabled — localStorage still carries the preference */
  }
}

export function LanguageProvider({
  children,
  initialLang = "en",
}: {
  children: ReactNode;
  /** Cookie-provided language from the server render (zero-flash). */
  initialLang?: Lang;
}) {
  // Start from the server-provided language so SSR markup, hydration, and
  // the cookie all describe the same world — no superposition flicker.
  const [lang, setLang] = useState<Lang>(initialLang);

  // Reconcile with localStorage once: it wins over the cookie for a
  // returning client that switched language in a previous session
  // (e.g. cookie blocked, or preference newer than the cookie).
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* private mode — cookie remains the source of truth */
    }
    if (isLang(saved) && saved !== initialLang) {
      const id = window.setTimeout(() => setLang(saved as Lang), 0);
      return () => window.clearTimeout(id);
    }
  }, [initialLang]);

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
    writeLangCookie(lang);

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
