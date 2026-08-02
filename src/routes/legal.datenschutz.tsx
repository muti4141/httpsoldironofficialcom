import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/datenschutz")({
  head: () => ({
    meta: [
      { title: "Gizlilik Politikası — OLD IRON" },
      { name: "description", content: "Kişisel verilerin işlenmesine ilişkin bilgilendirme (KVKK / GDPR)." },
      { property: "og:title", content: "Gizlilik Politikası — OLD IRON" },
      { property: "og:url", content: "https://oldironofficial.com/legal/datenschutz" },
    ],
    links: [{ rel: "canonical", href: "https://oldironofficial.com/legal/datenschutz" }],
  }),
  component: Datenschutz,
});

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[20px] font-bold tracking-[-0.03em] text-foreground mt-8 mb-2">{children}</h2>;
}

function Datenschutz() {
  return (
    <>
      <h1 className="text-[40px] md:text-[48px] font-bold tracking-[-0.04em] text-foreground leading-none">Gizlilik Politikası</h1>
      <p className="text-[14px] text-secondary">Kişisel verilerin korunması hakkında bilgilendirme</p>

      <section>
        <H2>1. Veri Sorumlusu</H2>
        <p>
          Veri sorumlusu: OLD IRON<br />
          E-posta: <a href="mailto:datenschutz@oldironofficial.com" className="text-cobalt hover:underline">datenschutz@oldironofficial.com</a>
        </p>
      </section>

      <section>
        <H2>2. İşlenen Kişisel Veriler</H2>
        <p>Online mağazamızı kullandığınızda aşağıdaki veriler işlenir:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Sipariş verileri (ad soyad, adres, e-posta, telefon)</li>
          <li>Ödeme verileri (Stripe üzerinden işlenir)</li>
          <li>Sunucu kayıtları (IP adresi, zaman damgası, tarayıcı)</li>
          <li>Çerezler (bkz. bölüm 6)</li>
        </ul>
      </section>

      <section>
        <H2>3. İşleme Amaçları ve Hukuki Dayanak</H2>
        <p>
          Veriler; satış sözleşmesinin ifası, yasal yükümlülüklerin yerine getirilmesi ve meşru menfaatlerin
          korunması amacıyla ilgili mevzuata (KVKK / GDPR) uygun olarak işlenir.
        </p>
      </section>

      <section>
        <H2>4. Veri Aktarılan Taraflar</H2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Stripe Payments Europe Ltd. — ödeme işlemleri</li>
          <li>Resend — işlem e-postaları</li>
          <li>Supabase / Lovable Cloud — barındırma ve veritabanı</li>
          <li>Kargo hizmet sağlayıcıları — teslimat</li>
        </ul>
      </section>

      <section>
        <H2>5. Saklama Süresi</H2>
        <p>
          Kişisel verileri yalnızca belirtilen amaçların gerektirdiği süre boyunca veya yasal saklama
          yükümlülükleri (ticaret ve vergi mevzuatı gereği genellikle 6–10 yıl) süresince saklarız.
        </p>
      </section>

      <section>
        <H2>6. Çerezler</H2>
        <p>
          Mağazanın çalışması için teknik olarak zorunlu çerezler (ör. sepet, oturum) kullanırız. Zorunlu olmayan
          çerezler (ör. analiz, pazarlama) için çerez bildirimi üzerinden onayınızı alırız.
        </p>
      </section>

      <section>
        <H2>7. Haklarınız</H2>
        <p>
          Kişisel verilerinize erişme, düzeltilmesini veya silinmesini isteme, işlemenin kısıtlanmasını talep etme,
          veri taşınabilirliği ve itiraz haklarına sahipsiniz. Ayrıca ilgili denetim makamına şikâyette bulunabilirsiniz.
        </p>
      </section>
    </>
  );
}
