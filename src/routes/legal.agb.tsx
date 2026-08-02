import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/agb")({
  head: () => ({
    meta: [
      { title: "Kullanım Koşulları — OLD IRON" },
      { name: "description", content: "OLD IRON online mağazası satış ve kullanım koşulları." },
      { property: "og:title", content: "Kullanım Koşulları — OLD IRON" },
      { property: "og:url", content: "https://oldironofficial.com/legal/agb" },
    ],
    links: [{ rel: "canonical", href: "https://oldironofficial.com/legal/agb" }],
  }),
  component: AGB,
});

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[20px] font-bold tracking-[-0.03em] text-foreground mt-8 mb-2">{children}</h2>;
}

function AGB() {
  return (
    <>
      <h1 className="text-[40px] md:text-[48px] font-bold tracking-[-0.04em] text-foreground leading-none">Kullanım Koşulları</h1>
      <p className="text-[14px] text-secondary">Genel satış ve kullanım koşulları</p>

      <section>
        <H2>1. Kapsam</H2>
        <p>Bu koşullar, OLD IRON (bundan böyle "Satıcı") online mağazası üzerinden verilen tüm siparişler için geçerlidir.</p>
      </section>

      <section>
        <H2>2. Sözleşmenin Kurulması</H2>
        <p>
          Ürünlerin online mağazada sergilenmesi hukuken bağlayıcı bir teklif değil, sipariş vermeye davettir.
          "Güvenli Ödemeye Geç" butonuna tıklayarak sepetinizdeki ürünler için bağlayıcı bir sipariş verirsiniz.
          Siparişin alındığına dair onay, siparişin kabulüyle birlikte e-posta yoluyla iletilir.
        </p>
      </section>

      <section>
        <H2>3. Fiyatlar ve Kargo Ücretleri</H2>
        <p>
          Tüm fiyatlar yasal KDV dahil nihai fiyatlardır. Belirtilen fiyatlara ek olarak, sipariş sürecinde ayrıca
          gösterilen kargo ücretleri uygulanabilir. 1500₺ ve üzeri siparişlerde kargo ücretsizdir.
        </p>
      </section>

      <section>
        <H2>4. Teslimat</H2>
        <p>Teslimat, ödemenin alınmasından itibaren 3–7 iş günü içinde Türkiye geneline yapılır.</p>
      </section>

      <section>
        <H2>5. Ödeme</H2>
        <p>
          Ödeme; kredi kartı, Apple Pay, Google Pay veya sipariş sırasında gösterilen diğer ödeme yöntemleriyle yapılabilir.
          Ödemeler, ödeme hizmet sağlayıcımız Stripe üzerinden güvenle işlenir.
        </p>
      </section>

      <section>
        <H2>6. Mülkiyetin Saklı Tutulması</H2>
        <p>Ürünler, bedeli tamamen ödenene kadar Satıcı'nın mülkiyetinde kalır.</p>
      </section>

      <section>
        <H2>7. Cayma Hakkı</H2>
        <p>
          Tüketiciler 14 günlük cayma hakkına sahiptir. Ayrıntılar{" "}
          <Link to="/legal/widerruf" className="text-cobalt hover:underline">İade &amp; Cayma</Link> sayfasında yer alır.
        </p>
      </section>

      <section>
        <H2>8. Ayıplı Mal Sorumluluğu</H2>
        <p>Yasal ayıplı mal sorumluluğu hükümleri geçerlidir.</p>
      </section>

      <section>
        <H2>9. Uygulanacak Hukuk</H2>
        <p>
          Tüketicinin mutad meskeninin bulunduğu ülkenin emredici hükümleri saklı kalmak kaydıyla,
          bu koşullara Satıcı'nın yerleşik olduğu ülke hukuku uygulanır.
        </p>
      </section>
    </>
  );
}
