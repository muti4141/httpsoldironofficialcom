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

  // ── SUPPLEMENT ──────────────────────────────────────────────────────────────
  {
    id: "old-iron-diuretic",
    name: "Elite Supplement Diuretic",
    category: "supplement",
    categoryLabel: "Elite Supplement",
    type: "supplement",
    price: 1400,
    image: "/images/products/supplements/diuretic.jpg",
    gallery: ["/images/products/supplements/diuretic.jpg"],
    subtitle: "Standardize Bitkisel Ekstrakt · 80 Kapsül",
    description: "Güçlü bitkisel diüretik formül — fazla su tutulumunu azaltır, şişkinliği minimuma indirir ve sahne/foto öncesi net, kesik bir görünüm için tasarlanmıştır. Standardize bitkisel ekstraktlarla desteklenmiş, güçlü kilo kaybı desteği sağlar.",
    servings: 80,
  },
  {
    id: "old-iron-zero-hunger",
    name: "Elite Supplement Zero Hunger",
    category: "supplement",
    categoryLabel: "Elite Supplement",
    type: "supplement",
    price: 1380,
    image: "/images/products/supplements/zero-hunger.jpg",
    gallery: ["/images/products/supplements/zero-hunger.jpg"],
    subtitle: "İştah Bastırıcı · 30 Kapsül",
    description: "Bitkisel ekstraktlar sayesinde iştahı bastırır ve iç organların onarımını destekler. İştahı tamamen bastıran özel formülüyle diyet döneminde açlık hissini kontrol altında tutmanı sağlar.",
    servings: 30,
  },
  {
    id: "old-iron-testo-booster",
    name: "Elite Supplement Testo-Booster",
    category: "supplement",
    categoryLabel: "Elite Supplement",
    type: "supplement",
    price: 1200,
    image: "/images/products/supplements/testo-booster.jpg",
    gallery: ["/images/products/supplements/testo-booster.jpg"],
    subtitle: "Testosteron Desteği · 30 Tablet",
    description: "Libido desteği, testosteron artırıcı ve enerji artırıcı formül. Aspartik asit, sitrulin malat, çinko, magnezyum, B6 vitamini ve Tribulus içeren kapsamlı bileşimiyle performansını ve enerjini destekler.",
    servings: 30,
  },
  {
    id: "old-iron-pre-workout",
    name: "Elite Supplement Pre-Workout",
    category: "supplement",
    categoryLabel: "Elite Supplement",
    type: "supplement",
    price: 1800,
    image: "/images/products/supplements/pre-workout.jpg",
    gallery: ["/images/products/supplements/pre-workout.jpg"],
    subtitle: "Enerji · Dayanıklılık · Pump",
    description: "3000mg Beta Alanin, 3000mg Kreatin Monohidrat, 6000mg Sitrulin Malat, 2000mg Arginin AKG, 750mg GABA, 400mg Kafein ve elektrolitlerle (Mg, Na, K, Zn) desteklenmiş güçlü pre-workout formülü. Enerji, dayanıklılık ve pump için tasarlandı.",
  },
  {
    id: "old-iron-liver-detox",
    name: "Elite Supplement Liver Detox",
    category: "supplement",
    categoryLabel: "Elite Supplement",
    type: "supplement",
    price: 1300,
    image: "/images/products/supplements/liver-detox.jpg",
    gallery: ["/images/products/supplements/liver-detox.jpg"],
    subtitle: "Karaciğer Desteği · 60 Kapsül",
    description: "Devedikeni (Milk Thistle), Karahindiba Kökü, Zerdeçal ve Enginar Yaprağı içeren gelişmiş detoks ve temizlik formülü. Yoğun kür dönemlerinde karaciğer sağlığını desteklemek için formüle edildi.",
    servings: 60,
  },
  {
    id: "old-iron-yohimbe-bark",
    name: "Elite Supplement Yohimbe Bark Extract",
    category: "supplement",
    categoryLabel: "Elite Supplement",
    type: "supplement",
    price: 1480,
    image: "/images/products/supplements/yohimbe-bark.jpg",
    gallery: ["/images/products/supplements/yohimbe-bark.jpg"],
    subtitle: "Yağ Yakımı · 60 Kapsül",
    description: "Cinsel sağlığı destekler, yağ kaybına yardımcı olur ve zihinsel odaklanmayı artırır. Yohimbe kabuğu ekstraktının güçlü etkisiyle formüle edilmiştir.",
    servings: 60,
  },
  {
    id: "old-iron-ashwagandha",
    name: "Elite Supplement Ashwagandha",
    category: "supplement",
    categoryLabel: "Elite Supplement",
    type: "supplement",
    price: 1440,
    image: "/images/products/supplements/ashwagandha.jpg",
    gallery: ["/images/products/supplements/ashwagandha.jpg"],
    subtitle: "Stres & Mood Desteği · 60 Kapsül",
    description: "Mutluluğu artırır, stres ve ruh hali dengesini destekler, rahatlamaya yardımcı olur. Adaptojen özellikleriyle bilinen Ashwagandha'nın gücüyle formüle edilmiştir.",
    servings: 60,
  },
];

export const findProduct = (id: string) => products.find((p) => p.id === id);

/** Yalnızca sunucuda gerçekten bulunan yerel videoları döndürür.
 *  Eski Lovable yolları (/__l5e/...) sunucuda yok, oynatılmamalı. */
export const usableVideo = (p: Product): string | undefined =>
  p.video && p.video.startsWith("/videos/") ? p.video : undefined;
