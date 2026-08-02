import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductPlate } from "@/components/ProductPlate";
import { findProduct, products } from "@/data/products";
import { useCart } from "@/stores/cart";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = findProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — OLD IRON` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — OLD IRON` },
          { property: "og:description", content: loaderData.product.description },
        ]
      : [],
  }),
  component: ProductPage,
});

/* ── İngilizce değerleri Türkçeleştir ───────────────────────────────── */
const TR: Record<string, string> = {
  "White Choco": "Beyaz Çikolata",
  "Bubble Gum": "Sakız",
  "Unflavored": "Aromasız",
  "Chocolate": "Çikolata",
  "Vanilla": "Vanilya",
  "Bestseller": "ÇOK SATAN",
  "Yeni": "YENİ",
  "New": "YENİ",
};
const tr = (v: string) => TR[v] ?? v;

function badgeLabel(badge?: string) {
  if (!badge) return null;
  return badge.toLocaleLowerCase("tr").includes("yeni") ? "YENİ" : "ÇOK SATAN";
}

/* ── Reveal hook ────────────────────────────────────────────────────── */
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

/* ── Pill ───────────────────────────────────────────────────────────── */
function optionPill(active: boolean, disabled = false): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "56px",
    padding: "10px 20px",
    borderRadius: "30px",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "-0.04em",
    lineHeight: 1.2,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    background: disabled ? "#ffffff" : active ? "#000aff" : "#ecedee",
    color: disabled ? "#a1a4aa" : active ? "#ffffff" : "#111111",
    textDecoration: disabled ? "line-through" : "none",
    transition: "background 0.25s ease, color 0.25s ease, transform 0.25s cubic-bezier(0.22,1,0.36,1)",
  };
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  const isSupp = product.type === "supplement";

  const SIZES   = ["S", "M", "L", "XL", "XXL"];
  const FLAVORS = product.flavors?.length ? product.flavors : null;
  const WEIGHTS = product.weights?.length  ? product.weights  : null;

  const [size,   setSize]   = useState(isSupp ? "" : "L");
  const [flavor, setFlavor] = useState(FLAVORS?.[0] ?? "");
  const [weight, setWeight] = useState(WEIGHTS?.[0] ?? "");

  const addToCart = useCart((s) => s.add);
  const related   = products.filter((p) => p.id !== product.id).slice(0, 4);

  useReveal([product.id]);

  const handleAdd = () => {
    const variant = isSupp
      ? [weight, flavor].filter(Boolean).join(" / ") || "Standart"
      : size;
    addToCart(product, variant);
    toast.success(`${product.name} sepete eklendi`);
  };

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const label = badgeLabel(product.badge);

  return (
    <div style={{ background: "#ffffff", color: "#111111", minHeight: "100vh", overflowX: "hidden" }}>
      <div className="announcement-bar">
        <span>1500₺ üzeri ücretsiz kargo · Almanya kalitesi · Lab onaylı</span>
      </div>

      <Nav />

      <main style={{ paddingTop: "104px" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 20px" }}>
          <div className="pdp-inner">

            {/* Breadcrumb */}
            <div
              className="reveal"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "28px 0",
                fontSize: "13px",
                letterSpacing: "-0.04em",
                color: "#737780",
                flexWrap: "wrap",
              }}
            >
              <Link to="/" className="link-underline" style={{ color: "#737780", textDecoration: "none" }}>
                Ana Sayfa
              </Link>
              <span style={{ color: "#d7d7d7" }}>/</span>
              <Link to="/shop" className="link-underline" style={{ color: "#737780", textDecoration: "none" }}>
                Mağaza
              </Link>
              <span style={{ color: "#d7d7d7" }}>/</span>
              <span style={{ color: "#111111" }}>{product.name}</span>
            </div>

            {/* ══════════════════════════════════════════════════════
                ANA BLOK
            ══════════════════════════════════════════════════════ */}
            <div className="pdp-grid" style={{ paddingBottom: "80px" }}>

              {/* Sol — plaka */}
              <div>
                <div
                  className="reveal-scale"
                  style={{
                    background: "#ecedee",
                    borderRadius: "10px",
                    padding: "24px",
                    position: "relative",
                  }}
                >
                  {label && (
                    <span
                      className={`badge ${label === "YENİ" ? "badge-new" : "badge-new-color"}`}
                      style={{ position: "absolute", top: "20px", left: "20px", zIndex: 3 }}
                    >
                      {label}
                    </span>
                  )}
                  <ProductPlate product={product} ratio="1 / 1" />
                </div>

                {/* Küçük plakalar */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                    marginTop: "12px",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="reveal-blur"
                      style={{
                        background: "#ecedee",
                        borderRadius: "10px",
                        padding: "10px",
                        transitionDelay: `${i * 80}ms`,
                      }}
                    >
                      <ProductPlate product={product} ratio="1 / 1" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sağ — detay */}
              <div className="reveal-right" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                <div>
                  <p className="text-eyebrow" style={{ marginBottom: "10px" }}>
                    {isSupp ? "Supplement Koleksiyonu" : "Giyim Koleksiyonu"}
                  </p>
                  <h1
                    style={{
                      fontSize: "clamp(32px,4vw,40px)",
                      fontWeight: 600,
                      letterSpacing: "-0.04em",
                      lineHeight: 1.05,
                      color: "#111111",
                    }}
                  >
                    {product.name}
                  </h1>
                  <p className="text-brand-credit" style={{ marginTop: "8px" }}>By OLD IRON</p>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#737780",
                      letterSpacing: "-0.04em",
                      lineHeight: 1.5,
                      marginTop: "12px",
                    }}
                  >
                    {product.subtitle}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "18px", flexWrap: "wrap" }}>
                    <span className="text-price-lg">₺{product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <>
                        <span className="text-price-strike">₺{product.originalPrice.toFixed(2)}</span>
                        <span className="badge badge-new-color">-%{discountPct}</span>
                      </>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#a1a4aa",
                      letterSpacing: "-0.04em",
                      marginTop: "6px",
                    }}
                  >
                    KDV dahil
                  </p>
                </div>

                <div style={{ height: "1px", background: "#d7d7d7" }} />

                {/* Beden — giyim */}
                {!isSupp && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <span className="text-eyebrow">Beden Seç</span>
                      <span className="text-brand-credit">Beden Tablosu</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {SIZES.map((s, i) => {
                        const disabled = i === 4;
                        return (
                          <button
                            key={s}
                            disabled={disabled}
                            onClick={() => setSize(s)}
                            style={optionPill(s === size && !disabled, disabled)}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Supplement seçenekleri */}
                {isSupp && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {WEIGHTS && (
                      <div>
                        <p className="text-eyebrow" style={{ marginBottom: "12px" }}>Gramaj</p>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {WEIGHTS.map((w: string) => (
                            <button key={w} onClick={() => setWeight(w)} style={optionPill(weight === w)}>
                              {w}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {FLAVORS && (
                      <div>
                        <p className="text-eyebrow" style={{ marginBottom: "12px" }}>Aroma</p>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {FLAVORS.map((f: string) => (
                            <button key={f} onClick={() => setFlavor(f)} style={optionPill(flavor === f)}>
                              {tr(f)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.servings && (
                      <div
                        style={{
                          background: "#ecedee",
                          borderRadius: "10px",
                          padding: "14px 18px",
                          fontSize: "13px",
                          color: "#737780",
                          letterSpacing: "-0.04em",
                        }}
                      >
                        <span style={{ color: "#111111", fontWeight: 500 }}>
                          {product.servings} porsiyon
                        </span>{" "}
                        · {product.subtitle}
                      </div>
                    )}
                  </div>
                )}

                {/* CTA */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <button
                    onClick={handleAdd}
                    className="btn-sweep"
                    style={{
                      width: "100%",
                      background: "#111111",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 600,
                      letterSpacing: "-0.04em",
                      padding: "16px 24px",
                      borderRadius: "10px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Sepete Ekle
                  </button>

                  <div
                    style={{
                      background: "#e5e7ff",
                      borderRadius: "10px",
                      padding: "14px 18px",
                      fontSize: "13px",
                      color: "#111111",
                      letterSpacing: "-0.04em",
                      lineHeight: 1.4,
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>1500₺ üzeri kargo ücretsiz.</span>{" "}
                    <span style={{ color: "#737780" }}>Altındaki siparişlerde kargo ücreti 140₺.</span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                      gap: "8px",
                    }}
                  >
                    {[
                      "1500₺ üzeri ücretsiz kargo",
                      "14 gün iade hakkı",
                      "Güvenli ödeme",
                      "Almanya'da üretildi",
                    ].map((t, i) => (
                      <div
                        key={t}
                        className="reveal-blur"
                        style={{
                          background: "#ecedee",
                          borderRadius: "10px",
                          padding: "12px 14px",
                          fontSize: "13px",
                          color: "#737780",
                          letterSpacing: "-0.04em",
                          transitionDelay: `${i * 60}ms`,
                        }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ height: "1px", background: "#d7d7d7" }} />

                {/* Akordiyonlar */}
                <div>
                  <Accordion title="Ürün Açıklaması" defaultOpen>
                    <p style={{ fontSize: "16px", color: "#737780", letterSpacing: "-0.04em", lineHeight: 1.6 }}>
                      {product.description}
                    </p>
                  </Accordion>

                  {isSupp ? (
                    <Accordion title="Besin Değerleri & İçerik">
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Row k="Protein" v="24 g / porsiyon" />
                        <Row k="Karbonhidrat" v="2 g / porsiyon" />
                        <Row k="Yağ" v="1,5 g / porsiyon" />
                        <Row k="Kalori" v="~120 kcal / porsiyon" />
                        <Row k="Lab Testi" v="ISO 17025 Akredite" />
                      </div>
                    </Accordion>
                  ) : (
                    <>
                      <Accordion title="Detaylar & Malzeme">
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <Row k="Malzeme" v="%100 Premium Pamuk" />
                          <Row k="Gramaj" v="300 g/m² (Ağır Gramaj)" />
                          <Row k="Kesim" v="Atletik Oversize Kesim" />
                        </div>
                      </Accordion>
                      <Accordion title="Yıkama Talimatı">
                        <div
                          style={{
                            fontSize: "16px",
                            color: "#737780",
                            letterSpacing: "-0.04em",
                            lineHeight: 1.8,
                          }}
                        >
                          <p>Maks. 30°C'de yıka</p>
                          <p>Yıkamadan önce ters çevir</p>
                          <p>Kurutma makinesinde kurutma</p>
                          <p>Düşük ısıda ütüle</p>
                        </div>
                      </Accordion>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            İLGİLİ ÜRÜNLER
        ══════════════════════════════════════════════════════════ */}
        <section style={{ background: "#ecedee", padding: "80px 0" }}>
          <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 20px" }}>
            <div className="pdp-inner">
              <div
                className="reveal-wipe"
                style={{
                  marginBottom: "40px",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <p className="text-eyebrow" style={{ marginBottom: "8px" }}>Öneriler</p>
                  <h2
                    style={{
                      fontSize: "clamp(32px,4vw,40px)",
                      fontWeight: 700,
                      letterSpacing: "-0.04em",
                      lineHeight: 1.0,
                      color: "#111111",
                    }}
                  >
                    Bunları da İnceleyebilirsin
                  </h2>
                </div>
                <Link
                  to="/shop"
                  className="link-underline"
                  style={{ fontSize: "13px", fontWeight: 500, color: "#737780", letterSpacing: "-0.04em", textDecoration: "none" }}
                >
                  Tümünü Gör
                </Link>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: "12px",
                }}
              >
                {related.map((p, i) => (
                  <RelatedCard key={p.id} product={p} index={i} />
                ))}
              </div>

              <div style={{ marginTop: "24px" }}>
                <Link to="/shop" className="btn-see-all" style={{ background: "#ecedee", borderColor: "#d7d7d7" }}>
                  Tüm Ürünleri Gör
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .pdp-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: start;
        }
        @media (min-width: 768px) {
          .pdp-inner { padding-left: 52px; padding-right: 52px; }
        }
        @media (min-width: 1024px) {
          .pdp-grid { grid-template-columns: 1.05fr 1fr; gap: 56px; }
        }
      `}</style>

      <Footer />
    </div>
  );
}

/* ── İlgili ürün kartı ──────────────────────────────────────────────── */
function RelatedCard({ product: p, index }: { product: typeof products[number]; index: number }) {
  const add = useCart((s) => s.add);
  return (
    <Link
      to="/product/$id"
      params={{ id: p.id }}
      className="product-card reveal-blur"
      style={{
        textDecoration: "none",
        transitionDelay: `${index * 60}ms`,
        display: "block",
        background: "#ffffff",
      }}
    >
      <ProductPlate product={p} ratio="4 / 5" />
      <div style={{ marginTop: "16px" }}>
        <p style={{ fontSize: "16px", fontWeight: 600, color: "#111111", letterSpacing: "-0.04em", lineHeight: 1.2 }}>
          {p.name}
        </p>
        <p className="text-brand-credit" style={{ marginTop: "4px" }}>By OLD IRON</p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
          <span className="text-price">₺{p.price.toFixed(2)}</span>
          {p.originalPrice && <span className="text-price-strike">₺{p.originalPrice.toFixed(2)}</span>}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          add(p, p.type === "apparel" ? "M" : "Standart");
          toast.success(`${p.name} sepete eklendi`);
        }}
        className="card-add-btn"
      >
        Sepete Ekle
      </button>
    </Link>
  );
}

/* ── Akordiyon ──────────────────────────────────────────────────────── */
function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderTop: "1px solid #d7d7d7", padding: "18px 0" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: 500,
          letterSpacing: "-0.04em",
          color: "#111111",
          textAlign: "left",
        }}
        aria-expanded={open}
      >
        {title}
        <span
          style={{
            fontSize: "18px",
            lineHeight: 1,
            color: "#737780",
            transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.4s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div style={{ paddingTop: open ? "14px" : 0, transition: "padding 0.3s ease" }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
        padding: "10px 0",
        borderBottom: "1px solid #ecedee",
      }}
    >
      <span style={{ fontSize: "13px", color: "#737780", letterSpacing: "-0.04em" }}>{k}</span>
      <span className="text-price">{v}</span>
    </div>
  );
}
