import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, Chip } from "@/components/mobile-shell";
import { Building2, MapPin, IndianRupee, Search } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — AiddyBiz CRM" }] }),
  component: Projects,
});

const PROJECTS = [
  { name: "Prestige Lakeside Habitat", loc: "Whitefield", price: "1.9 – 3.4 Cr", config: "2,3,4 BHK", status: "Ready", units: 28, hue: 125 },
  { name: "Sobha Dream Acres", loc: "Panathur", price: "85L – 1.4 Cr", config: "1,2 BHK", status: "Booking", units: 42, hue: 250 },
  { name: "Brigade Cornerstone", loc: "Whitefield", price: "2.5 – 4.1 Cr", config: "3,4 BHK", status: "U/C", units: 19, hue: 30 },
  { name: "Godrej Splendour", loc: "Belathur", price: "70 – 95L", config: "2,3 BHK", status: "Launch", units: 54, hue: 320 },
];

function Projects() {
  return (
    <MobileShell title="Projects">
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search projects, locations" className="min-w-0 flex-1 bg-transparent text-sm focus:outline-none" />
        </div>

        <div className="mt-3 -mx-4 overflow-x-auto px-4">
          <div className="flex gap-2 pb-1">
            {["All", "Ready", "Under Construction", "New Launch", "Premium"].map((t, i) => (
              <button key={t} className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${i === 0 ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface text-muted-foreground"}`}>{t}</button>
            ))}
          </div>
        </div>

        <ul className="mt-4 grid gap-3">
          {PROJECTS.map((p) => (
            <li key={p.name} className="card-soft overflow-hidden">
              <div
                className="relative h-28"
                style={{ background: `linear-gradient(135deg, oklch(0.78 0.16 ${p.hue}), oklch(0.45 0.14 ${(p.hue + 60) % 360}))` }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.18),transparent_60%)]" />
                <Building2 className="absolute right-4 top-4 h-10 w-10 text-white/40" />
                <Chip tone="primary"><span className="absolute left-3 top-3">{p.status}</span></Chip>
              </div>
              <div className="p-4">
                <p className="font-display text-base font-semibold">{p.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{p.loc}</p>
                <div className="mt-3 flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 font-semibold"><IndianRupee className="h-3 w-3" />{p.price}</span>
                  <span className="text-muted-foreground">· {p.config}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{p.units} active leads</span>
                  <button className="rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold text-primary">View details</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </MobileShell>
  );
}
