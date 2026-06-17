import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, Avatar, Chip } from "@/components/mobile-shell";
import { Trophy, Crown, TrendingUp } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/rankings")({
  head: () => ({ meta: [{ title: "Rankings — AiddyBiz CRM" }] }),
  component: Rankings,
});

const TOP = [
  { name: "Riya Kapoor", pts: 4820, deals: 9, rank: 1 },
  { name: "Arjun K.", pts: 4310, deals: 7, rank: 2 },
  { name: "Saurabh M.", pts: 3990, deals: 6, rank: 3 },
];
const REST = [
  { name: "Neha P.", pts: 3540, deals: 5 },
  { name: "Vikas T.", pts: 3210, deals: 5 },
  { name: "Anjali D.", pts: 2980, deals: 4 },
  { name: "Manoj S.", pts: 2750, deals: 4 },
  { name: "Pooja R.", pts: 2510, deals: 3 },
];

function Rankings() {
  const [tab, setTab] = useState("Month");
  return (
    <MobileShell title="Rankings">
      <div className="px-4 pt-4">
        <div className="flex gap-2">
          {["Week", "Month", "Quarter", "Year"].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-full border px-3 py-2 text-xs font-semibold ${tab === t ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface text-muted-foreground"}`}>{t}</button>
          ))}
        </div>

        {/* Podium */}
        <div className="mt-6 grid grid-cols-3 items-end gap-2">
          {[TOP[1], TOP[0], TOP[2]].map((u, i) => {
            const heights = ["h-24", "h-32", "h-20"];
            const colors = ["bg-surface-elevated", "grad-primary", "bg-surface-elevated"];
            const fg = ["text-foreground", "text-primary-foreground", "text-foreground"];
            return (
              <div key={u.name} className="flex flex-col items-center">
                {u.rank === 1 && <Crown className="mb-1 h-5 w-5 text-primary" />}
                <Avatar name={u.name} size={u.rank === 1 ? 64 : 52} />
                <p className="mt-2 truncate text-xs font-semibold">{u.name}</p>
                <p className="text-[10px] text-muted-foreground">{u.pts} pts</p>
                <div className={`mt-2 w-full rounded-t-2xl ${heights[i]} ${colors[i]} grid place-items-center ${fg[i]} font-display text-xl font-bold`}>
                  {u.rank}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 card-soft p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary font-display font-bold">7</span>
              <div>
                <p className="text-sm font-semibold">You · Arjun K.</p>
                <p className="text-xs text-muted-foreground">4,310 pts this {tab.toLowerCase()}</p>
              </div>
            </div>
            <Chip tone="success"><TrendingUp className="h-3 w-3" />+3</Chip>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-elevated">
            <div className="h-full w-[68%] grad-primary" />
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">580 pts to next rank</p>
        </div>

        <ul className="mt-5 card-soft divide-y divide-border/60 overflow-hidden">
          {REST.map((u, i) => (
            <li key={u.name} className="grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-3 p-3">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-surface-elevated text-xs font-semibold text-muted-foreground">{i + 4}</span>
              <Avatar name={u.name} size={36} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{u.name}</p>
                <p className="text-[11px] text-muted-foreground">{u.deals} deals</p>
              </div>
              <p className="font-display text-sm font-semibold">{u.pts}</p>
            </li>
          ))}
        </ul>

        <div className="mt-5 card-soft flex items-center gap-3 p-4">
          <Trophy className="h-8 w-8 text-primary" />
          <div className="text-sm">
            <p className="font-semibold">Monthly champion bonus</p>
            <p className="text-xs text-muted-foreground">Top performer wins ₹50,000 incentive.</p>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
