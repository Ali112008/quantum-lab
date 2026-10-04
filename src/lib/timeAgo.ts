/**
 * timeAgo — bilingual relative-time formatting for the donor wall.
 *
 * Philosophy: never hand-roll pluralization. `Intl.RelativeTimeFormat`
 * already knows that Arabic has separate forms for 1, 2, 3–10 and 11+
 * ("قبل ساعتين" / "قبل 6 أيام") and that English collapses to "6d ago"
 * in narrow style. We only choose the unit bucket and pin Western digits
 * in Arabic via the -u-nu-latn locale extension (the site's convention:
 * numbers stay Latin even inside RTL copy).
 *
 * Hydration-safety: this helper is only ever called on data fetched from
 * /api/pledges (client-side), never during SSR of static content — so a
 * server/client clock difference can never produce a hydration mismatch.
 */

export type Lang = "en" | "ar";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const rtf = (lang: Lang): Intl.RelativeTimeFormat =>
  new Intl.RelativeTimeFormat(lang === "ar" ? "ar-EG-u-nu-latn" : "en", {
    numeric: "auto", // "yesterday" / "أول أمس" instead of "1 day ago"
    style: "narrow", // EN gets compact "6d ago"; Arabic keeps proper words
  });

/** Short calendar fallback for anything older than ~a month. */
function shortDate(iso: string, lang: Lang): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(
    lang === "ar" ? "ar-EG-u-nu-latn" : "en",
    { day: "numeric", month: "short" } // "12 Jan" / "12 يناير"
  ).format(d);
}

/**
 * Format a timestamp as a compact human relative label.
 * Buckets: <1min "just now" · minutes · hours · days · calendar date.
 */
export function timeAgo(iso: string, lang: Lang, now: number = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = now - then;
  const r = rtf(lang);

  if (diff < MINUTE) {
    return lang === "ar" ? "الآن" : "just now";
  }
  if (diff < HOUR) return r.format(-Math.floor(diff / MINUTE), "minute");
  if (diff < DAY) return r.format(-Math.floor(diff / HOUR), "hour");
  if (diff < 30 * DAY) return r.format(-Math.floor(diff / DAY), "day");
  return shortDate(iso, lang);
}
