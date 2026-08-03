export type Product = {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  type: "apparel" | "supplement";
  price: number;
  image: string;
  video?: string;
  videoPoster?: string;
  gallery?: string[];
  badge?: string;
  description: string;
  subtitle: string;
  flavors?: string[];
  weights?: string[];
  servings?: number;
  originalPrice?: number;
  outOfStock?: boolean;
};

// Güvenilir fallback görseller (görsel yüklenemeyince gösterilir)
export const APPAREL_PLACEHOLDER = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80";
export const SUPPLEMENT_PLACEHOLDER = "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80";

export const products: Product[] = [
  // ── GİYİM ────────────────────────────────────────────────────────────────────
  {
    id: "champion-mentality-atlet",
    name: "Champion Mentality Atlet",
    category: "tops",
    categoryLabel: "Üst Giyim",
    type: "apparel",
    price: 400,
    originalPrice: 600,
    image: "/images/products/elite1/f-1.jpg",
    gallery: [
      "/images/products/elite1/f-1.jpg",
      "/images/products/elite1/f-2.jpg",
      "/images/products/elite1/f-3.jpg",
      "/images/products/elite1/f-4.jpg",
      "/images/products/elite1/f-5.jpg",
      "/images/products/elite1/f-6.jpg",
    ],
    video: "/videos/elite1.mp4",
    videoPoster: "/images/products/elite1/f-1.jpg",
    badge: "Yeni",
    subtitle: "Racerback Kesim · Sırt Baskılı",
    description: "Old Iron'ın en premium atleti. Nefes alan ağır pamuk karışımı kumaş, derin racerback kesim ile omuz ve sırt kaslarına tam özgürlük tanır. Sırtında yer alan 'Champion Mentality' baskısı, her tekrarda hatırlatır: şampiyonluk bir zihniyettir. Göğüste işlemeli Old Iron logosu, belde uyumlu şort setiyle bütünleşik premium görünüm. Salonun en zorlu setlerinde bile formunu ve şıklığını koruyan, terlemeye dayanıklı kumaş yapısı.",
  },
  {
    id: "bordo-racerback-atlet",
    name: "Bordo Racerback Atlet",
    category: "tops",
    categoryLabel: "Üst Giyim",
    type: "apparel",
    price: 400,
    originalPrice: 600,
    image: "/images/products/elite2/f-1.jpg",
    gallery: [
      "/images/products/elite2/f-1.jpg",
      "/images/products/elite2/f-2.jpg",
      "/images/products/elite2/f-3.jpg",
      "/images/products/elite2/f-4.jpg",
      "/images/products/elite2/f-5.jpg",
      "/images/products/elite2/f-6.jpg",
    ],
    video: "/videos/elite2.mp4",
    videoPoster: "/images/products/elite2/f-1.jpg",
    badge: "Yeni",
    subtitle: "Racerback Kesim · Bordo",
    description: "Derin bordo tonuyla Old Iron'ın en zarif atleti. Yumuşak dokulu, hafif ve nefes alan premium kumaş; racerback kesimiyle sırt ve omuz hareketine tam serbestlik sağlar. Göğüste minimal Old Iron logosu, belde uyumlu şort setiyle tamamlanan sade ve güçlü bir siluet. Ter emici yapısı sayesinde en yoğun antrenmanlarda bile ferahlığını korur — form kadar konforu da önemseyenler için tasarlandı.",
  },
  {
    id: "kolsuz-tee-burak",
    name: "Kolsuz Oversize Tee",
    category: "tops",
    categoryLabel: "Üst Giyim",
    type: "apparel",
    price: 500,
    image: "/images/products/burak/aci-1.jpg",
    gallery: [
      "/images/products/burak/aci-1.jpg",
      "/images/products/burak/aci-2.jpg",
      "/images/products/burak/aci-3.jpg",
      "/images/products/burak/aci-4.jpg",
      "/images/products/burak/aci-5.jpg",
      "/images/products/burak/aci-6.jpg",
    ],
    video: "/videos/burak.mp4",
    videoPoster: "/images/products/burak/aci-1.jpg",
    badge: "Yeni",
    subtitle: "Kesik Kol · Ağır Pamuk",
    description: "Derin kol açıklığı, ağır gramaj pamuk. Salonda maksimum hareket özgürlüğü ve pump'ı gösteren oversize kesim.",
  },
];

export const findProduct = (id: string) => products.find((p) => p.id === id);

/** Yalnızca sunucuda gerçekten bulunan yerel videoları döndürür.
 *  Eski Lovable yolları (/__l5e/...) sunucuda yok, oynatılmamalı. */
export const usableVideo = (p: Product): string | undefined =>
  p.video && p.video.startsWith("/videos/") ? p.video : undefined;
