import { Link } from "@tanstack/react-router";

const legalLinks = [
  { label: "Hakkımızda", to: "/legal/impressum" },
  { label: "Gizlilik Politikası", to: "/legal/datenschutz" },
  { label: "Kullanım Koşulları", to: "/legal/agb" },
  { label: "İade & Cayma", to: "/legal/widerruf" },
  { label: "Kargo", to: "/legal/versand" },
] as const;

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/30 w-full py-stack-lg mt-stack-lg">
      <div className="flex flex-col items-center justify-center gap-unit px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto text-center">
        <span className="font-headline text-[24px] text-primary mb-2 uppercase tracking-widest">OLD IRON</span>
        <p className="text-[11px] text-outline uppercase tracking-[0.2em] mb-6">Disiplinden Dövülmüş</p>
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {legalLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[12px] uppercase tracking-widest text-on-secondary-container hover:text-primary transition-colors cursor-pointer"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex gap-6 mb-8">
          <a href="#" className="material-symbols-outlined text-secondary hover:text-primary transition-colors" aria-label="Instagram">share</a>
          <a href="#" className="material-symbols-outlined text-secondary hover:text-primary transition-colors" aria-label="Website">public</a>
          <a href="#" className="material-symbols-outlined text-secondary hover:text-primary transition-colors" aria-label="E-posta">alternate_email</a>
        </div>
        <p className="text-[12px] text-secondary opacity-60">© 2026 OLD IRON. Disiplinden Dövülmüş.</p>
      </div>
    </footer>
  );
}
