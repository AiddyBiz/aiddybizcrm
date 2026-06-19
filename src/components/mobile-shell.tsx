import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, Users, Calendar, User, Plus, Menu, Bell, Search, X, MapPin, Building2,
  Trophy, GraduationCap, CreditCard, Gift, Handshake, PhoneCall, CheckSquare, IndianRupee,
} from "lucide-react";
import { useState, type ReactNode } from "react";

type Tab = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };

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

  const isActive = (to: string) =>
    to === "/dashboard" ? pathname === "/" || pathname.startsWith("/dashboard") : pathname.startsWith(to);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-4 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3">
        <button onClick={() => setMenuOpen(true)} className="grid h-10 w-10 shrink-0 place-items-center rounded-md text-slate-700 hover:bg-slate-100 active:scale-95">
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">AiddyBiz</p>
          <h1 className="truncate text-base font-semibold leading-tight text-slate-900">{title}</h1>
        </div>
        {action ?? (
          <>
            <button className="grid h-10 w-10 place-items-center rounded-md text-slate-700 hover:bg-slate-100"><Search className="h-5 w-5" /></button>
            <Link to="/notifications" className="relative grid h-10 w-10 place-items-center rounded-md text-slate-700 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-600" />
            </Link>
          </>
        )}
      </header>

      {/* Content */}
      <main className="pb-24">{children}</main>

      {/* Bottom nav — h-16 white, border-t */}
      <nav className="fixed inset-x-0 bottom-0 z-30 h-16 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]">
        <ul className="mx-auto grid h-16 max-w-md grid-cols-5 items-center">
          <BottomItem to="/" label="Home" icon={Home} active={pathname === "/" || pathname.startsWith("/dashboard")} />
          <BottomItem to="/leads" label="Leads" icon={Users} active={isActive("/leads")} />
          <li className="flex items-center justify-center">
            <button
              onClick={() => setFabOpen(true)}
              aria-label="Quick add"
              className="-mt-4 grid h-11 w-11 place-items-center rounded-full bg-indigo-600 text-white shadow-md ring-4 ring-white transition active:scale-95 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </li>
          <BottomItem to="/calendar" label="Calendar" icon={Calendar} active={isActive("/calendar")} />
          <BottomItem to="/profile" label="Profile" icon={User} active={isActive("/profile")} />
        </ul>
      </nav>

      {/* FAB bottom sheet */}
      {fabOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setFabOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-xl bg-white p-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-xl fade-in">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Quick add</h3>
              <button onClick={() => setFabOpen(false)} className="grid h-8 w-8 place-items-center rounded-md hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <ul className="space-y-2">
              {QUICK_ACTIONS.map((a) => (
                <li key={a.label}>
                  <Link to={a.to} onClick={() => setFabOpen(false)} className="flex items-center gap-3 rounded-md border border-slate-200 p-3 hover:bg-slate-50">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-indigo-50 text-indigo-600"><a.icon className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{a.label}</p>
                      <p className="truncate text-xs text-slate-500">{a.desc}</p>
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
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[82%] max-w-sm overflow-y-auto bg-white p-5 pt-[max(env(safe-area-inset-top),1.25rem)] shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-indigo-600 text-base font-bold text-white">A</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">AiddyBiz</p>
                  <p className="text-xs text-slate-500">Real Estate CRM</p>
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} className="grid h-9 w-9 place-items-center rounded-md hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <ul className="space-y-0.5">
              {MENU_LINKS.map((l) => {
                const active = pathname === l.to || (l.to !== "/dashboard" && pathname.startsWith(l.to));
                return (
                  <li key={l.to}>
                    <Link to={l.to} onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${active ? "bg-indigo-50 text-indigo-600" : "text-slate-700 hover:bg-slate-50"}`}>
                      <l.icon className="h-5 w-5" />{l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link to="/" onClick={() => setMenuOpen(false)} className="mt-6 block rounded-md border border-slate-200 px-4 py-2.5 text-center text-sm font-medium text-slate-600 hover:bg-slate-50">Sign out</Link>
          </aside>
        </div>
      )}
    </div>
  );
}

function BottomItem({ to, label, icon: Icon, active }: { to: string; label: string; icon: React.ComponentType<{ className?: string }>; active: boolean }) {
  return (
    <li>
      <Link to={to} className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium ${active ? "text-indigo-600" : "text-slate-400"}`}>
        <Icon className="h-5 w-5" />
        {label}
      </Link>
    </li>
  );
}

/* Shared atoms */
export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 mt-6 flex items-center justify-between px-1">
      <h2 className="text-sm font-semibold tracking-tight text-slate-900">{title}</h2>
      {action}
    </div>
  );
}

export function Chip({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "success" | "warning" | "info" | "primary" | "destructive" }) {
  const map: Record<string, string> = {
    default: "bg-slate-100 text-slate-600 border-slate-200",
    primary: "bg-indigo-50 text-indigo-600 border-indigo-100",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
    info: "bg-sky-50 text-sky-600 border-sky-100",
    destructive: "bg-red-50 text-red-600 border-red-100",
  };
  return <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${map[tone]}`}>{children}</span>;
}

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}

export function Tabs({ tabs, value, onChange }: { tabs: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="border-b border-slate-200">
      <div className="flex">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`flex-1 border-b-2 px-2 py-2.5 text-xs font-semibold transition ${value === t ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
