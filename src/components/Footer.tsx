import { Link } from "@tanstack/react-router";

const shopLinks = [
  { label: "Alle Produkte",     to: "/shop" },
  { label: "Oberteile",         to: "/shop" },
  { label: "Neuheiten",         to: "/shop" },
  { label: "Bestseller",        to: "/shop" },
];

const infoLinks = [
  { label: "Über uns",          to: "/" },
  { label: "Kontakt",           to: "/legal/impressum" },
  { label: "FAQ",               to: "/" },
];

const legalLinks = [
  { label: "Impressum",             to: "/legal/impressum" },
  { label: "Datenschutzerklärung",  to: "/legal/datenschutz" },
  { label: "AGB",                   to: "/legal/agb" },
  { label: "Widerrufsbelehrung",    to: "/legal/widerruf" },
  { label: "Versand & Zahlung",     to: "/legal/versand" },
];

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest relative overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-accent-warm/25 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none opacity-[0.04]"
        style={{ background: "radial-gradient(ellipse, #e8843a 0%, transparent 70%)" }} />

      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop pt-16 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          <div className="md:col-span-4">
            <div className="mb-5">
              <img src="/images/logo.png" alt="OLD IRON"
                className="h-[60px] w-auto object-contain brightness-75 opacity-80" />
            </div>

            <p className="text-[13px] text-secondary leading-relaxed mb-6 max-w-xs">
              Premium Sportbekleidung. Versand aus Deutschland. Old-School-Mentalität, moderne Kraft.
            </p>

            <div className="space-y-2">
              {[
                { icon: "workspace_premium", text: "Premium Qualität" },
                { icon: "local_shipping",    text: "Versand aus Deutschland" },
                { icon: "verified_user",     text: "Sichere Zahlung" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent-warm text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>{b.icon}</span>
                  <span className="text-[11px] text-secondary uppercase tracking-widest">{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="text-eyebrow mb-5">Shop</p>
            <ul className="space-y-3">
              {shopLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to}
                    className="text-[12px] text-secondary hover:text-primary transition-colors uppercase tracking-widest cursor-pointer link-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-eyebrow mb-5">Info</p>
            <ul className="space-y-3">
              {infoLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to}
                    className="text-[12px] text-secondary hover:text-primary transition-colors uppercase tracking-widest cursor-pointer link-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-eyebrow mb-5">Rechtliches</p>
            <ul className="space-y-3">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to}
                    className="text-[12px] text-secondary hover:text-primary transition-colors uppercase tracking-widest cursor-pointer link-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-eyebrow mb-5">Kontakt</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-accent-warm/60 text-[14px] mt-0.5 flex-shrink-0">alternate_email</span>
                <span className="text-[11px] text-secondary uppercase tracking-wide">info@oldironofficial.com</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-accent-warm/60 text-[14px] mt-0.5 flex-shrink-0">location_on</span>
                <span className="text-[11px] text-secondary uppercase tracking-wide">Deutschland · EU-weiter Versand</span>
              </li>
            </ul>

            <div className="flex gap-3 mt-8">
              {[
                { icon: "photo_camera", label: "Instagram" },
                { icon: "public",       label: "Web" },
                { icon: "mail",         label: "E-Mail" },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label}
                  className="w-9 h-9 border border-outline-variant/40 flex items-center justify-center
                    text-secondary hover:text-primary hover:border-accent-warm/50 transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-outline uppercase tracking-[0.2em]">
            © 2026 OLD IRON — Aus Disziplin geschmiedet
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-outline uppercase tracking-widest">Zahlung</span>
            {["Visa", "Mastercard", "SEPA", "Klarna"].map((pay) => (
              <span key={pay}
                className="text-[9px] border border-outline-variant/30 px-2 py-1 text-outline uppercase tracking-widest">
                {pay}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
