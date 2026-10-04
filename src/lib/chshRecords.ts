/**
 * CHSH PERSONAL RECORDS — a tiny, typed localStorage Hall of Fame.
 *
 * Physics honesty carried over from the game: a personal-best S is only
 * recorded once every (x,y) setting pair has ≥ 8 samples (SIGNIFICANCE),
 * because S estimated from a handful of rounds is noise, not statistics.
 * Streaks, win-rate and lifetime rounds update every round.
 *
 * Everything is localStorage-only — no server, no cookies, no tracking.
 * The key is versioned so a future schema change invalidates cleanly.
 */

const STORAGE_KEY = "qrl-chsh-records-v1";

/** Minimum rounds in one sitting before a win-rate record counts. */
export const MIN_ROUNDS_FOR_WINRATE = 10;

export interface ChshRecords {
  /** Highest statistically-meaningful S ever measured in this browser. */
  bestS: number | null;
  /** Best win rate (percent) across a sitting of ≥ MIN_ROUNDS_FOR_WINRATE. */
  bestWinRatePct: number | null;
  /** How many rounds that record win-rate was achieved over. */
  bestWinRateRounds: number;
  /** Longest run of consecutive round wins. */
  bestStreak: number;
  /** Lifetime rounds played here — the "entanglement mileage". */
  totalRoundsEver: number;
  /** Whether Bell's inequality has ever been violated here. */
  violationEver: boolean;
  /** Coach preference persists across visits. */
  coachOn: boolean;
  /** Epoch ms of the last record update (shown as "last measured"). */
  updatedAt: number | null;
}

export const DEFAULT_RECORDS: ChshRecords = {
  bestS: null,
  bestWinRatePct: null,
  bestWinRateRounds: 0,
  bestStreak: 0,
  totalRoundsEver: 0,
  violationEver: false,
  coachOn: true,
  updatedAt: null,
};

/** Which records were freshly beaten this round — drives the "NEW!" flash. */
export interface FreshRecords {
  bestS: boolean;
  bestWinRate: boolean;
  bestStreak: boolean;
  violation: boolean;
}

export const NO_FRESH: FreshRecords = {
  bestS: false,
  bestWinRate: false,
  bestStreak: false,
  violation: false,
};

/** The per-round observable the game folds into the records. */
export interface RoundObservation {
  /** Session S value if statistically significant, else null. */
  significantS: number | null;
  /** Lifetime win rate after this round, if ≥ MIN_ROUNDS_FOR_WINRATE. */
  winRatePct: number | null;
  /** Rounds played in the current sitting (what the win rate is built on). */
  rounds: number;
  /** Win-streak length after this round. */
  streak: number;
  /** Did this round complete a Bell violation? */
  violatedNow: boolean;
}

const isFiniteNumber = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

/* ------------------------------------------------------------------ */
/*              External store (useSyncExternalStore-ready)            */
/* ------------------------------------------------------------------ */

/**
 * localStorage is the single source of truth; React subscribes to it.
 * A raw-string cache keeps getSnapshot() identity-stable between writes
 * (required by useSyncExternalStore), and same-tab writes — which do NOT
 * fire the native "storage" event — are broadcast manually.
 */

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined; // undefined = not read yet
let cachedValue: ChshRecords = { ...DEFAULT_RECORDS };

function emit(): void {
  for (const fn of listeners) fn();
}

/** Subscribe to records changes (same tab + cross tab via 'storage'). */
export function subscribeRecords(onChange: () => void): () => void {
  listeners.add(onChange);
  if (typeof window !== "undefined") {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) onChange();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(onChange);
      window.removeEventListener("storage", onStorage);
    };
  }
  return () => {
    listeners.delete(onChange);
  };
}

/** Snapshot for useSyncExternalStore — identity-stable between writes. */
export function getRecordsSnapshot(): ChshRecords {
  if (typeof window === "undefined") return SERVER_RECORDS;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (cachedRaw !== raw) {
    cachedRaw = raw;
    cachedValue = parse(raw);
  }
  return cachedValue;
}

/** Server snapshot — deterministic defaults, never touches storage. */
export const SERVER_RECORDS: ChshRecords = { ...DEFAULT_RECORDS };

/** Defensive parse — a corrupted payload degrades to defaults, never throws. */
function parse(raw: string | null): ChshRecords {
  if (!raw) return { ...DEFAULT_RECORDS };
  try {
    const o: unknown = JSON.parse(raw);
    if (typeof o !== "object" || o === null) return { ...DEFAULT_RECORDS };
    const r = o as Partial<ChshRecords>;
    return {
      bestS: isFiniteNumber(r.bestS) ? r.bestS : null,
      bestWinRatePct: isFiniteNumber(r.bestWinRatePct) ? r.bestWinRatePct : null,
      bestWinRateRounds: isFiniteNumber(r.bestWinRateRounds)
        ? Math.max(0, Math.floor(r.bestWinRateRounds))
        : 0,
      bestStreak: isFiniteNumber(r.bestStreak) ? Math.max(0, Math.floor(r.bestStreak)) : 0,
      totalRoundsEver: isFiniteNumber(r.totalRoundsEver)
        ? Math.max(0, Math.floor(r.totalRoundsEver))
        : 0,
      violationEver: r.violationEver === true,
      coachOn: r.coachOn !== false, // default ON
      updatedAt: isFiniteNumber(r.updatedAt) ? r.updatedAt : null,
    };
  } catch {
    return { ...DEFAULT_RECORDS };
  }
}

/** SSR-safe read: on the server this is always the defaults. */
export function loadRecords(): ChshRecords {
  if (typeof window === "undefined") return { ...DEFAULT_RECORDS };
  try {
    return parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return { ...DEFAULT_RECORDS };
  }
}

/** Best-effort write — private-mode browsers may refuse; the game keeps working. */
export function saveRecords(records: ChshRecords): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    /* storage unavailable — records live for this session only */
  }
}

/** Write AND notify React subscribers (same-tab writes need the manual emit). */
export function commitRecords(records: ChshRecords): void {
  saveRecords(records);
  emit();
}

/**
 * Fold one played round into the Hall of Fame.
 * Returns the next records AND which categories were freshly beaten,
 * so the UI can flash "NEW!" exactly once per record event.
 */
export function foldRound(
  prev: ChshRecords,
  obs: RoundObservation
): { next: ChshRecords; fresh: FreshRecords } {
  const fresh: FreshRecords = { ...NO_FRESH };
  const next: ChshRecords = {
    ...prev,
    totalRoundsEver: prev.totalRoundsEver + 1,
    updatedAt: Date.now(),
  };

  if (obs.significantS !== null) {
    if (prev.bestS === null || obs.significantS > prev.bestS) {
      next.bestS = obs.significantS;
      fresh.bestS = true;
    }
  }

  if (obs.winRatePct !== null) {
    if (prev.bestWinRatePct === null || obs.winRatePct > prev.bestWinRatePct) {
      next.bestWinRatePct = obs.winRatePct;
      next.bestWinRateRounds = obs.rounds;
      fresh.bestWinRate = true;
    }
  }

  if (obs.streak > prev.bestStreak) {
    next.bestStreak = obs.streak;
    fresh.bestStreak = true;
  }

  if (obs.violatedNow && !prev.violationEver) {
    next.violationEver = true;
    fresh.violation = true;
  }

  return { next, fresh };
}

/** Update ONLY the coach preference and broadcast. */
export function persistCoachPreference(on: boolean): ChshRecords {
  const merged = { ...getRecordsSnapshot(), coachOn: on };
  commitRecords(merged);
  return merged;
}
