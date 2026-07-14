import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { getReadySession, getReturnPath } from "@/lib/auth-session";
import { checkIsAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/products")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Produkte" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminProductsPage,
});

type Row = {
  id: string;
  name: string;
  category: string;
  category_label: string;
  type: "apparel" | "supplement";
  price: number;
  original_price: number | null;
  image: string;
  video: string | null;
  video_poster: string | null;
  badge: string | null;
  subtitle: string;
  description: string;
  flavors: string[] | null;
  weights: string[] | null;
  servings: number | null;
  free_shipping: boolean;
  sort_order: number;
};

const EMPTY: Row = {
  id: "",
  name: "",
  category: "carbs",
  category_label: "Oberteile",
  type: "supplement",
  price: 280,
  original_price: 400,
  image: "",
  video: null,
  video_poster: null,
  badge: "Launch-Rabatt",
  subtitle: "",
  description: "",
  flavors: [],
  weights: [],
  servings: null,
  free_shipping: false,
  sort_order: 0,
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/ş/g, "s").replace(/ı/g, "i").replace(/ğ/g, "g")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function AdminProductsPage() {
  const navigate = useNavigate();
  const check = useServerFn(checkIsAdmin);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Row>(EMPTY);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState<"image" | "video" | null>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    const { data, error } = await supabase
      .from("admin_products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows((data ?? []) as Row[]);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const session = await getReadySession();
        if (!session) {
          navigate({ to: "/auth", search: { mode: "login", redirect: getReturnPath(window.location) }, replace: true });
          return;
        }
        const { isAdmin } = await check();
        if (!active) return;
        if (!isAdmin) {
          setAuthorized(false);
          setLoading(false);
          return;
        }
        setAuthorized(true);
        await refresh();
      } catch (e: any) {
        if (!active) return;
        toast.error(e?.message ?? "Hata");
        setAuthorized(false);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [check, navigate]);

  const resetForm = () => {
    setForm(EMPTY);
    setEditing(false);
  };

  const onEdit = (r: Row) => {
    setForm(r);
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id: string) => {
    if (!confirm(`Möchtest du "${id}" wirklich löschen?`)) return;
    const { error } = await supabase.from("admin_products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Produkt gelöscht");
    refresh();
  };

  const uploadFile = async (file: File, kind: "image" | "video") => {
    setUploading(kind);
    try {
      const ext = file.name.split(".").pop() || (kind === "image" ? "jpg" : "mp4");
      const path = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "31536000", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      const url = data.publicUrl;
      setForm((f) =>
        kind === "image" ? { ...f, image: url } : { ...f, video: url, video_poster: f.video_poster || f.image }
      );
      toast.success(`${kind === "image" ? "Bild" : "Video"} hochgeladen`);
    } catch (e: any) {
      toast.error(e?.message ?? "Upload fehlgeschlagen");
    } finally {
      setUploading(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Produktname erforderlich");
    if (!form.image) return toast.error("Bitte ein Bild hochladen");
    const id = form.id?.trim() || slugify(form.name);
    const payload = {
      ...form,
      id,
      flavors: (form.flavors ?? []).filter(Boolean),
      weights: (form.weights ?? []).filter(Boolean),
    };
    const { error } = await supabase
      .from("admin_products")
      .upsert(payload as any, { onConflict: "id" });
    if (error) return toast.error(error.message);
    toast.success(editing ? "Aktualisiert" : "Hinzugefügt");
    resetForm();
    refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1 container mx-auto px-4 py-12">Wird geladen…</main>
        <Footer />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Nav />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-2">Kein Zugriff</h1>
          <p className="text-muted-foreground">Du hast keine Admin-Rechte.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Produktverwaltung</h1>
          <Link to="/admin/orders"><Button variant="outline" size="sm">Bestellungen</Button></Link>
        </div>

        <form onSubmit={onSubmit} className="border border-border rounded-lg p-5 mb-10 space-y-4">
          <h2 className="text-xl font-semibold">{editing ? `Bearbeiten: ${form.id}` : "Neues Produkt anlegen"}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Produktname *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>ID (Slug) — leer = automatisch</Label>
              <Input value={form.id} disabled={editing} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="ornek-urun-id" />
            </div>
            <div>
              <Label>Tip</Label>
              <select className="w-full bg-background border border-border rounded px-3 py-2"
                value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
                <option value="supplement">Supplement</option>
                <option value="apparel">Giyim</option>
              </select>
            </div>
            <div>
              <Label>Kategori (slug)</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="carbs, protein, creatine..." />
            </div>
            <div>
              <Label>Kategori Etiketi</Label>
              <Input value={form.category_label} onChange={(e) => setForm({ ...form, category_label: e.target.value })} />
            </div>
            <div>
              <Label>Untertitel</Label>
              <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="1000g · Aroma" />
            </div>
            <div>
              <Label>Fiyat (TL)</Label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Streichpreis (€)</Label>
              <Input type="number" value={form.original_price ?? ""} onChange={(e) => setForm({ ...form, original_price: e.target.value ? Number(e.target.value) : null })} />
            </div>
            <div>
              <Label>Etiket (Badge)</Label>
              <Input value={form.badge ?? ""} onChange={(e) => setForm({ ...form, badge: e.target.value || null })} placeholder="Launch-Rabatt" />
            </div>
            <div>
              <Label>Sortierung</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Geschmacksrichtungen (Komma)</Label>
              <Input value={(form.flavors ?? []).join(", ")} onChange={(e) => setForm({ ...form, flavors: e.target.value.split(",").map((s) => s.trim()) })} />
            </div>
            <div>
              <Label>Gewicht (Komma)</Label>
              <Input value={(form.weights ?? []).join(", ")} onChange={(e) => setForm({ ...form, weights: e.target.value.split(",").map((s) => s.trim()) })} />
            </div>
          </div>

          <div>
            <Label>Beschreibung</Label>
            <Textarea rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Bild *</Label>
              <div className="flex gap-2 items-center">
                <input ref={imgRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "image")} />
                <Button type="button" variant="outline" onClick={() => imgRef.current?.click()} disabled={uploading === "image"}>
                  {uploading === "image" ? "Wird hochgeladen..." : "Bild hochladen"}
                </Button>
                {form.image && <img src={form.image} alt="" className="h-12 w-12 object-cover rounded border border-border" />}
              </div>
              <Input className="mt-2" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="oder URL einfügen" />
            </div>
            <div>
              <Label>Video (opsiyonel)</Label>
              <div className="flex gap-2 items-center">
                <input ref={vidRef} type="file" accept="video/*" hidden onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], "video")} />
                <Button type="button" variant="outline" onClick={() => vidRef.current?.click()} disabled={uploading === "video"}>
                  {uploading === "video" ? "Wird hochgeladen..." : "Video hochladen"}
                </Button>
                {form.video && <span className="text-xs text-muted-foreground truncate max-w-[200px]">{form.video.split("/").pop()}</span>}
              </div>
              <Input className="mt-2" value={form.video ?? ""} onChange={(e) => setForm({ ...form, video: e.target.value || null })} placeholder="oder URL einfügen" />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit">{editing ? "Aktualisieren" : "Hinzufügen"}</Button>
            {editing && <Button type="button" variant="outline" onClick={resetForm}>Abbrechen</Button>}
          </div>
        </form>

        <h2 className="text-xl font-semibold mb-3">Vorhandene Produkte ({rows.length})</h2>
        {rows.length === 0 ? (
          <p className="text-muted-foreground">Noch keine Produkte im Panel angelegt.</p>
        ) : (
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-3 py-2">Bild</th>
                  <th className="px-3 py-2">Ad</th>
                  <th className="px-3 py-2">Kategori</th>
                  <th className="px-3 py-2 text-right">Fiyat</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-3 py-2"><img src={r.image} alt="" className="h-10 w-10 object-cover rounded" /></td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.id}</div>
                    </td>
                    <td className="px-3 py-2">{r.category_label}</td>
                    <td className="px-3 py-2 text-right">{r.price} €</td>
                    <td className="px-3 py-2 text-right space-x-2 whitespace-nowrap">
                      <Button size="sm" variant="outline" onClick={() => onEdit(r)}>Bearbeiten</Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(r.id)}>Löschen</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
