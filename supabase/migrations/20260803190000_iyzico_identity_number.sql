-- iyzico ödeme entegrasyonu: TC Kimlik No alanı
-- iyzico'nun Ödeme Formu API'si Türk alıcılar için identityNumber ister.
alter table public.profiles
  add column if not exists identity_number text;

alter table public.orders
  add column if not exists identity_number text;
