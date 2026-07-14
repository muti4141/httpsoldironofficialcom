import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getReadySession, getSafeRedirectPath, setPostAuthRedirect } from "@/lib/auth-session";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Anmelden — OLD IRON" },
      { name: "description", content: "Melde dich bei deinem OLD IRON Konto an oder erstelle ein neues Konto." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => {
    const raw = typeof s.redirect === "string" ? s.redirect : "/";
    return {
      mode: (s.mode === "signup" ? "signup" : "login") as "login" | "signup",
      redirect: getSafeRedirectPath(raw, "/admin/orders"),
    };
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

  useEffect(() => {
    let active = true;
    getReadySession().then((session) => {
      if (active && session) navigate({ to: redirectTo, replace: true });
    });
    return () => {
      active = false;
    };
  }, [navigate, redirectTo]);

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
        toast.success("Konto erstellt. Bitte bestätige deine E-Mail-Adresse.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Willkommen zurück.");
        setPostAuthRedirect(redirectTo);
        navigate({ to: redirectTo });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten.");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    const target = redirectTo && redirectTo.startsWith("/") ? redirectTo : "/";
    setPostAuthRedirect(target);
    const redirectUri = window.location.origin;
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: redirectUri });
    if (result.error) { toast.error(result.error.message); setBusy(false); return; }
    if (result.redirected) return;
    navigate({ to: redirectTo });
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />
      <main className="pt-[120px] pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-md mx-auto">
        <header className="mb-stack-md text-center">
          <h1 className="font-display text-[48px] md:text-[56px] uppercase tracking-tight text-primary leading-none">
            {isSignup ? "Konto erstellen" : "Anmelden"}
          </h1>
          <p className="text-[13px] font-semibold uppercase tracking-widest text-outline mt-2">
            {isSignup ? "Werde Teil unserer Community." : "Willkommen zurück."}
          </p>
        </header>

        <button type="button" onClick={handleGoogle} disabled={busy}
          className="w-full bg-surface-container-low border border-outline-variant py-4 px-6 flex items-center justify-center gap-3 text-[13px] uppercase tracking-widest font-semibold text-primary hover:border-accent-warm transition-colors disabled:opacity-50 cursor-pointer">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Mit Google fortfahren
        </button>

        <div className="relative py-6 flex items-center gap-3">
          <div className="flex-grow h-px bg-outline-variant/30" />
          <span className="text-[10px] uppercase text-outline tracking-widest">Oder per E-Mail</span>
          <div className="flex-grow h-px bg-outline-variant/30" />
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isSignup && (
            <Field label="Name">
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-[15px] text-primary focus:border-accent-warm focus:outline-none"
                placeholder="Vor- und Nachname" />
            </Field>
          )}
          <Field label="E-Mail">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-[15px] text-primary focus:border-accent-warm focus:outline-none"
              placeholder="beispiel@email.com" />
          </Field>
          <Field label="Passwort">
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-[15px] text-primary focus:border-accent-warm focus:outline-none"
              placeholder="••••••••" />
          </Field>
          <button type="submit" disabled={busy}
            className="w-full bg-accent-warm text-on-primary-container font-headline text-[20px] py-4 uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer">
            {busy ? "..." : isSignup ? "Konto erstellen" : "Anmelden"}
          </button>
        </form>

        <p className="text-center text-[14px] text-secondary mt-8">
          {isSignup ? "Du hast bereits ein Konto?" : "Noch kein Konto?"}{" "}
          <Link to="/auth" search={{ mode: isSignup ? "login" : "signup", redirect: redirectTo }}
            className="text-accent-warm underline uppercase tracking-widest text-[12px] font-semibold cursor-pointer">
            {isSignup ? "Anmelden" : "Konto erstellen"}
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
      <span className="text-[12px] font-semibold uppercase tracking-widest text-secondary">{label}</span>
      {children}
    </label>
  );
}
