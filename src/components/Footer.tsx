export function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/30 w-full py-stack-lg mt-stack-lg">
      <div className="flex flex-col items-center justify-center gap-unit px-margin-desktop max-w-[1440px] mx-auto text-center">
        <span className="font-headline text-[24px] text-primary mb-4 uppercase tracking-widest">OLD IRON</span>
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {["Impressum", "Datenschutz", "AGB", "Versandrichtlinien"].map((l) => (
            <a key={l} href="#" className="text-[12px] uppercase tracking-widest text-on-secondary-container hover:text-primary transition-colors">{l}</a>
          ))}
        </div>
        <div className="flex gap-6 mb-8">
          <a href="#" className="material-symbols-outlined text-secondary hover:text-primary">share</a>
          <a href="#" className="material-symbols-outlined text-secondary hover:text-primary">public</a>
          <a href="#" className="material-symbols-outlined text-secondary hover:text-primary">alternate_email</a>
        </div>
        <p className="text-[12px] text-secondary opacity-60">© 2026 OLD IRON. Geschmiedet aus Disziplin.</p>
      </div>
    </footer>
  );
}
