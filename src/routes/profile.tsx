import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell, Avatar, Chip, SectionTitle } from "@/components/mobile-shell";
import { Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, Pencil, CreditCard, Gift, Trophy } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — AiddyBiz CRM" }] }),
  component: Profile,
});

function Profile() {
  return (
    <MobileShell title="Profile">
      <div className="px-4 pt-4">
        <div className="card-soft relative overflow-hidden p-5">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/25 blur-2xl" />
          <div className="flex items-center gap-4">
            <Avatar name="Arjun K" size={72} />
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-display text-lg font-semibold">Arjun Krishnan</h2>
              <p className="text-xs text-muted-foreground">Senior Sales Manager · Bengaluru</p>
              <Chip tone="primary">Pro Plan</Chip>
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-full bg-surface-elevated"><Pencil className="h-4 w-4" /></button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-surface-elevated p-3 text-center">
            {[
              { v: "248", l: "Leads" },
              { v: "32", l: "Deals" },
              { v: "₹4.2Cr", l: "Revenue" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-base font-semibold">{s.v}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <SectionTitle title="Account" />
        <ul className="card-soft divide-y divide-border/60 overflow-hidden">
          {[
            { l: "Subscription", icon: CreditCard, to: "/subscription", right: <Chip tone="primary">Pro</Chip> },
            { l: "Refer & Earn", icon: Gift, to: "/refer", right: <Chip tone="success">₹2,000</Chip> },
            { l: "Rankings", icon: Trophy, to: "/rankings" },
            { l: "Notifications", icon: Bell, to: "/profile" },
            { l: "Privacy & Security", icon: Shield, to: "/profile" },
            { l: "Preferences", icon: Settings, to: "/profile" },
            { l: "Help center", icon: HelpCircle, to: "/profile" },
          ].map((r) => (
            <li key={r.l}>
              <Link to={r.to} className="flex items-center gap-3 p-4">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface-elevated"><r.icon className="h-4 w-4 text-primary" /></span>
                <span className="flex-1 text-sm font-medium">{r.l}</span>
                {r.right}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>

        <Link to="/" className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 py-3 text-sm font-semibold text-destructive">
          <LogOut className="h-4 w-4" /> Sign out
        </Link>
        <p className="mt-4 text-center text-[11px] text-muted-foreground">AiddyBiz · v3.2.0</p>
      </div>
    </MobileShell>
  );
}
