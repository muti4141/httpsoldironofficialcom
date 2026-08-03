import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { initializeCheckoutForm } from "@/lib/iyzico.server";

const toAmount = (cents: number) => (cents / 100).toFixed(2);

export const createIyzicoCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { orderId: string }) => {
    if (!data.orderId) throw new Error("Sipariş bulunamadı");
    return data;
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: userResp } = await supabase.auth.getUser();
    const email = userResp.user?.email;
    if (!email) throw new Error("E-posta bulunamadı");

    // orderId'nin bu kullanıcıya ait olduğu doğrulanıyor (IDOR koruması) —
    // aksi halde bir kullanıcı başka birinin siparişini kendi ödemesiyle
    // "ödendi" durumuna düşürebilirdi.
    const { data: orderRow } = await supabase
      .from("orders")
      .select(
        "full_name, phone, shipping_address, shipping_city, shipping_zip, shipping_country, identity_number, user_id, status, shipping_cents"
      )
      .eq("id", data.orderId)
      .eq("user_id", userId)
      .maybeSingle();
    const order = orderRow as any;
    if (!order) throw new Error("Sipariş bulunamadı");
    if (order.status !== "pending") throw new Error("Bu sipariş zaten işlenmiş.");
    if (!order.identity_number || String(order.identity_number).length < 10) {
      throw new Error("TC Kimlik No eksik. Lütfen hesap sayfasından ekle.");
    }

    // Sepet kalemleri ve tutarlar istemciden değil, sipariş oluşturulurken
    // sunucuda yazılmış olan order_items'tan okunur — fiyat manipülasyonuna
    // kapalıdır.
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("product_id, product_name, unit_price_cents, quantity")
      .eq("order_id", data.orderId);
    if (!orderItems || !orderItems.length) throw new Error("Sipariş kalemleri bulunamadı");

    const items = orderItems.map((i: any) => ({
      productId: i.product_id as string,
      name: i.product_name as string,
      unitAmountCents: i.unit_price_cents as number,
      quantity: i.quantity as number,
    }));
    const shippingCents = (order.shipping_cents as number) ?? 0;

    const request = getRequest();
    const ip =
      request?.headers.get("cf-connecting-ip") ||
      request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "85.34.78.112";

    const origin =
      process.env.SITE_URL ||
      (request ? new URL(request.url).origin : "https://oldironofficial.com");

    const [firstName, ...rest] = String(order.full_name || "Müşteri").trim().split(" ");
    const lastName = rest.join(" ") || firstName;

    const subtotalCents = items.reduce((s, i) => s + i.unitAmountCents * i.quantity, 0);
    const totalCents = subtotalCents + shippingCents;

    const address = {
      contactName: order.full_name || "Müşteri",
      city: order.shipping_city || "İstanbul",
      country: "Turkey",
      address: order.shipping_address || "-",
      zipCode: order.shipping_zip || undefined,
    };

    const basketItems = items.map((i) => ({
      id: i.productId,
      name: i.name.slice(0, 100),
      category1: "Spor Giyim",
      itemType: "PHYSICAL" as const,
      price: toAmount(i.unitAmountCents * i.quantity),
    }));

    if (shippingCents > 0) {
      basketItems.push({
        id: "kargo",
        name: "Kargo",
        category1: "Kargo",
        itemType: "PHYSICAL" as const,
        price: toAmount(shippingCents),
      });
    }

    const result = await initializeCheckoutForm({
      locale: "tr",
      conversationId: data.orderId,
      price: toAmount(subtotalCents),
      paidPrice: toAmount(totalCents),
      currency: "TRY",
      basketId: data.orderId,
      callbackUrl: `${origin}/api/public/payments/iyzico/callback`,
      buyer: {
        id: userId,
        name: firstName || "Müşteri",
        surname: lastName || "Müşteri",
        gsmNumber: order.phone || undefined,
        email,
        identityNumber: String(order.identity_number),
        registrationAddress: order.shipping_address || "-",
        ip,
        city: order.shipping_city || "İstanbul",
        country: "Turkey",
        zipCode: order.shipping_zip || undefined,
      },
      shippingAddress: address,
      billingAddress: address,
      basketItems,
    });

    if (result.status !== "success" || !result.checkoutFormContent) {
      throw new Error(result.errorMessage || "Ödeme başlatılamadı. Lütfen tekrar deneyin.");
    }

    return { checkoutFormContent: result.checkoutFormContent, token: result.token };
  });
