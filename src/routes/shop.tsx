import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductVideo } from "@/components/ProductVideo";
import { type Product, APPAREL_PLACEHOLDER } from "@/data/products";
import { useAllProducts } from "@/hooks/useAllProducts";
import { useCart } from "@/stores/cart";
import { useState } from "react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — OLD IRON | Premium Sportbekleidung aus Deutschland" },
      { name: "description", content: "Premium Sportbekleidung. Oversize Tee, Stringer, Shorts und Hoodies. 300 g/m² Heavyweight-Baumwolle. Versand aus Deutschland." },
    ],
  }),
  component: Shop,
});

const APPAREL_CATEGORIES = [
  { value: "tops",        label: "Oberteile" },
  { value: "bottoms",     label: "Hosen & Shorts" },
  { value: "accessories", label: "Accessoires" },
];

function Shop() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(200);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");
  const products = useAllProducts().filter((p) => p.type === "apparel");

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filtered = products
    .filter((p) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (p.price > maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc")  return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />
      <main className="pt-[80px]">

        {/* Header */}
        <div className="bg-surface-container-low border-b border-outline-variant/20 py-10 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-[1440px] mx-auto">
            <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] uppercase text-primary leading-none mb-3">Shop</h1>
            <p className="text-[16px] text-secondary border-l-2 border-accent-warm pl-4 max-w-xl">
              Premium Sportbekleidung. Ausrüstung für alle, die ihre Grenzen verschieben.
            </p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">

            {/* Filter */}
            <aside className="md:col-span-3 space-y-8 md:sticky md:top-28 h-fit">

              <div className="space-y-3">
                <h4 className="text-[12px] font-semibold text-secondary uppercase tracking-widest">Sortieren</h4>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full bg-surface-container border border-outline-variant text-[13px] text-primary px-3 py-2.5 focus:border-accent-warm focus:outline-none uppercase tracking-widest cursor-pointer"
                  aria-label="Sortierung">
                  <option value="default">Standard</option>
                  <option value="price-asc">Preis: aufsteigend</option>
                  <option value="price-desc">Preis: absteigend</option>
                </select>
              </div>

              <div className="space-y-3">
                <h4 className="text-[12px] font-semibold text-secondary uppercase tracking-widest">Kategorie</h4>
                <div className="flex flex-col gap-2">
                  {APPAREL_CATEGORIES.map((c) => (
                    <label key={c.value} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={selectedCategories.includes(c.value)} onChange={() => toggleCategory(c.value)}
                        className="w-4 h-4 bg-surface-container border-outline-variant accent-accent-warm cursor-pointer" />
                      <span className="text-[14px] text-secondary group-hover:text-primary transition-colors">{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[12px] font-semibold text-secondary uppercase tracking-widest">Max. Preis</h4>
                <input type="range" min={10} max={200} step={5} value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-accent-warm bg-surface-container h-1.5 rounded-lg appearance-none cursor-pointer"
                  aria-label="Maximaler Preis" />
                <div className="flex justify-between text-[12px] text-outline">
                  <span>10 €</span>
                  <span className="text-primary font-semibold">{maxPrice} €</span>
                </div>
              </div>

              {(selectedCategories.length > 0 || maxPrice < 200) && (
                <button onClick={() => { setSelectedCategories([]); setMaxPrice(200); }}
                  className="text-[12px] uppercase tracking-widest text-accent-warm hover:text-primary transition-colors border-b border-accent-warm/40 pb-0.5 cursor-pointer">
                  Filter zurücksetzen
                </button>
              )}
            </aside>

            {/* Produkt-Grid */}
            <div className="md:col-span-9">
              <p className="text-[12px] text-outline uppercase tracking-widest mb-6">{filtered.length} Produkte</p>
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <span className="material-symbols-outlined text-[48px] text-outline/40 mb-4 block">search_off</span>
                  <p className="text-secondary uppercase tracking-widest text-[14px]">Keine Produkte gefunden</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
                  {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </div>
          </div>

          <section className="mt-stack-lg pt-stack-lg border-t border-outline-variant/20">
            <div className="max-w-3xl">
              <h2 className="font-headline text-[22px] text-primary uppercase mb-4">Premium Sportbekleidung — kompromisslos gefertigt</h2>
              <p className="text-[15px] text-on-surface-variant leading-relaxed">
                OLD IRON bietet hochwertige Sportbekleidung für Athleten, die keine Kompromisse eingehen.
                Unsere Teile sind aus 300 g/m² Heavyweight-Baumwolle gefertigt und für harte Trainingseinheiten
                gebaut. Preise inkl. gesetzlicher MwSt. Versand aus Deutschland.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ProductCard({ product: p }: { product: Product }) {
  const add = useCart((s) => s.add);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(p, "M");
    toast.success(`${p.name} zum Warenkorb hinzugefügt`, { duration: 2000 });
  };

  return (
    <Link to="/product/$id" params={{ id: p.id }}
      className="group flex flex-col relative overflow-hidden cursor-pointer steel-bevel bg-surface-container">
      {p.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 bg-primary text-on-primary">
            {p.badge}
          </span>
        </div>
      )}

      <div className="overflow-hidden bg-surface-container-highest relative aspect-[4/5]">
        {p.video ? (
          <ProductVideo src={p.video} poster={p.videoPoster} alt={p.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <img src={p.image} alt={p.name} loading="lazy"
            onError={(e) => { e.currentTarget.src = APPAREL_PLACEHOLDER; }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        )}
        <button onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center translate-y-16 group-hover:translate-y-0 transition-transform duration-300 hover:brightness-110 cursor-pointer bg-primary text-on-primary"
          aria-label={`${p.name} in den Warenkorb`}>
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_shopping_cart</span>
        </button>
      </div>

      <div className="space-y-1 p-5">
        <p className="uppercase tracking-widest text-outline text-[11px]">{p.categoryLabel}</p>
        <h3 className="font-headline text-primary uppercase leading-tight text-[22px]">{p.name}</h3>
        <p className="text-secondary text-[13px]">{p.subtitle}</p>
        <div className="flex items-center gap-2 pt-1">
          <p className="font-semibold text-primary text-[15px]">{p.price.toFixed(2)} €</p>
          {p.originalPrice && (
            <>
              <p className="text-outline line-through text-[13px]">{p.originalPrice.toFixed(2)} €</p>
              <span className="bg-accent-warm/20 text-accent-warm font-semibold uppercase px-1.5 py-0.5 text-[10px]">
                -{Math.round((1 - p.price / p.originalPrice) * 100)}%
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
