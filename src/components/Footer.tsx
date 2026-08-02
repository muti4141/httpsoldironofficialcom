import { Link } from "@tanstack/react-router";
import { Icon, type IconName } from "@/components/Icon";

const shopLinks = [
  { label: "Tüm Ürünler",   to: "/shop" },
  { label: "Spor Giyim",    to: "/shop" },
  { label: "Supplement",    to: "/shop" },
  { label: "Yeni Gelenler", to: "/shop" },
  { label: "En Çok Satanlar", to: "/shop" },
];

const infoLinks = [
  { label: "Hakkımızda",       to: "/" },
  { label: "Almanya Kalitesi", to: "/" },
  { label: "İletişim",         to: "/" },
  { label: "SSS",              to: "/" },
];

const legalLinks = [
  { label: "Gizlilik Politikası", to: "/legal/datenschutz" },
  { label: "Kullanım Koşulları",  to: "/legal/agb" },
  { label: "İade & Cayma",        to: "/legal/widerruf" },
  { label: "Kargo Bilgisi",       to: "/legal/versand" },
];

export function Footer() {
  return (
    <footer className="bg-plaster border-t border-outline-variant">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[72px] pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">

          {/* Brand column */}
          <div className="md:col-span-4">
            <div className="mb-5">
              <img src="/images/logo.png" alt="OLD IRON"
                className="h-[52px] w-auto object-contain opacity-80" />
            </div>

            <p className="text-[13px] text-secondary leading-relaxed mb-6 max-w-xs tracking-[-0.01em]">
              Premium spor giyim ve supplement. Almanya'da üretildi,
              Türkiye'ye teslim. Old School zihniyeti, modern güç.
            </p>

            <div className="space-y-2">
              {[
                { icon: "workspace_premium" as IconName, text: "Almanya'da Üretildi" },
                { icon: "science" as IconName,           text: "ISO 17025 Lab Onaylı" },
                { icon: "local_shipping" as IconName,    text: "Türkiye'ye Hızlı Kargo" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2">
                  <Icon name={b.icon} size={14} className="text-cobalt" />
                  <span className="text-[11px] text-secondary font-medium">{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="md:col-span-2">
            <p className="text-eyebrow mb-5">Mağaza</p>
            <ul className="space-y-3">
              {shopLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to}
                    className="text-[13px] text-secondary hover:text-foreground transition-colors cursor-pointer link-underline font-medium">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-eyebrow mb-5">Bilgi</p>
            <ul className="space-y-3">
              {infoLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to}
                    className="text-[13px] text-secondary hover:text-foreground transition-colors cursor-pointer link-underline font-medium">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-eyebrow mb-5">Yasal</p>
            <ul className="space-y-3">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to}
                    className="text-[13px] text-secondary hover:text-foreground transition-colors cursor-pointer link-underline font-medium">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <p className="text-eyebrow mb-5">İletişim</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Icon name="alternate_email" size={14} className="text-cobalt mt-0.5 flex-shrink-0" />
                <span className="text-[12px] text-secondary font-medium">info@oldiron.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="location_on" size={14} className="text-cobalt mt-0.5 flex-shrink-0" />
                <span className="text-[12px] text-secondary font-medium">Almanya · Türkiye'ye Gönderim</span>
              </li>
            </ul>

            <div className="flex gap-2 mt-8">
              {[
                { icon: "photo_camera" as IconName, label: "Instagram" },
                { icon: "public" as IconName,       label: "Web" },
                { icon: "mail" as IconName,         label: "E-posta" },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label}
                  className="w-9 h-9 bg-white border border-outline-variant rounded-[8px] flex items-center justify-center
                    text-secondary hover:text-cobalt hover:border-cobalt/30 transition-all cursor-pointer">
                  <Icon name={s.icon} size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-px bg-outline-variant mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-secondary tracking-[-0.01em] font-medium">
            © 2026 OLD IRON — Disiplinden Dövülmüş
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-secondary font-medium">Ödeme:</span>
            {["Visa", "MC", "TR Pay"].map((pay) => (
              <span key={pay}
                className="text-[10px] bg-white border border-outline-variant rounded-[6px] px-2.5 py-1 text-secondary font-bold">
                {pay}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
