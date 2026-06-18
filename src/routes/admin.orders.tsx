import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Package, MapPin, User, Mail, Phone } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getReadySession, getReturnPath } from "@/lib/auth-session";
import {
  checkIsAdmin,
  listAllOrders,
  updateOrderStatus,
} from "@/lib/admin.functions";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled", "refunded", "expired"] as const;

type Item = {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  size: string | null;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
};

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
  subtotal_cents?: number;
  shipping_cents?: number;
  tax_cents?: number;
  total_cents: number;
  currency: string;
  status: string;
  items: Item[];
};

export const Route = createFileRoute("/admin/orders")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Siparişler" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  beforeLoad: async ({ location }) => {
    const session = await getReadySession();
    if (!session) {
      throw redirect({ to: "/auth", search: { mode: "login", redirect: getReturnPath(location) } });
    }
  },
  component: AdminOrdersPage,
});

function fmt(cents: number, currency = "TRY") {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency }).format((cents ?? 0) / 100);
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  paid: "bg-green-500/10 text-green-600 border-green-500/30",
  shipped: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/30",
  refunded: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  expired: "bg-gray-500/10 text-gray-600 border-gray-500/30",
};

function AdminOrdersPage() {
  const check = useServerFn(checkIsAdmin);
  const list = useServerFn(listAllOrders);
  const update = useServerFn(updateOrderStatus);

  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<string>("all");

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

  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const stats = {
    total: orders.length,
    revenue: orders.filter((o) => ["paid", "shipped", "delivered"].includes(o.status))
      .reduce((s, o) => s + o.total_cents, 0),
    pending: orders.filter((o) => o.status === "pending").length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
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

        {!loading && authorized && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="border border-border rounded-lg p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Toplam Sipariş</div>
                <div className="text-2xl font-bold mt-1">{stats.total}</div>
              </div>
              <div className="border border-border rounded-lg p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Ciro (Ödenmiş)</div>
                <div className="text-2xl font-bold mt-1">{fmt(stats.revenue)}</div>
              </div>
              <div className="border border-border rounded-lg p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Bekleyen</div>
                <div className="text-2xl font-bold mt-1">{stats.pending}</div>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap mb-6">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-full text-sm border ${filter === "all" ? "bg-foreground text-background" : "border-border"}`}
              >
                Tümü ({orders.length})
              </button>
              {STATUSES.map((s) => {
                const count = orders.filter((o) => o.status === s).length;
                if (count === 0) return null;
                return (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`px-3 py-1.5 rounded-full text-sm border ${filter === s ? "bg-foreground text-background" : "border-border"}`}
                  >
                    {s} ({count})
                  </button>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <p className="text-muted-foreground">Sipariş yok.</p>
            )}

            <div className="space-y-3">
              {filtered.map((o) => {
                const isOpen = !!expanded[o.id];
                return (
                  <div key={o.id} className="border border-border rounded-lg overflow-hidden bg-card">
                    <button
                      onClick={() => toggle(o.id)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-muted/30 text-left"
                    >
                      {isOpen ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
                        <div>
                          <div className="text-xs text-muted-foreground">Tarih</div>
                          <div className="text-sm">{new Date(o.created_at).toLocaleDateString("tr-TR")}</div>
                          <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Müşteri</div>
                          <div className="text-sm font-medium truncate">{o.full_name}</div>
                          <div className="text-xs text-muted-foreground truncate">{o.email}</div>
                        </div>
                        <div className="hidden md:block">
                          <div className="text-xs text-muted-foreground">Ürün</div>
                          <div className="text-sm">{o.items.reduce((s, i) => s + i.quantity, 0)} adet</div>
                          <div className="text-xs text-muted-foreground truncate">{o.items.map((i) => i.product_name).join(", ")}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Tutar</div>
                          <div className="text-sm font-bold">{fmt(o.total_cents, o.currency)}</div>
                        </div>
                        <div>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs border ${STATUS_COLORS[o.status] ?? "border-border"}`}>
                            {o.status}
                          </span>
                        </div>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-border p-4 md:p-6 bg-muted/10 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                              <User className="w-4 h-4" /> Müşteri Bilgileri
                            </div>
                            <div className="space-y-2 text-sm">
                              <div><span className="text-muted-foreground">Ad Soyad:</span> {o.full_name}</div>
                              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-muted-foreground" />{o.email}</div>
                              {o.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-muted-foreground" />{o.phone}</div>}
                              <div className="text-xs text-muted-foreground font-mono pt-1">Sipariş No: #{o.id}</div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                              <MapPin className="w-4 h-4" /> Teslimat Adresi
                            </div>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">
                              {o.full_name}{"\n"}
                              {o.shipping_address}{"\n"}
                              {o.shipping_zip} {o.shipping_city}{"\n"}
                              {o.shipping_country}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                            <Package className="w-4 h-4" /> Sipariş Edilen Ürünler ({o.items.length})
                          </div>
                          <div className="border border-border rounded-lg divide-y divide-border bg-background">
                            {o.items.length === 0 && (
                              <div className="p-4 text-sm text-muted-foreground">Ürün bilgisi yok.</div>
                            )}
                            {o.items.map((it) => (
                              <div key={it.id} className="flex items-center gap-4 p-3">
                                {it.product_image ? (
                                  <img src={it.product_image} alt={it.product_name} className="w-14 h-14 object-cover rounded border border-border" />
                                ) : (
                                  <div className="w-14 h-14 rounded border border-border bg-muted flex items-center justify-center">
                                    <Package className="w-5 h-5 text-muted-foreground" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm">{it.product_name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {it.size && <>Beden: <span className="font-medium text-foreground">{it.size}</span> · </>}
                                    Adet: <span className="font-medium text-foreground">{it.quantity}</span> · Birim: {fmt(it.unit_price_cents, o.currency)}
                                  </div>
                                </div>
                                <div className="text-sm font-semibold whitespace-nowrap">
                                  {fmt(it.line_total_cents, o.currency)}
                                </div>
                              </div>
                            ))}
                          </div>

                          {(o.subtotal_cents != null || o.shipping_cents != null) && (
                            <div className="mt-3 ml-auto max-w-xs text-sm space-y-1">
                              {o.subtotal_cents != null && (
                                <div className="flex justify-between"><span className="text-muted-foreground">Ara toplam</span><span>{fmt(o.subtotal_cents, o.currency)}</span></div>
                              )}
                              {o.shipping_cents != null && (
                                <div className="flex justify-between"><span className="text-muted-foreground">Kargo</span><span>{o.shipping_cents === 0 ? "Ücretsiz" : fmt(o.shipping_cents, o.currency)}</span></div>
                              )}
                              <div className="flex justify-between font-bold pt-1 border-t border-border">
                                <span>Toplam</span><span>{fmt(o.total_cents, o.currency)}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 pt-2 border-t border-border">
                          <label className="text-sm text-muted-foreground">Durum:</label>
                          <select
                            value={o.status}
                            onChange={(e) => handleStatus(o.id, e.target.value)}
                            className="bg-background border border-border rounded px-2 py-1 text-sm"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <Link to="/order/$id" params={{ id: o.id }} className="ml-auto text-sm underline text-muted-foreground hover:text-foreground">
                            Müşteri görünümü
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
