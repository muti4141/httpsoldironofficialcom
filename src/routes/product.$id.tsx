import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductPlate } from "@/components/ProductPlate";
import { RevealText } from "@/components/RevealText";
import { useParallax } from "@/components/SmoothScroll";
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

/* ── Fiyat formatı: ₺500,00 ─────────────────────────────────────────── */
const fmt = (n: number) => `₺${n.toFixed(2).replace(".", ",")}`;

/* ── Ücretsiz kargo eşiği ───────────────────────────────────────────── */
const FREE_SHIPPING = 1500;

/* ── Beden tablosu (oversize kesim) ─────────────────────────────────── */
const SIZE_TABLE: Array<[string, string, string]> = [
  ["S", "104", "68"],
  ["M", "110", "70"],
  ["L", "116", "72"],
  ["XL", "122", "74"],
  ["XXL", "128", "76"],
];

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
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [flavor, setFlavor] = useState(FLAVORS?.[0] ?? "");
  const [weight, setWeight] = useState(WEIGHTS?.[0] ?? "");

  const addToCart = useCart((s) => s.add);
  const cartTotal = useCart((s) =>
    s.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  );
  const related   = products.filter((p) => p.id !== product.id).slice(0, 4);

  /* Post-add geri bildirimi */
  const [added, setAdded] = useState(false);
  /* Beden tablosu paneli */
  const [guideOpen, setGuideOpen] = useState(false);
  /* Sticky satın alma barı */
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  useReveal([product.id]);
  useParallax();

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [product.id]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(t);
  }, [added]);

  const variantLabel = isSupp
    ? [weight, flavor].filter(Boolean).join(" / ") || "Standart"
    : size;

  const handleAdd = () => {
    addToCart(product, variantLabel);
    toast.success(`${product.name} sepete eklendi`);
    setAdded(true);
  };

  /* ── Paket önerisi: giyim ↔ supplement ─────────────────────────── */
  const bundlePartner = useMemo(
    () =>
      products.find(
        (p) => p.id !== product.id && (isSupp ? p.type === "apparel" : p.type === "supplement")
      ) ?? null,
    [product.id, isSupp]
  );

  const bundleTotal = bundlePartner ? product.price + bundlePartner.price : 0;

  const handleBundleAdd = () => {
    if (!bundlePartner) return;
    addToCart(product, variantLabel);
    addToCart(
      bundlePartner,
      bundlePartner.type === "apparel"
        ? "L"
        : [bundlePartner.weights?.[0], bundlePartner.flavors?.[0]].filter(Boolean).join(" / ") ||
            "Standart"
    );
    toast.success("İki ürün de sepete eklendi");
    setAdded(true);
  };

  /* ── Ücretsiz kargo ilerlemesi ─────────────────────────────────── */
  const remaining = Math.max(0, FREE_SHIPPING - cartTotal);
  const progressPct = Math.min(100, (cartTotal / FREE_SHIPPING) * 100);

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const label = badgeLabel(product.badge);

  return (
    <div style={{ background: "#ffffff", color: "#111111", minHeight: "100vh", overflowX: "hidden" }}>

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

              {/* Sol — galeri (gerçek görseller varsa) / plaka */}
              <div>
                <div
                  className="reveal-scale"
                  style={{
                    background: "#ecedee",
                    borderRadius: "10px",
                    padding: product.gallery ? "0" : "24px",
                    position: "relative",
                    overflow: "hidden",
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
                  {product.gallery ? (
                    galleryIdx === -1 && product.video ? (
                      <video
                        key="video"
                        src={product.video}
                        poster={product.videoPoster}
                        autoPlay muted loop playsInline
                        style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block", borderRadius: "10px" }}
                      />
                    ) : (
                      <img
                        key={galleryIdx}
                        src={product.gallery[galleryIdx] ?? product.gallery[0]}
                        alt={`${product.name} — açı ${galleryIdx + 1}`}
                        style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block", borderRadius: "10px" }}
                      />
                    )
                  ) : (
                    <ProductPlate product={product} ratio="1 / 1" />
                  )}
                </div>

                {/* Küçük kareler: her açı + video */}
                {product.gallery ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "12px",
                      marginTop: "12px",
                    }}
                  >
                    {product.gallery.map((src: string, i: number) => (
                      <button
                        key={src}
                        className="reveal-blur"
                        onClick={() => setGalleryIdx(i)}
                        aria-label={`Açı ${i + 1}`}
                        style={{
                          background: "#ecedee",
                          border: galleryIdx === i ? "2px solid #000aff" : "2px solid transparent",
                          borderRadius: "10px",
                          padding: 0,
                          cursor: "pointer",
                          overflow: "hidden",
                          transitionDelay: `${i * 60}ms`,
                        }}
                      >
                        <img
                          src={src}
                          alt={`${product.name} açı ${i + 1}`}
                          style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block" }}
                        />
                      </button>
                    ))}
                    {product.video && (
                      <button
                        className="reveal-blur"
                        onClick={() => setGalleryIdx(-1)}
                        aria-label="Video"
                        style={{
                          background: "#111111",
                          border: galleryIdx === -1 ? "2px solid #000aff" : "2px solid transparent",
                          borderRadius: "10px",
                          padding: 0,
                          cursor: "pointer",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <img
                          src={product.videoPoster ?? product.gallery[0]}
                          alt="Video önizleme"
                          style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block", opacity: 0.6 }}
                        />
                        <span
                          className="material-symbols-outlined"
                          style={{
                            position: "absolute", inset: 0, display: "flex",
                            alignItems: "center", justifyContent: "center",
                            color: "#ffffff", fontSize: "28px",
                            fontVariationSettings: "'FILL' 1",
                          }}
                        >
                          play_arrow
                        </span>
                      </button>
                    )}
                  </div>
                ) : (
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
                )}
              </div>

              {/* Sağ — detay */}
              <div className="reveal-right" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                <div>
                  <p className="text-eyebrow" style={{ marginBottom: "10px" }}>
                    {isSupp ? "Supplement Koleksiyonu" : "Giyim Koleksiyonu"}
                  </p>

                  {product.badge && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        background: "#e5e7ff",
                        color: "#000aff",
                        borderRadius: "30px",
                        padding: "6px 14px",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "-0.04em",
                        textTransform: "uppercase",
                        marginBottom: "12px",
                      }}
                    >
                      Lansman Fiyatı
                    </span>
                  )}
                  <RevealText
                    as="h1"
                    text={product.name}
                    stagger={45}
                    style={{
                      fontSize: "clamp(32px,4vw,40px)",
                      fontWeight: 600,
                      letterSpacing: "-0.04em",
                      lineHeight: 1.05,
                      color: "#111111",
                    }}
                  />
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
                    <span className="text-price-lg">{fmt(product.price)}</span>
                    {product.originalPrice && (
                      <>
                        <span className="text-price-strike">{fmt(product.originalPrice)}</span>
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
                      <button
                        onClick={() => setGuideOpen((o) => !o)}
                        aria-expanded={guideOpen}
                        className="text-brand-credit"
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                          textDecoration: "underline",
                          textUnderlineOffset: "3px",
                        }}
                      >
                        Beden Tablosu
                      </button>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {SIZES.map((s, i) => {
                        const disabled = i === 4;
                        return (
                          <button
                            key={s}
                            disabled={disabled}
                            onClick={() => setSize(s)}
                            title={disabled ? "Tükendi" : undefined}
                            style={optionPill(s === size && !disabled, disabled)}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>

                    {/* Beden tablosu — satır içi açılır panel */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateRows: guideOpen ? "1fr" : "0fr",
                        transition: "grid-template-rows 0.4s cubic-bezier(0.22,1,0.36,1)",
                      }}
                    >
                      <div style={{ overflow: "hidden" }}>
                        <div
                          style={{
                            marginTop: guideOpen ? "14px" : 0,
                            background: "#ecedee",
                            borderRadius: "10px",
                            padding: "14px 16px",
                            overflowX: "auto",
                          }}
                        >
                          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "260px" }}>
                            <thead>
                              <tr>
                                {["Beden", "Göğüs (cm)", "Boy (cm)"].map((h) => (
                                  <th
                                    key={h}
                                    style={{
                                      textAlign: "left",
                                      fontSize: "11px",
                                      fontWeight: 600,
                                      textTransform: "uppercase",
                                      letterSpacing: "-0.04em",
                                      color: "#737780",
                                      padding: "0 0 8px",
                                    }}
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {SIZE_TABLE.map(([b, g, boy]) => (
                                <tr key={b} style={{ borderTop: "1px solid #d7d7d7" }}>
                                  <td style={{ padding: "8px 0", fontSize: "13px", letterSpacing: "-0.04em", color: "#111111" }}>
                                    {b}
                                  </td>
                                  <td style={{ padding: "8px 0" }}>
                                    <span className="text-price">{g}</span>
                                  </td>
                                  <td style={{ padding: "8px 0" }}>
                                    <span className="text-price">{boy}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <p style={{ marginTop: "10px", fontSize: "13px", color: "#737780", letterSpacing: "-0.04em" }}>
                            Oversize kesim. Normal fit tercih edenler bir beden küçük alabilir.
                          </p>
                        </div>
                      </div>
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
                  {/* Ücretsiz kargo ilerlemesi */}
                  <div
                    style={{
                      background: "#ecedee",
                      borderRadius: "10px",
                      padding: "14px 18px",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {remaining > 0 ? (
                      <>
                        <p style={{ fontSize: "13px", color: "#111111", marginBottom: "10px" }}>
                          Ücretsiz kargoya{" "}
                          <span className="text-price">{fmt(remaining)}</span> kaldı
                        </p>
                        <div
                          style={{
                            height: "3px",
                            background: "#d7d7d7",
                            borderRadius: "30px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${progressPct}%`,
                              height: "100%",
                              background: "#000aff",
                              transition: "width 0.4s cubic-bezier(0.22,1,0.36,1)",
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <p style={{ fontSize: "13px", color: "#000aff", fontWeight: 500 }}>
                        Kargo bedava ✓
                      </p>
                    )}
                  </div>

                  <button
                    ref={ctaRef}
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
                      minHeight: "48px",
                      borderRadius: "10px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {added ? "Sepete eklendi ✓" : "Sepete Ekle"}
                  </button>

                  {/* Güven satırı */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px 20px",
                      paddingTop: "2px",
                    }}
                  >
                    {[
                      ["local_shipping", "1500₺ üzeri ücretsiz kargo"],
                      ["restart_alt", "14 gün içinde iade"],
                      ["lock", "Güvenli ödeme"],
                    ].map(([icon, text]) => (
                      <span
                        key={text}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "13px",
                          color: "#737780",
                          letterSpacing: "-0.04em",
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          aria-hidden
                          style={{
                            fontSize: "18px",
                            color: "#111111",
                            fontVariationSettings: "'FILL' 0, 'wght' 300",
                          }}
                        >
                          {icon}
                        </span>
                        {text}
                      </span>
                    ))}
                  </div>

                  {/* Sık birlikte alınanlar */}
                  {bundlePartner && (
                    <div
                      style={{
                        background: "#ecedee",
                        borderRadius: "10px",
                        padding: "16px 18px",
                        letterSpacing: "-0.04em",
                      }}
                    >
                      <p className="text-eyebrow" style={{ marginBottom: "14px" }}>
                        Sık birlikte alınanlar
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          flexWrap: "wrap",
                          marginBottom: "14px",
                        }}
                      >
                        <BundleThumb product={product} />
                        <span style={{ fontSize: "18px", color: "#737780", lineHeight: 1 }}>+</span>
                        <BundleThumb product={bundlePartner} />
                        <div style={{ minWidth: 0, flex: "1 1 120px" }}>
                          <p
                            style={{
                              fontSize: "13px",
                              color: "#111111",
                              lineHeight: 1.35,
                              letterSpacing: "-0.04em",
                            }}
                          >
                            {product.name} + {bundlePartner.name}
                          </p>
                          <p style={{ marginTop: "4px", fontSize: "13px", color: "#737780" }}>
                            Toplam <span className="text-price">{fmt(bundleTotal)}</span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleBundleAdd}
                        style={{
                          width: "100%",
                          background: "transparent",
                          color: "#000aff",
                          border: "1px solid #000aff",
                          borderRadius: "10px",
                          padding: "14px 18px",
                          minHeight: "48px",
                          fontSize: "13px",
                          fontWeight: 600,
                          letterSpacing: "-0.04em",
                          cursor: "pointer",
                        }}
                      >
                        İkisini de sepete ekle ({fmt(bundleTotal)})
                      </button>
                    </div>
                  )}

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

      {/* ══ Sabit satın alma barı ══════════════════════════════════ */}
      <div
        aria-hidden={!showSticky}
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 60,
          background: "#ffffff",
          borderTop: "1px solid #ecedee",
          boxShadow: "0 -4px 24px rgba(17,17,17,0.06)",
          padding: "10px 16px calc(10px + env(safe-area-inset-bottom))",
          transform: showSticky ? "translateY(0)" : "translateY(110%)",
          opacity: showSticky ? 1 : 0,
          pointerEvents: showSticky ? "auto" : "none",
          transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                flexShrink: 0,
                borderRadius: "10px",
                overflow: "hidden",
                background: "#ecedee",
              }}
            >
              <ProductPlate product={product} ratio="1 / 1" />
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#111111",
                  letterSpacing: "-0.04em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "38vw",
                }}
              >
                {product.name}
              </p>
              <span className="text-price">{fmt(product.price)}</span>
            </div>
          </div>

          <button
            onClick={handleAdd}
            style={{
              flexShrink: 0,
              background: "#000aff",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              padding: "14px 22px",
              minHeight: "48px",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              cursor: "pointer",
            }}
          >
            {added ? "Eklendi ✓" : "Sepete Ekle"}
          </button>
        </div>
      </div>

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

/* ── Paket küçük görseli ────────────────────────────────────────────── */
function BundleThumb({ product: p }: { product: typeof products[number] }) {
  return (
    <div
      style={{
        width: "56px",
        height: "56px",
        flexShrink: 0,
        borderRadius: "10px",
        overflow: "hidden",
        background: "#ffffff",
      }}
    >
      <ProductPlate product={p} ratio="1 / 1" />
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
          <span className="text-price">{fmt(p.price)}</span>
          {p.originalPrice && <span className="text-price-strike">{fmt(p.originalPrice)}</span>}
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
