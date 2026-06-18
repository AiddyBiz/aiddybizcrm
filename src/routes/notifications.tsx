import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, Chip, SectionTitle } from "@/components/mobile-shell";
import { UserPlus, PhoneCall, MapPin, Eye, Award, Trophy, Bell as BellIcon } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — AiddyBiz CRM" }] }),
  component: Notifications,
});

const TODAY = [
  { icon: UserPlus, title: "New lead assigned", body: "Riya P. assigned 'Karan Mehta' to you", when: "2m", tone: "primary" },
  { icon: PhoneCall, title: "Follow-up due", body: "Call Ananya Sharma in 30 min", when: "30m", tone: "warning" },
  { icon: MapPin, title: "Site visit reminder", body: "Vikram Singh at 02:30 PM · Lakeview Township", when: "1h", tone: "info" },
  { icon: Eye, title: "Project viewed", body: "Rohan Mehta viewed Sobha Dream Acres pricing", when: "2h", tone: "primary" },
] as const;

const EARLIER = [
  { icon: Award, title: "Badge earned", body: "🔥 21-day streak unlocked", when: "Yest", tone: "primary" },
  { icon: Trophy, title: "Rank increased", body: "City rank moved from #17 → #14", when: "Yest", tone: "success" },
  { icon: BellIcon, title: "New lead", body: "Meta Ads · Premium Whitefield", when: "2d", tone: "default" },
] as const;

function Notifications() {
  return (
    <MobileShell title="Notifications">
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">12 unread</p>
          <button className="text-xs font-medium text-primary">Mark all read</button>
        </div>

        <SectionTitle title="Today" />
        <ul className="card-soft divide-y divide-border/60 overflow-hidden">
          {TODAY.map((n, i) => (
            <Row key={i} {...n} unread />
          ))}
        </ul>

        <SectionTitle title="Earlier" />
        <ul className="card-soft divide-y divide-border/60 overflow-hidden">
          {EARLIER.map((n, i) => (
            <Row key={i} {...n} />
          ))}
        </ul>
      </div>
    </MobileShell>
  );
}

function Row({ icon: Icon, title, body, when, tone, unread }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string; when: string; tone: "primary" | "warning" | "info" | "success" | "default"; unread?: boolean }) {
  return (
    <li className={`flex items-start gap-3 p-4 ${unread ? "bg-primary/[0.04]" : ""}`}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-elevated text-primary"><Icon className="h-4 w-4" /></span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold">{title}</p>
          {unread && <span className="h-2 w-2 rounded-full bg-primary" />}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{body}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-[10px] text-muted-foreground">{when}</span>
        <Chip tone={tone}>{tone === "default" ? "Info" : tone}</Chip>
      </div>
    </li>
  );
}
