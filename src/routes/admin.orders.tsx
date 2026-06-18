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
  phone: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_zip: string;
  shipping_country: string;
  total_cents: number;
  currency: string;
  status: string;
};

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Admin — Siparişler" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/auth", search: { mode: "login", redirect: location.href } });
    }
  },
  component: AdminOrdersGated,
});

import { AdminGate } from "@/components/AdminGate";

function AdminOrdersGated() {
  return (
    <AdminGate>
      <AdminOrdersPage />
    </AdminGate>
  );
}

function fmt(cents: number, currency = "TRY") {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency }).format(cents / 100);
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
        toast.error(e?.message ?? "Yüklenirken hata oluştu");
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
      toast.success("Durum güncellendi");
    } catch (e: any) {
      toast.error(e?.message ?? "Güncelleme başarısız");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Siparişler</h1>
          <div className="flex gap-2">
            <Link to="/admin/products"><Button variant="outline" size="sm">Ürünler</Button></Link>
            <Link to="/account"><Button variant="outline" size="sm">Hesabım</Button></Link>
          </div>
        </div>

        {loading && <p className="text-muted-foreground">Yükleniyor…</p>}

        {!loading && authorized === false && (
          <div className="border border-border rounded-lg p-8 text-center">
            <p className="text-lg font-medium mb-2">Erişim Yok</p>
            <p className="text-muted-foreground">Yönetici yetkiniz bulunmuyor.</p>
          </div>
        )}

        {!loading && authorized && orders.length === 0 && (
          <p className="text-muted-foreground">Henüz sipariş yok.</p>
        )}

        {!loading && authorized && orders.length > 0 && (
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-3">Tarih</th>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Müşteri</th>
                  <th className="px-4 py-3">Adres</th>
                  <th className="px-4 py-3 text-right">Tutar</th>
                  <th className="px-4 py-3">Durum</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-border hover:bg-muted/20 align-top">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(o.created_at).toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link to="/order/$id" params={{ id: o.id }} className="hover:underline">
                        #{o.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{o.full_name}</div>
                      <div className="text-xs text-muted-foreground">{o.email}</div>
                      {o.phone && <div className="text-xs text-muted-foreground">{o.phone}</div>}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="whitespace-pre-wrap break-words">{o.shipping_address}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {o.shipping_zip} {o.shipping_city}, {o.shipping_country}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium whitespace-nowrap">
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
