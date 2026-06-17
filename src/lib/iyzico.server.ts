// Iyzico HTTP client (Checkout Form / iyzipos).
// Auth: IYZWSv2 — HMAC-SHA256( secretKey, randomKey + uri + JSON(body) ) hex lowercase,
// then base64("apiKey:..&randomKey:..&signature:..").
import { createHmac, randomBytes } from "crypto";

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not configured`);
  return v;
}

function baseUrl(): string {
  const url = (process.env.IYZICO_BASE_URL || "https://api.iyzipay.com").trim();
  return url.replace(/\/+$/, "");
}

function buildAuthHeader(uri: string, body: unknown): string {
  const apiKey = env("IYZICO_API_KEY");
  const secret = env("IYZICO_SECRET_KEY");
  const randomKey = `${Date.now()}${randomBytes(8).toString("hex")}`;
  const payload = randomKey + uri + JSON.stringify(body);
  const signature = createHmac("sha256", secret).update(payload, "utf8").digest("hex");
  const authString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`;
  const base64 = Buffer.from(authString, "utf8").toString("base64");
  return `IYZWSv2 ${base64}`;
}

export async function iyzicoPost<T = any>(uri: string, body: Record<string, unknown>): Promise<T> {
  const url = baseUrl() + uri;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: buildAuthHeader(uri, body),
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json: any;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) {
    throw new Error(`Iyzico ${uri} HTTP ${res.status}: ${text.slice(0, 500)}`);
  }
  return json as T;
}

export type IyzicoBasketItem = {
  id: string;
  name: string;
  category1: string;
  itemType: "PHYSICAL" | "VIRTUAL";
  price: string; // decimal
};

export type IyzicoBuyer = {
  id: string;
  name: string;
  surname: string;
  gsmNumber?: string;
  email: string;
  identityNumber: string; // 11 digits for TR
  registrationAddress: string;
  ip: string;
  city: string;
  country: string;
  zipCode?: string;
};

export type IyzicoAddress = {
  contactName: string;
  city: string;
  country: string;
  address: string;
  zipCode?: string;
};

export type InitCheckoutForm = {
  locale?: string;
  conversationId: string;
  price: string;
  paidPrice: string;
  currency: "TRY" | "EUR" | "USD";
  basketId: string;
  paymentGroup: "PRODUCT" | "LISTING" | "SUBSCRIPTION";
  callbackUrl: string;
  enabledInstallments?: number[];
  buyer: IyzicoBuyer;
  shippingAddress: IyzicoAddress;
  billingAddress: IyzicoAddress;
  basketItems: IyzicoBasketItem[];
};

export type InitCheckoutFormResponse = {
  status: "success" | "failure";
  errorCode?: string;
  errorMessage?: string;
  token?: string;
  checkoutFormContent?: string;
  paymentPageUrl?: string;
  tokenExpireTime?: number;
  conversationId?: string;
};

export function initCheckoutForm(body: InitCheckoutForm) {
  return iyzicoPost<InitCheckoutFormResponse>(
    "/payment/iyzipos/checkoutform/initialize/auth/ecom",
    body,
  );
}

export type RetrieveCheckoutFormResponse = {
  status: "success" | "failure";
  errorCode?: string;
  errorMessage?: string;
  paymentStatus?: "SUCCESS" | "FAILURE" | "INIT_THREEDS" | "CALLBACK_THREEDS" | "BANK_FRAUD_CHECK" | "PENDING_CREDIT";
  paymentId?: string;
  price?: number;
  paidPrice?: number;
  currency?: string;
  basketId?: string;
  conversationId?: string;
  token?: string;
  fraudStatus?: number;
};

export function retrieveCheckoutForm(token: string, conversationId: string) {
  return iyzicoPost<RetrieveCheckoutFormResponse>(
    "/payment/iyzipos/checkoutform/auth/ecom/detail",
    { locale: "tr", conversationId, token },
  );
}
