import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RevealText } from "@/components/RevealText";
import { useParallax } from "@/components/SmoothScroll";
import { products, type Product } from "@/data/products";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/stores/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OLD IRON — Premium Spor Giyim & Elit Supplement" },
      { name: "description", content: "Almanya'da üretilen premium spor giyim ve lab onaylı elit supplement. 1500₺ üzeri ücretsiz kargo, 14 gün iade." },
    ],
  }),
  component: Home,
});

/* ₺500,00 biçimi */
const tl = (n: number) => `₺${n.toFixed(2).replace(".", ",")}`;

const FREE_SHIPPING = 1500;

const trustItems = [
  { icon: "local_shipping",     text: "1500₺ üzeri ücretsiz kargo" },
  { icon: "assignment_return",  text: "14 gün içinde iade" },
  { icon: "science",            text: "ISO 17025 lab onaylı" },
  { icon: "verified",           text: "Almanya'da üretildi" },
];

const testimonials = [
  { quote: "Kumaşın kalitesi rakipsiz. Her antrenmanda farkı hissediyorsun.", name: "Mehmet Yılmaz", role: "Powerlifter · İstanbul" },
  { quote: "Iron Whey içtiğim en iyi protein. Şişkinlik yok, maksimum emilim.", name: "Seda Kaya", role: "Kişisel Antrenör · Ankara" },
  { quote: "Gerçek disiplin, gerçek kalite. Aradığım buydu.", name: "Burak Şahin", role: "Bodybuilder · İzmir" },
];

const APPAREL_SIZES = ["S", "M", "L", "XL"];

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

/* ── Ürün görseli ──────────────────────────────────────────────────── */
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
        style={{ width: "60%", maxHeight: "70%", objectFit: "contain", filter: "invert(1) brightness(0.25)" }}
      />
    </div>
  );
}

/* ── Kart metadata ─────────────────────────────────────────────────── */
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

  const flagship = products[0];                          // gerçek fotoğraflı lansman ürünü
  const ranked   = products.slice(0, 4);
  const fresh    = products.slice(4, 8);

  const [size, setSize] = useState("L");
  const [added, setAdded] = useState(false);

  /* Hero açılışı: logo → yazı devri, scroll'a bağlı */
  const heroRef = useRef<HTMLDivElement>(null);
  const [hp, setHp] = useState(0);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setHp(1); return; }
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      setHp(total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0);
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const logoOut = Math.min(1, Math.max(0, hp / 0.42));           // logo çıkışı
  const textIn  = Math.min(1, Math.max(0, (hp - 0.30) / 0.30));  // yazı girişi

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

  const addFlagship = () => {
    add(flagship, size);
    toast.success(`${flagship.name} (${size}) sepete eklendi`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ background: "#ffffff", color: "#111111", minHeight: "100vh", overflowX: "hidden" }}>

      <Nav />

      {/* ════════════════════════════════════════════════
          1 — HERO: ne satıyoruz + net CTA
      ════════════════════════════════════════════════ */}
      <div ref={heroRef} style={{ position: "relative", height: "200vh" }}>
      <section style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#111111" }}>
        <video
          src="/videos/hero.mp4"
          autoPlay muted loop playsInline
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${1 + hp * 0.08})`,
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.22) 45%, rgba(0,0,0,0.06) 100%)",
          }}
        />

        {/* ── Açılış: LOGO ── */}
        <div
          aria-hidden={logoOut > 0.9}
          style={{
            position: "absolute", inset: 0, zIndex: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
            opacity: 1 - logoOut,
            transform: `scale(${1 - logoOut * 0.12}) translateY(${-logoOut * 40}px)`,
          }}
        >
          <img
            src="/images/logo.png"
            alt="OLD IRON"
            style={{
              width: "min(62vw, 620px)", maxHeight: "58vh", objectFit: "contain",
              filter: "drop-shadow(0 8px 40px rgba(0,0,0,.55))",
            }}
          />
        </div>

        {/* ── Devir: YAZI ── */}
        <div style={{
          position: "absolute", left: "clamp(20px, 4vw, 52px)", bottom: "clamp(36px, 7vh, 72px)",
          zIndex: 5, maxWidth: "780px",
          opacity: textIn,
          transform: `translateY(${(1 - textIn) * 40}px)`,
        }}>
          <span className="badge badge-new" style={{ display: "inline-flex", marginBottom: "20px" }}>
            LANSMAN
          </span>

          <h1 style={{
            fontSize: "clamp(56px, 8.5vw, 116px)", fontWeight: 700, letterSpacing: "-0.04em",
            lineHeight: 1.0, color: "#ffffff", textTransform: "lowercase",
          }}>
            <span style={{ display: "block" }}>disiplinden</span>
            <span style={{ display: "block" }}>dövülmüş.</span>
          </h1>

          <p style={{
            fontSize: "17px", color: "rgba(255,255,255,0.85)", letterSpacing: "-0.04em",
            marginTop: "18px", lineHeight: 1.4, maxWidth: "440px",
          }}>
            Premium spor giyim &amp; elit supplement. Almanya'da üretildi,
            Türkiye'ye 1–3 iş gününde teslim.
          </p>

          {/* CTA — hunideki ilk kapı */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", marginTop: "28px" }}>
            <Link
              to="/shop"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
                background: "#000aff", color: "#ffffff", fontSize: "15px", fontWeight: 600,
                letterSpacing: "-0.04em", padding: "16px 32px", borderRadius: "10px", textDecoration: "none",
              }}
            >
              Koleksiyonu Keşfet
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
            </Link>
            <span className="text-brand-credit" style={{ color: "rgba(255,255,255,0.6)" }}>
              {tl(flagship.price)}'den başlayan fiyatlar
            </span>
          </div>
        </div>

        {/* Kaydırma ipucu — logo aşamasında */}
        <div
          aria-hidden
          style={{
            position: "absolute", left: "50%", bottom: "32px", transform: "translateX(-50%)",
            zIndex: 6, opacity: (1 - logoOut) * 0.8,
            display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
            pointerEvents: "none",
          }}
        >
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: ".2em",
            textTransform: "uppercase", color: "rgba(255,255,255,.7)",
          }}>
            Kaydır
          </span>
          <span className="material-symbols-outlined animate-bounce-slow"
            style={{ fontSize: 20, color: "rgba(255,255,255,.7)" }}>expand_more</span>
        </div>

        {/* Yüzen ürün kartı — gerçek ürün, gerçek fiyat */}
        <div
          style={{
            position: "absolute", right: "clamp(20px, 4vw, 52px)", bottom: "clamp(36px, 7vh, 72px)",
            zIndex: 5, width: "280px", background: "#ffffff", borderRadius: "14.4px", padding: "20px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            opacity: textIn,
            transform: `translateY(${(1 - textIn) * 40}px)`,
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "16px" }}>
            <span style={{
              width: 60, height: 60, borderRadius: "10px", background: "#ecedee", flexShrink: 0,
              display: "inline-flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
            }}>
              {flagship.gallery?.length ? (
                <img src={flagship.gallery[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <img src="/images/logo.png" alt="" style={{ width: "65%", filter: "invert(1) brightness(0.2)" }} />
              )}
            </span>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.04em", color: "#111111", lineHeight: 1.2 }}>
                {flagship.name}
              </p>
              <p className="text-brand-credit" style={{ marginTop: "4px" }}>By OLD IRON</p>
              <p className="text-price-lg" style={{ marginTop: "4px", fontWeight: 600 }}>{tl(flagship.price)}</p>
            </div>
          </div>
          <Link
            to="/product/$id"
            params={{ id: flagship.id }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "100%", background: "#111111", color: "#ffffff",
              fontSize: "14px", fontWeight: 600, letterSpacing: "-0.04em",
              padding: "12px 20px", borderRadius: "10px", textDecoration: "none",
            }}
          >
            Ürünü İncele
          </Link>
        </div>
      </section>
      </div>

      {/* ════════════════════════════════════════════════
          2 — GÜVEN ŞERİDİ: itirazları hemen kapat
      ════════════════════════════════════════════════ */}
      <section style={{ background: "#ecedee", padding: "22px clamp(20px, 4vw, 52px)" }}>
        <div style={{
          maxWidth: "1440px", margin: "0 auto",
          display: "flex", flexWrap: "wrap", justifyContent: "space-between",
          gap: "16px 32px",
        }}>
          {trustItems.map((t) => (
            <div key={t.text} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#111111" }}>{t.icon}</span>
              <span style={{ fontSize: "13px", letterSpacing: "-0.04em", color: "#111111" }}>{t.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          3 — LANSMAN ÜRÜNÜ: ana sayfadan direkt satın alma
      ════════════════════════════════════════════════ */}
      <section style={{ background: "#ffffff", padding: "96px 0" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 clamp(20px, 4vw, 52px)" }}>
          <div className="flagship-grid">

            {/* Görseller */}
            <div className="reveal-blur">
              <div style={{ background: "#ecedee", borderRadius: "10px", overflow: "hidden", position: "relative" }}>
                <span className="badge badge-new" style={{ position: "absolute", top: "16px", left: "16px", zIndex: 3 }}>
                  LANSMAN ÜRÜNÜ
                </span>
                <img
                  src={flagship.gallery?.[0] ?? "/images/logo.png"}
                  alt={flagship.name}
                  style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block" }}
                />
              </div>
              {flagship.gallery && flagship.gallery.length > 1 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginTop: "10px" }}>
                  {flagship.gallery.slice(1, 5).map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt={`${flagship.name} açı ${i + 2}`}
                      loading="lazy"
                      style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: "10px", display: "block" }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Satın alma kutusu */}
            <div className="reveal-blur" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p className="text-eyebrow" style={{ marginBottom: "10px" }}>Giyim Koleksiyonu</p>

              <RevealText
                as="h2"
                text={flagship.name}
                style={{ fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.05, color: "#111111" }}
              />

              <p className="text-brand-credit" style={{ marginTop: "8px" }}>By OLD IRON</p>

              <p style={{ fontSize: "16px", lineHeight: 1.5, color: "#737780", letterSpacing: "-0.04em", marginTop: "16px", maxWidth: "440px" }}>
                {flagship.description}
              </p>

              <p className="text-price-lg" style={{ fontSize: "24px", fontWeight: 600, marginTop: "24px" }}>
                {tl(flagship.price)}
              </p>
              <p className="text-brand-credit" style={{ marginTop: "4px" }}>KDV dahil</p>

              {/* Beden */}
              <div style={{ marginTop: "24px" }}>
                <p className="text-eyebrow" style={{ marginBottom: "10px" }}>Beden Seç</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {APPAREL_SIZES.map((s) => {
                    const active = s === size;
                    return (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        style={{
                          minWidth: "56px", padding: "10px 18px", borderRadius: "30px",
                          border: `1px solid ${active ? "#000aff" : "#d7d7d7"}`,
                          background: active ? "#000aff" : "#ffffff",
                          color: active ? "#ffffff" : "#111111",
                          fontSize: "14px", fontWeight: 500, letterSpacing: "-0.04em",
                          cursor: "pointer", transition: "all .2s",
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={addFlagship}
                style={{
                  marginTop: "24px", width: "100%", maxWidth: "440px",
                  background: added ? "#111111" : "#000aff", color: "#ffffff",
                  fontSize: "16px", fontWeight: 600, letterSpacing: "-0.04em",
                  padding: "18px 32px", borderRadius: "10px", border: "none", cursor: "pointer",
                  transition: "background .25s",
                }}
              >
                {added ? "Sepete eklendi ✓" : "Sepete Ekle"}
              </button>

              {/* Güven satırı — CTA'nın hemen altı */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "16px", maxWidth: "440px" }}>
                {[
                  { icon: "local_shipping",    text: "1500₺ üzeri ücretsiz kargo" },
                  { icon: "assignment_return", text: "14 gün iade" },
                  { icon: "lock",              text: "Güvenli ödeme" },
                ].map((t) => (
                  <span key={t.text} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#737780" }}>{t.icon}</span>
                    <span style={{ fontSize: "13px", color: "#737780", letterSpacing: "-0.04em" }}>{t.text}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          4 — KATEGORİ KAPILARI
      ════════════════════════════════════════════════ */}
      <section style={{ background: "#ffffff", padding: "0 0 96px" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 clamp(20px, 4vw, 52px)" }}>
          <SectionHeader title="ne arıyorsun?" />
          <div className="cat-grid">
            {[
              { title: "spor giyim", desc: "300 gsm ağır pamuk, oversize kesim", img: flagship.gallery?.[2] ?? null },
              { title: "supplement", desc: "ISO 17025 lab onaylı, sıfır dolgu", img: null },
            ].map((c, i) => (
              <Link
                key={c.title}
                to="/shop"
                className="reveal-blur"
                style={{
                  position: "relative", display: "block", textDecoration: "none",
                  background: "#ecedee", borderRadius: "10px", overflow: "hidden",
                  minHeight: "320px", transitionDelay: `${i * 80}ms`,
                }}
              >
                {c.img ? (
                  <img src={c.img} alt="" loading="lazy"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{
                    position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <img src="/images/logo.png" alt="" style={{ width: "38%", filter: "invert(1) brightness(0.25)", opacity: .5 }} />
                  </span>
                )}
                <span aria-hidden style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,.72), rgba(0,0,0,.05))",
                }} />
                <span style={{ position: "absolute", left: "24px", right: "24px", bottom: "24px", zIndex: 2 }}>
                  <span style={{
                    display: "block", fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700,
                    letterSpacing: "-0.04em", color: "#ffffff", textTransform: "lowercase", lineHeight: 1.05,
                  }}>
                    {c.title}
                  </span>
                  <span style={{ display: "block", fontSize: "14px", color: "rgba(255,255,255,.75)", letterSpacing: "-0.04em", marginTop: "6px" }}>
                    {c.desc}
                  </span>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "14px",
                    fontSize: "14px", fontWeight: 600, color: "#ffffff", letterSpacing: "-0.04em",
                  }}>
                    Keşfet
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          5 — EN ÇOK SATANLAR
      ════════════════════════════════════════════════ */}
      <section style={{ background: "#ffffff", padding: "0 0 48px" }}>
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
                <button className="card-add-btn" onClick={(e) => { e.preventDefault(); quickAdd(p); }}>
                  Sepete Ekle
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          6 — ÜCRETSİZ KARGO BANDI (sepet ortalamasını yükseltir)
      ════════════════════════════════════════════════ */}
      <section style={{ background: "#000aff", padding: "56px clamp(20px, 4vw, 52px)" }}>
        <div style={{
          maxWidth: "1440px", margin: "0 auto",
          display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "20px",
        }}>
          <RevealText
            text={`${FREE_SHIPPING}₺ üzeri kargo bizden.`}
            style={{
              fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.04em",
              lineHeight: 1.0, color: "#ffffff", textTransform: "lowercase",
            }}
          />
          <Link
            to="/shop"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#ffffff", color: "#000aff", fontSize: "15px", fontWeight: 600,
              letterSpacing: "-0.04em", padding: "16px 32px", borderRadius: "10px", textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Alışverişe Başla
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          7 — YENİ GELENLER
      ════════════════════════════════════════════════ */}
      <section style={{ background: "#ffffff", padding: "96px 0" }}>
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
                <button className="card-add-btn" onClick={(e) => { e.preventDefault(); quickAdd(p); }}>
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
          8 — SOSYAL KANIT
      ════════════════════════════════════════════════ */}
      <section style={{ background: "#ecedee", padding: "96px 0" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 clamp(20px, 4vw, 52px)" }}>
          <SectionHeader title="sporcular ne diyor?" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="reveal-blur"
                style={{ background: "#ffffff", borderRadius: "10px", padding: "28px", transitionDelay: `${i * 80}ms` }}
              >
                <div style={{ display: "flex", gap: "2px", marginBottom: "16px" }}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className="material-symbols-outlined"
                      style={{ fontSize: 15, color: "#000aff", fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p style={{ fontSize: "16px", lineHeight: 1.5, color: "#111111", letterSpacing: "-0.04em", marginBottom: "20px" }}>
                  "{t.quote}"
                </p>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#111111", letterSpacing: "-0.04em" }}>{t.name}</p>
                <p className="text-brand-credit" style={{ marginTop: "2px" }}>{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          9 — BÜLTEN
      ════════════════════════════════════════════════ */}
      <section style={{ background: "#ffffff", padding: "96px 20px" }}>
        <div className="reveal" style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
          <RevealText
            text="lansmanı kaçırma"
            style={{
              fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 700, letterSpacing: "-0.04em",
              lineHeight: 1.05, color: "#111111", textTransform: "lowercase", marginBottom: "12px",
            }}
          />
          <p className="text-brand-credit" style={{ marginBottom: "32px" }}>
            Yeni ürünler · Erken erişim · Üyeye özel indirimler
          </p>
          <form
            style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}
            onSubmit={(e) => { e.preventDefault(); toast.success("Kaydın alındı — lansmandan ilk sen haberdar olacaksın."); }}
          >
            <input
              type="email" required placeholder="E-posta adresin"
              style={{
                flexGrow: 1, minWidth: "220px", background: "#ecedee", border: "none",
                borderRadius: "10px", padding: "16px 18px", fontSize: "14px",
                color: "#111111", letterSpacing: "-0.04em", outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#000aff", color: "#ffffff", fontSize: "14px", fontWeight: 600,
                letterSpacing: "-0.04em", padding: "16px 28px", borderRadius: "10px",
                border: "none", cursor: "pointer",
              }}
            >
              Kaydol
            </button>
          </form>
        </div>
      </section>

      <Footer />

      <style>{`
        .flagship-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        .cat-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 900px) {
          .flagship-grid { grid-template-columns: 1fr 1fr; gap: 64px; }
          .cat-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
