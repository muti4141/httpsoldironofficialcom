import { createFileRoute } from "@tanstack/react-router";
import { retrieveCheckoutForm } from "@/lib/iyzico.server";
import { getServiceSupabase, sendOrderEmails } from "@/lib/order-emails.server";

/**
 * iyzico, ödeme formu tamamlandığında bu adrese `token` alanıyla POST atar.
 * Token doğrulanır (sunucu-sunucu), sipariş durumu güncellenir ve kullanıcı
 * /checkout/return sayfasına yönlendirilir.
 */
export const Route = createFileRoute("/api/public/payments/iyzico/callback")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const redirect = (orderId: string, status: "success" | "failed") =>
          Response.redirect(
            `${origin}/checkout/return?order_id=${orderId}&status=${status}`,
            303,
          );

        try {
          const form = await request.formData();
          const token = form.get("token");
          if (!token || typeof token !== "string") {
            return new Response("Missing token", { status: 400 });
          }

          const result = await retrieveCheckoutForm(token);
          const orderId = result.basketId || result.conversationId;
          if (!orderId) {
            console.error("iyzico callback: no basketId/conversationId in result", result);
            return new Response("Order not found", { status: 400 });
          }

          const supabase = getServiceSupabase();

          if (result.status === "success" && result.paymentStatus === "SUCCESS") {
            const { error } = await (supabase.from("orders") as any)
              .update({ status: "paid", updated_at: new Date().toISOString() })
              .eq("id", orderId);
            if (error) console.error("Failed to mark order paid:", error);
            else await sendOrderEmails(orderId);
            return redirect(orderId, "success");
          }

          await (supabase.from("orders") as any)
            .update({ status: "cancelled", updated_at: new Date().toISOString() })
            .eq("id", orderId)
            .eq("status", "pending");
          return redirect(orderId, "failed");
        } catch (e) {
          console.error("iyzico callback error:", e);
          return new Response("Callback error", { status: 500 });
        }
      },
    },
  },
});
