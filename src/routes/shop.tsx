import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { products } from "@/data/products";

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
      <Nav cartCount={2} />
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
              <Link to="/product/$id" params={{ id: p.id }} key={p.id} className="group flex flex-col bg-surface-container steel-bevel relative overflow-hidden">
                {p.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-primary text-on-primary px-3 py-1 text-[12px] font-semibold uppercase tracking-widest">{p.badge}</span>
                  </div>
                )}
                <div className="aspect-[4/5] overflow-hidden bg-surface-container-highest relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                  <button className="absolute bottom-4 right-4 bg-primary text-on-primary w-12 h-12 flex items-center justify-center translate-y-16 group-hover:translate-y-0 transition-transform duration-300" aria-label="Add to cart">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_shopping_cart</span>
                  </button>
                </div>
                <div className="p-gutter space-y-2">
                  <p className="text-[12px] text-outline uppercase tracking-widest">{p.categoryLabel}</p>
                  <h3 className="font-headline text-[24px] text-primary uppercase">{p.name}</h3>
                  <p className="text-[16px] text-secondary-fixed-dim">{p.price.toFixed(2)} €</p>
                </div>
              </Link>
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
