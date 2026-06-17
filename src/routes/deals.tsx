import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, Chip, Avatar, SectionTitle } from "@/components/mobile-shell";
import { IndianRupee, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/deals")({
  head: () => ({ meta: [{ title: "Deals — AiddyBiz CRM" }] }),
  component: Deals,
});

const COLUMNS = [
  { key: "Negotiation", tone: "warning" as const, value: "₹6.8 Cr", deals: [
    { name: "Priya Nair", project: "Prestige Lakeside", amount: "1.6 Cr", pct: 75 },
    { name: "Suresh Rao", project: "Brigade Cornerstone", amount: "2.8 Cr", pct: 60 },
  ]},
  { key: "Booking", tone: "info" as const, value: "₹3.2 Cr", deals: [
    { name: "Meera Joshi", project: "Sobha Dream Acres", amount: "1.1 Cr", pct: 85 },
  ]},
  { key: "Closed Won", tone: "success" as const, value: "₹4.4 Cr", deals: [
    { name: "Arvind Kumar", project: "Godrej Splendour", amount: "92 L", pct: 100 },
    { name: "Neha Patil", project: "Embassy Edge", amount: "3.5 Cr", pct: 100 },
  ]},
];

function Deals() {
  return (
    <MobileShell title="Deals">
      <div className="px-4 pt-4">
        <div className="card-soft relative overflow-hidden p-5">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/25 blur-2xl" />
          <p className="text-xs text-muted-foreground">Forecast this quarter</p>
          <div className="mt-1 flex items-end gap-2">
            <p className="font-display text-3xl font-semibold">₹14.4 Cr</p>
            <Chip tone="success"><TrendingUp className="h-3 w-3" />+18%</Chip>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-elevated">
            <div className="h-full w-[62%] grad-primary" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">62% of ₹23 Cr target</p>
        </div>

        {COLUMNS.map((c) => (
          <div key={c.key}>
            <SectionTitle title={c.key} action={
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold"><IndianRupee className="mr-0.5 inline h-3 w-3" />{c.value.replace("₹", "")}</span>
                <Chip tone={c.tone}>{c.deals.length}</Chip>
              </div>
            } />
            <ul className="space-y-2">
              {c.deals.map((d) => (
                <li key={d.name} className="card-soft p-3">
                  <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                    <Avatar name={d.name} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{d.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{d.project}</p>
                    </div>
                    <p className="text-sm font-semibold">₹{d.amount}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-elevated">
                      <div className="h-full grad-primary" style={{ width: `${d.pct}%` }} />
                    </div>
                    <span className="text-[11px] text-muted-foreground">{d.pct}%</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </MobileShell>
  );
}
