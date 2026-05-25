import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/agb")({
  head: () => ({
    meta: [
      { title: "AGB — OLD IRON" },
      { name: "description", content: "Allgemeine Geschäftsbedingungen von OLD IRON." },
      { property: "og:title", content: "AGB — OLD IRON" },
      { property: "og:url", content: "https://oldironofficial.com/legal/agb" },
    ],
    links: [{ rel: "canonical", href: "https://oldironofficial.com/legal/agb" }],
  }),
  component: AGB,
});

function AGB() {
  return (
    <>
      <h1 className="font-display text-[48px] uppercase tracking-tight text-primary leading-none">AGB</h1>
      <p className="text-[14px] text-outline">Allgemeine Geschäftsbedingungen</p>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">§ 1 Geltungsbereich</h2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Bestellungen, die Verbraucher und Unternehmer über den Online-Shop von OLD IRON
          (im Folgenden „Verkäufer") aufgeben.
        </p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">§ 2 Vertragsschluss</h2>
        <p>
          Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, sondern eine Aufforderung zur Bestellung dar.
          Mit dem Klick auf den Button „Jetzt kaufen" geben Sie eine verbindliche Bestellung der im Warenkorb enthaltenen Waren ab.
          Die Bestätigung des Eingangs der Bestellung erfolgt zusammen mit der Annahme der Bestellung unmittelbar nach dem Absenden per E-Mail.
        </p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">§ 3 Preise und Versandkosten</h2>
        <p>
          Alle Preise sind Endpreise inklusive der gesetzlichen Mehrwertsteuer. Zusätzlich zu den angegebenen Preisen können Versandkosten anfallen,
          die im Bestellprozess gesondert ausgewiesen werden.
        </p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">§ 4 Lieferung</h2>
        <p>
          Die Lieferung erfolgt innerhalb Deutschlands sowie in die [TODO: Lieferländer auflisten] innerhalb von 3–7 Werktagen nach Zahlungseingang.
        </p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">§ 5 Zahlung</h2>
        <p>
          Die Bezahlung erfolgt wahlweise über Kreditkarte, Apple Pay, Google Pay oder weitere bei der Bestellung angezeigte Zahlungsarten.
          Die Abwicklung der Zahlung erfolgt über unseren Zahlungsdienstleister Stripe.
        </p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">§ 6 Eigentumsvorbehalt</h2>
        <p>Die Ware bleibt bis zur vollständigen Bezahlung Eigentum des Verkäufers.</p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">§ 7 Widerrufsrecht</h2>
        <p>
          Verbrauchern steht ein 14-tägiges Widerrufsrecht zu. Einzelheiten ergeben sich aus der{" "}
          <a href="/legal/widerruf" className="text-primary hover:underline">Widerrufsbelehrung</a>.
        </p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">§ 8 Gewährleistung</h2>
        <p>Es gelten die gesetzlichen Mängelhaftungsrechte.</p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">§ 9 Anwendbares Recht</h2>
        <p>
          Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
          Bei Verbrauchern gilt diese Rechtswahl nur insoweit, als nicht der gewährte Schutz durch zwingende Bestimmungen des Rechts des Staates,
          in dem der Verbraucher seinen gewöhnlichen Aufenthalt hat, entzogen wird.
        </p>
      </section>
    </>
  );
}
