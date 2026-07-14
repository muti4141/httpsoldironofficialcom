import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/checkout/return")({
  head: () => ({ meta: [{ title: "Bestellung bestätigt — OLD IRON" }] }),
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
      <main className="pt-stack-lg pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-[800px] mx-auto text-center">
        <h1 className="font-display text-[56px] uppercase tracking-tight text-primary mt-12">Zahlung eingegangen</h1>
        <p className="text-secondary mt-4">Deine Bestellung wird verarbeitet.</p>
        {order_id ? (
          <p className="text-outline mt-2 text-sm">Du wirst zu deiner Bestellung weitergeleitet…</p>
        ) : (
          <Link to="/account" className="mt-8 inline-block bg-primary-container text-on-secondary-fixed font-headline text-[20px] px-8 py-3 uppercase tracking-widest">
            Zu meinem Konto
          </Link>
        )}
      </main>
      <Footer />
    </div>
  );
}
