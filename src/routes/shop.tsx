import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useParallax } from "@/components/SmoothScroll";
import { products, usableVideo, type Product } from "@/data/products";
import { useCart } from "@/stores/cart";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Mağaza — OLD IRON | Premium Spor Giyim" },
      { name: "description", content: "Premium spor giyim. Racerback atlet, oversize tee ve daha fazlası." },
    ],
  }),
  component: Shop,
});

const APPAREL_CATEGORIES = [
  { value: "tops",        label: "Üst Giyim" },
];

const SUPPLEMENT_CATEGORIES: { value: string; label: string }[] = [];

type Tab = "all" | "apparel" | "supplement";

const tl = (n: number) => `₺${n.toFixed(2).replace(".", ",")}`;

function badgeLabel(badge?: string) {
  if (!badge) return null;
  const b = badge.toLocaleLowerCase("tr");
  if (b.includes("yeni")) return "YENİ";
  return "ÇOK SATAN";
}

/* ── Ürün görseli — koyu sahne ─────────────────────────────────────── */
function Visual({ p }: { p: Product }) {
  const video = usableVideo(p);
  return (
    <div className="oi-stage" style={{ background: "#101010" }}>
      {video ? (
        <video
          src={video}
          poster={p.gallery?.[0]}
          autoPlay muted loop playsInline preload="metadata"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : p.gallery?.length ? (
        <img
          src={p.gallery[0]}
          alt={p.name}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <img
          src="/images/logo.png"
          alt=""
          aria-hidden
          style={{ width: "58%", objectFit: "contain", opacity: 0.85 }}
        />
      )}
    </div>
  );
}

/* ── Ürün kartı ────────────────────────────────────────────────────── */
function Card({ p, onAdd }: { p: Product; onAdd: (p: Product) => void }) {
  const label = p.outOfStock ? "TÜKENDİ" : badgeLabel(p.badge);
  return (
    <Link
      to="/product/$id"
      params={{ id: p.id }}
      className="oi-card"
      style={p.outOfStock ? { opacity: 0.6 } : undefined}
    >
      {label && (
        <span
          className={`oi-badge ${label === "YENİ" ? "" : "muted"}`}
          style={{ position: "absolute", top: 14, left: 14, zIndex: 3 }}
        >
          {label}
        </span>
      )}

      <Visual p={p} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
        <span className="oi-chip" aria-hidden>
          <img src="/images/logo.png" alt="" />
        </span>
        <div style={{ minWidth: 0, flexGrow: 1 }}>
          <p style={{
            fontSize: 15, fontWeight: 700, color: "#f4f4f4", letterSpacing: "-0.02em",
            lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {p.name}
          </p>
          <p className="oi-mono" style={{ marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {p.categoryLabel}
          </p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <span className="oi-price">{tl(p.price)}</span>
          {p.originalPrice && (
            <div className="oi-price-strike" style={{ marginTop: 2 }}>{tl(p.originalPrice)}</div>
          )}
        </div>
      </div>

      {p.outOfStock ? (
        <button className="oi-add" disabled style={{ cursor: "not-allowed" }}>
          Stokta Yok
        </button>
      ) : (
        <button className="oi-add" onClick={(e) => { e.preventDefault(); onAdd(p); }}>
          Sepete Ekle
        </button>
      )}
    </Link>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
function Shop() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");
  const [query, setQuery] = useState("");

  useParallax();

  const add = useCart((s) => s.add);
  const q = query.trim().toLocaleLowerCase("tr");

  const toggleCategory = (cat: string) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const filtered = products
    .filter((p) => {
      if (activeTab === "apparel"    && p.type !== "apparel")    return false;
      if (activeTab === "supplement" && p.type !== "supplement") return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (p.price > maxPrice) return false;
      if (q && !`${p.name} ${p.categoryLabel} ${p.subtitle}`.toLocaleLowerCase("tr").includes(q)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc")  return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  const categories =
    activeTab === "supplement" ? SUPPLEMENT_CATEGORIES :
    activeTab === "apparel"    ? APPAREL_CATEGORIES :
    [...APPAREL_CATEGORIES, ...SUPPLEMENT_CATEGORIES];

  const hasFilters = selectedCategories.length > 0 || maxPrice < 2000 || q.length > 0;

  const counts = {
    all: products.length,
    apparel: products.filter((p) => p.type === "apparel").length,
    supplement: products.filter((p) => p.type === "supplement").length,
  };

  const handleAdd = (p: Product) => {
    add(p, p.type === "apparel" ? "M" : "Standart");
    toast.success(`${p.name} sepete eklendi`);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMaxPrice(2000);
    setQuery("");
  };

  return (
    <div className="oi-dark">
      <Nav />

      <main style={{ paddingTop: 104 }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 clamp(20px, 4vw, 48px)" }}>

          {/* ── Başlık + sekmeler — kompakt ── */}
          <header style={{ paddingTop: 36, paddingBottom: 20 }}>
            <p className="oi-mono" style={{ marginBottom: 10 }}>Koleksiyon</p>
            <h1 style={{
              fontSize: "clamp(36px, 5.5vw, 60px)", fontWeight: 700,
              letterSpacing: "-0.04em", lineHeight: 1.0, color: "#f4f4f4",
              textTransform: "lowercase",
            }}>
              mağaza
            </h1>
            <p style={{
              fontSize: 15, color: "rgba(255,255,255,0.55)", letterSpacing: "-0.02em",
              marginTop: 12, maxWidth: 520, lineHeight: 1.45,
            }}>
              Premium spor giyim &amp; analiz raporlu elit supplement.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
              {([
                { tab: "all" as Tab,        label: "Tümü",       n: counts.all },
                { tab: "apparel" as Tab,    label: "Spor Giyim", n: counts.apparel },
                { tab: "supplement" as Tab, label: "Supplement", n: counts.supplement },
              ]).map(({ tab, label, n }) => (
                <button
                  key={tab}
                  className={`oi-fpill ${activeTab === tab ? "active" : ""}`}
                  onClick={() => { setActiveTab(tab); setSelectedCategories([]); }}
                >
                  {label}<span className="cnt">{n}</span>
                </button>
              ))}
            </div>
          </header>

          {/* ── Filtre çubuğu — cam panel ── */}
          <section className="oi-glass" style={{ borderRadius: 12, padding: 16, marginBottom: 22 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              <input
                className="oi-input"
                style={{ flexGrow: 1, minWidth: 200, maxWidth: 420 }}
                placeholder="Ürün ara"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Ürün ara"
              />
              {([
                { value: "default"    as const, label: "Varsayılan" },
                { value: "price-asc"  as const, label: "Fiyat ↑" },
                { value: "price-desc" as const, label: "Fiyat ↓" },
              ]).map((s) => (
                <button
                  key={s.value}
                  className={`oi-fpill ${sortBy === s.value ? "active" : ""}`}
                  onClick={() => setSortBy(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14, alignItems: "center" }}>
              <span className="oi-mono" style={{ marginRight: 4 }}>Kategori</span>
              {categories.map((c) => (
                <button
                  key={c.value}
                  className={`oi-fpill ${selectedCategories.includes(c.value) ? "active" : ""}`}
                  onClick={() => toggleCategory(c.value)}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16, flexWrap: "wrap" }}>
              <span className="oi-mono" style={{ whiteSpace: "nowrap" }}>Maks. Fiyat</span>
              <input
                type="range" min={300} max={2000} step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ flexGrow: 1, minWidth: 160, accentColor: "#ffffff" }}
                aria-label="Maksimum fiyat"
              />
              <span className="oi-price" style={{ whiteSpace: "nowrap" }}>{tl(maxPrice)}</span>
              {hasFilters && (
                <button className="oi-fpill" onClick={clearFilters}>Filtreleri Temizle</button>
              )}
            </div>
          </section>

          <p className="oi-mono" style={{ marginBottom: 16 }}>{filtered.length} ürün</p>

          {/* ── Ürün ızgarası ── */}
          {filtered.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 16,
            }}>
              {filtered.map((p) => (
                <Card key={p.id} p={p} onAdd={handleAdd} />
              ))}
            </div>
          ) : (
            <div className="oi-card" style={{ padding: 48, alignItems: "center", textAlign: "center" }}>
              <p style={{ fontSize: 18, fontWeight: 600, color: "#f4f4f4", letterSpacing: "-0.02em" }}>
                Sonuç bulunamadı
              </p>
              <p className="oi-mono" style={{ marginTop: 8, marginBottom: 20 }}>
                Filtreleri değiştirip tekrar dene
              </p>
              <button className="oi-btn" onClick={clearFilters}>Filtreleri Temizle</button>
            </div>
          )}

          {/* ── Güvence şeridi ── */}
          <section style={{
            display: "flex", flexWrap: "wrap", gap: "16px 40px",
            justifyContent: "center", padding: "48px 0 0",
            borderTop: "1px solid rgba(255,255,255,0.12)", marginTop: 56,
          }}>
            {[
              ["300", "gsm premium pamuk"],
              ["ISO 17025", "analiz raporlu"],
              ["0", "dolgu maddesi"],
              ["1500₺", "üzeri ücretsiz kargo"],
              ["14", "gün koşulsuz iade"],
            ].map(([k, v]) => (
              <span key={v} className="oi-mono" style={{ whiteSpace: "nowrap" }}>
                <b style={{ color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>{k}</b> {v}
              </span>
            ))}
          </section>

          {/* ── Marka bloğu ── */}
          <section style={{ padding: "64px 0 88px", maxWidth: 640 }}>
            <h2 style={{
              fontSize: "clamp(26px, 3.4vw, 40px)", fontWeight: 700,
              letterSpacing: "-0.04em", lineHeight: 1.05, color: "#f4f4f4",
              textTransform: "lowercase", marginBottom: 16,
            }}>
              disiplinden dövülmüş.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.55)", letterSpacing: "-0.02em" }}>
              Her tişört 300 gramlık premium pamuktan, her supplement bağımsız
              laboratuvar analiziyle üretiliyor. Etikette yazan, kutunun içinde.
              Uzlaşma yok.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
