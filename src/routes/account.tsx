import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { signOut } from "@/hooks/use-auth";

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
        search: { mode: "login", redirect: location.href },
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
          .select("display_name, phone, shipping_address, shipping_city, shipping_zip, shipping_country")
          .eq("id", userData.user.id)
          .maybeSingle(),
        supabase
          .from("orders")
          .select("id, created_at, total_cents, currency, status")
          .eq("user_id", userData.user.id)
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
    if (error) toast.error(error.message);
    else toast.success("Profil kaydedildi.");
  };

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) =>
    setProfile((p) => ({ ...p, [k]: v }));

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />
      <main className="pt-[120px] pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-2xl mx-auto">
        <header className="mb-stack-md flex justify-between items-end">
          <div>
            <h1 className="font-display text-[48px] md:text-[56px] uppercase tracking-tight text-primary leading-none">
              Hesabım
            </h1>
            <p className="text-[14px] text-outline mt-2">{email}</p>
          </div>
          <button
            onClick={async () => {
              await signOut();
              toast.success("Çıkış yapıldı.");
            }}
            className="text-[12px] uppercase tracking-widest text-secondary hover:text-error border border-outline-variant px-4 py-2"
          >
            Çıkış Yap
          </button>
        </header>

        {loading ? (
          <p className="text-secondary">Yükleniyor...</p>
        ) : (
          <form onSubmit={save} className="space-y-stack-sm">
            <Section title="Kişisel Bilgiler">
              <Field label="Görünen Ad">
                <Input value={profile.display_name ?? ""} onChange={(v) => set("display_name", v)} />
              </Field>
              <Field label="Telefon">
                <Input value={profile.phone ?? ""} onChange={(v) => set("phone", v)} type="tel" />
              </Field>
            </Section>

            <Section title="Teslimat Adresi">
              <Field label="Sokak ve Bina No">
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
              className="w-full bg-primary-container text-on-secondary-fixed font-headline text-[20px] py-4 uppercase tracking-widest hover:brightness-110 disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </form>
        )}

        {!loading && (
          <section className="mt-stack-md bg-surface-container-low border border-outline-variant/30 p-gutter">
            <h2 className="font-headline text-[20px] uppercase text-primary mb-4">Siparişler</h2>
            {orders.length === 0 ? (
              <p className="text-secondary text-[14px]">Henüz sipariş yok.</p>
            ) : (
              <ul className="divide-y divide-outline-variant/20">
                {orders.map((o) => (
                  <li key={o.id}>
                    <Link
                      to="/order/$id"
                      params={{ id: o.id }}
                      className="flex items-center justify-between py-4 hover:bg-surface-container/40 px-2 -mx-2 transition-colors"
                    >
                      <div>
                        <p className="font-mono text-primary text-[14px]">#{o.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-[12px] text-outline uppercase tracking-widest mt-1">
                          {new Date(o.created_at).toLocaleDateString("tr-TR")} · {o.status}
                        </p>
                      </div>
                      <span className="text-primary font-headline">₺{(o.total_cents / 100).toFixed(2)}</span>
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
    <section className="bg-surface-container-low border border-outline-variant/30 p-gutter space-y-4">
      <h2 className="font-headline text-[20px] uppercase text-primary">{title}</h2>
      {children}
    </section>
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
      className="w-full bg-surface-container border border-outline-variant px-4 py-3 text-[16px] text-primary focus:border-primary focus:outline-none"
    />
  );
}
