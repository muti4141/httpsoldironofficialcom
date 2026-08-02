import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/checkout/return")({
  head: () => ({ meta: [{ title: "Sipariş Onaylandı — OLD IRON" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
    order_id: typeof search.order_id === "string" ? search.order_id : undefined,
  }),
  component: CheckoutReturn,
});

function CheckoutReturn() {
  const { order_id } = Route.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    if (order_id) {
      const t = setTimeout(() => navigate({ to: "/order/$id", params: { id: order_id } }), 1500);
      return () => clearTimeout(t);
    }
  }, [order_id, navigate]);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />
      <main className="pt-[120px] pb-[80px] px-[20px] md:px-[72px] max-w-[800px] mx-auto text-center">
        <div className="w-14 h-14 bg-cobalt rounded-full flex items-center justify-center mx-auto mb-6 mt-12">
          <span className="material-symbols-outlined text-white text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
        </div>
        <h1 className="text-[40px] md:text-[52px] font-bold tracking-[-0.04em] text-foreground leading-none">Ödeme Alındı</h1>
        <p className="text-secondary mt-4 text-[16px]">Siparişin işleme alındı.</p>
        {order_id ? (
          <p className="text-secondary mt-2 text-[14px]">Sipariş sayfana yönlendiriliyorsun…</p>
        ) : (
          <Link to="/account" className="mt-8 inline-flex btn-primary text-[15px]">
            Hesabıma Git
          </Link>
        )}
      </main>
      <Footer />
    </div>
  );
}
