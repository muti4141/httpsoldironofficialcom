import { useEffect, useRef, useState } from "react";
import { createIyzicoCheckout } from "@/lib/payments.iyzico.functions";

type Props = {
  orderId: string;
  items: { productId: string; name: string; unitAmountCents: number; quantity: number }[];
  shippingCents: number;
};

/**
 * iyzico Ödeme Formu istemcisi. iyzico'nun döndürdüğü HTML/script parçasını
 * (checkoutFormContent) DOM'a enjekte eder — script içeriği innerHTML ile
 * çalışmadığı için elle <script> elemanları oluşturup ekliyoruz.
 */
export function IyzicoCartCheckout({ orderId, items, shippingCents }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let cancelled = false;

    (async () => {
      try {
        const { checkoutFormContent } = await createIyzicoCheckout({
          data: { orderId, items, shippingCents },
        });
        if (cancelled || !containerRef.current) return;

        const wrapper = document.createElement("div");
        wrapper.innerHTML = checkoutFormContent;

        // Script olmayan düğümleri (örn. form div'i) doğrudan taşı.
        const scripts: HTMLScriptElement[] = [];
        Array.from(wrapper.childNodes).forEach((node) => {
          if (node.nodeName === "SCRIPT") {
            scripts.push(node as HTMLScriptElement);
          } else {
            containerRef.current!.appendChild(node);
          }
        });

        // Script'leri sırayla, gerçek <script> elemanı olarak ekle ki tarayıcı çalıştırsın.
        for (const old of scripts) {
          const s = document.createElement("script");
          Array.from(old.attributes).forEach((attr) => s.setAttribute(attr.name, attr.value));
          if (old.textContent) s.textContent = old.textContent;
          containerRef.current!.appendChild(s);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Ödeme başlatılamadı. Lütfen tekrar deneyin.");
        }
      }
    })();

    return () => { cancelled = true; };
  }, [orderId, items, shippingCents]);

  if (error) {
    return (
      <p style={{ color: "#f4f4f4", fontSize: 14, lineHeight: 1.6 }}>{error}</p>
    );
  }

  return <div ref={containerRef} id="iyzipay-checkout-form" className="responsive" />;
}
