import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { findProduct, products } from "@/data/products";

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
  const [size, setSize] = useState("L");
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />
      <main className="pt-[100px] max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-md md:py-stack-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter lg:gap-16 items-start">
          {/* Gallery */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="hidden md:flex md:col-span-2 flex-col gap-4">
              {[product.image, product.image, product.image].map((src, i) => (
                <div key={i} className="aspect-[3/4] bg-surface-container border border-outline-variant/30 cursor-pointer hover:border-primary transition-colors">
                  <img src={src} alt="" className="w-full h-full object-cover grayscale brightness-75" />
                </div>
              ))}
            </div>
            <div className="md:col-span-10">
              <div className="aspect-[3/4] bg-surface-container border border-outline-variant/50 relative overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale contrast-125" />
                <div className="absolute bottom-6 left-6 flex gap-2">
                  <div className="bg-surface-container-highest px-3 py-1 text-[12px] uppercase tracking-widest border border-outline-variant">
                    {product.categoryLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-5 flex flex-col gap-stack-md lg:sticky lg:top-28">
            <header className="flex flex-col gap-2">
              <p className="text-[14px] font-semibold text-secondary uppercase tracking-[0.2em]">Essentials Collection</p>
              <h1 className="font-display text-[56px] md:text-[64px] text-primary-fixed leading-none uppercase">
                {product.name}
              </h1>
              <p className="font-headline text-[24px] mt-4 text-primary">
                {product.price.toFixed(2)} € <span className="text-secondary text-[14px] opacity-60 ml-2 font-body normal-case tracking-normal">inkl. MwSt.</span>
              </p>
            </header>
            <div className="h-px bg-outline-variant/30" />

            <section className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-[14px] font-semibold uppercase text-primary tracking-widest">Größe Wählen</span>
                <a href="#" className="text-[12px] text-secondary underline hover:text-primary">Größentabelle</a>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {["S", "M", "L", "XL", "XXL"].map((s, i) => {
                  const disabled = i === 4;
                  const active = s === size;
                  return (
                    <button
                      key={s}
                      disabled={disabled}
                      onClick={() => setSize(s)}
                      className={`h-12 border text-[14px] font-semibold flex items-center justify-center transition-all ${
                        active
                          ? "border-2 border-primary bg-primary text-on-primary"
                          : disabled
                          ? "border-outline-variant bg-surface-container-low text-secondary opacity-40 cursor-not-allowed line-through"
                          : "border-outline-variant bg-surface-container-low text-secondary hover:border-primary hover:text-primary"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="flex flex-col gap-4">
              <button className="bg-primary-container text-on-secondary-fixed py-5 px-8 font-headline text-[24px] uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
                In den Warenkorb
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-secondary text-[12px]">
                  <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                  Kostenloser Versand ab 75€
                </div>
                <div className="flex items-center gap-2 text-secondary text-[12px]">
                  <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  30 Tage Rückgaberecht
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 pt-4">
              <div className="border-t border-outline-variant/30 pt-6">
                <h3 className="text-[14px] font-semibold uppercase text-primary mb-3 tracking-widest">Produktbeschreibung</h3>
                <p className="text-[16px] text-secondary leading-relaxed">{product.description}</p>
              </div>
              <details className="group border-t border-outline-variant/30 pt-4">
                <summary className="list-none flex justify-between items-center cursor-pointer">
                  <span className="text-[14px] font-semibold uppercase tracking-widest">Details &amp; Material</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="pt-4 flex flex-col gap-2 text-[16px]">
                  <Row k="Material" v="100% Premium Baumwolle" />
                  <Row k="Gewicht" v="300 g/m² (Heavyweight)" />
                  <Row k="Passform" v="Athletic Oversized Fit" />
                </div>
              </details>
              <details className="group border-t border-outline-variant/30 pt-4">
                <summary className="list-none flex justify-between items-center cursor-pointer">
                  <span className="text-[14px] font-semibold uppercase tracking-widest">Waschanleitung</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="pt-4 text-[16px] text-secondary space-y-2">
                  <p>• Bei max. 30°C waschen</p>
                  <p>• Auf links drehen vor dem Waschen</p>
                  <p>• Nicht im Wäschetrockner trocknen</p>
                  <p>• Nur bei geringer Hitze bügeln</p>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Related */}
        <section className="mt-stack-lg border-t border-outline-variant/30 pt-stack-md">
          <h2 className="font-headline text-[32px] text-primary mb-12 tracking-wide uppercase">Vervollständige dein Set</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {related.map((p) => (
              <Link to="/product/$id" params={{ id: p.id }} key={p.id} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-surface-container overflow-hidden mb-4 border border-outline-variant/30 group-hover:border-primary transition-all">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover grayscale brightness-75 group-hover:brightness-100 transition-all duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[12px] text-secondary uppercase tracking-widest">{p.categoryLabel}</p>
                  <h3 className="font-headline text-[20px] text-primary uppercase">{p.name}</h3>
                  <p className="text-[16px] text-primary">{p.price.toFixed(2)} €</p>
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
