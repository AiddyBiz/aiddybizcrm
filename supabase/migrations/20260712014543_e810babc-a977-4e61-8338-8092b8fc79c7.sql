
-- Feature flags per workspace
CREATE TABLE public.workspace_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, feature_key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_features TO authenticated;
GRANT ALL ON public.workspace_features TO service_role;
ALTER TABLE public.workspace_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members read features" ON public.workspace_features
  FOR SELECT TO authenticated
  USING (public.is_super_admin() OR workspace_id = public.current_workspace_id());

CREATE POLICY "Super admin manages features" ON public.workspace_features
  FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE TRIGGER trg_workspace_features_updated
  BEFORE UPDATE ON public.workspace_features
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Agent permissions
CREATE TABLE public.agent_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  permission_key text NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, permission_key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_permissions TO authenticated;
GRANT ALL ON public.agent_permissions TO service_role;
ALTER TABLE public.agent_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read own or workspace agent permissions" ON public.agent_permissions
  FOR SELECT TO authenticated
  USING (
    public.is_super_admin()
    OR user_id = auth.uid()
    OR (workspace_id = public.current_workspace_id() AND public.has_role(auth.uid(), 'WORKSPACE_ADMIN'))
  );

CREATE POLICY "Workspace admin manages agent permissions" ON public.agent_permissions
  FOR ALL TO authenticated
  USING (
    public.is_super_admin()
    OR (workspace_id = public.current_workspace_id() AND public.has_role(auth.uid(), 'WORKSPACE_ADMIN'))
  )
  WITH CHECK (
    public.is_super_admin()
    OR (workspace_id = public.current_workspace_id() AND public.has_role(auth.uid(), 'WORKSPACE_ADMIN'))
  );

CREATE TRIGGER trg_agent_permissions_updated
  BEFORE UPDATE ON public.agent_permissions
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Workspace invitations
CREATE TABLE public.workspace_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  email text NOT NULL,
  role public.app_role NOT NULL DEFAULT 'AGENT',
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, email)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspace_invitations TO authenticated;
GRANT ALL ON public.workspace_invitations TO service_role;
ALTER TABLE public.workspace_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace admin reads invitations" ON public.workspace_invitations
  FOR SELECT TO authenticated
  USING (
    public.is_super_admin()
    OR (workspace_id = public.current_workspace_id() AND public.has_role(auth.uid(), 'WORKSPACE_ADMIN'))
  );

CREATE POLICY "Workspace admin manages invitations" ON public.workspace_invitations
  FOR ALL TO authenticated
  USING (
    public.is_super_admin()
    OR (workspace_id = public.current_workspace_id() AND public.has_role(auth.uid(), 'WORKSPACE_ADMIN'))
  )
  WITH CHECK (
    public.is_super_admin()
    OR (workspace_id = public.current_workspace_id() AND public.has_role(auth.uid(), 'WORKSPACE_ADMIN'))
  );

CREATE TRIGGER trg_workspace_invitations_updated
  BEFORE UPDATE ON public.workspace_invitations
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Allow super admin to read all workspaces list (already covered by is_super_admin policy)
-- Allow super admin to read all profiles (already covered)
