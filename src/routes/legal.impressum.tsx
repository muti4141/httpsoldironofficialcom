import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum — OLD IRON" },
      { name: "description", content: "Anbieterkennzeichnung gemäß § 5 TMG." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Impressum — OLD IRON" },
      { property: "og:url", content: "https://oldironofficial.com/legal/impressum" },
    ],
    links: [{ rel: "canonical", href: "https://oldironofficial.com/legal/impressum" }],
  }),
  component: Impressum,
});

function Impressum() {
  return (
    <>
      <h1 className="font-display text-[48px] uppercase tracking-tight text-primary leading-none">Impressum</h1>
      <p className="text-[14px] text-outline">Angaben gemäß § 5 TMG</p>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">Anbieter</h2>
        <p>
          [TODO: Firmenname / Inhaber]<br />
          [TODO: Straße und Hausnummer]<br />
          [TODO: PLZ und Ort]<br />
          Deutschland
        </p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">Kontakt</h2>
        <p>
          Telefon: [TODO: Telefonnummer]<br />
          E-Mail: <a href="mailto:info@oldironofficial.com" className="text-primary hover:underline">info@oldironofficial.com</a>
        </p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">Umsatzsteuer-ID</h2>
        <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:<br />[TODO: USt-IdNr., z. B. DE123456789]</p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">Handelsregister</h2>
        <p>[TODO: Registergericht und Handelsregisternummer, falls vorhanden]</p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p>
          [TODO: Vor- und Nachname]<br />
          [TODO: Anschrift wie oben]
        </p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">EU-Streitschlichtung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer" className="text-primary hover:underline">https://ec.europa.eu/consumers/odr</a>.
          Unsere E-Mail-Adresse findest du oben im Impressum.
        </p>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">Haftung für Inhalte</h2>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
          Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen
          oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
        </p>
      </section>
    </>
  );
}
