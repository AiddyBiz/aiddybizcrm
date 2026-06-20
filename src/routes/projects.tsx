import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, Chip, SectionTitle } from "@/components/mobile-shell";
import { Building2, MapPin, IndianRupee, Search, Eye, Download, Repeat, TrendingUp, Pencil, X, Youtube, FileText, Link2, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects — AiddyBiz CRM" }] }),
  component: Projects,
});

type CTA = { id: string; label: string; url: string };
type Project = {
  id: string;
  name: string; type: string; loc: string; price: string; config: string; status: string; hue: number;
  views: number; downloads: number; revisits: number; priceViews: number; leads: number;
  // Landing-page builder fields
  youtubeUrl?: string;
  brochurePdfName?: string;
  description?: string;
  mapEmbed?: string;
  ctas: CTA[];
};

const SEED: Project[] = [
  { id: "p1", name: "Aiddy Green Acres", type: "Plotting", loc: "Devanahalli", price: "45 – 85L", config: "1200–2400 sqft", status: "Booking", hue: 162, views: 1240, downloads: 184, revisits: 92, priceViews: 312, leads: 42, ctas: [{ id: "c1", label: "Book Site Visit", url: "https://wa.me/919999999999" }] },
  { id: "p2", name: "Lakeview Township", type: "Gated Township", loc: "Sarjapur", price: "1.2 – 2.4 Cr", config: "Villas + Plots", status: "Launch", hue: 200, views: 980, downloads: 142, revisits: 64, priceViews: 248, leads: 28, ctas: [] },
  { id: "p3", name: "Sunrise Villas", type: "Villas", loc: "Whitefield", price: "2.5 – 4.1 Cr", config: "3,4 BHK", status: "U/C", hue: 30, views: 612, downloads: 88, revisits: 41, priceViews: 156, leads: 19, ctas: [] },
  { id: "p4", name: "Palm Farmhouses", type: "Farmhouses", loc: "Nandi Hills", price: "65L – 1.1 Cr", config: "1 acre+", status: "Ready", hue: 130, views: 824, downloads: 122, revisits: 58, priceViews: 198, leads: 24, ctas: [] },
];

function Projects() {
  const [projects, setProjects] = useState<Project[]>(SEED);
  const [editing, setEditing] = useState<Project | null>(null);

  function save(updated: Project) {
    setProjects((ps) => ps.map((p) => (p.id === updated.id ? updated : p)));
    setEditing(null);
  }

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
          {projects.map((p) => (
            <li key={p.id} className="card-soft overflow-hidden">
              <div className="relative h-28" style={{ background: `linear-gradient(135deg, oklch(0.72 0.16 ${p.hue}), oklch(0.42 0.14 ${(p.hue + 50) % 360}))` }}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.18),transparent_60%)]" />
                <Building2 className="absolute right-4 top-4 h-10 w-10 text-white/40" />
                <span className="absolute left-3 top-3"><Chip tone="primary">{p.status}</Chip></span>
                <span className="absolute bottom-3 left-3 text-[11px] font-semibold uppercase tracking-wider text-white/85">{p.type}</span>
                <button onClick={() => setEditing(p)} aria-label="Edit project" className="absolute right-3 bottom-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-700 backdrop-blur hover:bg-white">
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-base font-semibold">{p.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{p.loc}</p>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 font-semibold"><IndianRupee className="h-3 w-3" />{p.price}</span>
                  <span className="text-muted-foreground">· {p.config}</span>
                </div>

                <div className="mt-3 grid grid-cols-4 gap-2 rounded-2xl bg-surface-elevated p-3 text-center">
                  <Metric icon={Eye} v={p.views} l="Views" />
                  <Metric icon={Download} v={p.downloads} l="Brochures" />
                  <Metric icon={IndianRupee} v={p.priceViews} l="Price views" />
                  <Metric icon={Repeat} v={p.revisits} l="Revisits" />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{p.leads} active leads</span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setEditing(p)} className="rounded-full bg-surface-elevated px-3 py-1 text-[11px] font-semibold text-foreground">Edit</button>
                    <button className="rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold text-primary">View details</button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {editing && <ProjectBuilder project={editing} onClose={() => setEditing(null)} onSave={save} />}
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

function ProjectBuilder({ project, onClose, onSave }: { project: Project; onClose: () => void; onSave: (p: Project) => void }) {
  const [draft, setDraft] = useState<Project>(project);

  function setField<K extends keyof Project>(k: K, v: Project[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  function addCta() {
    setDraft((d) => ({ ...d, ctas: [...d.ctas, { id: crypto.randomUUID(), label: "New action", url: "https://" }] }));
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/60 sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Landing Page Builder</p>
            <h3 className="text-sm font-semibold text-slate-900">Edit · {project.name}</h3>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <Field label="Project Name"><input className="ipt" value={draft.name} onChange={(e) => setField("name", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Location"><input className="ipt" value={draft.loc} onChange={(e) => setField("loc", e.target.value)} /></Field>
            <Field label="Status"><input className="ipt" value={draft.status} onChange={(e) => setField("status", e.target.value)} /></Field>
            <Field label="Price Range"><input className="ipt" value={draft.price} onChange={(e) => setField("price", e.target.value)} /></Field>
            <Field label="Configuration"><input className="ipt" value={draft.config} onChange={(e) => setField("config", e.target.value)} /></Field>
          </div>

          <Field label="Rich Description">
            <textarea rows={3} className="ipt" placeholder="Tell the story of this project…"
              value={draft.description ?? ""} onChange={(e) => setField("description", e.target.value)} />
          </Field>

          <Field label={<><Youtube className="inline h-3.5 w-3.5 text-rose-600" /> YouTube Video URL</>}>
            <input className="ipt" placeholder="https://youtu.be/…" value={draft.youtubeUrl ?? ""} onChange={(e) => setField("youtubeUrl", e.target.value)} />
            {draft.youtubeUrl && (
              <div className="mt-2 aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                <iframe className="h-full w-full" src={ytEmbed(draft.youtubeUrl)} title="Preview" allowFullScreen />
              </div>
            )}
          </Field>

          <Field label={<><FileText className="inline h-3.5 w-3.5 text-rose-600" /> Brochure PDF</>}>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">
              <Plus className="h-3.5 w-3.5" /> Upload PDF
              <input type="file" accept="application/pdf" hidden onChange={(e) => setField("brochurePdfName", e.target.files?.[0]?.name)} />
            </label>
            {draft.brochurePdfName && <p className="mt-1 text-[11px] text-slate-500">📎 {draft.brochurePdfName}</p>}
          </Field>

          <Field label={<><MapPin className="inline h-3.5 w-3.5 text-indigo-600" /> Location Map (embed URL)</>}>
            <input className="ipt" placeholder="https://www.google.com/maps/embed?…" value={draft.mapEmbed ?? ""} onChange={(e) => setField("mapEmbed", e.target.value)} />
          </Field>

          <Field label={<><Link2 className="inline h-3.5 w-3.5 text-indigo-600" /> Call-to-Action Buttons</>}>
            <div className="space-y-2">
              {draft.ctas.map((c, i) => (
                <div key={c.id} className="rounded-lg border border-slate-200 p-2">
                  <input className="ipt" placeholder="Button label" value={c.label}
                    onChange={(e) => { const next = [...draft.ctas]; next[i] = { ...c, label: e.target.value }; setField("ctas", next); }} />
                  <input className="ipt mt-1.5" placeholder="https://…" value={c.url}
                    onChange={(e) => { const next = [...draft.ctas]; next[i] = { ...c, url: e.target.value }; setField("ctas", next); }} />
                  <button onClick={() => setField("ctas", draft.ctas.filter((_, j) => j !== i))} className="mt-1.5 text-[11px] font-semibold text-rose-600">Remove</button>
                </div>
              ))}
              <button onClick={addCta} className="w-full rounded-lg border border-dashed border-slate-300 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50">+ Add CTA</button>
            </div>
          </Field>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-200 p-3">
          <button onClick={onClose} className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
          <button onClick={() => onSave(draft)} className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700">Save Project</button>
        </div>

        <style>{`.ipt{width:100%;border:1px solid rgb(226,232,240);border-radius:.5rem;padding:.55rem .65rem;font-size:.8125rem;outline:none}.ipt:focus{border-color:#818cf8;box-shadow:0 0 0 3px rgb(224,231,255)}`}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function ytEmbed(url: string): string {
  const m = url.match(/(?:youtu\.be\/|v=)([\w-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
}
