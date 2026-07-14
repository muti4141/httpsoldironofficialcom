import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/order/$id")({
  head: () => ({ meta: [{ title: "Bestellung — OLD IRON" }] }),
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/auth", search: { mode: "login", redirect: location.href } });
    }
  },
  component: OrderPage,
});

type Order = {
  id: string;
  email: string;
  full_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_zip: string;
  shipping_country: string;
  subtotal_cents: number;
  tax_cents: number;
  shipping_cents: number;
  total_cents: number;
  currency: string;
  status: string;
  created_at: string;
};
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

function OrderPage() {
  const { id } = Route.useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { setLoading(false); return; }
      const [{ data: o }, { data: it }] = await Promise.all([
        supabase.from("orders").select("*").eq("id", id).eq("user_id", userData.user.id).maybeSingle(),
        supabase.from("order_items").select("*").eq("order_id", id),
      ]);
      setOrder(o as Order | null);
      setItems((it as Item[]) ?? []);
      setLoading(false);
    })();
  }, [id]);

  const fmt = (c: number) => `${(c / 100).toFixed(2)} €`;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />
      <main className="pt-[120px] pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto">
        {loading ? (
          <p className="text-secondary">Wird geladen...</p>
        ) : !order ? (
          <div className="bg-surface-container-low p-12 text-center steel-bevel">
            <p className="text-secondary mb-6">Bestellung nicht gefunden.</p>
            <Link to="/account" className="underline text-primary">Zu meinem Konto</Link>
          </div>
        ) : (
          <>
            <header className="mb-stack-md">
              <p className="text-[14px] uppercase tracking-widest text-outline">Bestellung bestätigt</p>
              <h1 className="font-display text-[48px] md:text-[56px] uppercase tracking-tight text-primary leading-none mt-2">
                Danke, {order.full_name.split(" ")[0]}.
              </h1>
              <p className="text-secondary mt-2">
                Bestellnummer: <span className="text-primary font-mono">#{order.id.slice(0, 8).toUpperCase()}</span>
              </p>
            </header>

            <section className="bg-surface-container-low border border-outline-variant/30 p-gutter mb-stack-sm">
              <h2 className="font-headline text-[20px] uppercase text-primary mb-4">Artikel</h2>
              <div className="space-y-4">
                {items.map((it) => (
                  <div key={it.id} className="flex gap-4 items-center border-b border-outline-variant/20 pb-4 last:border-0">
                    {it.product_image && (
                      <img src={it.product_image} alt={it.product_name} className="w-16 h-20 object-cover grayscale brightness-75" />
                    )}
                    <div className="flex-grow">
                      <p className="text-primary font-headline uppercase">{it.product_name}</p>
                      <p className="text-[12px] text-outline uppercase tracking-widest">
                        Größe {it.size} · {it.quantity}×
                      </p>
                    </div>
                    <span className="text-primary font-headline">{fmt(it.line_total_cents)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-surface-container-low border border-outline-variant/30 p-gutter mb-stack-sm space-y-2 text-[14px] text-secondary">
              <div className="flex justify-between"><span>Zwischensumme</span><span>{fmt(order.subtotal_cents)}</span></div>
              <div className="flex justify-between"><span>Versand</span><span>{order.shipping_cents === 0 ? "Kostenlos" : fmt(order.shipping_cents)}</span></div>
              <div className="flex justify-between pt-3 border-t border-outline-variant/30 text-primary font-bold">
                <span className="uppercase tracking-widest">Gesamt</span>
                <span className="text-xl">{fmt(order.total_cents)}</span>
              </div>
              <p className="text-[10px] text-outline italic">inkl. MwSt. ({fmt(order.tax_cents)})</p>
            </section>

            <section className="bg-surface-container-low border border-outline-variant/30 p-gutter mb-stack-sm">
              <h2 className="font-headline text-[20px] uppercase text-primary mb-4">Lieferadresse</h2>
              <p className="text-secondary leading-relaxed">
                {order.full_name}<br />
                {order.shipping_address}<br />
                {order.shipping_zip} {order.shipping_city}<br />
                {order.shipping_country}
              </p>
            </section>

            <div className="flex gap-4">
              <Link to="/account" className="flex-1 text-center bg-surface-container-highest text-primary font-headline text-[18px] py-4 uppercase tracking-widest hover:brightness-110">
                Mein Konto
              </Link>
              <Link to="/shop" className="flex-1 text-center bg-primary-container text-on-secondary-fixed font-headline text-[18px] py-4 uppercase tracking-widest hover:brightness-110">
                Weiter shoppen
              </Link>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
