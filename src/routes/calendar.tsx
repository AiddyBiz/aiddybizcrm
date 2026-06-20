import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, Chip } from "@/components/mobile-shell";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Phone, Users, ClipboardList, Activity } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — AiddyBiz CRM" }] }),
  component: CalendarPage,
});

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

type EntryKind = "activity" | "task" | "lead";
type Entry = { id: string; date: string; kind: EntryKind; time: string; title: string; sub: string; tone: "info" | "primary" | "warning" | "success" };

function isoDay(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const today = new Date();
const TODAY = isoDay(today);
const TOMORROW = isoDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
const YDAY = isoDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1));

const ENTRIES: Entry[] = [
  { id: "e1", date: TODAY,    kind: "activity", time: "09:00", title: "Team standup",              sub: "Sales daily",          tone: "info" },
  { id: "e2", date: TODAY,    kind: "lead",     time: "10:30", title: "Visit — Ananya Sharma",     sub: "Prestige Lakeside",    tone: "primary" },
  { id: "e3", date: TODAY,    kind: "task",     time: "12:00", title: "Call back Rohan",           sub: "Sobha Dream Acres",    tone: "warning" },
  { id: "e4", date: TODAY,    kind: "activity", time: "15:15", title: "Negotiation — Priya Nair",  sub: "Closing review",       tone: "success" },
  { id: "e5", date: TODAY,    kind: "task",     time: "18:00", title: "Builder meeting",           sub: "Brigade Group",        tone: "info" },
  { id: "e6", date: TOMORROW, kind: "task",     time: "10:00", title: "Send brochure to Karthik",  sub: "Godrej Splendour",     tone: "info" },
  { id: "e7", date: YDAY,     kind: "lead",     time: "16:45", title: "New lead: Neha Gupta",      sub: "Sobha Dream Acres",    tone: "primary" },
];

function CalendarPage() {
  const [sel, setSel] = useState<string>(TODAY);
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<EntryKind | "all">("all");

  // Week containing selected date
  const weekDays = useMemo(() => {
    const base = new Date(sel);
    const dow = base.getDay();
    const start = new Date(base); start.setDate(base.getDate() - dow);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i);
      return d;
    });
  }, [sel]);

  const monthDays = useMemo(() => {
    const base = new Date(sel);
    const first = new Date(base.getFullYear(), base.getMonth(), 1);
    const last = new Date(base.getFullYear(), base.getMonth() + 1, 0);
    const pad = first.getDay();
    const cells: (Date | null)[] = Array.from({ length: pad }, () => null);
    for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(base.getFullYear(), base.getMonth(), d));
    return cells;
  }, [sel]);

  const dayEntries = useMemo(() => ENTRIES.filter((e) => e.date === sel), [sel]);
  const visible = useMemo(
    () => (tab === "all" ? dayEntries : dayEntries.filter((e) => e.kind === tab)),
    [dayEntries, tab]
  );

  const monthName = new Date(sel).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const selectedFull = new Date(sel).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });

  function moveMonth(delta: number) {
    const d = new Date(sel);
    d.setMonth(d.getMonth() + delta);
    setSel(isoDay(d));
  }

  function renderDay(d: Date) {
    const iso = isoDay(d);
    const isSel = iso === sel;
    const isToday = iso === TODAY;
    const has = ENTRIES.some((e) => e.date === iso);
    return (
      <button key={iso} onClick={() => setSel(iso)} className={`relative aspect-square rounded-xl text-sm font-medium transition ${isSel ? "grad-primary text-primary-foreground shadow" : isToday ? "border border-primary/40 text-primary" : "text-foreground/85 hover:bg-surface-elevated"}`}>
        {d.getDate()}
        {has && !isSel && <span className="absolute inset-x-0 bottom-1 mx-auto h-1 w-1 rounded-full bg-primary" />}
      </button>
    );
  }

  return (
    <MobileShell title="Calendar">
      <div className="px-4 pt-4">
        <div className="card-soft p-4">
          <div className="flex items-center justify-between">
            <button onClick={() => moveMonth(-1)} className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated"><ChevronLeft className="h-4 w-4" /></button>
            <p className="font-display text-base font-semibold">{monthName}</p>
            <button onClick={() => moveMonth(1)} className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated"><ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
            {DAY_LABELS.map((d, i) => <span key={i}>{d}</span>)}
          </div>

          {!expanded ? (
            <div className="mt-2 grid grid-cols-7 gap-1">
              {weekDays.map(renderDay)}
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-7 gap-1">
              {monthDays.map((d, i) => d ? renderDay(d) : <span key={`pad-${i}`} />)}
            </div>
          )}

          <button
            onClick={() => setExpanded((v) => !v)}
            className="mx-auto mt-3 flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-[10px] font-semibold text-muted-foreground hover:bg-surface-elevated"
          >
            {expanded ? <><ChevronUp className="h-3 w-3" /> Collapse to week</> : <><ChevronDown className="h-3 w-3" /> Expand to month</>}
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-foreground">{selectedFull}</h2>
          <Chip tone="primary">{dayEntries.length} entries</Chip>
        </div>

        {/* Sub-tabs: Activity / Task / Lead */}
        <div className="mt-3 grid grid-cols-4 gap-1 rounded-xl border border-border bg-surface p-1">
          {([
            { k: "all",      l: "All",      i: Activity },
            { k: "activity", l: "Activity", i: Activity },
            { k: "task",     l: "Task",     i: ClipboardList },
            { k: "lead",     l: "Lead",     i: Users },
          ] as const).map((x) => (
            <button key={x.k} onClick={() => setTab(x.k)} className={`flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition ${tab === x.k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-surface-elevated"}`}>
              <x.i className="h-3 w-3" /> {x.l}
            </button>
          ))}
        </div>

        <ul className="mt-3 relative space-y-2 before:absolute before:left-[58px] before:top-2 before:bottom-2 before:w-px before:bg-border">
          {visible.length === 0 && (
            <li className="card-soft p-6 text-center text-xs text-muted-foreground">No {tab === "all" ? "entries" : tab + "s"} on this day</li>
          )}
          {visible.map((e) => (
            <li key={e.id} className="relative grid grid-cols-[52px_auto_minmax(0,1fr)] items-start gap-3">
              <p className="pt-3 text-right text-xs font-semibold text-muted-foreground">{e.time}</p>
              <span className="mt-4 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
              <div className="card-soft flex-1 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{e.title}</p>
                  <Chip tone={e.tone}>{e.kind}</Chip>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{e.sub}</p>
                {e.kind === "lead" && (
                  <a href="tel:+910000000000" className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    <Phone className="h-3 w-3" /> Quick call
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </MobileShell>
  );
}
