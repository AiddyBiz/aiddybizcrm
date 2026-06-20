import { createFileRoute } from "@tanstack/react-router";
import {
  Phone, MessageCircle, Mail, ChevronLeft, Zap, Send, Clock,
  CheckCircle2, User2, Calendar as CalIcon, Pencil, X, Check,
  Image as ImageIcon, Link2, CheckCheck, Eye,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

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
};

type TimelineEvent = { id: string; title: string; at: Date; kind: "create" | "assign" | "wait" | "call" | "msg" };

type Template = {
  id: string;
  title: string;
  body: string;
  mediaUrl?: string;
  buttons?: string[];
  status?: "sent" | "delivered" | "read";
};

const STATUS_OPTIONS = ["UNCONTACTED", "CONTACTED", "INTERESTED", "THINKING", "NOT INTERESTED", "WON", "LOST"];

function fmt(d: Date) {
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function LeadDetail() {
  const { id } = Route.useParams();
  const [activeTab, setActiveTab] = useState<TabName>("Overview");

  const [lead, setLead] = useState<Lead>({
    id,
    name: "Jitu Swami",
    phone: "+917740953432",
    email: "jitu.swami@example.com",
    status: "UNCONTACTED",
    source: "Facebook Lead",
    campaign: "Parwati Aashiyana Premium Plots",
    budget: "₹15 Lakh - ₹25 Lakh",
    propertyType: "Residential Plot",
    createdAt: fmt(new Date(Date.now() - 2 * 3600 * 1000)),
  });

  const [followUp, setFollowUp] = useState<Date | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);

  const [timeline, setTimeline] = useState<TimelineEvent[]>(() => [
    { id: "t1", title: "Lead created from Facebook Lead Ads", at: new Date(Date.now() - 2 * 3600 * 1000), kind: "create" },
    { id: "t2", title: "Auto-assigned to you", at: new Date(Date.now() - 2 * 3600 * 1000 + 60_000), kind: "assign" },
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
        <button onClick={() => history.back()} className="grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100" aria-label="Back">
          <ChevronLeft className="h-5 w-5 text-slate-700" />
        </button>
        <h1 className="text-base font-semibold text-slate-900">{lead.name}</h1>
      </header>

      {/* Quick Actions */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 hide-scrollbar">
        <button
          onClick={() => setShowFollowUp(true)}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
        >
          <Zap className="h-4 w-4" />
          Quick Response
        </button>
        <a
          href={`tel:${lead.phone}`}
          onClick={() => logEvent(`Called ${lead.name}`, "call")}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Phone className="h-4 w-4 text-emerald-600" />
          Call
        </a>
        <a
          href={`https://wa.me/${phoneDigits}`}
          target="_blank" rel="noreferrer"
          onClick={() => logEvent(`Opened WhatsApp chat`, "msg")}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <MessageCircle className="h-4 w-4" style={{ color: "#128C7E" }} />
          WhatsApp
        </a>
        <a
          href={`mailto:${lead.email}`}
          onClick={() => logEvent(`Emailed ${lead.email}`, "msg")}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Mail className="h-4 w-4 text-slate-500" />
          Email
        </a>
        <button
          onClick={() => setShowFollowUp(true)}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <CalIcon className="h-4 w-4 text-indigo-600" />
          Follow-up
        </button>
      </div>

      {/* Tabs */}
      <div className="sticky top-[57px] z-20 flex gap-1 border-b border-slate-200 bg-white px-2">
        {TABS.map((t) => {
          const active = activeTab === t;
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`relative flex-1 py-3 text-xs font-semibold transition ${active ? "text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
            >
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
                <EditableText
                  label="OPPORTUNITY SIZE"
                  value={lead.budget}
                  onChange={(v) => setLead({ ...lead, budget: v })}
                />
              </div>
            </div>

            <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">
                  <Zap className="h-4 w-4" />
                </div>
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
                <Send className="h-4 w-4" />
                Send via WhatsApp
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
      case "call": return <Phone className="h-3.5 w-3.5 text-emerald-600" />;
      case "msg": return <MessageCircle className="h-3.5 w-3.5 text-[#128C7E]" />;
      default: return <Clock className="h-3.5 w-3.5 text-amber-600" />;
    }
  };
  return (
    <ol className="relative ml-3 border-l-2 border-slate-200">
      {events.map((e, i) => (
        <li key={e.id} className="relative pl-5 pb-5">
          <span className="absolute -left-[11px] top-0 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-slate-100 shadow-sm">
            {iconFor(e.kind)}
          </span>
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
    { id: "1", title: "Send Brochure", body: `Hi ${lead.name}, here is the brochure for ${lead.campaign}.`, mediaUrl: "https://example.com/brochure.pdf", buttons: ["View Brochure", "Book Visit"] },
    { id: "2", title: "Send Pricing", body: `Hi ${lead.name}, current pricing for ${lead.campaign} starts at ${lead.budget}.`, buttons: ["See Plots", "Call Me"] },
    { id: "3", title: "Schedule Site Visit", body: `Hi ${lead.name}, would you like to schedule a site visit this weekend?`, buttons: ["Yes", "No", "Reschedule"] },
    { id: "4", title: "Follow-up Check-in", body: `Hi ${lead.name}, just checking in — any questions about ${lead.campaign}?` },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);

  function updateTpl(id: string, patch: Partial<Template>) {
    setTemplates((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function buildText(t: Template) {
    let txt = t.body;
    if (t.mediaUrl) txt += `\n\n📎 ${t.mediaUrl}`;
    if (t.buttons?.length) txt += `\n\n${t.buttons.map((b, i) => `${i + 1}. ${b}`).join("\n")}`;
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
                  <div className="mt-2 space-y-2">
                    <textarea
                      value={t.body}
                      onChange={(e) => updateTpl(t.id, { body: e.target.value })}
                      rows={3}
                      className="w-full rounded-md border border-slate-200 p-2 text-xs outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    />
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
                      <input
                        placeholder="Media URL (optional)"
                        value={t.mediaUrl ?? ""}
                        onChange={(e) => updateTpl(t.id, { mediaUrl: e.target.value })}
                        className="flex-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] outline-none focus:border-indigo-400"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Link2 className="h-3.5 w-3.5 text-slate-400" />
                      <input
                        placeholder="Buttons (comma-separated)"
                        value={t.buttons?.join(", ") ?? ""}
                        onChange={(e) => updateTpl(t.id, { buttons: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                        className="flex-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-1 line-clamp-2 text-[11px] text-slate-500">{t.body}</p>
                    {(t.mediaUrl || t.buttons?.length) && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {t.mediaUrl && (
                          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                            <ImageIcon className="h-3 w-3" /> Media
                          </span>
                        )}
                        {t.buttons?.map((b) => (
                          <span key={b} className="rounded border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700">{b}</span>
                        ))}
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
    sent: { label: "Sent", icon: <Check className="h-3 w-3" />, color: "text-slate-500" },
    delivered: { label: "Delivered", icon: <CheckCheck className="h-3 w-3" />, color: "text-slate-600" },
    read: { label: "Read", icon: <Eye className="h-3 w-3" />, color: "text-indigo-600" },
  }[status];
  return <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${map.color}`}>{map.icon}{map.label}</span>;
}
