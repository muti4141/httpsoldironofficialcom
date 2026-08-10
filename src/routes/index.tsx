import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useCartCount } from "@/stores/cart";
import { useAuth } from "@/hooks/use-auth";
import { Icon } from "@/components/Icon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OLD IRON — Disiplinden Dövülmüş" },
      { name: "description", content: "Premium spor giyim & elit supplement. Almanya'da üretildi, Türkiye'ye 1–3 iş gününde teslim." },
    ],
  }),
  component: Home,
});

const VIDEO_URL = "/videos/hero.mp4";

const navLinks = [
  { label: "Koleksiyon", to: "/shop" },
  { label: "Supplement", to: "/shop" },
  { label: "Hikayemiz", to: "/shop" },
  { label: "İletişim",   to: "/shop" },
];

/* Caption beats — son beat logo */
const beats = [
  /* 1 — marka kimliği */
  { text: "Disiplinden dövülmüş.",             from: 0.02, to: 0.20, pos: "upper" },
  /* 2 — giyim: premium vurgusu */
  { text: "Premium pamuk. Yıllarca ilk günkü gibi.", from: 0.32, to: 0.46, pos: "lower" },
  /* 3 — tüm ürünler: analiz raporu vurgusu */
  { text: "Her ürün analiz raporlu.",          from: 0.58, to: 0.72, pos: "lower" },
];

/* Logo beat penceresi — yazılardan sonra, CTA'dan önce */
const LOGO_FROM = 0.80;
const LOGO_TO   = 0.92;
function Home() {
  const filmRef  = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ctaRef   = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const logoBeatRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const cartCount = useCartCount();
  const { user } = useAuth();

  /* Video kaynağı — doğrudan stream, blob yok (tüm dosyayı belleğe çekmiyoruz) */
  useEffect(() => {
    const film = filmRef.current;
    if (!film) return;
    film.src = VIDEO_URL;
    /* Video hiç yüklenmezse yükleme perdesi sonsuza kadar takılı kalmasın */
    const onError = () => setReady(true);
    film.addEventListener("error", onError);
    const t = setTimeout(() => setReady(true), 6000);
    return () => { clearTimeout(t); film.removeEventListener("error", onError); };
  }, []);

  /* Video normal şekilde oynar (scroll'a bağlı değil); yazı/logo geçişleri
     videonun kendi oynama zamanına göre — döngü her tekrarında akıcı şekilde
     belirip kaybolurlar. */
  useEffect(() => {
    const film = filmRef.current;
    if (!film) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const paint = (p: number) => {
      if (logoBeatRef.current) {
        const on = p >= LOGO_FROM && p <= LOGO_TO;
        logoBeatRef.current.style.opacity = on ? "1" : "0";
        logoBeatRef.current.style.transform = on ? "translateY(0)" : "translateY(18px)";
      }

      beats.forEach((b, i) => {
        const el = beatRefs.current[i];
        if (!el) return;
        const on = p >= b.from && p <= b.to;
        el.style.opacity = on ? "1" : "0";
        el.style.transform = on ? "translateY(0)" : "translateY(18px)";
      });
    };

    if (reduced) { paint(0.5); return; }

    let raf = 0;
    let last = -1;
    const loop = () => {
      if (film.duration) {
        const p = film.currentTime / film.duration;
        if (Math.abs(p - last) > 0.0008) { paint(p); last = p; }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Büyük CTA — sayfa açılınca kısa bir gecikmeyle akıcı şekilde belirir */
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      const cta = ctaRef.current;
      if (!cta) return;
      cta.style.opacity = "1";
      cta.style.pointerEvents = "auto";
      cta.style.transform = "translateY(0)";
    }, 600);
    return () => clearTimeout(t);
  }, [ready]);

  return (
    <div style={{ background: "#080808", color: "#f4f4f4", fontFamily: "'Inter Tight', Inter, sans-serif" }}>

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "22px clamp(20px, 4vw, 48px)",
      }}>
        <Link to="/" style={{
          fontWeight: 700, fontSize: "17px", letterSpacing: "-0.02em",
          color: "#f4f4f4", textDecoration: "none",
        }}>
          OLD IRON
        </Link>

        <div className="oi-nav-links" style={{ display: "flex", gap: "26px", alignItems: "center" }}>
          {navLinks.map((l) => (
            <Link key={l.label} to={l.to} className="oi-navlink" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase",
              color: "rgba(255,255,255,.55)", textDecoration: "none",
            }}>
              {l.label}
            </Link>
          ))}
          <Link to="/shop" className="oi-pill" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase",
            color: "#f4f4f4", textDecoration: "none",
            border: "1px solid rgba(255,255,255,.25)", borderRadius: "999px",
            padding: "13px 26px",
          }}>
            Lansmanı Keşfet
          </Link>

          {/* Hesap */}
          <Link
            to={user ? "/account" : "/auth"}
            search={user ? undefined : { mode: "login", redirect: "/" }}
            className="oi-navlink"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase",
              color: "rgba(255,255,255,.55)", textDecoration: "none",
            }}
          >
            {user ? "Hesabım" : "Giriş"}
          </Link>

          {/* Sepet */}
          <Link
            to="/cart"
            aria-label={`Sepet (${cartCount} ürün)`}
            style={{
              position: "relative", display: "flex", alignItems: "center",
              justifyContent: "center", width: 32, height: 32, color: "#f4f4f4",
            }}
          >
            <Icon name="shopping_bag" size={20} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute", top: -4, right: -4,
                  minWidth: 16, height: 16, padding: "0 4px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 999, background: "#ffffff", color: "#080808",
                  fontSize: 9, fontWeight: 700, lineHeight: 1,
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* ── SPEC SATIRI ─────────────────────────────────── */}
      <div className="oi-specs" style={{
        position: "fixed", left: "50%", transform: "translateX(-50%)", bottom: "28px", zIndex: 50,
        display: "flex", gap: "32px",
        fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
        letterSpacing: ".06em", color: "rgba(255,255,255,.45)", whiteSpace: "nowrap",
      }}>
        <span><b style={{ color: "rgba(255,255,255,.8)", fontWeight: 500 }}>300</b> gsm premium pamuk</span>
        <span><b style={{ color: "rgba(255,255,255,.8)", fontWeight: 500 }}>ISO 17025</b> analiz raporlu</span>
        <span><b style={{ color: "rgba(255,255,255,.8)", fontWeight: 500 }}>0</b> dolgu maddesi</span>
      </div>

      {/* ── HERO ────────────────────────────────────────── */}
      <section ref={stageRef} style={{ height: "100vh", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", height: "100%" }}>

          <video
            ref={filmRef}
            autoPlay muted loop playsInline preload="auto"
            onLoadedData={() => setReady(true)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Vinyet + karartmalar */}
          <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", boxShadow: "inset 0 0 220px 90px rgba(0,0,0,.85)" }} />
          <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: "28vh", pointerEvents: "none", background: "linear-gradient(to bottom, rgba(0,0,0,.82), transparent)" }} />
          <div aria-hidden style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40vh", pointerEvents: "none", background: "linear-gradient(to top, rgba(0,0,0,.92), transparent)" }} />

          {/* Yükleniyor */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 10,
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            background: "#080808", paddingBottom: "18vh",
            fontFamily: "'JetBrains Mono', monospace", fontSize: "12px",
            letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.5)",
            opacity: ready ? 0 : 1, pointerEvents: ready ? "none" : "auto",
            transition: "opacity .8s ease",
          }}>
            Yükleniyor
          </div>

          {/* ── CAPTION BEATS ── */}
          {beats.map((b, i) => {
            return (
              <p
                key={b.text}
                ref={(el) => { beatRefs.current[i] = el; }}
                style={{
                  position: "absolute",
                  left: "clamp(20px, 5vw, 64px)", right: "clamp(20px, 5vw, 64px)",
                  ...(b.pos === "upper" ? { top: "22vh" } : { bottom: "18vh" }),
                  zIndex: 5,
                  fontSize: "clamp(30px, 4.6vw, 64px)", fontWeight: 500,
                  letterSpacing: "-.035em", lineHeight: 1.05, color: "#f4f4f4",
                  textShadow: "0 2px 30px rgba(0,0,0,.9), 0 0 80px rgba(0,0,0,.7)",
                  opacity: 0,
                  transform: "translateY(18px)",
                  transition: "opacity .7s ease, transform .7s ease",
                  pointerEvents: "none", willChange: "opacity, transform",
                }}
              >
                {b.text}
              </p>
            );
          })}

          {/* ── SON BEAT: LOGO (yazılarla aynı yerde) ── */}
          <div
            ref={logoBeatRef}
            aria-hidden
            style={{
              position: "absolute",
              left: "clamp(20px, 5vw, 64px)", right: "clamp(20px, 5vw, 64px)",
              bottom: "18vh", zIndex: 5,
              display: "flex", justifyContent: "flex-start",
              opacity: 0, transform: "translateY(18px)",
              transition: "opacity .7s ease, transform .7s ease",
              pointerEvents: "none", willChange: "opacity, transform",
            }}
          >
            <img
              src="/images/logo.png"
              alt="OLD IRON"
              style={{
                width: "min(46vw, 420px)", objectFit: "contain",
                filter: "drop-shadow(0 4px 30px rgba(0,0,0,.85))",
              }}
            />
          </div>

          {/* ── BÜYÜK CTA — sahne biterken ── */}
          <div ref={ctaRef} style={{
            position: "absolute", inset: 0, zIndex: 9,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "24px", padding: "0 20px", textAlign: "center",
            opacity: 0, pointerEvents: "none",
            transform: "translateY(24px)",
            transition: "opacity .4s ease", willChange: "opacity, transform",
          }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "12px",
              letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.6)",
            }}>
              İlk koleksiyon yayında — spor giyim &amp; elit supplement
            </p>
            <Link to="/shop" className="oi-cta-big">
              LANSMANI KEŞFET
            </Link>
          </div>

          {/* ── KÖŞE PiP: marka videosu ── */}
          <div className="oi-pip">
            <video src="/videos/hero.mp4" autoPlay muted loop playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <span style={{
              position: "absolute", top: "8px", left: "10px",
              fontFamily: "'JetBrains Mono', monospace", fontSize: "9px",
              letterSpacing: ".14em", textTransform: "uppercase",
              color: "rgba(255,255,255,.75)", textShadow: "0 1px 6px rgba(0,0,0,.8)",
            }}>
              OLD IRON
            </span>
          </div>
        </div>
      </section>

      {/* ── KAPANIŞ ─────────────────────────────────────── */}
      <section style={{
        minHeight: "70vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "28px",
        padding: "96px 20px", textAlign: "center",
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: "12px",
          letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.45)",
        }}>
          Kargo ücreti alıcı öder · 14 gün koşulsuz iade · 1–3 iş günü teslimat
        </p>

        <Link to="/shop" className="oi-cta-big oi-cta-solid">
          LANSMANI KEŞFET
        </Link>

        <div style={{ display: "flex", gap: "24px", marginTop: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          {navLinks.map((l) => (
            <Link key={l.label} to={l.to} className="oi-navlink" style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
              letterSpacing: ".08em", textTransform: "uppercase",
              color: "rgba(255,255,255,.45)", textDecoration: "none",
            }}>
              {l.label}
            </Link>
          ))}
        </div>

        <p style={{ fontSize: "12px", color: "rgba(255,255,255,.25)", letterSpacing: "-0.02em", marginTop: "8px" }}>
          © 2026 OLD IRON — Disiplinden Dövülmüş
        </p>
      </section>

      <style>{`
        .oi-navlink { transition: color .25s; }
        .oi-navlink:hover { color: #f4f4f4 !important; }
        .oi-pill { transition: border-color .25s, background .25s; }
        .oi-pill:hover { border-color: #dcdcdc; background: rgba(255,255,255,.06); }

        .oi-cta-big {
          display: inline-flex; align-items: center; justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(15px, 1.6vw, 20px); font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          color: #080808; background: #ffffff; text-decoration: none;
          padding: clamp(20px, 2.2vw, 28px) clamp(40px, 5vw, 72px);
          border-radius: 999px;
          transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease;
          box-shadow: 0 10px 40px rgba(0,0,0,.5);
        }
        .oi-cta-big:hover { transform: translateY(-3px); box-shadow: 0 16px 50px rgba(0,0,0,.6); }
        .oi-cta-big:active { transform: translateY(0) scale(.98); }

        .oi-pip {
          position: absolute; right: clamp(20px, 4vw, 48px); bottom: 72px; z-index: 6;
          width: clamp(170px, 17vw, 260px); aspect-ratio: 16 / 9;
          border-radius: 10px; overflow: hidden;
          border: 1px solid rgba(255,255,255,.12);
          box-shadow: 0 12px 40px rgba(0,0,0,.6);
          opacity: 0; animation: oi-pip-in 1s ease 1.4s forwards;
        }
        @keyframes oi-pip-in { to { opacity: 1; } }

        @media (max-width: 900px) {
          .oi-nav-links .oi-navlink { display: none; }
          .oi-specs { display: none; }
          .oi-pip { width: 130px; bottom: 64px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .oi-pip { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
