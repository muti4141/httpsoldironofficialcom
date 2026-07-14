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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node))
        setAccountOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await signOut();
    setAccountOpen(false);
    toast.success("Abgemeldet.");
  };

  const categories = [
    { label: "Oversize T-Shirts", icon: "checkroom",    sub: "300 g/m² Premium-Baumwolle" },
    { label: "Tanks & Stringer",  icon: "checkroom",    sub: "Tiefer Schnitt, maximale Bewegung" },
    { label: "Shorts",            icon: "sports",       sub: "Trainingsserie" },
    { label: "Hoodies",           icon: "checkroom",    sub: "Oversize, Kängurutasche" },
    { label: "Accessoires",       icon: "shopping_bag", sub: "Taschen, Riemen, Zubehör" },
  ];

  return (
    <>
      <nav className={`nav-bar fixed top-0 z-50 w-full ${scrolled ? "scrolled" : ""}`}>
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-[68px] max-w-[1440px] mx-auto">

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

          <div className="hidden md:flex gap-9 items-center">
            <NavLink to="/shop">Shop</NavLink>

            <div className="group relative">
              <button className="nav-link flex items-center gap-1 cursor-pointer pb-0">
                Kategorien
                <span className="material-symbols-outlined text-[14px] group-hover:rotate-180 transition-transform duration-300">
                  expand_more
                </span>
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-5 w-[340px]
                bg-surface-container-low border border-outline-variant/30
                shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)]
                opacity-0 invisible translate-y-2
                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                transition-all duration-300 ease-out overflow-hidden">
                <div className="p-6 relative">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-warm/40 to-transparent" />
                  <p className="text-eyebrow mb-5">Sportbekleidung</p>
                  {categories.map((item) => (
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
              </div>
            </div>

            <NavLink to="/">Unsere Geschichte</NavLink>
            <NavLink to="/legal/impressum">Kontakt</NavLink>
          </div>

          <div className="flex items-center gap-5">
            <div ref={accountRef} className="relative hidden md:block">
              <button onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center justify-center w-8 h-8 text-secondary hover:text-primary transition-colors cursor-pointer"
                aria-label="Mein Konto" aria-expanded={accountOpen}>
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
                        <p className="text-[9px] uppercase tracking-[0.25em] text-outline mb-1">Angemeldet als</p>
                        <p className="text-[12px] text-primary truncate font-medium">{user.email}</p>
                      </div>
                      <MenuLink to="/account" onClick={() => setAccountOpen(false)}>Mein Konto</MenuLink>
                      <button onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-[11px] uppercase tracking-[0.15em] text-secondary hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
                        Abmelden
                      </button>
                    </>
                  ) : (
                    <>
                      <MenuLink to="/auth" search={{ mode: "login", redirect: "/" }} onClick={() => setAccountOpen(false)}>
                        Anmelden
                      </MenuLink>
                      <MenuLink to="/auth" search={{ mode: "signup", redirect: "/" }} onClick={() => setAccountOpen(false)}>
                        Konto erstellen
                      </MenuLink>
                      <div className="px-4 pt-3 pb-2 border-t border-outline-variant/20 mt-1">
                        <p className="text-[10px] text-outline leading-relaxed">Als Mitglied exklusive Angebote sichern.</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link to="/cart"
              className="relative flex items-center justify-center w-8 h-8 text-secondary hover:text-primary transition-colors cursor-pointer group"
              aria-label={`Warenkorb (${cartCount} Artikel)`}>
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent-warm text-on-primary-container text-[9px] min-w-[17px] h-[17px] px-1 flex items-center justify-center font-bold leading-none">
                  {cartCount}
                </span>
              )}
            </Link>

            <button className="md:hidden flex items-center justify-center w-8 h-8 text-secondary hover:text-primary transition-colors cursor-pointer"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menü" aria-expanded={mobileOpen}>
              <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-400 ${mobileOpen ? "visible" : "invisible"}`}>
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div className={`absolute right-0 top-0 bottom-0 w-[300px]
          bg-surface-container-low border-l border-outline-variant/30
          flex flex-col overflow-y-auto
          transition-transform duration-400 ease-out
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>

          <div className="flex items-center justify-between px-6 h-[68px] border-b border-outline-variant/20 flex-shrink-0">
            <img src="/images/logo.png" alt="OLD IRON"
              className="h-[44px] w-auto object-contain brightness-90" />
            <button onClick={() => setMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center text-secondary hover:text-primary cursor-pointer">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex flex-col flex-1 py-4">
            <MobileNavLink to="/"     onClick={() => setMobileOpen(false)}>Startseite</MobileNavLink>
            <MobileNavLink to="/shop" onClick={() => setMobileOpen(false)}>Shop</MobileNavLink>
            <MobileNavLink to="/cart" onClick={() => setMobileOpen(false)}>Warenkorb {cartCount > 0 && `(${cartCount})`}</MobileNavLink>

            <div className="mx-6 my-3 h-px bg-outline-variant/30" />

            <div className="px-6 mb-4">
              <p className="text-eyebrow mb-3">Sportbekleidung</p>
              {categories.map((c) => (
                <Link key={c.label} to="/shop" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-2 text-[13px] text-secondary hover:text-primary transition-colors uppercase tracking-widest cursor-pointer">
                  <span className="w-1 h-1 bg-accent-warm/50 rounded-full flex-shrink-0" />
                  {c.label}
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
                    Mein Konto
                  </Link>
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 py-2.5 text-[13px] uppercase tracking-widest text-secondary hover:text-primary cursor-pointer w-full">
                    <span className="material-symbols-outlined text-[16px] text-accent-warm/60">logout</span>
                    Abmelden
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth" search={{ mode: "login", redirect: "/" } as never}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2.5 text-[13px] uppercase tracking-widest text-secondary hover:text-primary cursor-pointer">
                    <span className="material-symbols-outlined text-[16px] text-accent-warm/60">login</span>
                    Anmelden
                  </Link>
                  <Link to="/auth" search={{ mode: "signup", redirect: "/" } as never}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2.5 text-[13px] uppercase tracking-widest text-accent-warm hover:text-primary cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                    Konto erstellen
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-outline-variant/20 flex-shrink-0">
            <p className="text-[10px] text-outline uppercase tracking-widest">Versand aus Deutschland</p>
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
