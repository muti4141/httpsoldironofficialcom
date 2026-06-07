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

export const products: Product[] = [
  {
    id: "iron-tee",
    name: "Oversized Tee 'Iron'",
    category: "tops",
    categoryLabel: "Oberteile",
    type: "apparel",
    price: 49.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDoX_FBqhWDcebtTIAaXVwx8QkcSXLMNKBE2Cd1hUndxKSrsAZxlGpx57gDLcccigHC--sYKhCjYwQuy8uXi5U_envAlkMjJH1hvkyfkh2yHRZ5YLwuUiZ9hsiAFvJIApi7yOmwKR1DfDY0jQtk_ss9wOcK2rQx9IH2pNSgbI-z3JcqgZO3yZha5_2FNtdp5GLlt1bzme8ntTjmsT9cUDQFOlj4jfyqZc6ZNZ6DWk7xFsPmP8NrHDDh5SCjWNn-eSLE53edCKaXnCA",
    video: "/videos/iron-tee.mp4",
    badge: "Bestseller",
    subtitle: "Heavy Cotton Oversized",
    description: "Der ultimative Pump-Cover. Gefertigt aus schwerer 300gsm Baumwolle für maximale Strapazierfähigkeit und Komfort. Designed für Athleten, die im Gym keine Kompromisse eingehen.",
  },

  {
    id: "stringer-hustle",
    name: "Stringer 'Hustle'",
    category: "tops",
    categoryLabel: "Oberteile",
    type: "apparel",
    price: 34.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBA7JSDohkLHUhKePu-LuIVNjGeTG1uYVf6nspubBNi9mlYsprcF3GjlOvdmyTLysZxHjBb-jEA7uruUipLPmji-jbYSzwQlcP8JTcIMxLMdNanExU7CXE0lCWBgSaYxMUMW03EhMPQtUn_9TgPmMM294MKsqhVCibWW_wqIMJ_lYYYWSAjKcUr5Hgi9qJQQhCMvdioPfVPwMGhHIBMZ-dyOPu9h373c-MIsoxtvFgSJd-uCQbcKD-c_ZrC5w8Ksv_7GHHIwQG8n6I",
    video: "/videos/stringer-hustle.mp4",
    subtitle: "Classic Cut Charcoal",
    description: "Tiefer Armausschnitt. Schwerer Stoff. Maximale Bewegungsfreiheit im Gym.",
  },
  {
    id: "training-shorts",
    name: "Training Shorts V1",
    category: "bottoms",
    categoryLabel: "Unterteile",
    type: "apparel",
    price: 39.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrUGSqZ9Mmzuu8hLddfgdojjLItJS90S0EkR0AlYJflc0VSBPhiJ_pq9w-B4tEoal4xFd-NRYnJka3nGavfhXEQzM7YS2CcOj2uDeYqfIfEiOjy87UgOFWd_NMfZOSzvhlQvMSnPwCdDpgeh75eNNsDJgv13SOQn3HNmboPyAjPcvW4PzDH974-r2B_8cxmPlPnzSypOFfzEbKuwbiH6WGZKzSxWRkTilikxYo7_oPwcNc-6k-pZkr64Xfvg-HjryD3TFqV9nIDwI",
    subtitle: "Blackout Edition",
    description: "Premium Mesh. Mattes silbernes Branding. Für brutale Sessions geschnitten.",
  },
  {
    id: "oversized-hoodie",
    name: "Oversized Hoodie",
    category: "tops",
    categoryLabel: "Oberteile",
    type: "apparel",
    price: 74.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiX4X-GHLErKszBNvw9XiXXFwd_iMv23Q9b0lNevyheUOSbltGKfbBCp8IQ5Yo0vjdsToZdpvAFB8Dv3A38KsAxysqdB45PDHpbNppE1efO2SSJvmN5sb46pqT2juFCnv6e6porgAclfg_1zCpGe1tNUUCTzYb8Fm_tLZlikpm7PzK8P6YOVioNsNEULzJNCWa4Fx0rLoWyEWoP1KfbeHuelSNJEDJhr-18xmT01rONoOnj3bxDRlBJvVd5z2Ltcg7cP5I6OrLdqY",
    subtitle: "Heavyweight Charcoal",
    description: "300gsm Baumwolle. Drop-Shoulder. Kangaroo-Pocket. Der wärmste Schatten im Gym.",
  },
  {
    id: "steel-bag",
    name: "Steel Bag 40L",
    category: "accessories",
    categoryLabel: "Accessoires",
    type: "apparel",
    price: 89.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuArgCwVx3sGVn_vhkOvzn-wsXWtbCj6AtlU_-eRbqt8ypI2MK3lhsAPxmj9EYjlcVhchrQ8GeiFDCotObBFqVKqL5SHlDc9HCdJpjytjo4NEWEGt3Hdm5MKhz5T8oFoP6xeQoD1BLaVy9kzWu8GxxLAxr0NCnay_57F-iQA_1SkL07DNB9u3lSf61STm_kHvMENEj--CNMlLMcJIqBYalS8PW2h0swCCXOv5hdblcm4PaWR4wDRE17fqJvPhJYoYgOPC8UN2UcOP2A",
    badge: "Bestseller",
    subtitle: "Industrial Duffle",
    description: "40 Liter. Verstärkte Nähte. Chromhardware. Für jede Session und jede Reise.",
  },
  {
    id: "lifting-straps",
    name: "Lifting Straps Pro",
    category: "accessories",
    categoryLabel: "Training",
    type: "apparel",
    price: 19.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUo33pj-kBNshGtcXKdYPOrMrKPfZl8CMBLg1uulOwvSx__z885QyrtzD1O3mPfyOHxNcCWF3DxE6IqDrTOT3rzQLPWtumHlGCZEZEa86E-nchgwmjzPYULwfnl25m-CeDtJ9SdpoAi1lw0uIisUQFqtk9_YcbSMsaMakrnTjrY8HPQtRIKnawwDeGzRRvChHtBicfjczERejFwUlBO3Mjhz5QLD0dbAHzId6iEnmMGkkzcCbMxw9azDk3bK654YEdHqFboAVNmd8",
    subtitle: "Reinforced Canvas",
    description: "Verstärkter Canvas. Matte Hardware. Halten, wenn du loslassen willst.",
  },

  // ── SUPPLEMENTS — oldironsupplement.com ────────────────────────────────────
  {
    id: "whey-protein",
    name: "Whey Protein",
    category: "protein",
    categoryLabel: "Protein",
    type: "supplement",
    badge: "Bestseller",
    price: 27.9,
    originalPrice: 47.9,
    image: "https://oldironsupplement.com/assets/products/whey-choco.webp",
    subtitle: "420g · 14 Servings",
    servings: 14,
    weights: ["420g"],
    flavors: ["Çikolata", "White Choco"],
    description: "Whey Concentrate · 24g Protein pro Serving · Micro-filtriert · Berlin Formulierung. ISO 17025 laborgeprüft. Zertifiziertes Batch 26-04.",
  },
  {
    id: "creatine",
    name: "Creatine",
    category: "creatine",
    categoryLabel: "Kreatin",
    type: "supplement",
    price: 17.9,
    originalPrice: 23.9,
    image: "https://oldironsupplement.com/assets/products/creatine.webp",
    subtitle: "200g · 66 Servings",
    servings: 66,
    weights: ["200g"],
    flavors: ["Unflavored"],
    description: "Pure Creatine Monohydrate · 3g pro Serving · Mikronisiert für maximale Löslichkeit. Die am besten erforschte Substanz im Kraftsport. Made in Germany.",
  },
  {
    id: "pre-workout",
    name: "Pre-Workout",
    category: "preworkout",
    categoryLabel: "Pre-Workout",
    type: "supplement",
    badge: "Neu",
    price: 44.9,
    originalPrice: 47.9,
    image: "https://oldironsupplement.com/assets/products/pre-workout.webp",
    subtitle: "300g · 30 Servings",
    servings: 30,
    weights: ["300g"],
    flavors: ["Bubble Gum"],
    description: "300mg Koffein · 3g Beta-Alanin · 6g L-Citrullin · 500mg L-Tyrosin. Drei Wirkpfade: Stimulanz, Puffer, Stickstoffoxid. EU-konform. Made in Berlin.",
  },
  {
    id: "bcaa-4001",
    name: "BCAA 4001",
    category: "aminoacids",
    categoryLabel: "Aminosäuren",
    type: "supplement",
    price: 29.9,
    originalPrice: 35.9,
    image: "https://oldironsupplement.com/assets/products/bcaa.webp",
    subtitle: "300g · 30 Servings",
    servings: 30,
    weights: ["300g"],
    flavors: ["Blueberry"],
    description: "Leucin · Isoleucin · Valin im 4:1:1 Verhältnis. Optimaler Muskelschutz und Regeneration — während und nach dem Training. Laborgeprüft.",
  },
  {
    id: "glutamine",
    name: "Glutamine",
    category: "aminoacids",
    categoryLabel: "Aminosäuren",
    type: "supplement",
    price: 20.9,
    originalPrice: 25.9,
    image: "https://oldironsupplement.com/assets/products/glutamine.webp",
    subtitle: "200g · 40 Servings",
    servings: 40,
    weights: ["200g"],
    flavors: ["Unflavored"],
    description: "L-Glutamin · 5g pro Serving · Reine Pharmaqualität. Unterstützt Darmgesundheit, Immunsystem und Muskelregeneration nach intensiven Einheiten.",
  },
  {
    id: "thermo-shred",
    name: "Thermo Shred",
    category: "thermo",
    categoryLabel: "Thermo & Energy",
    type: "supplement",
    price: 34.9,
    originalPrice: 43.9,
    image: "https://oldironsupplement.com/assets/products/thermo-shred.webp",
    subtitle: "225g · 66 Servings",
    servings: 66,
    weights: ["225g"],
    flavors: ["Blueberry"],
    description: "L-Carnitin basiertes Thermo Energy System · Unterstützt Fettverbrennung und Ausdauer. Ideal für Cutting-Phasen und Cardio-Sessions.",
  },
];

export const findProduct = (id: string) => products.find((p) => p.id === id);
