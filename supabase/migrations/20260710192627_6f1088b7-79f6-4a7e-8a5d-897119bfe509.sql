
-- Enum for user roles
CREATE TYPE public.app_role AS ENUM ('SUPER_ADMIN', 'WORKSPACE_ADMIN', 'AGENT');

-- Workspaces
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspaces TO authenticated;
GRANT ALL ON public.workspaces TO service_role;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role public.app_role NOT NULL DEFAULT 'AGENT',
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Security definer helpers (avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.current_workspace_id()
RETURNS UUID
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT workspace_id FROM public.profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'SUPER_ADMIN')
$$;

-- Profiles RLS
CREATE POLICY "Users read own profile or same workspace or super admin"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    id = auth.uid()
    OR public.is_super_admin()
    OR (workspace_id IS NOT NULL AND workspace_id = public.current_workspace_id())
  );

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_super_admin())
  WITH CHECK (id = auth.uid() OR public.is_super_admin());

CREATE POLICY "Super admin manages profiles"
  ON public.profiles FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Workspaces RLS
CREATE POLICY "Members read their workspace"
  ON public.workspaces FOR SELECT TO authenticated
  USING (public.is_super_admin() OR id = public.current_workspace_id());

CREATE POLICY "Workspace admin updates workspace"
  ON public.workspaces FOR UPDATE TO authenticated
  USING (
    public.is_super_admin()
    OR (id = public.current_workspace_id() AND public.has_role(auth.uid(), 'WORKSPACE_ADMIN'))
  )
  WITH CHECK (
    public.is_super_admin()
    OR (id = public.current_workspace_id() AND public.has_role(auth.uid(), 'WORKSPACE_ADMIN'))
  );

CREATE POLICY "Super admin manages workspaces"
  ON public.workspaces FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Auto-create profile + workspace on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_workspace_id UUID;
  display_name TEXT;
BEGIN
  display_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );

  INSERT INTO public.workspaces (name)
  VALUES (display_name || '''s Workspace')
  RETURNING id INTO new_workspace_id;

  INSERT INTO public.profiles (id, full_name, role, workspace_id)
  VALUES (NEW.id, display_name, 'WORKSPACE_ADMIN', new_workspace_id);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
