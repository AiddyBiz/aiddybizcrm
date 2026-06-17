import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, Chip, SectionTitle } from "@/components/mobile-shell";
import { Play, BookOpen, Award, Clock } from "lucide-react";

export const Route = createFileRoute("/learning")({
  head: () => ({ meta: [{ title: "Learning Zone — AiddyBiz CRM" }] }),
  component: Learning,
});

const FEATURED = {
  title: "Mastering high-ticket closes",
  meta: "Module 4 · 6 lessons · 48 min",
  progress: 35,
};

const COURSES = [
  { title: "Cold calling that converts", lessons: 8, mins: 62, tone: "primary" as const, hue: 125 },
  { title: "Negotiation playbook", lessons: 6, mins: 45, tone: "info" as const, hue: 250 },
  { title: "RERA & legal essentials", lessons: 10, mins: 90, tone: "warning" as const, hue: 30 },
  { title: "WhatsApp marketing for agents", lessons: 5, mins: 32, tone: "success" as const, hue: 160 },
];

function Learning() {
  return (
    <MobileShell title="Learning Zone">
      <div className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,oklch(0.32_0.06_265),oklch(0.22_0.04_250))] p-5">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/30 blur-2xl" />
          <Chip tone="primary">Continue learning</Chip>
          <h2 className="mt-3 font-display text-xl font-semibold">{FEATURED.title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{FEATURED.meta}</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full grad-primary" style={{ width: `${FEATURED.progress}%` }} />
          </div>
          <button className="mt-4 inline-flex items-center gap-2 rounded-full grad-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
            <Play className="h-4 w-4" /> Resume
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { v: "12", l: "Courses", i: BookOpen },
            { v: "47", l: "Lessons", i: Play },
            { v: "5", l: "Certificates", i: Award },
          ].map((s) => (
            <div key={s.l} className="card-soft p-3 text-center">
              <s.i className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-2 font-display text-lg font-semibold">{s.v}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        <SectionTitle title="Courses for you" action={<button className="text-xs font-medium text-primary">See all</button>} />
        <ul className="grid gap-3">
          {COURSES.map((c) => (
            <li key={c.title} className="card-soft overflow-hidden">
              <div className="grid grid-cols-[112px_minmax(0,1fr)]">
                <div className="relative h-full min-h-[100px]" style={{ background: `linear-gradient(135deg, oklch(0.7 0.14 ${c.hue}), oklch(0.32 0.08 ${(c.hue + 60) % 360}))` }}>
                  <Play className="absolute inset-0 m-auto h-8 w-8 text-white/80" />
                </div>
                <div className="p-3">
                  <Chip tone={c.tone}>New</Chip>
                  <p className="mt-1 text-sm font-semibold">{c.title}</p>
                  <p className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{c.lessons} lessons</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.mins} min</span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </MobileShell>
  );
}
