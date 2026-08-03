/**
 * iyzico REST API v2 istemcisi (Ödeme Formu / Checkout Form).
 * Cloudflare Workers'ta çalışacak şekilde Web Crypto ile HMAC-SHA256
 * imzalama yapar — resmi Node SDK yerine ham REST çağrısı kullanılır.
 * Dokümantasyon: https://docs.iyzico.com/
 */

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} ortam değişkeni tanımlı değil`);
  return value;
};

const BASE_URL = process.env.IYZICO_BASE_URL || "https://api.iyzipay.com";

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmacSha256Hex(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** iyzico'nun IYZWSv2 (HMACSHA256) yetkilendirme başlığını üretir. */
async function buildAuthHeader(uriPath: string, body: unknown): Promise<string> {
  const apiKey = getEnv("IYZICO_API_KEY");
  const secretKey = getEnv("IYZICO_SECRET_KEY");
  const randomKey = `${Date.now()}${randomHex(8)}`;
  const payload = randomKey + uriPath + JSON.stringify(body ?? {});
  const signature = await hmacSha256Hex(secretKey, payload);

  const authParams = [
    `apiKey=${apiKey}`,
    `randomKey=${randomKey}`,
    `signature=${signature}`,
  ].join("&");
  const base64Params = Buffer.from(authParams, "utf-8").toString("base64");
  return `IYZWSv2 ${base64Params}`;
}

async function iyzicoRequest<T>(uriPath: string, body: unknown): Promise<T> {
  const authorization = await buildAuthHeader(uriPath, body);
  const res = await fetch(`${BASE_URL}${uriPath}`, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
      "x-iyzi-rnd": randomHex(8),
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as T;
  return json;
}

/* ── Tipler ────────────────────────────────────────────────────────── */

export type IyzicoAddress = {
  contactName: string;
  city: string;
  country: string;
  address: string;
  zipCode?: string;
};

export type IyzicoBuyer = {
  id: string;
  name: string;
  surname: string;
  gsmNumber?: string;
  email: string;
  identityNumber: string;
  registrationAddress: string;
  ip: string;
  city: string;
  country: string;
  zipCode?: string;
};

export type IyzicoBasketItem = {
  id: string;
  name: string;
  category1: string;
  itemType: "PHYSICAL";
  price: string;
};

export type InitCheckoutFormInput = {
  locale?: "tr" | "en";
  conversationId: string;
  price: string;
  paidPrice: string;
  currency: "TRY";
  basketId: string;
  callbackUrl: string;
  buyer: IyzicoBuyer;
  shippingAddress: IyzicoAddress;
  billingAddress: IyzicoAddress;
  basketItems: IyzicoBasketItem[];
};

export type InitCheckoutFormResult = {
  status: "success" | "failure";
  errorMessage?: string;
  errorCode?: string;
  token?: string;
  checkoutFormContent?: string;
  paymentPageUrl?: string;
};

export type RetrieveCheckoutFormResult = {
  status: "success" | "failure";
  errorMessage?: string;
  paymentStatus?: "SUCCESS" | "FAILURE" | "INIT_THREEDS" | "CALLBACK_THREEDS" | "BKM_POS_SELECTED";
  paymentId?: string;
  conversationId?: string;
  basketId?: string;
  price?: string;
  paidPrice?: string;
};

/** Ödeme formunu başlatır — dönen checkoutFormContent istemcide render edilir. */
export async function initializeCheckoutForm(
  input: InitCheckoutFormInput,
): Promise<InitCheckoutFormResult> {
  return iyzicoRequest<InitCheckoutFormResult>("/payment/iyzipos/checkoutform/initialize/auth/ecom", {
    locale: input.locale ?? "tr",
    conversationId: input.conversationId,
    price: input.price,
    paidPrice: input.paidPrice,
    currency: input.currency,
    basketId: input.basketId,
    paymentGroup: "PRODUCT",
    callbackUrl: input.callbackUrl,
    enabledInstallments: [1],
    buyer: input.buyer,
    shippingAddress: input.shippingAddress,
    billingAddress: input.billingAddress,
    basketItems: input.basketItems,
  });
}

/** Ödeme sonucunu callback'ten gelen token ile doğrular. */
export async function retrieveCheckoutForm(token: string): Promise<RetrieveCheckoutFormResult> {
  return iyzicoRequest<RetrieveCheckoutFormResult>(
    "/payment/iyzipos/checkoutform/auth/ecom/detail",
    { locale: "tr", token },
  );
}
