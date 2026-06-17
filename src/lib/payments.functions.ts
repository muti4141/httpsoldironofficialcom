import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { initCheckoutForm, type IyzicoBasketItem } from "@/lib/iyzico.server";
import { getRequestIP } from "@tanstack/react-start/server";

type CartLineInput = {
  productId: string;
  name: string;
  unitPrice: number; // TL decimal
  quantity: number;
};

function toDecimal(n: number): string {
  return (Math.round(n * 100) / 100).toFixed(2);
}

export const createIyzicoCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    orderId: string;
    items: CartLineInput[];
    shippingPrice: number;
    callbackUrl: string;
  }) => {
    if (!data.items.length) throw new Error("Sepet boş");
    for (const i of data.items) {
      if (!i.name || i.unitPrice < 0.01 || i.quantity < 1) throw new Error("Geçersiz sepet satırı");
    }
    // Restrict callbackUrl to known application origins to prevent
    // attacker-controlled payment callbacks (token / PII exfiltration).
    const ALLOWED_ORIGINS = [
      "https://oldironofficial.com",
      "https://www.oldironofficial.com",
      "https://httpsoldironofficialcom.lovable.app",
    ];
    let cbOrigin = "";
    try { cbOrigin = new URL(data.callbackUrl).origin; } catch { throw new Error("Geçersiz callbackUrl"); }
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

    const { data: orderRow, error: orderErr } = await supabase
      .from("orders")
      .select("full_name, shipping_address, shipping_city, shipping_zip, shipping_country, phone, user_id")
      .eq("id", data.orderId)
      .eq("user_id", userId)
      .maybeSingle();
    if (orderErr) throw new Error(orderErr.message);
    if (!orderRow) throw new Error("Sipariş bulunamadı");
    const order = orderRow as any;

    const subtotal = data.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const total = subtotal + data.shippingPrice;

    const basketItems: IyzicoBasketItem[] = data.items.map((i, idx) => ({
      id: `${i.productId}-${idx}`,
      name: i.name.slice(0, 100),
      category1: "Apparel",
      itemType: "PHYSICAL",
      price: toDecimal(i.unitPrice * i.quantity),
    }));
    if (data.shippingPrice > 0) {
      basketItems.push({
        id: "shipping",
        name: "Kargo",
        category1: "Shipping",
        itemType: "VIRTUAL",
        price: toDecimal(data.shippingPrice),
      });
    }

    // Iyzico expects: sum(basketItems.price) === price
    const itemsTotal = basketItems.reduce((s, i) => s + Number(i.price), 0);
    const price = toDecimal(itemsTotal);
    const paidPrice = toDecimal(total);

    const [firstName, ...rest] = (order.full_name || email.split("@")[0]).trim().split(/\s+/);
    const surname = rest.join(" ") || firstName;
    const ip =
      getRequestIP({ xForwardedFor: true }) || "85.34.78.112";

    const address = order.shipping_address || "Adres";
    const city = order.shipping_city || "Istanbul";
    const country = order.shipping_country === "TR" ? "Turkey" : (order.shipping_country || "Turkey");
    const zip = order.shipping_zip || "34000";

    const result = await initCheckoutForm({
      locale: "tr",
      conversationId: data.orderId,
      price,
      paidPrice,
      currency: "TRY",
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

    // Persist the token onto the order so the callback can match it.
    await (supabase.from("orders") as any)
      .update({ payment_provider: "iyzico", payment_token: result.token })
      .eq("id", data.orderId);

    return {
      checkoutFormContent: result.checkoutFormContent,
      token: result.token!,
    };
  });
