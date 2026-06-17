import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { products as staticProducts, type Product } from "@/data/products";

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

function rowToProduct(r: Row): Product {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    categoryLabel: r.category_label,
    type: r.type,
    price: r.price,
    originalPrice: r.original_price ?? undefined,
    image: r.image,
    video: r.video ?? undefined,
    videoPoster: r.video_poster ?? undefined,
    badge: r.badge ?? undefined,
    subtitle: r.subtitle,
    description: r.description,
    flavors: r.flavors ?? undefined,
    weights: r.weights ?? undefined,
    servings: r.servings ?? undefined,
    freeShipping: r.free_shipping,
  };
}

export function useDbProducts() {
  return useQuery({
    queryKey: ["admin_products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("admin_products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as Row[]).map(rowToProduct);
    },
    staleTime: 30_000,
  });
}

export function useAllProducts(): Product[] {
  const { data } = useDbProducts();
  if (!data || data.length === 0) return staticProducts;
  const staticIds = new Set(staticProducts.map((p) => p.id));
  const extras = data.filter((p) => !staticIds.has(p.id));
  return [...staticProducts, ...extras];
}

export function findAnyProduct(id: string, all: Product[]): Product | undefined {
  return all.find((p) => p.id === id);
}
