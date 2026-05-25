import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutz — OLD IRON" },
      { name: "description", content: "Informationen zur Verarbeitung personenbezogener Daten nach DSGVO." },
      { property: "og:title", content: "Datenschutz — OLD IRON" },
      { property: "og:url", content: "https://oldironofficial.com/legal/datenschutz" },
    ],
    links: [{ rel: "canonical", href: "https://oldironofficial.com/legal/datenschutz" }],
  }),
  component: Datenschutz,
});

function Datenschutz() {
  return (
    <>
      <h1 className="font-display text-[48px] uppercase tracking-tight text-primary leading-none">Datenschutzerklärung</h1>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">1. Verantwortlicher</h2>
        <p>
          Verantwortlicher im Sinne der DSGVO ist:<br />
          [TODO: Firmenname]<br />
          [TODO: Anschrift]<br />
          E-Mail: <a href="mailto:datenschutz@oldironofficial.com" className="text-primary hover:underline">datenschutz@oldironofficial.com</a>
        </p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">2. Erhebung und Speicherung personenbezogener Daten</h2>
        <p>
          Bei der Nutzung unseres Online-Shops werden folgende Daten verarbeitet:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Bestelldaten (Name, Anschrift, E-Mail, Telefon)</li>
          <li>Zahlungsdaten (über Stripe verarbeitet)</li>
          <li>Server-Logfiles (IP-Adresse, Zeitstempel, Browser)</li>
          <li>Cookies (siehe Abschnitt 6)</li>
        </ul>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">3. Zwecke und Rechtsgrundlagen</h2>
        <p>
          Die Verarbeitung erfolgt zur Erfüllung des Kaufvertrags (Art. 6 Abs. 1 lit. b DSGVO), zur Erfüllung gesetzlicher Pflichten
          (Art. 6 Abs. 1 lit. c DSGVO) sowie zur Wahrung berechtigter Interessen (Art. 6 Abs. 1 lit. f DSGVO).
        </p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">4. Empfänger / Auftragsverarbeiter</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Stripe Payments Europe Ltd. — Zahlungsabwicklung</li>
          <li>Resend — Transaktions-E-Mails</li>
          <li>Supabase / Lovable Cloud — Hosting & Datenbank</li>
          <li>Versanddienstleister: [TODO: z. B. DHL]</li>
        </ul>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">5. Speicherdauer</h2>
        <p>
          Wir speichern personenbezogene Daten nur so lange, wie es zur Erfüllung der genannten Zwecke erforderlich ist oder gesetzliche
          Aufbewahrungspflichten (z. B. handels- und steuerrechtlich, in der Regel 6–10 Jahre) bestehen.
        </p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">6. Cookies</h2>
        <p>
          Wir verwenden technisch notwendige Cookies für den Betrieb des Shops (z. B. Warenkorb, Login). Für nicht notwendige Cookies
          (z. B. Analyse, Marketing) holen wir Ihre Einwilligung über den Cookie-Banner ein.
        </p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">7. Ihre Rechte</h2>
        <p>
          Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18),
          Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21) sowie das Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO).
        </p>
      </section>
    </>
  );
}
