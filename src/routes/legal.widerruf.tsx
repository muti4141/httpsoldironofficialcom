import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/widerruf")({
  head: () => ({
    meta: [
      { title: "İade & Cayma — OLD IRON" },
      { name: "description", content: "Tüketiciler için 14 günlük cayma hakkı bilgilendirmesi." },
      { property: "og:title", content: "İade & Cayma — OLD IRON" },
      { property: "og:url", content: "https://oldironofficial.com/legal/widerruf" },
    ],
    links: [{ rel: "canonical", href: "https://oldironofficial.com/legal/widerruf" }],
  }),
  component: Widerruf,
});

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[20px] font-bold tracking-[-0.03em] text-foreground mt-8 mb-2">{children}</h2>;
}

function Widerruf() {
  return (
    <>
      <h1 className="text-[40px] md:text-[48px] font-bold tracking-[-0.04em] text-foreground leading-none">İade &amp; Cayma</h1>
      <p className="text-[14px] text-secondary">Cayma hakkı bilgilendirmesi</p>

      <section>
        <H2>Cayma Hakkı</H2>
        <p>
          Herhangi bir gerekçe göstermeksizin on dört gün içinde bu sözleşmeden cayma hakkına sahipsiniz.
          Cayma süresi, sizin veya belirlediğiniz üçüncü bir kişinin (taşıyıcı hariç) ürünleri teslim aldığı
          günden itibaren on dört gündür.
        </p>
        <p>
          Cayma hakkınızı kullanmak için kararınızı açık bir beyanla (ör. posta veya e-posta ile) bize bildirmeniz yeterlidir:
        </p>
        <p className="border-l-2 border-cobalt pl-4">
          OLD IRON<br />
          E-posta:{" "}
          <a href="mailto:widerruf@oldironofficial.com" className="text-cobalt hover:underline">
            widerruf@oldironofficial.com
          </a>
        </p>
      </section>

      <section>
        <H2>Caymanın Sonuçları</H2>
        <p>
          Bu sözleşmeden caymanız halinde, sizden aldığımız tüm ödemeleri — teslimat masrafları dahil
          (tarafımızca sunulan en uygun standart teslimat dışında bir teslimat türü seçmenizden doğan ek
          masraflar hariç) — cayma bildiriminizin bize ulaştığı günden itibaren en geç on dört gün içinde iade ederiz.
        </p>
        <p>
          İade, aksi açıkça kararlaştırılmadıkça, ilk işlemde kullandığınız ödeme yöntemiyle yapılır.
          Ürünler bize ulaşana veya ürünleri geri gönderdiğinizi belgeleyene kadar iadeyi bekletebiliriz.
        </p>
        <p>Ürünlerin geri gönderim masrafları alıcıya aittir.</p>
      </section>

      <section>
        <H2>Cayma Hakkının İstisnaları</H2>
        <p>
          Sağlık ve hijyen açısından iadeye uygun olmayan, teslimattan sonra ambalajı açılmış mühürlü
          ürünlerde (ör. açılmış supplement ambalajları) cayma hakkı bulunmamaktadır.
        </p>
      </section>
    </>
  );
}
