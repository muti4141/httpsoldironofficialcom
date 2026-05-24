import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Warenkorb — OLD IRON" },
      { name: "description", content: "Dein OLD IRON Warenkorb. Sicherer Checkout, kostenloser Versand ab 75€." },
    ],
  }),
  component: CartPage,
});

type CartItem = { id: string; name: string; variant: string; size: string; price: number; qty: number; image: string };

const initial: CartItem[] = [
  {
    id: "1",
    name: "Heavy Iron Tee",
    variant: "Stahlgrau / Oversized Fit",
    size: "XL",
    price: 59,
    qty: 1,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoTAC8o7MKTs-OW-UW7azG00vyGEtE5Wvca5fnC9M2CqtGt71OPLq8qWO2LOhBP9NvMypO2gL2Nqv-w-KApq0kRFs3lWNkJcU5dbvej6HPGGHv9RsG83VehacbOzTePbrpAWchcij9p8u84iIJ0lnB4grDySWYrYXODQGN1iiFk50GgMGQ2m32407CT3tWdyNa7PX-dq9KwyfdL4UQmdZ40jYyJIoMPpodiQKDIVZQC_E4s4KZ2jBNE0sSDjaMbB1WyjvMe8lJS6E",
  },
  {
    id: "2",
    name: "Iron Core Belt",
    variant: "Echtes Leder / Titan Finish",
    size: "L",
    price: 89,
    qty: 1,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmH1DJ-eVn4ngaUYYRawJlhH59iHJHaMqw5cQozkC9sUyIu4O-T9kwOTfgqDZO85xugzfLZey14aUIjTHOFjO3ti1hnCBkJkarpDM3iL-C6eIqNBoyUqdYkZpWcGuamAI9Q8GYZyQG0XqzIqJE68rMxDKDTXF5YJdz1vTZ3tJ8tfOdoDntK4d5B_gD8ER5AmrDrqYdNL-sJAQC19j60_snz0OJ1WXo4x8W4o3oETqEOW_aEy0C1gd0CMqUmdBTCs7BppcWLFmVY_k",
  },
];

function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initial);
  const [terms, setTerms] = useState(false);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.19;

  const update = (id: string, delta: number) =>
    setItems((arr) => arr.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it)));
  const remove = (id: string) => setItems((arr) => arr.filter((it) => it.id !== id));

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav cartCount={items.length} />
      <main className="pt-stack-lg pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <header className="mb-stack-md pt-8">
          <h1 className="font-display text-[56px] md:text-[64px] uppercase tracking-tight text-primary leading-none">Warenkorb</h1>
          <p className="text-[14px] font-semibold uppercase tracking-widest text-outline mt-2">Präzision in jeder Naht.</p>
        </header>

        {items.length === 0 ? (
          <div className="bg-surface-container-low p-12 text-center steel-bevel">
            <p className="text-[18px] text-secondary mb-6">Dein Warenkorb ist leer.</p>
            <a href="/shop" className="inline-block bg-primary-container text-on-secondary-fixed font-headline text-[20px] px-8 py-3 uppercase tracking-widest hover:brightness-110">
              Weiter Shoppen
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-md">
            <div className="lg:col-span-8 space-y-gutter">
              {items.map((item) => (
                <div key={item.id} className="bg-surface-container-low steel-bevel p-6 flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-32 h-40 bg-surface-container-highest overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale brightness-75" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between h-full py-2 w-full">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-headline text-[24px] uppercase text-primary">{item.name}</h3>
                        <span className="font-headline text-[24px] text-primary whitespace-nowrap">{(item.price * item.qty).toFixed(2)} €</span>
                      </div>
                      <p className="text-secondary text-[12px] uppercase tracking-widest mt-1">{item.variant}</p>
                      <div className="flex gap-4 mt-4 items-center">
                        <div className="bg-surface-container-highest px-3 py-1 text-[12px] uppercase">Größe: {item.size}</div>
                        <div className="flex items-center gap-3 border border-outline-variant px-3 py-1">
                          <button onClick={() => update(item.id, -1)} className="text-outline hover:text-primary">−</button>
                          <span className="text-[14px] font-semibold w-4 text-center">{item.qty}</span>
                          <button onClick={() => update(item.id, 1)} className="text-outline hover:text-primary">+</button>
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
                  <div className="flex justify-between"><span>Versandkosten</span><span>Kostenlos</span></div>
                  <div className="flex justify-between pt-4 text-primary font-bold">
                    <span className="uppercase tracking-widest">Gesamtsumme</span>
                    <span className="text-xl">{subtotal.toFixed(2)} €</span>
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
                    disabled={!terms}
                    className="w-full bg-primary-container text-on-secondary-fixed font-headline text-[24px] py-4 hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Sicher zur Kasse
                  </button>
                  <div className="relative py-2 flex items-center gap-3">
                    <div className="flex-grow h-px bg-outline-variant/30" />
                    <span className="text-[10px] uppercase text-outline tracking-widest">Express Checkout</span>
                    <div className="flex-grow h-px bg-outline-variant/30" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-black border border-outline-variant p-3 flex justify-center items-center hover:bg-surface-bright transition-colors">
                      <span className="text-[14px] font-semibold text-white">Apple Pay</span>
                    </button>
                    <button className="bg-[#0070BA] p-3 flex justify-center items-center hover:opacity-90 transition-opacity">
                      <span className="text-[14px] font-semibold text-white">PayPal</span>
                    </button>
                  </div>
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
