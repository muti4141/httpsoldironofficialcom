import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { products, type Product } from "@/data/products";
import { useCart } from "@/stores/cart";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — OLD IRON | Alle Kollektionen" },
      { name: "description", content: "Alle OLD IRON Kollektionen. Heavy Cotton Tees, Stringers, Shorts, Hoodies und Accessoires." },
    ],
  }),
  component: Shop,
});

function Shop() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />
      <main className="pt-[100px] max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        <header className="mb-stack-lg">
          <h1 className="font-display text-[56px] md:text-[64px] uppercase tracking-tight text-primary leading-none">
            Alle Kollektionen
          </h1>
          <p className="text-[18px] text-secondary-fixed-dim max-w-xl border-l-2 border-primary-container pl-4 mt-4">
            Ausrüstung für Grenzgänger. Geschmiedet für die, die keine Entschuldigungen kennen.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Filters */}
          <aside className="md:col-span-3 space-y-stack-md md:sticky md:top-32 h-fit">
            <div className="border-b border-outline-variant/30 pb-stack-sm">
              <h3 className="font-headline text-[24px] text-primary uppercase mb-stack-sm">Filter</h3>
            </div>
            <FilterGroup label="Kategorie">
              {["Oversized Tees", "Stringers", "Shorts", "Accessoires"].map((c, i) => (
                <label key={c} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" defaultChecked={i === 1} className="w-4 h-4 bg-surface-container border-outline text-primary focus:ring-primary" />
                  <span className="text-[16px] text-on-surface-variant group-hover:text-primary transition-colors">{c}</span>
                </label>
              ))}
            </FilterGroup>
            <FilterGroup label="Größe">
              <div className="grid grid-cols-4 gap-2">
                {["S", "M", "L", "XL"].map((s) => (
                  <button key={s} className={`py-2 border text-center text-[12px] font-semibold uppercase tracking-widest transition-colors ${s === "M" ? "border-primary bg-primary text-on-primary" : "border-outline-variant hover:border-primary"}`}>{s}</button>
                ))}
              </div>
            </FilterGroup>
            <FilterGroup label="Farbe">
              <div className="flex gap-3">
                {["#000000", "#1A1A1A", "#353535", "#e3e2e2"].map((c, i) => (
                  <button key={c} style={{ background: c }} className={`w-8 h-8 rounded-full border border-outline cursor-pointer transition-all ${i === 0 ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:ring-1 hover:ring-outline"}`} />
                ))}
              </div>
            </FilterGroup>
            <FilterGroup label="Preis">
              <input type="range" className="w-full accent-primary bg-surface-container h-1.5 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between text-[12px] text-outline mt-1">
                <span>0€</span>
                <span>150€</span>
              </div>
            </FilterGroup>
          </aside>

          {/* Product Grid */}
          <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        <section className="mt-stack-lg pt-stack-lg border-t border-outline-variant/30">
          <div className="max-w-3xl">
            <h2 className="font-headline text-[24px] text-primary uppercase mb-stack-sm">Elite Gym Wear aus Deutschland</h2>
            <p className="text-[16px] text-on-surface-variant leading-relaxed">
              OLD IRON steht für kompromisslose Qualität und zeitloses Design. Unsere Kollektionen werden in Deutschland konzipiert, um den extremen Belastungen des professionellen Bodybuildings und Kraftsports standzuhalten. Wir verwenden ausschließlich schwere, langlebige Stoffe und setzen auf minimalistische Schnitte, die den Fokus auf das Wesentliche lenken: Deine Leistung.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-[14px] font-semibold text-secondary uppercase tracking-widest">{label}</h4>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
