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
      className="fixed bottom-0 inset-x-0 z-[60] border-t border-outline-variant bg-white/95 backdrop-blur-md"
    >
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[72px] py-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 text-[13px] text-secondary leading-relaxed">
          <p>
            Mağazanın çalışması için zorunlu çerezler kullanıyoruz.
            İzninizle analiz ve pazarlama amaçlı ek çerezler de kullanabiliriz.
            Detaylar için{" "}
            <Link to="/legal/datenschutz" className="text-foreground underline hover:no-underline">
              Gizlilik Politikası
            </Link>
            &apos;na bakın.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => decide("essential")}
            className="px-4 py-2 text-[12px] font-semibold border border-outline-variant text-secondary hover:border-foreground hover:text-foreground transition-colors rounded-[8px]"
          >
            Yalnızca Zorunlu
          </button>
          <button
            onClick={() => decide("all")}
            className="px-4 py-2 text-[12px] font-bold bg-cobalt text-white hover:opacity-90 transition-all rounded-[8px]"
          >
            Tümünü Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
