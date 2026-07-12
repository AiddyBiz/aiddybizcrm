import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/AuthContext";

export const FEATURES = [
  { key: "rankings", label: "Rankings & Gamification", desc: "Leaderboards, badges, streaks" },
  { key: "billing", label: "Billing Plans", desc: "Subscription screen" },
  { key: "learning", label: "Learning Zone", desc: "Training and courses" },
  { key: "referrals", label: "Refer & Earn", desc: "Referral rewards" },
  { key: "deals", label: "Deals Forecasting", desc: "Revenue targets & deals" },
] as const;

export type FeatureKey = (typeof FEATURES)[number]["key"];

export const AGENT_PERMISSIONS = [
  { key: "export_data", label: "Can Export Data", desc: "Export leads and reports to CSV" },
  { key: "delete_leads", label: "Can Delete Leads", desc: "Permanently remove leads" },
  { key: "edit_projects", label: "Can Edit Projects", desc: "Modify project inventory" },
  { key: "send_bulk", label: "Can Send Bulk Messages", desc: "Broadcast WhatsApp messages" },
] as const;

export type PermissionKey = (typeof AGENT_PERMISSIONS)[number]["key"];

/** Reads workspace feature flags for the current user's workspace. Defaults ON. */
export function useFeatures(): { enabled: Record<FeatureKey, boolean>; loading: boolean } {
  const { workspace } = useAuth();
  const [enabled, setEnabled] = useState<Record<FeatureKey, boolean>>(() =>
    Object.fromEntries(FEATURES.map((f) => [f.key, true])) as Record<FeatureKey, boolean>,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspace?.id) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("workspace_features")
        .select("feature_key, enabled")
        .eq("workspace_id", workspace.id);
      if (cancelled) return;
      const next = Object.fromEntries(FEATURES.map((f) => [f.key, true])) as Record<FeatureKey, boolean>;
      (data ?? []).forEach((r: { feature_key: string; enabled: boolean }) => {
        if (r.feature_key in next) next[r.feature_key as FeatureKey] = r.enabled;
      });
      setEnabled(next);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [workspace?.id]);

  return { enabled, loading };
}
