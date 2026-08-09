import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { products } from "@/data/products";
import { isValidTcKimlik } from "@/lib/tc-kimlik";

const FREE_SHIPPING_THRESHOLD = 1500;
const SHIPPING_FEE = 140;

type LineInput = { productId: string; size?: string; qty: number };

const cents = (n: number) => Math.round(n * 100);

/**
 * Fiyatlar burada, ürünlerin tek doğruluk kaynağı olan products.ts'ten
 * sunucu tarafında hesaplanır — sepetten/istemciden gelen fiyat asla
 * kullanılmaz (client localStorage'ı değiştirerek fiyat düşürme
 * açığını kapatır).
 */
export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { lines: LineInput[] }) => {
    if (!Array.isArray(data.lines) || !data.lines.length) throw new Error("Sepet boş");
    for (const l of data.lines) {
      if (!l.productId || !Number.isInteger(l.qty) || l.qty < 1 || l.qty > 20) {
        throw new Error("Geçersiz sepet öğesi");
      }
    }
    return data;
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const resolved = data.lines.map((l) => {
      const product = products.find((p) => p.id === l.productId);
      if (!product) throw new Error("Ürün bulunamadı: " + l.productId);
      if (product.outOfStock) throw new Error(`${product.name} stokta yok.`);
      return { product, size: l.size, qty: l.qty };
    });

    const { data: userResp } = await supabase.auth.getUser();
    const email = userResp.user?.email;
    if (!email) throw new Error("E-posta bulunamadı");

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, phone, shipping_address, shipping_city, shipping_zip, shipping_country, identity_number")
      .eq("id", userId)
      .maybeSingle();

    if (
      !profile?.shipping_address ||
      profile.shipping_address.trim().length < 10 ||
      !profile.shipping_city ||
      !profile.shipping_zip
    ) {
      throw new Error(
        "Teslimat adresin eksik veya çok kısa görünüyor. Lütfen hesap sayfasından gerçek adresini (sokak, bina no dahil), şehrini ve posta kodunu eksiksiz gir."
      );
    }
    if (!/^\d{5}$/.test(String(profile.shipping_zip).trim())) {
      throw new Error("Posta kodu 5 haneli rakam olmalı (örn. 34000). Lütfen hesap sayfasından düzelt.");
    }
    // iyzico, TC Kimlik No'yu tam 11 haneli gerçek bir numara olarak zorunlu tutuyor;
    // eksik/sahte bir değerle ödeme isteği "Geçersiz istek" gibi anlaşılmaz bir hatayla
    // reddediliyordu. Burada erkenden, anlaşılır bir mesajla engelliyoruz.
    if (!isValidTcKimlik(String(profile.identity_number ?? "").trim())) {
      throw new Error("Geçerli bir TC Kimlik No gir (11 hane, gerçek numaranız olmalı). Rastgele/sahte numara ödeme sağlayıcı tarafından reddedilir.");
    }
    if (!profile.phone || !/^\d{10,11}$/.test(profile.phone.replace(/\D/g, ""))) {
      throw new Error("Geçerli bir telefon numarası gerekli (10-11 haneli). Lütfen hesap sayfasından ekle.");
    }

    const subtotal = resolved.reduce((s, r) => s + r.product.price * r.qty, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const tax = subtotal * 0.2;
    const total = subtotal + shipping;

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        email,
        full_name: profile.display_name ?? email.split("@")[0],
        phone: profile.phone,
        shipping_address: profile.shipping_address,
        shipping_city: profile.shipping_city,
        shipping_zip: profile.shipping_zip,
        shipping_country: profile.shipping_country ?? "TR",
        identity_number: profile.identity_number,
        subtotal_cents: cents(subtotal),
        tax_cents: cents(tax),
        shipping_cents: cents(shipping),
        total_cents: cents(total),
        currency: "TRY",
        status: "pending",
      })
      .select("id")
      .single();
    if (orderErr || !order) throw orderErr ?? new Error("Sipariş oluşturulamadı.");

    const { error: itemsErr } = await supabase.from("order_items").insert(
      resolved.map((r) => ({
        order_id: order.id,
        product_id: r.product.id,
        product_name: r.product.name,
        product_image: r.product.image,
        size: r.size ?? null,
        quantity: r.qty,
        unit_price_cents: cents(r.product.price),
        line_total_cents: cents(r.product.price * r.qty),
      }))
    );
    if (itemsErr) throw itemsErr;

    return {
      orderId: order.id as string,
      items: resolved.map((r) => ({
        productId: r.product.id,
        name: r.product.name,
        unitAmountCents: cents(r.product.price),
        quantity: r.qty,
      })),
      shippingCents: cents(shipping),
    };
  });
