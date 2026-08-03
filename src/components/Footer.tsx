import { Link } from "@tanstack/react-router";
import { Icon, type IconName } from "@/components/Icon";

const BG = "#0d0d0d";
const HAIR = "rgba(255,255,255,0.12)";
const TEXT = "#f4f4f4";
const MUTED = "rgba(255,255,255,0.55)";

const shopLinks = [
  { label: "Tüm Ürünler",     to: "/shop" },
  { label: "Spor Giyim",      to: "/shop" },
  { label: "Yeni Gelenler",   to: "/shop" },
];

const legalLinks = [
  { label: "Gizlilik Politikası", to: "/legal/datenschutz" },
  { label: "Kullanım Koşulları",  to: "/legal/agb" },
  { label: "İade & Cayma",        to: "/legal/widerruf" },
  { label: "Kargo Bilgisi",       to: "/legal/versand" },
];

export function Footer() {
  return (
    <footer style={{ background: BG, borderTop: `1px solid ${HAIR}` }}>
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[72px] pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">

          {/* Marka sütunu */}
          <div className="md:col-span-4">
            <div className="mb-5">
              <span
                style={{
                  fontFamily: "'Inter Tight', Inter, sans-serif",
                  fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em", color: TEXT,
                }}
              >
                OLD IRON
              </span>
            </div>

            <p className="text-[13px] leading-relaxed mb-6 max-w-xs tracking-[-0.01em]" style={{ color: MUTED }}>
              Premium spor giyim ve analiz raporlu elit supplement.
              Old School zihniyeti, modern güç.
            </p>

            <div className="space-y-2">
              {[
                { icon: "workspace_premium" as IconName, text: "Premium Kalite" },
                { icon: "science" as IconName,           text: "ISO 17025 Lab Onaylı" },
                { icon: "local_shipping" as IconName,    text: "Türkiye'ye Hızlı Kargo" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2">
                  <Icon name={b.icon} size={14} style={{ color: TEXT }} />
                  <span className="text-[11px] font-medium" style={{ color: MUTED }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mağaza */}
          <div className="md:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-5" style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace" }}>
              Mağaza
            </p>
            <ul className="space-y-3">
              {shopLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-[13px] font-medium transition-colors cursor-pointer"
                    style={{ color: MUTED, textDecoration: "none" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Yasal */}
          <div className="md:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-5" style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace" }}>
              Yasal
            </p>
            <ul className="space-y-3">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-[13px] font-medium transition-colors cursor-pointer"
                    style={{ color: MUTED, textDecoration: "none" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div className="md:col-span-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-5" style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace" }}>
              İletişim
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Icon name="alternate_email" size={14} style={{ color: TEXT, marginTop: 2, flexShrink: 0 }} />
                <span className="text-[12px] font-medium" style={{ color: MUTED }}>info@oldironofficial.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="location_on" size={14} style={{ color: TEXT, marginTop: 2, flexShrink: 0 }} />
                <span className="text-[12px] font-medium" style={{ color: MUTED }}>Türkiye geneli gönderim</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt bar */}
        <div style={{ height: 1, background: HAIR, marginBottom: 32 }} />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-medium tracking-[-0.01em]" style={{ color: MUTED }}>
            © 2026 OLD IRON — Disiplinden Dövülmüş
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium" style={{ color: MUTED }}>Ödeme:</span>
            {["Visa", "Mastercard", "Troy"].map((pay) => (
              <span
                key={pay}
                className="text-[10px] font-bold px-2.5 py-1"
                style={{ color: MUTED, border: `1px solid ${HAIR}`, borderRadius: 6 }}
              >
                {pay}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
