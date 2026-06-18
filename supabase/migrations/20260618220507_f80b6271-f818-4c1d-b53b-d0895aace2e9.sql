CREATE TABLE IF NOT EXISTS public.admin_email_roles (
  email text PRIMARY KEY,
  role public.app_role NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT admin_email_roles_email_lowercase CHECK (email = lower(email))
);

GRANT SELECT ON public.admin_email_roles TO authenticated;
GRANT ALL ON public.admin_email_roles TO service_role;

ALTER TABLE public.admin_email_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own admin email role" ON public.admin_email_roles;
CREATE POLICY "Users can read own admin email role"
  ON public.admin_email_roles
  FOR SELECT TO authenticated
  USING (email = lower(coalesce(auth.jwt() ->> 'email', '')));

INSERT INTO public.admin_email_roles (email, role)
VALUES (lower('peltekburakk35@gmail.com'), 'admin')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  ) OR EXISTS (
    SELECT 1
    FROM public.admin_email_roles
    WHERE role = _role
      AND email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT private.has_role(auth.uid(), 'admin');
$$;