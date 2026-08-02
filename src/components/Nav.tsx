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
    toast.success("Çıkış yapıldı.");
  };

  return (
    <>
      <nav
        className={`nav-bar fixed top-0 z-50 w-full ${scrolled ? "scrolled" : ""}`}
        style={{ background: "#ffffff", borderBottom: "1px solid #ecedee" }}
      >
        <div className="relative flex justify-between items-center w-full px-[20px] md:px-[52px] h-[56px] max-w-[1440px] mx-auto">

          {/* ── Left: Shop pill ── */}
          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="shop-pill hidden md:inline-flex"
              activeProps={{ className: "shop-pill hidden md:inline-flex active" }}
              onClick={() => setMobileOpen(false)}
            >
              Mağaza
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-8 h-8 cursor-pointer"
              style={{ color: "#111111" }}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menü" aria-expanded={mobileOpen}
            >
              <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
            </button>
          </div>

          {/* ── Center: wordmark ── */}
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 cursor-pointer"
          >
            <img
              src="/images/logo.png"
              alt=""
              aria-hidden
              className="h-[26px] w-auto object-contain"
              style={{ filter: "invert(1) brightness(0.15)" }}
            />
            <span
              className="font-bold leading-none"
              style={{ fontSize: "20px", letterSpacing: "-0.04em", color: "#111111" }}
            >
              old iron
            </span>
          </Link>

          {/* ── Right: actions ── */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              className="hidden md:flex items-center justify-center w-8 h-8 cursor-pointer transition-opacity hover:opacity-70"
              style={{ color: "#111111" }}
              aria-label="Ara"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>

            {/* Account */}
            <div ref={accountRef} className="relative hidden md:block">
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center h-8 cursor-pointer transition-colors"
                style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "-0.04em", color: "#737780" }}
                aria-label="Hesabım" aria-expanded={accountOpen}
              >
                {user ? "Hesabım" : "Giriş"}
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-full mt-3 w-52
                  bg-white rounded-[10px]
                  shadow-[0_8px_32px_rgba(0,0,0,0.12)]
                  py-2 overflow-hidden"
                  style={{ border: "1px solid #ecedee" }}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-3 mb-1" style={{ borderBottom: "1px solid #ecedee" }}>
                        <p className="text-[9px] uppercase tracking-[0.25em] mb-1" style={{ color: "#737780" }}>Giriş Yapıldı</p>
                        <p className="text-[12px] truncate font-semibold" style={{ color: "#111111" }}>{user.email}</p>
                      </div>
                      <MenuLink to="/account" onClick={() => setAccountOpen(false)}>Hesabım</MenuLink>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-[12px] font-medium cursor-pointer transition-colors hover:bg-[#ecedee]"
                        style={{ color: "#737780" }}
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
                      <div className="px-4 pt-3 pb-2 mt-1" style={{ borderTop: "1px solid #ecedee" }}>
                        <p className="text-[10px] leading-relaxed" style={{ color: "#737780" }}>Üye olarak özel fırsatlardan yararlan.</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center w-8 h-8 cursor-pointer transition-opacity hover:opacity-70"
              style={{ color: "#111111" }}
              aria-label={`Sepet (${cartCount} ürün)`}
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 text-white text-[9px] min-w-[17px] h-[17px] px-1 flex items-center justify-center font-bold leading-none rounded-full"
                  style={{ background: "#000aff" }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-400 ${mobileOpen ? "visible" : "invisible"}`}>
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
        />

        <div
          className={`absolute right-0 top-0 bottom-0 w-[300px]
          bg-white
          flex flex-col overflow-y-auto
          transition-transform duration-400 ease-out
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{ borderLeft: "1px solid #ecedee" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 h-[56px] flex-shrink-0" style={{ borderBottom: "1px solid #ecedee" }}>
            <span className="font-bold" style={{ fontSize: "18px", letterSpacing: "-0.04em", color: "#111111" }}>old iron</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center cursor-pointer"
              style={{ color: "#737780" }}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col flex-1 py-4">
            <MobileNavLink to="/"     onClick={() => setMobileOpen(false)}>Ana Sayfa</MobileNavLink>
            <MobileNavLink to="/shop" onClick={() => setMobileOpen(false)}>Mağaza</MobileNavLink>
            <MobileNavLink to="/cart" onClick={() => setMobileOpen(false)}>Sepetim {cartCount > 0 && `(${cartCount})`}</MobileNavLink>

            <div className="mx-6 my-3 h-px" style={{ background: "#ecedee" }} />

            <div className="px-6 mb-4">
              <p className="text-eyebrow mb-3">Spor Giyim</p>
              {["Oversize T-Shirt","Atlet & Stringer","Şort","Hoodie","Aksesuar"].map((c) => (
                <Link key={c} to="/shop" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-2 text-[13px] transition-colors cursor-pointer font-medium hover:text-[#111111]"
                  style={{ color: "#737780" }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#000aff" }} />
                  {c}
                </Link>
              ))}
            </div>

            <div className="mx-6 my-1 h-px" style={{ background: "#ecedee" }} />

            <div className="px-6 mt-4 mb-4">
              <p className="text-eyebrow mb-3">Supplement</p>
              {["Protein","Kreatin","Pre-Workout","Amino Asit","Thermo & Enerji"].map((c) => (
                <Link key={c} to="/shop" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-2 text-[13px] transition-colors cursor-pointer font-medium hover:text-[#111111]"
                  style={{ color: "#737780" }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#000aff" }} />
                  {c}
                </Link>
              ))}
            </div>

            <div className="mx-6 h-px mb-4" style={{ background: "#ecedee" }} />

            <div className="px-6 space-y-1">
              {user ? (
                <>
                  <Link to="/account" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2.5 text-[13px] font-semibold cursor-pointer"
                    style={{ color: "#737780" }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: "#111111" }}>account_circle</span>
                    Hesabım
                  </Link>
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 py-2.5 text-[13px] font-semibold cursor-pointer w-full"
                    style={{ color: "#737780" }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: "#111111" }}>logout</span>
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth" search={{ mode: "login", redirect: "/" } as never}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2.5 text-[13px] font-semibold cursor-pointer"
                    style={{ color: "#737780" }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: "#111111" }}>login</span>
                    Giriş Yap
                  </Link>
                  <Link to="/auth" search={{ mode: "signup", redirect: "/" } as never}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2.5 text-[13px] font-bold cursor-pointer"
                    style={{ color: "#000aff" }}>
                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                    Hesap Oluştur
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 flex-shrink-0" style={{ borderTop: "1px solid #ecedee" }}>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: "#737780" }}>Almanya'da Üretildi · Türkiye'ye Teslim</p>
          </div>
        </div>
      </div>
    </>
  );
}

function MobileNavLink({ to, onClick, children }: { to: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Link to={to} onClick={onClick}
      className="flex items-center px-6 py-3.5 text-[14px] font-bold transition-colors cursor-pointer tracking-[-0.01em] hover:bg-[#ecedee]"
      style={{ color: "#111111" }}>
      {children}
    </Link>
  );
}

function MenuLink({ to, search, onClick, children }: { to: string; search?: Record<string,string>; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Link to={to} search={search as never} onClick={onClick}
      className="block px-4 py-2.5 text-[12px] font-medium transition-colors cursor-pointer hover:bg-[#ecedee]"
      style={{ color: "#737780" }}>
      {children}
    </Link>
  );
}
