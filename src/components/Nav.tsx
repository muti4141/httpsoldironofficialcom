import { Link } from "@tanstack/react-router";
import { useCartCount } from "@/stores/cart";
import { useAuth, signOut } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";

export function Nav() {
  const cartCount  = useCartCount();
  const { user }   = useAuth();
  const [accountOpen,  setAccountOpen]  = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close account dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node))
        setAccountOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await signOut();
    setAccountOpen(false);
    toast.success("Çıkış yapıldı.");
  };

  return (
    <>
      <nav className={`nav-bar fixed top-0 z-50 w-full ${scrolled ? "scrolled" : ""}`}>
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-[68px] max-w-[1440px] mx-auto">

          {/* ── Logo ── */}
          <Link to="/" onClick={() => setMobileOpen(false)}
            className="flex items-center cursor-pointer group">
            <img
              src="/images/logo.png"
              alt="OLD IRON"
              className="h-[52px] w-auto object-contain brightness-90
                hover:brightness-110 transition-all duration-300
                group-hover:[filter:brightness(1)_sepia(0.6)_saturate(4)_hue-rotate(340deg)]"
            />
          </Link>

          {/* ── Desktop Links ── */}
          <div className="hidden md:flex gap-9 items-center">
            <NavLink to="/shop">Mağaza</NavLink>

            {/* Mega Dropdown */}
            <div className="group relative">
              <button className="nav-link flex items-center gap-1 cursor-pointer pb-0">
                Kategoriler
                <span className="material-symbols-outlined text-[14px] group-hover:rotate-180 transition-transform duration-300">
                  expand_more
                </span>
              </button>

              {/* Dropdown panel */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-5 w-[520px]
                bg-surface-container-low border border-outline-variant/30
                shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)]
                opacity-0 invisible translate-y-2
                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                transition-all duration-300 ease-out
                grid grid-cols-2 overflow-hidden">

                {/* Giyim */}
                <div className="p-6 border-r border-outline-variant/20 relative">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-warm/40 to-transparent" />
                  <p className="text-eyebrow mb-5">Spor Giyim</p>
                  {[
                    { label: "Oversize T-Shirt",  icon: "checkroom",     sub: "300gsm premium pamuk" },
                    { label: "Atlet & Stringer",  icon: "checkroom",     sub: "Derin kesim, maksimum hareket" },
                    { label: "Şort",              icon: "sports",        sub: "Antrenman serisi" },
                    { label: "Hoodie",            icon: "checkroom",     sub: "Oversize, kanguru cep" },
                    { label: "Aksesuar",          icon: "shopping_bag",  sub: "Çanta, askı, ekipman" },
                  ].map((item) => (
                    <Link key={item.label} to="/shop"
                      className="flex items-center gap-3 py-2.5 group/item cursor-pointer">
                      <span className="material-symbols-outlined text-[15px] text-accent-warm/50 group-hover/item:text-accent-warm transition-colors flex-shrink-0">{item.icon}</span>
                      <div>
                        <p className="text-[13px] text-secondary group-hover/item:text-primary transition-colors leading-none mb-0.5">{item.label}</p>
                        <p className="text-[10px] text-outline">{item.sub}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Supplement */}
                <div className="p-6 relative">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-warm/40 to-transparent" />
                  <p className="text-eyebrow mb-5">Supplement</p>
                  {[
                    { label: "Protein",         icon: "fitness_center",       sub: "Whey konsantrat, 24g/porsiyon" },
                    { label: "Kreatin",          icon: "bolt",                 sub: "Saf monohidrat, 3g/porsiyon" },
                    { label: "Pre-Workout",      icon: "local_fire_department",sub: "300mg kafein + beta-alanin" },
                    { label: "Amino Asit",       icon: "science",              sub: "BCAA 4:1:1 & Glutamine" },
                    { label: "Thermo & Enerji",  icon: "whatshot",             sub: "L-Karnitin bazlı sistem" },
                  ].map((item) => (
                    <Link key={item.label} to="/shop"
                      className="flex items-center gap-3 py-2.5 group/item cursor-pointer">
                      <span className="material-symbols-outlined text-[15px] text-accent-warm/50 group-hover/item:text-accent-warm transition-colors flex-shrink-0">{item.icon}</span>
                      <div>
                        <p className="text-[13px] text-secondary group-hover/item:text-primary transition-colors leading-none mb-0.5">{item.label}</p>
                        <p className="text-[10px] text-outline">{item.sub}</p>
                      </div>
                    </Link>
                  ))}
                  {/* Supplement badge */}
                  <div className="mt-4 pt-4 border-t border-outline-variant/20">
                    <div className="flex items-center gap-2 text-[10px] text-accent-warm uppercase tracking-widest">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      ISO 17025 Lab Onaylı
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <NavLink to="/">Hikayemiz</NavLink>
            <NavLink to="/">İletişim</NavLink>
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <button className="hidden md:flex items-center justify-center w-8 h-8 text-secondary hover:text-primary transition-colors cursor-pointer" aria-label="Ara">
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>

            {/* Account */}
            <div ref={accountRef} className="relative hidden md:block">
              <button onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center justify-center w-8 h-8 text-secondary hover:text-primary transition-colors cursor-pointer"
                aria-label="Hesabım" aria-expanded={accountOpen}>
                <span className="material-symbols-outlined text-[22px]">account_circle</span>
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-full mt-3 w-56
                  bg-surface-container-low border border-outline-variant/30
                  shadow-[0_16px_48px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)]
                  py-2 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-warm/30 to-transparent" />

                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-outline-variant/20 mb-1">
                        <p className="text-[9px] uppercase tracking-[0.25em] text-outline mb-1">Giriş Yapıldı</p>
                        <p className="text-[12px] text-primary truncate font-medium">{user.email}</p>
                      </div>
                      <MenuLink to="/account" onClick={() => setAccountOpen(false)}>Hesabım</MenuLink>
                      <button onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-[11px] uppercase tracking-[0.15em] text-secondary hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
                        Çıkış Yap
                      </button>
                    </>
                  ) : (
                    <>
                      <MenuLink to="/auth" search={{ mode: "login", redirect: "/" }} onClick={() => setAccountOpen(false)}>
                        Giriş Yap
                      </MenuLink>
                      <MenuLink to="/auth" search={{ mode: "signup", redirect: "/" }} onClick={() => setAccountOpen(false)}>
                        Hesap Oluştur
                      </MenuLink>
                      <div className="px-4 pt-3 pb-2 border-t border-outline-variant/20 mt-1">
                        <p className="text-[10px] text-outline leading-relaxed">Üye olarak özel fırsatlardan yararlan.</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart"
              className="relative flex items-center justify-center w-8 h-8 text-secondary hover:text-primary transition-colors cursor-pointer group"
              aria-label={`Sepet (${cartCount} ürün)`}>
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent-warm text-on-primary-container text-[9px] min-w-[17px] h-[17px] px-1 flex items-center justify-center font-bold leading-none">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button className="md:hidden flex items-center justify-center w-8 h-8 text-secondary hover:text-primary transition-colors cursor-pointer"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menü" aria-expanded={mobileOpen}>
              <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-400 ${mobileOpen ? "visible" : "invisible"}`}>
        {/* Backdrop */}
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
        />

        {/* Panel */}
        <div className={`absolute right-0 top-0 bottom-0 w-[300px]
          bg-surface-container-low border-l border-outline-variant/30
          flex flex-col overflow-y-auto
          transition-transform duration-400 ease-out
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 h-[68px] border-b border-outline-variant/20 flex-shrink-0">
            <img src="/images/logo.png" alt="OLD IRON"
              className="h-[44px] w-auto object-contain brightness-90" />
            <button onClick={() => setMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center text-secondary hover:text-primary cursor-pointer">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col flex-1 py-4">
            <MobileNavLink to="/"     onClick={() => setMobileOpen(false)}>Ana Sayfa</MobileNavLink>
            <MobileNavLink to="/shop" onClick={() => setMobileOpen(false)}>Mağaza</MobileNavLink>
            <MobileNavLink to="/cart" onClick={() => setMobileOpen(false)}>Sepetim {cartCount > 0 && `(${cartCount})`}</MobileNavLink>

            <div className="mx-6 my-3 h-px bg-outline-variant/30" />

            <div className="px-6 mb-4">
              <p className="text-eyebrow mb-3">Spor Giyim</p>
              {["Oversize T-Shirt","Atlet & Stringer","Şort","Hoodie","Aksesuar"].map((c) => (
                <Link key={c} to="/shop" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-2 text-[13px] text-secondary hover:text-primary transition-colors uppercase tracking-widest cursor-pointer">
                  <span className="w-1 h-1 bg-accent-warm/50 rounded-full flex-shrink-0" />
                  {c}
                </Link>
              ))}
            </div>

            <div className="mx-6 my-1 h-px bg-outline-variant/30" />

            <div className="px-6 mt-4 mb-4">
              <p className="text-eyebrow mb-3">Supplement</p>
              {["Protein","Kreatin","Pre-Workout","Amino Asit","Thermo & Enerji"].map((c) => (
                <Link key={c} to="/shop" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-2 text-[13px] text-secondary hover:text-primary transition-colors uppercase tracking-widest cursor-pointer">
                  <span className="w-1 h-1 bg-accent-warm/50 rounded-full flex-shrink-0" />
                  {c}
                </Link>
              ))}
            </div>

            <div className="mx-6 h-px bg-outline-variant/30 mb-4" />

            <div className="px-6 space-y-1">
              {user ? (
                <>
                  <Link to="/account" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2.5 text-[13px] uppercase tracking-widest text-secondary hover:text-primary cursor-pointer">
                    <span className="material-symbols-outlined text-[16px] text-accent-warm/60">account_circle</span>
                    Hesabım
                  </Link>
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 py-2.5 text-[13px] uppercase tracking-widest text-secondary hover:text-primary cursor-pointer w-full">
                    <span className="material-symbols-outlined text-[16px] text-accent-warm/60">logout</span>
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth" search={{ mode: "login", redirect: "/" } as never}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2.5 text-[13px] uppercase tracking-widest text-secondary hover:text-primary cursor-pointer">
                    <span className="material-symbols-outlined text-[16px] text-accent-warm/60">login</span>
                    Giriş Yap
                  </Link>
                  <Link to="/auth" search={{ mode: "signup", redirect: "/" } as never}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2.5 text-[13px] uppercase tracking-widest text-accent-warm hover:text-primary cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                    Hesap Oluştur
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-outline-variant/20 flex-shrink-0">
            <p className="text-[10px] text-outline uppercase tracking-widest">Türkiye'de Üretildi · Türkiye'ye Teslim</p>
          </div>
        </div>
      </div>
    </>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="nav-link cursor-pointer"
      activeProps={{ className: "nav-link active cursor-pointer" }}>
      {children}
    </Link>
  );
}

function MobileNavLink({ to, onClick, children }: { to: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Link to={to} onClick={onClick}
      className="flex items-center px-6 py-3.5 text-[14px] font-semibold uppercase tracking-[0.14em] text-secondary hover:text-primary hover:bg-surface-container/60 transition-colors cursor-pointer">
      {children}
    </Link>
  );
}

function MenuLink({ to, search, onClick, children }: { to: string; search?: Record<string,string>; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Link to={to} search={search as never} onClick={onClick}
      className="block px-4 py-2.5 text-[11px] uppercase tracking-[0.15em] text-secondary hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
      {children}
    </Link>
  );
}
