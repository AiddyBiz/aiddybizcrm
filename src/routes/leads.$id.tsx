import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Phone, MessageCircle, Mail, ChevronLeft, Zap, Send, FileText,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/leads/$id")({
  head: () => ({ meta: [{ title: "Lead Detail — AiddyBiz CRM" }] }),
  component: LeadDetail,
});

const TABS = ["Overview", "Info", "Timeline", "WhatsApp"] as const;
type TabName = typeof TABS[number];

function LeadDetail() {
  const { id } = Route.useParams();
  const [tab, setTab] = useState<TabName>("Overview");
  const name = "Ananya Sharma";

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2 px-3 py-3">
          <Link to="/leads" className="grid h-10 w-10 place-items-center rounded-md text-slate-700 hover:bg-slate-100">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold text-slate-900">{name}</h1>
            <p className="text-[11px] text-slate-500">Lead #{id} · Added 2 days ago</p>
          </div>
        </div>

        {/* Quick actions bar */}
        <div className="hide-scrollbar flex gap-2 overflow-x-auto border-t border-slate-100 px-3 py-2.5">
          <QuickAction icon={<Zap className="h-4 w-4 text-indigo-600" />} label="Quick Response" />
          <QuickAction icon={<Phone className="h-4 w-4 text-emerald-600" />} label="Call" />
          <QuickAction icon={<MessageCircle className="h-4 w-4 text-[#128C7E]" />} label="WhatsApp" />
          <QuickAction icon={<Mail className="h-4 w-4 text-slate-600" />} label="Email" />
        </div>

        {/* Tabs */}
        <div className="flex border-t border-slate-100">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 border-b-2 px-2 py-3 text-xs font-semibold transition ${
                tab === t ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <main key={tab} className="fade-in px-4 pt-4">
        {tab === "Overview" && <OverviewTab />}
        {tab === "Info" && <InfoTab />}
        {tab === "Timeline" && <TimelineTab />}
        {tab === "WhatsApp" && <WhatsAppTab name={name} />}
      </main>
    </div>
  );
}

function QuickAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex shrink-0 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50">
      {icon}
      <span>{label}</span>
    </button>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Status</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <p className="text-sm font-semibold text-slate-900">New</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">No Follow Up</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">—</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Opportunity Size</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">₹1.8 Cr</p>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-indigo-100 bg-indigo-50/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600">Suggested Sequence</p>
            <h3 className="mt-0.5 text-sm font-semibold text-slate-900">Send introduction & brochure</h3>
          </div>
          <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">Step 1 of 4</span>
        </div>
        <p className="text-xs text-slate-600">
          Privyr-style template that introduces you, shares the brochure for Prestige Lakeside, and asks a qualifying question.
        </p>
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-indigo-700">
          <Send className="h-4 w-4" /> Send via WhatsApp
        </button>
      </div>
    </div>
  );
}

function InfoTab() {
  return (
    <div className="space-y-4">
      <Section title="Lead Source Details">
        <Grid items={[
          ["Source", "Meta Ads"],
          ["Campaign", "Premium Whitefield"],
          ["Ad Set", "3BHK Buyers"],
          ["Budget", "₹1.8 – 2.2 Cr"],
        ]} />
      </Section>

      <Section title="Contact Details">
        <Grid items={[
          ["Name", "Ananya Sharma"],
          ["Mobile", "+91 98••••••12"],
          ["Email", "ananya@gmail.com"],
          ["City", "Bengaluru"],
        ]} />
      </Section>

      <Section title="Requirement">
        <Grid items={[
          ["Project", "Prestige Lakeside"],
          ["Configuration", "3 BHK"],
          ["Possession", "Ready to move"],
          ["Purpose", "End-use"],
        ]} />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{title}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Grid({ items }: { items: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
      {items.map(([k, v]) => (
        <div key={k}>
          <p className="text-[11px] text-slate-500">{k}</p>
          <p className="mt-0.5 font-medium text-slate-900">{v}</p>
        </div>
      ))}
    </div>
  );
}

function TimelineTab() {
  const items = [
    { title: "Lead created", when: "2 days ago", note: "Source: Meta Ads — Premium Whitefield." },
    { title: "WhatsApp sent", when: "Yesterday", note: "Shared brochure for Prestige Lakeside." },
    { title: "Call completed · 6 min", when: "Today, 10:24 AM", note: "Discussed 3BHK, wants site visit Saturday." },
  ];
  return (
    <ol className="space-y-3">
      {items.map((t, i) => (
        <li key={i} className="rounded-md border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">{t.title}</p>
            <p className="text-[11px] text-slate-500">{t.when}</p>
          </div>
          <p className="mt-1 text-xs text-slate-600">{t.note}</p>
        </li>
      ))}
    </ol>
  );
}

function WhatsAppTab({ name }: { name: string }) {
  const templates = [
    { id: "intro", name: "Introduction", body: `Hi ${name}, this is Arjun from AiddyBiz. Sharing the brochure for Prestige Lakeside.` },
    { id: "price", name: "Price List", body: `Hi ${name}, here is the latest price list for Prestige Lakeside.` },
    { id: "visit", name: "Site Visit", body: `Hi ${name}, would you like to visit Prestige Lakeside this weekend?` },
  ];
  return (
    <ul className="space-y-2">
      {templates.map((t) => (
        <li key={t.id} className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-emerald-50 text-[#128C7E]">
            <FileText className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">{t.name}</p>
            <p className="truncate text-xs text-slate-500">{t.body}</p>
          </div>
          <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white hover:bg-indigo-700">
            Send
          </button>
        </li>
      ))}
    </ul>
  );
}
