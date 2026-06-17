import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, Chip, Avatar, SectionTitle } from "@/components/mobile-shell";
import { MapPin, Clock, Navigation, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/visits")({
  head: () => ({ meta: [{ title: "Site Visits — AiddyBiz CRM" }] }),
  component: Visits,
});

const TODAY = [
  { time: "11:00 AM", lead: "Ananya Sharma", project: "Prestige Lakeside", addr: "Whitefield, Bengaluru", status: "Confirmed" },
  { time: "02:30 PM", lead: "Vikram Singh", project: "Embassy Edge", addr: "Hebbal, Bengaluru", status: "Pending" },
];
const UPCOMING = [
  { date: "Thu, 19", time: "10:00 AM", lead: "Karthik Reddy", project: "Godrej Splendour" },
  { date: "Sat, 21", time: "11:30 AM", lead: "Priya Nair", project: "Prestige Lakeside" },
  { date: "Sun, 22", time: "04:00 PM", lead: "Rohan Mehta", project: "Sobha Dream Acres" },
];

function Visits() {
  return (
    <MobileShell title="Site Visits">
      <div className="px-4 pt-4">
        <div className="card-soft relative overflow-hidden">
          <div className="grid-cols-2 grid">
            <div className="p-4">
              <p className="text-xs text-muted-foreground">This week</p>
              <p className="mt-1 font-display text-3xl font-semibold">6</p>
              <p className="text-xs text-muted-foreground">scheduled visits</p>
            </div>
            <div className="grid place-items-center bg-[radial-gradient(circle_at_30%_30%,oklch(0.88_0.19_125/0.25),transparent_70%)] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary"><CheckCircle2 className="h-4 w-4" /> 4 completed</div>
            </div>
          </div>
        </div>

        <SectionTitle title="Today" />
        <ul className="space-y-2">
          {TODAY.map((v, i) => (
            <li key={i} className="card-soft p-4">
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
            </li>
          ))}
        </ul>

        <SectionTitle title="Upcoming" />
        <ul className="card-soft divide-y divide-border/60 overflow-hidden">
          {UPCOMING.map((v, i) => (
            <li key={i} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3">
              <div className="rounded-xl bg-surface-elevated px-3 py-2 text-center">
                <p className="text-[10px] uppercase text-muted-foreground">{v.date.split(",")[0]}</p>
                <p className="font-display text-base font-semibold">{v.date.split(", ")[1]}</p>
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
    </MobileShell>
  );
}
