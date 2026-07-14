import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { retrieveCheckoutForm } from "@/lib/iyzico.server";

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
  if (!apiKey) return;
  const fromEmail = process.env.ORDER_EMAIL_FROM || "OLD IRON <onboarding@resend.dev>";
  const adminEmail = process.env.ADMIN_ORDER_EMAIL;

  const supabase = getSupabase();
  const { data: orderRow } = await supabase.from("orders").select("*").eq("id", orderId).maybeSingle();
  if (!orderRow) return;
  const order = orderRow as any;
  const { data: itemsRows } = await supabase.from("order_items").select("*").eq("order_id", orderId);
  const items = (itemsRows || []) as any[];

  const fmt = (cents: number) => `${(cents / 100).toFixed(2)} €`;
  const itemRows = items
    .map((i: any) =>
      `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.product_name}${i.size ? ` (${i.size})` : ""} × ${i.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${fmt(i.line_total_cents)}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111">
      <h1 style="margin:0 0 16px">Bestellbestätigung</h1>
      <p>Hallo ${order.full_name},</p>
      <p>deine Bestellung ist bei uns eingegangen. Bestellnummer: <strong>#${String(order.id).slice(0, 8)}</strong></p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        ${itemRows}
        <tr><td style="padding:8px;text-align:right">Zwischensumme</td><td style="padding:8px;text-align:right">${fmt(order.subtotal_cents)}</td></tr>
        <tr><td style="padding:8px;text-align:right">Versand</td><td style="padding:8px;text-align:right">${fmt(order.shipping_cents)}</td></tr>
        <tr><td style="padding:8px;text-align:right"><strong>Gesamt</strong></td><td style="padding:8px;text-align:right"><strong>${fmt(order.total_cents)}</strong></td></tr>
      </table>
      <p><strong>Lieferadresse:</strong><br/>${order.shipping_address}<br/>${order.shipping_zip} ${order.shipping_city}<br/>${order.shipping_country}</p>
      <p style="color:#666;font-size:12px">OLD IRON</p>
    </div>`;

  const sends: Promise<any>[] = [];
  if (order.email) {
    sends.push(fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: fromEmail, to: order.email, subject: `Bestellbestätigung #${String(order.id).slice(0, 8)}`, html }),
    }));
  }
  if (adminEmail) {
    sends.push(fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: fromEmail, to: adminEmail, subject: `Yeni sipariş #${String(order.id).slice(0, 8)} — ${fmt(order.total_cents)}`, html }),
    }));
  }
  await Promise.allSettled(sends);
}

function redirect(orderId: string, status: "success" | "failed", reason?: string) {
  const url = new URL(`/checkout/return`, "https://placeholder.local");
  url.searchParams.set("order_id", orderId);
  url.searchParams.set("status", status);
  if (reason) url.searchParams.set("reason", reason);
  // Use relative redirect — browser resolves against the current origin.
  return new Response(null, {
    status: 303,
    headers: { Location: `/checkout/return?${url.searchParams.toString()}` },
  });
}

export const Route = createFileRoute("/api/public/payments/iyzico-callback")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let token: string | null = null;
        let conversationId: string | null = null;
        try {
          const form = await request.formData();
          token = (form.get("token") as string) || null;
          conversationId = (form.get("conversationData") as string) || null;
        } catch {
          try {
            const body = await request.json();
            token = body?.token ?? null;
            conversationId = body?.conversationData ?? null;
          } catch { /* noop */ }
        }

        if (!token) {
          console.error("Iyzico callback: missing token");
          return new Response("Missing token", { status: 400 });
        }

        const supabase = getSupabase();

        // Find order by payment_token (set during initCheckoutForm).
        const { data: orderRow } = await supabase
          .from("orders")
          .select("id, status")
          .eq("payment_token", token)
          .maybeSingle();
        const orderId = (orderRow as any)?.id as string | undefined;

        if (!orderId) {
          console.error("Iyzico callback: order not found for token");
          return new Response("Order not found", { status: 404 });
        }

        try {
          const detail = await retrieveCheckoutForm(token, conversationId || orderId);
          if (detail.status === "success" && detail.paymentStatus === "SUCCESS") {
            await (supabase.from("orders") as any)
              .update({
                status: "paid",
                payment_id: detail.paymentId ?? null,
                updated_at: new Date().toISOString(),
              })
              .eq("id", orderId);
            await sendOrderEmails(orderId);
            return redirect(orderId, "success");
          }
          await (supabase.from("orders") as any)
            .update({ status: "failed", updated_at: new Date().toISOString() })
            .eq("id", orderId);
          return redirect(orderId, "failed", detail.errorMessage || detail.paymentStatus || "unknown");
        } catch (e) {
          console.error("Iyzico verify error:", e);
          return redirect(orderId, "failed", "verify_error");
        }
      },
    },
  },
});
