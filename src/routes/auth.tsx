import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { translateError } from "@/lib/error-messages";
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
      toast.error(translateError(err instanceof Error ? err.message : null));
    } finally {
      setBusy(false);
    }
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
