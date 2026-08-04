import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { signOut } from "@/hooks/use-auth";
import { translateError } from "@/lib/error-messages";

type OrderRow = {
  id: string;
  created_at: string;
  total_cents: number;
  currency: string;
  status: string;
};


export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [{ title: "Hesabım — OLD IRON" }],
  }),
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({
        to: "/auth",
        search: { mode: "login", redirect: location.pathname + location.search },
      });
    }
  },
  component: AccountPage,
});

type Profile = {
  display_name: string | null;
  phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_zip: string | null;
  shipping_country: string | null;
  identity_number: string | null;
};

function AccountPage() {
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<Profile>({
    display_name: "",
    phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_zip: "",
    shipping_country: "TR",
    identity_number: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      setEmail(userData.user.email ?? "");
      const [{ data: prof }, { data: ords }] = await Promise.all([
        supabase
          .from("profiles")
          .select("display_name, phone, shipping_address, shipping_city, shipping_zip, shipping_country, identity_number")
          .eq("id", userData.user.id)
          .maybeSingle(),
        supabase
          .from("orders")
          .select("id, created_at, total_cents, currency, status")
          .order("created_at", { ascending: false }),
      ]);
      if (prof) setProfile(prof);
      setOrders((ords as OrderRow[]) ?? []);
      setLoading(false);
    })();
  }, []);


  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userData.user.id, ...profile });
    setSaving(false);
    if (error) toast.error(translateError(error.message));
    else toast.success("Profil kaydedildi.");
  };

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) =>
    setProfile((p) => ({ ...p, [k]: v }));

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />
      <main className="pt-[120px] pb-[80px] px-[20px] md:px-[72px] max-w-2xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-[40px] md:text-[48px] font-bold tracking-[-0.04em] text-foreground leading-none">
              Hesabım
            </h1>
            <p className="text-[14px] text-secondary mt-2">{email}</p>
          </div>
          <button
            onClick={async () => {
              await signOut();
              toast.success("Çıkış yapıldı.");
            }}
            className="text-[12px] font-semibold text-secondary hover:text-error border border-outline-variant px-4 py-2 rounded-[8px] transition-colors"
          >
            Çıkış Yap
          </button>
        </header>

        {loading ? (
          <p className="text-secondary">Yükleniyor...</p>
        ) : (
          <form onSubmit={save} className="space-y-4">
            <Section title="Kişisel Bilgiler">
              <Field label="Ad Soyad">
                <Input value={profile.display_name ?? ""} onChange={(v) => set("display_name", v)} />
              </Field>
              <Field label="Telefon">
                <Input value={profile.phone ?? ""} onChange={(v) => set("phone", v)} type="tel" />
              </Field>
              <Field label="TC Kimlik No">
                <Input
                  value={profile.identity_number ?? ""}
                  onChange={(v) => set("identity_number", v.replace(/\D/g, "").slice(0, 11))}
                  type="text"
                />
              </Field>
              <p className="text-[12px] text-secondary -mt-2">
                Ödeme sağlayıcımız iyzico'nun yasal zorunluluğu gereği gereklidir.
              </p>
            </Section>

            <Section title="Teslimat Adresi">
              <Field label="Sokak & Bina No">
                <Input value={profile.shipping_address ?? ""} onChange={(v) => set("shipping_address", v)} />
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Posta Kodu">
                  <Input value={profile.shipping_zip ?? ""} onChange={(v) => set("shipping_zip", v)} />
                </Field>
                <div className="col-span-2">
                  <Field label="Şehir">
                    <Input value={profile.shipping_city ?? ""} onChange={(v) => set("shipping_city", v)} />
                  </Field>
                </div>
              </div>
              <Field label="Ülke">
                <Input value={profile.shipping_country ?? "TR"} onChange={(v) => set("shipping_country", v)} />
              </Field>
            </Section>

            <button
              type="submit"
              disabled={saving}
              className="w-full btn-primary text-[15px] py-4 disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </form>
        )}

        {!loading && (
          <section className="mt-10 bg-plaster rounded-[10px] p-6">
            <h2 className="text-[18px] font-bold text-foreground mb-4 tracking-[-0.02em]">Siparişlerim</h2>
            {orders.length === 0 ? (
              <p className="text-secondary text-[14px]">Henüz sipariş bulunmuyor.</p>
            ) : (
              <ul className="divide-y divide-outline-variant">
                {orders.map((o) => (
                  <li key={o.id}>
                    <Link
                      to="/order/$id"
                      params={{ id: o.id }}
                      className="flex items-center justify-between py-4 hover:bg-surface-container-high px-2 -mx-2 transition-colors rounded-[8px]"
                    >
                      <div>
                        <p className="font-mono text-foreground text-[14px] font-bold">#{o.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-[12px] text-secondary mt-1">
                          {new Date(o.created_at).toLocaleDateString("tr-TR")} · {o.status}
                        </p>
                      </div>
                      <span className="text-foreground font-mono font-bold">{(o.total_cents / 100).toFixed(2)} ₺</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-plaster rounded-[10px] p-6 space-y-4">
      <h2 className="text-[16px] font-bold text-foreground tracking-[-0.02em]">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-secondary">{label}</span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white border border-outline-variant rounded-[8px] px-4 py-3 text-[15px] text-foreground focus:border-cobalt focus:outline-none focus:ring-2 focus:ring-cobalt/10 transition-colors"
    />
  );
}
