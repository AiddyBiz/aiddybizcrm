import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, Avatar, Chip, SectionTitle } from "@/components/mobile-shell";
import { Copy, Share2, Gift, Wallet, Users } from "lucide-react";

export const Route = createFileRoute("/refer")({
  head: () => ({ meta: [{ title: "Refer & Earn — AiddyBiz CRM" }] }),
  component: Refer,
});

const FRIENDS = [
  { name: "Sneha R.", status: "Joined", reward: "₹500" },
  { name: "Aakash T.", status: "Subscribed", reward: "₹1,500" },
  { name: "Divya M.", status: "Invited", reward: "Pending" },
  { name: "Rahul N.", status: "Subscribed", reward: "₹1,500" },
];

function Refer() {
  return (
    <MobileShell title="Refer & Earn">
      <div className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-3xl grad-primary p-6 text-primary-foreground">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
          <Gift className="h-8 w-8" />
          <h2 className="mt-3 font-display text-2xl font-semibold">Earn ₹1,500 per friend</h2>
          <p className="mt-1 text-sm opacity-80">Invite fellow agents. They get 20% off, you get cash credits.</p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { v: "12", l: "Invites", i: Share2 },
            { v: "7", l: "Joined", i: Users },
            { v: "₹9,500", l: "Earned", i: Wallet },
          ].map((s) => (
            <div key={s.l} className="card-soft p-3 text-center">
              <s.i className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-2 font-display text-base font-semibold">{s.v}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        <SectionTitle title="Your referral code" />
        <div className="card-soft flex items-center gap-3 p-4">
          <div className="flex-1 rounded-xl border border-dashed border-primary/40 bg-primary/10 px-4 py-3 text-center font-display text-lg font-bold tracking-[0.3em] text-primary">
            ARJUN1500
          </div>
          <button className="grid h-12 w-12 place-items-center rounded-xl bg-surface-elevated"><Copy className="h-5 w-5" /></button>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {["WhatsApp", "Telegram", "Email", "More"].map((s) => (
            <button key={s} className="rounded-2xl bg-surface px-2 py-3 text-[11px] font-medium">{s}</button>
          ))}
        </div>

        <SectionTitle title="How it works" />
        <ol className="card-soft divide-y divide-border/60 overflow-hidden text-sm">
          {[
            "Share your code with another agent",
            "They sign up & start a Pro trial",
            "Get ₹1,500 credit when they subscribe",
          ].map((t, i) => (
            <li key={i} className="flex items-center gap-3 p-4">
              <span className="grid h-8 w-8 place-items-center rounded-full grad-primary font-display font-semibold text-primary-foreground">{i + 1}</span>
              <p>{t}</p>
            </li>
          ))}
        </ol>

        <SectionTitle title="Your referrals" />
        <ul className="card-soft divide-y divide-border/60 overflow-hidden">
          {FRIENDS.map((f) => (
            <li key={f.name} className="flex items-center gap-3 p-3">
              <Avatar name={f.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{f.name}</p>
                <p className="text-xs text-muted-foreground">{f.status}</p>
              </div>
              <Chip tone={f.reward === "Pending" ? "warning" : "success"}>{f.reward}</Chip>
            </li>
          ))}
        </ul>
      </div>
    </MobileShell>
  );
}
