import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { initializeCheckoutForm } from "@/lib/iyzico.server";

type CartLineInput = {
  productId: string;
  name: string;
  unitAmountCents: number;
  quantity: number;
};

const toAmount = (cents: number) => (cents / 100).toFixed(2);

export const createIyzicoCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    orderId: string;
    items: CartLineInput[];
    shippingCents: number;
  }) => {
    if (!data.items.length) throw new Error("Sepet boş");
    for (const i of data.items) {
      if (!i.name || i.unitAmountCents < 1 || i.quantity < 1) {
        throw new Error("Geçersiz sepet öğesi");
      }
    }
    return data;
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: userResp } = await supabase.auth.getUser();
    const email = userResp.user?.email;
    if (!email) throw new Error("E-posta bulunamadı");

    const { data: orderRow } = await supabase
      .from("orders")
      .select(
        "full_name, phone, shipping_address, shipping_city, shipping_zip, shipping_country, identity_number"
      )
      .eq("id", data.orderId)
      .maybeSingle();
    const order = orderRow as any;
    if (!order) throw new Error("Sipariş bulunamadı");
    if (!order.identity_number || String(order.identity_number).length < 10) {
      throw new Error("TC Kimlik No eksik. Lütfen hesap sayfasından ekle.");
    }

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

    const subtotalCents = data.items.reduce((s, i) => s + i.unitAmountCents * i.quantity, 0);
    const totalCents = subtotalCents + data.shippingCents;

    const address = {
      contactName: order.full_name || "Müşteri",
      city: order.shipping_city || "İstanbul",
      country: "Turkey",
      address: order.shipping_address || "-",
      zipCode: order.shipping_zip || undefined,
    };

    const basketItems = data.items.map((i) => ({
      id: i.productId,
      name: i.name.slice(0, 100),
      category1: "Spor Giyim",
      itemType: "PHYSICAL" as const,
      price: toAmount(i.unitAmountCents * i.quantity),
    }));

    if (data.shippingCents > 0) {
      basketItems.push({
        id: "kargo",
        name: "Kargo",
        category1: "Kargo",
        itemType: "PHYSICAL" as const,
        price: toAmount(data.shippingCents),
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
