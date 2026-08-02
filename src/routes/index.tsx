import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductVideo } from "@/components/ProductVideo";
import { products, APPAREL_PLACEHOLDER, SUPPLEMENT_PLACEHOLDER } from "@/data/products";
import { useRef, useState, useEffect, useCallback } from "react";
import { useCart } from "@/stores/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OLD IRON — Disiplinden Dövülmüş" },
      { name: "description", content: "Almanya'da üretilen premium spor giyim & supplement. Old School zihniyeti, modern güç." },
    ],
  }),
  component: Home,
});

/* ── Marquee items ──────────────────────────────────────────────────── */
const marqueeItems = [
  "DİSİPLİNDEN DÖVÜLMÜŞ", "PREMİUM SPOR GİYİM", "IRON SUPPLEMENT",
  "ALMANYA'DA ÜRETİLDİ",  "UZLAŞMA YOK",        "300 GSM PAMUK",
  "SAF PROTEİN",           "OLD SCHOOL ZİHNİYETİ","LAB ONAYLI",
];

/* ── Reveal hook ────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
      }),
      { threshold: 0.06, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── Counter hook ───────────────────────────────────────────────────── */
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

/* ── Drag-scroll hook ───────────────────────────────────────────────── */
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (ref.current?.offsetLeft ?? 0);
    scrollLeft.current = ref.current?.scrollLeft ?? 0;
  }, []);

  const onMouseLeave = useCallback(() => { isDragging.current = false; }, []);
  const onMouseUp = useCallback(() => { isDragging.current = false; }, []);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    ref.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  return { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove };
}

/* ── Main Component ─────────────────────────────────────────────────── */
function Home() {
  useReveal();
  const add = useCart((s) => s.add);
  const drag = useDragScroll();

  const apparelFeatured    = products.filter((p) => p.type === "apparel").slice(0, 4);
  const supplementFeatured = products.filter((p) => p.type === "supplement").slice(0, 4);
  const allFeatured        = [...products].slice(0, 8);

  return (
    <div className="bg-white text-foreground min-h-screen overflow-x-hidden">
      <Nav />

      {/* ══════════════════════════════════════════════════════════
          HERO — split layout: text left, full-bleed image right
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex overflow-hidden bg-white">

        {/* LEFT — text column */}
        <div className="relative z-10 flex flex-col justify-end pb-16 pt-32 px-[20px] md:px-[72px]
          w-full lg:w-[52%]">

          <p className="animate-fade-up-1 text-[10px] font-bold tracking-[0.28em] uppercase text-secondary mb-10 flex items-center gap-3">
            <span className="inline-block w-6 h-px bg-cobalt" />
            Almanya Menşeili · Premium Kalite
          </p>

          <h1 className="font-bold leading-[0.88] tracking-[-0.05em] mb-10">
            <span className="animate-fade-up-2 block text-[clamp(3.8rem,10vw,8.5rem)] text-foreground overflow-hidden">
              Disiplin
            </span>
            <span className="animate-fade-up-3 block text-[clamp(3.8rem,10vw,8.5rem)] text-cobalt overflow-hidden">
              den
            </span>
            <span className="animate-fade-up-3 block text-[clamp(3.8rem,10vw,8.5rem)] text-foreground overflow-hidden">
              Dövülmüş.
            </span>
          </h1>

          <p className="animate-fade-up-4 text-[15px] text-secondary mb-10 max-w-sm leading-relaxed tracking-[-0.01em]">
            Premium Spor Giyim & Supplement.<br />
            Old School zihniyeti, modern güç.
          </p>

          <div className="animate-fade-up-5 flex flex-col sm:flex-row gap-3 items-start">
            <Link to="/shop"
              className="inline-flex items-center gap-2 bg-foreground text-white font-bold
                text-[13px] tracking-[-0.01em] px-8 py-4 hover:bg-cobalt transition-colors duration-300">
              Alışverişe Başla
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
            <Link to="/shop"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-secondary
                hover:text-foreground transition-colors px-4 py-4 link-underline">
              Koleksiyonu Keşfet
            </Link>
          </div>

          {/* Bottom stats row */}
          <div className="animate-fade-up-5 flex gap-8 mt-16 pt-8 border-t border-outline-variant">
            {[
              { v: "300gsm", l: "Pamuk" },
              { v: "24g",    l: "Protein/Porsiyon" },
              { v: "ISO",    l: "Lab Onaylı" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-mono font-bold text-[18px] text-foreground tracking-[-0.03em]">{s.v}</p>
                <p className="text-[10px] text-secondary uppercase tracking-[0.12em] mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — full-bleed product image */}
        <div className="hidden lg:block absolute top-0 right-0 w-[52%] h-full">
          <div className="hero-split-img w-full h-full">
            <img
              src="/images/hero-end.jpg"
              alt="OLD IRON"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Gradient fade left edge */}
          <div className="absolute inset-y-0 left-0 w-32
            bg-gradient-to-r from-white to-transparent pointer-events-none" />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-[20px] md:left-[72px] flex items-center gap-3 z-10">
          <div className="w-px h-10 bg-foreground/20 animate-bounce-slow" />
          <span className="text-[9px] uppercase tracking-[0.35em] text-secondary">Kaydır</span>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          MARQUEE BAND
      ══════════════════════════════════════════════════════════ */}
      <div className="bg-foreground py-3.5 overflow-hidden">
        <div className="flex whitespace-nowrap marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6">
              <span className="font-bold text-[11px] text-white uppercase tracking-[0.22em]">{item}</span>
              <span className="text-white/20 text-[6px]">■</span>
            </span>
          ))}
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════
          HORIZONTAL PRODUCT SCROLL
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[72px] mb-10">
          <div className="reveal flex items-end justify-between">
            <div>
              <p className="text-eyebrow mb-3">Koleksiyon</p>
              <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold tracking-[-0.04em] leading-none text-foreground">
                Tüm Ürünler
              </h2>
            </div>
            <Link to="/shop"
              className="hidden md:flex items-center gap-2 text-[13px] font-semibold
                text-secondary hover:text-foreground transition-colors link-underline">
              Tamamını Gör
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Drag-scroll strip */}
        <div
          ref={drag.ref}
          className="flex gap-4 overflow-x-auto drag-scroll select-none pl-[20px] md:pl-[72px] pr-[20px]"
          onMouseDown={drag.onMouseDown}
          onMouseLeave={drag.onMouseLeave}
          onMouseUp={drag.onMouseUp}
          onMouseMove={drag.onMouseMove}
        >
          {allFeatured.map((p, i) => (
            <Link
              key={p.id}
              to="/product/$id"
              params={{ id: p.id }}
              className="flex-none w-[280px] sm:w-[320px] group cursor-pointer"
              style={{ transitionDelay: `${i * 40}ms` }}
              draggable={false}
            >
              {/* Image */}
              <div className="aspect-[3/4] overflow-hidden bg-[#f2f2f2] relative">
                {p.video ? (
                  <ProductVideo src={p.video} poster={p.videoPoster} alt={p.name}
                    loop={p.type === "apparel"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                ) : (
                  <img
                    src={p.image || (p.type === "apparel" ? APPAREL_PLACEHOLDER : SUPPLEMENT_PLACEHOLDER)}
                    alt={p.name}
                    loading="lazy"
                    draggable={false}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                )}
                {p.badge && (
                  <span className="absolute top-3 left-3 badge-cobalt z-10">{p.badge}</span>
                )}
                {/* Quick add */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    add(p, p.type === "apparel" ? "M" : "Standart");
                    toast.success(`${p.name} sepete eklendi`);
                  }}
                  className="absolute bottom-0 left-0 right-0 bg-foreground/90 backdrop-blur-sm text-white
                    font-bold text-[12px] tracking-[0.02em] py-3.5
                    translate-y-full group-hover:translate-y-0
                    transition-transform duration-300 flex items-center justify-center gap-2 z-10"
                >
                  <span className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}>add_shopping_cart</span>
                  Sepete Ekle
                </button>
              </div>

              {/* Info */}
              <div className="pt-4 pb-2">
                <p className="text-[10px] text-secondary uppercase tracking-[0.1em] mb-1">{p.categoryLabel}</p>
                <h3 className="text-[15px] font-bold text-foreground tracking-[-0.02em] leading-snug">{p.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-price text-foreground">₺{p.price.toFixed(2)}</span>
                  {p.originalPrice && (
                    <span className="text-price-strike">₺{p.originalPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
          {/* Spacer */}
          <div className="flex-none w-[20px] md:w-[72px]" />
        </div>

        <div className="flex justify-center mt-8">
          <Link to="/shop" className="md:hidden btn-ghost text-[13px] px-8 py-3">
            Tamamını Gör
          </Link>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          EDITORIAL — full-bleed split: image + numbers
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[#f2f2f2]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2">

          {/* Image side */}
          <div className="reveal-left aspect-[4/5] lg:aspect-auto lg:min-h-[700px] overflow-hidden relative bg-[#e8e8e8]">
            <img
              src={apparelFeatured[0]?.image || APPAREL_PLACEHOLDER}
              alt="OLD IRON Giyim"
              className="w-full h-full object-cover transition-transform duration-[1.2s] hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <span className="absolute bottom-8 left-8 badge-cobalt text-[11px]">Koleksiyon 01 · Giyim</span>
          </div>

          {/* Text side */}
          <div className="reveal-right flex flex-col justify-center px-[40px] md:px-[72px] py-20 bg-white">
            <p className="text-eyebrow mb-6">Almanya Kalitesi</p>
            <h2 className="text-[clamp(2.2rem,4vw,4rem)] font-bold tracking-[-0.04em] leading-[0.95] mb-8 text-foreground">
              Uzlaşma<br />
              <span className="text-cobalt">Yok.</span>
            </h2>
            <p className="text-[15px] text-secondary leading-relaxed mb-10 tracking-[-0.01em] max-w-sm">
              300gsm ağır pamuk. Kesim atlettikçe gömlek gibi dağılmaz.
              Her dikişi, her ipliği Almanya'nın üretim disipliniyle yapıldı.
            </p>

            <div className="space-y-4 mb-10">
              {[
                { n: "01", t: "300 g/m² Premium Pamuk",   d: "Ağır gramaj, salonun ortasında şekil tutar" },
                { n: "02", t: "Almanya'da Üretildi",       d: "AB kalite standartları, her dikişte kontrol" },
                { n: "03", t: "Athletic Oversize Kesim",   d: "Spor hareketlere uygun, premium yaka düzeni" },
              ].map((item) => (
                <div key={item.n} className="flex gap-5 items-start py-4 border-b border-outline-variant last:border-0">
                  <span className="font-mono text-[11px] font-bold text-cobalt/50 mt-0.5 flex-shrink-0">{item.n}</span>
                  <div>
                    <p className="text-[14px] font-bold text-foreground tracking-[-0.02em]">{item.t}</p>
                    <p className="text-[12px] text-secondary mt-0.5">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/shop"
              className="inline-flex items-center gap-3 font-bold text-[13px] text-foreground
                hover:text-cobalt transition-colors link-underline group self-start">
              Giyim Koleksiyonunu Gör
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          SUPPLEMENT — grid
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[72px]">

          <div className="reveal flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow mb-3">Koleksiyon 02</p>
              <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold tracking-[-0.04em] leading-none text-foreground">
                Supplement
              </h2>
              <p className="text-[13px] text-secondary mt-3">Lab onaylı · Dolgu maddesi yok · Almanya kalitesi</p>
            </div>
            <Link to="/shop"
              className="hidden md:flex items-center gap-2 text-[13px] font-semibold
                text-secondary hover:text-foreground transition-colors link-underline">
              Tüm Supplementler
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {supplementFeatured.map((p, i) => (
              <Link key={p.id} to="/product/$id" params={{ id: p.id }}
                className="reveal group cursor-pointer"
                style={{ transitionDelay: `${i * 60}ms` }}>

                <div className="aspect-[3/4] overflow-hidden bg-[#f2f2f2] relative">
                  <img
                    src={p.image || SUPPLEMENT_PLACEHOLDER}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  {p.badge && (
                    <span className="badge-cobalt absolute top-3 left-3 z-10">{p.badge}</span>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      add(p, "Standart");
                      toast.success(`${p.name} sepete eklendi`);
                    }}
                    className="absolute bottom-0 left-0 right-0 bg-foreground/90 text-white
                      font-bold text-[12px] py-3 translate-y-full group-hover:translate-y-0
                      transition-transform duration-300 flex items-center justify-center gap-2 z-10"
                  >
                    <span className="material-symbols-outlined text-[14px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}>add_shopping_cart</span>
                    Sepete Ekle
                  </button>
                </div>

                <div className="pt-3">
                  <p className="text-[10px] text-secondary uppercase tracking-[0.1em]">{p.categoryLabel}</p>
                  <h3 className="text-[14px] font-bold text-foreground tracking-[-0.02em] mt-1 leading-snug">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-price text-foreground">₺{p.price.toFixed(2)}</span>
                    {p.originalPrice && (
                      <span className="text-price-strike">₺{p.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Trust row */}
          <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-4 mt-14 pt-14 border-t border-outline-variant">
            {[
              { icon: "science",        title: "ISO 17025 Lab Onaylı",  desc: "Her parti bağımsız laboratuvarda analiz edilir" },
              { icon: "block",          title: "Sıfır Dolgu Maddesi",   desc: "Sadece saf, etkin ham madde" },
              { icon: "local_shipping", title: "1500₺ Üzeri Ücretsiz",  desc: "1–3 iş günü içinde kapında" },
            ].map((item, i) => (
              <div key={item.title}
                className="reveal flex items-start gap-4 py-2"
                style={{ transitionDelay: `${i * 70}ms` }}>
                <span className="material-symbols-outlined text-cobalt text-[20px] mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                <div>
                  <p className="text-[13px] font-bold text-foreground mb-0.5 tracking-[-0.02em]">{item.title}</p>
                  <p className="text-[12px] text-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          MANIFESTO — huge type, black
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-foreground py-32 px-[20px] md:px-[72px] overflow-hidden">
        <div className="max-w-[1440px] mx-auto">

          <p className="reveal text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase mb-12">
            — Manifesto —
          </p>

          <h2 className="reveal font-bold leading-[0.9] tracking-[-0.05em] text-white
            text-[clamp(3rem,8vw,8rem)] max-w-5xl mb-16">
            Başarı tesadüf değildir.<br />
            Hiç bitmeyen bir disiplinin<br />
            sonucudur.
          </h2>

          <div className="reveal flex flex-col md:flex-row items-start md:items-center
            justify-between gap-8 pt-10 border-t border-white/10">
            <p className="text-[15px] text-white/50 leading-relaxed max-w-md tracking-[-0.01em]">
              OLD IRON sadece bir marka değil, bir yaşam felsefesidir.
              Almanya'nın mühendislik disipliniyle salonların tozu birleşiyor.
              En iyi ekipman, en saf içerik.
            </p>
            <Link to="/shop"
              className="inline-flex items-center gap-3 text-white font-bold text-[14px]
                tracking-[-0.01em] group link-underline flex-shrink-0">
              Koleksiyonu Keşfet
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-2 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-[#f2f2f2]">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[72px]">

          <div className="reveal flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p className="text-eyebrow mb-3">Topluluk</p>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.04em] leading-none text-foreground">
                Sporcuların<br />Yorumları
              </h2>
            </div>
            <div className="flex gap-1">
              {Array.from({length: 5}).map((_,i) => (
                <span key={i} className="material-symbols-outlined text-cobalt text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { q: "Kumaşın kalitesi rakipsiz. Her antrenmanda farkı hissediyorsun. Bu sadece bir tişört değil — bir bildirgedir.", n: "Mehmet Yılmaz", r: "Powerlifter · İstanbul" },
              { q: "Iron Whey şimdiye kadar içtiğim en iyi protein. Şişkinlik yok, maksimum emilim, mükemmel sonuç.", n: "Seda Kaya",     r: "Kişisel Antrenör · Ankara" },
              { q: "Old Iron modern fitness dünyasında özlediğim şeyi sunuyor: gerçek disiplin, gerçek kalite.", n: "Burak Şahin",   r: "Bodybuilder · İzmir" },
            ].map((t, i) => (
              <div key={t.n}
                className="reveal bg-white p-8 group"
                style={{ transitionDelay: `${i * 80}ms` }}>

                <div className="flex gap-1 mb-6">
                  {Array.from({length: 5}).map((_,s) => (
                    <span key={s} className="material-symbols-outlined text-cobalt text-[13px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>

                <p className="text-[15px] text-foreground leading-relaxed mb-8 tracking-[-0.01em]">
                  "{t.q}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-outline-variant">
                  <div className="w-8 h-8 bg-cobalt flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-[13px] text-white leading-none">{t.n.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-foreground tracking-[-0.02em]">{t.n}</p>
                    <p className="text-[11px] text-secondary">{t.r}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          NEWSLETTER — minimal
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white border-t border-outline-variant">
        <div className="reveal max-w-lg mx-auto text-center px-[20px]">
          <p className="text-eyebrow mb-5">Özel Üyelik</p>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.04em] leading-[0.95] mb-4 text-foreground">
            Elitin Bir<br />
            <span className="text-cobalt">Parçası Ol</span>
          </h2>
          <p className="text-[13px] text-secondary mb-10 leading-relaxed">
            Sınırlı stok · Erken erişim · Üyeye özel indirimler
          </p>

          <form className="flex flex-col sm:flex-row gap-2"
            onSubmit={(e) => { e.preventDefault(); toast.success("Hoş geldin — elitin bir parçasısın."); }}>
            <input
              type="email" required placeholder="E-posta adresin"
              className="flex-grow bg-[#f2f2f2] border-0 px-5 py-4 text-[13px] text-foreground
                placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-cobalt/20
                tracking-[-0.01em]"
            />
            <button type="submit"
              className="bg-foreground text-white font-bold text-[13px] px-8 py-4
                hover:bg-cobalt transition-colors duration-300 whitespace-nowrap tracking-[-0.01em]">
              Kaydol
            </button>
          </form>
          <p className="text-[10px] text-secondary/50 mt-4 uppercase tracking-widest">
            Spam yok. İstediğin zaman ayrılabilirsin.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
