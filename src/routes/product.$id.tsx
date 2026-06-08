import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductVideo } from "@/components/ProductVideo";
import { findProduct, products, APPAREL_PLACEHOLDER, SUPPLEMENT_PLACEHOLDER } from "@/data/products";
import { useCart } from "@/stores/cart";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = findProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — OLD IRON` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — OLD IRON` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const isSupp = product.type === "supplement";

  const SIZES   = ["S", "M", "L", "XL", "XXL"];
  const FLAVORS = product.flavors?.length ? product.flavors : null;
  const WEIGHTS = product.weights?.length  ? product.weights  : null;

  const [size,   setSize]   = useState(isSupp ? "" : "L");
  const [flavor, setFlavor] = useState(FLAVORS?.[0] ?? "");
  const [weight, setWeight] = useState(WEIGHTS?.[0] ?? "");
  const [imgErr, setImgErr] = useState(false);

  const addToCart = useCart((s) => s.add);
  const related   = products.filter((p) => p.id !== product.id).slice(0, 4);

  const placeholder = isSupp ? SUPPLEMENT_PLACEHOLDER : APPAREL_PLACEHOLDER;
  const imgSrc = imgErr ? placeholder : (product.image || placeholder);

  const handleAdd = () => {
    const variant = isSupp
      ? [weight, flavor].filter(Boolean).join(" / ") || "Standart"
      : size;
    addToCart(product, variant);
    toast.success(`${product.name} sepete eklendi`);
  };

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />

      {/* Full-bleed hero image strip */}
      <div className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden mt-0">
        {product.video ? (
          <ProductVideo src={product.video} poster={product.videoPoster} alt={product.name}
            className="w-full h-full object-cover" />

        ) : (
          <img
            src={imgSrc}
            alt={product.name}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover object-center"
          />
        )}
        {/* gradient overlay bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* breadcrumb */}
        <div className="absolute top-6 left-6 md:left-12 flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/60 mt-16">
          <Link to="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-white transition-colors">Mağaza</Link>
          <span>/</span>
          <span className="text-white/90">{product.name}</span>
        </div>

        {/* badge */}
        {product.badge && (
          <div className="absolute top-24 md:top-28 right-6 md:right-12">
            <span className={`text-[11px] font-semibold uppercase tracking-widest px-4 py-1.5 ${isSupp ? "bg-accent-warm text-on-primary-container" : "bg-primary text-on-primary"}`}>
              {product.badge}
            </span>
          </div>
        )}
      </div>

      <main className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop -mt-24 relative z-10 pb-stack-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

          {/* Left — image gallery */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Main image card */}
            <div className={`rounded-none aspect-[4/5] overflow-hidden border ${isSupp ? "border-accent-warm/30" : "border-outline-variant/30"} bg-surface-container relative`}>
              {product.video ? (
                <ProductVideo src={product.video} poster={product.videoPoster} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <img
                  src={imgSrc}
                  alt={product.name}
                  onError={() => setImgErr(true)}
                  className="w-full h-full object-cover"
                />
              )}
              {isSupp && (
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(232,132,58,0.08) 0%, transparent 60%)" }} />
              )}
              <div className="absolute bottom-4 left-4">
                <span className="bg-surface-container/80 backdrop-blur-sm px-3 py-1 text-[11px] uppercase tracking-widest border border-outline-variant/40">
                  {product.categoryLabel}
                </span>
              </div>
            </div>

            {/* Thumbnail row — real image repeated at different crop/scale */}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`aspect-square overflow-hidden border ${isSupp ? "border-accent-warm/20 hover:border-accent-warm/60" : "border-outline-variant/20 hover:border-outline-variant/60"} transition-colors cursor-pointer bg-surface-container`}>
                  <img
                    src={imgSrc}
                    alt={`${product.name} görsel ${i}`}
                    onError={() => setImgErr(true)}
                    className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110 ${i === 2 ? "object-top" : i === 3 ? "object-bottom" : "object-center"}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right — product info */}
          <div className="lg:col-span-6 flex flex-col gap-6 lg:sticky lg:top-24 pt-4 lg:pt-8">

            {/* Name + price */}
            <header className="flex flex-col gap-3">
              <p className="text-[12px] font-semibold text-secondary uppercase tracking-[0.2em]">
                {isSupp ? "Supplement Koleksiyonu" : "Giyim Koleksiyonu"}
              </p>
              <h1 className="font-display text-[44px] md:text-[56px] text-primary leading-none uppercase">
                {product.name}
              </h1>
              <p className="text-[15px] text-secondary">{product.subtitle}</p>

              <div className="flex items-baseline gap-4 mt-1">
                <span className="font-headline text-[32px] text-accent-warm">₺{product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-secondary text-[18px] line-through">₺{product.originalPrice.toFixed(2)}</span>
                    <span className="bg-accent-warm/20 text-accent-warm text-[12px] font-bold px-2 py-0.5">
                      -%{discountPct}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-outline italic">KDV dahil</p>
            </header>

            <div className="h-px bg-outline-variant/20" />

            {/* Beden seçimi — sadece giyim */}
            {!isSupp && (
              <section className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-semibold uppercase text-primary tracking-widest">Beden Seç</span>
                  <a href="#" className="text-[11px] text-secondary underline hover:text-primary">Beden Tablosu</a>
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
            )}

            {/* Supplement seçenekleri */}
            {isSupp && (
              <section className="flex flex-col gap-5">
                {WEIGHTS && (
                  <div>
                    <p className="text-[12px] font-semibold uppercase text-primary tracking-widest mb-3">Gramaj</p>
                    <div className="flex flex-wrap gap-2">
                      {WEIGHTS.map((w: string) => (
                        <button key={w} onClick={() => setWeight(w)}
                          className={`px-5 py-2.5 border text-[13px] font-semibold transition-all cursor-pointer ${
                            weight === w ? "border-accent-warm bg-accent-warm text-on-primary-container" : "border-outline-variant text-secondary hover:border-accent-warm hover:text-primary"
                          }`}>
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {FLAVORS && (
                  <div>
                    <p className="text-[12px] font-semibold uppercase text-primary tracking-widest mb-3">Aroma</p>
                    <div className="flex flex-wrap gap-2">
                      {FLAVORS.map((f: string) => (
                        <button key={f} onClick={() => setFlavor(f)}
                          className={`px-5 py-2.5 border text-[13px] font-semibold transition-all cursor-pointer ${
                            flavor === f ? "border-accent-warm bg-accent-warm text-on-primary-container" : "border-outline-variant text-secondary hover:border-accent-warm hover:text-primary"
                          }`}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {product.servings && (
                  <div className="flex items-center gap-3 bg-surface-container-low border border-outline-variant/20 px-4 py-3">
                    <span className="material-symbols-outlined text-accent-warm text-[20px]">local_cafe</span>
                    <p className="text-[13px] text-secondary">
                      <span className="text-primary font-semibold">{product.servings} porsiyon</span> · {product.subtitle}
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <button onClick={handleAdd}
                className="bg-accent-warm text-on-primary-container py-5 px-8 font-headline text-[22px] uppercase tracking-widest hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer">
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
                Sepete Ekle
              </button>

              {/* Shipping info banner */}
              <div className="flex items-center gap-3 bg-accent-warm/10 border border-accent-warm/30 px-4 py-3">
                <span className="material-symbols-outlined text-accent-warm text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                <p className="text-[12px] text-secondary leading-tight">
                  <span className="text-primary font-semibold">1500₺ üzeri kargo ücretsiz.</span>{" "}
                  Altındaki siparişlerde kargo ücreti <span className="text-accent-warm font-semibold">140₺</span>.
                </p>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["local_shipping",    "1500₺ üzeri ücretsiz kargo"],
                  ["keyboard_return",   "14 gün iade hakkı"],
                  ["verified_user",     "Güvenli ödeme"],
                  ["workspace_premium", "Almanya'da Üretildi"],
                ].map(([icon, label]) => (
                  <div key={label} className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/20 px-3 py-2">
                    <span className="material-symbols-outlined text-[16px] text-accent-warm">{icon}</span>
                    <span className="text-[11px] text-secondary uppercase tracking-wide">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-outline-variant/20" />

            {/* Accordions */}
            <div className="flex flex-col divide-y divide-outline-variant/20">
              <Accordion title="Ürün Açıklaması" defaultOpen>
                <p className="text-[15px] text-secondary leading-relaxed">{product.description}</p>
              </Accordion>

              {isSupp ? (
                <Accordion title="Besin Değerleri & İçerik">
                  <div className="flex flex-col gap-2 text-[14px]">
                    <Row k="Protein" v="24g / porsiyon" />
                    <Row k="Karbonhidrat" v="2g / porsiyon" />
                    <Row k="Yağ" v="1.5g / porsiyon" />
                    <Row k="Kalori" v="~120 kcal / porsiyon" />
                    <Row k="Lab Testi" v="ISO 17025 Akredite" />
                  </div>
                </Accordion>
              ) : (
                <>
                  <Accordion title="Detaylar & Malzeme">
                    <div className="flex flex-col gap-2 text-[14px]">
                      <Row k="Malzeme" v="100% Premium Pamuk" />
                      <Row k="Gramaj" v="300 g/m² (Heavyweight)" />
                      <Row k="Kesim" v="Athletic Oversize Fit" />
                    </div>
                  </Accordion>
                  <Accordion title="Yıkama Talimatı">
                    <div className="text-[14px] text-secondary space-y-2">
                      <p>• Maks. 30°C'de yıka</p>
                      <p>• Yıkamadan önce ters çevir</p>
                      <p>• Kurutma makinesinde kurutma</p>
                      <p>• Düşük ısıda ütüle</p>
                    </div>
                  </Accordion>
                </>
              )}
            </div>
          </div>
        </div>

        {/* İlgili Ürünler */}
        <section className="mt-stack-lg border-t border-outline-variant/20 pt-stack-md">
          <h2 className="font-headline text-[28px] text-primary mb-10 tracking-wide uppercase">Bunları da İnceleyebilirsin</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {related.map((p) => {
              const rIsSupp = p.type === "supplement";
              return (
                <Link to="/product/$id" params={{ id: p.id }} key={p.id} className="group cursor-pointer">
                  <div className={`aspect-[3/4] overflow-hidden mb-3 border ${rIsSupp ? "border-accent-warm/20 group-hover:border-accent-warm/60" : "border-outline-variant/20 group-hover:border-outline-variant/60"} transition-all bg-surface-container`}>
                    {p.video ? (
                      <ProductVideo src={p.video} poster={p.videoPoster} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <img
                        src={p.image || (rIsSupp ? SUPPLEMENT_PLACEHOLDER : APPAREL_PLACEHOLDER)}
                        alt={p.name}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = rIsSupp ? SUPPLEMENT_PLACEHOLDER : APPAREL_PLACEHOLDER; }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] text-secondary uppercase tracking-widest">{p.categoryLabel}</p>
                    <h3 className="font-headline text-[18px] text-primary uppercase leading-tight">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[14px] text-accent-warm font-semibold">₺{p.price.toFixed(2)}</p>
                      {p.originalPrice && (
                        <p className="text-[12px] text-outline line-through">₺{p.originalPrice.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
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
