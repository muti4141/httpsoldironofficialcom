import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createCartCheckout } from "@/lib/payments.functions";

type Props = {
  orderId: string;
  items: { productId: string; name: string; unitAmountCents: number; quantity: number }[];
  shippingCents: number;
  returnUrl: string;
};

export function StripeCartCheckout({ orderId, items, shippingCents, returnUrl }: Props) {
  const fetchClientSecret = async () => {
    const secret = await createCartCheckout({
      data: { orderId, items, shippingCents, returnUrl, environment: getStripeEnvironment() },
    });
    if (!secret) throw new Error("Konnte Checkout nicht starten.");
    return secret;
  };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
