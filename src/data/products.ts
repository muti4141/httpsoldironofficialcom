export type Product = {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  type: "apparel" | "supplement";
  price: number;
  image: string;
  video?: string;
  badge?: string;
  description: string;
  subtitle: string;
  flavors?: string[];
  weights?: string[];
  servings?: number;
  originalPrice?: number;
};

// Güvenilir fallback görseller (görsel yüklenemeyince gösterilir)
export const APPAREL_PLACEHOLDER = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80";
export const SUPPLEMENT_PLACEHOLDER = "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80";

export const products: Product[] = [
  // ── GİYİM ────────────────────────────────────────────────────────────────────
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
    image: "https://oldironsupplement.com/assets/products/whey-choco.webp",
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
    image: "https://oldironsupplement.com/assets/products/creatine.webp",
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
    image: "https://oldironsupplement.com/assets/products/pre-workout.webp",
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
    image: "https://oldironsupplement.com/assets/products/bcaa.webp",
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
