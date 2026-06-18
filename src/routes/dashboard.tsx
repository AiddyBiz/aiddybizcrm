import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell, SectionTitle, Chip, Avatar } from "@/components/mobile-shell";
import { Flame, PhoneCall, Car, IndianRupee, ChevronRight, TrendingUp, Trophy, Zap, Target } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AiddyBiz CRM" }, { name: "description", content: "Your real estate pipeline at a glance." }] }),
  component: Dashboard,
});

const TODAY_FOCUS = [
  { label: "Hot Leads", value: 8, icon: Flame, emoji: "🔥", tone: "primary", to: "/leads" },
  { label: "Follow-ups Due", value: 14, icon: PhoneCall, emoji: "📞", tone: "info", to: "/followups" },
  { label: "Site Visits Today", value: 3, icon: Car, emoji: "🚗", tone: "warning", to: "/visits" },
  { label: "Deals Closing", value: 5, icon: IndianRupee, emoji: "💰", tone: "success", to: "/deals" },
] as const;

const MISSIONS = [
  { label: "Calls", done: 18, total: 25 },
  { label: "Follow-ups", done: 9, total: 14 },
  { label: "Site Visits", done: 2, total: 4 },
];

// 7 weeks x 7 days mock contribution data
const ACTIVITY = Array.from({ length: 49 }, (_, i) => {
  const seeded = (i * 9301 + 49297) % 233280;
  const v = (seeded / 233280) * 4;
  return Math.floor(v);
});

function Dashboard() {
  return (
    <MobileShell title="Dashboard">
      <div className="space-y-5 px-4 pt-4">
        {/* Greeting */}
        <div className="card-soft relative overflow-hidden p-5">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/25 blur-2xl" />
          <p className="text-xs text-muted-foreground">Good morning, Arjun</p>
          <h2 className="mt-1 text-xl font-semibold">You have <span className="text-primary">14 follow-ups</span> today</h2>
          <div className="mt-4 flex items-center gap-2">
            <Link to="/followups" className="rounded-full grad-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Start day plan</Link>
            <Link to="/deals" className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium">View pipeline</Link>
          </div>
        </div>

        {/* Today's Focus */}
        <section>
          <SectionTitle title="Today's Focus" />
          <div className="grid grid-cols-2 gap-3">
            {TODAY_FOCUS.map((f) => (
              <Link key={f.label} to={f.to} className="card-soft p-4 active:scale-[0.99]">
                <div className="flex items-center justify-between">
                  <span className="text-xl">{f.emoji}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-3 text-2xl font-semibold">{f.value}</p>
                <p className="text-xs text-muted-foreground">{f.label}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Growth + Streak */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/profile" className="card-soft relative overflow-hidden p-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Growth</p>
            </div>
            <p className="mt-2 text-2xl font-semibold">Lvl 12</p>
            <p className="text-xs text-muted-foreground">2,840 XP · Gold league</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-elevated">
              <div className="h-full w-[72%] grad-primary" />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">City rank #14</p>
          </Link>
          <div className="card-soft relative overflow-hidden p-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-warning/20 blur-2xl" />
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Streak</p>
            </div>
            <p className="mt-2 text-2xl font-semibold">🔥 21</p>
            <p className="text-xs text-muted-foreground">days active</p>
            <div className="mt-3 flex gap-1">
              {[1,2,3,4,5,6,7].map((d) => (
                <span key={d} className={`h-2 flex-1 rounded-full ${d <= 5 ? "bg-primary" : "bg-surface-elevated"}`} />
              ))}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">5 / 7 this week</p>
          </div>
        </div>

        {/* Sales Momentum */}
        <section>
          <SectionTitle title="Sales Momentum" action={<span className="text-xs text-muted-foreground">last 7 weeks</span>} />
          <div className="card-soft p-4">
            <div className="flex gap-1.5">
              {Array.from({ length: 7 }).map((_, w) => (
                <div key={w} className="flex flex-1 flex-col gap-1.5">
                  {Array.from({ length: 7 }).map((_, d) => {
                    const v = ACTIVITY[w * 7 + d];
                    const bg =
                      v === 0 ? "bg-surface-elevated" :
                      v === 1 ? "bg-primary/25" :
                      v === 2 ? "bg-primary/55" :
                      "bg-primary";
                    return <span key={d} className={`aspect-square w-full rounded-[4px] ${bg}`} />;
                  })}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-surface-elevated" />
                <span className="h-2.5 w-2.5 rounded-sm bg-primary/25" />
                <span className="h-2.5 w-2.5 rounded-sm bg-primary/55" />
                <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
              </div>
              <span>More</span>
            </div>
          </div>
        </section>

        {/* Weekly Mission */}
        <section>
          <SectionTitle title="Weekly Mission" action={<Chip tone="primary"><Target className="h-3 w-3" />+250 XP</Chip>} />
          <div className="card-soft space-y-3 p-4">
            {MISSIONS.map((m) => {
              const pct = Math.round((m.done / m.total) * 100);
              return (
                <div key={m.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{m.label}</span>
                    <span className="text-muted-foreground">{m.done}/{m.total}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
                    <div className="h-full rounded-full grad-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Hot leads */}
        <section>
          <SectionTitle title="Hot leads" action={<Link to="/leads" className="text-xs font-medium text-primary">View all</Link>} />
          <ul className="space-y-2">
            {[
              { id: "1", name: "Ananya Sharma", project: "Prestige Lakeside", score: 92, time: "12 min ago" },
              { id: "2", name: "Rohan Mehta", project: "Sobha Dream Acres", score: 88, time: "1 hr ago" },
              { id: "5", name: "Priya Nair", project: "Prestige Lakeside", score: 81, time: "2 hr ago" },
            ].map((l) => (
              <li key={l.name}>
                <Link to="/leads/$id" params={{ id: l.id }} className="card-soft flex items-center gap-3 p-3">
                  <Avatar name={l.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">{l.name}</p>
                      <Chip tone="primary"><Flame className="h-3 w-3" />{l.score}</Chip>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{l.project} · {l.time}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <Link to="/subscription" className="flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm">
          <div>
            <p className="font-semibold text-primary">Upgrade to Pro</p>
            <p className="text-xs text-muted-foreground">AI scoring · WhatsApp templates · Unlimited leads</p>
          </div>
          <TrendingUp className="h-5 w-5 text-primary" />
        </Link>
      </div>
    </MobileShell>
  );
}
