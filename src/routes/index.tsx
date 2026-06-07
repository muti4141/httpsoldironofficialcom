import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { products, APPAREL_PLACEHOLDER, SUPPLEMENT_PLACEHOLDER } from "@/data/products";
import { useRef, useState, useEffect } from "react";
import { useCart } from "@/stores/cart";
import { toast } from "sonner";
import { ParticleField } from "@/components/ParticleField";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OLD IRON — Disiplinden Dövülmüş" },
      { name: "description", content: "Premium Spor Giyim & Supplement. Ağır pamuk. Old School zihniyeti, modern güç." },
    ],
  }),
  component: Home,
});

const stats = [
  { value: "300gsm",     label: "Pamuk Ağırlığı" },
  { value: "24g",        label: "Protein / Porsiyon" },
  { value: "100%",       label: "Saf & Doğal" },
  { value: "Almanya",    label: "Üretim Yeri" },
];

const testimonials = [
  { quote: "Kumaşın kalitesi rakipsiz. Her antrenmanda farkı hissediyorsun.", name: "Mehmet Yılmaz", role: "Powerlifter", stars: 5 },
  { quote: "Iron Whey şimdiye kadar içtiğim en iyi protein. Şişkinlik yok, maksimum sonuç.", name: "Seda Kaya", role: "Kişisel Antrenör", stars: 5 },
  { quote: "Old Iron, modern fitness dünyasında özlediğim şeyi sunuyor: Gerçek disiplin.", name: "Burak Şahin", role: "Bodybuilder", stars: 5 },
];

const marqueeItems = [
  "DİSİPLİNDEN DÖVÜLMÜŞ",
  "PREMİUM SPOR GİYİM",
  "IRON SUPPLEMENT",
  "ALMANYA'DA ÜRETİLDİ",
  "UZLAŞMA YOK",
  "AĞIR PAMUK",
  "SAF PROTEİN",
  "OLD SCHOOL ZİHNİYETİ",
];

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
        });
      },
      { threshold: 0.10 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function Home() {
  useReveal();
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [heroEnded, setHeroEnded] = useState(false);
  const add = useCart((s) => s.add);

  const apparelFeatured    = products.filter((p) => p.type === "apparel").slice(0, 3);
  const supplementFeatured = products.filter((p) => p.type === "supplement").slice(0, 4);

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <Nav />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen -mt-[72px] pt-[72px] flex items-center overflow-hidden">
        {/* Three.js particle background */}
        <div className="absolute inset-0 z-0">
          <ParticleField className="w-full h-full" />
        </div>

        {/* Video / Fallback */}
        <video ref={heroVideoRef} src="/videos/hero.mp4" autoPlay muted playsInline
          onEnded={() => { heroVideoRef.current?.pause(); setHeroEnded(true); }}
          className={`absolute inset-0 w-full h-full object-cover object-center md:object-top opacity-40 ${heroEnded ? "hidden" : "block"}`}
        />
        {heroEnded && (
          <img src="/images/hero-end.jpg" alt="Old Iron"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40" />
        )}

        {/* gradients */}
        <div className="absolute inset-0 hero-gradient z-[1]" />
        <div className="absolute inset-0 grain-overlay z-[2] opacity-25" />

        {/* Hero copy */}
        <div className="relative z-10 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto w-full">
          <p className="animate-fade-up-1 text-[12px] font-semibold text-accent-warm uppercase tracking-[0.4em] mb-5">
            Çeliğin Mirası · Almanya'da Üretildi
          </p>
          <h1 className="animate-fade-up-2 font-display text-display-fluid text-white uppercase text-glow max-w-4xl mb-6">
            Disiplinden<br />
            <span className="text-accent-warm text-glow-orange">Dövülmüş</span>
          </h1>
          <p className="animate-fade-up-3 text-[16px] md:text-[18px] text-secondary mb-10 max-w-lg leading-relaxed">
            Premium Spor Giyim & Supplement. Old School zihniyeti, modern güç. Hiçbir mazeret yok.
          </p>
          <div className="animate-fade-up-4 flex flex-col sm:flex-row gap-4">
            <Link to="/shop"
              className="inline-flex items-center justify-center gap-3 bg-accent-warm text-on-primary-container font-headline text-[20px] px-10 py-4 hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
              Hemen Alışveriş
            </Link>
            <Link to="/shop"
              className="inline-flex items-center justify-center gap-3 border border-outline-variant/60 text-primary font-headline text-[20px] px-10 py-4 hover:bg-surface-container hover:border-primary/40 transition-all active:scale-95 uppercase tracking-widest cursor-pointer">
              Koleksiyonu Keşfet
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-outline animate-fade-up-4">
          <span className="text-[10px] uppercase tracking-[0.3em]">Kaydır</span>
          <div className="w-px h-10 bg-gradient-to-b from-outline to-transparent" />
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────── */}
      <div className="bg-accent-warm py-3 overflow-hidden relative z-10">
        <div className="flex whitespace-nowrap marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6">
              <span className="font-headline text-[16px] text-on-primary-container uppercase tracking-widest">{item}</span>
              <span className="text-on-primary-container/50 text-[10px]">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ───────────────────────────────────────────────── */}
      <section className="bg-surface-container-low border-b border-outline-variant/20 relative z-10">
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={s.label} className="reveal text-center" style={{ transitionDelay: `${i * 80}ms` }}>
              <p className="font-display text-[42px] md:text-[56px] text-accent-warm leading-none mb-1">{s.value}</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-secondary">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── GİYİM ───────────────────────────────────────────────── */}
      <section className="py-stack-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <div className="reveal flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent-warm mb-2">Koleksiyon</p>
            <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase text-primary leading-none">Spor Giyim</h2>
            <div className="w-16 h-[2px] bg-accent-warm mt-3" />
          </div>
          <Link to="/shop" className="text-[13px] uppercase tracking-widest text-accent-warm hover:text-primary transition-colors border-b border-accent-warm/40 pb-1 cursor-pointer">
            Tüm Ürünler →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apparelFeatured.map((p, i) => (
            <Link key={p.id} to="/product/$id" params={{ id: p.id }}
              className="reveal group relative overflow-hidden steel-bevel bg-surface-container cursor-pointer"
              style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="aspect-[4/5] overflow-hidden bg-surface-container-highest relative">
                {p.video ? (
                  <video src={p.video} autoPlay muted loop playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <img src={p.image || APPAREL_PLACEHOLDER} alt={p.name} loading="lazy"
                    onError={(e) => { e.currentTarget.src = APPAREL_PLACEHOLDER; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                )}
                {p.badge && (
                  <span className="absolute top-4 left-4 bg-accent-warm text-on-primary-container text-[11px] font-semibold uppercase tracking-widest px-3 py-1 z-10">{p.badge}</span>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-accent-warm translate-y-full group-hover:translate-y-0 transition-transform duration-300 py-3 text-center z-10">
                  <span className="text-[13px] font-semibold text-on-primary-container uppercase tracking-widest">Sepete Ekle</span>
                </div>
              </div>
              <div className="p-5 space-y-1">
                <p className="text-[11px] text-outline uppercase tracking-widest">{p.categoryLabel}</p>
                <h3 className="font-headline text-[22px] text-primary uppercase leading-tight">{p.name}</h3>
                <p className="text-[15px] text-accent-warm font-semibold">₺{p.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SUPPLEMENT ──────────────────────────────────────────── */}
      <section className="supplement-gradient clip-diagonal py-stack-xl relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay opacity-20 pointer-events-none" />
        {/* ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #f07b2e 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="reveal flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-accent-warm mb-2">Gücünü Artır</p>
              <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] uppercase text-primary leading-none">Supplement</h2>
              <div className="w-16 h-[2px] bg-accent-warm mt-3" />
            </div>
            <Link to="/shop" className="text-[13px] uppercase tracking-widest text-accent-warm hover:text-primary transition-colors border-b border-accent-warm/40 pb-1 cursor-pointer">
              Tüm Supplementler →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {supplementFeatured.map((p, i) => (
              <Link key={p.id} to="/product/$id" params={{ id: p.id }}
                className="reveal group relative overflow-hidden supplement-card-glow orange-bevel bg-surface-container cursor-pointer"
                style={{ transitionDelay: `${i * 90}ms` }}>
                <div className="aspect-[4/5] overflow-hidden bg-surface-container-high relative">
                  <img src={p.image || SUPPLEMENT_PLACEHOLDER} alt={p.name} loading="lazy"
                    onError={(e) => { e.currentTarget.src = SUPPLEMENT_PLACEHOLDER; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  {p.badge && (
                    <span className="absolute top-4 left-4 bg-accent-warm pulse-glow text-on-primary-container text-[11px] font-semibold uppercase tracking-widest px-3 py-1 z-10">{p.badge}</span>
                  )}
                  {p.servings && (
                    <span className="absolute bottom-4 right-4 bg-surface-container/90 text-primary text-[11px] uppercase tracking-widest px-2 py-1 border border-outline-variant/40 z-10">
                      {p.servings} Porsiyon
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-accent-warm translate-y-full group-hover:translate-y-0 transition-transform duration-300 py-3 text-center z-10">
                    <span className="text-[13px] font-semibold text-on-primary-container uppercase tracking-widest">Sepete Ekle</span>
                  </div>
                </div>
                <div className="p-5 space-y-1">
                  <p className="text-[11px] text-accent-warm-soft uppercase tracking-widest">{p.categoryLabel}</p>
                  <h3 className="font-headline text-[20px] text-primary uppercase leading-tight">{p.name}</h3>
                  <p className="text-[13px] text-secondary">{p.subtitle}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <p className="text-[15px] text-accent-warm font-semibold">₺{p.price.toFixed(2)}</p>
                    {p.originalPrice && (
                      <>
                        <p className="text-[12px] text-outline line-through">₺{p.originalPrice.toFixed(2)}</p>
                        <span className="bg-accent-warm/20 text-accent-warm text-[10px] font-semibold px-1.5 py-0.5">
                          -%{Math.round((1 - p.price / p.originalPrice) * 100)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Supplement highlights */}
          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {[
              { icon: "science",        title: "Lab Onaylı",   desc: "Her ürün bağımsız ISO 17025 akreditasyonlu laboratuvarda test edilmektedir." },
              { icon: "no_food",        title: "Dolgu Yok",    desc: "Dolgu maddesi yok, gereksiz şeker yok — sadece saf etken maddeler." },
              { icon: "local_shipping", title: "Hızlı Kargo",  desc: "500₺ ve üzeri siparişlerde ücretsiz kargo. 1–3 iş günü teslimat." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-6 bg-surface-container/60 border border-accent-warm/10 hover:border-accent-warm/30 transition-colors">
                <span className="material-symbols-outlined text-accent-warm text-[28px] flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                <div>
                  <p className="font-headline text-[18px] text-primary uppercase mb-1">{item.title}</p>
                  <p className="text-[14px] text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HİKAYEMİZ ───────────────────────────────────────────── */}
      <section className="clip-diagonal-reverse bg-surface-container-low py-stack-xl">
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="reveal order-2 lg:order-1">
            <div className="relative orange-bevel p-1">
              <div className="aspect-[4/5] bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-lowest flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 grain-overlay opacity-50" />
                <p className="font-display text-[clamp(3rem,10vw,7rem)] text-primary/10 uppercase leading-none select-none">OLD<br />IRON</p>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-accent-warm p-5 text-on-primary-container">
                <p className="font-headline text-[28px] leading-none">KUR.</p>
                <p className="font-headline text-[28px] leading-none">2024</p>
              </div>
            </div>
          </div>
          <div className="reveal order-1 lg:order-2">
            <p className="text-[11px] uppercase tracking-[0.35em] text-accent-warm mb-4">Mirasımız</p>
            <h2 className="font-headline text-[clamp(2rem,5vw,3rem)] text-white uppercase leading-tight mb-6">Çeliğin Mirası</h2>
            <p className="text-[17px] text-secondary mb-5 leading-relaxed">
              OLD IRON'da sadece kıyafet ya da supplement satmıyoruz. Eğilip şekillendirdiğimiz metalden,
              dövüp güçlendirdiğimiz iradeden bahsediyoruz. Her ürün, bodybuildingin altın çağına bir saygı duruşudur.
            </p>
            <p className="text-[17px] text-secondary mb-5 leading-relaxed">
              Almanya'da üretilen her ürün, Avrupa'nın en katı kalite standartlarını taşır. Uzlaşma tanımayan,
              kısa yol aramayan sporcular için tasarlandı.
            </p>
            <p className="text-[17px] text-secondary mb-10 leading-relaxed">
              Sadece disiplinin saf çeliği — antrenmanında ve hayatında.
            </p>
            <Link to="/shop" className="inline-flex items-center gap-3 text-accent-warm font-semibold text-[13px] uppercase tracking-widest group cursor-pointer">
              Koleksiyonu Keşfet
              <span className="material-symbols-outlined transform group-hover:translate-x-2 transition-transform">trending_flat</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── YORUMLAR ────────────────────────────────────────────── */}
      <section className="py-stack-xl relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay opacity-25" />
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          <div className="reveal text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.3em] text-accent-warm mb-2">Değerlendirmeler</p>
            <h2 className="font-headline text-[clamp(2rem,5vw,3rem)] text-white uppercase">Sporcuların Yorumları</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name} className="reveal bg-surface-container steel-bevel p-8 relative" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <span key={s} className="material-symbols-outlined text-accent-warm text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-[16px] text-secondary italic mb-6 leading-relaxed">"{t.quote}"</p>
                <p className="text-[13px] font-semibold text-white uppercase tracking-wide">{t.name}</p>
                <p className="text-[12px] text-outline uppercase tracking-widest">{t.role}</p>
                <span className="material-symbols-outlined absolute top-6 right-6 text-primary/6 pointer-events-none" style={{ fontSize: "64px" }}>format_quote</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BÜLTEN ──────────────────────────────────────────────── */}
      <section className="py-stack-lg px-margin-mobile md:px-margin-desktop bg-surface-container-low border-t border-outline-variant/20">
        <div className="reveal max-w-2xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent-warm mb-3">Özel</p>
          <h2 className="font-headline text-[clamp(1.8rem,4vw,2.8rem)] text-white uppercase mb-3">Elitin Bir Parçası Ol</h2>
          <p className="text-[15px] text-secondary mb-8 uppercase tracking-widest">Sınırlı Stok. Erken Erişim. Yalnızca Üyelere Özel.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => { e.preventDefault(); toast.success("Hoş geldin — elitin bir parçasısın."); }}>
            <input type="email" required placeholder="E-POSTA ADRESİN" aria-label="E-posta adresi"
              className="flex-grow bg-surface-container border border-outline-variant px-5 py-4 text-[13px] focus:border-accent-warm focus:outline-none text-white placeholder:text-outline/50 uppercase tracking-widest" />
            <button type="submit"
              className="bg-accent-warm text-on-primary-container font-headline text-[18px] px-8 py-4 hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest cursor-pointer whitespace-nowrap">
              Kaydol
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
