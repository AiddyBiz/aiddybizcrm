import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, Avatar, Chip, SectionTitle } from "@/components/mobile-shell";
import { Copy, Share2, Gift, Wallet, Users, MessageCircle, Send as TgSend, Mail, MoreHorizontal, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

const REFERRAL_CODE = "ARJUN1500";
const REFERRAL_LINK = `https://aiddybiz.lovable.app/?ref=${REFERRAL_CODE}`;
const TEMPLATE = `Bhai, aap bhi is application ko use kar sakte hain aur isse apne business ko badha sakte hain. Here is my link: ${REFERRAL_LINK}`;

function Refer() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(TEMPLATE);
      setCopied(true);
      toast.success("Referral copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = TEMPLATE;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        toast.success("Referral copied to clipboard");
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch {
        toast.error("Could not copy. Please copy manually.");
      }
      document.body.removeChild(ta);
    }
  }

  function shareNative() {
    const data = { title: "Join AiddyBiz CRM", text: TEMPLATE, url: REFERRAL_LINK };
    if (navigator.share) {
      navigator.share(data).catch(() => {});
    } else {
      handleCopy();
      toast("Sharing not supported here — text copied so you can paste it anywhere.");
    }
  }

  const encoded = encodeURIComponent(TEMPLATE);

  const SOCIALS: { label: string; icon: React.ComponentType<{ className?: string }>; onClick: () => void; tint: string }[] = [
    {
      label: "WhatsApp",
      icon: MessageCircle,
      tint: "bg-emerald-50 text-emerald-600",
      onClick: () => window.open(`https://wa.me/?text=${encoded}`, "_blank"),
    },
    {
      label: "Telegram",
      icon: TgSend,
      tint: "bg-sky-50 text-sky-600",
      onClick: () =>
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(REFERRAL_LINK)}&text=${encoded}`,
          "_blank",
        ),
    },
    {
      label: "Email",
      icon: Mail,
      tint: "bg-indigo-50 text-indigo-600",
      onClick: () =>
        (window.location.href = `mailto:?subject=${encodeURIComponent("Join AiddyBiz CRM")}&body=${encoded}`),
    },
    {
      label: "More",
      icon: MoreHorizontal,
      tint: "bg-slate-100 text-slate-700",
      onClick: shareNative,
    },
  ];

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
            {REFERRAL_CODE}
          </div>
          <button
            onClick={handleCopy}
            aria-label="Copy referral"
            className={`grid h-12 w-12 place-items-center rounded-xl transition-colors ${copied ? "bg-emerald-500 text-white" : "bg-surface-elevated"}`}
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>
        <p className="mt-2 px-1 text-[11px] text-muted-foreground">
          Tap copy to grab your full pre-written invite message.
        </p>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {SOCIALS.map((s) => (
            <button
              key={s.label}
              onClick={s.onClick}
              className="flex flex-col items-center gap-1 rounded-2xl bg-surface px-2 py-3 text-[11px] font-medium active:scale-95"
            >
              <span className={`grid h-9 w-9 place-items-center rounded-full ${s.tint}`}>
                <s.icon className="h-4 w-4" />
              </span>
              {s.label}
            </button>
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
