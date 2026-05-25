import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/widerruf")({
  head: () => ({
    meta: [
      { title: "Widerrufsbelehrung — OLD IRON" },
      { name: "description", content: "14-tägiges Widerrufsrecht für Verbraucher." },
      { property: "og:title", content: "Widerrufsbelehrung — OLD IRON" },
      { property: "og:url", content: "https://oldironofficial.com/legal/widerruf" },
    ],
    links: [{ rel: "canonical", href: "https://oldironofficial.com/legal/widerruf" }],
  }),
  component: Widerruf,
});

function Widerruf() {
  return (
    <>
      <h1 className="font-display text-[48px] uppercase tracking-tight text-primary leading-none">Widerrufsbelehrung</h1>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">Widerrufsrecht</h2>
        <p>
          Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
          Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter,
          der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.
        </p>
        <p>
          Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder E-Mail)
          über Ihren Entschluss informieren:
        </p>
        <p className="border-l-2 border-primary pl-4">
          [TODO: Firmenname]<br />
          [TODO: Anschrift]<br />
          E-Mail: <a href="mailto:widerruf@oldironofficial.com" className="text-primary hover:underline">widerruf@oldironofficial.com</a>
        </p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">Folgen des Widerrufs</h2>
        <p>
          Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten
          (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene,
          günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen,
          an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
        </p>
        <p>
          Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn,
          mit Ihnen wurde ausdrücklich etwas anderes vereinbart. Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben
          oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben.
        </p>
        <p>
          Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.
        </p>
      </section>

      <section>
        <h2 className="font-headline text-[20px] text-primary uppercase mt-stack-md mb-2">Ausschluss des Widerrufsrechts</h2>
        <p>
          Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung versiegelter Waren, die aus Gründen des Gesundheitsschutzes oder der Hygiene
          nicht zur Rückgabe geeignet sind, wenn ihre Versiegelung nach der Lieferung entfernt wurde.
        </p>
      </section>
    </>
  );
}
