import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useCart, type CartItem } from "@/stores/cart";
import { supabase } from "@/integrations/supabase/client";
import { IyzicoCartCheckout } from "@/components/IyzicoCartCheckout";
import { products, type Product } from "@/data/products";
import { createOrder, validateDiscountCode } from "@/lib/checkout.functions";
import { translateError } from "@/lib/error-messages";

const FREE_SHIPPING_THRESHOLD = 1500;
const SHIPPING_FEE = 140;

/* ── Karanlık tema jetonları ─────────────────────────────────────────────── */
const BG     = "#080808";
const CARD   = "#181818";
const RAISED = "#1f1f1f";
const HAIR   = "rgba(255,255,255,0.12)";
const TEXT   = "#f4f4f4";
const MUTED  = "rgba(255,255,255,0.55)";
const DIM    = "rgba(255,255,255,0.38)";
const BONE   = "#dcdcdc";
const MONO   = "'JetBrains Mono', ui-monospace, monospace";
const SANS   = "'Inter Tight', Inter, sans-serif";

const microLabel: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: ".08em",
  color: MUTED,
};

const priceStyle: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: "13px",
  color: TEXT,
  letterSpacing: ".02em",
};

const priceLg: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: "16px",
  color: TEXT,
  letterSpacing: ".01em",
};

const cardStyle: React.CSSProperties = {
  background: CARD,
  border: `1px solid ${HAIR}`,
  borderRadius: "10px",
};

const ctaPrimary: React.CSSProperties = {
  background: "#ffffff",
  color: BG,
  border: "none",
  borderRadius: "10px",
  fontFamily: MONO,
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: ".08em",
  cursor: "pointer",
};

const ctaSecondary: React.CSSProperties = {
  background: "transparent",
  color: TEXT,
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: "999px",
  fontFamily: MONO,
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: ".08em",
  cursor: "pointer",
};

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Sepetim — OLD IRON" },
      { name: "description", content: "OLD IRON sepetiniz. Güvenli ödeme, 1500₺ ve üzeri ücretsiz kargo." },
    ],
  }),
  component: CartPage,
});

/* ── Yardımcılar ─────────────────────────────────────────────────────────── */

function tl(n: number) {
  const safe = Number.isFinite(n) ? n : 0;
  return `₺${safe.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** localStorage'dan gelen eksik alanlı kayıtlara karşı koruma. */
function safeItem(raw: CartItem): CartItem {
  return {
    id: raw?.id ?? `${raw?.productId ?? "urun"}-${raw?.size ?? "std"}`,
    productId: raw?.productId ?? "",
    name: raw?.name ?? "Ürün",
    size: raw?.size ?? "Standart",
    price: Number.isFinite(raw?.price) ? raw.price : 0,
    image: raw?.image ?? "/images/logo.png",
    categoryLabel: raw?.categoryLabel ?? "",
    qty: Number.isFinite(raw?.qty) && raw.qty > 0 ? Math.floor(raw.qty) : 1,
  };
}

function isSupplementItem(size: string) {
  return !["S", "M", "L", "XL", "XXL"].includes(size);
}

function defaultVariant(p: Product) {
  if (p.type === "supplement") return p.flavors?.[0] ?? p.weights?.[0] ?? "Standart";
  return "M";
}

function fallbackImg(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  img.onerror = null;
  img.src = "/images/logo.png";
  img.style.objectFit = "contain";
  img.style.padding = "10px";
  img.style.filter = "brightness(0) invert(1) opacity(0.7)";
}

/* ── İkonlar (ince çizgi, tek renk) ──────────────────────────────────────── */

const iconProps = {
  width: 16, height: 16, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
};

const LockIcon = () => (
  <svg {...iconProps} aria-hidden><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 1 1 8 0v3" /></svg>
);
const ReturnIcon = () => (
  <svg {...iconProps} aria-hidden><path d="M3 10h11a5 5 0 0 1 0 10h-4" /><path d="M7 6 3 10l4 4" /></svg>
);
const TruckIcon = () => (
  <svg {...iconProps} aria-hidden><path d="M2 7h11v10H2z" /><path d="M13 10h4l4 4v3h-8z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></svg>
);
const CheckIcon = () => (
  <svg {...iconProps} width={14} height={14} aria-hidden><path d="m4 12 5 5L20 6" /></svg>
);

/* ── Sayfa ───────────────────────────────────────────────────────────────── */

function CartPage() {
  const rawItems   = useCart((s) => s.items);
  const updateQty  = useCart((s) => s.updateQty);
  const remove     = useCart((s) => s.remove);
  const clear      = useCart((s) => s.clear);
  const add        = useCart((s) => s.add);
  const navigate   = useNavigate();
  const [terms, setTerms]     = useState(false);
  const [placing, setPlacing] = useState(false);
  const [checkoutData, setCheckoutData] = useState<null | { orderId: string }>(null);
  const [discountInput, setDiscountInput] = useState("");
  const [discount, setDiscount] = useState<null | { code: string; percentOff: number }>(null);
  const [checkingDiscount, setCheckingDiscount] = useState(false);

  const items = (Array.isArray(rawItems) ? rawItems : []).map(safeItem);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const kdv      = subtotal * 0.20;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const discountAmount = discount ? subtotal * (discount.percentOff / 100) : 0;
  const total    = Math.max(0, subtotal + shipping - discountAmount);

  const applyDiscount = async () => {
    const code = discountInput.trim();
    if (!code) return;
    setCheckingDiscount(true);
    try {
      const result = await validateDiscountCode({ data: { code } });
      setDiscount(result);
      toast.success(`"${result.code}" kodu uygulandı — %${result.percentOff} indirim.`);
    } catch (e) {
      setDiscount(null);
      toast.error(translateError(e instanceof Error ? e.message : "Geçersiz kod."));
    } finally {
      setCheckingDiscount(false);
    }
  };
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress  = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const inCart = new Set(items.map((i) => i.productId));
  const crossSell = products.filter((p) => !inCart.has(p.id)).slice(0, 3);

  const handleAdd = (p: Product) => {
    add(p, defaultVariant(p));
    toast.success(`${p.name} sepete eklendi`);
  };

  const handleRemove = (item: CartItem) => {
    remove(item.id);
    toast("Ürün kaldırıldı", {
      action: {
        label: "Geri al",
        onClick: () => {
          useCart.setState((s) =>
            s.items.some((i) => i.id === item.id) ? s : { items: [...s.items, item] }
          );
        },
      },
    });
  };

  const handleDec = (item: CartItem) => {
    if (item.qty <= 1) handleRemove(item);
    else updateQty(item.id, -1);
  };

  const checkout = async () => {
    setPlacing(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        navigate({ to: "/auth", search: { mode: "login", redirect: "/cart" } });
        return;
      }
      // Fiyatlar sunucuda, products.ts'ten yeniden hesaplanır — sepetteki
      // (localStorage'dan gelen, değiştirilebilir) fiyat asla gönderilmez.
      const result = await createOrder({
        data: {
          lines: items.map((i) => ({ productId: i.productId, size: i.size, qty: i.qty })),
          discountCode: discount?.code,
        },
      });
      setCheckoutData({ orderId: result.orderId });
      clear();
    } catch (e) {
      const msg = translateError(e instanceof Error ? e.message : "Sipariş oluşturulamadı.");
      toast.error(msg);
      if (msg.includes("teslimat adresini") || msg.includes("TC Kimlik No")) {
        navigate({ to: "/account" });
      }
    } finally {
      setPlacing(false);
    }
  };

  const tryCheckout = () => {
    if (!terms) {
      toast.error("Devam etmek için koşulları onayla.");
      document.getElementById("siparis-ozeti")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    void checkout();
  };

  /* ── Alt bileşenler ──────────────────────────────────────────────────── */

  const CrossSell = ({ list, title }: { list: Product[]; title: string }) => {
    if (!list.length) return null;
    return (
      <section className="mt-8">
        <h2 className="mb-3" style={microLabel}>{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {list.map((p) => (
            <div key={p.id}
              className="flex items-center gap-3 rounded-[10px] p-3"
              style={cardStyle}>
              <Link to="/product/$id" params={{ id: p.id }}
                className="shrink-0 w-[56px] h-[56px] rounded-[10px] overflow-hidden block"
                style={{ background: RAISED }}>
                <img src={p.gallery?.[0] ?? p.image} alt={p.name} loading="lazy"
                  className="w-full h-full object-cover" onError={fallbackImg} />
              </Link>
              <div className="min-w-0 flex-1">
                <Link to="/product/$id" params={{ id: p.id }}
                  className="block truncate text-[14px] font-semibold"
                  style={{ color: TEXT, textDecoration: "none" }}>
                  {p.name}
                </Link>
                <span style={priceStyle}>{tl(p.price)}</span>
              </div>
              <button
                type="button"
                onClick={() => handleAdd(p)}
                className="shrink-0 px-3 h-[36px]"
                style={ctaSecondary}
              >
                Ekle
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const TrustRow = () => (
    <div className="pt-4 space-y-3">
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {[
          { icon: <LockIcon />, label: "Güvenli ödeme" },
          { icon: <ReturnIcon />, label: "14 gün iade" },
          { icon: <TruckIcon />, label: "1–3 iş günü kargo" },
        ].map(({ icon, label }) => (
          <span key={label} className="flex items-center gap-1.5 text-[12px]"
            style={{ color: MUTED }}>
            {icon}{label}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {["Visa", "Mastercard", "Troy"].map((m) => (
          <span key={m} className="rounded-full px-2.5 py-1"
            style={{ border: `1px solid ${HAIR}`, color: MUTED, fontFamily: MONO, fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase" }}>
            {m}
          </span>
        ))}
      </div>
    </div>
  );

  const ShippingProgress = () => (
    <div className="rounded-[10px] p-4 md:p-5 mb-6" style={cardStyle}>
      {remaining > 0 ? (
        <>
          <p className="text-[13px] mb-2" style={{ color: TEXT }}>
            Ücretsiz kargoya <span style={priceStyle}>{tl(remaining)}</span> kaldı
          </p>
          <div className="h-[3px] w-full rounded-full" style={{ background: HAIR }}>
            <div className="h-[3px] rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: BONE }} />
          </div>
        </>
      ) : (
        <p className="flex items-center gap-2" style={{ ...microLabel, color: TEXT }}>
          <CheckIcon /> Kargo bedava
        </p>
      )}
    </div>
  );

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen" style={{ background: BG, color: TEXT, fontFamily: SANS }}>
      <Nav />
      <main className="pt-[120px] pb-[80px] px-[20px] md:px-[72px] max-w-[1440px] mx-auto"
        style={{ paddingBottom: items.length && !checkoutData ? "120px" : undefined }}>
        <header className="mb-stack-md pt-8">
          <h1 className="text-[40px] md:text-[48px] font-bold tracking-[-0.03em] leading-none" style={{ color: TEXT }}>Sepetim</h1>
          <p className="mt-3" style={microLabel}>Her dikişte hassasiyet.</p>
        </header>

        {checkoutData ? (
          <div className="rounded-[10px] p-6" style={cardStyle}>
            <IyzicoCartCheckout {...checkoutData} />
          </div>
        ) : items.length === 0 ? (
          <div>
            <div className="rounded-[10px] p-10 md:p-12" style={cardStyle}>
              <h2 className="text-[32px] md:text-[40px] font-bold lowercase leading-none" style={{ color: TEXT }}>sepetin boş</h2>
              <p className="text-[14px] mt-3 max-w-[420px]" style={{ color: MUTED }}>
                Henüz bir şey eklemedin. Koleksiyonda seni bekleyen parçalar var.
              </p>
              <Link to="/shop"
                className="inline-flex items-center justify-center mt-6 px-8 h-[48px]"
                style={{ ...ctaPrimary, textDecoration: "none" }}>
                Koleksiyonu Keşfet
              </Link>
            </div>
            <CrossSell list={products.slice(0, 3)} title="Öne çıkanlar" />
          </div>
        ) : (
          <>
            <ShippingProgress />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-md">
              {/* Ürünler */}
              <div className="lg:col-span-8">
                <div className="space-y-gutter">
                  {items.map((item) => (
                    <div key={item.id}
                      className="rounded-[10px] p-4 md:p-5 flex gap-4"
                      style={cardStyle}>
                      <Link to="/product/$id" params={{ id: item.productId }}
                        className="w-[88px] h-[110px] md:w-[104px] md:h-[130px] rounded-[10px] overflow-hidden shrink-0"
                        style={{ background: RAISED }}>
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={fallbackImg} />
                      </Link>

                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex justify-between items-start gap-3">
                          <div className="min-w-0">
                            <Link to="/product/$id" params={{ id: item.productId }}
                              className="block text-[16px] font-semibold"
                              style={{ color: TEXT, textDecoration: "none", letterSpacing: "-0.02em" }}>
                              {item.name}
                            </Link>
                            <p className="mt-1" style={{ ...microLabel, color: DIM }}>
                              {isSupplementItem(item.size) ? item.size : `Beden: ${item.size}`}
                            </p>
                            <p className="mt-1" style={{ ...priceStyle, color: MUTED }}>
                              {tl(item.price)} / adet
                            </p>
                          </div>
                          <span className="whitespace-nowrap" style={priceLg}>{tl(item.price * item.qty)}</span>
                        </div>

                        <div className="flex items-center justify-between gap-3 mt-auto pt-4">
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => handleDec(item)} aria-label="Azalt"
                              className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center text-[16px] cursor-pointer"
                              style={{ border: "1px solid rgba(255,255,255,0.25)", color: TEXT, background: "transparent" }}>−</button>
                            <span className="w-[28px] text-center" style={priceLg}>{item.qty}</span>
                            <button type="button" onClick={() => updateQty(item.id, 1)} aria-label="Artır"
                              className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center text-[16px] cursor-pointer"
                              style={{ border: "1px solid rgba(255,255,255,0.25)", color: TEXT, background: "transparent" }}>+</button>
                          </div>
                          <button type="button" onClick={() => handleRemove(item)}
                            className="cursor-pointer"
                            style={microLabel}>
                            Kaldır
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <CrossSell list={crossSell} title="Bunları da ekleyebilirsin" />
              </div>

              {/* Özet */}
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-[120px] space-y-gutter">
                  <div id="siparis-ozeti" className="rounded-[10px] p-6" style={cardStyle}>
                    <h2 className="text-[18px] font-semibold mb-5" style={{ color: TEXT, letterSpacing: "-0.02em" }}>Sipariş Özeti</h2>

                    <div className="space-y-3">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[14px]" style={{ color: MUTED }}>Ara Toplam</span>
                        <span className="text-right" style={priceLg}>{tl(subtotal)}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-[14px]" style={{ color: MUTED }}>Kargo</span>
                        <span className="text-right" style={priceLg}>
                          {shipping === 0 ? "Ücretsiz" : tl(shipping)}
                        </span>
                      </div>
                      {discount && (
                        <div className="flex justify-between items-baseline">
                          <span className="text-[14px]" style={{ color: "#8fd99a" }}>
                            İndirim ({discount.code} · %{discount.percentOff})
                          </span>
                          <span className="text-right" style={{ ...priceLg, color: "#8fd99a" }}>
                            −{tl(discountAmount)}
                          </span>
                        </div>
                      )}
                      <div className="pt-3 flex justify-between items-baseline" style={{ borderTop: `1px solid ${HAIR}` }}>
                        <span className="text-[16px] font-semibold" style={{ color: TEXT }}>Toplam</span>
                        <span className="text-right" style={{ ...priceLg, fontSize: 20 }}>{tl(total)}</span>
                      </div>
                      <p style={{ ...microLabel, color: DIM }}>KDV dahil ({tl(kdv)})</p>
                    </div>

                    <div className="pt-5">
                      {discount ? (
                        <div className="flex items-center justify-between rounded-[8px] px-3 py-2" style={{ background: "rgba(143,217,154,0.08)", border: "1px solid rgba(143,217,154,0.3)" }}>
                          <span className="text-[13px]" style={{ color: "#8fd99a" }}>
                            "{discount.code}" uygulandı — %{discount.percentOff} indirim
                          </span>
                          <button onClick={() => { setDiscount(null); setDiscountInput(""); }}
                            className="text-[12px] underline" style={{ color: MUTED }}>
                            Kaldır
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            value={discountInput}
                            onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyDiscount(); } }}
                            placeholder="İndirim kodu"
                            className="flex-1 rounded-[8px] px-3 py-2.5 text-[13px]"
                            style={{ background: RAISED, border: `1px solid ${HAIR}`, color: TEXT }}
                          />
                          <button
                            onClick={applyDiscount}
                            disabled={checkingDiscount || !discountInput.trim()}
                            className="px-4 rounded-[8px] text-[12px] font-semibold disabled:opacity-40"
                            style={{ background: RAISED, border: `1px solid ${HAIR}`, color: TEXT }}
                          >
                            {checkingDiscount ? "…" : "Uygula"}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 pt-6">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input checked={terms} onChange={(e) => setTerms(e.target.checked)} type="checkbox"
                          className="mt-1 h-4 w-4 cursor-pointer" style={{ accentColor: "#ffffff" }} />
                        <span className="text-[12px] leading-tight" style={{ color: MUTED }}>
                          <Link className="underline" style={{ color: TEXT }} to="/legal/agb">Kullanım Koşulları</Link>'nı ve{" "}
                          <Link className="underline" style={{ color: TEXT }} to="/legal/datenschutz">Gizlilik Politikası</Link>'nı okudum ve kabul ediyorum.
                        </span>
                      </label>
                      <button onClick={checkout} disabled={!terms || placing}
                        className="w-full py-4 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={ctaPrimary}>
                        {placing ? "İşleniyor..." : "Güvenli Ödemeye Geç"}
                      </button>
                      <TrustRow />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobil sabit ödeme çubuğu */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between gap-3"
              style={{ background: "rgba(8,8,8,0.85)", backdropFilter: "blur(12px)", borderTop: `1px solid ${HAIR}` }}>
              <div className="leading-tight">
                <p style={{ ...microLabel, fontSize: "10px" }}>Toplam</p>
                <span style={priceLg}>{tl(total)}</span>
              </div>
              <button type="button" onClick={tryCheckout} disabled={placing}
                className="px-6 h-[48px] disabled:opacity-40"
                style={ctaPrimary}>
                {placing ? "İşleniyor..." : "Ödemeye Geç"}
              </button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
