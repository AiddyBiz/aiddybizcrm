import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell, Chip, Avatar, SectionTitle } from "@/components/mobile-shell";
import { Phone, MessageCircle, Mail, MapPin, ChevronLeft, Flame, Calendar, PhoneCall, FileText, Building2 } from "lucide-react";

export const Route = createFileRoute("/leads/$id")({
  head: () => ({ meta: [{ title: "Lead Detail — AiddyBiz CRM" }] }),
  component: LeadDetail,
});

function LeadDetail() {
  const { id } = Route.useParams();
  return (
    <MobileShell title="Lead Detail" action={
      <Link to="/leads" className="grid h-10 w-10 place-items-center rounded-full bg-surface"><ChevronLeft className="h-5 w-5" /></Link>
    }>
      <div className="px-4 pt-4">
        <div className="card-soft relative overflow-hidden p-5">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
          <div className="flex items-center gap-4">
            <Avatar name="Ananya Sharma" size={64} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate font-display text-lg font-semibold">Ananya Sharma</h2>
                <Chip tone="primary"><Flame className="h-3 w-3" />92</Chip>
              </div>
              <p className="text-xs text-muted-foreground">Lead #{id} · Added 2 days ago</p>
              <Chip tone="info">Qualified</Chip>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-4 gap-2">
            {[
              { label: "Call", icon: Phone },
              { label: "WhatsApp", icon: MessageCircle },
              { label: "Email", icon: Mail },
              { label: "Visit", icon: MapPin },
            ].map((a) => (
              <button key={a.label} className="flex flex-col items-center gap-1.5 rounded-2xl bg-surface-elevated py-3 text-[11px] font-medium">
                <span className="grid h-9 w-9 place-items-center rounded-xl grad-primary text-primary-foreground"><a.icon className="h-4 w-4" /></span>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <SectionTitle title="Requirement" />
        <div className="card-soft grid grid-cols-2 gap-4 p-4 text-sm">
          {[
            ["Budget", "₹1.8 – 2.2 Cr"],
            ["Config", "3 BHK"],
            ["Location", "Whitefield"],
            ["Timeline", "2–3 months"],
            ["Source", "Meta Ads"],
            ["Assigned", "Arjun K."],
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

        <SectionTitle title="Timeline" />
        <ol className="relative ml-3 space-y-4 border-l border-border pl-5">
          {[
            { icon: PhoneCall, title: "Call completed · 6 min", when: "Today, 10:24 AM", note: "Discussed 3BHK options, wants site visit Saturday." },
            { icon: MessageCircle, title: "WhatsApp sent", when: "Yesterday", note: "Shared floor plans for Prestige Lakeside." },
            { icon: Calendar, title: "Visit scheduled", when: "Sat, 21 Jun · 11:00 AM", note: "Prestige Lakeside sample flat." },
            { icon: FileText, title: "Lead created", when: "2 days ago", note: "Source: Meta Ads campaign 'Premium Whitefield'." },
          ].map((t, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[34px] grid h-7 w-7 place-items-center rounded-full bg-surface-elevated ring-4 ring-background"><t.icon className="h-3.5 w-3.5 text-primary" /></span>
              <p className="text-sm font-semibold">{t.title}</p>
              <p className="text-[11px] text-muted-foreground">{t.when}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t.note}</p>
            </li>
          ))}
        </ol>

        <SectionTitle title="Notes" />
        <div className="card-soft p-4 text-sm">
          <p className="text-muted-foreground">Prefers East-facing units. Husband working at ITPL. Wants to close within 3 months. Sensitive to maintenance charges.</p>
        </div>
      </div>
    </MobileShell>
  );
}
