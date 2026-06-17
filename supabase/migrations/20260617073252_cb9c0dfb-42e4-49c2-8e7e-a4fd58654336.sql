
-- Admin-managed products table (supplements catalog extensions)
CREATE TABLE public.admin_products (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  category_label text NOT NULL,
  type text NOT NULL CHECK (type IN ('apparel','supplement')),
  price integer NOT NULL,
  original_price integer,
  image text NOT NULL,
  video text,
  video_poster text,
  badge text,
  subtitle text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  flavors text[] NOT NULL DEFAULT '{}',
  weights text[] NOT NULL DEFAULT '{}',
  servings integer,
  free_shipping boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.admin_products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.admin_products TO authenticated;
GRANT ALL ON public.admin_products TO service_role;

ALTER TABLE public.admin_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_products public read"
  ON public.admin_products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "admin_products admin insert"
  ON public.admin_products FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_products admin update"
  ON public.admin_products FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin_products admin delete"
  ON public.admin_products FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_admin_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER admin_products_updated_at
  BEFORE UPDATE ON public.admin_products
  FOR EACH ROW EXECUTE FUNCTION public.touch_admin_products_updated_at();

-- Storage policies for product-images bucket
CREATE POLICY "product-images public read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "product-images admin insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "product-images admin update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "product-images admin delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
