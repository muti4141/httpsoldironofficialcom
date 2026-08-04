import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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

/* ── Karanlık tema jetonları (site geneliyle aynı) ──────────────────────── */
const BG     = "#080808";
const CARD   = "#141414";
const RAISED = "#1c1c1c";
const HAIR   = "rgba(255,255,255,0.12)";
const HAIR2  = "rgba(255,255,255,0.20)";
const TEXT   = "#f4f4f4";
const MUTED  = "rgba(255,255,255,0.55)";
const DIM    = "rgba(255,255,255,0.38)";
const BONE   = "#f4f4f4";
const MONO   = "'JetBrains Mono', ui-monospace, monospace";
const SANS   = "'Inter Tight', Inter, sans-serif";
const EASE   = "cubic-bezier(.16,.8,.24,1)";

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
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${redirectTo}` },
    });
    if (error) { toast.error(error.message); setBusy(false); }
    /* Başarılıysa Supabase kendi tam sayfa yönlendirmesini yapar, burada yapılacak bir şey kalmaz. */
  };

  return (
    <div style={{ background: BG, color: TEXT, minHeight: "100vh", fontFamily: SANS }}>
      <Nav />
      <main
        style={{
          padding: "140px 20px 96px",
          maxWidth: "440px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: CARD,
            border: `1px solid ${HAIR}`,
            borderRadius: "16px",
            padding: "40px 32px",
            boxShadow: "0 20px 60px rgba(0,0,0,.45)",
          }}
        >
          <header style={{ textAlign: "center", marginBottom: "32px" }}>
            <p style={{
              fontFamily: MONO, fontSize: "11px", letterSpacing: ".2em",
              textTransform: "uppercase", color: DIM, marginBottom: "10px",
            }}>
              OLD IRON
            </p>
            <h1 style={{
              fontSize: "32px", fontWeight: 700, letterSpacing: "-0.03em",
              lineHeight: 1.1, color: TEXT, margin: 0,
            }}>
              {isSignup ? "Hesap Oluştur" : "Giriş Yap"}
            </h1>
            <p style={{ fontSize: "13px", color: MUTED, marginTop: "8px" }}>
              {isSignup ? "Topluluğumuza katıl." : "Tekrar hoş geldin."}
            </p>
          </header>

          <GhostButton onClick={handleGoogle} disabled={busy}>
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ile Devam Et
          </GhostButton>

          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px", padding: "24px 0" }}>
            <div style={{ flexGrow: 1, height: "1px", background: HAIR }} />
            <span style={{
              fontFamily: MONO, fontSize: "10px", textTransform: "uppercase",
              letterSpacing: ".14em", color: DIM, whiteSpace: "nowrap",
            }}>
              Veya e-posta ile
            </span>
            <div style={{ flexGrow: 1, height: "1px", background: HAIR }} />
          </div>

          <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {isSignup && (
              <Field label="Ad Soyad">
                <TextInput
                  type="text" value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Adın Soyadın"
                />
              </Field>
            )}
            <Field label="E-posta">
              <TextInput
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
              />
            </Field>
            <Field label="Şifre">
              <TextInput
                type="password" required minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field>
            <button
              type="submit"
              disabled={busy}
              style={{
                width: "100%",
                marginTop: "8px",
                padding: "16px",
                borderRadius: "10px",
                border: "none",
                background: BONE,
                color: BG,
                fontFamily: MONO,
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                cursor: busy ? "default" : "pointer",
                opacity: busy ? 0.6 : 1,
                transform: "translateY(0) scale(1)",
                transition: `transform .25s ${EASE}, opacity .2s ease, box-shadow .25s ${EASE}`,
                boxShadow: "0 0 0 rgba(244,244,244,0)",
              }}
              onMouseEnter={(e) => {
                if (busy) return;
                e.currentTarget.style.transform = "translateY(-2px) scale(1.01)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(244,244,244,.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 0 0 rgba(244,244,244,0)";
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0) scale(.98)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(-2px) scale(1.01)"; }}
            >
              {busy ? "…" : isSignup ? "Hesap Oluştur" : "Giriş Yap"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "13px", color: MUTED, marginTop: "28px" }}>
            {isSignup ? "Zaten hesabın var mı?" : "Hesabın yok mu?"}{" "}
            <Link
              to="/auth"
              search={{ mode: isSignup ? "login" : "signup", redirect: redirectTo }}
              style={{
                color: TEXT, textDecoration: "underline", textUnderlineOffset: "3px",
                fontWeight: 600, transition: `color .2s ${EASE}`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = BONE; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = TEXT; }}
            >
              {isSignup ? "Giriş Yap" : "Hesap Oluştur"}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function GhostButton({
  children, onClick, disabled,
}: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
        padding: "15px 20px",
        borderRadius: "10px",
        border: `1px solid ${HAIR2}`,
        background: RAISED,
        color: TEXT,
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: "-0.01em",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: `border-color .2s ${EASE}, background .2s ${EASE}, transform .2s ${EASE}`,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.borderColor = "rgba(255,255,255,.4)";
        e.currentTarget.style.background = "#222222";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = HAIR2;
        e.currentTarget.style.background = RAISED;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{
        display: "block", marginBottom: "8px",
        fontFamily: MONO, fontSize: "10px", fontWeight: 600,
        textTransform: "uppercase", letterSpacing: ".12em", color: DIM,
      }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      style={{
        width: "100%",
        padding: "14px 16px",
        borderRadius: "10px",
        background: RAISED,
        border: `1px solid ${focused ? "rgba(255,255,255,.4)" : HAIR}`,
        color: TEXT,
        fontSize: "15px",
        fontFamily: SANS,
        outline: "none",
        boxShadow: focused ? "0 0 0 3px rgba(255,255,255,.06)" : "0 0 0 0 rgba(255,255,255,0)",
        transition: `border-color .2s ${EASE}, box-shadow .25s ${EASE}`,
      }}
    />
  );
}
