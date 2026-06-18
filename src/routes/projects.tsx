import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, Chip, SectionTitle } from "@/components/mobile-shell";
import { Building2, MapPin, IndianRupee, Search, Eye, Download, Repeat, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — AiddyBiz CRM" }] }),
  component: Projects,
});

const PROJECTS = [
  { name: "Aiddy Green Acres", type: "Plotting", loc: "Devanahalli", price: "45 – 85L", config: "1200–2400 sqft", status: "Booking", hue: 162, views: 1240, downloads: 184, revisits: 92, priceViews: 312, leads: 42 },
  { name: "Lakeview Township", type: "Gated Township", loc: "Sarjapur", price: "1.2 – 2.4 Cr", config: "Villas + Plots", status: "Launch", hue: 200, views: 980, downloads: 142, revisits: 64, priceViews: 248, leads: 28 },
  { name: "Sunrise Villas", type: "Villas", loc: "Whitefield", price: "2.5 – 4.1 Cr", config: "3,4 BHK", status: "U/C", hue: 30, views: 612, downloads: 88, revisits: 41, priceViews: 156, leads: 19 },
  { name: "Palm Farmhouses", type: "Farmhouses", loc: "Nandi Hills", price: "65L – 1.1 Cr", config: "1 acre+", status: "Ready", hue: 130, views: 824, downloads: 122, revisits: 58, priceViews: 198, leads: 24 },
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
            {["All", "Plotting", "Township", "Villas", "Flats", "Farmhouses"].map((t, i) => (
              <button key={t} className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${i === 0 ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface text-muted-foreground"}`}>{t}</button>
            ))}
          </div>
        </div>

        <SectionTitle title="Smart analytics" action={<Chip tone="primary"><TrendingUp className="h-3 w-3" />Live</Chip>} />
        <ul className="grid gap-3">
          {PROJECTS.map((p) => (
            <li key={p.name} className="card-soft overflow-hidden">
              <div
                className="relative h-28"
                style={{ background: `linear-gradient(135deg, oklch(0.72 0.16 ${p.hue}), oklch(0.42 0.14 ${(p.hue + 50) % 360}))` }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.18),transparent_60%)]" />
                <Building2 className="absolute right-4 top-4 h-10 w-10 text-white/40" />
                <span className="absolute left-3 top-3"><Chip tone="primary">{p.status}</Chip></span>
                <span className="absolute bottom-3 left-3 text-[11px] font-semibold uppercase tracking-wider text-white/85">{p.type}</span>
              </div>
              <div className="p-4">
                <p className="text-base font-semibold">{p.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{p.loc}</p>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 font-semibold"><IndianRupee className="h-3 w-3" />{p.price}</span>
                  <span className="text-muted-foreground">· {p.config}</span>
                </div>

                {/* Analytics row */}
                <div className="mt-3 grid grid-cols-4 gap-2 rounded-2xl bg-surface-elevated p-3 text-center">
                  <Metric icon={Eye} v={p.views} l="Views" />
                  <Metric icon={Download} v={p.downloads} l="Brochures" />
                  <Metric icon={IndianRupee} v={p.priceViews} l="Price views" />
                  <Metric icon={Repeat} v={p.revisits} l="Revisits" />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{p.leads} active leads</span>
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

function Metric({ icon: Icon, v, l }: { icon: React.ComponentType<{ className?: string }>; v: number; l: string }) {
  return (
    <div>
      <Icon className="mx-auto h-3.5 w-3.5 text-primary" />
      <p className="mt-1 text-sm font-semibold">{v}</p>
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{l}</p>
    </div>
  );
}
