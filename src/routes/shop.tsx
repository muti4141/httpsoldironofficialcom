import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductPlate } from "@/components/ProductPlate";
import { products, type Product } from "@/data/products";
import { useCart } from "@/stores/cart";

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
];

type Tab = "all" | "apparel" | "supplement";

/* ── Rozet metni her zaman Türkçe ──────────────────────────────────── */
function badgeLabel(badge?: string) {
  if (!badge) return null;
  const b = badge.toLocaleLowerCase("tr");
  if (b.includes("yeni")) return "YENİ";
  return "ÇOK SATAN";
}

/* ── Reveal hook (index.tsx ile aynı desen) ─────────────────────────── */
function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.06, rootMargin: "0px 0px -50px 0px" }
    );
    document
      .querySelectorAll(
        ".reveal,.reveal-left,.reveal-right,.reveal-scale,.reveal-wipe,.reveal-blur,.press-item"
      )
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* ── Pill kontrol ───────────────────────────────────────────────────── */
function pillStyle(active: boolean): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 18px",
    borderRadius: "30px",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "-0.04em",
    lineHeight: 1.2,
    border: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
    background: active ? "#000aff" : "#ecedee",
    color: active ? "#ffffff" : "#111111",
    transition: "background 0.25s ease, color 0.25s ease, transform 0.25s cubic-bezier(0.22,1,0.36,1)",
  };
}

function Shop() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");
  const [query, setQuery] = useState("");

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const q = query.trim().toLocaleLowerCase("tr");

  const filtered = products
    .filter((p) => {
      if (activeTab === "apparel"    && p.type !== "apparel")    return false;
      if (activeTab === "supplement" && p.type !== "supplement") return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (p.price > maxPrice) return false;
      if (q && !`${p.name} ${p.subtitle} ${p.categoryLabel}`.toLocaleLowerCase("tr").includes(q)) return false;
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

  const hasFilters = selectedCategories.length > 0 || maxPrice < 2000 || q.length > 0;

  useReveal([filtered.length, activeTab, sortBy]);

  return (
    <div style={{ background: "#ffffff", color: "#111111", minHeight: "100vh", overflowX: "hidden" }}>
      <div className="announcement-bar">
        <span>1500₺ üzeri ücretsiz kargo · Almanya kalitesi · Lab onaylı</span>
      </div>

      <Nav />

      <main style={{ paddingTop: "104px" }}>

        {/* ══════════════════════════════════════════════════════════
            1. BAŞLIK BANDI
        ══════════════════════════════════════════════════════════ */}
        <section style={{ background: "#ecedee", padding: "72px 0 56px" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 20px" }}>
            <div className="shop-inner">
              <div className="reveal-wipe">
                <p className="text-eyebrow" style={{ marginBottom: "8px" }}>Koleksiyon</p>
                <h1
                  style={{
                    fontSize: "clamp(40px,7vw,64px)",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.0,
                    color: "#111111",
                    textTransform: "lowercase",
                  }}
                >
                  mağaza
                </h1>
              </div>

              <p
                className="reveal"
                style={{
                  fontSize: "16px",
                  color: "#737780",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.5,
                  maxWidth: "480px",
                  marginTop: "16px",
                }}
              >
                Premium spor giyim & supplement. Sınırları zorlayanlara yönelik ekipman.
              </p>

              {/* Sekmeler — pill */}
              <div
                className="reveal"
                style={{ display: "flex", gap: "8px", marginTop: "32px", flexWrap: "wrap" }}
              >
                {(["all", "apparel", "supplement"] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setSelectedCategories([]); }}
                    style={pillStyle(activeTab === tab)}
                  >
                    {tab === "all" ? "Tümü" : tab === "apparel" ? "Spor Giyim" : "Supplement"}
                    <span
                      className="font-mono"
                      style={{ fontSize: "11px", letterSpacing: 0, opacity: 0.6 }}
                    >
                      {tab === "all" ? products.length : products.filter((p) => p.type === tab).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            2. FİLTRE + IZGARA
        ══════════════════════════════════════════════════════════ */}
        <section style={{ background: "#ffffff", padding: "56px 0 80px" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 20px" }}>
            <div className="shop-inner">

              {/* Filtre çubuğu */}
              <div
                className="reveal"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  paddingBottom: "28px",
                  borderBottom: "1px solid #d7d7d7",
                  marginBottom: "32px",
                }}
              >
                {/* Arama + sıralama */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ürün ara"
                    aria-label="Ürün ara"
                    style={{
                      flex: "1 1 240px",
                      minWidth: "200px",
                      background: "#ecedee",
                      border: "none",
                      borderRadius: "30px",
                      padding: "11px 20px",
                      fontSize: "13px",
                      color: "#111111",
                      letterSpacing: "-0.04em",
                      outline: "none",
                    }}
                  />
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {([
                      { value: "default",    label: "Varsayılan" },
                      { value: "price-asc",  label: "Fiyat: Artan" },
                      { value: "price-desc", label: "Fiyat: Azalan" },
                    ] as const).map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setSortBy(s.value)}
                        style={pillStyle(sortBy === s.value)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kategoriler */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <span
                    className="text-eyebrow"
                    style={{ marginRight: "4px" }}
                  >
                    Kategori
                  </span>
                  {currentCategories.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => toggleCategory(c.value)}
                      aria-pressed={selectedCategories.includes(c.value)}
                      style={pillStyle(selectedCategories.includes(c.value))}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Fiyat + temizle */}
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: "1 1 280px" }}>
                    <span className="text-eyebrow" style={{ whiteSpace: "nowrap" }}>Maks. Fiyat</span>
                    <input
                      type="range"
                      min={100}
                      max={2000}
                      step={50}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      aria-label="Maksimum fiyat"
                      style={{
                        flex: 1,
                        minWidth: "140px",
                        accentColor: "#000aff",
                        height: "3px",
                        cursor: "pointer",
                      }}
                    />
                    <span className="text-price" style={{ whiteSpace: "nowrap" }}>₺{maxPrice.toFixed(2)}</span>
                  </div>

                  {hasFilters && (
                    <button
                      onClick={() => { setSelectedCategories([]); setMaxPrice(2000); setQuery(""); }}
                      className="link-underline"
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        letterSpacing: "-0.04em",
                        color: "#000aff",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                      }}
                    >
                      Filtreleri Temizle
                    </button>
                  )}
                </div>
              </div>

              {/* Sonuç sayısı */}
              <p className="text-brand-credit" style={{ marginBottom: "24px" }}>
                {filtered.length} ürün
              </p>

              {/* Izgara */}
              {filtered.length === 0 ? (
                <div
                  className="reveal"
                  style={{
                    background: "#ecedee",
                    borderRadius: "10px",
                    padding: "80px 24px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "20px",
                      fontWeight: 600,
                      letterSpacing: "-0.04em",
                      color: "#111111",
                      marginBottom: "8px",
                    }}
                  >
                    Ürün bulunamadı
                  </p>
                  <p style={{ fontSize: "13px", color: "#737780", letterSpacing: "-0.04em" }}>
                    Filtreleri değiştirip tekrar dene.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {filtered.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            3. SEO / MARKA METNİ
        ══════════════════════════════════════════════════════════ */}
        <section style={{ background: "#ecedee", padding: "80px 0" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 20px" }}>
            <div className="shop-inner">
              <div className="reveal-wipe" style={{ marginBottom: "24px" }}>
                <p className="text-eyebrow" style={{ marginBottom: "8px" }}>Marka</p>
                <h2
                  style={{
                    fontSize: "clamp(32px,4vw,40px)",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.0,
                    color: "#111111",
                  }}
                >
                  Türkiye'nin Elit Spor Markası
                </h2>
              </div>
              <p
                className="reveal-right"
                style={{
                  fontSize: "16px",
                  color: "#737780",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.6,
                  maxWidth: "640px",
                }}
              >
                OLD IRON, premium spor giyim ve yüksek kaliteli supplementleri tek çatı altında sunuyor.
                Giyimlerimiz 300 gsm pamuktan üretilir — uzlaşma tanımayan sporcular için tasarlanmıştır.
                Supplementlerimiz dolgu maddesi içermez, lab testlidir ve maksimum etken madde
                konsantrasyonu sunar. Disiplinden dövülmüş — elit için.
              </p>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        @media (min-width: 768px) {
          .shop-inner { padding-left: 52px; padding-right: 52px; }
        }
      `}</style>

      <Footer />
    </div>
  );
}

/* ── Ürün kartı ─────────────────────────────────────────────────────── */
function ProductCard({ product: p, index }: { product: Product; index: number }) {
  const add = useCart((s) => s.add);
  const isSupp = p.type === "supplement";
  const label = badgeLabel(p.badge);

  return (
    <Link
      to="/product/$id"
      params={{ id: p.id }}
      className="product-card reveal-blur"
      style={{
        textDecoration: "none",
        transitionDelay: `${(index % 12) * 60}ms`,
        display: "block",
        background: "#ecedee",
      }}
    >
      {label && (
        <span
          className={`badge ${label === "YENİ" ? "badge-new" : "badge-new-color"}`}
          style={{ position: "absolute", top: "12px", left: "12px", zIndex: 3 }}
        >
          {label}
        </span>
      )}

      <ProductPlate product={p} ratio="4 / 5" />

      <div style={{ marginTop: "16px" }}>
        <p
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#111111",
            letterSpacing: "-0.04em",
            lineHeight: 1.2,
          }}
        >
          {p.name}
        </p>
        <p className="text-brand-credit" style={{ marginTop: "4px" }}>By OLD IRON</p>
        <p
          style={{
            fontSize: "13px",
            color: "#737780",
            letterSpacing: "-0.04em",
            marginTop: "6px",
            lineHeight: 1.4,
          }}
        >
          {p.subtitle}
          {isSupp && p.servings ? ` · ${p.servings} porsiyon` : ""}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
          <span className="text-price">₺{p.price.toFixed(2)}</span>
          {p.originalPrice && (
            <>
              <span className="text-price-strike">₺{p.originalPrice.toFixed(2)}</span>
              <span className="badge badge-new-color" style={{ fontSize: "11px", padding: "2px 8px" }}>
                -%{Math.round((1 - p.price / p.originalPrice) * 100)}
              </span>
            </>
          )}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          add(p, isSupp ? "Standart" : "M");
          toast.success(`${p.name} sepete eklendi`, { duration: 2000 });
        }}
        className="card-add-btn"
        aria-label={`${p.name} sepete ekle`}
      >
        Sepete Ekle
      </button>
    </Link>
  );
}
