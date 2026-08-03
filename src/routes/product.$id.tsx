import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductPlate } from "@/components/ProductPlate";
import { Icon, type IconName } from "@/components/Icon";
import { RevealText } from "@/components/RevealText";
import { useParallax } from "@/components/SmoothScroll";
import { findProduct, products, usableVideo } from "@/data/products";
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

/* ── Karanlık tema jetonları ────────────────────────────────────────── */
const BG      = "#080808";
const CARD    = "#181818";
const RAISED  = "#1f1f1f";
const HAIR    = "rgba(255,255,255,0.12)";
const TEXT    = "#f4f4f4";
const MUTED   = "rgba(255,255,255,0.55)";
const DIM     = "rgba(255,255,255,0.38)";
const BONE    = "#dcdcdc";
const MONO    = "'JetBrains Mono', ui-monospace, monospace";
const SANS    = "'Inter Tight', Inter, sans-serif";

const microLabel: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: ".08em",
  color: MUTED,
};

const priceStyle: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: "13px",
  color: TEXT,
  letterSpacing: ".02em",
};

const priceLg: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: "26px",
  color: TEXT,
  letterSpacing: ".01em",
};

const priceStrike: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: "14px",
  color: DIM,
  textDecoration: "line-through",
};

const ctaPrimary: React.CSSProperties = {
  background: "#ffffff",
  color: BG,
  border: "none",
  borderRadius: "10px",
  fontFamily: MONO,
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: ".08em",
  cursor: "pointer",
  transition: "background 0.25s ease, transform 0.25s cubic-bezier(0.22,1,0.36,1)",
};

const ctaSecondary: React.CSSProperties = {
  background: "transparent",
  color: TEXT,
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: "10px",
  fontFamily: MONO,
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: ".08em",
  cursor: "pointer",
};

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
    minHeight: "42px",
    padding: "10px 20px",
    borderRadius: "999px",
    fontFamily: MONO,
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".06em",
    lineHeight: 1.2,
    border: active && !disabled ? "1px solid #ffffff" : `1px solid ${HAIR}`,
    cursor: disabled ? "not-allowed" : "pointer",
    background: disabled ? "transparent" : active ? "#ffffff" : RAISED,
    color: disabled ? "rgba(255,255,255,0.25)" : active ? BG : TEXT,
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
  const vid = usableVideo(product);
  const [galleryIdx, setGalleryIdx] = useState(vid ? -1 : 0);

  /* Galeri sırası: video (varsa) + tüm açılar */
  const slides: number[] = [...(vid ? [-1] : []), ...((product.gallery ?? []).map((_, i) => i))];
  const goSlide = (dir: 1 | -1) => {
    if (slides.length < 2) return;
    const cur = slides.indexOf(galleryIdx);
    const next = (cur + dir + slides.length) % slides.length;
    setGalleryIdx(slides[next]);
  };
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
    if (product.outOfStock) {
      toast.error("Bu ürün şu anda stokta yok.");
      return;
    }
    addToCart(product, variantLabel);
    toast.success(`${product.name} sepete eklendi`);
    setAdded(true);
  };

  /* ── Paket önerisi: giyim ↔ supplement ─────────────────────────── */
  const bundlePartner = useMemo(
    () =>
      products.find(
        (p) =>
          p.id !== product.id &&
          !p.outOfStock &&
          (isSupp ? p.type === "apparel" : p.type === "supplement")
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
    <div style={{ background: BG, color: TEXT, minHeight: "100vh", overflowX: "hidden", fontFamily: SANS }}>

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
                fontFamily: MONO,
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: MUTED,
                flexWrap: "wrap",
              }}
            >
              <Link to="/" style={{ color: MUTED, textDecoration: "none" }}>
                Ana Sayfa
              </Link>
              <span style={{ color: DIM }}>/</span>
              <Link to="/shop" style={{ color: MUTED, textDecoration: "none" }}>
                Mağaza
              </Link>
              <span style={{ color: DIM }}>/</span>
              <span style={{ color: TEXT }}>{product.name}</span>
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
                    background: CARD,
                    border: `1px solid ${HAIR}`,
                    borderRadius: "10px",
                    padding: product.gallery ? "0" : "24px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {label && (
                    <span
                      style={{
                        position: "absolute",
                        top: "20px",
                        left: "20px",
                        zIndex: 3,
                        display: "inline-flex",
                        alignItems: "center",
                        background: "#ffffff",
                        color: BG,
                        borderRadius: "999px",
                        padding: "6px 12px",
                        fontFamily: MONO,
                        fontSize: "10px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: ".08em",
                      }}
                    >
                      {label}
                    </span>
                  )}
                  {product.gallery ? (
                    galleryIdx === -1 && vid ? (
                      <video
                        key="video"
                        src={vid}
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

                  {/* Yana kaydırma okları */}
                  {slides.length > 1 && (
                    <>
                      <button
                        onClick={() => goSlide(-1)}
                        aria-label="Önceki görsel"
                        className="oi-gnav"
                        style={{ left: 12 }}
                      >
                        <Icon name="chevron_left" size={20} />
                      </button>
                      <button
                        onClick={() => goSlide(1)}
                        aria-label="Sonraki görsel"
                        className="oi-gnav"
                        style={{ right: 12 }}
                      >
                        <Icon name="chevron_right" size={20} />
                      </button>
                    </>
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
                          background: CARD,
                          border: galleryIdx === i ? "2px solid #ffffff" : `2px solid ${HAIR}`,
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
                    {vid && (
                      <button
                        className="reveal-blur"
                        onClick={() => setGalleryIdx(-1)}
                        aria-label="Video"
                        style={{
                          background: CARD,
                          border: galleryIdx === -1 ? "2px solid #ffffff" : `2px solid ${HAIR}`,
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
                          style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block", opacity: 0.55 }}
                        />
                        <span
                          style={{
                            position: "absolute", inset: 0, display: "flex",
                            alignItems: "center", justifyContent: "center",
                            color: "#ffffff",
                          }}
                        >
                          <Icon name="play_arrow" size={28} style={{ fill: "currentColor" }} />
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
                          background: CARD,
                          border: `1px solid ${HAIR}`,
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
                  <p style={{ ...microLabel, marginBottom: "10px" }}>
                    {isSupp ? "Supplement Koleksiyonu" : "Giyim Koleksiyonu"}
                  </p>

                  {product.outOfStock ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        background: "rgba(255,255,255,0.10)",
                        color: DIM,
                        border: `1px solid ${HAIR}`,
                        borderRadius: "999px",
                        padding: "6px 14px",
                        fontFamily: MONO,
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        marginBottom: "12px",
                      }}
                    >
                      Stokta Yok
                    </span>
                  ) : product.badge && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        background: "rgba(255,255,255,0.10)",
                        color: TEXT,
                        border: `1px solid ${HAIR}`,
                        borderRadius: "999px",
                        padding: "6px 14px",
                        fontFamily: MONO,
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: ".08em",
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
                      letterSpacing: "-0.03em",
                      lineHeight: 1.05,
                      color: TEXT,
                    }}
                  />
                  <p style={{ ...microLabel, marginTop: "8px", color: DIM }}>By OLD IRON</p>
                  <p
                    style={{
                      fontSize: "16px",
                      color: MUTED,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.5,
                      marginTop: "12px",
                    }}
                  >
                    {product.subtitle}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "18px", flexWrap: "wrap" }}>
                    <span style={priceLg}>{fmt(product.price)}</span>
                    {product.originalPrice && (
                      <>
                        <span style={priceStrike}>{fmt(product.originalPrice)}</span>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            background: "#ffffff",
                            color: BG,
                            borderRadius: "999px",
                            padding: "4px 10px",
                            fontFamily: MONO,
                            fontSize: "10px",
                            fontWeight: 600,
                            letterSpacing: ".08em",
                          }}
                        >
                          -%{discountPct}
                        </span>
                      </>
                    )}
                  </div>
                  <p style={{ ...microLabel, marginTop: "6px", color: DIM }}>KDV dahil</p>
                </div>

                <div style={{ height: "1px", background: HAIR }} />

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
                      <span style={microLabel}>Beden Seç</span>
                      <button
                        onClick={() => setGuideOpen((o) => !o)}
                        aria-expanded={guideOpen}
                        style={{
                          ...microLabel,
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
                            background: CARD,
                            border: `1px solid ${HAIR}`,
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
                                      ...microLabel,
                                      textAlign: "left",
                                      fontWeight: 600,
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
                                <tr key={b} style={{ borderTop: `1px solid ${HAIR}` }}>
                                  <td style={{ padding: "8px 0", ...priceStyle }}>{b}</td>
                                  <td style={{ padding: "8px 0" }}>
                                    <span style={priceStyle}>{g}</span>
                                  </td>
                                  <td style={{ padding: "8px 0" }}>
                                    <span style={priceStyle}>{boy}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <p style={{ marginTop: "10px", fontSize: "13px", color: MUTED, lineHeight: 1.5 }}>
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
                        <p style={{ ...microLabel, marginBottom: "12px" }}>Gramaj</p>
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
                        <p style={{ ...microLabel, marginBottom: "12px" }}>Aroma</p>
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
                          background: CARD,
                          border: `1px solid ${HAIR}`,
                          borderRadius: "10px",
                          padding: "14px 18px",
                          fontSize: "13px",
                          color: MUTED,
                        }}
                      >
                        <span style={{ ...priceStyle }}>{product.servings} porsiyon</span>{" "}
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
                      background: CARD,
                      border: `1px solid ${HAIR}`,
                      borderRadius: "10px",
                      padding: "14px 18px",
                    }}
                  >
                    {remaining > 0 ? (
                      <>
                        <p style={{ fontSize: "13px", color: TEXT, marginBottom: "10px" }}>
                          Ücretsiz kargoya{" "}
                          <span style={priceStyle}>{fmt(remaining)}</span> kaldı
                        </p>
                        <div
                          style={{
                            height: "3px",
                            background: HAIR,
                            borderRadius: "999px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${progressPct}%`,
                              height: "100%",
                              background: BONE,
                              transition: "width 0.4s cubic-bezier(0.22,1,0.36,1)",
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <p style={{ ...microLabel, color: TEXT }}>Kargo bedava ✓</p>
                    )}
                  </div>

                  <button
                    ref={ctaRef}
                    onClick={handleAdd}
                    disabled={product.outOfStock}
                    className="oi-cta"
                    style={{
                      ...ctaPrimary,
                      width: "100%",
                      padding: "16px 24px",
                      minHeight: "48px",
                      ...(product.outOfStock
                        ? { background: "rgba(255,255,255,0.10)", color: DIM, cursor: "not-allowed" }
                        : {}),
                    }}
                  >
                    {product.outOfStock ? "Stokta Yok" : added ? "Sepete eklendi ✓" : "Sepete Ekle"}
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
                    {([
                      ["local_shipping", "1500₺ üzeri ücretsiz kargo"],
                      ["restart_alt", "14 gün içinde iade"],
                      ["lock", "Güvenli ödeme"],
                    ] as [IconName, string][]).map(([icon, text]) => (
                      <span
                        key={text}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "13px",
                          color: MUTED,
                        }}
                      >
                        <Icon name={icon} size={18} style={{ color: BONE }} />
                        {text}
                      </span>
                    ))}
                  </div>

                  {/* Sık birlikte alınanlar */}
                  {bundlePartner && (
                    <div
                      style={{
                        background: CARD,
                        border: `1px solid ${HAIR}`,
                        borderRadius: "10px",
                        padding: "16px 18px",
                      }}
                    >
                      <p style={{ ...microLabel, marginBottom: "14px" }}>Sık birlikte alınanlar</p>
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
                        <span style={{ fontSize: "18px", color: MUTED, lineHeight: 1 }}>+</span>
                        <BundleThumb product={bundlePartner} />
                        <div style={{ minWidth: 0, flex: "1 1 120px" }}>
                          <p style={{ fontSize: "13px", color: TEXT, lineHeight: 1.35 }}>
                            {product.name} + {bundlePartner.name}
                          </p>
                          <p style={{ marginTop: "4px", fontSize: "13px", color: MUTED }}>
                            Toplam <span style={priceStyle}>{fmt(bundleTotal)}</span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleBundleAdd}
                        style={{
                          ...ctaSecondary,
                          width: "100%",
                          padding: "14px 18px",
                          minHeight: "48px",
                        }}
                      >
                        İkisini de sepete ekle ({fmt(bundleTotal)})
                      </button>
                    </div>
                  )}

                  <div
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderRadius: "10px",
                      padding: "14px 18px",
                      fontSize: "13px",
                      color: TEXT,
                      lineHeight: 1.4,
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>1500₺ üzeri kargo ücretsiz.</span>{" "}
                    <span style={{ color: MUTED }}>Altındaki siparişlerde kargo ücreti 140₺.</span>
                  </div>
                </div>

                <div style={{ height: "1px", background: HAIR }} />

                {/* Akordiyonlar */}
                <div>
                  <Accordion title="Ürün Açıklaması" defaultOpen>
                    <p style={{ fontSize: "16px", color: MUTED, lineHeight: 1.6 }}>
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
                        <div style={{ fontSize: "16px", color: MUTED, lineHeight: 1.8 }}>
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
        <section style={{ background: "#0d0d0d", borderTop: `1px solid ${HAIR}`, padding: "80px 0" }}>
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
                  <p style={{ ...microLabel, marginBottom: "8px" }}>Öneriler</p>
                  <h2
                    style={{
                      fontSize: "clamp(32px,4vw,40px)",
                      fontWeight: 700,
                      letterSpacing: "-0.03em",
                      lineHeight: 1.0,
                      color: TEXT,
                    }}
                  >
                    Bunları da İnceleyebilirsin
                  </h2>
                </div>
                <Link
                  to="/shop"
                  style={{ ...microLabel, textDecoration: "none" }}
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
                <Link
                  to="/shop"
                  style={{
                    ...ctaSecondary,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "14px 28px",
                    minHeight: "48px",
                    textDecoration: "none",
                  }}
                >
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
        className="oi-sticky-buybar"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          /* Çerez bildirimiyle (z-60) çakışmasın — o açıkken bu barın
             altında tamamen kalır, kapanınca normal önceliğine döner. */
          zIndex: 55,
          background: "rgba(8,8,8,0.85)",
          backdropFilter: "blur(12px)",
          borderTop: `1px solid ${HAIR}`,
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
                background: CARD,
              }}
            >
              <ProductPlate product={product} ratio="1 / 1" />
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: TEXT,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "38vw",
                }}
              >
                {product.name}
              </p>
              <span style={priceStyle}>{fmt(product.price)}</span>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.outOfStock}
            className="oi-cta"
            style={{
              ...ctaPrimary,
              flexShrink: 0,
              padding: "14px 22px",
              minHeight: "48px",
              ...(product.outOfStock
                ? { background: "rgba(255,255,255,0.10)", color: DIM, cursor: "not-allowed" }
                : {}),
            }}
          >
            {product.outOfStock ? "Stokta Yok" : added ? "Eklendi ✓" : "Sepete Ekle"}
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
        .oi-cta:hover { background: #ffffff; transform: translateY(-1px); filter: brightness(1.05); }
        .oi-cta:active { transform: translateY(0) scale(0.98); }
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
        background: RAISED,
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
      className="reveal-blur oi-rel-card"
      style={{
        textDecoration: "none",
        transitionDelay: `${index * 60}ms`,
        display: "block",
        background: CARD,
        border: `1px solid ${HAIR}`,
        borderRadius: "10px",
        padding: "12px",
      }}
    >
      <ProductPlate product={p} ratio="4 / 5" />
      <div style={{ marginTop: "16px" }}>
        <p style={{ fontSize: "16px", fontWeight: 600, color: TEXT, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          {p.name}
        </p>
        <p style={{ ...microLabel, marginTop: "4px", color: DIM }}>By OLD IRON</p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
          <span style={priceStyle}>{fmt(p.price)}</span>
          {p.originalPrice && <span style={priceStrike}>{fmt(p.originalPrice)}</span>}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          add(p, p.type === "apparel" ? "M" : "Standart");
          toast.success(`${p.name} sepete eklendi`);
        }}
        style={{
          ...ctaSecondary,
          width: "100%",
          marginTop: "14px",
          padding: "12px 16px",
          minHeight: "44px",
        }}
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
    <div style={{ borderTop: `1px solid ${HAIR}`, padding: "18px 0" }}>
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
          fontFamily: SANS,
          fontSize: "16px",
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: TEXT,
          textAlign: "left",
        }}
        aria-expanded={open}
      >
        {title}
        <span
          style={{
            fontSize: "18px",
            lineHeight: 1,
            color: MUTED,
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
        borderBottom: `1px solid ${HAIR}`,
      }}
    >
      <span style={{ fontSize: "13px", color: MUTED }}>{k}</span>
      <span style={priceStyle}>{v}</span>
    </div>
  );
}
