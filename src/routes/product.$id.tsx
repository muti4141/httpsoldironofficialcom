import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductVideo } from "@/components/ProductVideo";
import { findProduct, APPAREL_PLACEHOLDER } from "@/data/products";
import { useAllProducts } from "@/hooks/useAllProducts";
import { useCart } from "@/stores/cart";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = findProduct(params.id);
    return { product: product ?? null };
  },
  head: ({ loaderData }) => ({
    meta: loaderData?.product
      ? [
          { title: `${loaderData.product.name} — OLD IRON` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — OLD IRON` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [{ title: "Produkt — OLD IRON" }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const allProducts = useAllProducts();
  const product = allProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Produkt nicht gefunden</h1>
          <Link to="/shop" className="text-accent-warm underline">Zurück zum Shop</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const SIZES = ["S", "M", "L", "XL", "XXL"];

  const [size, setSize] = useState("L");
  const [imgErr, setImgErr] = useState(false);

  const addToCart = useCart((s) => s.add);
  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const imgSrc = imgErr ? APPAREL_PLACEHOLDER : (product.image || APPAREL_PLACEHOLDER);

  const handleAdd = () => {
    addToCart(product, size);
    toast.success(`${product.name} zum Warenkorb hinzugefügt`);
  };

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />

      <div className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden mt-0">
        <img
          src={product.videoPoster || imgSrc}
          alt={product.name}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        <div className="absolute top-6 left-6 md:left-12 flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/60 mt-16">
          <Link to="/" className="hover:text-white transition-colors">Start</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-white/90">{product.name}</span>
        </div>

        {product.badge && (
          <div className="absolute top-24 md:top-28 right-6 md:right-12">
            <span className="text-[11px] font-semibold uppercase tracking-widest px-4 py-1.5 bg-primary text-on-primary">
              {product.badge}
            </span>
          </div>
        )}
      </div>

      <main className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop -mt-24 relative z-10 pb-stack-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="rounded-none aspect-[4/5] overflow-hidden border border-outline-variant/30 bg-surface-container relative">
              {product.video ? (
                <ProductVideo src={product.video} poster={product.videoPoster} alt={product.name} loop className="w-full h-full object-cover" />
              ) : (
                <img
                  src={imgSrc}
                  alt={product.name}
                  onError={() => setImgErr(true)}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute bottom-4 left-4">
                <span className="bg-surface-container/80 backdrop-blur-sm px-3 py-1 text-[11px] uppercase tracking-widest border border-outline-variant/40">
                  {product.categoryLabel}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square overflow-hidden border border-outline-variant/20 hover:border-outline-variant/60 transition-colors cursor-pointer bg-surface-container">
                  <img
                    src={imgSrc}
                    alt={`${product.name} Ansicht ${i}`}
                    onError={() => setImgErr(true)}
                    className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110 ${i === 2 ? "object-top" : i === 3 ? "object-bottom" : "object-center"}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-6 lg:sticky lg:top-24 pt-4 lg:pt-8">

            <header className="flex flex-col gap-3">
              <p className="text-[12px] font-semibold text-secondary uppercase tracking-[0.2em]">
                Sportbekleidung
              </p>
              <h1 className="font-display text-[44px] md:text-[56px] text-primary leading-none uppercase">
                {product.name}
              </h1>
              <p className="text-[15px] text-secondary">{product.subtitle}</p>

              <div className="flex items-baseline gap-4 mt-1">
                <span className="font-headline text-[28px] text-accent-warm uppercase tracking-widest">Bald erhältlich</span>
              </div>
              <p className="text-[11px] text-outline italic">Dieses Produkt ist in Kürze verfügbar.</p>

            </header>

            <div className="h-px bg-outline-variant/20" />

            <section className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold uppercase text-primary tracking-widest">Größe wählen</span>
                <a href="#" className="text-[11px] text-secondary underline hover:text-primary">Größentabelle</a>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {SIZES.map((s, i) => {
                  const disabled = i === 4;
                  const active   = s === size;
                  return (
                    <button key={s} disabled={disabled} onClick={() => setSize(s)}
                      className={`h-12 border text-[13px] font-semibold flex items-center justify-center transition-all cursor-pointer ${
                        active    ? "border-2 border-accent-warm bg-accent-warm text-on-primary-container" :
                        disabled  ? "border-outline-variant/40 bg-surface-container-low text-outline/40 cursor-not-allowed line-through" :
                                    "border-outline-variant bg-surface-container-low text-secondary hover:border-accent-warm hover:text-primary"
                      }`}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="flex flex-col gap-3">
              <button disabled
                className="bg-surface-container-low border border-outline-variant/40 text-outline py-5 px-8 font-headline text-[22px] uppercase tracking-widest flex items-center justify-center gap-3 cursor-not-allowed">
                <span className="material-symbols-outlined text-[22px]">schedule</span>
                Bald erhältlich
              </button>


              <div className="flex items-start gap-3 bg-accent-warm/10 border border-accent-warm/30 px-4 py-3">
                <span className="material-symbols-outlined text-accent-warm text-[20px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                <p className="text-[12px] text-secondary leading-snug">
                  <span className="text-primary font-semibold">Versandkostenfrei ab 99 €</span> innerhalb Deutschlands.
                  Lieferung in 2–4 Werktagen.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  ["local_shipping",    "Versand aus Deutschland"],
                  ["keyboard_return",   "14 Tage Widerrufsrecht"],
                  ["verified_user",     "Sichere Zahlung"],
                  ["workspace_premium", "Premium Qualität"],
                ].map(([icon, label]) => (
                  <div key={label} className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/20 px-3 py-2">
                    <span className="material-symbols-outlined text-[16px] text-accent-warm">{icon}</span>
                    <span className="text-[11px] text-secondary uppercase tracking-wide">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-outline-variant/20" />

            <div className="flex flex-col divide-y divide-outline-variant/20">
              <Accordion title="Produktbeschreibung" defaultOpen>
                <p className="text-[15px] text-secondary leading-relaxed">{product.description}</p>
              </Accordion>

              <Accordion title="Details & Material">
                <div className="flex flex-col gap-2 text-[14px]">
                  <Row k="Material" v="100 % Premium-Baumwolle" />
                  <Row k="Gewicht"  v="300 g/m² (Heavyweight)" />
                  <Row k="Schnitt"  v="Athletic Oversize Fit" />
                </div>
              </Accordion>
              <Accordion title="Pflegehinweise">
                <div className="text-[14px] text-secondary space-y-2">
                  <p>• Bei max. 30 °C waschen</p>
                  <p>• Vor dem Waschen auf links drehen</p>
                  <p>• Nicht in den Trockner</p>
                  <p>• Bei niedriger Temperatur bügeln</p>
                </div>
              </Accordion>
            </div>
          </div>
        </div>

        <section className="mt-stack-lg border-t border-outline-variant/20 pt-stack-md">
          <h2 className="font-headline text-[28px] text-primary mb-10 tracking-wide uppercase">Das könnte dir auch gefallen</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {related.map((p) => (
              <Link to="/product/$id" params={{ id: p.id }} key={p.id} className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden mb-3 border border-outline-variant/20 group-hover:border-outline-variant/60 transition-all bg-surface-container">
                  <img
                    src={p.videoPoster || p.image || APPAREL_PLACEHOLDER}
                    alt={p.name}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = APPAREL_PLACEHOLDER; }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[10px] text-secondary uppercase tracking-widest">{p.categoryLabel}</p>
                  <h3 className="font-headline text-[18px] text-primary uppercase leading-tight">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[14px] text-accent-warm font-semibold">{p.price.toFixed(2)} €</p>
                    {p.originalPrice && (
                      <p className="text-[12px] text-outline line-through">{p.originalPrice.toFixed(2)} €</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center cursor-pointer group"
      >
        <span className="text-[12px] font-semibold uppercase tracking-widest text-primary group-hover:text-accent-warm transition-colors">{title}</span>
        <span className={`material-symbols-outlined text-outline transition-transform duration-200 ${open ? "rotate-180" : ""}`}>expand_more</span>
      </button>
      {open && <div className="pt-3">{children}</div>}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-outline-variant/10 pb-2">
      <span className="text-secondary">{k}</span>
      <span className="text-primary font-medium">{v}</span>
    </div>
  );
}
