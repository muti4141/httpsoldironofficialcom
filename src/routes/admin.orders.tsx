import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Package, MapPin, User, Mail, Phone } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getReadySession, getReturnPath } from "@/lib/auth-session";
import { supabase } from "@/integrations/supabase/client";
import { updateOrderStatus } from "@/lib/admin.functions";

const STATUSES = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
  "expired",
] as const;
type AdminStatus = (typeof STATUSES)[number];

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

type OrderRow = Omit<Order, "items">;
type OrderItemRow = Item & { order_id: string };

const QUERY_TIMEOUT_MS = 12000;

function withTimeout<T>(promise: PromiseLike<T>, message: string) {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(message)), QUERY_TIMEOUT_MS);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export const Route = createFileRoute("/admin/orders")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Admin — Bestellungen" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AdminOrdersPage,
});

function fmt(cents: number, currency = "EUR") {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency }).format((cents ?? 0) / 100);
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
  const navigate = useNavigate();
  const update = useServerFn(updateOrderStatus);

  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const session = await getReadySession(5000);
        if (!session) {
          navigate({
            to: "/auth",
            search: { mode: "login", redirect: getReturnPath(window.location) },
            replace: true,
          });
          return;
        }
        const roleResult = await withTimeout(
          supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "admin")
            .maybeSingle(),
          "Admin-Berechtigung konnte nicht geprüft werden. Bitte Seite neu laden.",
        );
        if (!active) return;
        if (roleResult.error) throw roleResult.error;
        if (!roleResult.data) {
          setAuthorized(false);
          return;
        }
        setAuthorized(true);
        const ordersResult = await withTimeout(
          supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(500),
          "Bestellungen konnten nicht geladen werden. Bitte Seite neu laden.",
        );
        if (!active) return;
        if (ordersResult.error) throw ordersResult.error;

        const orderRows = (ordersResult.data ?? []) as OrderRow[];
        const ids = orderRows.map((order) => order.id);
        const itemsByOrder: Record<string, Item[]> = {};
        if (ids.length > 0) {
          const itemsResult = await withTimeout(
            supabase.from("order_items").select("*").in("order_id", ids),
            "Bestellpositionen konnten nicht geladen werden. Bitte Seite neu laden.",
          );
          if (!active) return;
          if (itemsResult.error) throw itemsResult.error;
          for (const item of (itemsResult.data ?? []) as OrderItemRow[]) {
            (itemsByOrder[item.order_id] ||= []).push(item);
          }
        }

        setOrders(
          orderRows.map((order) => ({ ...order, items: itemsByOrder[order.id] ?? [] })) as Order[],
        );
      } catch (e: unknown) {
        if (!active) return;
        toast.error(getErrorMessage(e, "Fehler beim Laden"));
        setAuthorized(false);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [navigate]);

  const handleStatus = async (orderId: string, status: AdminStatus) => {
    try {
      await update({ data: { orderId, status } });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      toast.success("Status aktualisiert");
    } catch (e: unknown) {
      toast.error(getErrorMessage(e, "Aktualisierung fehlgeschlagen"));
    }
  };

  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const stats = {
    total: orders.length,
    revenue: orders
      .filter((o) => ["paid", "shipped", "delivered"].includes(o.status))
      .reduce((s, o) => s + o.total_cents, 0),
    pending: orders.filter((o) => o.status === "pending").length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Bestellungen</h1>
          <div className="flex gap-2">
            <Link to="/admin/products">
              <Button variant="outline" size="sm">
                Produkte
              </Button>
            </Link>
            <Link to="/account">
              <Button variant="outline" size="sm">
                Mein Konto
              </Button>
            </Link>
          </div>
        </div>

        {loading && <p className="text-muted-foreground">Wird geladen…</p>}

        {!loading && authorized === false && (
          <div className="border border-border rounded-lg p-8 text-center">
            <p className="text-lg font-medium mb-2">Kein Zugriff</p>
            <p className="text-muted-foreground">Du hast keine Admin-Rechte.</p>
          </div>
        )}

        {!loading && authorized && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="border border-border rounded-lg p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  Bestellungen gesamt
                </div>
                <div className="text-2xl font-bold mt-1">{stats.total}</div>
              </div>
              <div className="border border-border rounded-lg p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  Umsatz (bezahlt)
                </div>
                <div className="text-2xl font-bold mt-1">{fmt(stats.revenue)}</div>
              </div>
              <div className="border border-border rounded-lg p-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  Bekleyen
                </div>
                <div className="text-2xl font-bold mt-1">{stats.pending}</div>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap mb-6">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-full text-sm border ${filter === "all" ? "bg-foreground text-background" : "border-border"}`}
              >
                Alle ({orders.length})
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

            {filtered.length === 0 && <p className="text-muted-foreground">Keine Bestellungen.</p>}

            <div className="space-y-3">
              {filtered.map((o) => {
                const isOpen = !!expanded[o.id];
                return (
                  <div
                    key={o.id}
                    className="border border-border rounded-lg overflow-hidden bg-card"
                  >
                    <button
                      onClick={() => toggle(o.id)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-muted/30 text-left"
                    >
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 shrink-0" />
                      )}
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
                        <div>
                          <div className="text-xs text-muted-foreground">Datum</div>
                          <div className="text-sm">
                            {new Date(o.created_at).toLocaleDateString("de-DE")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(o.created_at).toLocaleTimeString("de-DE", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Kunde</div>
                          <div className="text-sm font-medium truncate">{o.full_name}</div>
                          <div className="text-xs text-muted-foreground truncate">{o.email}</div>
                        </div>
                        <div className="hidden md:block">
                          <div className="text-xs text-muted-foreground">Artikel</div>
                          <div className="text-sm">
                            {o.items.reduce((s, i) => s + i.quantity, 0)} Stk.
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {o.items.map((i) => i.product_name).join(", ")}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Betrag</div>
                          <div className="text-sm font-bold">{fmt(o.total_cents, o.currency)}</div>
                        </div>
                        <div>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs border ${STATUS_COLORS[o.status] ?? "border-border"}`}
                          >
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
                              <User className="w-4 h-4" /> Kundendaten
                            </div>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Name:</span>{" "}
                                {o.full_name}
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                {o.email}
                              </div>
                              {o.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                  {o.phone}
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground font-mono pt-1">
                                Bestell-Nr.: #{o.id}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                              <MapPin className="w-4 h-4" /> Lieferadresse
                            </div>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">
                              {o.full_name}
                              {"\n"}
                              {o.shipping_address}
                              {"\n"}
                              {o.shipping_zip} {o.shipping_city}
                              {"\n"}
                              {o.shipping_country}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                            <Package className="w-4 h-4" /> Bestellte Artikel ({o.items.length}
                            )
                          </div>
                          <div className="border border-border rounded-lg divide-y divide-border bg-background">
                            {o.items.length === 0 && (
                              <div className="p-4 text-sm text-muted-foreground">
                                Keine Artikel.
                              </div>
                            )}
                            {o.items.map((it) => (
                              <div key={it.id} className="flex items-center gap-4 p-3">
                                {it.product_image ? (
                                  <img
                                    src={it.product_image}
                                    alt={it.product_name}
                                    className="w-14 h-14 object-cover rounded border border-border"
                                  />
                                ) : (
                                  <div className="w-14 h-14 rounded border border-border bg-muted flex items-center justify-center">
                                    <Package className="w-5 h-5 text-muted-foreground" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm">{it.product_name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {it.size && (
                                      <>
                                        Größe:{" "}
                                        <span className="font-medium text-foreground">
                                          {it.size}
                                        </span>{" "}
                                        ·{" "}
                                      </>
                                    )}
                                    Menge:{" "}
                                    <span className="font-medium text-foreground">
                                      {it.quantity}
                                    </span>{" "}
                                    · Einzelpreis: {fmt(it.unit_price_cents, o.currency)}
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
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Zwischensumme</span>
                                  <span>{fmt(o.subtotal_cents, o.currency)}</span>
                                </div>
                              )}
                              {o.shipping_cents != null && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Versand</span>
                                  <span>
                                    {o.shipping_cents === 0
                                      ? "Kostenlos"
                                      : fmt(o.shipping_cents, o.currency)}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between font-bold pt-1 border-t border-border">
                                <span>Gesamt</span>
                                <span>{fmt(o.total_cents, o.currency)}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 pt-2 border-t border-border">
                          <label className="text-sm text-muted-foreground">Status:</label>
                          <select
                            value={o.status}
                            onChange={(e) => handleStatus(o.id, e.target.value as AdminStatus)}
                            className="bg-background border border-border rounded px-2 py-1 text-sm"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <Link
                            to="/order/$id"
                            params={{ id: o.id }}
                            className="ml-auto text-sm underline text-muted-foreground hover:text-foreground"
                          >
                            Kundenansicht
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
