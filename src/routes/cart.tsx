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
      { title: "Warenkorb — OLD IRON" },
      { name: "description", content: "Dein OLD IRON Warenkorb. Sicherer Checkout, kostenloser Versand ab 75€." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const updateQty = useCart((s) => s.updateQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const navigate = useNavigate();
  const [terms, setTerms] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [checkoutData, setCheckoutData] = useState<null | {
    orderId: string;
    items: { productId: string; name: string; unitAmountCents: number; quantity: number }[];
    shippingCents: number;
    returnUrl: string;
  }>(null);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.19;
  const shipping = subtotal >= 75 ? 0 : 5.9;
  const total = subtotal + shipping;

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
        toast.error("Bitte hinterlege zuerst deine Lieferadresse.");
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
          shipping_country: profile.shipping_country ?? "DE",
          subtotal_cents: cents(subtotal),
          tax_cents: cents(tax),
          shipping_cents: cents(shipping),
          total_cents: cents(total),
          currency: "EUR",
          status: "pending",
        })
        .select("id")
        .single();
      if (orderErr || !order) throw orderErr ?? new Error("Bestellung fehlgeschlagen.");
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
      const msg = e instanceof Error ? e.message : "Bestellung fehlgeschlagen.";
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />
      <main className="pt-stack-lg pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <header className="mb-stack-md pt-8">
          <h1 className="font-display text-[56px] md:text-[64px] uppercase tracking-tight text-primary leading-none">Warenkorb</h1>
          <p className="text-[14px] font-semibold uppercase tracking-widest text-outline mt-2">Präzision in jeder Naht.</p>
        </header>

        {checkoutData ? (
          <div className="bg-surface-container-low steel-bevel p-6">
            <StripeCartCheckout {...checkoutData} />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-surface-container-low p-12 text-center steel-bevel">
            <p className="text-[18px] text-secondary mb-6">Dein Warenkorb ist leer.</p>
            <Link to="/shop" className="inline-block bg-primary-container text-on-secondary-fixed font-headline text-[20px] px-8 py-3 uppercase tracking-widest hover:brightness-110">
              Weiter Shoppen
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-md">
            <div className="lg:col-span-8 space-y-gutter">
              {items.map((item) => (
                <div key={item.id} className="bg-surface-container-low steel-bevel p-6 flex flex-col sm:flex-row gap-6 items-center">
                  <Link to="/product/$id" params={{ id: item.productId }} className="w-32 h-40 bg-surface-container-highest overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale brightness-75 hover:brightness-100 transition-all" />
                  </Link>
                  <div className="flex-grow flex flex-col justify-between h-full py-2 w-full">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <Link to="/product/$id" params={{ id: item.productId }} className="font-headline text-[24px] uppercase text-primary hover:opacity-80">{item.name}</Link>
                        <span className="font-headline text-[24px] text-primary whitespace-nowrap">{(item.price * item.qty).toFixed(2)} €</span>
                      </div>
                      <p className="text-secondary text-[12px] uppercase tracking-widest mt-1">{item.categoryLabel}</p>
                      <div className="flex gap-4 mt-4 items-center">
                        <div className="bg-surface-container-highest px-3 py-1 text-[12px] uppercase">Größe: {item.size}</div>
                        <div className="flex items-center gap-3 border border-outline-variant px-3 py-1">
                          <button onClick={() => updateQty(item.id, -1)} className="text-outline hover:text-primary">−</button>
                          <span className="text-[14px] font-semibold w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="text-outline hover:text-primary">+</button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => remove(item.id)} className="mt-4 self-start flex items-center gap-2 text-outline hover:text-error transition-colors text-[12px] uppercase">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                      Entfernen
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 space-y-gutter">
              <div className="bg-surface-container p-gutter space-y-6 border border-outline-variant/30">
                <h2 className="font-headline text-[24px] uppercase text-primary">Zusammenfassung</h2>
                <div className="space-y-3 text-[16px] text-secondary border-b border-outline-variant/30 pb-6">
                  <div className="flex justify-between"><span>Zwischensumme</span><span>{subtotal.toFixed(2)} €</span></div>
                  <div className="flex justify-between"><span>Versandkosten</span><span>{shipping === 0 ? "Kostenlos" : `${shipping.toFixed(2)} €`}</span></div>
                  <div className="flex justify-between pt-4 text-primary font-bold">
                    <span className="uppercase tracking-widest">Gesamtsumme</span>
                    <span className="text-xl">{total.toFixed(2)} €</span>
                  </div>
                  <p className="text-[10px] text-outline italic">Inkl. 19% MwSt. ({tax.toFixed(2)} €)</p>
                </div>
                <div className="space-y-4 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input checked={terms} onChange={(e) => setTerms(e.target.checked)} type="checkbox" className="mt-1 bg-surface-container-highest border-outline-variant focus:ring-primary h-4 w-4" />
                    <span className="text-[12px] text-outline leading-tight">
                      Ich habe die <a className="underline text-secondary" href="#">AGB</a> und die <a className="underline text-secondary" href="#">Datenschutzerklärung</a> gelesen und akzeptiere sie.
                    </span>
                  </label>
                  <button
                    onClick={checkout}
                    disabled={!terms || placing}
                    className="w-full bg-primary-container text-on-secondary-fixed font-headline text-[24px] py-4 hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {placing ? "Wird verarbeitet..." : "Sicher zur Kasse"}
                  </button>
                </div>

              </div>
              <div className="bg-surface-container-low p-gutter grid grid-cols-2 gap-4 border border-outline-variant/20">
                {[
                  ["verified_user", "Sicherer Checkout"],
                  ["local_shipping", "CO2 Neutral"],
                  ["workspace_premium", "Made in Germany"],
                  ["keyboard_return", "30 Tage Retoure"],
                ].map(([icon, label]) => (
                  <div key={label} className="flex flex-col items-center text-center gap-2">
                    <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
                    <p className="text-[10px] uppercase text-outline tracking-widest">{label}</p>
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
