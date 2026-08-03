import { useEffect, useState } from "react";

/**
 * Site geneli giriş perdesi. Sayfa (görseller, fontlar, video posteri dahil)
 * tam hazır olana kadar gösterilir, sonra yumuşakça kapanır.
 */
export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let alive = true;
    const shownAt = Date.now();
    const MIN_MS = 700;   // en az bu kadar görünsün, göz kırpmasın
    const MAX_MS = 4000;  // ne olursa olsun bu sürede kapan

    const finish = () => {
      if (!alive) return;
      const elapsed = Date.now() - shownAt;
      const wait = Math.max(0, MIN_MS - elapsed);
      window.setTimeout(() => {
        if (!alive) return;
        setFading(true);
        window.setTimeout(() => { if (alive) setVisible(false); }, 500);
      }, wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }
    const fallback = window.setTimeout(finish, MAX_MS);

    return () => {
      alive = false;
      window.removeEventListener("load", finish);
      window.clearTimeout(fallback);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "#080808",
        opacity: fading ? 0 : 1,
        transition: "opacity .5s ease",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <img
        src="/images/logo.png"
        alt=""
        className="oi-preloader-logo"
        style={{ width: "min(34vw, 160px)", objectFit: "contain" }}
      />
      <style>{`
        @keyframes oi-preload-pulse {
          0%, 100% { opacity: .35; transform: scale(.96); }
          50%      { opacity: 1;   transform: scale(1);   }
        }
        .oi-preloader-logo {
          animation: oi-preload-pulse 1.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .oi-preloader-logo { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
