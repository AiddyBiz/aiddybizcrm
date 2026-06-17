import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, Chip, SectionTitle } from "@/components/mobile-shell";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — AiddyBiz CRM" }] }),
  component: CalendarPage,
});

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const today = 17;

const EVENTS = [
  { time: "09:00", title: "Team standup", tone: "info" as const, sub: "Sales daily" },
  { time: "10:30", title: "Visit — Ananya Sharma", tone: "primary" as const, sub: "Prestige Lakeside" },
  { time: "12:00", title: "Follow-up call — Rohan", tone: "warning" as const, sub: "Sobha Dream Acres" },
  { time: "03:15", title: "Negotiation — Priya Nair", tone: "success" as const, sub: "Closing review" },
  { time: "06:00", title: "Builder meeting", tone: "info" as const, sub: "Brigade Group" },
];

function CalendarPage() {
  const [sel, setSel] = useState(today);
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <MobileShell title="Calendar">
      <div className="px-4 pt-4">
        <div className="card-soft p-4">
          <div className="flex items-center justify-between">
            <button className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated"><ChevronLeft className="h-4 w-4" /></button>
            <p className="font-display text-base font-semibold">June 2026</p>
            <button className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated"><ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
            {DAYS.map((d, i) => <span key={i}>{d}</span>)}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {Array.from({ length: 1 }).map((_, i) => <span key={`pad${i}`} />)}
            {days.map((d) => {
              const isSel = d === sel;
              const hasEvt = [4, 9, 12, 17, 19, 21, 24, 28].includes(d);
              return (
                <button key={d} onClick={() => setSel(d)} className={`relative aspect-square rounded-xl text-sm font-medium transition ${isSel ? "grad-primary text-primary-foreground" : d === today ? "border border-primary/40 text-primary" : "text-foreground/85 hover:bg-surface-elevated"}`}>
                  {d}
                  {hasEvt && !isSel && <span className="absolute inset-x-0 bottom-1 mx-auto h-1 w-1 rounded-full bg-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        <SectionTitle title="Wednesday, June 17" action={<Chip tone="primary">5 events</Chip>} />
        <ul className="relative space-y-2 before:absolute before:left-[58px] before:top-2 before:bottom-2 before:w-px before:bg-border">
          {EVENTS.map((e) => (
            <li key={e.title} className="relative grid grid-cols-[52px_auto_minmax(0,1fr)] items-start gap-3">
              <p className="pt-3 text-right text-xs font-semibold text-muted-foreground">{e.time}</p>
              <span className="mt-4 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
              <div className="card-soft flex-1 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{e.title}</p>
                  <Chip tone={e.tone}>{e.tone}</Chip>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{e.sub}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </MobileShell>
  );
}
