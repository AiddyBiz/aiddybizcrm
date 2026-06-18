import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, Users, Calendar, User, Plus, Menu, Bell, Search, X, MapPin, Building2,
  Trophy, GraduationCap, CreditCard, Gift, Handshake, PhoneCall, CheckSquare, IndianRupee,
} from "lucide-react";
import { useState, type ReactNode } from "react";

type Tab = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };

const BOTTOM_TABS: Tab[] = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/profile", label: "Profile", icon: User },
];

const MENU_LINKS: Tab[] = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/followups", label: "Follow-ups", icon: PhoneCall },
  { to: "/visits", label: "Site Visits", icon: MapPin },
  { to: "/projects", label: "Projects", icon: Building2 },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/deals", label: "Deals", icon: Handshake },
  { to: "/rankings", label: "Rankings", icon: Trophy },
  { to: "/learning", label: "Learning Zone", icon: GraduationCap },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/subscription", label: "Subscription", icon: CreditCard },
  { to: "/refer", label: "Refer & Earn", icon: Gift },
];

const QUICK_ACTIONS = [
  { label: "Add Lead", desc: "Capture a new lead", icon: Users, to: "/leads" },
  { label: "Add Follow-up", desc: "Schedule a call or message", icon: PhoneCall, to: "/followups" },
  { label: "Schedule Site Visit", desc: "Book a property visit", icon: MapPin, to: "/visits" },
  { label: "Add Deal", desc: "Move lead to negotiation", icon: IndianRupee, to: "/deals" },
  { label: "Add Task", desc: "Personal to-do", icon: CheckSquare, to: "/calendar" },
];

export function MobileShell({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="glass sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 px-4 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3">
        <button onClick={() => setMenuOpen(true)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface text-foreground/90 active:scale-95">
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">AiddyBiz</p>
          <h1 className="truncate text-lg font-semibold leading-tight">{title}</h1>
        </div>
        {action ?? (
          <>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-surface text-foreground/90 active:scale-95"><Search className="h-5 w-5" /></button>
            <Link to="/notifications" className="relative grid h-10 w-10 place-items-center rounded-full bg-surface text-foreground/90 active:scale-95">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </Link>
          </>
        )}
      </header>

      {/* Content */}
      <main className="pb-28">{children}</main>

      {/* Bottom nav with centered FAB notch */}
      <nav className="glass fixed inset-x-0 bottom-0 z-30 border-t border-border/60 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
        <ul className="mx-auto grid max-w-md grid-cols-5 items-center">
          <NavItem tab={BOTTOM_TABS[0]} active={pathname.startsWith(BOTTOM_TABS[0].to)} />
          <NavItem tab={BOTTOM_TABS[1]} active={pathname.startsWith(BOTTOM_TABS[1].to)} />
          {/* Spacer for FAB */}
          <li className="relative">
            <button
              onClick={() => setFabOpen(true)}
              aria-label="Quick add"
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 grid h-16 w-16 place-items-center rounded-full grad-primary text-primary-foreground shadow-[0_12px_28px_-6px_oklch(0.705_0.17_162/0.55)] ring-4 ring-background transition active:scale-95"
            >
              <Plus className="h-7 w-7" strokeWidth={2.5} />
            </button>
          </li>
          <NavItem tab={BOTTOM_TABS[2]} active={pathname.startsWith(BOTTOM_TABS[2].to)} />
          <NavItem tab={BOTTOM_TABS[3]} active={pathname.startsWith(BOTTOM_TABS[3].to)} />
        </ul>
      </nav>

      {/* FAB bottom sheet */}
      {fabOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm animate-in fade-in" onClick={() => setFabOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-surface-elevated p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-2xl animate-in slide-in-from-bottom">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold">Quick add</h3>
              <button onClick={() => setFabOpen(false)} className="grid h-8 w-8 place-items-center rounded-full bg-surface"><X className="h-4 w-4" /></button>
            </div>
            <ul className="space-y-2">
              {QUICK_ACTIONS.map((a) => (
                <li key={a.label}>
                  <Link to={a.to} onClick={() => setFabOpen(false)} className="flex items-center gap-3 rounded-2xl bg-surface p-3 active:scale-[0.99]">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl grad-primary text-primary-foreground"><a.icon className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{a.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.desc}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Side menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[82%] max-w-sm overflow-y-auto bg-surface-elevated p-5 pt-[max(env(safe-area-inset-top),1.25rem)] shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl grad-primary text-lg font-bold text-primary-foreground">A</div>
                <div>
                  <p className="text-base font-semibold">AiddyBiz</p>
                  <p className="text-xs text-muted-foreground">Real Estate CRM</p>
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-surface"><X className="h-4 w-4" /></button>
            </div>
            <ul className="space-y-1">
              {MENU_LINKS.map((l) => {
                const active = pathname === l.to || (l.to !== "/dashboard" && pathname.startsWith(l.to));
                return (
                  <li key={l.to}>
                    <Link to={l.to} onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${active ? "bg-primary/15 text-primary" : "text-foreground/85 hover:bg-surface"}`}>
                      <l.icon className="h-5 w-5" />{l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link to="/" onClick={() => setMenuOpen(false)} className="mt-6 block rounded-2xl border border-border bg-surface px-4 py-3 text-center text-sm font-medium text-muted-foreground">Sign out</Link>
          </aside>
        </div>
      )}
    </div>
  );
}

function NavItem({ tab, active }: { tab: Tab; active: boolean }) {
  const Icon = tab.icon;
  return (
    <li>
      <Link to={tab.to} className={`flex flex-col items-center gap-1 py-1 text-[10px] font-medium transition ${active ? "text-primary" : "text-muted-foreground"}`}>
        <span className={`grid h-9 w-12 place-items-center rounded-2xl transition ${active ? "bg-primary/15" : ""}`}>
          <Icon className="h-5 w-5" />
        </span>
        {tab.label}
      </Link>
    </li>
  );
}

/* Shared atoms */
export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 mt-6 flex items-center justify-between px-1">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {action}
    </div>
  );
}

export function Chip({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "success" | "warning" | "info" | "primary" | "destructive" }) {
  const map: Record<string, string> = {
    default: "bg-surface text-muted-foreground border-border",
    primary: "bg-primary/15 text-primary border-primary/30",
    success: "bg-[color-mix(in_oklab,var(--success)_18%,transparent)] text-[color:var(--success)] border-[color-mix(in_oklab,var(--success)_30%,transparent)]",
    warning: "bg-[color-mix(in_oklab,var(--warning)_18%,transparent)] text-[color:var(--warning)] border-[color-mix(in_oklab,var(--warning)_30%,transparent)]",
    info: "bg-[color-mix(in_oklab,var(--info)_18%,transparent)] text-[color:var(--info)] border-[color-mix(in_oklab,var(--info)_30%,transparent)]",
    destructive: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${map[tone]}`}>{children}</span>;
}

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const hues = [162, 200, 250, 30, 320, 130];
  const hue = hues[name.charCodeAt(0) % hues.length];
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full text-sm font-semibold text-primary-foreground"
      style={{ width: size, height: size, background: `linear-gradient(135deg, oklch(0.78 0.16 ${hue}), oklch(0.6 0.16 ${(hue + 30) % 360}))` }}
    >
      {initials}
    </div>
  );
}

export function Tabs({ tabs, value, onChange }: { tabs: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="rounded-2xl bg-surface p-1">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0,1fr))` }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => onChange(t)} className={`rounded-xl px-2 py-2 text-xs font-semibold transition ${value === t ? "grad-primary text-primary-foreground" : "text-muted-foreground"}`}>{t}</button>
        ))}
      </div>
    </div>
  );
}
