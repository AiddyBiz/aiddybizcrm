import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, Avatar, Chip } from "@/components/mobile-shell";
import { Phone, MessageCircle, Check, Clock, CalendarClock } from "lucide-react";
import { useMemo, useState } from "react";
import { openQuickAdd } from "@/lib/quick-add-store";

export const Route = createFileRoute("/followups")({
  head: () => ({ meta: [{ title: "Follow-ups — AiddyBiz CRM" }] }),
  component: FollowUps,
});

type FollowItem = {
  id: string;
  name: string;
  phone: string;
  project: string;
  due: Date;
  type: "Call" | "WhatsApp" | "Email";
  priority: "high" | "med" | "low";
};

const NOW = new Date();
function at(daysOffset: number, h: number, m = 0): Date {
  const d = new Date(NOW);
  d.setDate(d.getDate() + daysOffset);
  d.setHours(h, m, 0, 0);
  return d;
}

const SEED: FollowItem[] = [
  { id: "f1", name: "Ananya Sharma",  phone: "+919812345612", project: "Prestige Lakeside",      due: at(0, 10, 30), type: "Call",     priority: "high" },
  { id: "f2", name: "Rohan Mehta",    phone: "+919876543244", project: "Sobha Dream Acres",     due: at(0, 12, 0),  type: "WhatsApp", priority: "med" },
  { id: "f3", name: "Kavya Iyer",     phone: "+919001234508", project: "Brigade Cornerstone",   due: at(0, 15, 15), type: "Call",     priority: "high" },
  { id: "f4", name: "Karthik Reddy",  phone: "+918812345691", project: "Godrej Splendour",      due: at(1, 11, 0),  type: "Email",    priority: "low" },
  { id: "f5", name: "Priya Nair",     phone: "+918012345633", project: "Prestige Lakeside",     due: at(2, 14, 30), type: "Call",     priority: "med" },
  { id: "f6", name: "Vikram Singh",   phone: "+917012345617", project: "Embassy Edge",          due: at(-1, 9, 0),  type: "Call",     priority: "high" },
  { id: "f7", name: "Neha Gupta",     phone: "+917722345617", project: "Sobha Dream Acres",     due: at(-2, 16, 0), type: "WhatsApp", priority: "med" },
];

function FollowUps() {
  const [tab, setTab] = useState<"Overdue" | "Today" | "Upcoming">("Today");
  const [done, setDone] = useState<Set<string>>(new Set());

  const buckets = useMemo(() => {
    const startOfToday = new Date(NOW); startOfToday.setHours(0, 0, 0, 0);
    const startOfTomorrow = new Date(startOfToday); startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    const overdue: FollowItem[] = [], today: FollowItem[] = [], upcoming: FollowItem[] = [];
    for (const i of SEED) {
      if (done.has(i.id)) continue;
      if (i.due < startOfToday) overdue.push(i);
      else if (i.due < startOfTomorrow) today.push(i);
      else upcoming.push(i);
    }
    overdue.sort((a, b) => b.due.getTime() - a.due.getTime());
    today.sort((a, b) => a.due.getTime() - b.due.getTime());
    upcoming.sort((a, b) => a.due.getTime() - b.due.getTime());
    return { overdue, today, upcoming };
  }, [done]);

  const items =
    tab === "Overdue" ? buckets.overdue :
    tab === "Today"   ? buckets.today   :
                        buckets.upcoming;

  const fmtTime = (d: Date) => {
    const sameDay = d.toDateString() === NOW.toDateString();
    return sameDay
      ? d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
      : d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true });
  };

  return (
    <MobileShell title="Follow-ups">
      <div className="px-4 pt-4">
        <div className="card-soft grid grid-cols-3 divide-x divide-border/60 p-4 text-center">
          {[
            { v: String(buckets.overdue.length),  l: "Overdue",  t: "destructive" as const },
            { v: String(buckets.today.length),    l: "Today",    t: "primary"     as const },
            { v: String(buckets.upcoming.length), l: "Upcoming", t: "info"        as const },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display text-2xl font-semibold">{s.v}</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          {(["Overdue", "Today", "Upcoming"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-full border px-3 py-2 text-xs font-semibold ${tab === t ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface text-muted-foreground"}`}>{t}</button>
          ))}
        </div>

        <ul className="mt-4 space-y-2">
          {items.length === 0 && (
            <li className="card-soft p-6 text-center text-xs text-muted-foreground">
              Nothing in {tab.toLowerCase()} — great job staying on top!
            </li>
          )}
          {items.map((i) => {
            const digits = i.phone.replace(/[^\d]/g, "");
            return (
              <li key={i.id} className="card-soft p-3">
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                  <Avatar name={i.name} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{i.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{i.project}</p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />{fmtTime(i.due)} · {i.type}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Chip tone={i.priority === "high" ? "destructive" : i.priority === "med" ? "warning" : "default"}>{i.priority}</Chip>
                    <div className="flex gap-1.5">
                      <a href={`tel:${i.phone}`} aria-label="Call" className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated"><Phone className="h-3.5 w-3.5 text-primary" /></a>
                      <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" aria-label="Message" className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated"><MessageCircle className="h-3.5 w-3.5 text-info" /></a>
                      <button
                        onClick={() => setDone((s) => new Set(s).add(i.id))}
                        aria-label="Mark done"
                        className="grid h-8 w-8 place-items-center rounded-full bg-primary/20 hover:bg-primary/30"
                      >
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <button
          onClick={() => openQuickAdd("followup")}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3 text-sm font-semibold"
        >
          <CalendarClock className="h-4 w-4" /> Schedule new follow-up
        </button>
      </div>
    </MobileShell>
  );
}
