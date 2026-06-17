import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, SectionTitle, Chip, Avatar } from "@/components/mobile-shell";
import { TrendingUp, PhoneCall, MapPin, IndianRupee, ArrowUpRight, Flame, Clock, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AiddyBiz CRM" }, { name: "description", content: "Your real estate pipeline at a glance." }] }),
  component: Dashboard,
});

const stats = [
  { label: "New Leads", value: "28", delta: "+12%", icon: TrendingUp, tone: "primary" },
  { label: "Follow-ups", value: "14", delta: "Today", icon: PhoneCall, tone: "info" },
  { label: "Site Visits", value: "6", delta: "This week", icon: MapPin, tone: "warning" },
  { label: "Revenue", value: "₹42L", delta: "+8.4%", icon: IndianRupee, tone: "success" },
];

const hotLeads = [
  { name: "Ananya Sharma", project: "Prestige Lakeside", score: 92, time: "12 min ago" },
  { name: "Rohan Mehta", project: "Sobha Dream Acres", score: 88, time: "1 hr ago" },
  { name: "Kavya Iyer", project: "Brigade Cornerstone", score: 81, time: "2 hr ago" },
];

const activity = [
  { who: "You", what: "called Ananya Sharma", when: "12m" },
  { who: "Riya", what: "scheduled visit with Karthik", when: "1h" },
  { who: "System", what: "moved 3 leads to Qualified", when: "3h" },
];

function Dashboard() {
  return (
    <MobileShell title="Dashboard">
      <div className="px-4 pt-4">
        {/* Greeting */}
        <div className="card-soft relative overflow-hidden p-5">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
          <p className="text-xs text-muted-foreground">Good morning, Arjun</p>
          <h2 className="mt-1 font-display text-xl font-semibold">You have <span className="text-primary">14 follow-ups</span> today</h2>
          <div className="mt-4 flex items-center gap-2">
            <button className="rounded-full grad-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Start day plan</button>
            <button className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium">View pipeline</button>
          </div>
        </div>

        {/* Stat grid */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="card-soft p-4">
              <div className="flex items-center justify-between">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-surface-elevated"><s.icon className="h-4 w-4 text-primary" /></span>
                <Chip tone={s.tone as never}>{s.delta}</Chip>
              </div>
              <p className="mt-3 font-display text-2xl font-semibold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Pipeline */}
        <SectionTitle title="Pipeline" action={<button className="text-xs font-medium text-primary">This month</button>} />
        <div className="card-soft p-4">
          {[
            { label: "New", count: 28, pct: 100, color: "bg-info" },
            { label: "Qualified", count: 17, pct: 60, color: "bg-primary" },
            { label: "Visit", count: 9, pct: 32, color: "bg-warning" },
            { label: "Negotiation", count: 5, pct: 18, color: "bg-accent" },
            { label: "Closed", count: 3, pct: 10, color: "bg-success" },
          ].map((s) => (
            <div key={s.label} className="mb-3 last:mb-0">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium">{s.label}</span>
                <span className="text-muted-foreground">{s.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
                <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%`, background: undefined }} />
              </div>
            </div>
          ))}
        </div>

        {/* Hot leads */}
        <SectionTitle title="Hot leads" action={<button className="text-xs font-medium text-primary">View all</button>} />
        <ul className="space-y-2">
          {hotLeads.map((l) => (
            <li key={l.name} className="card-soft flex items-center gap-3 p-3">
              <Avatar name={l.name} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold">{l.name}</p>
                  <Chip tone="primary"><Flame className="h-3 w-3" />{l.score}</Chip>
                </div>
                <p className="truncate text-xs text-muted-foreground">{l.project} · {l.time}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </li>
          ))}
        </ul>

        {/* Activity */}
        <SectionTitle title="Recent activity" />
        <ul className="card-soft divide-y divide-border/60 overflow-hidden">
          {activity.map((a, i) => (
            <li key={i} className="flex items-center gap-3 p-3 text-sm">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated"><Clock className="h-4 w-4 text-muted-foreground" /></span>
              <p className="flex-1"><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.what}</span></p>
              <span className="text-xs text-muted-foreground">{a.when}</span>
            </li>
          ))}
        </ul>

        <a href="#" className="mt-6 flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm">
          <div>
            <p className="font-semibold text-primary">Upgrade to Pro</p>
            <p className="text-xs text-muted-foreground">Unlock AI lead scoring & WhatsApp automation</p>
          </div>
          <ArrowUpRight className="h-5 w-5 text-primary" />
        </a>
      </div>
    </MobileShell>
  );
}
