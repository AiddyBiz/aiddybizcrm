import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell, Chip, Avatar } from "@/components/mobile-shell";
import { Search, SlidersHorizontal, Phone, MessageCircle, Flame, Plus, X, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { LEADS } from "@/lib/leads-data";
import { useLeads } from "@/lib/leads-store";
import { getMeta, progressPalette } from "@/lib/pipeline";
import { openQuickAdd } from "@/lib/quick-add-store";

export const Route = createFileRoute("/leads/")({
  head: () => ({ meta: [{ title: "Leads — AiddyBiz CRM" }] }),
  component: Leads,
});

const TABS = ["All", "New", "Qualified", "Visit", "Negotiation", "Closed"];
const PROJECTS = Array.from(new Set(LEADS.map((l) => l.project)));
const SOURCES = Array.from(new Set(LEADS.map((l) => l.source)));
const STAGES_ALL = ["New", "Qualified", "Visit", "Negotiation", "Closed"];
const RANGES = [
  { label: "All time", days: 0 },
  { label: "Today", days: 1 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
];

type Filters = { stages: string[]; projects: string[]; sources: string[]; days: number };
const EMPTY: Filters = { stages: [], projects: [], sources: [], days: 0 };

function Leads() {
  const allLeads = useLeads();
  const [tab, setTab] = useState("All");
  const [q, setQ] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const activeFilterCount = filters.stages.length + filters.projects.length + filters.sources.length + (filters.days > 0 ? 1 : 0);

  const filtered = useMemo(() => {
    let base = tab === "All" ? allLeads : allLeads.filter((l) => l.stage === tab);
    if (filters.stages.length) base = base.filter((l) => filters.stages.includes(l.stage));
    if (filters.projects.length) base = base.filter((l) => filters.projects.includes(l.project));
    if (filters.sources.length) base = base.filter((l) => filters.sources.includes(l.source));
    if (filters.days > 0) {
      const cutoff = Date.now() - filters.days * 86400000;
      base = base.filter((l) => new Date(l.createdAt).getTime() >= cutoff);
    }
    const term = q.trim().toLowerCase();
    if (!term) return base;
    return base.filter((l) =>
      l.name.toLowerCase().includes(term) ||
      l.project.toLowerCase().includes(term) ||
      l.phone.includes(term)
    );
  }, [tab, q, filters]);

  return (
    <MobileShell title="Leads">
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, phone, project" className="min-w-0 flex-1 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none" />
          </div>
          <button onClick={() => setFilterOpen(true)} aria-label="Filter leads"
            className="relative grid h-11 w-11 place-items-center rounded-2xl border border-border bg-surface">
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">{activeFilterCount}</span>
            )}
          </button>
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

      {filterOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/50 sm:items-center" onClick={() => setFilterOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl max-h-[85vh] overflow-y-auto">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Filter leads</h3>
              <button onClick={() => setFilterOpen(false)} className="grid h-8 w-8 place-items-center rounded-md hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>

            <FilterGroup title="Date">
              <div className="flex flex-wrap gap-2">
                {RANGES.map((r) => (
                  <PillBtn key={r.label} active={filters.days === r.days}
                    onClick={() => setFilters((f) => ({ ...f, days: r.days }))}>{r.label}</PillBtn>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Status">
              <div className="flex flex-wrap gap-2">
                {STAGES_ALL.map((s) => (
                  <PillBtn key={s} active={filters.stages.includes(s)}
                    onClick={() => setFilters((f) => ({ ...f, stages: toggle(f.stages, s) }))}>{s}</PillBtn>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Project">
              <div className="flex flex-wrap gap-2">
                {PROJECTS.map((p) => (
                  <PillBtn key={p} active={filters.projects.includes(p)}
                    onClick={() => setFilters((f) => ({ ...f, projects: toggle(f.projects, p) }))}>{p}</PillBtn>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Source">
              <div className="flex flex-wrap gap-2">
                {SOURCES.map((s) => (
                  <PillBtn key={s} active={filters.sources.includes(s)}
                    onClick={() => setFilters((f) => ({ ...f, sources: toggle(f.sources, s) }))}>{s}</PillBtn>
                ))}
              </div>
            </FilterGroup>

            <div className="mt-5 flex gap-2">
              <button onClick={() => setFilters(EMPTY)} className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Reset</button>
              <button onClick={() => setFilterOpen(false)} className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700">Apply</button>
            </div>
          </div>
        </div>
      )}
    </MobileShell>
  );
}

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{title}</p>
      {children}
    </div>
  );
}

function PillBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
      {active && <Check className="h-3 w-3" />}
      {children}
    </button>
  );
}
