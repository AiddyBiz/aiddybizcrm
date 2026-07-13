import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell, Avatar, Chip, SectionTitle, Tabs } from "@/components/mobile-shell";
import { MissionDashboard } from "@/components/mission-dashboard";
import { Pencil, Trophy, Zap, Flame, Target, Award, BookOpen, Gift, MapPin, TrendingUp, Star, CheckCircle2, Save, Loader2, Camera, Mail, KeyRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — AiddyBiz CRM" }] }),
  component: Profile,
});

function Profile() {
  const [tab, setTab] = useState("Overview");
  const { profile, user, updateProfile, updatePassword, sendPasswordReset } = useAuth();

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Your Name";
  const email = user?.email || "";

  return (
    <MobileShell title="My Growth">
      <div className="px-4 pt-4">
        {/* Identity + Growth header */}
        <div className="card-soft relative overflow-hidden p-5">
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary/25 blur-2xl" />
          <div className="flex items-center gap-4">
            <div className="relative">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} className="h-[72px] w-[72px] rounded-full object-cover" />
              ) : (
                <Avatar name={displayName} size={72} />
              )}
              <span className="absolute -bottom-1 -right-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">L12</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-semibold">{displayName}</h2>
              <p className="text-xs text-muted-foreground">{profile?.role?.replace("_", " ") ?? "Agent"} · {email}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <Chip tone="primary"><Trophy className="h-3 w-3" />Gold</Chip>
                <Chip tone="warning"><Flame className="h-3 w-3" />21d</Chip>
              </div>
            </div>
            <button onClick={() => setTab("Settings")} className="grid h-9 w-9 place-items-center rounded-full bg-surface-elevated"><Pencil className="h-4 w-4" /></button>
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
          <Tabs tabs={["Overview", "Settings", "Mission", "Performance", "Achievements", "Learning", "Rewards"]} value={tab} onChange={setTab} />
        </div>

        {tab === "Settings" && (
          <SettingsPanel
            initial={{ full_name: profile?.full_name ?? "", phone: profile?.phone ?? "", avatar_url: profile?.avatar_url ?? "" }}
            email={email}
            onSave={async (patch) => { await updateProfile(patch); toast.success("Profile updated"); }}
            onPasswordChange={async (pw) => { await updatePassword(pw); toast.success("Password updated"); }}
            onPasswordReset={async () => { await sendPasswordReset(); toast.success("Password reset email sent"); }}
          />
        )}

        {tab === "Mission" && (
          <div className="mt-4">
            <MissionDashboard />
          </div>
        )}


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

function SettingsPanel({
  initial,
  email,
  onSave,
  onPasswordChange,
  onPasswordReset,
}: {
  initial: { full_name: string; phone: string; avatar_url: string };
  email: string;
  onSave: (patch: { full_name: string; phone: string; avatar_url: string | null }) => Promise<void>;
  onPasswordChange: (pw: string) => Promise<void>;
  onPasswordReset: () => Promise<void>;
}) {
  const [fullName, setFullName] = useState(initial.full_name);
  const [phone, setPhone] = useState(initial.phone);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatar_url);
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFullName(initial.full_name);
    setPhone(initial.phone);
    setAvatarUrl(initial.avatar_url);
  }, [initial.full_name, initial.phone, initial.avatar_url]);

  const pickImage = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Please choose an image under 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ full_name: fullName.trim(), phone: phone.trim(), avatar_url: avatarUrl || null });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const changePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) return toast.error("Password must be at least 6 characters");
    if (pw !== pw2) return toast.error("Passwords do not match");
    setPwBusy(true);
    try {
      await onPasswordChange(pw);
      setPw(""); setPw2("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setPwBusy(false);
    }
  };

  const sendReset = async () => {
    setResetBusy(true);
    try { await onPasswordReset(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Failed to send reset email"); }
    finally { setResetBusy(false); }
  };

  return (
    <>
      <SectionTitle title="Profile details" />
      <form onSubmit={save} className="card-soft space-y-4 p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <Avatar name={fullName || "You"} size={64} />
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground shadow"
              aria-label="Change photo"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) pickImage(f); }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{fullName || "Your name"}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
            {avatarUrl && (
              <button type="button" onClick={() => setAvatarUrl("")} className="mt-1 text-[11px] font-medium text-red-500">Remove photo</button>
            )}
          </div>
        </div>

        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Full name</span>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={80}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </label>

        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Phone</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" maxLength={20} placeholder="+91 98765 43210"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </label>

        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Email</span>
          <div className="mt-1 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
            <Mail className="h-4 w-4" />{email}
          </div>
        </label>

        <button type="submit" disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
        </button>
      </form>

      <SectionTitle title="Password" />
      <form onSubmit={changePw} className="card-soft space-y-3 p-4">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">New password</span>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} minLength={6} required
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Confirm password</span>
          <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} minLength={6} required
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <div className="flex gap-2">
          <button type="submit" disabled={pwBusy}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
            {pwBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Update
          </button>
          <button type="button" onClick={sendReset} disabled={resetBusy}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-60">
            {resetBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />} Email reset link
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground">Password must be at least 6 characters.</p>
      </form>
    </>
  );
}
