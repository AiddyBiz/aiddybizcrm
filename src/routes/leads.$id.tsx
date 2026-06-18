import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell, Chip, Avatar, SectionTitle, Tabs } from "@/components/mobile-shell";
import {
  Phone, MessageCircle, Mail, MapPin, ChevronLeft, Flame, Calendar, PhoneCall, FileText,
  Building2, Eye, Download, IndianRupee, Repeat, Mic, X, Send, Star,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/leads/$id")({
  head: () => ({ meta: [{ title: "Lead Detail — AiddyBiz CRM" }] }),
  component: LeadDetail,
});

const TEMPLATES = [
  { id: "brochure", name: "Brochure Sharing", body: "Hi {{name}}, sharing the brochure for {{project}}. It covers floor plans, amenities & pricing. Let me know your thoughts!" },
  { id: "price", name: "Price List", body: "Hi {{name}}, here is the latest price list for {{project}}. Limited inventory left in 3BHK." },
  { id: "visit", name: "Site Visit Invitation", body: "Hi {{name}}, would you like to visit {{project}} this weekend? I can arrange a guided tour and meet you at the site." },
  { id: "followup", name: "Follow-up Message", body: "Hi {{name}}, just checking in on your decision for {{project}}. Happy to clarify anything." },
  { id: "payment", name: "Payment Reminder", body: "Hi {{name}}, a gentle reminder for the booking amount for {{project}} due on {{date}}." },
];

function LeadDetail() {
  const { id } = Route.useParams();
  const [tab, setTab] = useState("Overview");
  const [waOpen, setWaOpen] = useState(false);
  const [activeTpl, setActiveTpl] = useState<typeof TEMPLATES[number] | null>(null);
  const [message, setMessage] = useState("");

  return (
    <MobileShell title="Lead Detail" action={
      <Link to="/leads" className="grid h-10 w-10 place-items-center rounded-full bg-surface"><ChevronLeft className="h-5 w-5" /></Link>
    }>
      <div className="px-4 pt-4">
        {/* Header card */}
        <div className="card-soft relative overflow-hidden p-5">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/25 blur-2xl" />
          <div className="flex items-center gap-4">
            <Avatar name="Ananya Sharma" size={64} />
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-semibold">Ananya Sharma</h2>
              <p className="text-xs text-muted-foreground">Lead #{id} · Added 2 days ago</p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <Chip tone="info">Qualified</Chip>
                <Chip tone="warning">High priority</Chip>
              </div>
            </div>
          </div>

          {/* Lead score */}
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-surface-elevated p-3">
            <div className="grid h-12 w-12 place-items-center rounded-full grad-primary text-primary-foreground">
              <Flame className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Lead Score</p>
              <p className="text-base font-semibold">85/100 · <span className="text-primary">Hot Lead</span></p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-background">
                <div className="h-full w-[85%] grad-primary" />
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            <ActionBtn label="Call" icon={Phone} />
            <ActionBtn label="WhatsApp" icon={MessageCircle} onClick={() => setWaOpen(true)} />
            <ActionBtn label="Email" icon={Mail} />
            <ActionBtn label="Visit" icon={MapPin} />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5">
          <Tabs tabs={["Overview", "Timeline", "Activity", "Notes"]} value={tab} onChange={setTab} />
        </div>

        {tab === "Overview" && <OverviewTab />}
        {tab === "Timeline" && <TimelineTab />}
        {tab === "Activity" && <ActivityTab />}
        {tab === "Notes" && <NotesTab />}
      </div>

      {/* WhatsApp template sheet */}
      {waOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => { setWaOpen(false); setActiveTpl(null); }} />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-surface-elevated p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-2xl">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border" />
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[color-mix(in_oklab,var(--success)_25%,transparent)] text-[color:var(--success)]"><MessageCircle className="h-4 w-4" /></span>
                <h3 className="text-base font-semibold">WhatsApp Templates</h3>
              </div>
              <button onClick={() => { setWaOpen(false); setActiveTpl(null); }} className="grid h-8 w-8 place-items-center rounded-full bg-surface"><X className="h-4 w-4" /></button>
            </div>

            {!activeTpl && (
              <ul className="space-y-2">
                {TEMPLATES.map((t) => (
                  <li key={t.id}>
                    <button onClick={() => { setActiveTpl(t); setMessage(t.body.replace("{{name}}", "Ananya").replace("{{project}}", "Prestige Lakeside").replace("{{date}}", "25 Jun")); }} className="flex w-full items-center gap-3 rounded-2xl bg-surface p-3 text-left">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary"><FileText className="h-4 w-4" /></span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{t.body}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {activeTpl && (
              <div>
                <button onClick={() => setActiveTpl(null)} className="mb-3 text-xs font-medium text-primary">← Choose another template</button>
                <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">{activeTpl.name}</p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={7}
                  className="w-full resize-none rounded-2xl border border-border bg-surface p-3 text-sm focus:border-primary focus:outline-none"
                />
                <button
                  onClick={() => { setWaOpen(false); setActiveTpl(null); }}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full grad-primary py-3 text-sm font-semibold text-primary-foreground"
                >
                  <Send className="h-4 w-4" /> Send WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </MobileShell>
  );
}

function ActionBtn({ label, icon: Icon, onClick }: { label: string; icon: React.ComponentType<{ className?: string }>; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 rounded-2xl bg-surface-elevated py-3 text-[11px] font-medium active:scale-95">
      <span className="grid h-9 w-9 place-items-center rounded-xl grad-primary text-primary-foreground"><Icon className="h-4 w-4" /></span>
      {label}
    </button>
  );
}

function OverviewTab() {
  return (
    <>
      <SectionTitle title="Lead details" />
      <div className="card-soft grid grid-cols-2 gap-4 p-4 text-sm">
        {[
          ["Name", "Ananya Sharma"],
          ["Mobile", "+91 98••••••12"],
          ["Email", "ananya@gmail.com"],
          ["Project", "Prestige Lakeside"],
          ["Budget", "₹1.8 – 2.2 Cr"],
          ["Source", "Meta Ads"],
          ["Status", "Qualified"],
          ["Priority", "High"],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="text-xs text-muted-foreground">{k}</p>
            <p className="mt-0.5 font-medium">{v}</p>
          </div>
        ))}
      </div>

      <SectionTitle title="Interested projects" />
      <ul className="space-y-2">
        {["Prestige Lakeside Habitat", "Sobha Dream Acres"].map((p) => (
          <li key={p} className="card-soft flex items-center gap-3 p-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-elevated"><Building2 className="h-5 w-5 text-primary" /></span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{p}</p>
              <p className="truncate text-xs text-muted-foreground">3 BHK · ₹1.9 Cr onwards</p>
            </div>
            <Chip>Brochure</Chip>
          </li>
        ))}
      </ul>
    </>
  );
}

function TimelineTab() {
  const items = [
    { icon: IndianRupee, title: "Deal updated", when: "Today, 11:40 AM", note: "Moved to Negotiation stage." },
    { icon: PhoneCall, title: "Call completed · 6 min", when: "Today, 10:24 AM", note: "Discussed 3BHK options, wants site visit Saturday." },
    { icon: MessageCircle, title: "WhatsApp sent", when: "Yesterday", note: "Shared floor plans for Prestige Lakeside." },
    { icon: Calendar, title: "Site visit scheduled", when: "Sat, 21 Jun · 11:00 AM", note: "Prestige Lakeside sample flat." },
    { icon: MapPin, title: "Site visit completed", when: "10 Jun, 4:30 PM", note: "Outcome: Interested." },
    { icon: PhoneCall, title: "Follow-up added", when: "8 Jun", note: "Reminder for pricing discussion." },
    { icon: FileText, title: "Lead created", when: "2 days ago", note: "Source: Meta Ads campaign 'Premium Whitefield'." },
  ];
  return (
    <>
      <SectionTitle title="Timeline" />
      <ol className="relative ml-3 space-y-4 border-l border-border pl-5">
        {items.map((t, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[34px] grid h-7 w-7 place-items-center rounded-full bg-surface-elevated ring-4 ring-background"><t.icon className="h-3.5 w-3.5 text-primary" /></span>
            <p className="text-sm font-semibold">{t.title}</p>
            <p className="text-[11px] text-muted-foreground">{t.when}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t.note}</p>
          </li>
        ))}
      </ol>
    </>
  );
}

function ActivityTab() {
  const events = [
    { icon: Eye, text: "Viewed project page", project: "Prestige Lakeside", when: "Today, 9:42 AM" },
    { icon: Download, text: "Downloaded brochure", project: "Prestige Lakeside", when: "Today, 9:45 AM" },
    { icon: IndianRupee, text: "Viewed pricing", project: "Prestige Lakeside", when: "Today, 9:48 AM" },
    { icon: MapPin, text: "Viewed location & map", project: "Prestige Lakeside", when: "Yesterday" },
    { icon: Repeat, text: "Revisited project page", project: "Prestige Lakeside", when: "Yesterday" },
    { icon: Eye, text: "Viewed project page", project: "Sobha Dream Acres", when: "2 days ago" },
  ];
  return (
    <>
      <SectionTitle title="Buyer intent" action={<Chip tone="primary">High</Chip>} />
      <ul className="space-y-2">
        {events.map((e, i) => (
          <li key={i} className="card-soft flex items-center gap-3 p-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary"><e.icon className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Ananya {e.text.toLowerCase()}</p>
              <p className="truncate text-xs text-muted-foreground">{e.project} · {e.when}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function NotesTab() {
  const notes = [
    { author: "Arjun K.", when: "Today", body: "Prefers East-facing units. Husband works at ITPL. Wants to close in 3 months." },
    { author: "Riya K.", when: "5 days ago", body: "Sensitive to maintenance charges. Compare with Sobha." },
  ];
  return (
    <>
      <SectionTitle title="Notes" action={<button className="text-xs font-medium text-primary">+ Add note</button>} />
      <ul className="space-y-2">
        {notes.map((n, i) => (
          <li key={i} className="card-soft p-4">
            <div className="flex items-center gap-2">
              <Avatar name={n.author} size={28} />
              <p className="text-xs font-semibold">{n.author}</p>
              <span className="text-[11px] text-muted-foreground">· {n.when}</span>
            </div>
            <p className="mt-2 text-sm text-foreground/90">{n.body}</p>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-surface p-3">
        <input placeholder="Write a quick note…" className="min-w-0 flex-1 bg-transparent text-sm focus:outline-none" />
        <button className="grid h-10 w-10 place-items-center rounded-full bg-surface-elevated" aria-label="Voice note">
          <Mic className="h-4 w-4 text-primary" />
        </button>
        <button className="grid h-10 w-10 place-items-center rounded-full grad-primary text-primary-foreground" aria-label="Save">
          <Star className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}
