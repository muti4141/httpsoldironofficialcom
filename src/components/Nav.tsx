import { Link } from "@tanstack/react-router";
import { useCartCount } from "@/stores/cart";
import { useAuth, signOut } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";

export function Nav() {
  const cartCount = useCartCount();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setOpen(false);
    toast.success("Abgemeldet.");
  };

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-outline-variant/50 fixed top-0 z-50 w-full">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-[1440px] mx-auto">
        <Link to="/" className="font-headline text-[32px] leading-none text-primary uppercase">
          OLD IRON
        </Link>
        <div className="hidden md:flex gap-gutter items-center">
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/shop">Kategorien</NavLink>
          <NavLink to="/">Story</NavLink>
          <NavLink to="/">Kontakt</NavLink>
        </div>
        <div className="flex items-center gap-5">
          <button className="material-symbols-outlined text-secondary hover:text-primary transition-colors">
            search
          </button>
          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="material-symbols-outlined text-secondary hover:text-primary transition-colors"
              aria-label="Account"
            >
              account_circle
            </button>
            {open && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-surface-container border border-outline-variant/50 shadow-xl py-2">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-outline-variant/30">
                      <p className="text-[10px] uppercase tracking-widest text-outline">Angemeldet als</p>
                      <p className="text-[14px] text-primary truncate">{user.email}</p>
                    </div>
                    <MenuLink to="/account" onClick={() => setOpen(false)}>Mein Konto</MenuLink>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-[14px] uppercase tracking-widest text-secondary hover:text-primary hover:bg-surface-container-high"
                    >
                      Abmelden
                    </button>
                  </>
                ) : (
                  <>
                    <MenuLink to="/auth" search={{ mode: "login", redirect: "/" }} onClick={() => setOpen(false)}>
                      Anmelden
                    </MenuLink>
                    <MenuLink to="/auth" search={{ mode: "signup", redirect: "/" }} onClick={() => setOpen(false)}>
                      Konto Erstellen
                    </MenuLink>
                  </>
                )}
              </div>
            )}
          </div>
          <Link to="/cart" className="relative text-secondary hover:text-primary transition-colors">
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-on-primary text-[10px] min-w-4 h-4 px-1 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-[14px] font-semibold uppercase tracking-[0.16em] text-secondary hover:text-primary transition-colors"
      activeProps={{ className: "text-primary border-b-2 border-primary pb-1" }}
    >
      {children}
    </Link>
  );
}

function MenuLink({
  to,
  search,
  onClick,
  children,
}: {
  to: string;
  search?: Record<string, string>;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      search={search as never}
      onClick={onClick}
      className="block px-4 py-3 text-[14px] uppercase tracking-widest text-secondary hover:text-primary hover:bg-surface-container-high"
    >
      {children}
    </Link>
  );
}
