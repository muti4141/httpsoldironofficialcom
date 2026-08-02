import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RevealText } from "@/components/RevealText";
import { ProductPlate } from "@/components/ProductPlate";
import { useParallax } from "@/components/SmoothScroll";
import { products, type Product } from "@/data/products";
import { useEffect, useRef } from "react";
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

/* ── Data ───────────────────────────────────────────────────────────── */
const pressItems = [
  "ISO 17025", "ALMANYA ÜRETİMİ", "300 GSM", "SAF PROTEİN", "LAB ONAYLI",
];

const testimonials = [
  { quote: "Kumaşın kalitesi rakipsiz. Her antrenmanda farkı hissediyorsun.", name: "Mehmet Yılmaz", role: "Powerlifter · İstanbul" },
  { quote: "Iron Whey şimdiye kadar içtiğim en iyi protein. Şişkinlik yok, maksimum emilim.", name: "Seda Kaya", role: "Kişisel Antrenör · Ankara" },
  { quote: "Old Iron modern fitness dünyasında özlediğim şeyi sunuyor: gerçek disiplin, gerçek kalite.", name: "Burak Şahin", role: "Bodybuilder · İzmir" },
];

/* ── Fiyat formatı: ₺849,00 ─────────────────────────────────────────── */
const tl = (n: number) => `₺${n.toFixed(2).replace(".", ",")}`;

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
      .querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale,.reveal-wipe,.reveal-blur,.press-item")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── Bölüm başlığı + ok çifti ───────────────────────────────────────── */
function SectionHeader({
  title,
  onPrev,
  onNext,
}: {
  title: string;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  return (
    <div
      className="reveal-wipe"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        marginBottom: "32px",
      }}
    >
      <RevealText
        as="h2"
        text={title}
        style={{
          fontSize: "20px",
          fontWeight: 600,
          letterSpacing: "-0.04em",
          color: "#111111",
          textTransform: "lowercase",
        }}
      />
      {onPrev && onNext && (
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="carousel-arrow" onClick={onPrev} aria-label="Önceki">
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <button className="carousel-arrow" onClick={onNext} aria-label="Sonraki">
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Kart metadata kümesi ───────────────────────────────────────────── */
function CardMeta({ product: p }: { product: Product }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginTop: "16px", textAlign: "left" }}>
      <span
        aria-hidden
        style={{
          width: 40, height: 40, flexShrink: 0,
          background: "#ffffff", border: "1px solid #ecedee", borderRadius: "4px",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", fontWeight: 700, letterSpacing: "-0.04em", color: "#111111",
        }}
      >
        OI
      </span>
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontSize: "16px", fontWeight: 600, letterSpacing: "-0.04em",
            color: "#111111", lineHeight: 1.2,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}
        >
          {p.name}
        </p>
        <p className="text-brand-credit" style={{ marginTop: "2px" }}>By OLD IRON</p>
        <p className="text-price" style={{ marginTop: "4px" }}>{tl(p.price)}</p>
      </div>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────────────── */
function Home() {
  useReveal();
  useParallax();
  const add = useCart((s) => s.add);

  const ranked = products.slice(0, 4);
  const fresh  = products.slice(4, 8);
  const heroProduct = products[0];

  const rankedRef = useRef<HTMLDivElement>(null);
  const scrollRanked = (dir: 1 | -1) => {
    const el = rankedRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const quickAdd = (p: Product) => {
    add(p, p.type === "apparel" ? "M" : "Standart");
    toast.success(`${p.name} sepete eklendi`);
  };

  return (
    <div style={{ background: "#ffffff", color: "#111111", minHeight: "100vh", overflowX: "hidden" }}>

      {/* 1 ── ANNOUNCEMENT BAR */}
      <div className="announcement-bar">
        <span>1500₺ üzeri ücretsiz kargo · Almanya kalitesi · Lab onaylı</span>
      </div>

      {/* 2 ── NAV */}
      <Nav />

      {/* 3 ── HERO — plaster tam ekran sahne */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          background: "#ecedee",
          overflow: "hidden",
          paddingTop: "92px",
        }}
      >
        {/* Sahne objesi — sağa yerleşik, multiply, Ken Burns + parallax */}
        <div
          aria-hidden
          data-parallax="0.15"
          style={{
            position: "absolute",
            top: 0, right: 0, bottom: 0,
            width: "62%",
            overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <img
            src="/images/hero-end.jpg"
            alt=""
            className="hero-kenburns"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center",
              mixBlendMode: "multiply",
            }}
          />
        </div>

        {/* Sol-alt içerik yığını */}
        <div className="hero-content-left" style={{ left: "clamp(20px, 4vw, 52px)", bottom: "clamp(32px, 6vh, 64px)" }}>
          <span className="badge badge-new anim-1" style={{ marginBottom: "20px", display: "inline-flex" }}>
            YENİ
          </span>
          <h1 className="hero-headline" style={{ fontSize: "clamp(64px, 9vw, 128px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 0.95, color: "#111111", textTransform: "lowercase" }}>
            <span style={{ display: "block", animationDelay: "0.15s" }}>disiplinden</span>
            <span style={{ display: "block", animationDelay: "0.30s" }}>dövülmüş.</span>
          </h1>
          <p
            className="anim-4"
            style={{
              marginTop: "20px",
              fontSize: "16px",
              letterSpacing: "-0.04em",
              lineHeight: 1.5,
              color: "rgba(17,17,17,0.8)",
              maxWidth: "420px",
            }}
          >
            Premium spor giyim & supplement. Almanya'da üretildi.
          </p>
        </div>

        {/* Sağ-alt yüzen ürün kartı */}
        <div className="hero-product-card anim-5" style={{ right: "clamp(20px, 4vw, 52px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              aria-hidden
              style={{
                width: 60, height: 60, flexShrink: 0,
                background: "#ecedee", borderRadius: "10px",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", fontWeight: 700, letterSpacing: "-0.04em", color: "#111111",
              }}
            >
              {heroProduct.name.replace(/[^A-Za-zÇĞİÖŞÜçğıöşü]/g, "").charAt(0).toLocaleUpperCase("tr")}
            </span>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.04em", color: "#111111", lineHeight: 1.2 }}>
                {heroProduct.name}
              </p>
              <p className="text-brand-credit" style={{ marginTop: "2px" }}>By OLD IRON</p>
              <p className="text-price-lg" style={{ marginTop: "4px", fontWeight: 600 }}>{tl(heroProduct.price)}</p>
            </div>
          </div>
          <Link
            to="/product/$id"
            params={{ id: heroProduct.id }}
            className="btn-sweep"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              marginTop: "16px", width: "100%",
              background: "#111111", color: "#ffffff",
              fontSize: "13px", fontWeight: 600, letterSpacing: "-0.04em",
              padding: "12px", borderRadius: "10px", textDecoration: "none",
            }}
          >
            İncele: {heroProduct.name}
          </Link>
        </div>
      </section>

      {/* 4 ── HAFTANIN EN ÇOK SATANLARI — sıralı editoryal ızgara */}
      <section style={{ padding: "100px 0 0" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 clamp(20px, 4vw, 52px)" }}>
          <SectionHeader
            title="haftanın en çok satanları"
            onPrev={() => scrollRanked(-1)}
            onNext={() => scrollRanked(1)}
          />

          <div
            ref={rankedRef}
            className="drag-scroll"
            style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
            }}
          >
            {ranked.map((p, i) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                className="ranked-card reveal-blur"
                style={{
                  flex: "0 0 clamp(280px, 24vw, 340px)",
                  scrollSnapAlign: "start",
                  textDecoration: "none",
                  transitionDelay: `${i * 70}ms`,
                  display: "block",
                }}
              >
                <span
                  className="rank-numeral"
                  data-parallax="-0.2"
                  style={{ fontSize: "clamp(200px, 18vw, 280px)", color: "rgba(255,255,255,0.6)" }}
                >
                  {i + 1}
                </span>

                <div style={{ position: "relative", zIndex: 1, marginTop: "40px" }}>
                  <ProductPlate product={p} ratio="1 / 1" />
                </div>

                <div style={{ position: "relative", zIndex: 3 }}>
                  <CardMeta product={p} />
                  <button
                    className="card-add-btn"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); quickAdd(p); }}
                    aria-label={`${p.name} sepete ekle`}
                  >
                    Sepete Ekle
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5 ── YENİ GELENLER — standart ızgara */}
      <section style={{ padding: "100px 0" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 clamp(20px, 4vw, 52px)" }}>
          <SectionHeader title="yeni gelenler" />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {fresh.map((p, i) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                className="product-card reveal-blur"
                style={{
                  textDecoration: "none",
                  transitionDelay: `${i * 70}ms`,
                  display: "block",
                  background: "#ecedee",
                  position: "relative",
                }}
              >
                {p.badge && (
                  <span className="badge badge-new" style={{ position: "absolute", top: "12px", left: "12px", zIndex: 3 }}>
                    YENİ
                  </span>
                )}
                <ProductPlate product={p} ratio="4 / 5" />
                <CardMeta product={p} />
                <button
                  className="card-add-btn"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); quickAdd(p); }}
                  aria-label={`${p.name} sepete ekle`}
                >
                  Sepete Ekle
                </button>
              </Link>
            ))}
          </div>

          <div className="reveal" style={{ marginTop: "32px" }}>
            <Link to="/shop" className="btn-see-all">
              Tümünü Gör
            </Link>
          </div>
        </div>
      </section>

      {/* 6 ── GÜVENCE BARI (press) */}
      <section>
        <p className="text-brand-credit reveal" style={{ textAlign: "center", marginBottom: "24px" }}>
          Güvence standartlarımız
        </p>
        <div
          style={{
            background: "#111111",
            minHeight: "100px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-evenly",
            gap: "24px",
            padding: "24px clamp(20px, 4vw, 52px)",
          }}
        >
          {pressItems.map((item, i) => (
            <span
              key={item}
              className="press-item"
              style={{
                fontWeight: 700,
                fontSize: "clamp(16px, 2.2vw, 24px)",
                letterSpacing: "-0.04em",
                color: "rgba(255,255,255,0.6)",
                transitionDelay: `${i * 90}ms`,
                whiteSpace: "nowrap",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* 7 ── COBALT CLAIM */}
      <section style={{ background: "#000aff", padding: "120px clamp(20px, 4vw, 52px)", marginTop: "100px" }}>
        <RevealText
          text="disiplinden dövülmüş."
          once={false}
          stagger={120}
          style={{
            textAlign: "center",
            fontSize: "clamp(48px, 8vw, 96px)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            color: "#ffffff",
            textTransform: "lowercase",
          }}
        />
      </section>

      {/* 8 ── YORUMLAR — plaster bant */}
      <section style={{ background: "#ecedee", padding: "100px 0" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 clamp(20px, 4vw, 52px)" }}>
          <SectionHeader title="sporcuların yorumları" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="testimonial-card reveal-blur"
                style={{
                  background: "#ffffff",
                  borderRadius: "10px",
                  padding: "28px",
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <div style={{ display: "flex", gap: "3px", marginBottom: "20px" }}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span
                      key={s}
                      className="material-symbols-outlined"
                      style={{ fontSize: 14, color: "#000aff", fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: "16px", lineHeight: 1.5, letterSpacing: "-0.04em", color: "#111111", marginBottom: "24px" }}>
                  "{t.quote}"
                </p>
                <div style={{ paddingTop: "16px", borderTop: "1px solid #ecedee" }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "-0.04em", color: "#111111" }}>{t.name}</p>
                  <p className="text-brand-credit" style={{ marginTop: "2px" }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9 ── BÜLTEN */}
      <section style={{ background: "#ffffff", padding: "120px 20px" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
          <RevealText
            text="elitin bir parçası ol"
            style={{
              fontSize: "clamp(32px, 5vw, 40px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "#111111",
              textTransform: "lowercase",
              textAlign: "center",
              marginBottom: "16px",
            }}
          />
          <p className="text-brand-credit reveal" style={{ marginBottom: "32px" }}>
            Sınırlı stok · Erken erişim · Üyeye özel indirimler
          </p>
          <form
            className="reveal"
            style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}
            onSubmit={(e) => { e.preventDefault(); toast.success("Hoş geldin — elitin bir parçasısın."); }}
          >
            <input
              type="email"
              required
              placeholder="E-posta adresin"
              aria-label="E-posta adresin"
              style={{
                flexGrow: 1,
                minWidth: "220px",
                background: "#ecedee",
                border: "none",
                borderRadius: "10px",
                padding: "14px 18px",
                fontSize: "14px",
                color: "#111111",
                letterSpacing: "-0.04em",
                outline: "none",
              }}
            />
            <button
              type="submit"
              className="btn-sweep"
              style={{
                background: "#111111",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "-0.04em",
                padding: "14px 28px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Kaydol
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
