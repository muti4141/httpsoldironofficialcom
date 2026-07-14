import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { initCheckoutForm, type IyzicoBasketItem } from "@/lib/iyzico.server";
import { getRequestIP } from "@tanstack/react-start/server";
import { products as staticProducts } from "@/data/products";

type CartLineInput = {
  productId: string;
  name: string;
  unitPrice: number; // TL decimal — IGNORED server-side, kept for backwards compat
  quantity: number;
};

function toDecimal(n: number): string {
  return (Math.round(n * 100) / 100).toFixed(2);
}

const ALLOWED_ORIGINS = [
  "https://oldironofficial.com",
  "https://www.oldironofficial.com",
  "https://httpsoldironofficialcom.lovable.app",
];

export const createIyzicoCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    orderId: string;
    items: CartLineInput[];
    shippingPrice: number;
    callbackUrl: string;
  }) => {
    if (!data.items.length) throw new Error("Warenkorb ist leer");
    for (const i of data.items) {
      if (!i.productId || i.quantity < 1 || i.quantity > 99) {
        throw new Error("Geçersiz sepet satırı");
      }
    }
    let cbOrigin = "";
    try {
      cbOrigin = new URL(data.callbackUrl).origin;
    } catch {
      throw new Error("Geçersiz callbackUrl");
    }
    const isPreview = /^https:\/\/[a-z0-9-]+\.lovable\.app$/i.test(cbOrigin);
    if (!ALLOWED_ORIGINS.includes(cbOrigin) && !isPreview) {
      throw new Error("Geçersiz callbackUrl");
    }
    return data;
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: userResp } = await supabase.auth.getUser();
    const email = userResp.user?.email ?? "no-reply@oldironofficial.com";

    // Verify the order belongs to the caller.
    const { data: orderRow, error: orderErr } = await supabase
      .from("orders")
      .select("full_name, shipping_address, shipping_city, shipping_zip, shipping_country, phone, user_id")
      .eq("id", data.orderId)
      .eq("user_id", userId)
      .maybeSingle();
    if (orderErr) throw new Error(orderErr.message);
    if (!orderRow) throw new Error("Bestellung nicht gefunden");
    const order = orderRow as any;

    // ── Build authoritative price map from DB + static catalog (server-trusted)
    const ids = Array.from(new Set(data.items.map((i) => i.productId)));
    const { data: dbProducts } = await supabase
      .from("admin_products")
      .select("id, name, price, free_shipping")
      .in("id", ids);

    type TrustedProduct = { id: string; name: string; price: number; freeShipping: boolean };
    const trusted = new Map<string, TrustedProduct>();
    for (const p of staticProducts) {
      trusted.set(p.id, { id: p.id, name: p.name, price: p.price, freeShipping: !!p.freeShipping });
    }
    for (const p of (dbProducts ?? []) as Array<{ id: string; name: string; price: number; free_shipping: boolean }>) {
      trusted.set(p.id, { id: p.id, name: p.name, price: Number(p.price), freeShipping: !!p.free_shipping });
    }

    // Server-recomputed line items (ignore any client-supplied prices).
    const lines = data.items.map((i, idx) => {
      const t = trusted.get(i.productId);
      if (!t) throw new Error("Ungültiges Produkt");
      if (t.price < 0.01) throw new Error("Ungültiger Preis");
      return {
        idx,
        productId: i.productId,
        displayName: (i.name || t.name).slice(0, 100),
        unitPrice: t.price,
        quantity: i.quantity,
        freeShipping: t.freeShipping,
      };
    });

    const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
    // Versandkosten werden im Frontend berechnet und über den Auftrag übertragen.
    const shippingPrice = 0;
    const total = subtotal + shippingPrice;

    const basketItems: IyzicoBasketItem[] = lines.map((l) => ({
      id: `${l.productId}-${l.idx}`,
      name: l.displayName,
      category1: "Apparel",
      itemType: "PHYSICAL",
      price: toDecimal(l.unitPrice * l.quantity),
    }));
    if (shippingPrice > 0) {
      basketItems.push({
        id: "shipping",
        name: "Versand",
        category1: "Shipping",
        itemType: "VIRTUAL",
        price: toDecimal(shippingPrice),
      });
    }

    // Iyzico expects: sum(basketItems.price) === price
    const itemsTotal = basketItems.reduce((s, i) => s + Number(i.price), 0);
    const price = toDecimal(itemsTotal);
    const paidPrice = toDecimal(total);

    const [firstName, ...rest] = (order.full_name || email.split("@")[0]).trim().split(/\s+/);
    const surname = rest.join(" ") || firstName;
    const ip = getRequestIP({ xForwardedFor: true }) || "85.34.78.112";

    const address = order.shipping_address || "Adresse";
    const city = order.shipping_city || "Berlin";
    const country = order.shipping_country === "DE" ? "Germany" : (order.shipping_country || "Germany");
    const zip = order.shipping_zip || "10115";

    const result = await initCheckoutForm({
      locale: "en",
      conversationId: data.orderId,
      price,
      paidPrice,
      currency: "EUR",
      basketId: data.orderId,
      paymentGroup: "PRODUCT",
      callbackUrl: data.callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: userId,
        name: firstName,
        surname,
        gsmNumber: order.phone || "+905350000000",
        email,
        identityNumber: "11111111111",
        registrationAddress: address,
        ip,
        city,
        country,
        zipCode: zip,
      },
      shippingAddress: {
        contactName: order.full_name || firstName,
        city,
        country,
        address,
        zipCode: zip,
      },
      billingAddress: {
        contactName: order.full_name || firstName,
        city,
        country,
        address,
        zipCode: zip,
      },
      basketItems,
    });

    if (result.status !== "success" || !result.checkoutFormContent) {
      throw new Error(result.errorMessage || "İyzico ödeme formu başlatılamadı");
    }

    // Persist server-trusted totals + iyzico token onto the order so client-
    // controlled values can never affect the recorded amount.
    const kdv = subtotal * 0.20;
    const cents = (n: number) => Math.round(n * 100);
    await (supabase.from("orders") as any)
      .update({
        payment_provider: "iyzico",
        payment_token: result.token,
        subtotal_cents: cents(subtotal),
        tax_cents: cents(kdv),
        shipping_cents: cents(shippingPrice),
        total_cents: cents(total),
      })
      .eq("id", data.orderId);

    // Overwrite price-sensitive fields on the existing order_items rows with
    // server-trusted values (keeps client-supplied image / size for display).
    for (const l of lines) {
      await (supabase.from("order_items") as any)
        .update({
          unit_price_cents: cents(l.unitPrice),
          line_total_cents: cents(l.unitPrice * l.quantity),
          product_name: l.displayName,
          quantity: l.quantity,
        })
        .eq("order_id", data.orderId)
        .eq("product_id", l.productId);
    }

    return {
      checkoutFormContent: result.checkoutFormContent,
      token: result.token!,
    };
  });
