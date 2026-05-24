import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return _supabase;
}

async function sendOrderEmails(orderId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("RESEND_API_KEY not set, skipping emails");
    return;
  }
  const fromEmail = process.env.ORDER_EMAIL_FROM || "OLD IRON <onboarding@resend.dev>";
  const adminEmail = process.env.ADMIN_ORDER_EMAIL;

  const supabase = getSupabase();
  const { data: orderRow } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();
  if (!orderRow) return;
  const order = orderRow as any;
  const { data: itemsRows } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);
  const items = (itemsRows || []) as any[];

  const fmt = (cents: number) => `€${(cents / 100).toFixed(2)}`;
  const itemRows = (items || [])
    .map(
      (i: any) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.product_name}${i.size ? ` (${i.size})` : ""} × ${i.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${fmt(i.line_total_cents)}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111">
      <h1 style="margin:0 0 16px">Sipariş onayı</h1>
      <p>Merhaba ${order.full_name},</p>
      <p>Siparişin alındı. Sipariş no: <strong>#${String(order.id).slice(0, 8)}</strong></p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        ${itemRows}
        <tr><td style="padding:8px;text-align:right">Ara toplam</td><td style="padding:8px;text-align:right">${fmt(order.subtotal_cents)}</td></tr>
        <tr><td style="padding:8px;text-align:right">Kargo</td><td style="padding:8px;text-align:right">${fmt(order.shipping_cents)}</td></tr>
        <tr><td style="padding:8px;text-align:right"><strong>Toplam</strong></td><td style="padding:8px;text-align:right"><strong>${fmt(order.total_cents)}</strong></td></tr>
      </table>
      <p><strong>Teslimat adresi:</strong><br/>${order.shipping_address}<br/>${order.shipping_zip} ${order.shipping_city}<br/>${order.shipping_country}</p>
      <p style="color:#666;font-size:12px">OLD IRON</p>
    </div>
  `;

  const sends: Promise<any>[] = [];
  if (order.email) {
    sends.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: order.email,
          subject: `Sipariş onayı #${String(order.id).slice(0, 8)}`,
          html,
        }),
      }),
    );
  }
  if (adminEmail) {
    sends.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: adminEmail,
          subject: `Yeni sipariş #${String(order.id).slice(0, 8)} — ${fmt(order.total_cents)}`,
          html,
        }),
      }),
    );
  }
  const results = await Promise.allSettled(sends);
  for (const r of results) {
    if (r.status === "rejected") console.error("Email send failed:", r.reason);
    else if (r.value && !r.value.ok) {
      console.error("Email send non-OK:", r.value.status, await r.value.text());
    }
  }
}

async function handleCheckoutCompleted(session: any) {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    console.error("No orderId in session metadata");
    return;
  }
  const supabase = getSupabase();
  const { error } = await (supabase.from("orders") as any)
    .update({
      status: "paid",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);
  if (error) {
    console.error("Failed to update order:", error);
    return;
  }
  await sendOrderEmails(orderId);
}

async function handleCheckoutExpired(session: any) {
  const orderId = session.metadata?.orderId;
  if (!orderId) return;
  await getSupabase()
    .from("orders")
    .update({ status: "expired", updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("status", "pending");
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook missing/invalid env:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        const env: StripeEnv = rawEnv;
        try {
          const event = await verifyWebhook(request, env);
          switch (event.type) {
            case "checkout.session.completed":
            case "checkout.session.async_payment_succeeded":
              await handleCheckoutCompleted(event.data.object);
              break;
            case "checkout.session.expired":
            case "checkout.session.async_payment_failed":
              await handleCheckoutExpired(event.data.object);
              break;
            default:
              console.log("Unhandled event:", event.type);
          }
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
