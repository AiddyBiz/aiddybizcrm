import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, Avatar, Chip } from "@/components/mobile-shell";
import { Phone, MessageCircle, Check, Clock, CalendarClock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/followups")({
  head: () => ({ meta: [{ title: "Follow-ups — AiddyBiz CRM" }] }),
  component: FollowUps,
});

const ITEMS = [
  { name: "Ananya Sharma", project: "Prestige Lakeside", due: "10:30 AM", type: "Call", priority: "high" },
  { name: "Rohan Mehta", project: "Sobha Dream Acres", due: "12:00 PM", type: "WhatsApp", priority: "med" },
  { name: "Kavya Iyer", project: "Brigade Cornerstone", due: "03:15 PM", type: "Call", priority: "high" },
  { name: "Karthik Reddy", project: "Godrej Splendour", due: "Tomorrow", type: "Email", priority: "low" },
  { name: "Priya Nair", project: "Prestige Lakeside", due: "Tomorrow", type: "Call", priority: "med" },
];

function FollowUps() {
  const [tab, setTab] = useState("Today");
  return (
    <MobileShell title="Follow-ups">
      <div className="px-4 pt-4">
        <div className="card-soft grid grid-cols-3 divide-x divide-border/60 p-4 text-center">
          {[
            { v: "14", l: "Today", t: "primary" },
            { v: "8", l: "Overdue", t: "destructive" },
            { v: "23", l: "This week", t: "info" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display text-2xl font-semibold">{s.v}</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          {["Today", "Overdue", "Upcoming"].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-full border px-3 py-2 text-xs font-semibold ${tab === t ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface text-muted-foreground"}`}>{t}</button>
          ))}
        </div>

        <ul className="mt-4 space-y-2">
          {ITEMS.map((i, idx) => (
            <li key={idx} className="card-soft p-3">
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <Avatar name={i.name} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{i.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{i.project}</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />{i.due} · {i.type}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Chip tone={i.priority === "high" ? "destructive" : i.priority === "med" ? "warning" : "default"}>{i.priority}</Chip>
                  <div className="flex gap-1.5">
                    <button className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated"><Phone className="h-3.5 w-3.5 text-primary" /></button>
                    <button className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated"><MessageCircle className="h-3.5 w-3.5 text-info" /></button>
                    <button className="grid h-8 w-8 place-items-center rounded-full bg-primary/20"><Check className="h-3.5 w-3.5 text-primary" /></button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3 text-sm font-semibold"><CalendarClock className="h-4 w-4" /> Schedule new follow-up</button>
      </div>
    </MobileShell>
  );
}
