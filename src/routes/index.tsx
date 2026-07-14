import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProductVideo } from "@/components/ProductVideo";
import { APPAREL_PLACEHOLDER } from "@/data/products";
import { useAllProducts } from "@/hooks/useAllProducts";
import { useRef, useState, useEffect } from "react";
import { useCart } from "@/stores/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OLD IRON — Aus Disziplin geschmiedet" },
      { name: "description", content: "Premium Sportbekleidung aus Deutschland. Heavyweight Oversize Tees, Stringer und mehr. Old-School-Mentalität, moderne Kraft." },
    ],
    links: [
      { rel: "preload", as: "image", href: "/images/hero-end.jpg", fetchPriority: "high" },
    ],
  }),
  component: Home,
});

const marqueeItems = [
  "AUS DISZIPLIN GESCHMIEDET", "PREMIUM SPORTBEKLEIDUNG", "HEAVYWEIGHT COTTON",
  "VERSAND AUS DEUTSCHLAND",   "KEINE KOMPROMISSE",       "300 GSM BAUMWOLLE",
  "OLD-SCHOOL-MENTALITÄT",     "MADE FOR THE GRIND",
];

const stats = [
  { value: "300",   unit: "gsm",  label: "Stoffgewicht",     desc: "Heavyweight Premium-Baumwolle" },
  { value: "100",   unit: "%",    label: "Baumwolle",         desc: "Reine Naturfaser" },
  { value: "14",    unit: "Tage", label: "Widerrufsrecht",   desc: "Ohne Angabe von Gründen" },
  { value: "DE",    unit: "",     label: "Versand",           desc: "Aus Deutschland" },
];

const testimonials = [
  { quote: "Die Stoffqualität ist unschlagbar. Jedes Training fühlt sich anders an. Das ist mehr als nur ein T-Shirt — es ist ein Statement.", name: "Markus Weber", role: "Powerlifter · Berlin", stars: 5 },
  { quote: "Endlich Sportbekleidung, die hält was sie verspricht. Kein Herumreißen, keine Dehnung — nur solide Qualität.", name: "Lena Schmidt", role: "Personal Trainer · München", stars: 5 },
  { quote: "Old Iron liefert genau das, was in der modernen Fitness-Welt fehlt: echte Disziplin, echte Qualität.", name: "Tobias König", role: "Bodybuilder · Hamburg", stars: 5 },
];

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

function Home() {
  useReveal();
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [heroEnded, setHeroEnded] = useState(false);
  const [heroVideoSrc, setHeroVideoSrc] = useState<string | undefined>(undefined);
  useEffect(() => {
    const idle = (window as any).requestIdleCallback || ((cb: () => void) => setTimeout(cb, 600));
    const handle = idle(() => setHeroVideoSrc("/videos/hero.mp4"));
    return () => {
      const cancel = (window as any).cancelIdleCallback;
      if (cancel && typeof handle === "number") cancel(handle);
    };
  }, []);
  const add = useCart((s) => s.add);

  const products = useAllProducts().filter((p) => p.type === "apparel");
  const featured = products.slice(0, 6);

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <Nav />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <video ref={heroVideoRef} src={heroVideoSrc} poster="/images/hero-end.jpg" autoPlay muted playsInline preload="none"
          onEnded={() => { heroVideoRef.current?.pause(); setHeroEnded(true); }}
          className={`absolute inset-0 w-full h-full object-cover opacity-35 ${heroEnded ? "hidden" : "block"}`}
        />
        {heroEnded && (
          <img src="/images/hero-end.jpg" alt="OLD IRON" decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-35" />
        )}

        <div className="absolute inset-0 hero-gradient z-[1]" />
        <div className="absolute inset-0 grain-overlay z-[2] opacity-40" />
        <div className="absolute inset-0 vignette z-[3]" />

        <div className="relative z-10 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto w-full pt-28 pb-24 text-center flex flex-col items-center">

          <p className="animate-fade-up-1 text-eyebrow mb-7 flex items-center justify-center gap-4">
            <span className="inline-block w-10 h-px bg-accent-warm" />
            Versand aus Deutschland · Premium Qualität
            <span className="inline-block w-10 h-px bg-accent-warm" />
          </p>

          <h1 className="animate-fade-up-2 font-display uppercase leading-[0.85] tracking-tighter mb-10">
            <span className="block text-[clamp(4.5rem,13vw,11rem)] text-white text-glow">
              Aus Disziplin
            </span>
            <span className="block text-[clamp(4.5rem,13vw,11rem)] text-accent-warm text-glow-orange"
              style={{ marginTop: "-0.05em" }}>
              Geschmiedet
            </span>
          </h1>

          <p className="animate-fade-up-3 text-[16px] md:text-[19px] text-secondary mb-12 max-w-xl leading-relaxed font-light">
            Premium Sportbekleidung. <span className="text-white italic">Old-School-Mentalität</span>, moderne Kraft.
            <span className="text-primary font-medium"> Keine Ausreden.</span>
          </p>

          <div className="animate-fade-up-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn-primary text-[18px]">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              Jetzt shoppen
            </Link>
            <Link to="/shop" className="btn-ghost text-[18px]">
              Kollektion entdecken
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="animate-fade-up-5 absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <span className="text-[9px] uppercase tracking-[0.4em] text-outline">Entdecken</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-accent-warm/60 to-transparent animate-bounce-slow" />
          </div>
        </div>

        <div className="hidden xl:flex absolute right-8 top-1/2 -translate-y-1/2 z-10 items-center gap-3">
          <span className="text-vertical text-[9px] uppercase tracking-[0.4em] text-outline/60">
            Est. 2024 · Germany
          </span>
          <div className="w-px h-20 bg-gradient-to-b from-transparent via-outline/30 to-transparent" />
        </div>
      </section>

      {/* MARQUEE */}
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

      {/* STATS */}
      <section className="bg-surface-container-low border-b border-outline-variant/20 relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay opacity-30 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-16
          grid grid-cols-2 md:grid-cols-4 divide-x divide-outline-variant/20">
          {stats.map((s, i) => (
            <StatItem key={s.label} {...s} index={i} />
          ))}
        </div>
      </section>

      {/* APPAREL COLLECTION */}
      <section className="py-stack-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <div className="reveal flex items-end justify-between mb-14 flex-wrap gap-6">
          <div>
            <p className="text-eyebrow mb-3">Kollektion</p>
            <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] uppercase text-primary leading-none">
              Sportbekleidung
            </h2>
            <div className="flex items-center gap-3 mt-4">
              <span className="accent-line" />
              <span className="text-[11px] text-secondary uppercase tracking-widest">300 gsm Premium-Baumwolle · Heavyweight</span>
            </div>
          </div>
          <Link to="/shop"
            className="link-underline text-[12px] uppercase tracking-[0.2em] text-accent-warm hover:text-primary transition-colors flex items-center gap-2 cursor-pointer">
            Alle Produkte
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p, i) => (
            <Link key={p.id} to="/product/$id" params={{ id: p.id }}
              className="reveal group relative steel-bevel card-shimmer bg-surface-container cursor-pointer overflow-hidden"
              style={{ transitionDelay: `${i * 90}ms` }}>

              <div className="aspect-[4/5] overflow-hidden bg-surface-container-highest relative">
                {p.video ? (
                  <ProductVideo src={p.video} poster={p.videoPoster} alt={p.name} loop
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                ) : (
                  <img src={p.image || APPAREL_PLACEHOLDER} alt={p.name} loading="lazy"
                    onError={(e) => { e.currentTarget.src = APPAREL_PLACEHOLDER; }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                {p.badge && (
                  <span className="absolute top-4 left-4 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 z-10">
                    {p.badge}
                  </span>
                )}

                <button
                  onClick={(e) => { e.preventDefault(); add(p, "M"); toast.success(`${p.name} zum Warenkorb hinzugefügt`); }}
                  className="absolute bottom-4 left-4 right-4 bg-accent-warm text-on-primary-container
                    font-headline text-[15px] uppercase tracking-widest py-3
                    translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                    transition-all duration-300 flex items-center justify-center gap-2 z-10">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_shopping_cart</span>
                  In den Warenkorb
                </button>
              </div>

              <div className="p-5">
                <p className="text-[10px] text-outline uppercase tracking-[0.2em] mb-1">{p.categoryLabel}</p>
                <h3 className="font-headline text-[22px] text-primary uppercase leading-tight mb-1">{p.name}</h3>
                <p className="text-[13px] text-secondary mb-3">{p.subtitle}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[16px] text-accent-warm font-semibold">{p.price.toFixed(2)} €</span>
                  <span className="material-symbols-outlined text-[16px] text-outline/50 group-hover:text-accent-warm group-hover:translate-x-1 transition-all duration-300">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="reveal mt-12 border border-outline-variant/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low">
          <div>
            <p className="text-[13px] text-primary font-semibold uppercase tracking-widest">Komplette Kollektion</p>
            <p className="text-[12px] text-secondary mt-0.5">Oversize Tees, Stringer, Shorts, Hoodies & Accessoires</p>
          </div>
          <Link to="/shop" className="btn-ghost text-[14px] px-8 py-3 whitespace-nowrap">
            Alle ansehen
          </Link>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-stack-xl relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay opacity-20 pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

            <div className="lg:col-span-5 reveal-left">
              <div className="relative">
                <div className="aspect-[3/4] bg-surface-container-low orange-bevel relative overflow-hidden">
                  <div className="absolute inset-0 grain-overlay opacity-40" />
                  <p className="absolute inset-0 flex items-center justify-center font-display text-[clamp(4rem,12vw,8rem)] text-primary/8 uppercase leading-none select-none text-center px-4">
                    OLD<br />IRON
                  </p>
                  <div className="absolute top-8 left-8 w-16 h-px bg-accent-warm/40" />
                  <div className="absolute top-8 left-8 w-px h-16 bg-accent-warm/40" />
                  <div className="absolute bottom-8 right-8 w-16 h-px bg-accent-warm/40" />
                  <div className="absolute bottom-8 right-8 w-px h-16 bg-accent-warm/40" />
                </div>

                <div className="absolute -bottom-5 -right-5 bg-accent-warm p-5 glow-orange">
                  <p className="font-display text-[32px] text-on-primary-container leading-none">2024</p>
                  <p className="text-[10px] text-on-primary-container/70 uppercase tracking-widest mt-0.5">Gegründet</p>
                </div>

                <div className="absolute -left-4 top-1/2 -translate-y-1/2 hidden lg:block">
                  <p className="text-vertical text-[9px] uppercase tracking-[0.4em] text-outline/50">
                    Germany · Premium · Iron
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 reveal-right">
              <p className="text-eyebrow mb-5">Unser Erbe</p>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-white uppercase leading-none mb-8">
                Erbe des<br />
                <span className="text-accent-warm">Stahls</span>
              </h2>

              <div className="space-y-5 mb-10">
                <p className="text-[16px] text-secondary leading-relaxed">
                  Bei OLD IRON verkaufen wir nicht einfach Kleidung. Wir sprechen von Metall, das wir biegen
                  und formen — von Willenskraft, die wir schmieden und stärken.
                </p>
                <p className="text-[16px] text-secondary leading-relaxed">
                  Jedes Teil ist eine Hommage an das goldene Zeitalter des Bodybuildings. 300 g/m² Baumwolle.
                  Kompromisslos verarbeitet.
                </p>
                <p className="text-[16px] text-on-surface-variant leading-relaxed">
                  Keine Abkürzungen. Nur der reine Stahl der Disziplin.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { n: "01", label: "Premium Qualität",  desc: "Keine Kompromisse" },
                  { n: "02", label: "Heavyweight-Stoff", desc: "300 g/m² Baumwolle" },
                  { n: "03", label: "Versand aus DE",    desc: "1–3 Werktage" },
                  { n: "04", label: "14 Tage Widerruf",  desc: "Ohne Wenn und Aber" },
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
                Kollektion entdecken
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="relative py-stack-xl bg-white text-black overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }} />
        <div className="absolute top-0 left-0 right-0 h-1 bg-accent-warm" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-warm" />

        <div className="relative max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center text-center">
          <p className="reveal font-headline text-[13px] tracking-[0.45em] mb-10 text-accent-warm uppercase">
            — Manifest —
          </p>
          <h2 className="reveal font-display uppercase leading-[0.95] tracking-tight text-[clamp(2.5rem,6.5vw,5.5rem)] mb-12 max-w-5xl">
            Erfolg ist kein Zufall.<br />
            Erfolg ist das Ergebnis <span className="text-accent-warm relative inline-block">
              unaufhörlicher
              <span className="absolute left-0 right-0 -bottom-1 h-[6px] bg-accent-warm/25" />
            </span> Disziplin.
          </h2>
          <p className="reveal max-w-2xl text-[17px] md:text-[19px] leading-loose text-black/60 font-light">
            OLD IRON ist keine Marke — es ist eine Lebensphilosophie. Alte Werte, harte Arbeit und
            kompromisslose Qualität. Beste Ausrüstung, härtestes Training.
          </p>

          <div className="reveal flex items-center gap-4 mt-12">
            <span className="h-px w-12 bg-black/20" />
            <span className="font-headline text-[12px] tracking-[0.4em] uppercase text-black/50">Old Iron · Est. 2024 · Germany</span>
            <span className="h-px w-12 bg-black/20" />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-stack-xl bg-surface-container-low relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />

        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="reveal text-center mb-14">
            <p className="text-eyebrow mb-4">Community</p>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-white uppercase">
              Stimmen aus dem Gym
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name}
                className="reveal steel-bevel bg-surface-container p-8 relative overflow-hidden group hover:border-accent-warm/20 transition-colors"
                style={{ transitionDelay: `${i * 100}ms` }}>

                <span className="absolute -top-2 -right-2 font-display text-[120px] text-primary/[0.04] select-none leading-none pointer-events-none">
                  "
                </span>

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

      {/* NEWSLETTER */}
      <section className="relative overflow-hidden py-stack-lg">
        <div className="absolute inset-0 bg-surface-container-low" />
        <div className="absolute inset-0 grain-overlay opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-warm/20 to-transparent" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-10"
          style={{ background: "radial-gradient(ellipse, #e8843a 0%, transparent 70%)" }} />

        <div className="reveal max-w-2xl mx-auto text-center px-margin-mobile relative z-10">
          <p className="text-eyebrow mb-5">Exklusive Mitgliedschaft</p>
          <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] text-white uppercase leading-none mb-4">
            Teil der<br />
            <span className="text-accent-warm">Elite werden</span>
          </h2>
          <p className="text-[14px] text-secondary mb-10 uppercase tracking-[0.12em] leading-relaxed">
            Drops & Restocks · Früher Zugang · Nur für Mitglieder verfügbare Rabatte
          </p>

          <form className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto"
            onSubmit={(e) => { e.preventDefault(); toast.success("Willkommen — du bist dabei."); }}>
            <input type="email" required placeholder="Deine E-Mail-Adresse"
              aria-label="E-Mail-Adresse"
              className="flex-grow bg-surface-container border border-outline-variant/40 border-r-0
                px-5 py-4 text-[13px] focus:border-accent-warm focus:outline-none
                text-white placeholder:text-outline/50 tracking-widest" />
            <button type="submit"
              className="btn-primary text-[15px] py-4 px-8 whitespace-nowrap border-0">
              Anmelden
            </button>
          </form>

          <p className="text-[10px] text-outline/60 mt-4 uppercase tracking-widest">
            Kein Spam. Jederzeit kündbar.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatItem({ value, unit, label, desc, index }: {
  value: string; unit: string; label: string; desc: string; index: number;
}) {
  const isNum = !isNaN(Number(value));
  const { val, ref } = useCounter(isNum ? Number(value) : 0, 1600);

  return (
    <div className={`reveal text-center px-8 py-12 ${index > 0 ? "border-l border-outline-variant/20 md:border-l" : ""} relative group`}
      style={{ transitionDelay: `${index * 100}ms` }}>
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
