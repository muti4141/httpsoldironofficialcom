import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductVideo } from "@/components/ProductVideo";
import { products, APPAREL_PLACEHOLDER, SUPPLEMENT_PLACEHOLDER } from "@/data/products";
import { useRef, useState, useEffect } from "react";
import { useCart } from "@/stores/cart";
import { toast } from "sonner";

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
  "ALMANYA'DA ÜRETİLDİ",  "UZLAŞMA YOK",        "300 GSM PAMUK",
  "SAF PROTEİN",           "OLD SCHOOL ZİHNİYETİ","LAB ONAYLI",
];

/* ── Stats ───────────────────────────────────────────────────────── */
const stats = [
  { value: "300",  unit: "gsm", label: "Pamuk Ağırlığı",    desc: "Heavyweight premium pamuk" },
  { value: "24",   unit: "g",   label: "Protein / Porsiyon", desc: "Mikro-filtreli whey" },
  { value: "100",  unit: "%",   label: "Saf & Doğal",        desc: "Dolgu maddesi yok" },
  { value: "DE",   unit: "",    label: "Üretim Yeri",         desc: "Almanya menşeili" },
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
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]">
        {/* Video background */}
        <video ref={heroVideoRef} src="/videos/hero.mp4" autoPlay muted playsInline
          onEnded={() => { heroVideoRef.current?.pause(); setHeroEnded(true); }}
          className={`absolute inset-0 w-full h-full object-cover opacity-50 ${heroEnded ? "hidden" : "block"}`}
        />
        {heroEnded && (
          <img src="/images/hero-end.jpg" alt="OLD IRON"
            className="absolute inset-0 w-full h-full object-cover opacity-50" />
        )}

        {/* Gradient overlay — bottom fade to black for text legibility */}
        <div className="absolute inset-0 z-[1]"
          style={{ background: "linear-gradient(0deg, #0a0a0a 0%, rgba(10,10,10,0.6) 45%, rgba(10,10,10,0.2) 100%)" }} />

        {/* Content */}
        <div className="relative z-10 px-[20px] md:px-[72px] max-w-[1440px] mx-auto w-full pt-28 pb-24">

          {/* Eyebrow */}
          <p className="animate-fade-up-1 text-[10px] font-bold tracking-[0.25em] uppercase text-white/50 mb-8 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-cobalt" />
            Almanya'da Üretildi · Premium Kalite
          </p>

          {/* Main headline */}
          <h1 className="animate-fade-up-2 font-bold leading-[0.9] tracking-[-0.04em] mb-10">
            <span className="block text-[clamp(4rem,12vw,9.5rem)] text-white">
              Disiplinden
            </span>
            <span className="block text-[clamp(4rem,12vw,9.5rem)] text-white">
              Dövülmüş.
            </span>
          </h1>

          {/* Sub */}
          <p className="animate-fade-up-3 text-[16px] text-white/60 mb-12 max-w-lg leading-relaxed font-normal tracking-[-0.01em]">
            Premium Spor Giyim & Supplement. Old School zihniyeti, modern güç.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-4 flex flex-col sm:flex-row gap-3">
            <Link to="/shop" className="btn-primary text-[14px]">
              Hemen Alışveriş
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
            <Link to="/shop"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-white/70 hover:text-white transition-colors px-4 py-[14px] cursor-pointer tracking-[-0.01em]">
              Koleksiyonu Keşfet
            </Link>
          </div>

          {/* Scroll cue */}
          <div className="animate-fade-up-5 absolute bottom-10 left-[20px] md:left-[72px] flex flex-col items-start gap-3">
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent animate-bounce-slow" />
            <span className="text-[9px] uppercase tracking-[0.35em] text-white/30">Keşfet</span>
          </div>
        </div>

        {/* Side label */}
        <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 z-10 items-center gap-3">
          <span className="text-vertical text-[9px] uppercase tracking-[0.4em] text-white/20">
            Est. 2024 · Germany
          </span>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          MARQUEE BAND
      ════════════════════════════════════════════ */}
      <div className="bg-cobalt py-3 overflow-hidden">
        <div className="flex whitespace-nowrap marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-5 px-5">
              <span className="font-bold text-[12px] text-white uppercase tracking-[0.2em]">{item}</span>
              <span className="text-white/30 text-[8px]">◆</span>
            </span>
          ))}
        </div>
      </div>


      {/* ════════════════════════════════════════════
          STATS
      ════════════════════════════════════════════ */}
      <section className="bg-plaster border-b border-outline-variant">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[72px] py-14
          grid grid-cols-2 md:grid-cols-4 divide-x divide-outline-variant">
          {stats.map((s, i) => (
            <StatItem key={s.label} {...s} index={i} />
          ))}
        </div>
      </section>


      {/* ════════════════════════════════════════════
          SUPPLEMENT
      ════════════════════════════════════════════ */}
      <section className="py-[120px] bg-background">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[72px]">

          {/* Section header */}
          <div className="reveal flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow mb-3">Koleksiyon 01</p>
              <h2 className="text-section-headline text-foreground">
                Supplement
              </h2>
              <p className="text-[13px] text-secondary mt-3 tracking-[-0.01em]">
                Lab onaylı · Dolgu maddesi yok · Almanya kalitesi
              </p>
            </div>
            <Link to="/shop"
              className="link-underline text-[13px] font-semibold tracking-[-0.01em] text-foreground hover:text-cobalt transition-colors flex items-center gap-2 cursor-pointer">
              Tüm Supplementler
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {supplementFeatured.map((p, i) => (
              <Link key={p.id} to="/product/$id" params={{ id: p.id }}
                className="reveal product-card group cursor-pointer"
                style={{ transitionDelay: `${i * 70}ms` }}>

                <div className="aspect-[4/5] overflow-hidden bg-surface-container-high relative rounded-t-[10px]">
                  {p.video ? (
                    <ProductVideo src={p.video} poster={p.videoPoster} alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  ) : (
                    <img src={p.image || SUPPLEMENT_PLACEHOLDER} alt={p.name} loading="lazy"
                      onError={(e) => { e.currentTarget.src = SUPPLEMENT_PLACEHOLDER; }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  )}

                  {p.badge && (
                    <span className="badge-cobalt absolute top-3 left-3 z-10">
                      {p.badge}
                    </span>
                  )}
                  {p.servings && (
                    <span className="badge-outline absolute bottom-3 right-3 z-10 bg-white/90">
                      {p.servings} Porsiyon
                    </span>
                  )}

                  {/* Quick add */}
                  <button
                    onClick={(e) => { e.preventDefault(); add(p, "Standart"); toast.success(`${p.name} sepete eklendi`); }}
                    className="absolute bottom-3 left-3 right-3 bg-cobalt text-white
                      font-bold text-[13px] tracking-[-0.01em] py-2.5 rounded-[8px]
                      translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                      transition-all duration-300 flex items-center justify-center gap-2 z-10">
                    <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_shopping_cart</span>
                    Sepete Ekle
                  </button>
                </div>

                <div className="p-4">
                  <p className="text-[10px] text-secondary uppercase tracking-[0.12em] mb-1 font-medium">{p.categoryLabel}</p>
                  <h3 className="text-[16px] font-bold text-foreground leading-tight mb-1 tracking-[-0.02em]">{p.name}</h3>
                  <p className="text-[12px] text-secondary mb-3 leading-snug">{p.subtitle}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-price-lg text-foreground">₺{p.price.toFixed(2)}</span>
                    {p.originalPrice && (
                      <>
                        <span className="text-price-strike">₺{p.originalPrice.toFixed(2)}</span>
                        <span className="badge-cobalt text-[9px]">
                          -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Supplement highlights */}
          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {[
              { icon: "science",        title: "ISO 17025 Lab Onaylı",   desc: "Her üretim partisi bağımsız akreditasyonlu laboratuvarda analiz edilir. Sonuçlar etiket değerini karşılar." },
              { icon: "block",          title: "Sıfır Dolgu Maddesi",    desc: "Gereksiz şeker, maltodekstrin veya dolgu yok. Sadece saf, etkin ham madde." },
              { icon: "local_shipping", title: "1500₺ Üzeri Ücretsiz",   desc: "1500₺ üzeri siparişlerde kargo bizden. 1–3 iş günü içinde kapında." },
            ].map((item, i) => (
              <div key={item.title}
                className="reveal flex items-start gap-4 p-5 bg-plaster rounded-[10px] hover:bg-surface-container-high transition-colors group"
                style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="w-9 h-9 flex items-center justify-center bg-white rounded-[8px] flex-shrink-0">
                  <span className="material-symbols-outlined text-cobalt text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                </div>
                <div>
                  <p className="text-[14px] font-bold text-foreground mb-1 tracking-[-0.02em]">{item.title}</p>
                  <p className="text-[12px] text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          GİYİM KOLEKSİYONU
      ════════════════════════════════════════════ */}
      <section className="py-[120px] bg-plaster">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[72px]">

          {/* Section header */}
          <div className="reveal flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow mb-3">Koleksiyon 02</p>
              <h2 className="text-section-headline text-foreground">
                Spor Giyim
              </h2>
              <p className="text-[13px] text-secondary mt-3 tracking-[-0.01em]">
                300gsm Premium Pamuk · Almanya'da üretildi
              </p>
            </div>
            <Link to="/shop"
              className="link-underline text-[13px] font-semibold tracking-[-0.01em] text-foreground hover:text-cobalt transition-colors flex items-center gap-2 cursor-pointer">
              Tüm Ürünler
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {apparelFeatured.map((p, i) => (
              <Link key={p.id} to="/product/$id" params={{ id: p.id }}
                className="reveal product-card group bg-white cursor-pointer"
                style={{ transitionDelay: `${i * 80}ms` }}>

                <div className="aspect-[4/5] overflow-hidden bg-surface-container-low relative rounded-t-[10px]">
                  {p.video ? (
                    <ProductVideo src={p.video} poster={p.videoPoster} alt={p.name} loop={p.type === "apparel"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  ) : (
                    <img src={p.image || APPAREL_PLACEHOLDER} alt={p.name} loading="lazy"
                      onError={(e) => { e.currentTarget.src = APPAREL_PLACEHOLDER; }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  )}

                  {p.badge && (
                    <span className="badge-dark absolute top-3 left-3 z-10">
                      {p.badge}
                    </span>
                  )}

                  {/* Quick add */}
                  <button
                    onClick={(e) => { e.preventDefault(); add(p, "M"); toast.success(`${p.name} sepete eklendi`); }}
                    className="absolute bottom-3 left-3 right-3 bg-cobalt text-white
                      font-bold text-[13px] tracking-[-0.01em] py-3 rounded-[8px]
                      translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                      transition-all duration-300 flex items-center justify-center gap-2 z-10">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_shopping_cart</span>
                    Sepete Ekle
                  </button>
                </div>

                <div className="p-5">
                  <p className="text-[10px] text-secondary uppercase tracking-[0.12em] mb-1 font-medium">{p.categoryLabel}</p>
                  <h3 className="text-[18px] font-bold text-foreground leading-tight mb-1 tracking-[-0.02em]">{p.name}</h3>
                  <p className="text-[12px] text-secondary mb-3 leading-snug">{p.subtitle}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-price-lg text-foreground">₺{p.price.toFixed(2)}</span>
                    <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-cobalt group-hover:translate-x-1 transition-all duration-300">arrow_forward</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA bar */}
          <div className="reveal mt-8 bg-white rounded-[10px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-[14px] font-bold text-foreground tracking-[-0.02em]">Tüm Giyim Koleksiyonu</p>
              <p className="text-[12px] text-secondary mt-0.5">Oversize tee, stringer, şort, hoodie ve aksesuar</p>
            </div>
            <Link to="/shop" className="btn-ghost text-[13px] px-6 py-3 whitespace-nowrap">
              Tümünü Gör
            </Link>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          BRAND STORY
      ════════════════════════════════════════════ */}
      <section className="py-[120px] bg-background">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[72px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

            {/* Visual */}
            <div className="lg:col-span-5 reveal-left">
              <div className="relative">
                <div className="aspect-[3/4] bg-plaster rounded-[10px] relative overflow-hidden">
                  <p className="absolute inset-0 flex items-center justify-center font-bold text-[clamp(4rem,12vw,8rem)] text-foreground/[0.05] uppercase leading-none select-none text-center px-4 tracking-[-0.04em]">
                    OLD<br />IRON
                  </p>
                  <div className="absolute top-6 left-6 w-10 h-px bg-cobalt" />
                  <div className="absolute top-6 left-6 w-px h-10 bg-cobalt" />
                  <div className="absolute bottom-6 right-6 w-10 h-px bg-cobalt" />
                  <div className="absolute bottom-6 right-6 w-px h-10 bg-cobalt" />
                </div>

                {/* Year badge */}
                <div className="absolute -bottom-4 -right-4 bg-cobalt p-5 rounded-[10px]">
                  <p className="font-mono text-[28px] font-bold text-white leading-none">2024</p>
                  <p className="text-[10px] text-white/60 uppercase tracking-widest mt-0.5">Kuruluş</p>
                </div>
              </div>
            </div>

            {/* Copy */}
            <div className="lg:col-span-7 reveal-right">
              <p className="text-eyebrow mb-5">Mirasımız</p>
              <h2 className="text-section-headline text-foreground mb-8">
                Çeliğin<br />
                <span className="text-cobalt">Mirası</span>
              </h2>

              <div className="space-y-4 mb-10">
                <p className="text-[16px] text-secondary leading-relaxed tracking-[-0.01em]">
                  OLD IRON'da sadece kıyafet ya da supplement satmıyoruz. Eğilip şekillendirdiğimiz metalden,
                  dövüp güçlendirdiğimiz iradeden bahsediyoruz.
                </p>
                <p className="text-[16px] text-secondary leading-relaxed tracking-[-0.01em]">
                  Almanya'nın katı kalite standartlarında üretilen her ürün, bodybuildingin altın çağına
                  bir saygı duruşudur. 300gsm pamuk. ISO onaylı protein. Uzlaşma yok.
                </p>
                <p className="text-[16px] text-foreground font-semibold tracking-[-0.02em]">
                  Kısa yol yok. Sadece disiplinin saf çeliği.
                </p>
              </div>

              {/* Values grid */}
              <div className="grid grid-cols-2 gap-3 mb-10">
                {[
                  { n: "01", label: "Premium Kalite",   desc: "Uzlaşma yok" },
                  { n: "02", label: "Almanya Üretimi",  desc: "AB standartları" },
                  { n: "03", label: "Lab Onaylı",       desc: "ISO 17025" },
                  { n: "04", label: "Türkiye'ye Kargo", desc: "1–3 iş günü" },
                ].map((v) => (
                  <div key={v.n} className="flex items-start gap-3 p-4 bg-plaster rounded-[10px] hover:bg-surface-container-high transition-colors">
                    <span className="font-mono text-[20px] font-bold text-cobalt/40 leading-none">{v.n}</span>
                    <div>
                      <p className="text-[13px] font-bold text-foreground tracking-[-0.02em]">{v.label}</p>
                      <p className="text-[11px] text-secondary">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/shop"
                className="inline-flex items-center gap-2 text-cobalt font-bold text-[13px] tracking-[-0.01em] group cursor-pointer link-underline">
                Koleksiyonu Keşfet
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          MANIFESTO — Cobalt band
      ════════════════════════════════════════════ */}
      <section className="relative py-[120px] bg-cobalt overflow-hidden">
        <div className="relative max-w-[1280px] mx-auto px-[20px] md:px-[72px] flex flex-col items-center text-center">
          <p className="reveal text-[10px] font-bold tracking-[0.3em] mb-8 text-white/50 uppercase">
            — Manifesto —
          </p>
          <h2 className="reveal font-bold leading-[0.95] tracking-[-0.04em] text-[clamp(2.2rem,6vw,5rem)] text-white mb-10 max-w-5xl">
            Başarı tesadüf değildir.<br />
            Başarı, hiç bitmeyen bir disiplinin sonucudur.
          </h2>
          <p className="reveal max-w-2xl text-[17px] leading-relaxed text-white/60 font-normal tracking-[-0.01em]">
            OLD IRON sadece bir marka değil, bir yaşam felsefesidir. Almanya'nın mühendislik
            disipliniyle salonların tozunu birleştiriyoruz. En iyi ekipman, en saf içerik.
          </p>

          <div className="reveal flex items-center gap-4 mt-10">
            <span className="h-px w-10 bg-white/20" />
            <span className="font-mono text-[11px] tracking-[0.2em] text-white/40">Old Iron · Est. 2024 · Germany</span>
            <span className="h-px w-10 bg-white/20" />
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════════ */}
      <section className="py-[120px] bg-background">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[72px]">
          <div className="reveal text-center mb-12">
            <p className="text-eyebrow mb-4">Topluluk</p>
            <h2 className="text-section-headline text-foreground">
              Sporcuların Yorumları
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div key={t.name}
                className="reveal bg-plaster rounded-[10px] p-7 relative overflow-hidden"
                style={{ transitionDelay: `${i * 90}ms` }}>

                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <span key={s} className="material-symbols-outlined text-cobalt text-[15px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>

                <p className="text-[15px] text-secondary leading-relaxed mb-7 tracking-[-0.01em]">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-cobalt rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[14px] text-white leading-none">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-foreground tracking-[-0.02em]">{t.name}</p>
                    <p className="text-[11px] text-secondary">{t.role}</p>
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
      <section className="relative py-[80px] bg-plaster">
        <div className="reveal max-w-xl mx-auto text-center px-[20px]">
          <p className="text-eyebrow mb-4">Özel Üyelik</p>
          <h2 className="text-section-headline text-foreground mb-3">
            Elitin Bir<br />
            <span className="text-cobalt">Parçası Ol</span>
          </h2>
          <p className="text-[13px] text-secondary mb-8 leading-relaxed tracking-[-0.01em]">
            Sınırlı stok bildirimleri · Erken erişim · Yalnızca üyelere özel indirimler
          </p>

          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            onSubmit={(e) => { e.preventDefault(); toast.success("Hoş geldin — elitin bir parçasısın."); }}>
            <input type="email" required placeholder="E-posta adresin"
              aria-label="E-posta adresi"
              className="flex-grow bg-white border border-outline-variant rounded-[10px]
                px-4 py-3.5 text-[13px] text-foreground placeholder:text-secondary
                focus:border-cobalt focus:outline-none focus:ring-2 focus:ring-cobalt/10
                tracking-[-0.01em] transition-colors" />
            <button type="submit" className="btn-primary text-[13px] py-3.5 px-6 whitespace-nowrap">
              Kaydol
            </button>
          </form>

          <p className="text-[10px] text-secondary/60 mt-4 uppercase tracking-widest">
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
    <div className={`reveal text-center px-8 py-12 ${index > 0 ? "border-l border-outline-variant" : ""}`}
      style={{ transitionDelay: `${index * 90}ms` }}>

      <div className="flex items-baseline justify-center gap-1 mb-2">
        <span ref={ref as React.RefObject<HTMLSpanElement>}
          className="stat-number">
          {isNum ? val : value}
        </span>
        {unit && (
          <span className="font-mono text-[1.4rem] font-bold text-cobalt leading-none">
            {unit}
          </span>
        )}
      </div>
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground mb-1">{label}</p>
      <p className="text-[11px] text-secondary">{desc}</p>
    </div>
  );
}
