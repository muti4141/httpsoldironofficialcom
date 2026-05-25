import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  checkIsAdmin,
  listAllOrders,
  updateOrderStatus,
} from "@/lib/admin.functions";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled", "refunded", "expired"] as const;

type Order = {
  id: string;
  created_at: string;
  email: string;
  full_name: string;
  shipping_city: string;
  shipping_country: string;
  total_cents: number;
  currency: string;
  status: string;
};

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Admin — Bestellungen" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/auth", search: { mode: "login", redirect: location.href } });
    }
  },
  component: AdminOrdersPage,
});

function fmt(cents: number, currency = "EUR") {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency }).format(cents / 100);
}

function AdminOrdersPage() {
  const check = useServerFn(checkIsAdmin);
  const list = useServerFn(listAllOrders);
  const update = useServerFn(updateOrderStatus);

  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { isAdmin } = await check();
        if (!isAdmin) {
          setAuthorized(false);
          setLoading(false);
          return;
        }
        setAuthorized(true);
        const { orders } = await list();
        setOrders(orders as Order[]);
      } catch (e: any) {
        toast.error(e?.message ?? "Fehler beim Laden");
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleStatus = async (orderId: string, status: string) => {
    try {
      await update({ data: { orderId, status: status as any } });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      toast.success("Status aktualisiert");
    } catch (e: any) {
      toast.error(e?.message ?? "Update fehlgeschlagen");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Bestellungen</h1>
          <Link to="/account">
            <Button variant="outline" size="sm">Mein Konto</Button>
          </Link>
        </div>

        {loading && <p className="text-muted-foreground">Lade…</p>}

        {!loading && authorized === false && (
          <div className="border border-border rounded-lg p-8 text-center">
            <p className="text-lg font-medium mb-2">Kein Zugriff</p>
            <p className="text-muted-foreground">Du hast keine Admin-Berechtigung.</p>
          </div>
        )}

        {!loading && authorized && orders.length === 0 && (
          <p className="text-muted-foreground">Noch keine Bestellungen.</p>
        )}

        {!loading && authorized && orders.length > 0 && (
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-3">Datum</th>
                  <th className="px-4 py-3">Nr.</th>
                  <th className="px-4 py-3">Kunde</th>
                  <th className="px-4 py-3">Ort</th>
                  <th className="px-4 py-3 text-right">Summe</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-border hover:bg-muted/20">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(o.created_at).toLocaleString("de-DE")}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link to="/order/$id" params={{ id: o.id }} className="hover:underline">
                        #{o.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{o.full_name}</div>
                      <div className="text-xs text-muted-foreground">{o.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      {o.shipping_city}, {o.shipping_country}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {fmt(o.total_cents, o.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatus(o.id, e.target.value)}
                        className="bg-background border border-border rounded px-2 py-1 text-sm"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
