import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell, Avatar, Chip, SectionTitle, Tabs } from "@/components/mobile-shell";
import { Pencil, Trophy, Zap, Flame, Target, Award, BookOpen, Gift, MapPin, TrendingUp, Star, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — AiddyBiz CRM" }] }),
  component: Profile,
});

function Profile() {
  const [tab, setTab] = useState("Overview");
  return (
    <MobileShell title="My Growth">
      <div className="px-4 pt-4">
        {/* Identity + Growth header */}
        <div className="card-soft relative overflow-hidden p-5">
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary/25 blur-2xl" />
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar name="Arjun K" size={72} />
              <span className="absolute -bottom-1 -right-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">L12</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-semibold">Arjun Krishnan</h2>
              <p className="text-xs text-muted-foreground">Senior Sales · Bengaluru</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <Chip tone="primary"><Trophy className="h-3 w-3" />Gold</Chip>
                <Chip tone="warning"><Flame className="h-3 w-3" />21d</Chip>
              </div>
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-full bg-surface-elevated"><Pencil className="h-4 w-4" /></button>
          </div>

          {/* XP bar */}
          <div className="mt-4 rounded-2xl bg-surface-elevated p-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium">Level 12 · Gold league</span>
              <span className="text-muted-foreground">2,840 / 3,500 XP</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-background">
              <div className="h-full w-[81%] grad-primary" />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">660 XP to Platinum</p>
          </div>

          {/* Ranks grid */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { l: "City", v: "#14", sub: "Bengaluru" },
              { l: "State", v: "#82", sub: "Karnataka" },
              { l: "National", v: "#341", sub: "India" },
            ].map((r) => (
              <div key={r.l} className="rounded-2xl bg-surface-elevated p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.l}</p>
                <p className="mt-1 text-base font-semibold text-primary">{r.v}</p>
                <p className="text-[10px] text-muted-foreground">{r.sub}</p>
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl bg-surface-elevated p-3 text-center">
            {[
              { v: "248", l: "Leads" },
              { v: "32", l: "Deals" },
              { v: "₹4.2Cr", l: "Revenue" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-base font-semibold">{s.v}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <Tabs tabs={["Overview", "Performance", "Achievements", "Learning", "Rewards"]} value={tab} onChange={setTab} />
        </div>

        {tab === "Overview" && (
          <>
            <SectionTitle title="Growth highlights" />
            <ul className="grid grid-cols-2 gap-3">
              {[
                { l: "Growth Score", v: "892", icon: TrendingUp },
                { l: "Streak", v: "🔥 21", icon: Zap },
                { l: "Badges", v: "14", icon: Award },
                { l: "Missions", v: "9/12", icon: Target },
              ].map((s) => (
                <li key={s.l} className="card-soft p-4">
                  <s.icon className="h-4 w-4 text-primary" />
                  <p className="mt-2 text-xl font-semibold">{s.v}</p>
                  <p className="text-xs text-muted-foreground">{s.l}</p>
                </li>
              ))}
            </ul>
            <SectionTitle title="Quick links" />
            <ul className="card-soft divide-y divide-border/60 overflow-hidden">
              {[
                { l: "Rankings", icon: Trophy, to: "/rankings" },
                { l: "Learning Zone", icon: BookOpen, to: "/learning" },
                { l: "Refer & Earn", icon: Gift, to: "/refer" },
                { l: "Subscription", icon: Star, to: "/subscription" },
              ].map((r) => (
                <li key={r.l}>
                  <Link to={r.to} className="flex items-center gap-3 p-4">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface-elevated"><r.icon className="h-4 w-4 text-primary" /></span>
                    <span className="flex-1 text-sm font-medium">{r.l}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === "Performance" && (
          <>
            <SectionTitle title="This month" />
            <div className="card-soft space-y-3 p-4">
              {[
                { l: "Calls made", done: 142, total: 180 },
                { l: "Site visits", done: 14, total: 20 },
                { l: "Deals closed", done: 6, total: 10 },
                { l: "Revenue", done: 78, total: 100, suffix: "L" },
              ].map((m) => (
                <div key={m.l}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{m.l}</span>
                    <span className="text-muted-foreground">{m.done}{m.suffix ?? ""} / {m.total}{m.suffix ?? ""}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
                    <div className="h-full grad-primary" style={{ width: `${(m.done / m.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "Achievements" && (
          <>
            <SectionTitle title="Badges" />
            <ul className="grid grid-cols-3 gap-3">
              {[
                { l: "First Deal", emoji: "🥇" },
                { l: "10 Visits", emoji: "🚗" },
                { l: "Streak 7", emoji: "🔥" },
                { l: "Streak 21", emoji: "⚡" },
                { l: "Top 20", emoji: "🏆" },
                { l: "Hot Closer", emoji: "💎" },
              ].map((b) => (
                <li key={b.l} className="card-soft flex flex-col items-center gap-1 p-3 text-center">
                  <span className="text-2xl">{b.emoji}</span>
                  <p className="text-[11px] font-medium">{b.l}</p>
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === "Learning" && (
          <>
            <SectionTitle title="Continue learning" action={<Link to="/learning" className="text-xs font-medium text-primary">Open</Link>} />
            {[
              { t: "Negotiation Masterclass", p: 64 },
              { t: "RERA Essentials 2025", p: 30 },
            ].map((c) => (
              <div key={c.t} className="card-soft mb-3 p-4">
                <p className="text-sm font-semibold">{c.t}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-elevated">
                  <div className="h-full grad-primary" style={{ width: `${c.p}%` }} />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{c.p}% complete</p>
              </div>
            ))}
          </>
        )}

        {tab === "Rewards" && (
          <>
            <SectionTitle title="Available rewards" />
            <ul className="space-y-2">
              {[
                { l: "₹500 Amazon voucher", pts: 2000, unlocked: true },
                { l: "Premium swag kit", pts: 5000, unlocked: false },
                { l: "Bali trip raffle", pts: 10000, unlocked: false },
              ].map((r) => (
                <li key={r.l} className="card-soft flex items-center gap-3 p-4">
                  <Gift className="h-5 w-5 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{r.l}</p>
                    <p className="text-xs text-muted-foreground">{r.pts.toLocaleString()} pts</p>
                  </div>
                  {r.unlocked
                    ? <Chip tone="success"><CheckCircle2 className="h-3 w-3" />Unlocked</Chip>
                    : <Chip>Locked</Chip>}
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="mt-6 text-center text-[11px] text-muted-foreground">AiddyBiz · v3.2.0 · <MapPin className="inline h-3 w-3" /> Bengaluru</p>
      </div>
    </MobileShell>
  );
}
