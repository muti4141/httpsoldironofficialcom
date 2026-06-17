import { useEffect, useRef } from "react";

type Props = {
  /** The `checkoutFormContent` string returned by Iyzico — contains a <script> tag. */
  checkoutFormContent: string;
};

/**
 * Iyzico Checkout Form (responsive) mount point.
 * Iyzico's returned HTML is a <script> that injects the form into `#iyzipay-checkout-form`.
 * We append it via a real <script> element so the browser executes it.
 */
export function IyzicoCheckout({ checkoutFormContent }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reset target div in case of re-renders.
    const target = document.getElementById("iyzipay-checkout-form");
    if (target) target.innerHTML = "";

    // Extract <script> body from the returned HTML and execute.
    const match = checkoutFormContent.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    const code = match ? match[1] : checkoutFormContent;
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.text = code;
    container.appendChild(script);

    return () => {
      try { container.removeChild(script); } catch { /* noop */ }
    };
  }, [checkoutFormContent]);

  return (
    <div>
      <div id="iyzipay-checkout-form" className="responsive" />
      <div ref={containerRef} />
    </div>
  );
}
