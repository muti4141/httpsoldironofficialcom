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
      { name: "description", content: "Almanya'da üretilen premium spor giyim & supplement. Old School zihniyeti, modern güç. Hiçbir mazeret yok." },
    ],
  }),
  component: Home,
});

/* ── Marquee ─────────────────────────────────────────────────────── */
const marqueeItems = [
  "DİSİPLİNDEN DÖVÜLMÜŞ", "PREMİUM SPOR GİYİM", "IRON SUPPLEMENT",
  "ALMANYA'DA ÜRETİLDİ",  "UZLAŞMA YOK",        "AĞIR PAMUK",
  "SAF PROTEİN",           "OLD SCHOOL ZİHNİYETİ","LAB ONAYLI",
];

/* ── Stats ───────────────────────────────────────────────────────── */
const stats = [
  { value: "300",   unit: "gsm",  label: "Pamuk Ağırlığı",    desc: "Heavyweight premium pamuk" },
  { value: "24",    unit: "g",    label: "Protein / Porsiyon", desc: "Mikro-filtreli whey" },
  { value: "100",   unit: "%",    label: "Saf & Doğal",        desc: "Dolgu maddesi yok" },
  { value: "DE",    unit: "",     label: "Üretim Yeri",         desc: "Almanya menşei" },
];

/* ── Testimonials ────────────────────────────────────────────────── */
const testimonials = [
  { quote: "Kumaşın kalitesi rakipsiz. Her antrenmanda farkı hissediyorsun. Bu sadece bir tişört değil — bir bildirgedir.", name: "Mehmet Yılmaz", role: "Powerlifter · İstanbul", stars: 5 },
  { quote: "Iron Whey şimdiye kadar içtiğim en iyi protein. Şişkinlik yok, maksimum emilim, mükemmel sonuç.", name: "Seda Kaya", role: "Kişisel Antrenör · Ankara", stars: 5 },
  { quote: "Old Iron modern fitness dünyasında özlediğim şeyi sunuyor: gerçek disiplin, gerçek kalite.", name: "Burak Şahin", role: "Bodybuilder · İzmir", stars: 5 },
];

/* ── Reveal hook ─────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── Animated counter ────────────────────────────────────────────── */
function useCounter(target: number, duration = 1400) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(ease * target));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { val, ref };
}

/* ── Main Component ─────────────────────────────────────────────── */
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

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Three.js particle field */}
        <div className="absolute inset-0 z-0 opacity-70">
          <ParticleField className="w-full h-full" />
        </div>

        {/* Video background */}
        <video ref={heroVideoRef} src="/videos/hero.mp4" autoPlay muted playsInline
          onEnded={() => { heroVideoRef.current?.pause(); setHeroEnded(true); }}
          className={`absolute inset-0 w-full h-full object-cover opacity-35 ${heroEnded ? "hidden" : "block"}`}
        />
        {heroEnded && (
          <img src="/images/hero-end.jpg" alt="OLD IRON"
            className="absolute inset-0 w-full h-full object-cover opacity-35" />
        )}

        {/* Gradient layers */}
        <div className="absolute inset-0 hero-gradient z-[1]" />
        <div className="absolute inset-0 grain-overlay z-[2] opacity-40" />
        <div className="absolute inset-0 vignette z-[3]" />

        {/* Content */}
        <div className="relative z-10 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto w-full pt-28 pb-24">

          {/* Eyebrow */}
          <p className="animate-fade-up-1 text-eyebrow mb-6 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-accent-warm" />
            Almanya'da Üretildi · Premium Kalite
          </p>

          {/* Main headline */}
          <h1 className="animate-fade-up-2 font-display uppercase leading-none mb-8 max-w-5xl">
            <span className="block text-display-fluid text-white text-glow">
              Disiplinden
            </span>
            <span className="block text-display-fluid text-accent-warm text-glow-orange"
              style={{ marginTop: "-0.05em" }}>
              Dövülmüş
            </span>
          </h1>

          {/* Sub */}
          <p className="animate-fade-up-3 text-[16px] md:text-[18px] text-secondary mb-12 max-w-lg leading-relaxed font-light">
            Premium Spor Giyim & Supplement. Old School zihniyeti, modern güç.
            <span className="text-primary font-medium"> Hiçbir mazeret yok.</span>
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-4 flex flex-col sm:flex-row gap-4">
            <Link to="/shop" className="btn-primary text-[18px]">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              Hemen Alışveriş
            </Link>
            <Link to="/shop" className="btn-ghost text-[18px]">
              Koleksiyonu Keşfet
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {/* Scroll cue */}
          <div className="animate-fade-up-5 absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <span className="text-[9px] uppercase tracking-[0.4em] text-outline">Keşfet</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-accent-warm/60 to-transparent animate-bounce-slow" />
          </div>
        </div>

        {/* Side label — editorial */}
        <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 z-10 items-center gap-3">
          <span className="text-vertical text-[9px] uppercase tracking-[0.4em] text-outline/60">
            Est. 2024 · Germany
          </span>
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-outline/30 to-transparent" />
        </div>
      </section>


      {/* ════════════════════════════════════════════
          MARQUEE BAND
      ════════════════════════════════════════════ */}
      <div className="relative bg-accent-warm py-3.5 overflow-hidden">
        <div className="absolute inset-0 grain-overlay opacity-20 pointer-events-none" />
        <div className="flex whitespace-nowrap marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-5 px-5">
              <span className="font-headline text-[14px] text-on-primary-container uppercase tracking-[0.15em]">{item}</span>
              <span className="text-on-primary-container/40 text-[8px]">◆</span>
            </span>
          ))}
        </div>
      </div>


      {/* ════════════════════════════════════════════
          STATS
      ════════════════════════════════════════════ */}
      <section className="bg-surface-container-low border-b border-outline-variant/20 relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay opacity-30 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-16
          grid grid-cols-2 md:grid-cols-4 divide-x divide-outline-variant/20">
          {stats.map((s, i) => (
            <StatItem key={s.label} {...s} index={i} />
          ))}
        </div>
      </section>


      {/* ════════════════════════════════════════════
          SUPPLEMENT — Diagonal section
      ════════════════════════════════════════════ */}
      <section className="supplement-gradient clip-diagonal py-stack-xl relative overflow-hidden">
        {/* Atmospheric glow */}
        <div className="absolute inset-0 grain-overlay opacity-25 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-warm/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-warm/10 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(240,123,46,0.08) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">

          {/* Section header */}
          <div className="reveal flex items-end justify-between mb-14 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow mb-3">Koleksiyon 01</p>
              <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] uppercase text-primary leading-none">
                Supplement
              </h2>
              <div className="flex items-center gap-3 mt-4">
                <span className="accent-line" />
                <span className="text-[11px] text-secondary uppercase tracking-widest">Lab Onaylı · Dolgu Yok · Almanya Kalitesi</span>
              </div>
            </div>
            <Link to="/shop"
              className="link-underline text-[12px] uppercase tracking-[0.2em] text-accent-warm hover:text-primary transition-colors flex items-center gap-2 cursor-pointer">
              Tüm Supplementler
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {supplementFeatured.map((p, i) => (
              <Link key={p.id} to="/product/$id" params={{ id: p.id }}
                className="reveal group supplement-card-glow orange-bevel card-shimmer bg-surface-container cursor-pointer overflow-hidden"
                style={{ transitionDelay: `${i * 80}ms` }}>

                <div className="aspect-[4/5] overflow-hidden bg-surface-container-high relative">
                  <img src={p.image || SUPPLEMENT_PLACEHOLDER} alt={p.name} loading="lazy"
                    onError={(e) => { e.currentTarget.src = SUPPLEMENT_PLACEHOLDER; }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />

                  {/* Orange ambient on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 50% 80%, rgba(232,132,58,0.12) 0%, transparent 60%)" }} />

                  {p.badge && (
                    <span className="absolute top-4 left-4 bg-accent-warm pulse-glow text-on-primary-container text-[10px] font-bold uppercase tracking-widest px-3 py-1 z-10">
                      {p.badge}
                    </span>
                  )}
                  {p.servings && (
                    <span className="absolute bottom-4 right-4 bg-background/85 text-primary text-[10px] uppercase tracking-widest px-2.5 py-1 border border-outline-variant/30 z-10">
                      {p.servings} Porsiyon
                    </span>
                  )}

                  {/* Quick add */}
                  <button
                    onClick={(e) => { e.preventDefault(); add(p, "Standart"); toast.success(`${p.name} sepete eklendi`); }}
                    className="absolute bottom-4 left-4 right-4 bg-accent-warm text-on-primary-container
                      font-headline text-[14px] uppercase tracking-widest py-2.5
                      translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                      transition-all duration-300 flex items-center justify-center gap-2 z-10">
                    <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_shopping_cart</span>
                    Ekle
                  </button>
                </div>

                <div className="p-4">
                  <p className="text-[10px] text-accent-warm/80 uppercase tracking-[0.2em] mb-1">{p.categoryLabel}</p>
                  <h3 className="font-headline text-[19px] text-primary uppercase leading-tight mb-0.5">{p.name}</h3>
                  <p className="text-[12px] text-secondary mb-3">{p.subtitle}</p>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[15px] text-accent-warm font-semibold">₺{p.price.toFixed(2)}</span>
                    {p.originalPrice && (
                      <>
                        <span className="text-[12px] text-outline line-through">₺{p.originalPrice.toFixed(2)}</span>
                        <span className="text-[10px] bg-accent-warm/15 text-accent-warm px-1.5 py-0.5 font-bold">
                          -%{Math.round((1 - p.price / p.originalPrice) * 100)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Supplement highlights — premium cards */}
          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
            {[
              { icon: "science",        title: "ISO 17025 Lab Onaylı",   desc: "Her üretim partisi bağımsız akreditasyonlu laboratuvarda analiz edilir. Sonuçlar etiket değerini karşılar." },
              { icon: "block",          title: "Sıfır Dolgu Maddesi",    desc: "Gereksiz şeker, maltodekstrin veya dolgu yok. Sadece saf, etkin ham madde." },
              { icon: "local_shipping", title: "1500₺ Üzeri Ücretsiz",   desc: "1500₺ üzeri siparişlerde kargo bizden. Altında 140₺ kargo ücreti uygulanır. 1–3 iş günü içinde kapında." },
            ].map((item, i) => (
              <div key={item.title}
                className="reveal flex items-start gap-5 p-6 bg-surface-container/50 border border-accent-warm/8 hover:border-accent-warm/25 transition-colors group"
                style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="w-10 h-10 flex items-center justify-center border border-accent-warm/20 group-hover:border-accent-warm/50 transition-colors flex-shrink-0">
                  <span className="material-symbols-outlined text-accent-warm text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                </div>
                <div>
                  <p className="font-headline text-[17px] text-primary uppercase mb-1.5 tracking-wide">{item.title}</p>
                  <p className="text-[13px] text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          GİYİM KOLEKSİYONU
      ════════════════════════════════════════════ */}
      <section className="py-stack-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">

        {/* Section header */}
        <div className="reveal flex items-end justify-between mb-14 flex-wrap gap-6">
          <div>
            <p className="text-eyebrow mb-3">Koleksiyon 02</p>
            <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] uppercase text-primary leading-none">
              Spor Giyim
            </h2>
            <div className="flex items-center gap-3 mt-4">
              <span className="accent-line" />
              <span className="text-[11px] text-secondary uppercase tracking-widest">300gsm Premium Pamuk · Almanya'da Üretildi</span>
            </div>
          </div>
          <Link to="/shop"
            className="link-underline text-[12px] uppercase tracking-[0.2em] text-accent-warm hover:text-primary transition-colors flex items-center gap-2 cursor-pointer">
            Tüm Ürünler
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apparelFeatured.map((p, i) => (
            <Link key={p.id} to="/product/$id" params={{ id: p.id }}
              className="reveal group relative steel-bevel card-shimmer bg-surface-container cursor-pointer overflow-hidden"
              style={{ transitionDelay: `${i * 90}ms` }}>

              {/* Image */}
              <div className="aspect-[4/5] overflow-hidden bg-surface-container-highest relative">
                {p.video ? (
                  <video src={p.video} autoPlay muted loop playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                ) : (
                  <img src={p.image || APPAREL_PLACEHOLDER} alt={p.name} loading="lazy"
                    onError={(e) => { e.currentTarget.src = APPAREL_PLACEHOLDER; }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                {p.badge && (
                  <span className="absolute top-4 left-4 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 z-10">
                    {p.badge}
                  </span>
                )}

                {/* Quick add */}
                <button
                  onClick={(e) => { e.preventDefault(); add(p, "M"); toast.success(`${p.name} sepete eklendi`); }}
                  className="absolute bottom-4 left-4 right-4 bg-accent-warm text-on-primary-container
                    font-headline text-[15px] uppercase tracking-widest py-3
                    translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                    transition-all duration-300 flex items-center justify-center gap-2 z-10">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_shopping_cart</span>
                  Sepete Ekle
                </button>
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="text-[10px] text-outline uppercase tracking-[0.2em] mb-1">{p.categoryLabel}</p>
                <h3 className="font-headline text-[22px] text-primary uppercase leading-tight mb-1">{p.name}</h3>
                <p className="text-[13px] text-secondary mb-3">{p.subtitle}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[16px] text-accent-warm font-semibold">₺{p.price.toFixed(2)}</span>
                  <span className="material-symbols-outlined text-[16px] text-outline/50 group-hover:text-accent-warm group-hover:translate-x-1 transition-all duration-300">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA bar */}
        <div className="reveal mt-12 border border-outline-variant/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low">
          <div>
            <p className="text-[13px] text-primary font-semibold uppercase tracking-widest">Tüm Giyim Koleksiyonu</p>
            <p className="text-[12px] text-secondary mt-0.5">Oversize tee, stringer, şort, hoodie ve aksesuar</p>
          </div>
          <Link to="/shop" className="btn-ghost text-[14px] px-8 py-3 whitespace-nowrap">
            Tümünü Gör
          </Link>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          BRAND STORY
      ════════════════════════════════════════════ */}
      <section className="py-stack-xl relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay opacity-20 pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

            {/* Visual — editorial layout */}
            <div className="lg:col-span-5 reveal-left">
              <div className="relative">
                {/* Main frame */}
                <div className="aspect-[3/4] bg-surface-container-low orange-bevel relative overflow-hidden">
                  <div className="absolute inset-0 grain-overlay opacity-40" />
                  {/* Big text mark */}
                  <p className="absolute inset-0 flex items-center justify-center font-display text-[clamp(4rem,12vw,8rem)] text-primary/8 uppercase leading-none select-none text-center px-4">
                    OLD<br />IRON
                  </p>
                  {/* Decorative lines */}
                  <div className="absolute top-8 left-8 w-16 h-px bg-accent-warm/40" />
                  <div className="absolute top-8 left-8 w-px h-16 bg-accent-warm/40" />
                  <div className="absolute bottom-8 right-8 w-16 h-px bg-accent-warm/40" />
                  <div className="absolute bottom-8 right-8 w-px h-16 bg-accent-warm/40" />
                </div>

                {/* Year badge */}
                <div className="absolute -bottom-5 -right-5 bg-accent-warm p-5 glow-orange">
                  <p className="font-display text-[32px] text-on-primary-container leading-none">2024</p>
                  <p className="text-[10px] text-on-primary-container/70 uppercase tracking-widest mt-0.5">Kuruluş</p>
                </div>

                {/* Vertical label */}
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 hidden lg:block">
                  <p className="text-vertical text-[9px] uppercase tracking-[0.4em] text-outline/50">
                    Germany · Premium · Iron
                  </p>
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="lg:col-span-7 reveal-right">
              <p className="text-eyebrow mb-5">Mirasımız</p>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-white uppercase leading-none mb-8">
                Çeliğin<br />
                <span className="text-accent-warm">Mirası</span>
              </h2>

              <div className="space-y-5 mb-10">
                <p className="text-[16px] text-secondary leading-relaxed">
                  OLD IRON'da sadece kıyafet ya da supplement satmıyoruz. Eğilip şekillendirdiğimiz metalden,
                  dövüp güçlendirdiğimiz iradeden bahsediyoruz.
                </p>
                <p className="text-[16px] text-secondary leading-relaxed">
                  Almanya'nın katı kalite standartlarında üretilen her ürün, bodybuildingin altın çağına
                  bir saygı duruşudur. 300gsm pamuk. ISO onaylı protein. Uzlaşma yok.
                </p>
                <p className="text-[16px] text-on-surface-variant leading-relaxed">
                  Kısa yol yok. Sadece disiplinin saf çeliği.
                </p>
              </div>

              {/* Values grid */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { n: "01", label: "Premium Kalite",   desc: "Uzlaşma yok" },
                  { n: "02", label: "Almanya Üretimi",  desc: "AB standartları" },
                  { n: "03", label: "Lab Onaylı",       desc: "ISO 17025" },
                  { n: "04", label: "Türkiye'ye Kargo", desc: "1–3 iş günü" },
                ].map((v) => (
                  <div key={v.n} className="flex items-start gap-3 p-4 border border-outline-variant/20 hover:border-accent-warm/20 transition-colors group">
                    <span className="font-display text-[24px] text-accent-warm/40 group-hover:text-accent-warm/70 transition-colors leading-none">{v.n}</span>
                    <div>
                      <p className="text-[12px] font-semibold text-primary uppercase tracking-wide">{v.label}</p>
                      <p className="text-[11px] text-outline">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/shop"
                className="inline-flex items-center gap-3 text-accent-warm font-semibold text-[13px] uppercase tracking-[0.2em] group cursor-pointer link-underline">
                Koleksiyonu Keşfet
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════ */}
      <section className="py-stack-xl bg-surface-container-low relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay opacity-20 pointer-events-none" />
        {/* Ambient */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />

        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="reveal text-center mb-14">
            <p className="text-eyebrow mb-4">Topluluk</p>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-white uppercase">
              Sporcuların Yorumları
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name}
                className="reveal steel-bevel bg-surface-container p-8 relative overflow-hidden group hover:border-accent-warm/20 transition-colors"
                style={{ transitionDelay: `${i * 100}ms` }}>

                {/* Quote mark */}
                <span className="absolute -top-2 -right-2 font-display text-[120px] text-primary/[0.04] select-none leading-none pointer-events-none">
                  "
                </span>

                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <span key={s} className="material-symbols-outlined text-accent-warm text-[16px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>

                <p className="text-[15px] text-secondary italic mb-7 leading-relaxed relative z-10">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div className="w-9 h-9 border border-accent-warm/25 flex items-center justify-center bg-surface-container-high">
                    <span className="font-headline text-[16px] text-accent-warm leading-none">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-white uppercase tracking-wide leading-none">{t.name}</p>
                    <p className="text-[10px] text-outline uppercase tracking-widest mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          NEWSLETTER
      ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-stack-lg">
        {/* Background treatment */}
        <div className="absolute inset-0 bg-surface-container-low" />
        <div className="absolute inset-0 grain-overlay opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-warm/20 to-transparent" />
        {/* Orange ambient */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-10"
          style={{ background: "radial-gradient(ellipse, #e8843a 0%, transparent 70%)" }} />

        <div className="reveal max-w-2xl mx-auto text-center px-margin-mobile relative z-10">
          <p className="text-eyebrow mb-5">Özel Üyelik</p>
          <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] text-white uppercase leading-none mb-4">
            Elitin Bir<br />
            <span className="text-accent-warm">Parçası Ol</span>
          </h2>
          <p className="text-[14px] text-secondary mb-10 uppercase tracking-[0.12em] leading-relaxed">
            Sınırlı stok bildirimleri · Erken erişim · Yalnızca üyelere özel indirimler
          </p>

          <form className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto"
            onSubmit={(e) => { e.preventDefault(); toast.success("Hoş geldin — elitin bir parçasısın."); }}>
            <input type="email" required placeholder="E-posta adresin"
              aria-label="E-posta adresi"
              className="flex-grow bg-surface-container border border-outline-variant/40 border-r-0
                px-5 py-4 text-[13px] focus:border-accent-warm focus:outline-none
                text-white placeholder:text-outline/50 tracking-widest" />
            <button type="submit"
              className="btn-primary text-[15px] py-4 px-8 whitespace-nowrap border-0">
              Kaydol
            </button>
          </form>

          <p className="text-[10px] text-outline/60 mt-4 uppercase tracking-widest">
            Spam göndermeyiz. İstediğin zaman ayrılabilirsin.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ── Stat Item with animated counter ─────────────────────────────── */
function StatItem({ value, unit, label, desc, index }: {
  value: string; unit: string; label: string; desc: string; index: number;
}) {
  const isNum = !isNaN(Number(value));
  const { val, ref } = useCounter(isNum ? Number(value) : 0, 1600);

  return (
    <div className={`reveal text-center px-8 py-12 ${index > 0 ? "border-l border-outline-variant/20 md:border-l" : ""} relative group`}
      style={{ transitionDelay: `${index * 100}ms` }}>
      {/* Subtle top accent on hover */}
      <div className="absolute top-0 left-4 right-4 h-[1px] bg-accent-warm scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      <div className="flex items-baseline justify-center gap-1 mb-2">
        <span ref={ref as React.RefObject<HTMLSpanElement>}
          className="stat-shine font-display text-[clamp(2.8rem,5vw,4rem)] leading-none">
          {isNum ? val : value}
        </span>
        {unit && (
          <span className="font-display text-[clamp(1.4rem,2.5vw,2rem)] text-accent-warm/60 leading-none">
            {unit}
          </span>
        )}
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary mb-1">{label}</p>
      <p className="text-[10px] text-outline uppercase tracking-widest">{desc}</p>
    </div>
  );
}
