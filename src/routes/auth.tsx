import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Giriş Yap — OLD IRON" },
      { name: "description", content: "OLD IRON hesabına giriş yap veya yeni hesap oluştur." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    mode: (s.mode === "signup" ? "signup" : "login") as "login" | "signup",
    redirect: typeof s.redirect === "string" && s.redirect.startsWith("/") && !s.redirect.startsWith("//")
      ? s.redirect
      : "/",
  }),
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: search.redirect });
  },
  component: AuthPage,
});

function AuthPage() {
  const { mode, redirect: redirectTo } = Route.useSearch();
  const navigate = useNavigate();
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy,        setBusy]        = useState(false);

  const isSignup = mode === "signup";

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Hesap oluşturuldu. Lütfen e-postanı onayla.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Tekrar hoş geldin.");
        navigate({ to: redirectTo });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { toast.error(result.error.message); setBusy(false); return; }
    if (result.redirected) return;
    navigate({ to: redirectTo });
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />
      <main className="pt-[120px] pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-md mx-auto">
        <header className="mb-stack-md text-center">
          <h1 className="text-[40px] md:text-[48px] font-bold tracking-[-0.04em] text-foreground leading-none">
            {isSignup ? "Hesap Oluştur" : "Giriş Yap"}
          </h1>
          <p className="text-[13px] text-secondary mt-2 tracking-[-0.02em]">
            {isSignup ? "Topluluğumuza katıl." : "Tekrar hoş geldin."}
          </p>
        </header>

        <button type="button" onClick={handleGoogle} disabled={busy}
          className="w-full bg-white border border-outline-variant rounded-[10px] py-4 px-6 flex items-center justify-center gap-3 text-[14px] font-semibold tracking-[-0.02em] text-foreground hover:border-cobalt transition-colors disabled:opacity-50 cursor-pointer">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google ile Devam Et
        </button>

        <div className="relative py-6 flex items-center gap-3">
          <div className="flex-grow h-px bg-outline-variant/30" />
          <span className="text-[11px] uppercase text-secondary tracking-[0.12em]">Veya e-posta ile</span>
          <div className="flex-grow h-px bg-outline-variant/30" />
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isSignup && (
            <Field label="Ad Soyad">
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-white border border-outline-variant rounded-[10px] px-4 py-3 text-[15px] text-foreground focus:border-cobalt focus:outline-none focus:ring-2 focus:ring-cobalt/10 transition-colors"
                placeholder="Adın Soyadın" />
            </Field>
          )}
          <Field label="E-posta">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-[10px] px-4 py-3 text-[15px] text-foreground focus:border-cobalt focus:outline-none focus:ring-2 focus:ring-cobalt/10 transition-colors"
              placeholder="ornek@email.com" />
          </Field>
          <Field label="Şifre">
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-outline-variant rounded-[10px] px-4 py-3 text-[15px] text-foreground focus:border-cobalt focus:outline-none focus:ring-2 focus:ring-cobalt/10 transition-colors"
              placeholder="••••••••" />
          </Field>
          <button type="submit" disabled={busy}
            className="w-full btn-primary text-[15px] py-4 disabled:opacity-50">
            {busy ? "..." : isSignup ? "Hesap Oluştur" : "Giriş Yap"}
          </button>
        </form>

        <p className="text-center text-[14px] text-secondary mt-8">
          {isSignup ? "Zaten hesabın var mı?" : "Hesabın yok mu?"}{" "}
          <Link to="/auth" search={{ mode: isSignup ? "login" : "signup", redirect: redirectTo }}
            className="text-cobalt underline text-[13px] font-semibold cursor-pointer">
            {isSignup ? "Giriş Yap" : "Hesap Oluştur"}
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-secondary">{label}</span>
      {children}
    </label>
  );
}
