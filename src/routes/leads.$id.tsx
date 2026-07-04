import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Phone, MessageCircle, Mail, ChevronLeft, Zap, Send, Clock,
  CheckCircle2, User2, Calendar as CalIcon, Pencil, X, Check,
  Paperclip, CheckCheck, Eye, FileText, Image as ImageIcon, MousePointerClick,
  ArrowUpRight, ShieldAlert,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { getLead, type Lead as LeadData } from "@/lib/leads-data";
import { updateLead as storeUpdateLead } from "@/lib/leads-store";
import {
  ALL_STATUSES, canTransition, getMeta, isTerminal, progressPalette,
  type PipelineStatus,
} from "@/lib/pipeline";

export const Route = createFileRoute("/leads/$id")({
  head: () => ({ meta: [{ title: "Lead Detail — AiddyBiz CRM" }] }),
  component: LeadDetail,
});

const TABS = ["Overview", "Info", "Timeline", "WhatsApp"] as const;
type TabName = typeof TABS[number];

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  source: string;
  campaign: string;
  budget: string;
  propertyType: string;
  createdAt: string;
  pipelineStatus: PipelineStatus;
  lostFromStage?: PipelineStatus;
};

type TimelineEvent = {
  id: string;
  title: string;
  at: Date;
  kind: "create" | "assign" | "wait" | "call" | "msg" | "system";
  meta?: { from?: string; to?: string; fromPct?: number; toPct?: number };
};

type WhatsAppButton = { id: string; label: string; kind: "reply" | "url" | "call" };
type Template = {
  id: string;
  title: string;
  body: string;
  mediaName?: string;
  mediaType?: "image" | "pdf";
  buttons: WhatsAppButton[];
  status?: "sent" | "delivered" | "read";
};

const STATUS_OPTIONS: string[] = ALL_STATUSES as string[];

function fmt(d: Date) {
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function LeadDetail() {
  const { id } = Route.useParams();
  const initial = getLead(id);
  const [activeTab, setActiveTab] = useState<TabName>("Overview");

  const [lead, setLead] = useState<Lead>(() =>
    initial
      ? {
          id: initial.id,
          name: initial.name,
          phone: initial.phone,
          email: initial.email,
          status: initial.status,
          source: initial.source,
          campaign: initial.campaign,
          budget: initial.budget,
          propertyType: initial.propertyType,
          createdAt: fmt(new Date(initial.createdAt)),
        }
      : {
          id, name: "Unknown Lead", phone: "+910000000000", email: "—",
          status: "UNCONTACTED", source: "—", campaign: "—",
          budget: "—", propertyType: "—", createdAt: fmt(new Date()),
        }
  );

  const [followUp, setFollowUp] = useState<Date | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showQuickResponse, setShowQuickResponse] = useState(false);

  const [timeline, setTimeline] = useState<TimelineEvent[]>(() => [
    { id: "t1", title: `Lead created from ${initial?.source ?? "form"}`, at: new Date(initial?.createdAt ?? Date.now()), kind: "create" },
    { id: "t2", title: "Auto-assigned to you", at: new Date((initial ? new Date(initial.createdAt).getTime() : Date.now()) + 60_000), kind: "assign" },
    { id: "t3", title: "Awaiting first contact", at: new Date(), kind: "wait" },
  ]);

  const sortedTimeline = useMemo(
    () => [...timeline].sort((a, b) => b.at.getTime() - a.at.getTime()),
    [timeline]
  );

  function logEvent(title: string, kind: TimelineEvent["kind"]) {
    setTimeline((t) => [...t, { id: crypto.randomUUID(), title, at: new Date(), kind }]);
  }

  const phoneDigits = lead.phone.replace(/[^\d]/g, "");

  return (
    <div className="min-h-screen bg-slate-50 pb-24 animate-in fade-in duration-200">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <Link to="/leads" className="grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100" aria-label="Back">
          <ChevronLeft className="h-5 w-5 text-slate-700" />
        </Link>
        <h1 className="text-base font-semibold text-slate-900">{lead.name}</h1>
      </header>

      {/* Quick Actions */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 hide-scrollbar">
        <button
          onClick={() => setShowQuickResponse(true)}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
        >
          <Zap className="h-4 w-4" />
          Quick Response
        </button>
        <a href={`tel:${lead.phone}`} onClick={() => logEvent(`Called ${lead.name}`, "call")}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          <Phone className="h-4 w-4 text-emerald-600" /> Call
        </a>
        <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer"
          onClick={() => logEvent(`Opened WhatsApp chat`, "msg")}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          <MessageCircle className="h-4 w-4" style={{ color: "#128C7E" }} /> WhatsApp
        </a>
        <a href={`mailto:${lead.email}`} onClick={() => logEvent(`Emailed ${lead.email}`, "msg")}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          <Mail className="h-4 w-4 text-slate-500" /> Email
        </a>
        <button onClick={() => setShowFollowUp(true)}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          <CalIcon className="h-4 w-4 text-indigo-600" /> Follow-up
        </button>
      </div>

      {/* Tabs */}
      <div className="sticky top-[57px] z-20 flex gap-1 border-b border-slate-200 bg-white px-2">
        {TABS.map((t) => {
          const active = activeTab === t;
          return (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`relative flex-1 py-3 text-xs font-semibold transition ${active ? "text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}>
              {t}
              {active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-indigo-600" />}
            </button>
          );
        })}
      </div>

      <main className="px-4 py-4 animate-in fade-in duration-200" key={activeTab}>
        {activeTab === "Overview" && (
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <EditableSelect
                label="STATUS"
                value={lead.status}
                options={STATUS_OPTIONS}
                onChange={(v) => { setLead({ ...lead, status: v }); logEvent(`Status changed to ${v}`, "assign"); }}
                leading={<span className="h-2 w-2 rounded-full bg-purple-500" />}
              />
              <div className="mt-3 border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wider text-slate-500">FOLLOW UP</span>
                <button onClick={() => setShowFollowUp(true)} className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:underline">
                  {followUp ? fmt(followUp) : "NO FOLLOW UP"}
                  <Pencil className="h-3 w-3" />
                </button>
              </div>
              <div className="mt-3 border-t border-slate-100 pt-3">
                <EditableText label="OPPORTUNITY SIZE" value={lead.budget} onChange={(v) => setLead({ ...lead, budget: v })} />
              </div>
            </div>

            <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white"><Zap className="h-4 w-4" /></div>
                <div>
                  <p className="text-xs font-semibold text-indigo-900">Suggested Sequence</p>
                  <p className="text-[11px] text-indigo-700/80">Uncontacted Lead Sequence</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-700">
                Send a warm intro with project brochure and pricing to qualify interest fast.
              </p>
              <a
                href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Hi ${lead.name}, thanks for your interest in ${lead.campaign}. Sharing brochure & pricing now.`)}`}
                target="_blank" rel="noreferrer"
                onClick={() => logEvent("Sent intro via WhatsApp", "msg")}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-sm hover:bg-indigo-700"
              >
                <Send className="h-4 w-4" /> Send via WhatsApp
              </a>
            </div>
          </div>
        )}

        {activeTab === "Info" && (
          <div className="space-y-3">
            <Section title="Lead Source Details">
              <EditableRow label="Source" value={lead.source} onChange={(v) => setLead({ ...lead, source: v })} />
              <EditableRow label="Campaign" value={lead.campaign} onChange={(v) => setLead({ ...lead, campaign: v })} />
              <EditableRow label="Budget" value={lead.budget} onChange={(v) => setLead({ ...lead, budget: v })} />
              <EditableRow label="Property Type" value={lead.propertyType} onChange={(v) => setLead({ ...lead, propertyType: v })} />
            </Section>
            <Section title="Contact Details">
              <EditableRow label="Name" value={lead.name} onChange={(v) => setLead({ ...lead, name: v })} />
              <EditableRow label="Phone" value={lead.phone} onChange={(v) => setLead({ ...lead, phone: v })} />
              <EditableRow label="Email" value={lead.email} onChange={(v) => setLead({ ...lead, email: v })} />
              <EditableRow label="Created" value={lead.createdAt} readOnly />
            </Section>
          </div>
        )}

        {activeTab === "Timeline" && <Timeline events={sortedTimeline} />}

        {activeTab === "WhatsApp" && (
          <WhatsAppTemplates lead={lead} phoneDigits={phoneDigits} onSend={(tpl) => logEvent(`Sent template: ${tpl}`, "msg")} />
        )}
      </main>

      {showFollowUp && (
        <FollowUpModal
          value={followUp}
          onClose={() => setShowFollowUp(false)}
          onSave={(d) => {
            setFollowUp(d);
            setShowFollowUp(false);
            logEvent(`Follow-up scheduled for ${fmt(d)}`, "wait");
          }}
        />
      )}

      {showQuickResponse && (
        <QuickResponseSheet
          lead={lead}
          phoneDigits={phoneDigits}
          onClose={() => setShowQuickResponse(false)}
          onSend={(label) => { logEvent(`Quick response: ${label}`, "msg"); setShowQuickResponse(false); }}
        />
      )}
    </div>
  );
}

/* ---------- Quick Response Sheet (distinct from Follow-up) ---------- */
const SHAREABLE_PROJECTS = [
  { name: "Aiddy Green Acres", type: "Plotting", loc: "Devanahalli", price: "₹45 – 85L", config: "1200–2400 sqft" },
  { name: "Lakeview Township", type: "Gated Township", loc: "Sarjapur", price: "₹1.2 – 2.4 Cr", config: "Villas + Plots" },
  { name: "Sunrise Villas", type: "Villas", loc: "Whitefield", price: "₹2.5 – 4.1 Cr", config: "3,4 BHK" },
  { name: "Palm Farmhouses", type: "Farmhouses", loc: "Nandi Hills", price: "₹65L – 1.1 Cr", config: "1 acre+" },
];

function projectShareText(p: { name: string; type: string; loc: string; price: string; config: string }, leadName: string) {
  return `Hi ${leadName}, sharing details for *${p.name}* (${p.type})\n\n📍 ${p.loc}\n💰 ${p.price}\n🏠 ${p.config}\n\nLet me know if you'd like a site visit or brochure.`;
}

function QuickResponseSheet({ lead, phoneDigits, onClose, onSend }: { lead: Lead; phoneDigits: string; onClose: () => void; onSend: (label: string) => void }) {
  const RESPONSES = [
    { label: "Thanks for your interest", text: `Hi ${lead.name}, thanks for your interest in ${lead.campaign}! When is the best time for a quick call?` },
    { label: "Share Brochure", text: `Hi ${lead.name}, sharing the brochure for ${lead.campaign}. Let me know if you'd like a site visit.` },
    { label: "Share Pricing", text: `Hi ${lead.name}, current pricing for ${lead.campaign} starts at ${lead.budget}. Want full price sheet?` },
    { label: "Book Site Visit", text: `Hi ${lead.name}, are you free this weekend for a site visit at ${lead.campaign}?` },
    { label: "Re-engage", text: `Hi ${lead.name}, checking back in — any questions I can answer about ${lead.campaign}?` },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center gap-3 p-5 pb-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-50 text-indigo-600"><Zap className="h-5 w-5" /></span>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900">Quick Response</h3>
            <p className="text-xs text-slate-500">Send a one-tap message to {lead.name}</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <ul className="space-y-2">
            {RESPONSES.map((r) => (
              <li key={r.label}>
                <a
                  href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(r.text)}`}
                  target="_blank" rel="noreferrer"
                  onClick={() => onSend(r.label)}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 hover:bg-slate-50"
                >
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#128C7E" }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900">{r.label}</p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-500">{r.text}</p>
                  </div>
                  <Send className="mt-0.5 h-3.5 w-3.5 text-indigo-600" />
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Send a project to {lead.name}</p>
          <ul className="mt-2 space-y-2">
            {SHAREABLE_PROJECTS.map((p) => (
              <li key={p.name}>
                <a
                  href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(projectShareText(p, lead.name))}`}
                  target="_blank" rel="noreferrer"
                  onClick={() => onSend(`Project: ${p.name}`)}
                  className="flex items-start gap-3 rounded-lg border border-indigo-200 bg-indigo-50/50 p-3 hover:bg-indigo-50"
                >
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-indigo-600 text-white">
                    <Send className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900">{p.name}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{p.type} · {p.loc} · {p.price}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------- Editable primitives ---------- */
function EditableText({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(value);
  if (edit) {
    return (
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold tracking-wider text-slate-500">{label}</span>
        <div className="flex items-center gap-1">
          <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
            className="w-40 rounded-md border border-indigo-300 px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-indigo-200" />
          <button onClick={() => { onChange(draft); setEdit(false); }} className="grid h-6 w-6 place-items-center rounded bg-indigo-600 text-white"><Check className="h-3 w-3" /></button>
          <button onClick={() => { setDraft(value); setEdit(false); }} className="grid h-6 w-6 place-items-center rounded bg-slate-100 text-slate-600"><X className="h-3 w-3" /></button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-semibold tracking-wider text-slate-500">{label}</span>
      <button onClick={() => { setDraft(value); setEdit(true); }} className="flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-indigo-600">
        {value}
        <Pencil className="h-3 w-3 text-slate-400" />
      </button>
    </div>
  );
}

function EditableSelect({ label, value, options, onChange, leading }: { label: string; value: string; options: string[]; onChange: (v: string) => void; leading?: ReactNode }) {
  const [edit, setEdit] = useState(false);
  if (edit) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider text-slate-500">{label}</span>
        <select autoFocus value={value} onChange={(e) => { onChange(e.target.value); setEdit(false); }} onBlur={() => setEdit(false)}
          className="rounded-md border border-indigo-300 px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-200">
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-semibold tracking-wider text-slate-500">{label}</span>
      <button onClick={() => setEdit(true)} className="flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-indigo-600">
        {leading}
        {value}
        <Pencil className="h-3 w-3 text-slate-400" />
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">{title}</p>
      </div>
      <dl className="grid grid-cols-1 divide-y divide-slate-100">{children}</dl>
    </div>
  );
}

function EditableRow({ label, value, onChange, readOnly }: { label: string; value: string; onChange?: (v: string) => void; readOnly?: boolean }) {
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(value);
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      {edit && !readOnly ? (
        <div className="flex items-center gap-1">
          <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
            className="w-44 rounded-md border border-indigo-300 px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-indigo-200" />
          <button onClick={() => { onChange?.(draft); setEdit(false); }} className="grid h-6 w-6 place-items-center rounded bg-indigo-600 text-white"><Check className="h-3 w-3" /></button>
          <button onClick={() => { setDraft(value); setEdit(false); }} className="grid h-6 w-6 place-items-center rounded bg-slate-100 text-slate-600"><X className="h-3 w-3" /></button>
        </div>
      ) : (
        <button
          disabled={readOnly}
          onClick={() => { setDraft(value); setEdit(true); }}
          className="flex max-w-[60%] items-center gap-1.5 text-right text-xs font-medium text-slate-900 disabled:text-slate-500"
        >
          <span className="truncate">{value}</span>
          {!readOnly && <Pencil className="h-3 w-3 shrink-0 text-slate-400" />}
        </button>
      )}
    </div>
  );
}

/* ---------- Timeline ---------- */
function Timeline({ events }: { events: TimelineEvent[] }) {
  const iconFor = (k: TimelineEvent["kind"]) => {
    switch (k) {
      case "create": return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />;
      case "assign": return <User2 className="h-3.5 w-3.5 text-indigo-600" />;
      case "call":   return <Phone className="h-3.5 w-3.5 text-emerald-600" />;
      case "msg":    return <MessageCircle className="h-3.5 w-3.5 text-[#128C7E]" />;
      default:       return <Clock className="h-3.5 w-3.5 text-amber-600" />;
    }
  };
  return (
    <ol className="relative ml-3 border-l-2 border-slate-200">
      {events.map((e, i) => (
        <li key={e.id} className="relative pl-5 pb-5">
          <span className="absolute -left-[11px] top-0 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-slate-100 shadow-sm">{iconFor(e.kind)}</span>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-medium text-slate-800">{e.title}</p>
            <p className="mt-1 text-[11px] text-slate-500">{fmt(e.at)}</p>
          </div>
          {i === 0 && <span className="absolute -left-[5px] top-2 h-2 w-2 animate-pulse rounded-full bg-emerald-500" />}
        </li>
      ))}
    </ol>
  );
}

/* ---------- Follow-up modal ---------- */
function FollowUpModal({ value, onClose, onSave }: { value: Date | null; onClose: () => void; onSave: (d: Date) => void }) {
  const init = value ?? new Date(Date.now() + 24 * 3600 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const [date, setDate] = useState(`${init.getFullYear()}-${pad(init.getMonth() + 1)}-${pad(init.getDate())}`);
  const [time, setTime] = useState(`${pad(init.getHours())}:${pad(init.getMinutes())}`);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Schedule Follow-up</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
          </label>
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Time</span>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
          </label>
        </div>
        <button
          onClick={() => {
            const [y, m, d] = date.split("-").map(Number);
            const [h, mi] = time.split(":").map(Number);
            onSave(new Date(y, m - 1, d, h, mi));
          }}
          className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700"
        >
          Save Follow-up
        </button>
      </div>
    </div>
  );
}

/* ---------- WhatsApp templates ---------- */
function WhatsAppTemplates({ lead, phoneDigits, onSend }: { lead: Lead; phoneDigits: string; onSend: (title: string) => void }) {
  const [templates, setTemplates] = useState<Template[]>([
    { id: "1", title: "Send Brochure", body: `Hi ${lead.name}, here is the brochure for ${lead.campaign}.`,
      buttons: [{ id: "b1", label: "View Brochure", kind: "url" }, { id: "b2", label: "Book Visit", kind: "reply" }] },
    { id: "2", title: "Send Pricing", body: `Hi ${lead.name}, current pricing for ${lead.campaign} starts at ${lead.budget}.`,
      buttons: [{ id: "b1", label: "See Plots", kind: "reply" }, { id: "b2", label: "Call Me", kind: "call" }] },
    { id: "3", title: "Schedule Site Visit", body: `Hi ${lead.name}, would you like to schedule a site visit this weekend?`,
      buttons: [{ id: "b1", label: "Yes", kind: "reply" }, { id: "b2", label: "No", kind: "reply" }, { id: "b3", label: "Reschedule", kind: "reply" }] },
    { id: "4", title: "Follow-up Check-in", body: `Hi ${lead.name}, just checking in — any questions about ${lead.campaign}?`,
      buttons: [{ id: "b1", label: "Yes, call me", kind: "call" }] },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);

  function updateTpl(id: string, patch: Partial<Template>) {
    setTemplates((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function handleFile(id: string, f: File | null) {
    if (!f) return;
    const type: Template["mediaType"] = f.type.startsWith("image/") ? "image" : "pdf";
    updateTpl(id, { mediaName: f.name, mediaType: type });
  }

  function buildText(t: Template) {
    let txt = t.body;
    if (t.mediaName) txt += `\n\n📎 ${t.mediaName}`;
    if (t.buttons.length) txt += `\n\n— Choose a quick action below —`;
    return txt;
  }

  return (
    <div className="space-y-2">
      {templates.map((t) => {
        const editing = editingId === t.id;
        return (
          <div key={t.id} className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-start gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: "#128C7E20" }}>
                <MessageCircle className="h-4 w-4" style={{ color: "#128C7E" }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800">{t.title}</p>
                {editing ? (
                  <div className="mt-2 space-y-3">
                    <textarea value={t.body} onChange={(e) => updateTpl(t.id, { body: e.target.value })} rows={3}
                      className="w-full rounded-md border border-slate-200 p-2 text-xs outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />

                    {/* Native file picker */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Attachment</span>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-100">
                          <ImageIcon className="h-3.5 w-3.5 text-emerald-600" /> Photo
                          <input type="file" accept="image/*" capture="environment" hidden onChange={(e) => handleFile(t.id, e.target.files?.[0] ?? null)} />
                        </label>
                        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-100">
                          <FileText className="h-3.5 w-3.5 text-rose-600" /> PDF
                          <input type="file" accept="application/pdf" hidden onChange={(e) => handleFile(t.id, e.target.files?.[0] ?? null)} />
                        </label>
                        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-100">
                          <Paperclip className="h-3.5 w-3.5 text-slate-500" /> Any file
                          <input type="file" hidden onChange={(e) => handleFile(t.id, e.target.files?.[0] ?? null)} />
                        </label>
                        {t.mediaName && (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">
                            {t.mediaType === "image" ? <ImageIcon className="h-3 w-3" /> : <FileText className="h-3 w-3" />} {t.mediaName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Interactive buttons editor */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Interactive buttons</span>
                      <div className="mt-1 space-y-1.5">
                        {t.buttons.map((b, i) => (
                          <div key={b.id} className="flex items-center gap-1.5">
                            <select value={b.kind} onChange={(e) => {
                              const next = [...t.buttons]; next[i] = { ...b, kind: e.target.value as WhatsAppButton["kind"] };
                              updateTpl(t.id, { buttons: next });
                            }} className="rounded-md border border-slate-200 px-1.5 py-1 text-[10px] font-semibold">
                              <option value="reply">Quick Reply</option>
                              <option value="url">Open URL</option>
                              <option value="call">Call Number</option>
                            </select>
                            <input value={b.label} onChange={(e) => {
                              const next = [...t.buttons]; next[i] = { ...b, label: e.target.value };
                              updateTpl(t.id, { buttons: next });
                            }} className="flex-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] outline-none focus:border-indigo-400" />
                            <button onClick={() => updateTpl(t.id, { buttons: t.buttons.filter((_, j) => j !== i) })}
                              className="grid h-6 w-6 place-items-center rounded bg-slate-100 text-slate-500 hover:bg-slate-200"><X className="h-3 w-3" /></button>
                          </div>
                        ))}
                        {t.buttons.length < 3 && (
                          <button
                            onClick={() => updateTpl(t.id, { buttons: [...t.buttons, { id: crypto.randomUUID(), label: "New action", kind: "reply" }] })}
                            className="rounded-md border border-dashed border-slate-300 px-2 py-1 text-[10px] font-semibold text-slate-500 hover:bg-slate-50"
                          >+ Add button (max 3)</button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-1 text-[11px] text-slate-600 whitespace-pre-wrap">{t.body}</p>
                    {t.mediaName && (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1 text-[10px] text-slate-600">
                        {t.mediaType === "image" ? <ImageIcon className="h-3 w-3 text-emerald-600" /> : <FileText className="h-3 w-3 text-rose-600" />}
                        {t.mediaName}
                      </div>
                    )}
                    {t.buttons.length > 0 && (
                      <div className="mt-2 -mx-3 border-t border-slate-200 px-3 pt-2">
                        <div className="grid gap-1.5">
                          {t.buttons.map((b) => (
                            <button key={b.id}
                              className="flex w-full items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-[#128C7E] hover:bg-emerald-50">
                              {b.kind === "url" && <MousePointerClick className="h-3 w-3" />}
                              {b.kind === "call" && <Phone className="h-3 w-3" />}
                              {b.kind === "reply" && <MessageCircle className="h-3 w-3" />}
                              {b.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <DeliveryStatus status={t.status} />
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingId(editing ? null : t.id)}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {editing ? <><Check className="h-3 w-3" /> Done</> : <><Pencil className="h-3 w-3" /> Edit</>}
                </button>
                <a
                  href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(buildText(t))}`}
                  target="_blank" rel="noreferrer"
                  onClick={() => {
                    updateTpl(t.id, { status: "sent" });
                    onSend(t.title);
                    setTimeout(() => updateTpl(t.id, { status: "delivered" }), 1200);
                    setTimeout(() => updateTpl(t.id, { status: "read" }), 3000);
                  }}
                  className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-indigo-700"
                >
                  <Send className="h-3 w-3" /> Send
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DeliveryStatus({ status }: { status?: Template["status"] }) {
  if (!status) return <span className="text-[10px] text-slate-400">Not sent yet</span>;
  const map = {
    sent:      { label: "Sent",      icon: <Check className="h-3 w-3" />,      color: "text-slate-500" },
    delivered: { label: "Delivered", icon: <CheckCheck className="h-3 w-3" />, color: "text-slate-600" },
    read:      { label: "Read",      icon: <Eye className="h-3 w-3" />,        color: "text-indigo-600" },
  }[status];
  return <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${map.color}`}>{map.icon}{map.label}</span>;
}

// Type-only re-export to satisfy unused-import lint guards
export type { LeadData };
