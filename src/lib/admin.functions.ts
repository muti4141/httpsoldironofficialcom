import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ALLOWED_STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled", "refunded", "expired"] as const;
type OrderStatus = typeof ALLOWED_STATUSES[number];

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

export const listAllOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { orders: data ?? [] };
  });

export const getOrderDetails = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { orderId: string }) => {
    if (!/^[0-9a-f-]{36}$/.test(data.orderId)) throw new Error("Invalid orderId");
    return data;
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const [{ data: order, error: oErr }, { data: items, error: iErr }] = await Promise.all([
      supabase.from("orders").select("*").eq("id", data.orderId).maybeSingle(),
      supabase.from("order_items").select("*").eq("order_id", data.orderId),
    ]);
    if (oErr) throw new Error(oErr.message);
    if (iErr) throw new Error(iErr.message);
    return { order, items: items ?? [] };
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { orderId: string; status: OrderStatus }) => {
    if (!/^[0-9a-f-]{36}$/.test(data.orderId)) throw new Error("Invalid orderId");
    if (!ALLOWED_STATUSES.includes(data.status)) throw new Error("Invalid status");
    return data;
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { error } = await (supabase.from("orders") as any)
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.orderId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
