import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/versand")({
  head: () => ({
    meta: [
      { title: "Kargo & Ödeme — OLD IRON" },
      { name: "description", content: "Kargo ücretleri, teslimat süreleri ve ödeme yöntemleri hakkında bilgiler." },
      { property: "og:title", content: "Kargo & Ödeme — OLD IRON" },
      { property: "og:url", content: "https://oldironofficial.com/legal/versand" },
    ],
    links: [{ rel: "canonical", href: "https://oldironofficial.com/legal/versand" }],
  }),
  component: Versand,
});

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[20px] font-bold tracking-[-0.03em] text-foreground mt-8 mb-2">{children}</h2>;
}

function Versand() {
  return (
    <>
      <h1 className="text-[40px] md:text-[48px] font-bold tracking-[-0.04em] text-foreground leading-none">Kargo &amp; Ödeme</h1>
      <p className="text-[14px] text-secondary">Teslimat süreleri, kargo ücretleri ve ödeme yöntemleri</p>

      <section>
        <H2>Kargo Ücretleri &amp; Teslimat Süreleri</H2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left py-3 text-[12px] uppercase tracking-[0.12em] text-secondary">Bölge</th>
                <th className="text-left py-3 text-[12px] uppercase tracking-[0.12em] text-secondary">Ücret</th>
                <th className="text-left py-3 text-[12px] uppercase tracking-[0.12em] text-secondary">Süre</th>
              </tr>
            </thead>
            <tbody className="text-[15px]">
              <tr className="border-b border-outline-variant/60">
                <td className="py-3">Türkiye</td>
                <td className="font-mono">₺140,00</td>
                <td>3–7 iş günü</td>
              </tr>
              <tr>
                <td className="py-3">1500₺ ve üzeri siparişler</td>
                <td className="font-mono">Ücretsiz</td>
                <td>3–7 iş günü</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[13px] text-secondary mt-2">1500₺ ve üzeri sipariş tutarında kargo ücretsizdir.</p>
      </section>

      <section>
        <H2>Kargo Takibi</H2>
        <p>Siparişiniz kargoya verildiğinde takip numaranız e-posta ile iletilir.</p>
      </section>

      <section>
        <H2>Ödeme Yöntemleri</H2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Kredi kartı (Visa, Mastercard, American Express)</li>
          <li>Apple Pay / Google Pay</li>
          <li>Sipariş sırasında gösterilen diğer yöntemler</li>
        </ul>
        <p className="text-[13px] text-secondary mt-2">
          Tüm ödemeler iyzico üzerinden güvenle işlenir. Kart bilgileriniz sunucularımızda saklanmaz.
        </p>
      </section>

      <section>
        <H2>İade</H2>
        <p>
          14 günlük cayma hakkınız bulunmaktadır. Ayrıntılar için{" "}
          <Link to="/legal/widerruf" className="text-cobalt hover:underline">İade &amp; Cayma</Link> sayfasına bakınız.
        </p>
      </section>
    </>
  );
}
