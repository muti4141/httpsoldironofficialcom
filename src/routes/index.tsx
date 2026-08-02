import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RevealText } from "@/components/RevealText";
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

/* ₺849,00 biçimi */
const tl = (n: number) => `₺${n.toFixed(2).replace(".", ",")}`;

const pressItems = ["ISO 17025", "ALMANYA ÜRETİMİ", "300 GSM", "SAF PROTEİN", "LAB ONAYLI"];

/* ── Scroll reveal ─────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      }),
      { threshold: 0.06, rootMargin: "0px 0px -50px 0px" }
    );
    document
      .querySelectorAll(".reveal,.reveal-blur,.reveal-wipe,.press-item")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── Ürün görseli: gerçek foto varsa o, yoksa plaster sahnede logo ── */
function ProductVisual({ ratio = "1 / 1", p }: { ratio?: string; p?: Product }) {
  if (p?.gallery?.length) {
    return (
      <img
        src={p.gallery[0]}
        alt={p.name}
        loading="lazy"
        style={{
          aspectRatio: ratio, width: "100%", objectFit: "cover",
          borderRadius: "10px", display: "block", position: "relative", zIndex: 1,
        }}
      />
    );
  }
  return (
    <div
      style={{
        aspectRatio: ratio, borderRadius: "10px", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 20px", position: "relative", zIndex: 1,
      }}
    >
      <img
        src="/images/logo.png"
        alt=""
        aria-hidden
        style={{
          width: "60%", maxHeight: "70%", objectFit: "contain",
          filter: "invert(1) brightness(0.25)",
        }}
      />
    </div>
  );
}

/* ── Kart metadata: OI çipi + isim + kredi + fiyat (sol hizalı) ───── */
function CardMeta({ p }: { p: Product }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginTop: "16px", textAlign: "left" }}>
      <span
        aria-hidden
        style={{
          width: 40, height: 40, flexShrink: 0,
          background: "#ffffff", border: "1px solid #ecedee", borderRadius: "4px",
          display: "inline-flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
        }}
      >
        <img src="/images/logo.png" alt="" style={{ width: "70%", filter: "invert(1) brightness(0.2)" }} />
      </span>
      <div style={{ minWidth: 0 }}>
        <p style={{
          fontSize: "16px", fontWeight: 600, letterSpacing: "-0.04em", color: "#111111",
          lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {p.name}
        </p>
        <p className="text-brand-credit" style={{ marginTop: "2px" }}>By OLD IRON</p>
        <p className="text-price" style={{ marginTop: "4px" }}>{tl(p.price)}</p>
      </div>
    </div>
  );
}

/* ── Bölüm başlığı + karusel okları ────────────────────────────────── */
function SectionHeader({ title, onPrev, onNext }: { title: string; onPrev?: () => void; onNext?: () => void }) {
  return (
    <div className="reveal-wipe" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "32px" }}>
      <RevealText
        as="h2"
        text={title}
        style={{ fontSize: "20px", fontWeight: 600, letterSpacing: "-0.04em", color: "#111111", textTransform: "lowercase" }}
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

/* ══════════════════════════════════════════════════════════════════ */
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
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 300) + 16), behavior: "smooth" });
  };

  const quickAdd = (p: Product) => {
    add(p, p.type === "apparel" ? "M" : "Standart");
    toast.success(`${p.name} sepete eklendi`);
  };

  return (
    <div style={{ background: "#ffffff", color: "#111111", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── Duyuru barı ── */}
      <div className="announcement-bar">
        <span>1500₺ üzeri ücretsiz kargo · Almanya kalitesi · Lab onaylı</span>
      </div>

      <Nav />

      {/* ════════════════════════════════════════════════
          HERO — tam ekran VİDEO, spec'in foto hero'su
      ════════════════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "#111111" }}>
        <video
          src="/videos/hero.mp4"
          autoPlay muted loop playsInline
          data-parallax="0.12"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Alt üçte-bir okunurluk gradyanı */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 42%, rgba(0,0,0,0.05) 100%)",
          }}
        />

        {/* Sol-alt yığın */}
        <div style={{ position: "absolute", left: "clamp(20px, 4vw, 52px)", bottom: "clamp(36px, 7vh, 72px)", zIndex: 5, maxWidth: "760px" }}>
          <span className="badge badge-new anim-1" style={{ display: "inline-flex", marginBottom: "20px" }}>YENİ</span>
          <h1 style={{
            fontSize: "clamp(64px, 9vw, 128px)", fontWeight: 700, letterSpacing: "-0.04em",
            lineHeight: 1.0, color: "#ffffff", textTransform: "lowercase",
          }}>
            <span className="line-rise" style={{ display: "block", animationDelay: "0.12s" }}>disiplinden</span>
            <span className="line-rise" style={{ display: "block", animationDelay: "0.28s" }}>dövülmüş.</span>
          </h1>
          <p className="anim-4" style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", letterSpacing: "-0.04em", marginTop: "16px", lineHeight: 1.4 }}>
            Premium spor giyim & supplement. Almanya'da üretildi.
          </p>
        </div>

        {/* Sağ yüzen ürün kartı */}
        <div
          className="anim-5"
          style={{
            position: "absolute", right: "clamp(20px, 4vw, 52px)", bottom: "clamp(36px, 7vh, 72px)",
            zIndex: 5, width: "280px", background: "#ffffff", borderRadius: "14.4px", padding: "20px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "16px" }}>
            <span style={{
              width: 60, height: 60, borderRadius: "10px", background: "#ecedee", flexShrink: 0,
              display: "inline-flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
            }}>
              {heroProduct.gallery?.length ? (
                <img src={heroProduct.gallery[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <img src="/images/logo.png" alt="" style={{ width: "65%", filter: "invert(1) brightness(0.2)" }} />
              )}
            </span>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.04em", color: "#111111", lineHeight: 1.2 }}>
                {heroProduct.name}
              </p>
              <p className="text-brand-credit" style={{ marginTop: "4px" }}>By OLD IRON</p>
              <p className="text-price-lg" style={{ marginTop: "4px", fontWeight: 600 }}>{tl(heroProduct.price)}</p>
            </div>
          </div>
          <Link
            to="/product/$id"
            params={{ id: heroProduct.id }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "100%", background: "#111111", color: "#ffffff",
              fontSize: "14px", fontWeight: 600, letterSpacing: "-0.04em",
              padding: "10px 20px", borderRadius: "10px", textDecoration: "none",
            }}
          >
            İncele: {heroProduct.name.split(" ")[0].toLocaleLowerCase("tr")}
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SIRALI GRID — haftanın en çok satanları
      ════════════════════════════════════════════════ */}
      <section style={{ background: "#ffffff", padding: "96px 0 48px" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 clamp(20px, 4vw, 52px)" }}>
          <SectionHeader title="haftanın en çok satanları" onPrev={() => scrollRanked(-1)} onNext={() => scrollRanked(1)} />

          <div
            ref={rankedRef}
            className="drag-scroll"
            style={{ display: "flex", gap: "16px", overflowX: "auto", scrollSnapType: "x mandatory" }}
          >
            {ranked.map((p, i) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                className="ranked-card reveal-blur"
                style={{
                  flex: "0 0 clamp(260px, 24vw, 340px)", scrollSnapAlign: "start",
                  textDecoration: "none", transitionDelay: `${i * 70}ms`, display: "block",
                }}
              >
                <span className="rank-numeral" data-parallax="-0.2">{i + 1}</span>
                <ProductVisual p={p} />
                <CardMeta p={p} />
                <button
                  className="card-add-btn"
                  onClick={(e) => { e.preventDefault(); quickAdd(p); }}
                >
                  Sepete Ekle
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          STANDART GRID — yeni gelenler
      ════════════════════════════════════════════════ */}
      <section style={{ background: "#ffffff", padding: "48px 0 96px" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 clamp(20px, 4vw, 52px)" }}>
          <SectionHeader title="yeni gelenler" />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {fresh.map((p, i) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                className="product-card reveal-blur"
                style={{ textDecoration: "none", transitionDelay: `${i * 70}ms`, display: "block", position: "relative" }}
              >
                {p.badge && (
                  <span className="badge badge-new" style={{ position: "absolute", top: "12px", left: "12px", zIndex: 3 }}>
                    YENİ
                  </span>
                )}
                <ProductVisual p={p} />
                <CardMeta p={p} />
                <button
                  className="card-add-btn"
                  onClick={(e) => { e.preventDefault(); quickAdd(p); }}
                >
                  Sepete Ekle
                </button>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: "32px" }}>
            <Link to="/shop" className="btn-see-all">Tümünü Gör</Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          PRESS BARI — güvence standartları
      ════════════════════════════════════════════════ */}
      <section style={{ padding: "48px 0 0" }}>
        <p className="text-brand-credit" style={{ textAlign: "center", marginBottom: "24px" }}>
          Güvence standartlarımız
        </p>
        <div style={{
          background: "#111111", minHeight: "100px",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexWrap: "wrap", gap: "clamp(24px, 5vw, 72px)", padding: "32px clamp(20px, 4vw, 52px)",
        }}>
          {pressItems.map((item, i) => (
            <span
              key={item}
              className="press-item"
              style={{
                fontWeight: 700, fontSize: "clamp(14px, 2vw, 22px)", letterSpacing: "-0.04em",
                color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap", transitionDelay: `${i * 90}ms`,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          COBALT CLAIM — tek renk anı
      ════════════════════════════════════════════════ */}
      <section style={{ background: "#000aff", padding: "120px clamp(20px, 4vw, 52px)" }}>
        <RevealText
          text="disiplinden dövülmüş."
          once={false}
          stagger={120}
          style={{
            fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 700, letterSpacing: "-0.04em",
            lineHeight: 1.0, color: "#ffffff", textAlign: "center", textTransform: "lowercase",
          }}
        />
      </section>

      {/* ════════════════════════════════════════════════
          BÜLTEN
      ════════════════════════════════════════════════ */}
      <section style={{ background: "#ffffff", padding: "96px 20px" }}>
        <div className="reveal" style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
          <RevealText
            text="elitin bir parçası ol"
            style={{
              fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 700, letterSpacing: "-0.04em",
              lineHeight: 1.05, color: "#111111", textTransform: "lowercase", marginBottom: "12px",
            }}
          />
          <p className="text-brand-credit" style={{ marginBottom: "32px" }}>
            Sınırlı stok · Erken erişim · Üyeye özel indirimler
          </p>
          <form
            style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}
            onSubmit={(e) => { e.preventDefault(); toast.success("Hoş geldin — elitin bir parçasısın."); }}
          >
            <input
              type="email" required placeholder="E-posta adresin"
              style={{
                flexGrow: 1, minWidth: "220px", background: "#ecedee", border: "none",
                borderRadius: "10px", padding: "14px 18px", fontSize: "14px",
                color: "#111111", letterSpacing: "-0.04em", outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#111111", color: "#ffffff", fontSize: "14px", fontWeight: 600,
                letterSpacing: "-0.04em", padding: "14px 28px", borderRadius: "10px",
                border: "none", cursor: "pointer",
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
