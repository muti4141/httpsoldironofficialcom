import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createStripeClient, type StripeEnv } from "@/lib/stripe.server";

type CartLineInput = {
  productId: string;
  name: string;
  unitAmountCents: number;
  quantity: number;
};

export const createCartCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    orderId: string;
    items: CartLineInput[];
    shippingCents: number;
    returnUrl: string;
    environment: StripeEnv;
  }) => {
    if (!data.items.length) throw new Error("Cart is empty");
    for (const i of data.items) {
      if (!i.name || i.unitAmountCents < 1 || i.quantity < 1) {
        throw new Error("Invalid cart item");
      }
    }
    return data;
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: userResp } = await supabase.auth.getUser();
    const email = userResp.user?.email;

    const stripe = createStripeClient(data.environment);

    // Resolve or create a Customer with metadata.userId for searchability.
    let customerId: string | undefined;
    const found = await stripe.customers.search({
      query: `metadata['userId']:'${userId}'`,
      limit: 1,
    });
    if (found.data.length) {
      customerId = found.data[0].id;
    } else if (email) {
      const existing = await stripe.customers.list({ email, limit: 1 });
      if (existing.data.length) {
        customerId = existing.data[0].id;
        await stripe.customers.update(customerId, {
          metadata: { ...existing.data[0].metadata, userId },
        });
      }
    }
    if (!customerId) {
      const created = await stripe.customers.create({
        ...(email && { email }),
        metadata: { userId },
      });
      customerId = created.id;
    }

    const line_items = data.items.map((i) => ({
      quantity: i.quantity,
      price_data: {
        currency: "eur",
        product_data: { name: `${i.name}` },
        unit_amount: i.unitAmountCents,
      },
    }));

    if (data.shippingCents > 0) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "eur",
          product_data: { name: "Versand" },
          unit_amount: data.shippingCents,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: data.returnUrl,
      customer: customerId,
      automatic_tax: { enabled: true },
      payment_intent_data: { description: `OLD IRON Bestellung #${data.orderId.slice(0, 8)}` },
      metadata: { userId, orderId: data.orderId },
    });

    return session.client_secret;
  });
