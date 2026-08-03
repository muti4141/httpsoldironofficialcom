const BCAA_IMAGE_URL = "/__l5e/assets-v1/d9b7bf9b-7d6f-4330-9794-16a9b21f03f8/bcaa-411.png";
const BCAA_VIDEO_POSTER_URL = "/__l5e/assets-v1/dc356a34-f697-42b3-903d-e34278b77bf3/bcaa-end.png";
const WHEY_IMAGE_URL = "/__l5e/assets-v1/f6a99693-2d04-4361-8e10-1b73b8be9135/whey-end.webp";
const WHEY_VIDEO_URL = "/__l5e/assets-v1/f1f4f8a4-db61-4f8f-b33b-81ac33dff932/whey-video.mp4";
const CREATINE_IMAGE_URL = "/__l5e/assets-v1/a8606e6f-b439-4814-b4a4-81d72b8087ff/creatine-end.webp";
const CREATINE_VIDEO_URL = "/__l5e/assets-v1/69dc1567-5d43-4d9e-bee5-2a6657dc17e0/creatine-video.mp4";
const PREWORKOUT_IMAGE_URL = "/__l5e/assets-v1/6b16ce07-1744-402a-8297-491e7c678294/preworkout-end.webp";
const PREWORKOUT_VIDEO_URL = "/__l5e/assets-v1/01afe5ed-6c0a-428e-80c0-cf56e933a3f1/preworkout-video.mp4";

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
  {
    id: "iron-tee",
    name: "Oversize Tee 'Iron'",
    category: "tops",
    categoryLabel: "Üst Giyim",
    type: "apparel",
    price: 849,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
    video: "/videos/iron-tee.mp4",
    badge: "Bestseller",
    subtitle: "Ağır Pamuk Oversize",
    description: "Nihai Pump Cover. 300gsm ağır pamuktan üretilmiş, maksimum dayanıklılık ve konfor için. Spor salonunda uzlaşma tanımayan sporcular için tasarlandı.",
    outOfStock: true,
  },
  {
    id: "stringer-hustle",
    name: "Stringer 'Hustle'",
    category: "tops",
    categoryLabel: "Üst Giyim",
    type: "apparel",
    price: 599,
    image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80",
    video: "/videos/stringer-hustle.mp4",
    subtitle: "Klasik Kesim Antrasit",
    description: "Derin kol açıklığı. Ağır kumaş. Spor salonunda maksimum hareket özgürlüğü.",
    outOfStock: true,
  },
  {
    id: "training-shorts",
    name: "Antrenman Şortu V1",
    category: "bottoms",
    categoryLabel: "Alt Giyim",
    type: "apparel",
    price: 649,
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
    subtitle: "Blackout Edisyon",
    description: "Premium mesh kumaş. Mat gümüş baskı. Sert antrenmanlar için kesilmiş.",
  },
  {
    id: "oversized-hoodie",
    name: "Oversize Hoodie",
    category: "tops",
    categoryLabel: "Üst Giyim",
    type: "apparel",
    price: 1199,
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
    subtitle: "Ağır Antrasit",
    description: "300gsm pamuk. Düşük omuz kesimi. Kanguru cep. Spor salonunun en sıcak gölgesi.",
  },
  {
    id: "steel-bag",
    name: "Steel Çanta 40L",
    category: "accessories",
    categoryLabel: "Aksesuar",
    type: "apparel",
    price: 1499,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    badge: "Bestseller",
    subtitle: "Endüstriyel Spor Çantası",
    description: "40 litre. Güçlendirilmiş dikişler. Krom donanım. Her antrenman ve her yolculuk için.",
  },
  {
    id: "lifting-straps",
    name: "Lifting Straps Pro",
    category: "accessories",
    categoryLabel: "Aksesuar",
    type: "apparel",
    price: 349,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80",
    subtitle: "Güçlendirilmiş Kanvas",
    description: "Güçlendirilmiş kanvas. Mat donanım. Bırakmak istediğinde bile tutar.",
  },

  // ── SUPPLEMENT — oldironsupplement.com ───────────────────────────────────────
  {
    id: "whey-protein",
    name: "Whey Protein",
    category: "protein",
    categoryLabel: "Protein",
    type: "supplement",
    badge: "Bestseller",
    price: 580,
    originalPrice: 1000,
    image: WHEY_IMAGE_URL,
    video: WHEY_VIDEO_URL,
    videoPoster: WHEY_IMAGE_URL,
    subtitle: "420g · 14 Porsiyon",
    servings: 14,
    weights: ["420g"],
    flavors: ["Çikolata", "White Choco"],
    description: "Whey Konsantrat · Porsiyon başına 24g Protein · Mikro-filtreli · ISO 17025 akredite laboratuvar onaylı. Her porsiyonda 2g karbonhidrat, 1.5g yağ. Süt ve soya içerir.",
  },
  {
    id: "creatine",
    name: "Creatine",
    category: "creatine",
    categoryLabel: "Kreatin",
    type: "supplement",
    price: 360,
    originalPrice: 480,
    image: CREATINE_IMAGE_URL,
    video: CREATINE_VIDEO_URL,
    videoPoster: CREATINE_IMAGE_URL,
    subtitle: "200g · 44 Porsiyon",
    servings: 44,
    weights: ["200g"],
    flavors: ["Aromasız"],
    description: "Saf Kreatin Monohidrat · Porsiyon başına 3g · Maksimum çözünürlük için mikronize edilmiş. Sporda en çok araştırılan madde. Güç, hacim ve toparlanmayı destekler.",
  },
  {
    id: "pre-workout",
    name: "Pre-Workout",
    category: "preworkout",
    categoryLabel: "Pre-Workout",
    type: "supplement",
    badge: "Yeni",
    price: 950,
    originalPrice: 1005,
    image: PREWORKOUT_IMAGE_URL,
    video: PREWORKOUT_VIDEO_URL,
    videoPoster: PREWORKOUT_IMAGE_URL,
    subtitle: "300g · 30 Porsiyon",
    servings: 30,
    weights: ["300g"],
    flavors: ["Bubble Gum"],
    description: "300mg Kafein · 3g Beta-Alanin · 6g L-Sitrülin · 500mg L-Tirozin. Üç etki mekanizması: uyarıcı, tampon, nitrik oksit. Antrenmanın 20-30 dk öncesinde tüket.",
  },
  {
    id: "bcaa-4001",
    name: "BCAA 4001",
    category: "aminoacids",
    categoryLabel: "Amino Asit",
    type: "supplement",
    price: 625,
    originalPrice: 750,
    image: BCAA_IMAGE_URL,
    video: "/__l5e/assets-v1/82cc687e-8a6b-4241-a163-be2be209ab5e/bcaa-video.mp4",
    videoPoster: BCAA_VIDEO_POSTER_URL,
    subtitle: "300g · 30 Porsiyon",
    servings: 30,
    weights: ["300g"],
    flavors: ["Yaban Mersini"],
    description: "Lösin · İzolösin · Valin 4:1:1 oranında. Antrenman sırasında ve sonrasında optimal kas koruması ve toparlanma. Lab onaylı, yüksek saflıkta.",
  },
  {
    id: "glutamine",
    name: "Glutamine",
    category: "aminoacids",
    categoryLabel: "Amino Asit",
    type: "supplement",
    price: 435,
    originalPrice: 525,
    image: "https://oldironsupplement.com/assets/products/glutamine.webp",
    subtitle: "200g · 40 Porsiyon",
    servings: 40,
    weights: ["200g"],
    flavors: ["Aromasız"],
    description: "L-Glutamin · Porsiyon başına 5g · Eczane kalitesi. Bağırsak sağlığını, bağışıklık sistemini ve yoğun antrenmanlardan sonra kas iyileşmesini destekler.",
  },
  {
    id: "thermo-shred",
    name: "Thermo Shred",
    category: "thermo",
    categoryLabel: "Thermo & Enerji",
    type: "supplement",
    price: 720,
    originalPrice: 900,
    image: "https://oldironsupplement.com/assets/products/thermo-shred.webp",
    subtitle: "225g · 66 Porsiyon",
    servings: 66,
    weights: ["225g"],
    flavors: ["Yaban Mersini"],
    description: "L-Karnitin tabanlı Thermo Enerji Sistemi. Yağ yakımını ve dayanıklılığı destekler. Cutting dönemleri ve kardiyo seansları için ideal.",
  },
];

export const findProduct = (id: string) => products.find((p) => p.id === id);

/** Yalnızca sunucuda gerçekten bulunan yerel videoları döndürür.
 *  Eski Lovable yolları (/__l5e/...) sunucuda yok, oynatılmamalı. */
export const usableVideo = (p: Product): string | undefined =>
  p.video && p.video.startsWith("/videos/") ? p.video : undefined;
