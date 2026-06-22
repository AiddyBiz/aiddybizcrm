import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, Chip, Avatar, SectionTitle } from "@/components/mobile-shell";
import { MapPin, Clock, Navigation, CheckCircle2, X as XIcon, ThumbsUp, Brain, ThumbsDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/visits")({
  head: () => ({ meta: [{ title: "Site Visits — AiddyBiz CRM" }] }),
  component: Visits,
});

const TODAY = [
  { id: "1", time: "11:00 AM", lead: "Ananya Sharma", project: "Aiddy Green Acres", addr: "Devanahalli, Bengaluru", status: "Confirmed" },
  { id: "2", time: "02:30 PM", lead: "Vikram Singh", project: "Lakeview Township", addr: "Sarjapur, Bengaluru", status: "Pending" },
];
const UPCOMING = [
  { date: "Thu, 19", time: "10:00 AM", lead: "Karthik Reddy", project: "Sunrise Villas" },
  { date: "Sat, 21", time: "11:30 AM", lead: "Priya Nair", project: "Aiddy Green Acres" },
  { date: "Sun, 22", time: "04:00 PM", lead: "Rohan Mehta", project: "Palm Farmhouses" },
];

function Visits() {
  const [outcomeFor, setOutcomeFor] = useState<string | null>(null);

  return (
    <MobileShell title="Site Visits">
      <div className="px-4 pt-4">
        {/* Flow strip */}
        <div className="card-soft p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Visit flow</p>
          <div className="h-scroll -mx-4 mt-2 px-4">
            <div className="flex w-max items-center gap-2 whitespace-nowrap text-[11px] font-medium">
              {["Lead", "Schedule", "Completed", "Outcome"].map((s, i) => (
                <span key={s} className="flex shrink-0 items-center gap-2">
                  <span className={`grid h-7 w-7 place-items-center rounded-full ${i <= 2 ? "grad-primary text-primary-foreground" : "bg-surface-elevated text-muted-foreground"}`}>{i + 1}</span>
                  {s}
                  {i < 3 && <span className="text-muted-foreground">→</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 card-soft relative overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="p-4">
              <p className="text-xs text-muted-foreground">This week</p>
              <p className="mt-1 text-3xl font-semibold">6</p>
              <p className="text-xs text-muted-foreground">scheduled visits</p>
            </div>
            <div className="grid place-items-center bg-[radial-gradient(circle_at_30%_30%,oklch(0.705_0.17_162/0.25),transparent_70%)] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary"><CheckCircle2 className="h-4 w-4" /> 4 completed</div>
            </div>
          </div>
        </div>

        <SectionTitle title="Today" />
        <ul className="space-y-2">
          {TODAY.map((v) => (
            <li key={v.id} className="card-soft p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />{v.time}</div>
                <Chip tone={v.status === "Confirmed" ? "success" : "warning"}>{v.status}</Chip>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Avatar name={v.lead} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{v.lead}</p>
                  <p className="truncate text-xs text-muted-foreground">{v.project}</p>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-surface-elevated p-3 text-xs">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <p className="flex-1 text-muted-foreground">{v.addr}</p>
                <button className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">Directions</button>
              </div>
              <button onClick={() => setOutcomeFor(v.id)} className="mt-3 w-full rounded-full border border-primary/40 bg-primary/10 py-2 text-xs font-semibold text-primary">
                Mark completed
              </button>
            </li>
          ))}
        </ul>

        <SectionTitle title="Upcoming" />
        <ul className="card-soft divide-y divide-border/60 overflow-hidden">
          {UPCOMING.map((v, i) => (
            <li key={i} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3">
              <div className="rounded-xl bg-surface-elevated px-3 py-2 text-center">
                <p className="text-[10px] uppercase text-muted-foreground">{v.date.split(",")[0]}</p>
                <p className="text-base font-semibold">{v.date.split(", ")[1]}</p>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{v.lead}</p>
                <p className="truncate text-xs text-muted-foreground">{v.project} · {v.time}</p>
              </div>
              <button className="grid h-9 w-9 place-items-center rounded-full bg-surface-elevated"><Navigation className="h-4 w-4 text-primary" /></button>
            </li>
          ))}
        </ul>
      </div>

      {/* Outcome sheet */}
      {outcomeFor && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setOutcomeFor(null)} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-surface-elevated p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold">Visit outcome</h3>
              <button onClick={() => setOutcomeFor(null)} className="grid h-8 w-8 place-items-center rounded-full bg-surface"><XIcon className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { l: "Interested", icon: ThumbsUp, tone: "grad-primary text-primary-foreground" },
                { l: "Thinking", icon: Brain, tone: "bg-surface text-foreground" },
                { l: "Not Interested", icon: ThumbsDown, tone: "bg-surface text-foreground" },
              ].map((o) => (
                <button key={o.l} onClick={() => setOutcomeFor(null)} className={`flex flex-col items-center gap-2 rounded-2xl p-4 text-xs font-semibold ${o.tone}`}>
                  <o.icon className="h-5 w-5" />
                  {o.l}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              placeholder="Add notes about the visit…"
              className="mt-3 w-full resize-none rounded-2xl border border-border bg-surface p-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      )}
    </MobileShell>
  );
}
