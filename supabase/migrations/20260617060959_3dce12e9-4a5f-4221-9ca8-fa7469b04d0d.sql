ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_provider TEXT,
  ADD COLUMN IF NOT EXISTS payment_token TEXT,
  ADD COLUMN IF NOT EXISTS payment_id TEXT;

CREATE INDEX IF NOT EXISTS orders_payment_token_idx ON public.orders(payment_token);