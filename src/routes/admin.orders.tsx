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

const STATUS_TR: Record<string, string> = {
  pending: "Beklemede",
  paid: "Ödendi",
  shipped: "Kargoda",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
  refunded: "İade Edildi",
  expired: "Süresi Doldu",
};

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
      { title: "Admin — Siparişler — OLD IRON" },
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
          <h1 className="text-[32px] font-bold tracking-[-0.04em]">Siparişler</h1>
          <Link to="/account">
            <Button variant="outline" size="sm">Hesabım</Button>
          </Link>
        </div>

        {loading && <p className="text-secondary">Yükleniyor…</p>}

        {!loading && authorized === false && (
          <div className="border border-outline-variant rounded-[10px] p-8 text-center bg-plaster">
            <p className="text-[16px] font-bold mb-2">Erişim Reddedildi</p>
            <p className="text-secondary">Admin yetkisine sahip değilsiniz.</p>
          </div>
        )}

        {!loading && authorized && orders.length === 0 && (
          <p className="text-secondary">Henüz sipariş bulunmuyor.</p>
        )}

        {!loading && authorized && orders.length > 0 && (
          <div className="overflow-x-auto border border-outline-variant rounded-[10px]">
            <table className="w-full text-sm">
              <thead className="bg-plaster text-left">
                <tr>
                  <th className="px-4 py-3 font-bold text-[12px] uppercase tracking-[0.1em] text-secondary">Tarih</th>
                  <th className="px-4 py-3 font-bold text-[12px] uppercase tracking-[0.1em] text-secondary">No</th>
                  <th className="px-4 py-3 font-bold text-[12px] uppercase tracking-[0.1em] text-secondary">Müşteri</th>
                  <th className="px-4 py-3 font-bold text-[12px] uppercase tracking-[0.1em] text-secondary">Konum</th>
                  <th className="px-4 py-3 text-right font-bold text-[12px] uppercase tracking-[0.1em] text-secondary">Tutar</th>
                  <th className="px-4 py-3 font-bold text-[12px] uppercase tracking-[0.1em] text-secondary">Durum</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-outline-variant hover:bg-plaster/50">
                    <td className="px-4 py-3 whitespace-nowrap text-secondary">
                      {new Date(o.created_at).toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link to="/order/$id" params={{ id: o.id }} className="hover:underline text-cobalt font-bold">
                        #{o.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">{o.full_name}</div>
                      <div className="text-xs text-secondary">{o.email}</div>
                    </td>
                    <td className="px-4 py-3 text-secondary">
                      {o.shipping_city}, {o.shipping_country}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold">
                      {fmt(o.total_cents, o.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatus(o.id, e.target.value)}
                        className="bg-white border border-outline-variant rounded-[6px] px-2 py-1 text-sm text-foreground"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_TR[s] ?? s}</option>
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
