import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/versand")({
  head: () => ({
    meta: [
      { title: "Versand & Zahlung — OLD IRON" },
      { name: "description", content: "Informationen zu Versandkosten, Lieferzeiten und Zahlungsmethoden." },
      { property: "og:title", content: "Versand & Zahlung — OLD IRON" },
      { property: "og:url", content: "https://oldironofficial.com/legal/versand" },
    ],
    links: [{ rel: "canonical", href: "https://oldironofficial.com/legal/versand" }],
  }),
  component: Versand,
});

function Versand() {
  return (
    <>
      <h1 className="font-display text-[48px] uppercase tracking-tight text-primary leading-none">Versand & Zahlung</h1>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">Versandkosten & Lieferzeiten</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/30">
              <th className="text-left py-3 text-[14px] uppercase tracking-widest text-secondary">Region</th>
              <th className="text-left py-3 text-[14px] uppercase tracking-widest text-secondary">Kosten</th>
              <th className="text-left py-3 text-[14px] uppercase tracking-widest text-secondary">Dauer</th>
            </tr>
          </thead>
          <tbody className="text-[16px]">
            <tr className="border-b border-outline-variant/20">
              <td className="py-3">Deutschland</td>
              <td>4,90 €</td>
              <td>2–4 Werktage</td>
            </tr>
            <tr className="border-b border-outline-variant/20">
              <td className="py-3">EU</td>
              <td>9,90 €</td>
              <td>4–7 Werktage</td>
            </tr>
            <tr>
              <td className="py-3">Schweiz / UK</td>
              <td>14,90 €</td>
              <td>5–10 Werktage</td>
            </tr>
          </tbody>
        </table>
        <p className="text-[14px] text-outline mt-2">Ab einem Bestellwert von 99 € versenden wir innerhalb Deutschlands versandkostenfrei.</p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">Versandpartner</h2>
        <p>Der Versand erfolgt über DHL. Nach Versand erhältst du eine Sendungsnummer per E-Mail.</p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">Zahlungsmethoden</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Kreditkarte (Visa, Mastercard, American Express)</li>
          <li>Apple Pay / Google Pay</li>
          <li>SEPA-Lastschrift</li>
          <li>Klarna (Sofortüberweisung, Rechnung — sofern angeboten)</li>
        </ul>
        <p className="text-[14px] text-outline mt-2">Alle Zahlungen werden sicher über Stripe abgewickelt. Wir speichern keine Kartendaten auf unseren Servern.</p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">Rückgabe</h2>
        <p>
          Sie haben ein 14-tägiges Widerrufsrecht. Details finden Sie in der{" "}
          <a href="/legal/widerruf" className="text-primary hover:underline">Widerrufsbelehrung</a>.
        </p>
      </section>
    </>
  );
}
