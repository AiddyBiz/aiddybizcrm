import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, Plus, Phone, Save, Target, TrendingUp, Users, X } from "lucide-react";

type Timeframe = "Weekly" | "Monthly" | "Quarterly" | "Yearly";
const DAYS: Record<Timeframe, number> = { Weekly: 7, Monthly: 30, Quarterly: 90, Yearly: 365 };

type Metric = "calls" | "visits" | "sales";
type Goals = Record<Metric, number>;
type Daily = { date: string; calls: number; visits: number; sales: number };
type Habit = { date: string; ads: boolean; social: boolean; followups: boolean; networking: number };
type OfflineContact = { id: string; name: string; phone: string; notes: string; date: string };

type MissionState = {
  timeframe: Timeframe;
  startDate: string;        // ISO yyyy-mm-dd
  goals: Goals;
  daily: Record<string, Daily>;   // by date
  habits: Record<string, Habit>;  // by date
  offline: OfflineContact[];
};

const STORAGE = "aiddybiz:mission";
const todayISO = () => new Date().toISOString().slice(0, 10);

const DEFAULT_STATE: MissionState = {
  timeframe: "Monthly",
  startDate: todayISO(),
  goals: { calls: 3000, visits: 30, sales: 6 },
  daily: {},
  habits: {},
  offline: [],
};

function load(): MissionState {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}
function save(s: MissionState) {
  try { localStorage.setItem(STORAGE, JSON.stringify(s)); } catch { /* ignore */ }
}

function daysElapsed(startDate: string) {
  const start = new Date(startDate).getTime();
  const now = new Date(todayISO()).getTime();
  return Math.max(0, Math.floor((now - start) / 86400000));
}

export function MissionDashboard() {
  const [state, setState] = useState<MissionState>(() => load());
  useEffect(() => save(state), [state]);

  const totalDays = DAYS[state.timeframe];
  const elapsed = Math.min(daysElapsed(state.startDate), totalDays - 1);
  const remainingDays = Math.max(1, totalDays - elapsed);
  const today = todayISO();
  const todayActuals = state.daily[today] ?? { date: today, calls: 0, visits: 0, sales: 0 };
  const todayHabit = state.habits[today] ?? { date: today, ads: false, social: false, followups: false, networking: 0 };

  // Original baseline per day
  const originalDaily: Goals = useMemo(() => ({
    calls: Math.ceil(state.goals.calls / totalDays),
    visits: Math.ceil(state.goals.visits / totalDays),
    sales: Math.ceil(state.goals.sales / totalDays),
  }), [state.goals, totalDays]);

  // Total achieved before today
  const achievedBeforeToday: Goals = useMemo(() => {
    const sum: Goals = { calls: 0, visits: 0, sales: 0 };
    Object.values(state.daily).forEach((d) => {
      if (d.date < today) {
        sum.calls += d.calls;
        sum.visits += d.visits;
        sum.sales += d.sales;
      }
    });
    return sum;
  }, [state.daily, today]);

  // Adjusted today = (remaining goal) / (remaining days incl. today)
  const adjustedToday: Goals = useMemo(() => {
    const adj = (goal: number, done: number) => Math.max(0, Math.ceil((goal - done) / remainingDays));
    return {
      calls: adj(state.goals.calls, achievedBeforeToday.calls),
      visits: adj(state.goals.visits, achievedBeforeToday.visits),
      sales: adj(state.goals.sales, achievedBeforeToday.sales),
    };
  }, [state.goals, achievedBeforeToday, remainingDays]);

  const setGoal = (k: Metric, v: number) => setState((s) => ({ ...s, goals: { ...s.goals, [k]: Math.max(0, v) } }));
  const setActual = (k: Metric, v: number) =>
    setState((s) => ({ ...s, daily: { ...s.daily, [today]: { ...todayActuals, [k]: Math.max(0, v) } } }));
  const setHabit = (k: keyof Omit<Habit, "date">, v: boolean | number) =>
    setState((s) => ({ ...s, habits: { ...s.habits, [today]: { ...todayHabit, [k]: v } as Habit } }));

  const [showContact, setShowContact] = useState(false);
  const addContact = (c: Omit<OfflineContact, "id" | "date">) => {
    setState((s) => ({
      ...s,
      offline: [{ id: `${Date.now()}`, date: today, ...c }, ...s.offline],
      habits: { ...s.habits, [today]: { ...todayHabit, networking: (todayHabit.networking || 0) + 1 } },
    }));
  };

  const todayOfflineCount = state.offline.filter((c) => c.date === today).length;
  const isRed = (actual: number, target: number) => actual < target;

  return (
    <div className="space-y-5">
      {/* A. Goal Configuration */}
      <section className="card-soft p-4">
        <div className="mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Edit your target</h3>
        </div>
        <label className="block text-xs">
          <span className="font-semibold uppercase tracking-wider text-muted-foreground">Timeframe</span>
          <select
            value={state.timeframe}
            onChange={(e) => setState((s) => ({ ...s, timeframe: e.target.value as Timeframe, startDate: todayISO() }))}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
          >
            {(["Weekly", "Monthly", "Quarterly", "Yearly"] as Timeframe[]).map((t) => (
              <option key={t} value={t}>{t} ({DAYS[t]} days)</option>
            ))}
          </select>
        </label>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(["calls", "visits", "sales"] as Metric[]).map((m) => (
            <label key={m} className="block">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Total {m}</span>
              <input
                type="number" min={0} value={state.goals[m]}
                onChange={(e) => setGoal(m, Number(e.target.value || 0))}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-2 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </label>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Day {elapsed + 1} of {totalDays} · {remainingDays} day(s) remaining
        </p>
      </section>

      {/* B. Daily targets — Original vs Adjusted */}
      <section className="card-soft p-4">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Today's targets</h3>
        </div>
        <div className="space-y-3">
          {(["calls", "visits", "sales"] as Metric[]).map((m) => {
            const red = isRed(todayActuals[m], adjustedToday[m]);
            const pct = adjustedToday[m] === 0 ? 100 : Math.min(100, Math.round((todayActuals[m] / adjustedToday[m]) * 100));
            return (
              <div key={m} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold capitalize">{m}</p>
                  {red ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                      <AlertTriangle className="h-3 w-3" /> Red flag
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      <Check className="h-3 w-3" /> On track
                    </span>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg bg-surface-elevated p-2">
                    <p className="text-[10px] uppercase text-muted-foreground">Original / day</p>
                    <p className="text-base font-semibold">{originalDaily[m]}</p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-2">
                    <p className="text-[10px] uppercase text-primary">Adjusted today</p>
                    <p className="text-base font-semibold text-primary">{adjustedToday[m]}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] uppercase text-muted-foreground">Logged</span>
                  <input
                    type="number" min={0} value={todayActuals[m]}
                    onChange={(e) => setActual(m, Number(e.target.value || 0))}
                    className="w-20 rounded-md border border-border bg-surface px-2 py-1 text-sm"
                  />
                  <div className="ml-auto h-1.5 w-24 overflow-hidden rounded-full bg-surface-elevated">
                    <div className={`h-full ${red ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* C. Daily checklist */}
      <section className="card-soft p-4">
        <h3 className="mb-3 text-sm font-semibold">Daily checklist</h3>
        <div className="space-y-2">
          <ToggleRow label="Ads status (running today)" value={todayHabit.ads} onChange={(v) => setHabit("ads", v)} />
          <CheckRow label="Posted on social media" value={todayHabit.social} onChange={(v) => setHabit("social", v)} />
          <CheckRow label="Completed all pending follow-ups" value={todayHabit.followups} onChange={(v) => setHabit("followups", v)} />
        </div>
      </section>

      {/* D. Offline networking */}
      <section className="card-soft p-4">
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Offline networking</h3>
        </div>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            New offline contacts networked today
          </span>
          <input
            type="number" min={0} value={todayHabit.networking}
            onChange={(e) => setHabit("networking", Number(e.target.value || 0))}
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
        </label>
        <button
          onClick={() => setShowContact(true)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Add contact details
        </button>
        {state.offline.length > 0 && (
          <ul className="mt-3 space-y-2">
            {state.offline.slice(0, 5).map((c) => (
              <li key={c.id} className="rounded-lg border border-border p-2 text-xs">
                <p className="font-semibold">{c.name}</p>
                <p className="text-muted-foreground">{c.phone}{c.notes ? ` · ${c.notes}` : ""}</p>
              </li>
            ))}
            {state.offline.length > 5 && (
              <li className="text-center text-[11px] text-muted-foreground">+{state.offline.length - 5} more saved</li>
            )}
          </ul>
        )}
        <p className="mt-2 text-[11px] text-muted-foreground">Saved today: {todayOfflineCount}</p>
      </section>

      {showContact && <ContactModal onClose={() => setShowContact(false)} onSave={addContact} />}
    </div>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition ${value ? "bg-emerald-500" : "bg-slate-300"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${value ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function CheckRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5">
      <span className="text-sm">{label}</span>
      <span className={`grid h-5 w-5 place-items-center rounded border ${value ? "border-emerald-500 bg-emerald-500" : "border-slate-300 bg-white"}`}>
        {value && <Check className="h-3.5 w-3.5 text-white" />}
      </span>
      <input type="checkbox" className="sr-only" checked={value} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function ContactModal({ onClose, onSave }: { onClose: () => void; onSave: (c: { name: string; phone: string; notes: string }) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/50 sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-indigo-600" />
          <h3 className="flex-1 text-base font-semibold">New offline contact</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); if (!name || !phone) return; onSave({ name, phone, notes }); onClose(); }}
          className="mt-4 space-y-3"
        >
          <Field label="Name" value={name} onChange={setName} required />
          <Field label="Phone" value={phone} onChange={setPhone} required type="tel" />
          <Field label="Notes" value={notes} onChange={setNotes} type="textarea" />
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700">
            <Save className="h-4 w-4" /> Save contact
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}{required && <span className="text-red-500"> *</span>}</span>
      {type === "textarea" ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2}
          className="mt-1 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none" />
      ) : (
        <input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-400 focus:outline-none" />
      )}
    </label>
  );
}
