import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, Chip, SectionTitle } from "@/components/mobile-shell";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/subscription")({
  head: () => ({ meta: [{ title: "Subscription — AiddyBiz CRM" }] }),
  component: Subscription,
});

const PLANS = [
  { name: "Starter", price: 0, period: "Free", feats: ["50 leads / mo", "Basic follow-ups", "Single user"] },
  { name: "Pro", price: 1499, period: "month", popular: true, feats: ["Unlimited leads", "WhatsApp & email automation", "AI lead scoring", "5 team members"] },
  { name: "Business", price: 3999, period: "month", feats: ["Unlimited team", "Advanced analytics", "Custom integrations", "Priority support"] },
];

function Subscription() {
  const [sel, setSel] = useState("Pro");
  return (
    <MobileShell title="Subscription">
      <div className="px-4 pt-4">
        <div className="card-soft relative overflow-hidden p-5">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/25 blur-2xl" />
          <Chip tone="primary"><Sparkles className="h-3 w-3" />Current</Chip>
          <h2 className="mt-2 font-display text-xl font-semibold">Pro Plan</h2>
          <p className="text-xs text-muted-foreground">Renews on 14 Jul 2026 · ₹1,499/mo</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-surface-elevated p-3">
              <p className="text-muted-foreground">Leads used</p>
              <p className="mt-1 font-display text-lg font-semibold">412 <span className="text-xs text-muted-foreground">/ ∞</span></p>
            </div>
            <div className="rounded-xl bg-surface-elevated p-3">
              <p className="text-muted-foreground">Team seats</p>
              <p className="mt-1 font-display text-lg font-semibold">3 <span className="text-xs text-muted-foreground">/ 5</span></p>
            </div>
          </div>
        </div>

        <SectionTitle title="Choose plan" action={<div className="rounded-full bg-surface p-1 text-[11px] font-semibold">
          <span className="rounded-full bg-primary/20 px-2 py-1 text-primary">Monthly</span>
          <span className="px-2 py-1 text-muted-foreground">Yearly · -20%</span>
        </div>} />

        <ul className="space-y-3">
          {PLANS.map((p) => {
            const active = sel === p.name;
            return (
              <li key={p.name}>
                <button onClick={() => setSel(p.name)} className={`w-full rounded-3xl border p-5 text-left transition ${active ? "border-primary bg-primary/5 shadow-[0_10px_30px_-15px_oklch(0.88_0.19_125/0.5)]" : "border-border bg-surface"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-display text-base font-semibold">{p.name}</p>
                        {p.popular && <Chip tone="primary">Popular</Chip>}
                      </div>
                      <p className="mt-1 font-display text-2xl font-semibold">
                        {p.price === 0 ? "Free" : <>₹{p.price.toLocaleString()}<span className="text-xs font-normal text-muted-foreground"> /{p.period}</span></>}
                      </p>
                    </div>
                    <span className={`grid h-6 w-6 place-items-center rounded-full border ${active ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                      {active && <Check className="h-4 w-4" />}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2 text-xs">
                    {p.feats.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-primary" />{f}
                      </li>
                    ))}
                  </ul>
                </button>
              </li>
            );
          })}
        </ul>

        <button className="mt-5 w-full rounded-2xl grad-primary py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
          Upgrade to {sel}
        </button>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">Cancel anytime · Secure payment by Razorpay</p>
      </div>
    </MobileShell>
  );
}
