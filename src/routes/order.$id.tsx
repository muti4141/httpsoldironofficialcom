import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/order/$id")({
  head: () => ({ meta: [{ title: "Sipariş — OLD IRON" }] }),
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/auth", search: { mode: "login", redirect: location.pathname + location.search } });
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
      const [{ data: o }, { data: it }] = await Promise.all([
        supabase.from("orders").select("*").eq("id", id).maybeSingle(),
        supabase.from("order_items").select("*").eq("order_id", id),
      ]);
      setOrder(o as Order | null);
      setItems((it as Item[]) ?? []);
      setLoading(false);
    })();
  }, [id]);

  const fmt = (c: number) => `${(c / 100).toFixed(2)} ₺`;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />
      <main className="pt-[120px] pb-[80px] px-[20px] md:px-[72px] max-w-3xl mx-auto">
        {loading ? (
          <p className="text-secondary">Yükleniyor...</p>
        ) : !order ? (
          <div className="bg-plaster rounded-[10px] p-12 text-center">
            <p className="text-secondary mb-6">Sipariş bulunamadı.</p>
            <Link to="/account" className="underline text-cobalt font-semibold">Hesabıma Dön</Link>
          </div>
        ) : (
          <>
            <header className="mb-10">
              <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-secondary">Sipariş Onaylandı</p>
              <h1 className="text-[40px] md:text-[52px] font-bold tracking-[-0.04em] text-foreground leading-none mt-2">
                Teşekkürler, {order.full_name.split(" ")[0]}.
              </h1>
              <p className="text-secondary mt-2">
                Sipariş no: <span className="text-foreground font-mono font-bold">#{order.id.slice(0, 8).toUpperCase()}</span>
              </p>
            </header>

            <section className="bg-plaster rounded-[10px] p-6 mb-4">
              <h2 className="text-[16px] font-bold text-foreground mb-4 tracking-[-0.02em]">Ürünler</h2>
              <div className="space-y-4">
                {items.map((it) => (
                  <div key={it.id} className="flex gap-4 items-center border-b border-outline-variant pb-4 last:border-0">
                    {it.product_image && (
                      <img src={it.product_image} alt={it.product_name} className="w-16 h-20 object-cover rounded-[6px]" />
                    )}
                    <div className="flex-grow">
                      <p className="text-foreground font-bold text-[15px] tracking-[-0.01em]">{it.product_name}</p>
                      <p className="text-[12px] text-secondary mt-0.5">
                        Beden: {it.size} · {it.quantity} adet
                      </p>
                    </div>
                    <span className="text-foreground font-mono font-bold">{fmt(it.line_total_cents)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-plaster rounded-[10px] p-6 mb-4 space-y-2 text-[14px] text-secondary">
              <div className="flex justify-between"><span>Ara Toplam</span><span>{fmt(order.subtotal_cents)}</span></div>
              <div className="flex justify-between"><span>Kargo</span><span>{order.shipping_cents === 0 ? "Ücretsiz" : fmt(order.shipping_cents)}</span></div>
              <div className="flex justify-between pt-3 border-t border-outline-variant text-foreground font-bold">
                <span className="text-[15px]">Toplam</span>
                <span className="text-[18px] font-mono">{fmt(order.total_cents)}</span>
              </div>
              <p className="text-[11px] text-secondary">%20 KDV dahil ({fmt(order.tax_cents)})</p>
            </section>

            <section className="bg-plaster rounded-[10px] p-6 mb-6">
              <h2 className="text-[16px] font-bold text-foreground mb-4 tracking-[-0.02em]">Teslimat Adresi</h2>
              <p className="text-secondary leading-relaxed text-[14px]">
                {order.full_name}<br />
                {order.shipping_address}<br />
                {order.shipping_zip} {order.shipping_city}<br />
                {order.shipping_country}
              </p>
            </section>

            <div className="flex gap-3">
              <Link to="/account" className="flex-1 text-center btn-secondary text-[14px] py-4">
                Hesabım
              </Link>
              <Link to="/shop" className="flex-1 text-center btn-primary text-[14px] py-4">
                Alışverişe Devam
              </Link>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
