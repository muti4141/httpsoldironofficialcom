import { Link } from "@tanstack/react-router";

export function Nav({ cartCount = 0 }: { cartCount?: number }) {
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
          <button className="material-symbols-outlined text-secondary hover:text-primary transition-colors">
            account_circle
          </button>
          <Link to="/cart" className="relative text-secondary hover:text-primary transition-colors">
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="absolute -top-2 -right-2 bg-primary text-on-primary text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
              {cartCount}
            </span>
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
