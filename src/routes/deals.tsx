import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, Chip, Avatar, SectionTitle } from "@/components/mobile-shell";
import { IndianRupee, TrendingUp, Home as HomeIcon, Wallet, BadgePercent } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/deals")({
  head: () => ({ meta: [{ title: "Deals — AiddyBiz CRM" }] }),
  component: Deals,
});

type Deal = {
  name: string;
  project: string;
  amount: string;        // display: revenue
  amountNum: number;     // ₹ in Cr (for target math)
  units: number;         // number of units/plots/flats
  commissionPct: number; // agent commission %
  pct: number;           // deal progress
};

type Column = { key: "Negotiation" | "Booking" | "Closed Won"; tone: "warning" | "info" | "success"; deals: Deal[] };

const COLUMNS: Column[] = [
  {
    key: "Negotiation", tone: "warning", deals: [
      { name: "Priya Nair", project: "Prestige Lakeside", amount: "1.6 Cr", amountNum: 1.6, units: 1, commissionPct: 1.5, pct: 75 },
      { name: "Suresh Rao", project: "Brigade Cornerstone", amount: "2.8 Cr", amountNum: 2.8, units: 1, commissionPct: 1.8, pct: 60 },
    ],
  },
  {
    key: "Booking", tone: "info", deals: [
      { name: "Meera Joshi", project: "Sobha Dream Acres", amount: "1.1 Cr", amountNum: 1.1, units: 2, commissionPct: 2.0, pct: 85 },
    ],
  },
  {
    key: "Closed Won", tone: "success", deals: [
      { name: "Arvind Kumar", project: "Godrej Splendour", amount: "92 L", amountNum: 0.92, units: 1, commissionPct: 1.5, pct: 100 },
      { name: "Neha Patil", project: "Embassy Edge", amount: "3.5 Cr", amountNum: 3.5, units: 3, commissionPct: 2.2, pct: 100 },
    ],
  },
];

type Mode = "revenue" | "inventory" | "incentive";

const MODES: { key: Mode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "revenue",   label: "Revenue",   icon: IndianRupee },
  { key: "inventory", label: "Inventory", icon: HomeIcon },
  { key: "incentive", label: "Incentive", icon: BadgePercent },
];

const TARGETS: Record<Mode, { target: number; unitLabel: string; format: (n: number) => string }> = {
  revenue:   { target: 23,  unitLabel: "₹ Cr",   format: (n) => `₹${n.toFixed(2)} Cr` },
  inventory: { target: 20,  unitLabel: "units",  format: (n) => `${n} units` },
  incentive: { target: 0.6, unitLabel: "₹ Cr",   format: (n) => `₹${(n * 100).toFixed(1)} L` }, // n in Cr
};

function dealValue(d: Deal, mode: Mode): number {
  if (mode === "revenue") return d.amountNum;
  if (mode === "inventory") return d.units;
  return (d.amountNum * d.commissionPct) / 100;
}

function Deals() {
  const [mode, setMode] = useState<Mode>("revenue");

  const totals = useMemo(() => {
    const perColumn = COLUMNS.map((c) => ({
      key: c.key,
      value: c.deals.reduce((s, d) => s + dealValue(d, mode), 0),
      count: c.deals.length,
    }));
    const grand = perColumn.reduce((s, c) => s + c.value, 0);
    return { perColumn, grand };
  }, [mode]);

  const cfg = TARGETS[mode];
  const pctOfTarget = Math.min(100, Math.round((totals.grand / cfg.target) * 100));

  return (
    <MobileShell title="Deals">
      <div className="px-4 pt-4">
        {/* View toggle */}
        <div className="mb-3 flex items-center gap-1 rounded-full border border-border bg-surface p-0.5">
          {MODES.map((m) => {
            const active = mode === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`flex flex-1 items-center justify-center gap-1 rounded-full px-2 py-1.5 text-[11px] font-semibold transition ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                <m.icon className="h-3 w-3" /> {m.label}
              </button>
            );
          })}
        </div>

        <div className="card-soft relative overflow-hidden p-5">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/25 blur-2xl" />
          <p className="text-xs text-muted-foreground">
            {mode === "revenue" && "Forecast revenue this quarter"}
            {mode === "inventory" && "Units in pipeline this quarter"}
            {mode === "incentive" && "Your earned commission this quarter"}
          </p>
          <div className="mt-1 flex items-end gap-2">
            <p className="font-display text-3xl font-semibold">{cfg.format(totals.grand)}</p>
            <Chip tone="success"><TrendingUp className="h-3 w-3" />+18%</Chip>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-elevated">
            <div className="h-full grad-primary" style={{ width: `${pctOfTarget}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {pctOfTarget}% of {mode === "inventory" ? `${cfg.target} units` : cfg.format(cfg.target)} target
            {mode === "incentive" && (
              <span className="ml-1 inline-flex items-center gap-1 text-emerald-600">
                <Wallet className="h-3 w-3" /> personal
              </span>
            )}
          </p>
        </div>

        {COLUMNS.map((c) => {
          const total = totals.perColumn.find((x) => x.key === c.key)!;
          return (
            <div key={c.key}>
              <SectionTitle
                title={c.key}
                action={
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{cfg.format(total.value)}</span>
                    <Chip tone={c.tone}>{c.deals.length}</Chip>
                  </div>
                }
              />
              <ul className="space-y-2">
                {c.deals.map((d) => {
                  const v = dealValue(d, mode);
                  const display =
                    mode === "revenue" ? `₹${d.amount}` :
                    mode === "inventory" ? `${d.units} unit${d.units > 1 ? "s" : ""}` :
                    `₹${(v * 100).toFixed(2)} L`;
                  const sub =
                    mode === "incentive" ? `${d.commissionPct}% of ₹${d.amount}` : d.project;
                  return (
                    <li key={d.name} className="card-soft p-3">
                      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                        <Avatar name={d.name} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{d.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{sub}</p>
                        </div>
                        <p className="text-sm font-semibold">{display}</p>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-elevated">
                          <div className="h-full grad-primary" style={{ width: `${d.pct}%` }} />
                        </div>
                        <span className="text-[11px] text-muted-foreground">{d.pct}%</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </MobileShell>
  );
}
