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
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("rt-visible");
          if (once) obs.disconnect();
        } else if (!once) {
          el.classList.remove("rt-visible");
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
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
