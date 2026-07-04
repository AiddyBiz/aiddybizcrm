// Pipeline definition, validation and progress helpers.

export const PIPELINE = [
  { name: "New Lead",             rank: 1,  pct: 0   },
  { name: "Call Not Connected",   rank: 2,  pct: 0   },
  { name: "Call Connected",       rank: 3,  pct: 5   },
  { name: "Call Back",            rank: 4,  pct: 10  },
  { name: "Interested",           rank: 5,  pct: 15  },
  { name: "Brochure Sent",        rank: 6,  pct: 20  },
  { name: "Site Visit Scheduled", rank: 7,  pct: 40  },
  { name: "Site Visit Done",      rank: 8,  pct: 60  },
  { name: "Negotiation",          rank: 9,  pct: 80  },
  { name: "Booking",              rank: 10, pct: 95  },
  { name: "Closure",              rank: 11, pct: 100 },
] as const;

export const TERMINAL = ["Not Interested", "Rejected", "Junk"] as const;

export type PipelineStatus = typeof PIPELINE[number]["name"] | typeof TERMINAL[number];

export const ALL_STATUSES: PipelineStatus[] = [
  ...PIPELINE.map((p) => p.name),
  ...TERMINAL,
] as PipelineStatus[];

export function isTerminal(s: string): boolean {
  return (TERMINAL as readonly string[]).includes(s);
}

export function getMeta(s: string): { rank: number; pct: number; terminal: boolean } {
  const p = PIPELINE.find((x) => x.name === s);
  if (p) return { rank: p.rank, pct: p.pct, terminal: false };
  if (isTerminal(s)) return { rank: 0, pct: 0, terminal: true };
  return { rank: 0, pct: 0, terminal: false };
}

export type TransitionResult = { ok: boolean; reason?: string };

/**
 * Rules:
 *  - Same status → allowed (no-op).
 *  - Terminal target → always allowed from anywhere.
 *  - Terminal source → allowed to move to any status (revive).
 *  - Otherwise: only equal-or-higher rank is allowed.
 */
export function canTransition(from: string, to: string): TransitionResult {
  if (from === to) return { ok: true };
  if (isTerminal(to)) return { ok: true };
  if (isTerminal(from)) return { ok: true };
  const a = getMeta(from).rank;
  const b = getMeta(to).rank;
  if (b < a) {
    return {
      ok: false,
      reason: "Downgrade not allowed! Leads cannot move backwards in the pipeline.",
    };
  }
  return { ok: true };
}

export type ProgressPalette = {
  bar: string;      // tailwind bg-* for filled bar
  track: string;    // tailwind bg-* for track
  chipBg: string;   // tailwind bg-* / text-* for status chip
  text: string;     // tailwind text-*
  label: string;    // color meaning
};

export function progressPalette(status: string): ProgressPalette {
  const { pct, terminal } = getMeta(status);
  if (terminal) return { bar: "bg-red-500",       track: "bg-red-100",      chipBg: "bg-red-100",       text: "text-red-700",       label: "Lost" };
  if (pct <= 10) return { bar: "bg-slate-400",    track: "bg-slate-100",    chipBg: "bg-slate-100",     text: "text-slate-700",     label: "Cold" };
  if (pct <= 40) return { bar: "bg-amber-500",    track: "bg-amber-100",    chipBg: "bg-amber-100",     text: "text-amber-700",     label: "Warm" };
  if (pct <= 80) return { bar: "bg-blue-500",     track: "bg-blue-100",     chipBg: "bg-blue-100",      text: "text-blue-700",      label: "Hot" };
  return { bar: "bg-emerald-500", track: "bg-emerald-100", chipBg: "bg-emerald-100", text: "text-emerald-700", label: "Won" };
}
