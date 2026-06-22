import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Home, Users, Calendar, User, Plus, Menu, Bell, Search, X, MapPin, Building2,
  Trophy, GraduationCap, CreditCard, Gift, Handshake, PhoneCall, CheckSquare,
  ArrowRight, Check,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { LEADS } from "@/lib/leads-data";
import { onQuickAdd, openQuickAdd, onGlobalSearch, openGlobalSearch, saveQuickAddEntry, type QuickAddType } from "@/lib/quick-add-store";

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

const QUICK_ACTIONS: { label: string; desc: string; icon: React.ComponentType<{ className?: string }>; type: QuickAddType }[] = [
  { label: "Add Lead", desc: "Capture a new lead", icon: Users, type: "lead" },
  { label: "Add Follow-up", desc: "Schedule a call or message", icon: PhoneCall, type: "followup" },
  { label: "Schedule Site Visit", desc: "Book a property visit", icon: MapPin, type: "visit" },
  { label: "Add Deal", desc: "Move lead to negotiation", icon: IndianRupee, type: "deal" },
  { label: "Add Task", desc: "Personal to-do", icon: CheckSquare, type: "task" },
];

export function MobileShell({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [quickAdd, setQuickAdd] = useState<QuickAddType | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => onQuickAdd((t) => setQuickAdd(t)), []);
  useEffect(() => onGlobalSearch(() => setSearchOpen(true)), []);

  const isActive = (to: string) =>
    to === "/dashboard" ? pathname === "/" || pathname.startsWith("/dashboard") : pathname.startsWith(to);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
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
            <button onClick={() => openGlobalSearch()} className="grid h-10 w-10 place-items-center rounded-md text-slate-700 hover:bg-slate-100"><Search className="h-5 w-5" /></button>
            <Link to="/notifications" className="relative grid h-10 w-10 place-items-center rounded-md text-slate-700 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-600" />
            </Link>
          </>
        )}
      </header>

      <main className="pb-24">{children}</main>

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
                  <button
                    type="button"
                    onClick={() => { setFabOpen(false); openQuickAdd(a.type); }}
                    className="flex w-full items-center gap-3 rounded-md border border-slate-200 p-3 text-left hover:bg-slate-50"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-indigo-50 text-indigo-600"><a.icon className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{a.label}</p>
                      <p className="truncate text-xs text-slate-500">{a.desc}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

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

      {quickAdd && <QuickAddModal type={quickAdd} onClose={() => setQuickAdd(null)} />}
      {searchOpen && <GlobalSearchOverlay onClose={() => setSearchOpen(false)} />}
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

/* ---------- Quick Add Modal ---------- */
function QuickAddModal({ type, onClose }: { type: QuickAddType; onClose: () => void }) {
  const navigate = useNavigate();
  const cfg = {
    lead:     { title: "Add New Lead",       icon: Users,      goto: "/leads",     fields: ["Full name", "Phone", "Project", "Budget"] },
    followup: { title: "Schedule Follow-up", icon: PhoneCall,  goto: "/followups", fields: ["Lead", "Date & time", "Channel", "Notes"] },
    visit:    { title: "Schedule Site Visit",icon: MapPin,     goto: "/visits",    fields: ["Lead", "Project", "Date & time", "Notes"] },
    deal:     { title: "Add Deal",           icon: IndianRupee,goto: "/deals",     fields: ["Lead", "Project", "Deal value", "Stage"] },
    task:     { title: "Add Task",           icon: CheckSquare,goto: "/calendar",  fields: ["Title", "Due date", "Priority", "Notes"] },
  }[type];
  const Icon = cfg.icon;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/50 sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-50 text-indigo-600"><Icon className="h-5 w-5" /></span>
          <h3 className="flex-1 text-base font-semibold text-slate-900">{cfg.title}</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); onClose(); navigate({ to: cfg.goto }); }}
          className="mt-4 space-y-3"
        >
          {cfg.fields.map((f) => (
            <label key={f} className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{f}</span>
              <input
                placeholder={f}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
          ))}
          <button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700">
            Save <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------- Global Search ---------- */
function GlobalSearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return { leads: [], pages: [] as { label: string; to: string }[] };
    const leads = LEADS.filter((l) =>
      l.name.toLowerCase().includes(term) ||
      l.project.toLowerCase().includes(term) ||
      l.phone.includes(term) ||
      l.email.toLowerCase().includes(term)
    ).slice(0, 6);
    const pages = MENU_LINKS
      .filter((p) => p.label.toLowerCase().includes(term))
      .map((p) => ({ label: p.label, to: p.to }));
    return { leads, pages };
  }, [q]);

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="mt-12 w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2.5">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            autoFocus
            placeholder="Search leads, projects, pages…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-2">
          {!q.trim() && <p className="px-3 py-6 text-center text-xs text-slate-500">Type to search leads, projects, and pages</p>}
          {results.leads.length > 0 && (
            <>
              <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Leads</p>
              <ul>
                {results.leads.map((l) => (
                  <li key={l.id}>
                    <button onClick={() => { onClose(); navigate({ to: "/leads/$id", params: { id: l.id } }); }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-50">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                        {l.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">{l.name}</p>
                        <p className="truncate text-[11px] text-slate-500">{l.project} · {l.phone}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {results.pages.length > 0 && (
            <>
              <p className="px-3 pt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Pages</p>
              <ul>
                {results.pages.map((p) => (
                  <li key={p.to}>
                    <button onClick={() => { onClose(); navigate({ to: p.to }); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50">
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" /> {p.label}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {q.trim() && results.leads.length === 0 && results.pages.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-slate-500">No results for "{q}"</p>
          )}
        </div>
      </div>
    </div>
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
