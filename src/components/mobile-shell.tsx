import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Users, Calendar, User, Plus, Menu, Bell, Search, X, MapPin, Building2, Trophy, GraduationCap, CreditCard, Gift, Handshake, PhoneCall } from "lucide-react";
import { useState, type ReactNode } from "react";

type Tab = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };

const BOTTOM_TABS: Tab[] = [
  { to: "/dashboard", label: "Home", icon: Home },
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
  { to: "/profile", label: "Profile", icon: User },
  { to: "/subscription", label: "Subscription", icon: CreditCard },
  { to: "/refer", label: "Refer & Earn", icon: Gift },
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
          <h1 className="truncate font-display text-lg font-semibold leading-tight">{title}</h1>
        </div>
        {action ?? (
          <>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-surface text-foreground/90 active:scale-95"><Search className="h-5 w-5" /></button>
            <button className="relative grid h-10 w-10 place-items-center rounded-full bg-surface text-foreground/90 active:scale-95">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </button>
          </>
        )}
      </header>

      {/* Content */}
      <main className="pb-32">{children}</main>

      {/* FAB */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-40 flex justify-center">
        <div className="pointer-events-auto flex flex-col items-center gap-3">
          {fabOpen && (
            <div className="flex flex-col items-end gap-2 rounded-3xl glass p-2 shadow-2xl">
              {[
                { label: "Add Lead", icon: Users, to: "/leads" },
                { label: "Schedule Visit", icon: MapPin, to: "/visits" },
                { label: "Log Call", icon: PhoneCall, to: "/followups" },
                { label: "Create Deal", icon: Handshake, to: "/deals" },
              ].map((a) => (
                <Link key={a.label} to={a.to} onClick={() => setFabOpen(false)} className="flex items-center gap-3 rounded-2xl bg-surface-elevated px-3 py-2 pr-4 text-sm font-medium">
                  <span className="grid h-8 w-8 place-items-center rounded-xl grad-primary text-primary-foreground"><a.icon className="h-4 w-4" /></span>
                  {a.label}
                </Link>
              ))}
            </div>
          )}
          <button
            onClick={() => setFabOpen((v) => !v)}
            aria-label="Quick add"
            className="grid h-14 w-14 place-items-center rounded-full grad-primary text-primary-foreground shadow-[0_10px_30px_-8px_oklch(0.88_0.19_125/0.6)] transition active:scale-95"
          >
            {fabOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="glass fixed inset-x-0 bottom-0 z-30 border-t border-border/60 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
        <ul className="mx-auto grid max-w-md grid-cols-5 items-end">
          {BOTTOM_TABS.slice(0, 2).map((t) => <NavItem key={t.to} tab={t} active={pathname.startsWith(t.to)} />)}
          <li />
          {BOTTOM_TABS.slice(2).map((t) => <NavItem key={t.to} tab={t} active={pathname.startsWith(t.to)} />)}
        </ul>
      </nav>

      {/* Side menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[82%] max-w-sm overflow-y-auto bg-surface-elevated p-5 pt-[max(env(safe-area-inset-top),1.25rem)] shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl grad-primary font-display text-lg font-bold text-primary-foreground">A</div>
                <div>
                  <p className="font-display text-base font-semibold">AiddyBiz</p>
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
      <Link to={tab.to} className={`flex flex-col items-center gap-1 py-1 text-[11px] font-medium transition ${active ? "text-primary" : "text-muted-foreground"}`}>
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
      <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
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
  const hues = [125, 250, 200, 30, 320, 160];
  const hue = hues[name.charCodeAt(0) % hues.length];
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full font-display text-sm font-semibold text-primary-foreground"
      style={{ width: size, height: size, background: `linear-gradient(135deg, oklch(0.82 0.16 ${hue}), oklch(0.65 0.18 ${(hue + 40) % 360}))` }}
    >
      {initials}
    </div>
  );
}
