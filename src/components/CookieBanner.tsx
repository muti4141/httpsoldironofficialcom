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
      aria-label="Cookie-Hinweis"
      className="fixed bottom-0 inset-x-0 z-[60] border-t-2 border-primary bg-surface-container-lowest/95 backdrop-blur-md"
    >
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-sm flex flex-col md:flex-row md:items-center gap-stack-sm">
        <div className="flex-1 text-[14px] text-on-surface-variant leading-relaxed">
          <p>
            Wir verwenden technisch notwendige Cookies, damit der Shop funktioniert.
            Mit deiner Einwilligung setzen wir zusätzlich Cookies für Analyse und Marketing.
            Mehr in der{" "}
            <Link to="/legal/datenschutz" className="text-primary underline hover:no-underline">
              Datenschutzerklärung
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => decide("essential")}
            className="px-4 py-2 text-[12px] uppercase tracking-widest border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
          >
            Nur notwendige
          </button>
          <button
            onClick={() => decide("all")}
            className="px-4 py-2 text-[12px] uppercase tracking-widest bg-primary text-on-primary hover:brightness-110 transition-all font-semibold"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
