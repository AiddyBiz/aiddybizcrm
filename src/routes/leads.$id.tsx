import { createFileRoute } from "@tanstack/react-router";
import {
  Phone, MessageCircle, Mail, ChevronLeft, Zap, Send, Clock,
  CheckCircle2, User2, MapPin, Calendar as CalIcon,
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
  const [activeTab, setActiveTab] = useState<TabName>("Overview");

  const lead = {
    id,
    name: "Jitu Swami",
    phone: "+917740953432",
    status: "UNCONTACTED",
    source: "Facebook Lead",
    campaign: "Parwati Aashiyana Premium Plots",
    budget: "₹15 Lakh - ₹25 Lakh",
    propertyType: "Residential Plot",
    createdAt: "2 hours ago",
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 animate-in fade-in duration-200">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <button
          onClick={() => history.back()}
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-slate-100"
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5 text-slate-700" />
        </button>
        <h1 className="text-base font-semibold text-slate-900">{lead.name}</h1>
      </header>

      {/* Quick Actions */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 hide-scrollbar">
        <button className="flex shrink-0 items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">
          <Zap className="h-4 w-4" />
          Quick Response
        </button>
        <button className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          <Phone className="h-4 w-4 text-emerald-600" />
          Call
        </button>
        <button className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          <MessageCircle className="h-4 w-4" style={{ color: "#128C7E" }} />
          WhatsApp
        </button>
        <button className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          <Mail className="h-4 w-4 text-slate-500" />
          Email
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
              className={`relative flex-1 py-3 text-xs font-semibold transition ${
                active ? "text-indigo-600" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t}
              {active && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-indigo-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <main className="px-4 py-4 animate-in fade-in duration-200" key={activeTab}>
        {activeTab === "Overview" && (
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wider text-slate-500">STATUS</span>
                <span className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <span className="h-2 w-2 rounded-full bg-purple-500" />
                  {lead.status}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[11px] font-semibold tracking-wider text-slate-500">FOLLOW UP</span>
                <span className="text-xs font-medium text-slate-400">NO FOLLOW UP</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[11px] font-semibold tracking-wider text-slate-500">OPPORTUNITY SIZE</span>
                <span className="text-xs font-bold text-slate-900">{lead.budget}</span>
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
              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-sm hover:bg-indigo-700">
                <Send className="h-4 w-4" />
                Send via WhatsApp
              </button>
            </div>
          </div>
        )}

        {activeTab === "Info" && (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Lead Source Details</p>
              </div>
              <dl className="grid grid-cols-1 divide-y divide-slate-100">
                <Row label="Source" value={lead.source} />
                <Row label="Campaign" value={lead.campaign} />
                <Row label="Budget" value={lead.budget} />
                <Row label="Property Type" value={lead.propertyType} />
              </dl>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Contact Details</p>
              </div>
              <dl className="grid grid-cols-1 divide-y divide-slate-100">
                <Row label="Name" value={lead.name} icon={<User2 className="h-3.5 w-3.5" />} />
                <Row label="Phone" value={lead.phone} icon={<Phone className="h-3.5 w-3.5" />} />
                <Row label="Created" value={lead.createdAt} icon={<CalIcon className="h-3.5 w-3.5" />} />
              </dl>
            </div>
          </div>
        )}

        {activeTab === "Timeline" && (
          <ol className="space-y-3">
            {[
              { t: "Lead created from Facebook Lead Ads", ago: lead.createdAt, icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> },
              { t: "Auto-assigned to you", ago: "2 hours ago", icon: <User2 className="h-3.5 w-3.5 text-indigo-600" /> },
              { t: "Awaiting first contact", ago: "now", icon: <Clock className="h-3.5 w-3.5 text-amber-600" /> },
            ].map((e, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100">{e.icon}</div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-800">{e.t}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{e.ago}</p>
                </div>
              </li>
            ))}
          </ol>
        )}

        {activeTab === "WhatsApp" && (
          <div className="space-y-2">
            {["Send Brochure", "Send Pricing", "Schedule Site Visit", "Follow-up Check-in"].map((tpl) => (
              <button key={tpl} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-indigo-300 hover:bg-indigo-50/40">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "#128C7E20" }}>
                    <MessageCircle className="h-4 w-4" style={{ color: "#128C7E" }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">{tpl}</span>
                </div>
                <Send className="h-4 w-4 text-slate-400" />
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {icon}
        {label}
      </span>
      <span className="max-w-[60%] truncate text-right text-xs font-medium text-slate-900">{value}</span>
    </div>
  );
}
