import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { RevealText } from "@/components/RevealText";
import { useParallax } from "@/components/SmoothScroll";
import { products } from "@/data/products";
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

/* ── Data ───────────────────────────────────────────────────────────── */
const marqueeItems = [
  "DİSİPLİNDEN DÖVÜLMÜŞ", "PREMİUM SPOR GİYİM", "IRON SUPPLEMENT",
  "ALMANYA'DA ÜRETİLDİ",  "UZLAŞMA YOK",        "300 GSM PAMUK",
  "SAF PROTEİN",           "OLD SCHOOL ZİHNİYETİ", "LAB ONAYLI",
];

const pressItems = [
  "ISO 17025", "ALMANYA ÜRETİMİ", "300 GSM PAMUK", "SAF PROTEİN", "LAB ONAYLI",
];

const testimonials = [
  { quote: "Kumaşın kalitesi rakipsiz. Her antrenmanda farkı hissediyorsun.", name: "Mehmet Yılmaz", role: "Powerlifter · İstanbul" },
  { quote: "Iron Whey şimdiye kadar içtiğim en iyi protein. Şişkinlik yok, maksimum emilim.", name: "Seda Kaya", role: "Kişisel Antrenör · Ankara" },
  { quote: "Old Iron modern fitness dünyasında özlediğim şeyi sunuyor: gerçek disiplin, gerçek kalite.", name: "Burak Şahin", role: "Bodybuilder · İzmir" },
];

/* Uçuşan hero objeleri: konum, boyut, dönüş, hız */
const floaters = [
  { top: "8%",  left: "6%",  size: 130, r: -14, d: 0.0, o: 0.85 },
  { top: "12%", left: "78%", size: 150, r: 10,  d: 1.2, o: 0.9  },
  { top: "55%", left: "3%",  size: 180, r: 8,   d: 0.6, o: 0.8  },
  { top: "60%", left: "84%", size: 140, r: -8,  d: 1.8, o: 0.85 },
  { top: "28%", left: "30%", size: 70,  r: 20,  d: 0.9, o: 0.35 },
  { top: "70%", left: "38%", size: 80,  r: -18, d: 1.5, o: 0.3  },
  { top: "18%", left: "55%", size: 60,  r: 30,  d: 0.3, o: 0.35 },
  { top: "75%", left: "62%", size: 90,  r: -25, d: 2.1, o: 0.4  },
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
      .querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale,.reveal-wipe,.reveal-blur,.press-item")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── Main ───────────────────────────────────────────────────────────── */
function Home() {
  useReveal();
  useParallax();
  const add = useCart((s) => s.add);

  const trending = products.slice(0, 4);
  const fresh    = products.slice(4, 8);

  return (
    <div className="dk-page" style={{ minHeight: "100vh", overflowX: "hidden" }}>

      {/* 1 ── ANNOUNCEMENT BAR */}
      <div className="announcement-bar">
        <span>1500₺ üzeri ücretsiz kargo · Almanya kalitesi · Lab onaylı</span>
      </div>

      {/* 2 ── NAV (koyu görünüm .dk-page override ile) */}
      <Nav />

      {/* 3 ── HERO — siyah, uçuşan objeler, merkez dev tipografi */}
      <section
        style={{
          position: "relative",
          minHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "140px 20px 80px",
          overflow: "hidden",
          background: "#0d0d0d",
        }}
      >
        {/* Uçuşan logolar */}
        {floaters.map((f, i) => (
          <img
            key={i}
            src="/images/logo.png"
            alt=""
            aria-hidden
            className="float-obj"
            data-parallax={`${(0.12 + (i % 4) * 0.07).toFixed(2)}`}
            style={{
              top: f.top,
              left: f.left,
              width: f.size,
              opacity: f.o,
              animationDelay: `${f.d}s`,
              ["--r" as string]: `${f.r}deg`,
            }}
          />
        ))}

        {/* Radial vinyet — merkezi aydınlat */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center, rgba(13,13,13,0) 30%, rgba(13,13,13,0.85) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Merkez içerik */}
        <div style={{ position: "relative", zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", gap: "28px", maxWidth: "1100px" }}>
          <h1 className="dk-hero-title">
            <span className="anim-1" style={{ display: "block" }}>Disiplinden dövülmüş,</span>
            <span className="anim-2" style={{ display: "block" }}>her vücuda uyar.</span>
          </h1>

          <p className="dk-hero-sub anim-3">Gücün geleceğine adım at</p>

          <div className="anim-4" style={{ marginTop: "16px" }}>
            <Link to="/shop" className="btn-orange">
              Alışverişe Başla
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#fff" }}>arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Alt güven şeridi */}
        <div
          className="anim-5"
          style={{
            position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
            display: "flex", alignItems: "center", gap: "12px", zIndex: 5,
            background: "rgba(255,255,255,0.06)", borderRadius: 30, padding: "8px 20px",
          }}
        >
          <span className="dk-mono" style={{ whiteSpace: "nowrap" }}>10.000+ sporcunun güvendiği marka</span>
        </div>
      </section>

      {/* 4 ── MARQUEE */}
      <div style={{ background: "#111111", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 0", overflow: "hidden" }}>
        <div className="flex whitespace-nowrap marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center" style={{ gap: "24px", padding: "0 24px" }}>
              <span style={{ fontWeight: 600, fontSize: "11px", color: "#ffffff", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                {item}
              </span>
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "6px" }}>■</span>
            </span>
          ))}
        </div>
      </div>

      {/* 5 ── NOW TRENDING — koyu kartlar, numaralı */}
      <section style={{ background: "#0d0d0d", padding: "110px 0" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 24px" }}>
          <RevealText
            text="Şimdi trend olanlar"
            className="dk-heading"
            style={{ marginBottom: "56px", fontSize: "clamp(32px,4.5vw,56px)" }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "16px" }}>
            {trending.map((p, i) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                className="dk-card reveal-blur"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <span className="dk-rank">{i + 1}</span>

                {/* Ürün sahnesi — beyaz kaide üzerinde monogram */}
                <div className="dk-stage">
                  <div
                    style={{
                      width: "70%", aspectRatio: "1/1", borderRadius: "50%",
                      background: "radial-gradient(circle at 38% 32%, #3a3a3a, #1a1a1a 70%)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <img src="/images/logo.png" alt={p.name} style={{ width: "55%", opacity: 0.95 }} />
                  </div>
                </div>

                {/* Metadata satırı */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
                  <span className="dk-chip">OI</span>
                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.name}
                    </p>
                    <p className="dk-mono" style={{ marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.categoryLabel}
                    </p>
                  </div>
                  <span className="dk-price">₺{p.price.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6 ── BÜYÜK TİPOGRAFİ GEÇİŞİ */}
      <section style={{ background: "#0d0d0d", padding: "140px 24px" }}>
        <RevealText
          text="Genişleyen bir güç evreni"
          once={false}
          stagger={110}
          className="dk-heading"
        />
      </section>

      {/* 7 ── YENİ GELENLER */}
      <section style={{ background: "#0d0d0d", padding: "0 0 110px" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 24px" }}>
          <RevealText
            text="Yeni gelenler"
            className="dk-heading"
            style={{ marginBottom: "56px", fontSize: "clamp(32px,4.5vw,56px)" }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "16px" }}>
            {fresh.map((p, i) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                className="dk-card reveal-blur"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                {p.badge ? (
                  <span className="badge badge-new" style={{ alignSelf: "flex-start" }}>YENİ</span>
                ) : (
                  <span style={{ height: 26 }} />
                )}

                <div className="dk-stage">
                  <div
                    style={{
                      width: "70%", aspectRatio: "1/1", borderRadius: "50%",
                      background: "radial-gradient(circle at 38% 32%, #3a3a3a, #1a1a1a 70%)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <img src="/images/logo.png" alt={p.name} style={{ width: "55%", opacity: 0.95 }} />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
                  <span className="dk-chip">OI</span>
                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.name}
                    </p>
                    <p className="dk-mono" style={{ marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.categoryLabel}
                    </p>
                  </div>
                  <span className="dk-price">₺{p.price.toFixed(2)}</span>
                </div>

                <button
                  className="card-add-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    add(p, p.type === "apparel" ? "M" : "Standart");
                    toast.success(`${p.name} sepete eklendi`);
                  }}
                >
                  Sepete Ekle
                </button>
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
            <Link to="/shop" className="btn-orange">
              Tümünü Gör
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#fff" }}>arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8 ── KREDENSİYEL BARI */}
      <section style={{ background: "#111111", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "64px 24px" }}>
        <p className="dk-mono" style={{ textAlign: "center", marginBottom: "32px" }}>Standartlarımız</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "clamp(24px, 6vw, 80px)", maxWidth: "1200px", margin: "0 auto" }}>
          {pressItems.map((item, i) => (
            <span
              key={item}
              className="press-item"
              style={{
                fontWeight: 800, fontSize: "clamp(16px, 2.4vw, 26px)",
                letterSpacing: "-0.02em", color: "rgba(255,255,255,0.55)",
                transitionDelay: `${i * 90}ms`, whiteSpace: "nowrap",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* 9 ── MANİFESTO */}
      <section style={{ background: "#0d0d0d", padding: "150px 24px" }}>
        <RevealText
          text="disiplinden dövülmüş."
          once={false}
          stagger={130}
          className="dk-heading"
          style={{ textTransform: "lowercase" }}
        />
        <p
          className="reveal"
          style={{
            textAlign: "center", maxWidth: "560px", margin: "40px auto 0",
            fontSize: "16px", lineHeight: 1.6, color: "rgba(255,255,255,0.55)",
            letterSpacing: "-0.02em",
          }}
        >
          OLD IRON sadece bir marka değil, bir yaşam felsefesidir.
          Almanya'nın mühendislik disipliniyle salonların tozu birleşiyor.
          En iyi ekipman, en saf içerik.
        </p>
      </section>

      {/* 10 ── YORUMLAR */}
      <section style={{ background: "#0d0d0d", padding: "0 0 110px" }}>
        <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 24px" }}>
          <RevealText
            text="Sporcuların yorumları"
            className="dk-heading"
            style={{ marginBottom: "56px", fontSize: "clamp(32px,4.5vw,56px)" }}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="dk-card reveal-blur"
                style={{ transitionDelay: `${i * 80}ms`, padding: "28px" }}
              >
                <div style={{ display: "flex", gap: "3px", marginBottom: "20px" }}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className="material-symbols-outlined" style={{ fontSize: 14, color: "#ff4b26", fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: "rgba(255,255,255,0.85)", letterSpacing: "-0.02em", marginBottom: "24px" }}>
                  "{t.quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="dk-chip">{t.name.charAt(0)}</span>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>{t.name}</p>
                    <p className="dk-mono" style={{ marginTop: "2px" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11 ── BÜLTEN */}
      <section style={{ background: "#111111", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "100px 24px" }}>
        <div className="reveal" style={{ maxWidth: "520px", margin: "0 auto", textAlign: "center" }}>
          <RevealText
            text="Elitin bir parçası ol"
            className="dk-heading"
            style={{ fontSize: "clamp(28px,4vw,48px)", marginBottom: "16px" }}
          />
          <p className="dk-mono" style={{ marginBottom: "36px" }}>
            Sınırlı stok · Erken erişim · Üyeye özel indirimler
          </p>
          <form
            style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}
            onSubmit={(e) => { e.preventDefault(); toast.success("Hoş geldin — elitin bir parçasısın."); }}
          >
            <input
              type="email"
              required
              placeholder="E-posta adresin"
              style={{
                flexGrow: 1, minWidth: "220px",
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "4px", padding: "15px 18px",
                fontSize: "14px", color: "#ffffff", letterSpacing: "-0.02em", outline: "none",
              }}
            />
            <button type="submit" className="btn-orange" style={{ padding: "15px 28px" }}>
              Kaydol
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
