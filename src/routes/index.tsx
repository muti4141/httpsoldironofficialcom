import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { products } from "@/data/products";
import { useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OLD IRON — Geschmiedet aus Disziplin" },
      { name: "description", content: "Premium Gym Apparel. Heavy Cotton. Old School Mentalität, moderne Stärke." },
    ],
  }),
  component: Home,
});

const categories = [
  { name: "Oversized T-Shirts" },
  { name: "Stringer Tank Tops" },
  { name: "Gym Shorts" },
  { name: "Performance Wear" },
];


const testimonials = [
  { quote: "Die Qualität des Stoffs ist unübertroffen. Man spürt die Schwere und die Beständigkeit. Perfekt für ein hartes Training.", name: "Markus Wagner", role: "Leistungssportler" },
  { quote: "Endlich Kleidung, die nicht nach zwei Wäschen die Form verliert. Das Design ist minimalistisch und zeitlos.", name: "Svenja Richter", role: "Personal Trainer" },
  { quote: "Old Iron verkörpert genau das, was mir im modernen Fitness-Mainstream gefehlt hat: Echte Disziplin und harter Stahl.", name: "Thorsten Schmidt", role: "Bodybuilder" },
];

function Home() {
  const bestsellers = products.slice(0, 3);
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />
      <main className="pt-[72px]">
        {/* Hero */}
        <section className="relative md:h-[80vh] md:min-h-[600px] flex flex-col md:items-center overflow-hidden">
          <div className="relative md:absolute md:inset-0 z-0 w-full">
            <video src="/videos/hero.mp4" autoPlay muted loop playsInline className="w-full h-auto md:h-full object-cover md:object-top md:grayscale md:opacity-60 bg-background block" />
            <div className="absolute inset-0 hero-gradient" />
          </div>
          <div className="relative z-10 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto w-full py-stack-md md:py-0">
            <div className="max-w-2xl">
              <p className="text-[14px] font-semibold text-primary uppercase tracking-[0.3em] mb-4">Das Vermächtnis des Stahls</p>
              <h1 className="font-display text-[72px] md:text-[96px] leading-[0.9] text-white mb-6 text-glow uppercase">
                Geschmiedet aus Disziplin
              </h1>
              <p className="text-[18px] text-secondary mb-10 max-w-lg">
                Old School Mentalität. Moderne Stärke. Kleidung für diejenigen, die die Stille der schweren Eisen bevorzugen.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="bg-primary-container text-on-secondary-fixed font-headline text-[24px] px-10 py-4 hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest">
                  Jetzt Shoppen
                </Link>
                <Link to="/shop" className="border-2 border-outline-variant text-primary font-headline text-[24px] px-10 py-4 hover:bg-surface-container transition-all active:scale-95 uppercase tracking-widest">
                  Kollektion Entdecken
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
          <div className="mb-stack-md">
            <h2 className="font-headline text-[48px] uppercase text-primary">Kategorien</h2>
            <div className="w-24 h-1 bg-primary mt-2" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((c) => (
              <Link to="/shop" key={c.name} className="group relative aspect-[3/4] overflow-hidden bg-surface-container steel-bevel">
                <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest" />
                <div className="absolute inset-0 grain-overlay opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent flex items-end p-6">
                  <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    <h3 className="font-headline text-[20px] md:text-[24px] text-white uppercase mb-2">{c.name}</h3>
                    <p className="text-[12px] uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Shop jetzt →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Brand Story */}
        <section className="bg-surface-container-low py-stack-lg">
          <div className="px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-stack-lg items-center">
            <div className="order-2 lg:order-1">
              <div className="relative steel-bevel p-4 inline-block w-full max-w-md">
                <div className="aspect-square bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 grain-overlay opacity-40" />
                  <p className="font-headline text-[64px] text-primary/30 uppercase tracking-widest">Old Iron</p>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-primary p-6 text-on-primary">
                  <p className="font-headline text-[32px] leading-none">EST. 2024</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[14px] font-semibold text-primary uppercase tracking-widest mb-4">Unser Erbe</p>
              <h2 className="font-headline text-[48px] text-white uppercase mb-6">Das Vermächtnis</h2>
              <p className="text-[18px] text-secondary mb-6">
                Bei OLD IRON geht es nicht nur um Kleidung. Es geht um das Metall, das wir biegen, und den Willen, den wir schmieden. Jedes Stück unserer Kollektion ist eine Hommage an die goldene Ära des Bodybuildings — kombiniert mit der Präzision deutscher Handwerkskunst.
              </p>
              <p className="text-[18px] text-secondary mb-10">
                Keine Kompromisse. Keine Abkürzungen. Nur der reine, unnachgiebige Stahl der Disziplin.
              </p>
              <Link to="/shop" className="inline-flex items-center gap-4 text-primary text-[14px] font-semibold uppercase tracking-widest group">
                Die ganze Geschichte lesen
                <span className="material-symbols-outlined transform group-hover:translate-x-2 transition-transform">trending_flat</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Bestsellers */}
        <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
          <h2 className="font-headline text-[48px] uppercase text-primary mb-stack-md text-center">Bestseller</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {bestsellers.map((p, i) => (
              <Link to="/product/$id" params={{ id: p.id }} key={p.id} className="group cursor-pointer">
                <div className="bg-surface-container aspect-square overflow-hidden relative steel-bevel mb-4">
                  {p.video ? (
                    <video src={p.video} autoPlay muted loop playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest flex items-center justify-center relative">
                      <div className="absolute inset-0 grain-overlay opacity-40" />
                      <p className="font-headline text-[32px] text-primary/30 uppercase tracking-widest text-center px-4">{p.name}</p>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 py-3 text-center">
                    <span className="text-[14px] font-semibold text-on-primary uppercase tracking-widest">In den Warenkorb</span>
                  </div>
                  {i === 0 && (
                    <div className="absolute top-4 right-4 bg-surface-container-highest px-3 py-1 border border-outline-variant">
                      <p className="text-[12px] font-semibold uppercase text-primary">Neu</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-headline text-[24px] text-white uppercase">{p.name}</h4>
                    <p className="text-[12px] uppercase tracking-widest text-secondary">{p.subtitle}</p>
                  </div>
                  <p className="text-[14px] font-semibold text-primary">{p.price.toFixed(2)}€</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-surface-container-lowest py-stack-lg relative overflow-hidden">
          <div className="absolute inset-0 grain-overlay" />
          <div className="px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto relative z-10">
            <h2 className="font-headline text-[48px] text-white uppercase text-center mb-stack-lg">Stimmen der Athleten</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-surface-container-high p-8 steel-bevel relative">
                  <div className="flex gap-1 mb-4">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <span key={s} className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-[16px] text-secondary italic mb-6">"{t.quote}"</p>
                  <p className="text-[14px] font-semibold text-white uppercase">{t.name}</p>
                  <p className="text-[12px] text-outline">{t.role}</p>
                  <span className="material-symbols-outlined absolute top-8 right-8 text-primary/10 text-6xl">format_quote</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-stack-lg px-margin-mobile md:px-margin-desktop">
          <div className="max-w-3xl mx-auto text-center border border-outline-variant/30 p-12 bg-surface-container">
            <h2 className="font-headline text-[48px] text-white uppercase mb-4">Werde Teil der Elite</h2>
            <p className="text-[16px] text-secondary mb-10 uppercase tracking-widest">Exklusiver Zugang zu limitierten Drops und Storys.</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="DEINE E-MAIL ADRESSE" className="flex-grow bg-surface-container-low border border-outline px-6 py-4 text-[14px] focus:border-primary focus:outline-none text-white placeholder:text-outline/50 uppercase" />
              <button type="submit" className="bg-primary-container text-on-secondary-fixed font-semibold text-[14px] px-10 py-4 hover:brightness-110 transition-all uppercase tracking-widest">
                Anmelden
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
