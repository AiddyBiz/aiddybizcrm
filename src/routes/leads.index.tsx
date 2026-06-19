import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell, Chip, Avatar } from "@/components/mobile-shell";
import { Search, SlidersHorizontal, Phone, MessageCircle, Flame } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/leads/")({
  head: () => ({ meta: [{ title: "Leads — AiddyBiz CRM" }] }),
  component: Leads,
});

const TABS = ["All", "New", "Qualified", "Visit", "Negotiation", "Closed"];

const LEADS = [
  { id: "1", name: "Ananya Sharma", project: "Prestige Lakeside", phone: "+91 98•••••12", budget: "1.8–2.2 Cr", stage: "Qualified", score: 92, hot: true },
  { id: "2", name: "Rohan Mehta", project: "Sobha Dream Acres", phone: "+91 99•••••44", budget: "85L–1.1 Cr", stage: "New", score: 78, hot: true },
  { id: "3", name: "Kavya Iyer", project: "Brigade Cornerstone", phone: "+91 90•••••08", budget: "2.5–3 Cr", stage: "Visit", score: 81, hot: false },
  { id: "4", name: "Karthik Reddy", project: "Godrej Splendour", phone: "+91 88•••••91", budget: "70–90L", stage: "New", score: 64, hot: false },
  { id: "5", name: "Priya Nair", project: "Prestige Lakeside", phone: "+91 80•••••33", budget: "1.4–1.6 Cr", stage: "Negotiation", score: 88, hot: true },
  { id: "6", name: "Vikram Singh", project: "Embassy Edge", phone: "+91 70•••••17", budget: "60–75L", stage: "New", score: 52, hot: false },
];

function Leads() {
  const [tab, setTab] = useState("All");
  const filtered = tab === "All" ? LEADS : LEADS.filter((l) => l.stage === tab);
  return (
    <MobileShell title="Leads">
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Search by name, phone, project" className="min-w-0 flex-1 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none" />
          </div>
          <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-surface"><SlidersHorizontal className="h-4 w-4" /></button>
        </div>

        <div className="mt-3 -mx-4 overflow-x-auto px-4">
          <div className="flex gap-2 pb-1">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${tab === t ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface text-muted-foreground"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 px-1 text-xs text-muted-foreground">{filtered.length} leads</p>

        <ul className="mt-2 space-y-2">
          {filtered.map((l) => (
            <li key={l.id}>
              <Link to="/leads/$id" params={{ id: l.id }} className="card-soft block p-3">
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                  <Avatar name={l.name} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">{l.name}</p>
                      {l.hot && <Chip tone="primary"><Flame className="h-3 w-3" />{l.score}</Chip>}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{l.project} · {l.budget}</p>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{l.phone}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Chip tone={l.stage === "Closed" ? "success" : l.stage === "Negotiation" ? "warning" : "info"}>{l.stage}</Chip>
                    <div className="flex gap-1.5">
                      <button className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated"><Phone className="h-3.5 w-3.5 text-primary" /></button>
                      <button className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated"><MessageCircle className="h-3.5 w-3.5 text-info" /></button>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </MobileShell>
  );
}
