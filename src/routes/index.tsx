import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, Eye, EyeOff, Mail, Lock, ArrowRight, Smartphone } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — AiddyBiz CRM" },
      { name: "description", content: "Sign in to AiddyBiz CRM to manage your leads, follow-ups and deals." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    const handleAppInstalled = () => setShowInstall(false);

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
    setShowInstall(false);
  };

  const submit = (e: FormEvent) => { e.preventDefault(); navigate({ to: "/dashboard" }); };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 pb-8 pt-[max(env(safe-area-inset-top),3rem)]">
        <div className="mb-10 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl grad-primary font-display text-xl font-bold text-primary-foreground">A</div>
          <div>
            <p className="font-display text-lg font-semibold">AiddyBiz</p>
            <p className="text-xs text-muted-foreground">Real Estate CRM</p>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold leading-tight">Welcome back.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to manage your pipeline, follow-ups and site visits.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field icon={Mail} type="email" placeholder="you@agency.com" label="Email" />
          <Field icon={Lock} type={show ? "text" : "password"} placeholder="••••••••" label="Password" right={
            <button type="button" onClick={() => setShow(!show)} className="text-muted-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          } />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" className="h-4 w-4 accent-[color:var(--primary)]" defaultChecked /> Remember me
            </label>
            <a href="#" className="font-medium text-primary">Forgot password?</a>
          </div>

          <button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl grad-primary px-5 py-4 font-semibold text-primary-foreground shadow-lg shadow-primary/20 active:scale-[0.99]">
            Sign in <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or continue with <span className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {["Google", "Apple"].map((p) => (
            <button key={p} className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-medium">{p}</button>
          ))}
        </div>

        <p className="mt-auto pt-8 text-center text-sm text-muted-foreground">
          New to AiddyBiz? <Link to="/dashboard" className="font-semibold text-primary">Start free trial</Link>
        </p>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <Building2 className="h-3 w-3" /> Built for real estate teams
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, right, ...rest }: { icon: React.ComponentType<{ className?: string }>; label: string; right?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <span className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 focus-within:border-primary/60">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <input {...rest} className="min-w-0 flex-1 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none" />
        {right}
      </span>
    </label>
  );
}
