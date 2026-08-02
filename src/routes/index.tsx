import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductVideo } from "@/components/ProductVideo";
import { products, APPAREL_PLACEHOLDER, SUPPLEMENT_PLACEHOLDER } from "@/data/products";
import { useEffect } from "react";
import { useCart } from "@/stores/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OLD IRON — Disiplinden Dövülmüş" },
      { name: "description", content: "Almanya'da üretilen premium spor giyim & supplement. Old School zihniyeti, modern güç." },
    ],
  }),
  component: Home,
});

/* ── Marquee items ──────────────────────────────────────────────────── */
const marqueeItems = [
  "DİSİPLİNDEN DÖVÜLMÜŞ", "PREMİUM SPOR GİYİM", "IRON SUPPLEMENT",
  "ALMANYA'DA ÜRETİLDİ",  "UZLAŞMA YOK",        "300 GSM PAMUK",
  "SAF PROTEİN",           "OLD SCHOOL ZİHNİYETİ", "LAB ONAYLI",
];

const pressItems = [
  "ISO 17025", "ALMANYA ÜRETİMİ", "300 GSM PAMUK", "SAF PROTEİN", "LAB ONAYLI",
];

const testimonials = [
  {
    quote: "Kumaşın kalitesi rakipsiz. Her antrenmanda farkı hissediyorsun.",
    name: "Mehmet Yılmaz",
    role: "Powerlifter · İstanbul",
  },
  {
    quote: "Iron Whey şimdiye kadar içtiğim en iyi protein. Şişkinlik yok, maksimum emilim.",
    name: "Seda Kaya",
    role: "Kişisel Antrenör · Ankara",
  },
  {
    quote: "Old Iron modern fitness dünyasında özlediğim şeyi sunuyor: gerçek disiplin, gerçek kalite.",
    name: "Burak Şahin",
    role: "Bodybuilder · İzmir",
  },
];

/* ── Reveal hook ────────────────────────────────────────────────────── */
function useReveal() {
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
      .querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── Main Component ─────────────────────────────────────────────────── */
function Home() {
  useReveal();
  const add = useCart((s) => s.add);

  const topSellers = products.slice(0, 4);
  const newReleases = products.slice(4, 8);
  const heroProduct = products[0];

  return (
    <div
      style={{ background: "#ffffff", color: "#111111", minHeight: "100vh", overflowX: "hidden" }}
    >
      {/* ══════════════════════════════════════════════════════════
          1. ANNOUNCEMENT BAR
      ══════════════════════════════════════════════════════════ */}
      <div className="announcement-bar">
        <span>1500₺ üzeri ücretsiz kargo · Almanya kalitesi · Lab onaylı</span>
      </div>

      {/* ══════════════════════════════════════════════════════════
          2. NAV
      ══════════════════════════════════════════════════════════ */}
      <Nav />

      {/* ══════════════════════════════════════════════════════════
          3. HERO — full-bleed, text overlay bottom-left, card right
      ══════════════════════════════════════════════════════════ */}
      <section className="hero-section">
        {/* Background image */}
        <img
          src="/images/hero-end.jpg"
          alt="OLD IRON Hero"
          className="hero-bg"
        />
        <div className="hero-overlay" />

        {/* Bottom-left: badge + headline + subhead */}
        <div className="hero-content-left">
          <div className="anim-1 mb-4">
            <span className="badge badge-new">YENİ</span>
          </div>
          <h1 className="anim-2 hero-headline">
            disiplinden<br />dövülmüş.
          </h1>
          <p
            className="anim-3"
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.8)",
              letterSpacing: "-0.04em",
              marginTop: "16px",
              lineHeight: 1.4,
            }}
          >
            Premium spor giyim & supplement.<br />
            Almanya'da üretildi.
          </p>
          <div className="anim-4" style={{ marginTop: "28px" }}>
            <Link
              to="/shop"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#ffffff",
                color: "#111111",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "-0.04em",
                padding: "12px 24px",
                borderRadius: "10px",
                textDecoration: "none",
              }}
            >
              Alışverişe Başla
            </Link>
          </div>
        </div>

        {/* Bottom-right: floating product card */}
        <div className="hero-product-card anim-5" style={{ display: "none" as const }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "16px" }}>
            <img
              src={heroProduct?.image || APPAREL_PLACEHOLDER}
              alt={heroProduct?.name}
              style={{ width: 60, height: 60, borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
            />
            <div>
              <p style={{ fontSize: "16px", fontWeight: 600, color: "#111111", letterSpacing: "-0.04em", lineHeight: 1.2 }}>
                {heroProduct?.name}
              </p>
              <p className="text-brand-credit" style={{ marginTop: "4px" }}>By OLD IRON</p>
              <p className="text-price-lg" style={{ marginTop: "4px" }}>₺{heroProduct?.price.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (heroProduct) {
                add(heroProduct, heroProduct.type === "apparel" ? "M" : "Standart");
                toast.success(`${heroProduct.name} sepete eklendi`);
              }
            }}
            style={{
              width: "100%",
              background: "#111111",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Sepete Ekle
          </button>
        </div>

        {/* Desktop: show hero product card */}
        <style>{`
          @media (min-width: 768px) {
            .hero-product-card { display: block !important; }
          }
        `}</style>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. MARQUEE BAND
      ══════════════════════════════════════════════════════════ */}
      <div style={{ background: "#111111", padding: "14px 0", overflow: "hidden" }}>
        <div className="flex whitespace-nowrap marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center" style={{ gap: "24px", padding: "0 24px" }}>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: "11px",
                  color: "#ffffff",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                {item}
              </span>
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "6px" }}>■</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          5. RANKED EDITORIAL GRID — "En Çok Satanlar"
      ══════════════════════════════════════════════════════════ */}
      <section style={{ background: "#ffffff", padding: "80px 0" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 72px" }}>

          {/* Header */}
          <div className="reveal" style={{ marginBottom: "40px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <p className="text-eyebrow" style={{ marginBottom: "8px" }}>Sıralama</p>
              <h2
                style={{
                  fontSize: "clamp(32px,4vw,40px)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.0,
                  color: "#111111",
                }}
              >
                En Çok Satanlar
              </h2>
            </div>
            <Link to="/shop" className="link-underline" style={{ fontSize: "13px", fontWeight: 500, color: "#737780", letterSpacing: "-0.04em", textDecoration: "none" }}>
              Tümünü Gör
            </Link>
          </div>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "12px",
            }}
          >
            {topSellers.map((p, i) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                className="ranked-card reveal"
                style={{
                  textDecoration: "none",
                  transitionDelay: `${i * 60}ms`,
                  display: "block",
                }}
              >
                {/* Rank watermark */}
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <span className="rank-numeral">{i + 1}</span>

                  {/* Badge */}
                  {p.badge && (
                    <span
                      className="badge badge-new"
                      style={{ position: "absolute", top: "0", left: "0", zIndex: 3 }}
                    >
                      YENİ
                    </span>
                  )}

                  {/* Product image */}
                  <div
                    style={{
                      aspectRatio: "1 / 1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {p.video ? (
                      <ProductVideo
                        src={p.video}
                        poster={p.videoPoster}
                        alt={p.name}
                        loop={p.type === "apparel"}
                        className="w-full h-full object-cover"
                        style={{ borderRadius: 0 }}
                      />
                    ) : (
                      <img
                        src={p.image || (p.type === "apparel" ? APPAREL_PLACEHOLDER : SUPPLEMENT_PLACEHOLDER)}
                        alt={p.name}
                        loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                  </div>
                </div>

                {/* Metadata */}
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
                  <p className="text-price" style={{ marginTop: "6px" }}>₺{p.price.toFixed(2)}</p>
                </div>

                {/* Quick add */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    add(p, p.type === "apparel" ? "M" : "Standart");
                    toast.success(`${p.name} sepete eklendi`);
                  }}
                  style={{
                    width: "100%",
                    marginTop: "12px",
                    background: "#111111",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "-0.04em",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    opacity: 0,
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                >
                  Sepete Ekle
                </button>
              </Link>
            ))}
          </div>

          {/* See all */}
          <div style={{ marginTop: "24px" }}>
            <Link to="/shop" className="btn-see-all">
              Tüm Ürünleri Gör
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. NEW RELEASES — standard product grid
      ══════════════════════════════════════════════════════════ */}
      <section style={{ background: "#ecedee", padding: "80px 0" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 72px" }}>

          <div className="reveal" style={{ marginBottom: "40px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <p className="text-eyebrow" style={{ marginBottom: "8px" }}>Koleksiyon</p>
              <h2
                style={{
                  fontSize: "clamp(32px,4vw,40px)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.0,
                  color: "#111111",
                }}
              >
                Yeni Gelenler
              </h2>
            </div>
            <Link to="/shop" className="link-underline" style={{ fontSize: "13px", fontWeight: 500, color: "#737780", letterSpacing: "-0.04em", textDecoration: "none" }}>
              Tümünü Gör
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "12px",
            }}
          >
            {newReleases.map((p, i) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                className="product-card reveal"
                style={{
                  textDecoration: "none",
                  transitionDelay: `${i * 60}ms`,
                  display: "block",
                  background: "#ffffff",
                }}
              >
                {/* Badge */}
                {p.badge && (
                  <span
                    className="badge badge-new"
                    style={{ position: "absolute", top: "12px", left: "12px", zIndex: 3 }}
                  >
                    YENİ
                  </span>
                )}

                {/* Image */}
                <div style={{ aspectRatio: "4/5", overflow: "hidden" }}>
                  {p.video ? (
                    <ProductVideo
                      src={p.video}
                      poster={p.videoPoster}
                      alt={p.name}
                      loop={p.type === "apparel"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={p.image || (p.type === "apparel" ? APPAREL_PLACEHOLDER : SUPPLEMENT_PLACEHOLDER)}
                      alt={p.name}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                </div>

                {/* Metadata */}
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
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                    <span className="text-price">₺{p.price.toFixed(2)}</span>
                    {p.originalPrice && (
                      <span className="text-price-strike">₺{p.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    add(p, p.type === "apparel" ? "M" : "Standart");
                    toast.success(`${p.name} sepete eklendi`);
                  }}
                  style={{
                    width: "100%",
                    marginTop: "12px",
                    background: "#111111",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "-0.04em",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    opacity: 0,
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                >
                  Sepete Ekle
                </button>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: "24px" }}>
            <Link to="/shop" className="btn-see-all" style={{ background: "#ecedee", borderColor: "#d7d7d7" }}>
              Tüm Yeni Ürünleri Gör
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          7. CREDENTIALS / PRESS BAR
      ══════════════════════════════════════════════════════════ */}
      <div style={{ background: "#111111", padding: "0" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 72px" }}>
          <p
            className="font-mono"
            style={{
              fontSize: "12px",
              color: "#737780",
              letterSpacing: "0",
              paddingTop: "24px",
              paddingBottom: "12px",
            }}
          >
            Öne Çıkan
          </p>
        </div>
        <div
          style={{
            height: "76px",
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              maxWidth: "1440px",
              margin: "0 auto",
              padding: "0 72px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "40px",
            }}
          >
            {pressItems.map((item) => (
              <span
                key={item}
                className="font-mono"
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.6)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          8. BRAND MANIFESTO — dark, large type
      ══════════════════════════════════════════════════════════ */}
      <section style={{ background: "#111111", padding: "120px 72px", overflow: "hidden" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
          <p
            className="reveal"
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              marginBottom: "48px",
            }}
          >
            — Manifesto —
          </p>

          <h2
            className="reveal"
            style={{
              fontSize: "clamp(48px, 8vw, 96px)",
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 1.0,
              color: "#ffffff",
              textTransform: "lowercase",
              maxWidth: "1000px",
              marginBottom: "64px",
            }}
          >
            disiplinden<br />
            dövülmüş.
          </h2>

          <div
            className="reveal"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              paddingTop: "40px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <p
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6,
                letterSpacing: "-0.04em",
                maxWidth: "480px",
              }}
            >
              OLD IRON sadece bir marka değil, bir yaşam felsefesidir.
              Almanya'nın mühendislik disipliniyle salonların tozu birleşiyor.
              En iyi ekipman, en saf içerik.
            </p>
            <Link
              to="/shop"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "-0.04em",
                color: "#ffffff",
                textDecoration: "none",
                alignSelf: "flex-start",
              }}
              className="link-underline"
            >
              Koleksiyonu Keşfet
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          9. TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section style={{ background: "#ecedee", padding: "80px 0" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 72px" }}>
          <div className="reveal" style={{ marginBottom: "40px" }}>
            <p className="text-eyebrow" style={{ marginBottom: "8px" }}>Topluluk</p>
            <h2
              style={{
                fontSize: "clamp(32px,4vw,40px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1.0,
                color: "#111111",
              }}
            >
              Sporcuların Yorumları
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "12px",
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="reveal"
                style={{
                  background: "#ffffff",
                  borderRadius: "10px",
                  padding: "32px",
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: "3px", marginBottom: "20px" }}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span
                      key={s}
                      style={{ color: "#000aff", fontSize: "14px" }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p
                  style={{
                    fontSize: "16px",
                    color: "#111111",
                    lineHeight: 1.6,
                    letterSpacing: "-0.04em",
                    marginBottom: "28px",
                  }}
                >
                  "{t.quote}"
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    paddingTop: "20px",
                    borderTop: "1px solid #d7d7d7",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      background: "#000aff",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#ffffff",
                        lineHeight: 1,
                      }}
                    >
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#111111",
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {t.name}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#737780",
                        letterSpacing: "-0.04em",
                        marginTop: "2px",
                      }}
                    >
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          10. NEWSLETTER — centered, minimal
      ══════════════════════════════════════════════════════════ */}
      <section style={{ background: "#ffffff", padding: "80px 20px", borderTop: "1px solid #d7d7d7" }}>
        <div
          className="reveal"
          style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}
        >
          <p className="text-eyebrow" style={{ marginBottom: "16px" }}>Özel Üyelik</p>
          <h2
            style={{
              fontSize: "clamp(28px,4vw,40px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
              color: "#111111",
              marginBottom: "12px",
            }}
          >
            Elitin Bir Parçası Ol
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "#737780",
              letterSpacing: "-0.04em",
              lineHeight: 1.5,
              marginBottom: "32px",
            }}
          >
            Sınırlı stok · Erken erişim · Üyeye özel indirimler
          </p>

          <form
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Hoş geldin — elitin bir parçasısın.");
            }}
          >
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="email"
                required
                placeholder="E-posta adresin"
                style={{
                  flex: 1,
                  background: "#ecedee",
                  border: "none",
                  borderRadius: "10px",
                  padding: "14px 20px",
                  fontSize: "14px",
                  color: "#111111",
                  letterSpacing: "-0.04em",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#111111",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "-0.04em",
                  padding: "14px 24px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Kaydol
              </button>
            </div>
          </form>

          <p
            style={{
              fontSize: "10px",
              color: "rgba(115,119,128,0.5)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginTop: "16px",
            }}
          >
            Spam yok. İstediğin zaman ayrılabilirsin.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          11. FOOTER
      ══════════════════════════════════════════════════════════ */}
      <Footer />
    </div>
  );
}
