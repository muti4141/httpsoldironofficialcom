import { supabase } from "@/integrations/supabase/client";

const POST_AUTH_REDIRECT_KEY = "oldiron.postAuthRedirect";

const AUTH_PARAM_KEYS = new Set([
  "access_token",
  "refresh_token",
  "expires_at",
  "expires_in",
  "provider_refresh_token",
  "provider_token",
  "token_type",
  "type",
]);

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

function readAuthParams() {
  if (typeof window === "undefined") return null;
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const searchParams = new URLSearchParams(window.location.search);
  const accessToken = hashParams.get("access_token") ?? searchParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token") ?? searchParams.get("refresh_token");
  if (!accessToken || !refreshToken) return null;
  return { access_token: accessToken, refresh_token: refreshToken };
}

function stripAuthParamsFromUrl() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  AUTH_PARAM_KEYS.forEach((key) => url.searchParams.delete(key));

  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
  let hadAuthHash = false;
  AUTH_PARAM_KEYS.forEach((key) => {
    if (hashParams.has(key)) hadAuthHash = true;
    hashParams.delete(key);
  });
  url.hash = hadAuthHash && hashParams.size > 0 ? `#${hashParams.toString()}` : "";

  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
}

export async function getReadySession(timeoutMs = 3000) {
  if (typeof window === "undefined") return null;

  const tokens = readAuthParams();
  if (tokens) {
    const { error } = await supabase.auth.setSession(tokens);
    if (!error) stripAuthParamsFromUrl();
  }

  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const { data } = await supabase.auth.getSession();
    if (data.session) return data.session;
    await wait(100);
  }

  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function getReturnPath(location: { pathname: string; searchStr?: string; hash?: string }) {
  const hash = location.hash ? (location.hash.startsWith("#") ? location.hash : `#${location.hash}`) : "";
  return `${location.pathname}${location.searchStr ?? ""}${hash}`;
}

export function setPostAuthRedirect(path: string) {
  if (typeof window === "undefined") return;
  const safePath = path.startsWith("/") && !path.startsWith("//") && !path.includes("://") ? path : "/";
  window.sessionStorage.setItem(POST_AUTH_REDIRECT_KEY, safePath);
}

export function takePostAuthRedirect() {
  if (typeof window === "undefined") return null;
  const path = window.sessionStorage.getItem(POST_AUTH_REDIRECT_KEY);
  window.sessionStorage.removeItem(POST_AUTH_REDIRECT_KEY);
  return path && path.startsWith("/") && !path.startsWith("//") && !path.includes("://") ? path : null;
}