import { Link } from "@tanstack/react-router";
import { useCartCount } from "@/stores/cart";
import { useAuth, signOut } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";

export function Nav() {
  const cartCount = useCartCount();
  const { user } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node))
        setAccountOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setAccountOpen(false);
    toast.success("Çıkış yapıldı.");
  };

  return (
    <>
      <nav className="bg-background/95 backdrop-blur-md border-b border-outline-variant/40 fixed top-0 z-50 w-full">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-[14px] max-w-[1440px] mx-auto">

          {/* Logo */}
          <Link
            to="/"
            className="font-headline text-[28px] leading-none text-primary uppercase hover:text-accent-warm transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            OLD IRON
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center">
            <NavLink to="/shop">Mağaza</NavLink>
            <div className="group relative">
              <button className="text-[13px] font-semibold uppercase tracking-[0.16em] text-secondary hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
                Kategoriler
                <span className="material-symbols-outlined text-[16px] group-hover:rotate-180 transition-transform duration-200">expand_more</span>
              </button>
              {/* Mega dropdown */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] bg-surface-container border border-outline-variant/40 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 grid grid-cols-2">
                <div className="p-5 border-r border-outline-variant/30">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-accent-warm mb-3">Spor Giyim</p>
                  {[
                    { label: "Oversize T-Shirt",  icon: "checkroom" },
                    { label: "Atlet & Stringer",  icon: "checkroom" },
                    { label: "Şort",              icon: "checkroom" },
                    { label: "Hoodie",            icon: "checkroom" },
                    { label: "Aksesuar",          icon: "shopping_bag" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to="/shop"
                      className="flex items-center gap-3 py-2 text-[13px] text-secondary hover:text-primary transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-accent-warm/60">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-accent-warm mb-3">Supplement</p>
                  {[
                    { label: "Protein",       icon: "fitness_center" },
                    { label: "Kreatin",       icon: "fitness_center" },
                    { label: "Pre-Workout",   icon: "bolt" },
                    { label: "Amino Asit",    icon: "science" },
                    { label: "Thermo & Enerji", icon: "local_fire_department" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to="/shop"
                      className="flex items-center gap-3 py-2 text-[13px] text-secondary hover:text-primary transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-accent-warm/60">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <NavLink to="/">Hikayemiz</NavLink>
            <NavLink to="/">İletişim</NavLink>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-5">
            <button
              className="hidden md:block material-symbols-outlined text-secondary hover:text-primary transition-colors cursor-pointer"
              aria-label="Ara"
            >
              search
            </button>

            {/* Account dropdown */}
            <div ref={accountRef} className="relative hidden md:block">
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="material-symbols-outlined text-secondary hover:text-primary transition-colors cursor-pointer"
                aria-label="Hesabım"
                aria-expanded={accountOpen}
              >
                account_circle
              </button>
              {accountOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-surface-container border border-outline-variant/50 shadow-2xl py-2">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-outline-variant/30">
                        <p className="text-[10px] uppercase tracking-widest text-outline">Giriş yapıldı</p>
                        <p className="text-[13px] text-primary truncate">{user.email}</p>
                      </div>
                      <MenuLink to="/account" onClick={() => setAccountOpen(false)}>Hesabım</MenuLink>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-[13px] uppercase tracking-widest text-secondary hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                      >
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
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative text-secondary hover:text-primary transition-colors" aria-label={`Sepet (${cartCount} ürün)`}>
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-warm text-on-primary-container text-[10px] min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-secondary hover:text-primary transition-colors cursor-pointer"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menüyü aç"
              aria-expanded={mobileOpen}
            >
              <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-surface-container-low border-l border-outline-variant/40 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
              <span className="font-headline text-[24px] text-primary uppercase">OLD IRON</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="material-symbols-outlined text-secondary hover:text-primary transition-colors cursor-pointer"
                aria-label="Menüyü kapat"
              >
                close
              </button>
            </div>
            <div className="flex flex-col py-4 flex-1">
              <MobileNavLink to="/" onClick={() => setMobileOpen(false)}>Ana Sayfa</MobileNavLink>
              <MobileNavLink to="/shop" onClick={() => setMobileOpen(false)}>Mağaza</MobileNavLink>

              <div className="px-6 py-3 border-t border-outline-variant/20 mt-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-accent-warm mb-3">Spor Giyim</p>
                {["Oversize T-Shirt", "Atlet & Stringer", "Şort", "Hoodie", "Aksesuar"].map((c) => (
                  <Link key={c} to="/shop" onClick={() => setMobileOpen(false)}
                    className="block py-2 text-[14px] text-secondary hover:text-primary transition-colors uppercase tracking-widest cursor-pointer">
                    {c}
                  </Link>
                ))}
              </div>
              <div className="px-6 py-3 border-t border-outline-variant/20 mt-1">
                <p className="text-[10px] uppercase tracking-[0.3em] text-accent-warm mb-3">Supplement</p>
                {["Protein", "Kreatin", "Pre-Workout", "Amino Asit", "Thermo & Enerji"].map((c) => (
                  <Link key={c} to="/shop" onClick={() => setMobileOpen(false)}
                    className="block py-2 text-[14px] text-secondary hover:text-primary transition-colors uppercase tracking-widest cursor-pointer">
                    {c}
                  </Link>
                ))}
              </div>

              <div className="border-t border-outline-variant/20 mt-4 px-6 py-4 space-y-3">
                {user ? (
                  <>
                    <Link to="/account" onClick={() => setMobileOpen(false)} className="block text-[14px] uppercase tracking-widest text-secondary hover:text-primary cursor-pointer">Hesabım</Link>
                    <button onClick={handleLogout} className="block text-[14px] uppercase tracking-widest text-secondary hover:text-primary cursor-pointer">Çıkış Yap</button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" search={{ mode: "login", redirect: "/" } as never} onClick={() => setMobileOpen(false)} className="block text-[14px] uppercase tracking-widest text-secondary hover:text-primary cursor-pointer">Giriş Yap</Link>
                    <Link to="/auth" search={{ mode: "signup", redirect: "/" } as never} onClick={() => setMobileOpen(false)} className="block text-[14px] uppercase tracking-widest text-secondary hover:text-primary cursor-pointer">Hesap Oluştur</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to}
      className="text-[13px] font-semibold uppercase tracking-[0.16em] text-secondary hover:text-primary transition-colors cursor-pointer"
      activeProps={{ className: "text-accent-warm border-b border-accent-warm pb-0.5" }}>
      {children}
    </Link>
  );
}

function MobileNavLink({ to, onClick, children }: { to: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Link to={to} onClick={onClick}
      className="block px-6 py-3 text-[15px] font-semibold uppercase tracking-widest text-secondary hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
      {children}
    </Link>
  );
}

function MenuLink({ to, search, onClick, children }: { to: string; search?: Record<string, string>; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Link to={to} search={search as never} onClick={onClick}
      className="block px-4 py-3 text-[13px] uppercase tracking-widest text-secondary hover:text-primary hover:bg-surface-container-high transition-colors cursor-pointer">
      {children}
    </Link>
  );
}
