import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useCart } from "@/stores/cart";
import { supabase } from "@/integrations/supabase/client";
import { StripeCartCheckout } from "@/components/StripeCartCheckout";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Sepetim — OLD IRON" },
      { name: "description", content: "OLD IRON sepetiniz. Güvenli ödeme, 1500₺ ve üzeri ücretsiz kargo." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const items      = useCart((s) => s.items);
  const updateQty  = useCart((s) => s.updateQty);
  const remove     = useCart((s) => s.remove);
  const clear      = useCart((s) => s.clear);
  const navigate   = useNavigate();
  const [terms, setTerms]     = useState(false);
  const [placing, setPlacing] = useState(false);
  const [checkoutData, setCheckoutData] = useState<null | {
    orderId: string;
    items: { productId: string; name: string; unitAmountCents: number; quantity: number }[];
    shippingCents: number;
    returnUrl: string;
  }>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const kdv      = subtotal * 0.20;
  const shipping = subtotal >= 1500 ? 0 : 140;
  const total    = subtotal + shipping;

  const checkout = async () => {
    setPlacing(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        navigate({ to: "/auth", search: { mode: "login", redirect: "/cart" } });
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, phone, shipping_address, shipping_city, shipping_zip, shipping_country")
        .eq("id", userData.user.id)
        .maybeSingle();
      if (!profile?.shipping_address || !profile.shipping_city || !profile.shipping_zip) {
        toast.error("Lütfen önce teslimat adresini ekle.");
        navigate({ to: "/account" });
        return;
      }
      const cents = (n: number) => Math.round(n * 100);
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: userData.user.id,
          email: userData.user.email!,
          full_name: profile.display_name ?? userData.user.email!.split("@")[0],
          phone: profile.phone,
          shipping_address: profile.shipping_address,
          shipping_city: profile.shipping_city,
          shipping_zip: profile.shipping_zip,
          shipping_country: profile.shipping_country ?? "TR",
          subtotal_cents: cents(subtotal),
          tax_cents: cents(kdv),
          shipping_cents: cents(shipping),
          total_cents: cents(total),
          currency: "TRY",
          status: "pending",
        })
        .select("id")
        .single();
      if (orderErr || !order) throw orderErr ?? new Error("Sipariş oluşturulamadı.");
      const { error: itemsErr } = await supabase.from("order_items").insert(
        items.map((i) => ({
          order_id: order.id,
          product_id: i.productId,
          product_name: i.name,
          product_image: i.image,
          size: i.size,
          quantity: i.qty,
          unit_price_cents: cents(i.price),
          line_total_cents: cents(i.price * i.qty),
        }))
      );
      if (itemsErr) throw itemsErr;
      const orderId = order.id as string;
      setCheckoutData({
        orderId,
        items: items.map((i) => ({
          productId: i.productId,
          name: `${i.name} — ${i.size}`,
          unitAmountCents: cents(i.price),
          quantity: i.qty,
        })),
        shippingCents: cents(shipping),
        returnUrl: `${window.location.origin}/checkout/return?order_id=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      });
      clear();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Sipariş oluşturulamadı.";
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />
      <main className="pt-[120px] pb-[80px] px-[20px] md:px-[72px] max-w-[1440px] mx-auto">
        <header className="mb-stack-md pt-8">
          <h1 className="text-[40px] md:text-[48px] font-bold tracking-[-0.04em] text-foreground leading-none">Sepetim</h1>
          <p className="text-[13px] text-secondary mt-2 tracking-[-0.02em]">Her dikişte hassasiyet.</p>
        </header>

        {checkoutData ? (
          <div className="bg-plaster rounded-[10px] p-6">
            <StripeCartCheckout {...checkoutData} />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-plaster rounded-[10px] p-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-outline/40 mb-4 block">shopping_cart</span>
            <p className="text-[18px] text-secondary mb-6">Sepetiniz boş.</p>
            <Link to="/shop" className="inline-flex btn-primary text-[14px] px-8 py-3 cursor-pointer">
              Alışverişe Devam Et
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-md">
            <div className="lg:col-span-8 space-y-gutter">
              {items.map((item) => (
                <div key={item.id} className="bg-plaster rounded-[10px] p-6 flex flex-col sm:flex-row gap-6 items-center">
                  <Link to="/product/$id" params={{ id: item.productId }} className="w-32 h-40 bg-white rounded-[10px] overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-all"
                      onError={(e) => { const img = e.currentTarget; img.onerror = null; img.src = "/images/logo.png"; img.style.objectFit = "contain"; img.style.padding = "16px"; img.style.filter = "invert(1) brightness(0.25)"; }} />
                  </Link>
                  <div className="flex-grow flex flex-col justify-between h-full py-2 w-full">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <Link to="/product/$id" params={{ id: item.productId }} className="text-[18px] font-bold tracking-[-0.02em] text-foreground hover:text-cobalt transition-colors">{item.name}</Link>
                        <span className="font-mono text-[16px] font-bold text-foreground whitespace-nowrap">₺{(item.price * item.qty).toFixed(2)}</span>
                      </div>
                      <p className="text-secondary text-[12px] mt-1 tracking-[-0.02em]">{item.categoryLabel}</p>
                      <div className="flex gap-4 mt-4 items-center flex-wrap">
                        <div className="bg-white rounded-[30px] px-3 py-1 text-[12px]">{isSupplementItem(item.size) ? item.size : `Beden: ${item.size}`}</div>
                        <div className="flex items-center gap-3 bg-white rounded-[30px] px-3 py-1">
                          <button onClick={() => updateQty(item.id, -1)} className="text-outline hover:text-primary cursor-pointer" aria-label="Azalt">−</button>
                          <span className="text-[14px] font-semibold w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="text-outline hover:text-primary cursor-pointer" aria-label="Artır">+</button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => remove(item.id)} className="mt-4 self-start flex items-center gap-2 text-secondary hover:text-error transition-colors text-[12px] cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                      Kaldır
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 space-y-gutter">
              <div className="bg-plaster rounded-[10px] p-6 space-y-6">
                <h2 className="text-[18px] font-bold tracking-[-0.02em] text-foreground">Sipariş Özeti</h2>
                <div className="space-y-3 text-[15px] text-secondary border-b border-outline-variant/30 pb-6">
                  <div className="flex justify-between"><span>Ara Toplam</span><span>₺{subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Kargo</span><span>{shipping === 0 ? "Ücretsiz" : `₺${shipping.toFixed(2)}`}</span></div>
                  {subtotal < 1500 && (
                    <p className="text-[12px] text-cobalt">₺{(1500 - subtotal).toFixed(2)} daha ekle, ücretsiz kargo kazan!</p>
                  )}
                  <div className="flex justify-between pt-4 text-foreground font-bold">
                    <span className="tracking-[-0.02em]">Toplam</span>
                    <span className="text-xl font-mono">₺{total.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-secondary">KDV dahil (₺{kdv.toFixed(2)})</p>
                </div>
                <div className="space-y-4 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input checked={terms} onChange={(e) => setTerms(e.target.checked)} type="checkbox"
                      className="mt-1 accent-[#000aff] h-4 w-4 cursor-pointer" />
                    <span className="text-[12px] text-secondary leading-tight">
                      <Link className="underline hover:text-foreground" to="/legal/agb">Kullanım Koşulları</Link>'nı ve{" "}
                      <Link className="underline hover:text-foreground" to="/legal/datenschutz">Gizlilik Politikası</Link>'nı okudum ve kabul ediyorum.
                    </span>
                  </label>
                  <button onClick={checkout} disabled={!terms || placing}
                    className="w-full btn-primary text-[15px] py-4 disabled:opacity-40 disabled:cursor-not-allowed">
                    {placing ? "İşleniyor..." : "Güvenli Ödemeye Geç"}
                  </button>
                </div>
              </div>

              <div className="bg-plaster rounded-[10px] p-6 grid grid-cols-2 gap-4">
                {[
                  ["verified_user",    "Güvenli Ödeme"],
                  ["local_shipping",   "Hızlı Kargo"],
                  ["workspace_premium","Almanya'da Üretildi"],
                  ["keyboard_return",  "14 Gün İade"],
                ].map(([icon, label]) => (
                  <div key={label} className="flex flex-col items-center text-center gap-2">
                    <span className="material-symbols-outlined text-cobalt text-3xl">{icon}</span>
                    <p className="text-[10px] uppercase text-secondary tracking-[0.12em]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function isSupplementItem(size: string) {
  return !["S", "M", "L", "XL", "XXL"].includes(size);
}
