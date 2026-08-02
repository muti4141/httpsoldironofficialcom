import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const STORAGE_KEY = "oi_cookie_consent_v1";

type Consent = "all" | "essential";

function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "all" || v === "essential" ? v : null;
}

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!readConsent()) setOpen(true);
  }, []);

  if (!open) return null;

  const decide = (choice: Consent) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Çerez Bildirimi"
      className="fixed bottom-0 inset-x-0 z-[60] oi-glass"
    >
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[72px] py-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
          <p>
            Mağazanın çalışması için zorunlu çerezler kullanıyoruz.
            İzninizle analiz ve pazarlama amaçlı ek çerezler de kullanabiliriz.
            Detaylar için{" "}
            <Link to="/legal/datenschutz" className="underline hover:no-underline" style={{ color: "#f4f4f4" }}>
              Gizlilik Politikası
            </Link>
            &apos;na bakın.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => decide("essential")}
            className="oi-btn-ghost" style={{ padding: "10px 18px", fontSize: 12 }}
          >
            Yalnızca Zorunlu
          </button>
          <button
            onClick={() => decide("all")}
            className="oi-btn" style={{ padding: "10px 18px", fontSize: 12 }}
          >
            Tümünü Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
