const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN;

export function PaymentTestModeBanner() {
  if (!clientToken?.startsWith("pk_test_")) return null;
  return (
    <div className="w-full bg-blue-50 border-b border-blue-200 px-4 py-2 text-center text-sm text-blue-800">
      Tüm ödemeler şu anda test modunda çalışmaktadır. Gerçek ödeme alınmaz.
    </div>
  );
}
