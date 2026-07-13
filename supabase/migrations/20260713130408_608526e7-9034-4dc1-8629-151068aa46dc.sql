
-- Add phone and avatar_url to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Tighten profile self-update: prevent users from escalating their own role or moving workspaces.
-- Replace the existing overly permissive UPDATE policy with a hardened one that uses a trigger
-- to lock down privileged columns.
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

CREATE POLICY "Users update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid() OR public.is_super_admin())
  WITH CHECK (id = auth.uid() OR public.is_super_admin());

-- Trigger: prevent non-super-admins from changing role or workspace_id on their own profile.
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_super_admin() THEN
    RETURN NEW;
  END IF;
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Not permitted to change role';
  END IF;
  IF NEW.workspace_id IS DISTINCT FROM OLD.workspace_id THEN
    RAISE EXCEPTION 'Not permitted to change workspace';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_privileged_columns ON public.profiles;
CREATE TRIGGER protect_profile_privileged_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_privileged_columns();
