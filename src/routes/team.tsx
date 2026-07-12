import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserPlus, Mail, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";

import { MobileShell } from "@/components/mobile-shell";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AGENT_PERMISSIONS, type PermissionKey } from "@/lib/features";

export const Route = createFileRoute("/team")({
  head: () => ({ meta: [{ title: "Team — AiddyBiz CRM" }] }),
  component: TeamPage,
});

type Member = { id: string; full_name: string | null; role: string };
type Invite = { id: string; email: string; status: string; created_at: string };
type PermMap = Record<string, Record<PermissionKey, boolean>>;

function TeamPage() {
  const { profile, workspace, isLoading } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [perms, setPerms] = useState<PermMap>({});
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const canAccess = profile?.role === "WORKSPACE_ADMIN" || profile?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (!canAccess || !workspace?.id) return;
    (async () => {
      const [{ data: mm }, { data: iv }, { data: pp }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, role").eq("workspace_id", workspace.id),
        supabase.from("workspace_invitations").select("id, email, status, created_at").eq("workspace_id", workspace.id).order("created_at", { ascending: false }),
        supabase.from("agent_permissions").select("user_id, permission_key, enabled").eq("workspace_id", workspace.id),
      ]);
      setMembers((mm as Member[]) ?? []);
      setInvites((iv as Invite[]) ?? []);
      const map: PermMap = {};
      (mm ?? []).forEach((m: Member) => {
        map[m.id] = Object.fromEntries(AGENT_PERMISSIONS.map((p) => [p.key, false])) as Record<PermissionKey, boolean>;
      });
      (pp ?? []).forEach((r: { user_id: string; permission_key: string; enabled: boolean }) => {
        if (map[r.user_id] && r.permission_key in map[r.user_id]) {
          map[r.user_id][r.permission_key as PermissionKey] = r.enabled;
        }
      });
      setPerms(map);
    })();
  }, [canAccess, workspace?.id]);

  if (isLoading) return <MobileShell title="Team"><div className="p-6 text-sm text-slate-500">Loading…</div></MobileShell>;
  if (!canAccess) return <Navigate to="/dashboard" replace />;

  const invite = async () => {
    if (!email.trim() || !workspace?.id) return;
    setBusy(true);
    const { error } = await supabase.from("workspace_invitations").insert({
      workspace_id: workspace.id,
      email: email.trim().toLowerCase(),
      role: "AGENT",
      invited_by: profile?.id,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Invitation sent to ${email}`);
    setEmail("");
    const { data: iv } = await supabase.from("workspace_invitations").select("id, email, status, created_at").eq("workspace_id", workspace.id).order("created_at", { ascending: false });
    setInvites((iv as Invite[]) ?? []);
  };

  const revoke = async (id: string) => {
    const { error } = await supabase.from("workspace_invitations").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setInvites((prev) => prev.filter((i) => i.id !== id));
    toast.success("Invitation revoked");
  };

  const togglePerm = async (userId: string, key: PermissionKey) => {
    if (!workspace?.id) return;
    const cur = perms[userId]?.[key] ?? false;
    const next = !cur;
    setPerms((p) => ({ ...p, [userId]: { ...p[userId], [key]: next } }));
    const { error } = await supabase
      .from("agent_permissions")
      .upsert(
        { user_id: userId, workspace_id: workspace.id, permission_key: key, enabled: next },
        { onConflict: "user_id,permission_key" },
      );
    if (error) {
      toast.error(error.message);
      setPerms((p) => ({ ...p, [userId]: { ...p[userId], [key]: cur } }));
    }
  };

  return (
    <MobileShell title="Team">
      <div className="space-y-5 p-4">
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900"><UserPlus className="h-4 w-4 text-indigo-600" />Invite an agent</h2>
          <div className="flex gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-md border border-slate-200 px-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@example.com"
                className="w-full bg-transparent py-2 text-sm outline-none"
              />
            </div>
            <button
              onClick={invite}
              disabled={busy || !email.trim()}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >Send invite</button>
          </div>

          {invites.length > 0 && (
            <ul className="mt-4 space-y-2">
              {invites.map((i) => (
                <li key={i.id} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm">
                  <div>
                    <p className="font-medium text-slate-800">{i.email}</p>
                    <p className="text-xs text-slate-500">{i.status.toLowerCase()} · {new Date(i.created_at).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => revoke(i.id)} className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-white"><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">Members & permissions</h2>
          {members.length === 0 ? (
            <p className="text-sm text-slate-500">No members yet.</p>
          ) : (
            <ul className="space-y-3">
              {members.map((m) => (
                <li key={m.id} className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{m.full_name ?? "Unnamed"}</p>
                      <p className="text-xs text-slate-500">{m.role}</p>
                    </div>
                  </div>
                  {m.role === "AGENT" ? (
                    <div className="space-y-1.5">
                      {AGENT_PERMISSIONS.map((p) => {
                        const on = perms[m.id]?.[p.key] ?? false;
                        return (
                          <button
                            key={p.key}
                            type="button"
                            onClick={() => togglePerm(m.id, p.key)}
                            className="flex w-full items-center justify-between rounded-md border border-slate-100 px-3 py-2 text-left hover:bg-slate-50"
                          >
                            <div>
                              <p className="text-sm font-medium text-slate-800">{p.label}</p>
                              <p className="text-xs text-slate-500">{p.desc}</p>
                            </div>
                            {on ? <ToggleRight className="h-6 w-6 text-emerald-600" /> : <ToggleLeft className="h-6 w-6 text-slate-300" />}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Admins have full access.</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </MobileShell>
  );
}
