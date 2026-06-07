import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { findProduct, products } from "@/data/products";
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

  const addToCart = useCart((s) => s.add);
  const related   = products.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    const variant = isSupp
      ? [weight, flavor].filter(Boolean).join(" / ") || "Standart"
      : size;
    addToCart(product, variant);
    toast.success(`${product.name} sepete eklendi`);
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />
      <main className="pt-[100px] max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-md md:py-stack-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-16 items-start">

          {/* Görsel */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="hidden md:flex md:col-span-2 flex-col gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="aspect-[3/4] bg-surface-container border border-outline-variant/30 cursor-pointer hover:border-accent-warm transition-colors relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high to-surface-container-lowest" />
                  <div className="absolute inset-0 grain-overlay opacity-40" />
                </div>
              ))}
            </div>
            <div className="md:col-span-10">
              <div className="aspect-[3/4] bg-surface-container border border-outline-variant/50 relative overflow-hidden">
                {product.video ? (
                  <video src={product.video} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                ) : product.image ? (
                  <img src={product.image} alt={product.name} className={`w-full h-full object-cover ${!isSupp ? "grayscale" : ""}`} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest flex items-center justify-center relative">
                    <div className="absolute inset-0 grain-overlay opacity-40" />
                    <p className="font-headline text-[48px] text-primary/30 uppercase tracking-widest text-center px-6">{product.name}</p>
                  </div>
                )}
                <div className="absolute bottom-6 left-6">
                  <div className="bg-surface-container-highest px-3 py-1 text-[12px] uppercase tracking-widest border border-outline-variant">
                    {product.categoryLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bilgi */}
          <div className="lg:col-span-5 flex flex-col gap-stack-md lg:sticky lg:top-28">
            <header className="flex flex-col gap-2">
              <p className="text-[13px] font-semibold text-secondary uppercase tracking-[0.2em]">
                {isSupp ? "Supplement Koleksiyonu" : "Giyim Koleksiyonu"}
              </p>
              <h1 className="font-display text-[48px] md:text-[56px] text-primary-fixed leading-none uppercase">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <p className="font-headline text-[28px] text-accent-warm">
                  ₺{product.price.toFixed(2)}
                </p>
                {product.originalPrice && (
                  <>
                    <p className="text-secondary text-[18px] line-through">₺{product.originalPrice.toFixed(2)}</p>
                    <span className="bg-accent-warm/20 text-accent-warm text-[12px] font-semibold px-2 py-0.5">
                      -%{Math.round((1 - product.price / product.originalPrice) * 100)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-secondary text-[12px] opacity-60">KDV dahil.</p>
            </header>
            <div className="h-px bg-outline-variant/30" />

            {/* Beden seçimi — sadece giyim */}
            {!isSupp && (
              <section className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-semibold uppercase text-primary tracking-widest">Beden Seç</span>
                  <a href="#" className="text-[12px] text-secondary underline hover:text-primary">Beden Tablosu</a>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {SIZES.map((s, i) => {
                    const disabled = i === 4;
                    const active   = s === size;
                    return (
                      <button key={s} disabled={disabled} onClick={() => setSize(s)}
                        className={`h-12 border text-[13px] font-semibold flex items-center justify-center transition-all cursor-pointer ${
                          active    ? "border-2 border-accent-warm bg-accent-warm text-on-primary-container" :
                          disabled  ? "border-outline-variant bg-surface-container-low text-secondary opacity-40 cursor-not-allowed line-through" :
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
                    <p className="text-[13px] font-semibold uppercase text-primary tracking-widest mb-3">Gramaj</p>
                    <div className="flex flex-wrap gap-2">
                      {WEIGHTS.map((w) => (
                        <button key={w} onClick={() => setWeight(w)}
                          className={`px-4 py-2 border text-[13px] font-semibold transition-all cursor-pointer ${
                            weight === w ? "border-accent-warm bg-accent-warm text-on-primary-container" : "border-outline-variant text-secondary hover:border-accent-warm"
                          }`}>
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {FLAVORS && (
                  <div>
                    <p className="text-[13px] font-semibold uppercase text-primary tracking-widest mb-3">Aroma</p>
                    <div className="flex flex-wrap gap-2">
                      {FLAVORS.map((f) => (
                        <button key={f} onClick={() => setFlavor(f)}
                          className={`px-4 py-2 border text-[13px] font-semibold transition-all cursor-pointer ${
                            flavor === f ? "border-accent-warm bg-accent-warm text-on-primary-container" : "border-outline-variant text-secondary hover:border-accent-warm"
                          }`}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {product.servings && (
                  <p className="text-[13px] text-secondary">
                    <span className="text-primary font-semibold">{product.servings} porsiyon</span> · {product.subtitle}
                  </p>
                )}
              </section>
            )}

            <div className="flex flex-col gap-4">
              <button onClick={handleAdd}
                className="bg-accent-warm text-on-primary-container py-5 px-8 font-headline text-[22px] uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
                Sepete Ekle
              </button>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-secondary text-[12px]">
                  <span className="material-symbols-outlined text-[18px] text-accent-warm">local_shipping</span>
                  500₺ ve üzeri ücretsiz kargo
                </div>
                <div className="flex items-center gap-2 text-secondary text-[12px]">
                  <span className="material-symbols-outlined text-[18px] text-accent-warm">restart_alt</span>
                  14 gün iade hakkı
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 pt-4">
              <div className="border-t border-outline-variant/30 pt-6">
                <h3 className="text-[13px] font-semibold uppercase text-primary mb-3 tracking-widest">Ürün Açıklaması</h3>
                <p className="text-[16px] text-secondary leading-relaxed">{product.description}</p>
              </div>

              {isSupp ? (
                <details className="group border-t border-outline-variant/30 pt-4">
                  <summary className="list-none flex justify-between items-center cursor-pointer">
                    <span className="text-[13px] font-semibold uppercase tracking-widest">Besin Değerleri & İçerik</span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="pt-4 flex flex-col gap-2 text-[15px]">
                    <Row k="Protein" v="24g / porsiyon" />
                    <Row k="Karbonhidrat" v="2g / porsiyon" />
                    <Row k="Yağ" v="1.5g / porsiyon" />
                    <Row k="Kalori" v="~120 kcal / porsiyon" />
                    <Row k="Lab Testi" v="ISO 17025 Akredite" />
                  </div>
                </details>
              ) : (
                <>
                  <details className="group border-t border-outline-variant/30 pt-4">
                    <summary className="list-none flex justify-between items-center cursor-pointer">
                      <span className="text-[13px] font-semibold uppercase tracking-widest">Detaylar & Malzeme</span>
                      <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                    </summary>
                    <div className="pt-4 flex flex-col gap-2 text-[15px]">
                      <Row k="Malzeme" v="100% Premium Pamuk" />
                      <Row k="Gramaj" v="300 g/m² (Heavyweight)" />
                      <Row k="Kesim" v="Athletic Oversize Fit" />
                    </div>
                  </details>
                  <details className="group border-t border-outline-variant/30 pt-4">
                    <summary className="list-none flex justify-between items-center cursor-pointer">
                      <span className="text-[13px] font-semibold uppercase tracking-widest">Yıkama Talimatı</span>
                      <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                    </summary>
                    <div className="pt-4 text-[15px] text-secondary space-y-2">
                      <p>• Maks. 30°C'de yıka</p>
                      <p>• Yıkamadan önce ters çevir</p>
                      <p>• Kurutma makinesinde kurutma</p>
                      <p>• Düşük ısıda ütüle</p>
                    </div>
                  </details>
                </>
              )}
            </div>
          </div>
        </div>

        {/* İlgili Ürünler */}
        <section className="mt-stack-lg border-t border-outline-variant/30 pt-stack-md">
          <h2 className="font-headline text-[28px] text-primary mb-12 tracking-wide uppercase">Bunları da İnceleyebilirsin</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {related.map((p) => (
              <Link to="/product/$id" params={{ id: p.id }} key={p.id} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-surface-container overflow-hidden mb-4 border border-outline-variant/30 group-hover:border-accent-warm transition-all">
                  {p.video ? (
                    <video src={p.video} autoPlay muted loop playsInline className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : p.image ? (
                    <img src={p.image} alt={p.name} loading="lazy" className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${p.type !== "supplement" ? "grayscale" : ""}`} />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest flex items-center justify-center relative">
                      <div className="absolute inset-0 grain-overlay opacity-40" />
                      <p className="font-headline text-[20px] text-primary/30 uppercase tracking-widest text-center px-2">{p.name}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] text-secondary uppercase tracking-widest">{p.categoryLabel}</p>
                  <h3 className="font-headline text-[20px] text-primary uppercase">{p.name}</h3>
                  <p className="text-[15px] text-accent-warm font-semibold">₺{p.price.toFixed(2)}</p>
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

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-outline-variant/10 pb-2">
      <span className="text-secondary">{k}</span>
      <span className="text-primary">{v}</span>
    </div>
  );
}
