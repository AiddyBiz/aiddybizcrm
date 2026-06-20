import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell, Chip, Avatar } from "@/components/mobile-shell";
import { Search, SlidersHorizontal, Phone, MessageCircle, Flame, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { LEADS } from "@/lib/leads-data";
import { openQuickAdd } from "@/lib/quick-add-store";

export const Route = createFileRoute("/leads/")({
  head: () => ({ meta: [{ title: "Leads — AiddyBiz CRM" }] }),
  component: Leads,
});

const TABS = ["All", "New", "Qualified", "Visit", "Negotiation", "Closed"];

function Leads() {
  const [tab, setTab] = useState("All");
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const base = tab === "All" ? LEADS : LEADS.filter((l) => l.stage === tab);
    const term = q.trim().toLowerCase();
    if (!term) return base;
    return base.filter((l) =>
      l.name.toLowerCase().includes(term) ||
      l.project.toLowerCase().includes(term) ||
      l.phone.includes(term)
    );
  }, [tab, q]);

  return (
    <MobileShell title="Leads">
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, phone, project" className="min-w-0 flex-1 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none" />
          </div>
          <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-surface"><SlidersHorizontal className="h-4 w-4" /></button>
          <button onClick={() => openQuickAdd("lead")} aria-label="Add lead"
            className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700">
            <Plus className="h-4 w-4" />
          </button>
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
          {filtered.map((l) => {
            const digits = l.phone.replace(/[^\d]/g, "");
            return (
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
                        <a href={`tel:${l.phone}`} onClick={(e) => e.stopPropagation()} className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated"><Phone className="h-3.5 w-3.5 text-primary" /></a>
                        <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated"><MessageCircle className="h-3.5 w-3.5 text-info" /></a>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </MobileShell>
  );
}
