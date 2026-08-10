import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { translateError } from "@/lib/error-messages";
import {
  checkIsAdmin,
  listAllOrders,
  updateOrderStatus,
} from "@/lib/admin.functions";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled", "refunded", "expired"] as const;
type Status = (typeof STATUSES)[number];

const STATUS_TR: Record<Status, string> = {
  pending: "Beklemede",
  paid: "Ödendi",
  shipped: "Kargoda",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
  refunded: "İade Edildi",
  expired: "Süresi Doldu",
};

const STATUS_COLOR: Record<Status, string> = {
  pending: "#f5c66b",
  paid: "#6fd68a",
  shipped: "#6fb8ff",
  delivered: "#c8c8c8",
  cancelled: "#ff6f6f",
  refunded: "#ff9f6f",
  expired: "rgba(255,255,255,0.4)",
};

/* ── Karanlık tema jetonları (site geneliyle aynı) ──────────────────────── */
const BG     = "#080808";
const CARD   = "#141414";
const RAISED = "#1c1c1c";
const HAIR   = "rgba(255,255,255,0.12)";
const TEXT   = "#f4f4f4";
const MUTED  = "rgba(255,255,255,0.55)";
const DIM    = "rgba(255,255,255,0.38)";
const MONO   = "'JetBrains Mono', ui-monospace, monospace";
const SANS   = "'Inter Tight', Inter, sans-serif";
const EASE   = "cubic-bezier(.16,.8,.24,1)";

type OrderItem = {
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
  identity_number: string | null;
  subtotal_cents: number;
  shipping_cents: number;
  discount_cents: number | null;
  discount_code: string | null;
  total_cents: number;
  currency: string;
  status: Status;
  notes: string | null;
  order_items: OrderItem[];
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
      throw redirect({ to: "/auth", search: { mode: "login", redirect: location.pathname + location.search } });
    }
  },
  component: AdminOrdersPage,
});

function fmt(cents: number, currency = "TRY") {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency }).format(cents / 100);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

const TABS: { key: "action" | "all" | Status; label: string }[] = [
  { key: "action", label: "Kargo Bekliyor" },
  { key: "all", label: "Tümü" },
  { key: "pending", label: STATUS_TR.pending },
  { key: "paid", label: STATUS_TR.paid },
  { key: "shipped", label: STATUS_TR.shipped },
  { key: "delivered", label: STATUS_TR.delivered },
  { key: "cancelled", label: STATUS_TR.cancelled },
];

function AdminOrdersPage() {
  const check = useServerFn(checkIsAdmin);
  const list = useServerFn(listAllOrders);
  const update = useServerFn(updateOrderStatus);

  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("action");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [codeFilter, setCodeFilter] = useState<string | null>(null);

  const load = async () => {
    try {
      const { isAdmin } = await check();
      if (!isAdmin) { setAuthorized(false); setLoading(false); return; }
      setAuthorized(true);
      const { orders } = await list();
      setOrders(orders as unknown as Order[]);
    } catch (e) {
      toast.error(translateError(e instanceof Error ? e.message : null));
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (orderId: string, status: Status) => {
    const prev = orders;
    setOrders((os) => os.map((o) => (o.id === orderId ? { ...o, status } : o)));
    try {
      await update({ data: { orderId, status } });
      toast.success(status === "shipped" ? "Kargoya verildi olarak işaretlendi." : "Durum güncellendi.");
    } catch (e) {
      setOrders(prev);
      toast.error(translateError(e instanceof Error ? e.message : null));
    }
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length, action: 0 };
    for (const o of orders) {
      c[o.status] = (c[o.status] ?? 0) + 1;
      if (o.status === "paid") c.action++;
    }
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    let list = orders;
    if (tab === "action") list = list.filter((o) => o.status === "paid");
    else if (tab !== "all") list = list.filter((o) => o.status === tab);
    if (codeFilter) list = list.filter((o) => o.discount_code === codeFilter);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((o) =>
        o.full_name?.toLowerCase().includes(q) ||
        o.email?.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.shipping_city?.toLowerCase().includes(q) ||
        o.discount_code?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, tab, query, codeFilter]);

  /* İndirim kodu bazlı özet — hak ediş hesaplaması için (iptal/süresi dolan
     siparişler hariç, gerçekleşen ciro üzerinden). */
  const codeStats = useMemo(() => {
    const stats = new Map<string, { orders: number; revenue: number; discountGiven: number }>();
    for (const o of orders) {
      if (!o.discount_code) continue;
      if (o.status === "cancelled" || o.status === "expired") continue;
      const s = stats.get(o.discount_code) ?? { orders: 0, revenue: 0, discountGiven: 0 };
      s.orders += 1;
      s.revenue += o.total_cents;
      s.discountGiven += o.discount_cents ?? 0;
      stats.set(o.discount_code, s);
    }
    return Array.from(stats.entries())
      .map(([code, s]) => ({ code, ...s }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [orders]);

  const copyAddress = (o: Order) => {
    const text = [
      o.full_name,
      o.phone ?? "",
      o.shipping_address,
      `${o.shipping_zip} ${o.shipping_city} / ${o.shipping_country}`,
    ].filter(Boolean).join("\n");
    navigator.clipboard?.writeText(text).then(
      () => toast.success("Adres kopyalandı."),
      () => toast.error("Kopyalanamadı.")
    );
  };

  return (
    <div style={{ background: BG, color: TEXT, minHeight: "100vh", fontFamily: SANS }}>
      <Nav />
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "132px 20px 96px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", marginBottom: "28px", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".2em", textTransform: "uppercase", color: DIM, marginBottom: "8px" }}>
              Admin
            </p>
            <h1 style={{ fontSize: "34px", fontWeight: 700, letterSpacing: "-0.03em", margin: 0 }}>
              Siparişler
            </h1>
          </div>
          <Link
            to="/account"
            style={{
              fontFamily: MONO, fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase",
              color: MUTED, border: `1px solid ${HAIR}`, borderRadius: "8px", padding: "10px 16px",
              textDecoration: "none", transition: `border-color .2s ${EASE}, color .2s ${EASE}`,
            }}
          >
            ← Hesabım
          </Link>
        </div>

        {loading && <p style={{ color: MUTED, fontSize: "14px" }}>Yükleniyor…</p>}

        {!loading && authorized === false && (
          <div style={{ background: CARD, border: `1px solid ${HAIR}`, borderRadius: "14px", padding: "40px", textAlign: "center" }}>
            <p style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>Erişim Reddedildi</p>
            <p style={{ color: MUTED, fontSize: "14px" }}>Bu sayfayı görmek için admin yetkin olması gerekiyor.</p>
          </div>
        )}

        {!loading && authorized && (
          <>
            {/* ── İndirim kodu özeti (hak ediş) ── */}
            {codeStats.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <p style={{ fontFamily: MONO, fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: DIM, marginBottom: "10px" }}>
                  İndirim Kodları — Hak Ediş Özeti
                </p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {codeStats.map((s) => {
                    const active = codeFilter === s.code;
                    return (
                      <button
                        key={s.code}
                        onClick={() => setCodeFilter(active ? null : s.code)}
                        style={{
                          textAlign: "left", cursor: "pointer", minWidth: "180px",
                          background: active ? "#f4f4f4" : CARD,
                          border: `1px solid ${active ? "rgba(255,255,255,.5)" : HAIR}`,
                          borderRadius: "10px", padding: "12px 16px",
                          transition: `all .2s ${EASE}`,
                        }}
                      >
                        <div style={{ fontFamily: MONO, fontSize: "13px", fontWeight: 700, color: active ? BG : TEXT }}>
                          {s.code}
                        </div>
                        <div style={{ fontSize: "12px", color: active ? "rgba(8,8,8,.6)" : MUTED, marginTop: "4px" }}>
                          {s.orders} sipariş · {fmt(s.revenue)} ciro
                        </div>
                        <div style={{ fontSize: "11px", color: active ? "rgba(8,8,8,.5)" : DIM }}>
                          {fmt(s.discountGiven)} indirim verildi
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Durum sekmeleri ── */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
              {TABS.map((t) => {
                const active = tab === t.key;
                const n = counts[t.key] ?? 0;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    style={{
                      fontFamily: MONO, fontSize: "11px", letterSpacing: ".06em", textTransform: "uppercase",
                      padding: "10px 14px", borderRadius: "8px", cursor: "pointer",
                      border: `1px solid ${active ? "rgba(255,255,255,.5)" : HAIR}`,
                      background: active ? "#f4f4f4" : RAISED,
                      color: active ? BG : MUTED,
                      fontWeight: active ? 700 : 500,
                      transition: `all .2s ${EASE}`,
                      display: "flex", alignItems: "center", gap: "8px",
                    }}
                  >
                    {t.label}
                    {n > 0 && (
                      <span style={{
                        fontSize: "10px", padding: "1px 6px", borderRadius: "999px",
                        background: active ? "rgba(8,8,8,.15)" : "rgba(255,255,255,.1)",
                      }}>
                        {n}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="İsim, e-posta, şehir veya sipariş no ara…"
              style={{
                width: "100%", maxWidth: "420px", marginBottom: "24px",
                padding: "11px 14px", borderRadius: "8px",
                background: RAISED, border: `1px solid ${HAIR}`, color: TEXT,
                fontSize: "13px", outline: "none",
              }}
            />

            {filtered.length === 0 && (
              <p style={{ color: MUTED, fontSize: "14px" }}>Bu filtrede sipariş yok.</p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filtered.map((o) => {
                const open = openId === o.id;
                return (
                  <div key={o.id} style={{
                    background: CARD, border: `1px solid ${HAIR}`, borderRadius: "12px", overflow: "hidden",
                  }}>
                    {/* ── Satır başlığı ── */}
                    <button
                      onClick={() => setOpenId(open ? null : o.id)}
                      style={{
                        width: "100%", textAlign: "left", cursor: "pointer",
                        background: "transparent", border: "none", color: TEXT,
                        padding: "18px 20px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
                      }}
                    >
                      <span style={{
                        width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                        background: STATUS_COLOR[o.status] ?? DIM,
                      }} />
                      <span style={{ fontFamily: MONO, fontSize: "12px", color: DIM, minWidth: "90px" }}>
                        #{o.id.slice(0, 8)}
                      </span>
                      <span style={{ flex: "1 1 180px", fontWeight: 600, fontSize: "14px" }}>
                        {o.full_name}
                        <span style={{ display: "block", fontSize: "12px", color: MUTED, fontWeight: 400 }}>{o.email}</span>
                      </span>
                      <span style={{ fontSize: "13px", color: MUTED, flex: "0 0 140px" }}>
                        {o.shipping_city}, {o.shipping_country}
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: "11px", color: DIM, flex: "0 0 140px" }}>
                        {fmtDate(o.created_at)}
                      </span>
                      {o.discount_code && (
                        <span style={{
                          fontFamily: MONO, fontSize: "10px", color: "#8fd99a",
                          border: "1px solid rgba(143,217,154,.35)", borderRadius: "999px",
                          padding: "3px 8px", flexShrink: 0,
                        }}>
                          {o.discount_code}
                        </span>
                      )}
                      <span style={{ fontFamily: MONO, fontSize: "14px", fontWeight: 700, flex: "0 0 100px", textAlign: "right" }}>
                        {fmt(o.total_cents, o.currency)}
                      </span>
                      <span style={{
                        fontFamily: MONO, fontSize: "10px", letterSpacing: ".06em", textTransform: "uppercase",
                        padding: "5px 10px", borderRadius: "999px",
                        border: `1px solid ${STATUS_COLOR[o.status]}55`,
                        color: STATUS_COLOR[o.status], flex: "0 0 auto", whiteSpace: "nowrap",
                      }}>
                        {STATUS_TR[o.status] ?? o.status}
                      </span>
                      <span style={{ color: DIM, transform: open ? "rotate(180deg)" : "none", transition: `transform .2s ${EASE}` }}>▾</span>
                    </button>

                    {/* ── Genişletilmiş kargo detayı ── */}
                    {open && (
                      <div style={{ borderTop: `1px solid ${HAIR}`, padding: "20px", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
                        <div>
                          <p style={{ fontFamily: MONO, fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: DIM, marginBottom: "10px" }}>
                            Kalemler
                          </p>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {o.order_items?.map((it) => (
                              <div key={it.id} style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "13px" }}>
                                <span>
                                  {it.product_name}
                                  {it.size && <span style={{ color: MUTED }}> — {it.size}</span>}
                                  <span style={{ color: DIM }}> × {it.quantity}</span>
                                </span>
                                <span style={{ fontFamily: MONO, color: MUTED, flexShrink: 0 }}>{fmt(it.line_total_cents, o.currency)}</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: `1px solid ${HAIR}`, display: "flex", justifyContent: "space-between", fontSize: "12px", color: MUTED }}>
                            <span>Kargo</span>
                            <span style={{ fontFamily: MONO }}>{o.shipping_cents === 0 ? "Ücretsiz" : fmt(o.shipping_cents, o.currency)}</span>
                          </div>
                          {o.discount_code && (
                            <div style={{ marginTop: "6px", display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#8fd99a" }}>
                              <span>İndirim ({o.discount_code})</span>
                              <span style={{ fontFamily: MONO }}>−{fmt(o.discount_cents ?? 0, o.currency)}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                            <p style={{ fontFamily: MONO, fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: DIM, margin: 0 }}>
                              Teslimat Adresi
                            </p>
                            <button
                              onClick={() => copyAddress(o)}
                              style={{
                                fontFamily: MONO, fontSize: "10px", letterSpacing: ".04em",
                                color: TEXT, background: RAISED, border: `1px solid ${HAIR}`,
                                borderRadius: "6px", padding: "5px 10px", cursor: "pointer",
                              }}
                            >
                              Adresi Kopyala
                            </button>
                          </div>
                          <p style={{ fontSize: "13px", lineHeight: 1.7, color: TEXT, margin: 0 }}>
                            {o.full_name}<br />
                            {o.phone && <>{o.phone}<br /></>}
                            {o.shipping_address}<br />
                            {o.shipping_zip} {o.shipping_city} / {o.shipping_country}
                          </p>
                          {o.notes && (
                            <p style={{ fontSize: "12px", color: MUTED, marginTop: "10px" }}>
                              Not: {o.notes}
                            </p>
                          )}

                          <div style={{ marginTop: "18px" }}>
                            <p style={{ fontFamily: MONO, fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: DIM, marginBottom: "8px" }}>
                              Durumu Değiştir
                            </p>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                              {STATUSES.map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleStatus(o.id, s)}
                                  disabled={o.status === s}
                                  style={{
                                    fontFamily: MONO, fontSize: "11px", padding: "8px 12px", borderRadius: "7px",
                                    cursor: o.status === s ? "default" : "pointer",
                                    border: `1px solid ${o.status === s ? STATUS_COLOR[s] : HAIR}`,
                                    background: o.status === s ? `${STATUS_COLOR[s]}1a` : RAISED,
                                    color: o.status === s ? STATUS_COLOR[s] : MUTED,
                                    opacity: o.status === s ? 1 : 0.85,
                                    transition: `all .2s ${EASE}`,
                                  }}
                                >
                                  {STATUS_TR[s]}
                                </button>
                              ))}
                            </div>
                          </div>
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
