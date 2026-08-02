import { useEffect, useRef, type CSSProperties, type ElementType } from "react";

/**
 * Zellerfeld tarzı yazı animasyonu:
 * metin kelimelere bölünür, scroll ile görünüme girince
 * her kelime alttan maskeyle yükselir (kademeli).
 */
export function RevealText({
  text,
  as: Tag = "h2",
  className,
  style,
  stagger = 60,
  once = true,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  stagger?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    /* Emniyet: gözlemci kurulamazsa yazı gizli kalmasın */
    if (!el || typeof IntersectionObserver === "undefined") {
      ref.current?.classList.add("rt-visible");
      return;
    }

    /* Zaten ekrandaysa beklemeden göster */
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("rt-visible");
      if (once) return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("rt-visible");
          if (once) obs.disconnect();
        } else if (!once) {
          el.classList.remove("rt-visible");
        }
      },
      /* Uzun başlıklarda %35 eşiği hiç dolmayabiliyordu */
      { threshold: 0.01, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);

    /* Son emniyet: 1.5sn içinde tetiklenmediyse yine de göster */
    const safety = window.setTimeout(() => el.classList.add("rt-visible"), 1500);

    return () => { obs.disconnect(); clearTimeout(safety); };
  }, [once]);

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={`rt ${className ?? ""}`} style={style} aria-label={text}>
      {words.map((w, i) => (
        <span className="rt-mask" key={i} aria-hidden>
          <span
            className="rt-word"
            style={{ transitionDelay: `${i * stagger}ms` }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
