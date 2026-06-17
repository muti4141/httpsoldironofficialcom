const BCAA_IMAGE_URL = "/__l5e/assets-v1/d9b7bf9b-7d6f-4330-9794-16a9b21f03f8/bcaa-411.png";
const BCAA_VIDEO_POSTER_URL = "/__l5e/assets-v1/dc356a34-f697-42b3-903d-e34278b77bf3/bcaa-end.png";
const WHEY_IMAGE_URL = "/__l5e/assets-v1/f6a99693-2d04-4361-8e10-1b73b8be9135/whey-end.webp";
const WHEY_VIDEO_URL = "/__l5e/assets-v1/f1f4f8a4-db61-4f8f-b33b-81ac33dff932/whey-video.mp4";
const CREATINE_IMAGE_URL = "/__l5e/assets-v1/a8606e6f-b439-4814-b4a4-81d72b8087ff/creatine-end.webp";
const CREATINE_VIDEO_URL = "/__l5e/assets-v1/69dc1567-5d43-4d9e-bee5-2a6657dc17e0/creatine-video.mp4";
const PREWORKOUT_IMAGE_URL = "/__l5e/assets-v1/6b16ce07-1744-402a-8297-491e7c678294/preworkout-end.webp";
const PREWORKOUT_VIDEO_URL = "/__l5e/assets-v1/01afe5ed-6c0a-428e-80c0-cf56e933a3f1/preworkout-video.mp4";
const CREAM_OF_RICE_IMAGE_URL = "/__l5e/assets-v1/563bacd5-9b03-4136-9f83-86f926951ad9/cream-of-rice.jpg";
const CREAM_OF_RICE_VIDEO_URL = "/__l5e/assets-v1/00b82bcc-36c9-4061-89fb-aaa1bf12399d/cream-of-rice.mp4";

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
  badge?: string;
  description: string;
  subtitle: string;
  flavors?: string[];
  weights?: string[];
  servings?: number;
  originalPrice?: number;
  freeShipping?: boolean;
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
  {
    id: "cream-of-rice",
    name: "Cream of Rice",
    category: "carbs",
    categoryLabel: "Pirinç Unu",
    type: "supplement",
    badge: "Lansman İndirimi",
    price: 280,
    originalPrice: 400,
    image: CREAM_OF_RICE_IMAGE_URL,
    video: CREAM_OF_RICE_VIDEO_URL,
    videoPoster: CREAM_OF_RICE_IMAGE_URL,
    subtitle: "1000g · Bitter Çikolata",
    servings: 20,
    weights: ["1000g"],
    flavors: ["Bitter Çikolata"],
    description: "Bitter Aromalı Pirinç Unu\n\nLezzet ve kaliteyi bir araya getiren OLD IRON Bitter Aromalı Pirinç Unu, sporcular ve sağlıklı beslenmeyi tercih edenler için özel olarak geliştirilmiştir. İnce öğütülmüş pirinç unu ile yoğun bitter çikolata aromasının mükemmel uyumunu sunar.\n\nKahvaltılarınızda, ara öğünlerinizde ve tariflerinizde kolayca kullanabileceğiniz bu ürün; pankek, kek, kurabiye, muhallebi ve protein tariflerine eşsiz bir tat kazandırır. Kolay karışan yapısı sayesinde pürüzsüz bir kıvam elde etmenize yardımcı olur.\n\nÖne Çıkan Özellikler:\n- Gluten içermez\n- Yoğun ve lezzetli bitter çikolata aroması\n- İnce öğütülmüş kaliteli pirinç unu\n- Pankek, kek ve fit tarifler için ideal\n- Kolay karışım ve yumuşak doku\n- Günün her saatinde pratik kullanım\n\nBitter çikolatanın eşsiz aromasıyla hazırlanan tariflerinize lezzet katın, enerjinizi destekleyen enfes öğünler hazırlayın.",
  },
  {
    id: "cream-of-rice-cookies",
    name: "Cream of Rice - Kurabiye Krema",
    category: "carbs",
    categoryLabel: "Pirinç Unu",
    type: "supplement",
    badge: "Lansman İndirimi",
    price: 280,
    originalPrice: 400,
    image: "/__l5e/assets-v1/bc21d250-4fa0-45fd-9cec-8f272ef9d7b0/cream-of-rice-cookies.jpg",
    subtitle: "1000g · Kurabiye Krema",
    servings: 20,
    weights: ["1000g"],
    flavors: ["Kurabiye Krema"],
    description: "Kurabiye Krema Aromalı Pirinç Unu\n\nOLD IRON Kurabiye Krema Aromalı Pirinç Unu, sporcular ve sağlıklı beslenmeyi tercih edenler için özel olarak geliştirilmiştir. İnce öğütülmüş pirinç unu ile kurabiye krema aromasının eşsiz uyumunu sunar.\n\nKahvaltılarınızda, ara öğünlerinizde ve tariflerinizde kolayca kullanabileceğiniz bu ürün; pankek, kek, muhallebi ve protein tariflerine lezzet katar.\n\nÖne Çıkan Özellikler:\n- Gluten içermez\n- Yoğun kurabiye krema aroması\n- İnce öğütülmüş kaliteli pirinç unu\n- Pankek, kek ve fit tarifler için ideal\n- Kolay karışım ve yumuşak doku",
  },
  {
    id: "cream-of-rice-white-orange",
    name: "Cream of Rice - Beyaz Çikolata & Portakal",
    category: "carbs",
    categoryLabel: "Pirinç Unu",
    type: "supplement",
    badge: "Lansman İndirimi",
    price: 280,
    originalPrice: 400,
    image: "/__l5e/assets-v1/c647a59e-0ca8-4129-bfc6-0eedd6b07335/cream-of-rice-white-orange.jpg",
    subtitle: "1000g · Beyaz Çikolata & Portakal",
    servings: 20,
    weights: ["1000g"],
    flavors: ["Beyaz Çikolata & Portakal"],
    description: "Beyaz Çikolata & Portakal Aromalı Pirinç Unu\n\nOLD IRON Beyaz Çikolata & Portakal Aromalı Pirinç Unu, sporcular ve sağlıklı beslenmeyi tercih edenler için özel olarak geliştirilmiştir. İnce öğütülmüş pirinç unu ile beyaz çikolata ve portakalın ferah uyumunu sunar.\n\nKahvaltılarınızda, ara öğünlerinizde ve tariflerinizde kolayca kullanabileceğiniz bu ürün; pankek, kek, muhallebi ve protein tariflerine eşsiz bir tat kazandırır.\n\nÖne Çıkan Özellikler:\n- Gluten içermez\n- Beyaz çikolata ve portakal aromasının eşsiz uyumu\n- İnce öğütülmüş kaliteli pirinç unu\n- Pankek, kek ve fit tarifler için ideal\n- Kolay karışım ve yumuşak doku",
  },
  {
    id: "test-1tl",
    name: "Test Ürünü (1₺)",
    category: "test",
    categoryLabel: "Test",
    type: "supplement",
    price: 1,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    subtitle: "Ödeme testi için — kargo ücretsiz",
    weights: ["Test"],
    flavors: ["Test"],
    description: "Iyzico ödeme akışı testi için 1₺'lik ürün. Sadece bu ürün sepetteyse kargo ücretsizdir.",
    freeShipping: true,
  },
];

export const findProduct = (id: string) => products.find((p) => p.id === id);
