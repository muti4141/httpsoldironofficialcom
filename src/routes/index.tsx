import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OLD IRON — Disiplinden Dövülmüş" },
      { name: "description", content: "Premium spor giyim & elit supplement. Almanya'da üretildi, Türkiye'ye 1–3 iş gününde teslim." },
    ],
    links: [
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" },
    ],
  }),
  component: Home,
});

const VIDEO_URL = "https://zxdefgavgwfxastwmmjm.supabase.co/storage/v1/object/public/assets/chalk.mp4";

const navLinks = [
  { label: "Koleksiyon", to: "/shop" },
  { label: "Supplement", to: "/shop" },
  { label: "Hikayemiz", to: "/shop" },
  { label: "İletişim",   to: "/shop" },
];

/* Caption beats — logo devrinden sonra */
const beats = [
  { text: "Disiplinden dövülmüş.",  from: 0.16, to: 0.30, pos: "upper" },
  { text: "Ağır pamuk. Gerçek kesim.", from: 0.38, to: 0.52, pos: "lower" },
  { text: "Saf formül. Sıfır dolgu.",  from: 0.70, to: 0.86, pos: "lower" },
];

function Home() {
  const filmRef  = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [ready, setReady]   = useState(false);
  const [prog, setProg]     = useState(0);

  /* Video: blob olarak çek — bazı sunucular byte-range vermez, seek donar */
  useEffect(() => {
    let url = "";
    let alive = true;

    const fallback = () => {
      if (!alive) return;
      /* Dış kaynak gelmezse kendi videomuza düş */
      if (filmRef.current && !filmRef.current.src) filmRef.current.src = "/videos/hero.mp4";
      setReady(true);
    };

    fetch(VIDEO_URL)
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error("kaynak yok"))))
      .then((blob) => {
        if (!alive) return;
        url = URL.createObjectURL(blob);
        if (filmRef.current) filmRef.current.src = url;
      })
      .catch(fallback);

    /* Ne olursa olsun sayfa 5sn'den fazla "Yükleniyor"da kalmaz */
    const t = setTimeout(fallback, 5000);

    return () => { alive = false; clearTimeout(t); if (url) URL.revokeObjectURL(url); };
  }, []);

  /* Scrub döngüsü */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProg(0.5);
      return;
    }

    let raf = 0;
    let current = 0;

    const loop = () => {
      const rect  = stage.getBoundingClientRect();
      const total = stage.offsetHeight - window.innerHeight;
      const target = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;

      /* Süzülmeyi veren satır */
      current += (target - current) * 0.12;
      setProg(current);

      const film = filmRef.current;
      if (film && film.duration) {
        const t = current * (film.duration - 0.05);
        if (Math.abs(film.currentTime - t) > 0.005) {
          try { film.currentTime = t; } catch { /* seek hazır değil */ }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Logo açılışı → yazı devri */
  const logoOut = Math.min(1, Math.max(0, prog / 0.13));
  const ctaIn   = Math.min(1, Math.max(0, (prog - 0.88) / 0.08));
  const pct     = Math.round(prog * 100);

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
        </div>
      </nav>

      {/* ── SCRUB UI ────────────────────────────────────── */}
      <div style={{
        position: "fixed", left: "clamp(20px, 4vw, 48px)", bottom: "28px", zIndex: 50,
        display: "flex", alignItems: "center", gap: "14px",
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: "12px",
          color: "rgba(255,255,255,.65)", minWidth: "26px",
        }}>
          {pct < 10 ? `0${pct}` : pct}
        </span>
        <div style={{ width: "120px", height: "1px", background: "rgba(255,255,255,.12)", position: "relative" }}>
          <div style={{ position: "absolute", inset: "0 auto 0 0", width: `${prog * 100}%`, background: "#dcdcdc" }} />
        </div>
      </div>

      {/* ── SPEC SATIRI ─────────────────────────────────── */}
      <div className="oi-specs" style={{
        position: "fixed", left: "50%", transform: "translateX(-50%)", bottom: "28px", zIndex: 50,
        display: "flex", gap: "32px",
        fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
        letterSpacing: ".06em", color: "rgba(255,255,255,.45)", whiteSpace: "nowrap",
      }}>
        <span><b style={{ color: "rgba(255,255,255,.8)", fontWeight: 500 }}>300</b> gsm pamuk</span>
        <span><b style={{ color: "rgba(255,255,255,.8)", fontWeight: 500 }}>ISO 17025</b> lab onaylı</span>
        <span><b style={{ color: "rgba(255,255,255,.8)", fontWeight: 500 }}>0</b> dolgu maddesi</span>
      </div>

      {/* ── STICKY SAHNE ────────────────────────────────── */}
      <section ref={stageRef} style={{ height: "700vh", position: "relative" }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

          <video
            ref={filmRef}
            muted playsInline preload="auto"
            onLoadedData={() => { setReady(true); try { if (filmRef.current) filmRef.current.currentTime = 0; } catch { /* noop */ } }}
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

          {/* ── AÇILIŞ: LOGO ── */}
          <div aria-hidden={logoOut > 0.9} style={{
            position: "absolute", inset: 0, zIndex: 12,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "28px", pointerEvents: "none",
            opacity: 1 - logoOut,
            transform: `scale(${1 - logoOut * 0.1}) translateY(${-logoOut * 40}px)`,
          }}>
            <img
              src="/images/logo.png"
              alt="OLD IRON"
              style={{
                width: "min(58vw, 560px)", maxHeight: "52vh", objectFit: "contain",
                filter: "drop-shadow(0 8px 44px rgba(0,0,0,.6))",
              }}
            />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
              letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(255,255,255,.5)",
            }}>
              Kaydır
            </span>
          </div>

          {/* ── CAPTION BEATS ── */}
          {beats.map((b) => {
            const on = prog >= b.from && prog <= b.to;
            return (
              <p
                key={b.text}
                style={{
                  position: "absolute",
                  left: "clamp(20px, 5vw, 64px)", right: "clamp(20px, 5vw, 64px)",
                  ...(b.pos === "upper" ? { top: "22vh" } : { bottom: "18vh" }),
                  zIndex: 5,
                  fontSize: "clamp(30px, 4.6vw, 64px)", fontWeight: 500,
                  letterSpacing: "-.035em", lineHeight: 1.05, color: "#f4f4f4",
                  textShadow: "0 2px 30px rgba(0,0,0,.9), 0 0 80px rgba(0,0,0,.7)",
                  opacity: on ? 1 : 0,
                  transform: on ? "translateY(0)" : "translateY(18px)",
                  transition: "opacity .7s ease, transform .7s ease",
                  pointerEvents: "none",
                }}
              >
                {b.text}
              </p>
            );
          })}

          {/* ── BÜYÜK CTA — sahne biterken ── */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 9,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "24px", padding: "0 20px", textAlign: "center",
            opacity: ctaIn, pointerEvents: ctaIn > 0.5 ? "auto" : "none",
            transform: `translateY(${(1 - ctaIn) * 24}px)`,
            transition: "opacity .4s ease",
          }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "12px",
              letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,.6)",
            }}>
              Premium spor giyim &amp; elit supplement
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
          1500₺ üzeri ücretsiz kargo · 14 gün iade · Almanya'da üretildi
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
