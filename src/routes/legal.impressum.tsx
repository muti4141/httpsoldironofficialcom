import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/impressum")({
  head: () => ({
    meta: [
      { title: "Şirket Bilgileri — OLD IRON" },
      { name: "description", content: "OLD IRON hizmet sağlayıcı bilgileri." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Şirket Bilgileri — OLD IRON" },
      { property: "og:url", content: "https://oldironofficial.com/legal/impressum" },
    ],
    links: [{ rel: "canonical", href: "https://oldironofficial.com/legal/impressum" }],
  }),
  component: Impressum,
});

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[20px] font-bold tracking-[-0.03em] text-foreground mt-8 mb-2">{children}</h2>;
}

function Impressum() {
  return (
    <>
      <h1 className="text-[40px] md:text-[48px] font-bold tracking-[-0.04em] text-foreground leading-none">Şirket Bilgileri</h1>
      <p className="text-[14px] text-secondary">Hizmet sağlayıcı kimlik bilgileri</p>

      <section>
        <H2>Hizmet Sağlayıcı</H2>
        <p>
          OLD IRON<br />
          Almanya
        </p>
      </section>

      <section>
        <H2>İletişim</H2>
        <p>
          E-posta: <a href="mailto:info@oldironofficial.com" className="text-cobalt hover:underline">info@oldironofficial.com</a>
        </p>
      </section>

      <section>
        <H2>Çevrimiçi Uyuşmazlık Çözümü</H2>
        <p>
          Avrupa Komisyonu, çevrimiçi uyuşmazlık çözümü (ODR) için bir platform sunmaktadır:{" "}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer" className="text-cobalt hover:underline">
            https://ec.europa.eu/consumers/odr
          </a>
          . E-posta adresimiz yukarıda yer almaktadır.
        </p>
        <p>Bir tüketici tahkim kurulu önündeki uyuşmazlık çözüm süreçlerine katılma yükümlülüğümüz bulunmamaktadır.</p>
      </section>

      <section>
        <H2>İçerik Sorumluluğu</H2>
        <p>
          Hizmet sağlayıcı olarak bu sayfalardaki kendi içeriklerimizden genel yasalar çerçevesinde sorumluyuz.
          Ancak üçüncü taraflarca iletilen veya kaydedilen bilgileri izleme ya da hukuka aykırı faaliyete işaret eden
          durumları araştırma yükümlülüğümüz bulunmamaktadır.
        </p>
      </section>
    </>
  );
}
