import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductVideo } from "@/components/ProductVideo";
import { products, type Product, APPAREL_PLACEHOLDER, SUPPLEMENT_PLACEHOLDER } from "@/data/products";
import { useCart } from "@/stores/cart";
import { useState } from "react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Mağaza — OLD IRON | Spor Giyim & Supplement" },
      { name: "description", content: "Premium Spor Giyim ve Supplement. Oversize Tee, Stringer, Şort, Protein, Kreatin ve daha fazlası." },
    ],
  }),
  component: Shop,
});

const APPAREL_CATEGORIES = [
  { value: "tops",        label: "Üst Giyim" },
  { value: "bottoms",     label: "Alt Giyim" },
  { value: "accessories", label: "Aksesuar" },
];

const SUPPLEMENT_CATEGORIES = [
  { value: "protein",     label: "Protein" },
  { value: "creatine",    label: "Kreatin" },
  { value: "preworkout",  label: "Pre-Workout" },
  { value: "aminoacids",  label: "Amino Asit" },
  { value: "thermo",      label: "Thermo & Enerji" },
  { value: "carbs",       label: "Pirinç Unu" },
];

type Tab = "all" | "apparel" | "supplement";

function Shop() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filtered = products
    .filter((p) => {
      if (activeTab === "apparel"    && p.type !== "apparel")    return false;
      if (activeTab === "supplement" && p.type !== "supplement") return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (p.price > maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc")  return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  const currentCategories =
    activeTab === "supplement" ? SUPPLEMENT_CATEGORIES :
    activeTab === "apparel"    ? APPAREL_CATEGORIES :
    [...APPAREL_CATEGORIES, ...SUPPLEMENT_CATEGORIES];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />
      <main className="pt-[80px]">

        {/* Header */}
        <div className="bg-surface-container-low border-b border-outline-variant/20 py-10 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-[1440px] mx-auto">
            <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] uppercase text-primary leading-none mb-3">Mağaza</h1>
            <p className="text-[16px] text-secondary border-l-2 border-accent-warm pl-4 max-w-xl">
              Premium Spor Giyim & Supplement. Sınırları zorlayanlara yönelik ekipman.
            </p>

            {/* Tabs */}
            <div className="flex gap-2 mt-8 flex-wrap">
              {(["all", "apparel", "supplement"] as Tab[]).map((tab) => (
                <button key={tab}
                  onClick={() => { setActiveTab(tab); setSelectedCategories([]); }}
                  className={`px-6 py-2.5 text-[12px] font-semibold uppercase tracking-widest transition-all cursor-pointer border ${
                    activeTab === tab
                      ? "bg-accent-warm text-on-primary-container border-accent-warm"
                      : "border-outline-variant text-secondary hover:text-primary hover:border-primary/50"
                  }`}>
                  {tab === "all" ? "Tümü" : tab === "apparel" ? "Spor Giyim" : "Supplement"}
                  <span className="ml-2 opacity-60">
                    ({tab === "all" ? products.length : products.filter((p) => p.type === tab).length})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">

            {/* Filtreler */}
            <aside className="md:col-span-3 space-y-8 md:sticky md:top-28 h-fit">

              <div className="space-y-3">
                <h4 className="text-[12px] font-semibold text-secondary uppercase tracking-widest">Sırala</h4>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full bg-surface-container border border-outline-variant text-[13px] text-primary px-3 py-2.5 focus:border-accent-warm focus:outline-none uppercase tracking-widest cursor-pointer"
                  aria-label="Sıralama">
                  <option value="default">Varsayılan</option>
                  <option value="price-asc">Fiyat: Artan</option>
                  <option value="price-desc">Fiyat: Azalan</option>
                </select>
              </div>

              <div className="space-y-3">
                <h4 className="text-[12px] font-semibold text-secondary uppercase tracking-widest">Kategori</h4>
                <div className="flex flex-col gap-2">
                  {currentCategories.map((c) => (
                    <label key={c.value} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={selectedCategories.includes(c.value)} onChange={() => toggleCategory(c.value)}
                        className="w-4 h-4 bg-surface-container border-outline-variant accent-accent-warm cursor-pointer" />
                      <span className="text-[14px] text-secondary group-hover:text-primary transition-colors">{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[12px] font-semibold text-secondary uppercase tracking-widest">Maks. Fiyat</h4>
                <input type="range" min={100} max={2000} step={50} value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-accent-warm bg-surface-container h-1.5 rounded-lg appearance-none cursor-pointer"
                  aria-label="Maksimum fiyat" />
                <div className="flex justify-between text-[12px] text-outline">
                  <span>₺100</span>
                  <span className="text-primary font-semibold">₺{maxPrice}</span>
                </div>
              </div>

              {(selectedCategories.length > 0 || maxPrice < 2000) && (
                <button onClick={() => { setSelectedCategories([]); setMaxPrice(2000); }}
                  className="text-[12px] uppercase tracking-widest text-accent-warm hover:text-primary transition-colors border-b border-accent-warm/40 pb-0.5 cursor-pointer">
                  Filtreleri Temizle
                </button>
              )}
            </aside>

            {/* Ürün Izgarası */}
            <div className="md:col-span-9">
              <p className="text-[12px] text-outline uppercase tracking-widest mb-6">{filtered.length} Ürün</p>
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <span className="material-symbols-outlined text-[48px] text-outline/40 mb-4 block">search_off</span>
                  <p className="text-secondary uppercase tracking-widest text-[14px]">Ürün bulunamadı</p>
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
              <h2 className="font-headline text-[22px] text-primary uppercase mb-4">Türkiye'nin Elite Spor Giyim & Supplement Markası</h2>
              <p className="text-[15px] text-on-surface-variant leading-relaxed">
                OLD IRON, premium spor giyim ve yüksek kaliteli supplementleri tek çatı altında sunuyor. Giyimlerimiz 300gsm
                pamuktan üretilir — uzlaşma tanımayan sporcular için tasarlanmıştır. Supplementlerimiz dolgu maddesi içermez,
                lab testlidir ve maksimum etken madde konsantrasyonu sunar. Disiplinden dövülmüş — elit için.
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
  const isSupp = p.type === "supplement";
  const imageSrc = p.id === "bcaa-4001"
    ? "/__l5e/assets-v1/d9b7bf9b-7d6f-4330-9794-16a9b21f03f8/bcaa-411.png"
    : p.image;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(p, isSupp ? "Standart" : "M");
    toast.success(`${p.name} sepete eklendi`, { duration: 2000 });
  };

  return (
    <Link to="/product/$id" params={{ id: p.id }}
      className={`group flex flex-col relative overflow-hidden cursor-pointer ${isSupp ? "supplement-card-glow orange-bevel" : "steel-bevel"} bg-surface-container`}>
      {p.badge && (
        <div className="absolute top-4 left-4 z-10">
          <span className={`text-[11px] font-semibold uppercase tracking-widest px-3 py-1 ${isSupp ? "bg-accent-warm pulse-glow text-on-primary-container" : "bg-primary text-on-primary"}`}>
            {p.badge}
          </span>
        </div>
      )}

      <div className="aspect-[4/5] overflow-hidden bg-surface-container-highest relative">
        {p.video ? (
          <ProductVideo src={p.video} poster={p.videoPoster} alt={p.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : imageSrc ? (
          <img src={imageSrc} alt={p.name} loading={p.id === "bcaa-4001" ? "eager" : "lazy"}
            onError={(e) => { e.currentTarget.src = isSupp ? SUPPLEMENT_PLACEHOLDER : APPAREL_PLACEHOLDER; }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest flex items-center justify-center relative">
            <div className="absolute inset-0 grain-overlay opacity-40" />
            <p className="font-headline text-[28px] text-primary/30 uppercase tracking-widest text-center px-4">{p.name}</p>
          </div>
        )}
        <button onClick={handleQuickAdd}
          className={`absolute bottom-4 right-4 w-11 h-11 flex items-center justify-center translate-y-16 group-hover:translate-y-0 transition-transform duration-300 hover:brightness-110 cursor-pointer ${isSupp ? "bg-accent-warm text-on-primary-container" : "bg-primary text-on-primary"}`}
          aria-label={`${p.name} sepete ekle`}>
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_shopping_cart</span>
        </button>
      </div>

      <div className="p-5 space-y-1.5">
        <div className="flex items-center justify-between">
          <p className={`text-[11px] uppercase tracking-widest ${isSupp ? "text-accent-warm-soft" : "text-outline"}`}>{p.categoryLabel}</p>
          {isSupp && p.servings && <p className="text-[10px] text-outline uppercase">{p.servings} porsiyon</p>}
        </div>
        <h3 className="font-headline text-[22px] text-primary uppercase leading-tight">{p.name}</h3>
        <p className="text-[13px] text-secondary">{p.subtitle}</p>
        <div className="flex items-center gap-3 pt-1">
          <p className={`text-[15px] font-semibold ${isSupp ? "text-accent-warm" : "text-primary"}`}>₺{p.price.toFixed(2)}</p>
          {p.originalPrice && (
            <>
              <p className="text-[13px] text-outline line-through">₺{p.originalPrice.toFixed(2)}</p>
              <span className="bg-accent-warm/20 text-accent-warm text-[10px] font-semibold uppercase px-1.5 py-0.5">
                -%{Math.round((1 - p.price / p.originalPrice) * 100)}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
