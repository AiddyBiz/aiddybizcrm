import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shield, Users, ToggleLeft, ToggleRight, Building2 } from "lucide-react";

import { MobileShell } from "@/components/mobile-shell";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FEATURES, type FeatureKey } from "@/lib/features";

export const Route = createFileRoute("/super-admin")({
  head: () => ({ meta: [{ title: "Super Admin — AiddyBiz CRM" }] }),
  component: SuperAdminPage,
});

type WorkspaceRow = { id: string; name: string; created_at: string };
type FlagMap = Record<string, Record<FeatureKey, boolean>>;

function SuperAdminPage() {
  const { profile, isLoading } = useAuth();
  const [workspaces, setWorkspaces] = useState<WorkspaceRow[]>([]);
  const [flags, setFlags] = useState<FlagMap>({});
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role !== "SUPER_ADMIN") return;
    (async () => {
      const [{ data: ws }, { data: ff }, { data: pf }] = await Promise.all([
        supabase.from("workspaces").select("id, name, created_at").order("created_at", { ascending: false }),
        supabase.from("workspace_features").select("workspace_id, feature_key, enabled"),
        supabase.from("profiles").select("workspace_id"),
      ]);
      setWorkspaces((ws as WorkspaceRow[]) ?? []);
      const map: FlagMap = {};
      (ws ?? []).forEach((w) => {
        map[w.id] = Object.fromEntries(FEATURES.map((f) => [f.key, true])) as Record<FeatureKey, boolean>;
      });
      (ff ?? []).forEach((r: { workspace_id: string; feature_key: string; enabled: boolean }) => {
        if (map[r.workspace_id] && r.feature_key in map[r.workspace_id]) {
          map[r.workspace_id][r.feature_key as FeatureKey] = r.enabled;
        }
      });
      setFlags(map);
      const counts: Record<string, number> = {};
      (pf ?? []).forEach((p: { workspace_id: string | null }) => {
        if (p.workspace_id) counts[p.workspace_id] = (counts[p.workspace_id] ?? 0) + 1;
      });
      setMemberCounts(counts);
      setLoading(false);
    })();
  }, [profile?.role]);

  if (isLoading) return <MobileShell title="Super Admin"><div className="p-6 text-sm text-slate-500">Loading…</div></MobileShell>;
  if (!profile || profile.role !== "SUPER_ADMIN") return <Navigate to="/dashboard" replace />;

  const toggleFeature = async (workspaceId: string, key: FeatureKey) => {
    const current = flags[workspaceId]?.[key] ?? true;
    const next = !current;
    setFlags((f) => ({ ...f, [workspaceId]: { ...f[workspaceId], [key]: next } }));
    const { error } = await supabase
      .from("workspace_features")
      .upsert(
        { workspace_id: workspaceId, feature_key: key, enabled: next },
        { onConflict: "workspace_id,feature_key" },
      );
    if (error) {
      toast.error("Could not update flag");
      setFlags((f) => ({ ...f, [workspaceId]: { ...f[workspaceId], [key]: current } }));
    } else {
      toast.success(`${next ? "Enabled" : "Disabled"} ${key}`);
    }
  };

  return (
    <MobileShell title="Super Admin">
      <div className="space-y-4 p-4">
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
          <div className="flex items-center gap-2 text-indigo-700"><Shield className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wider">Platform owner</span></div>
          <p className="mt-1 text-sm text-slate-700">Manage every workspace and toggle features per tenant.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat icon={Building2} label="Workspaces" value={workspaces.length} />
          <Stat icon={Users} label="Total members" value={Object.values(memberCounts).reduce((a, b) => a + b, 0)} />
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading workspaces…</p>
        ) : workspaces.length === 0 ? (
          <p className="text-sm text-slate-500">No workspaces yet.</p>
        ) : (
          <ul className="space-y-3">
            {workspaces.map((w) => (
              <li key={w.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{w.name}</p>
                    <p className="text-xs text-slate-500">{memberCounts[w.id] ?? 0} member{(memberCounts[w.id] ?? 0) === 1 ? "" : "s"} · created {new Date(w.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {FEATURES.map((f) => {
                    const on = flags[w.id]?.[f.key] ?? true;
                    return (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => toggleFeature(w.id, f.key)}
                        className="flex w-full items-center justify-between rounded-md border border-slate-100 px-3 py-2 text-left hover:bg-slate-50"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800">{f.label}</p>
                          <p className="text-xs text-slate-500">{f.desc}</p>
                        </div>
                        {on ? <ToggleRight className="h-6 w-6 text-emerald-600" /> : <ToggleLeft className="h-6 w-6 text-slate-300" />}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </MobileShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2 text-slate-500"><Icon className="h-4 w-4" /><span className="text-xs">{label}</span></div>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
